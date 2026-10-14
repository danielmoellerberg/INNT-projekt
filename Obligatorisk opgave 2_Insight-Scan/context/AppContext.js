// AppContext: appens fælles data, som alle skærme kan læse.
//
// HVAD ER CONTEXT? (ikke undervist i kurset, derfor ekstra forklaring)
// Normalt sender man data fra en komponent til en anden med props. Når mange skærme skal bruge
// de samme data (fx kvitteringer og cashback-saldo), bliver det besværligt at sende dem gennem
// hele navigationen. Context løser det:
//   1. createContext() laver en "beholder" til data.
//   2. <AppContext.Provider value={...}> lægger data i beholderen. Den ligger yderst i App.js,
//      så alle skærme inden i den kan nå data.
//   3. useContext(AppContext) henter data ud igen i en skærm. Vi har lavet genvejen useApp().
// Når data i Provideren ændres (fx en ny kvittering fra Firebase), tegnes alle skærme, der
// bruger dem, automatisk igen med de nye tal.
//
// HVOR KOMMER DATA FRA?
// - Kvitteringer og tilbud: Firebase Realtime Database, læst live med onValue (mønster fra 05).
// - Præferencer (valgte butikker og notifikationer): AsyncStorage på telefonen (mønster fra 08).

import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ref, onValue, push, update } from "firebase/database";

import { rtdb } from "../database/firebase";

// Faste nøgler til AsyncStorage (mønster fra 08)
const BUTIKKER_NOEGLE = "VALGTE_BUTIKKER";
const INDSTILLINGER_NOEGLE = "INDSTILLINGER";
const STANDARD_INDSTILLINGER = { nyeTilbud: true, paamindScan: true };

// Firebase gemmer lister som objekter: { id1: {...}, id2: {...} }.
// Her laver vi dem om til et array, hvor id'et ligger på hvert element (mønster fra 05).
function tilListe(data) {
  if (!data) return [];
  return Object.keys(data).map((id) => ({ id: id, ...data[id] }));
}

// Gør et varenavn sammenligneligt: små bogstaver og kun bogstaver og tal.
// Så bliver "Revet ost 175g" til "revetost175g" og "Revet ost" til "revetost".
function normaliser(navn) {
  return String(navn).toLowerCase().replace(/[^a-z0-9æøå]/g, "");
}

// Finder tilbuddet på en vare. Navnet på bonen er sjældent helt det samme som i tilbuddet
// (fx "Revet ost 175g" og "Revet ost"), så vi tjekker, om det ene navn indeholder det andet.
function findTilbud(alleTilbud, varenavn) {
  const vare = normaliser(varenavn);
  return alleTilbud.find((t) => {
    const tilbudsvare = normaliser(t.vare);
    return tilbudsvare && (vare.includes(tilbudsvare) || tilbudsvare.includes(vare));
  });
}

// ---------- Regler mod snyd ----------
// Hvor gammel må en bon højst være? Så kan man ikke scanne en bunke gamle boner.
const MAKS_ALDER_DAGE = 14;
const MS_PER_DAG = 1000 * 60 * 60 * 24;

// Laver et "aftryk" af en bon: butik, dato, klokkeslæt og total sat sammen til én tekst,
// fx "rema1000_20261010_1742_12485". To forskellige boner har næsten aldrig samme aftryk,
// men den samme bon giver altid det samme - også når den scannes af en anden bruger.
// Aftrykket gemmes i aftryk/ i Firebase, og reglerne tillader kun, at det gemmes én gang.
function lavAftryk(butik, dato, bonTotal) {
  // æ, ø og å skrives om, så "Føtex" og "Foetex" giver det samme aftryk
  const butikNavn = String(butik)
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "oe")
    .replace(/å/g, "aa")
    .replace(/[^a-z0-9]/g, "");
  const d = new Date(dato);
  const toCifre = (tal) => String(tal).padStart(2, "0");
  const dag = d.getFullYear() + toCifre(d.getMonth() + 1) + toCifre(d.getDate());
  const klokken = toCifre(d.getHours()) + toCifre(d.getMinutes());
  const oere = Math.round(bonTotal * 100);
  return butikNavn + "_" + dag + "_" + klokken + "_" + oere;
}

// Læser en værdi i Firebase én gang. Vi bruger onValue som i øvelse 05, men med
// onlyOnce: true, så den stopper med at lytte efter første svar.
function laesEnGang(sti) {
  return new Promise((resolve, reject) => {
    onValue(
      ref(rtdb, sti),
      (snapshot) => resolve(snapshot.val()),
      (error) => reject(error),
      { onlyOnce: true }
    );
  });
}

export const AppContext = createContext();

// user og profil kommer fra App.js, som allerede lytter på login og profil
export function AppProvider({ user, profil, children }) {
  const [kvitteringer, setKvitteringer] = useState([]);
  const [tilbud, setTilbud] = useState([]);
  const [valgteButikker, setValgteButikker] = useState({});
  const [indstillinger, setIndstillinger] = useState(STANDARD_INDSTILLINGER);
  // Påmindelsesbanneret kan lukkes resten af sessionen (fra opgave 1)
  const [bannerLukket, setBannerLukket] = useState(false);

  // Lyt på den indloggede brugers kvitteringer: users/{uid}/kvitteringer.
  // onValue kaldes med det samme og igen, hver gang der kommer en ny kvittering.
  useEffect(() => {
    if (!user) {
      setKvitteringer([]);
      return;
    }
    const kvitteringerRef = ref(rtdb, `users/${user.uid}/kvitteringer`);
    const unsubscribe = onValue(kvitteringerRef, (snapshot) => {
      const liste = tilListe(snapshot.val());
      liste.sort((a, b) => b.dato - a.dato); // nyeste først
      setKvitteringer(liste);
    });
    return unsubscribe; // stop med at lytte, når brugeren logger ud
  }, [user]);

  // Lyt på tilbud fra leverandørerne: offers/. Alle indloggede må læse dem (se database.rules.json).
  // Et tilbud har felterne: ownerId, vare, butik, pris, foerPris, cashback, kategori og gyldig.
  useEffect(() => {
    if (!user) {
      setTilbud([]);
      return;
    }
    const unsubscribe = onValue(
      ref(rtdb, "offers"),
      (snapshot) => {
        setTilbud(tilListe(snapshot.val()));
      },
      // Tredje argument kaldes, hvis databasereglerne afviser læsningen.
      // Så forbliver listen tom, og Tilbud-skærmen viser sin tomme tilstand.
      (error) => {
        console.warn("Tilbud kunne ikke hentes - tjek databasereglerne for offers/", error.message);
        setTilbud([]);
      }
    );
    return unsubscribe;
  }, [user]);

  // Hent de lokale præferencer fra AsyncStorage én gang, når appen starter
  useEffect(() => {
    async function hentPraeferencer() {
      try {
        const butikker = await AsyncStorage.getItem(BUTIKKER_NOEGLE);
        const gemteIndstillinger = await AsyncStorage.getItem(INDSTILLINGER_NOEGLE);
        setValgteButikker(butikker ? JSON.parse(butikker) : {});
        setIndstillinger(
          gemteIndstillinger
            ? { ...STANDARD_INDSTILLINGER, ...JSON.parse(gemteIndstillinger) }
            : STANDARD_INDSTILLINGER
        );
      } catch (error) {
        console.error("Kunne ikke hente præferencer", error);
      }
    }
    hentPraeferencer();
  }, []);

  // Beregner, hvor meget cashback en vare giver, ud fra tilbuddene i offers/.
  // Cashback gives per stk., så 2 stk. af en vare med tilbud giver dobbelt cashback.
  function cashbackForVare(vare) {
    const match = findTilbud(tilbud, vare.navn);
    return match ? Math.round(match.cashback * vare.antal * 100) / 100 : 0;
  }

  // Tjekker en aflæst bon, før brugeren får den vist til godkendelse.
  // Returnerer en dansk fejlbesked, hvis bonen ikke må bruges, ellers null.
  async function tjekKvittering(resultat) {
    // Datoen må ikke ligge i fremtiden (10 minutters slør, hvis telefonens ur går lidt forkert)
    if (resultat.dato > Date.now() + 10 * 60 * 1000) {
      return "Datoen på bonen ligger i fremtiden. Tag et nyt billede, så datoen kan læses rigtigt.";
    }
    // Gamle boner giver ikke cashback
    if (Date.now() - resultat.dato > MAKS_ALDER_DAGE * MS_PER_DAG) {
      return "Bonen er mere end " + MAKS_ALDER_DAGE + " dage gammel. Du kan kun scanne kvitteringer fra de sidste " + MAKS_ALDER_DAGE + " dage.";
    }
    // Er bonen scannet før - af dig eller en anden bruger?
    try {
      const aftryk = lavAftryk(resultat.butik, resultat.dato, resultat.total);
      const findes = await laesEnGang("aftryk/" + aftryk);
      if (findes) {
        return "Denne kvittering er allerede scannet. Hver kvittering kan kun bruges én gang.";
      }
    } catch (error) {
      // Kan tjekket ikke gennemføres, stopper vi ikke her. Reglerne afviser stadig en dublet,
      // når kvitteringen gemmes (se gemKvittering).
    }
    return null;
  }

  // Gemmer en kvittering, som brugeren har godkendt efter AI-aflæsningen.
  // Kvitteringen og bonens aftryk gemmes i ÉN samlet skrivning (update på flere stier).
  // Firebase gennemfører enten begge dele eller ingen af dem: findes aftrykket allerede,
  // afviser reglerne hele skrivningen, så en bon aldrig kan gemmes to gange.
  // Returnerer den gemte kvittering med id, så den kan åbnes bagefter.
  async function gemKvittering(kvittering) {
    // Cashback beregnes ud fra AI'ens aflæsning af navn og antal - brugeren kan ikke ændre dem
    const varer = kvittering.varer.map((vare) => ({ ...vare, cashback: cashbackForVare(vare) }));
    const aftryk = lavAftryk(kvittering.butik, kvittering.dato, kvittering.bonTotal);

    const nyKvittering = {
      butik: kvittering.butik,
      dato: kvittering.dato,
      // Total er summen af de godkendte varer, så den passer, hvis brugeren har slettet en vare
      total: Math.round(varer.reduce((sum, v) => sum + v.pris, 0) * 100) / 100,
      bonTotal: kvittering.bonTotal, // totalen, som den står på bonen
      cashback: Math.round(varer.reduce((sum, v) => sum + v.cashback, 0) * 100) / 100,
      varer: varer,
      aftryk: aftryk,
      aflaestAfAI: true, // så vi senere kan se, at varerne er aflæst af AI og godkendt af brugeren
    };

    // push uden data giver bare et nyt, unikt id (mønster fra 05), så vi kan bruge det i update
    const id = push(ref(rtdb, `users/${user.uid}/kvitteringer`)).key;

    try {
      // update på roden af databasen skriver flere steder på én gang
      await update(ref(rtdb), {
        ["aftryk/" + aftryk]: true,
        [`users/${user.uid}/kvitteringer/${id}`]: nyKvittering,
      });
    } catch (error) {
      // Reglerne afviser skrivningen, hvis aftrykket allerede findes
      throw new Error("Denne kvittering er allerede scannet. Hver kvittering kan kun bruges én gang.");
    }
    return { id: id, ...nyKvittering };
  }

  // Tilføjer et tilbud til brugerens indkøbsliste i Firebase (update, mønster fra 05)
  async function tilfoejTilIndkoebsliste(etTilbud) {
    await update(ref(rtdb, `users/${user.uid}/indkoebsliste/${etTilbud.id}`), {
      vare: etTilbud.vare,
      butik: etTilbud.butik,
      tilfoejet: Date.now(),
    });
  }

  // Slår en butik til eller fra og gemmer valget på telefonen (mønster fra 08)
  async function skiftButik(butik, valgt) {
    const nye = { ...valgteButikker, [butik]: valgt };
    setValgteButikker(nye);
    try {
      await AsyncStorage.setItem(BUTIKKER_NOEGLE, JSON.stringify(nye));
    } catch (error) {
      console.error("Kunne ikke gemme butikker", error);
    }
  }

  // Ændrer én indstilling (fx paamindScan) og gemmer dem alle på telefonen
  async function skiftIndstilling(noegle, vaerdi) {
    const nye = { ...indstillinger, [noegle]: vaerdi };
    setIndstillinger(nye);
    try {
      await AsyncStorage.setItem(INDSTILLINGER_NOEGLE, JSON.stringify(nye));
    } catch (error) {
      console.error("Kunne ikke gemme indstillinger", error);
    }
  }

  // Den samlede cashback er summen af cashback på alle kvitteringer
  const saldo = kvitteringer.reduce((sum, k) => sum + (k.cashback || 0), 0);

  return (
    <AppContext.Provider
      value={{
        user,
        profil,
        kvitteringer,
        tilbud,
        saldo,
        valgteButikker,
        indstillinger,
        bannerLukket,
        lukBanner: () => setBannerLukket(true),
        cashbackForVare,
        tjekKvittering,
        gemKvittering,
        tilfoejTilIndkoebsliste,
        skiftButik,
        skiftIndstilling,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Genvej, så skærmene bare kan skrive: const { kvitteringer } = useApp();
export function useApp() {
  return useContext(AppContext);
}
