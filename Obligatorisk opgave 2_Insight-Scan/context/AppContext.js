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
// - Kvitteringer, tilbud og indkøbsliste: Firebase Realtime Database, læst live med onValue
//   (mønster fra 05).
// - Præferencer (valgte butikker og notifikationer): AsyncStorage på telefonen (mønster fra 08).

import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ref, onValue, push, update, remove } from "firebase/database";

import { rtdb } from "../database/firebase";
import { findTilbud } from "../services/offers";

// Faste nøgler til AsyncStorage (mønster fra 08)
const BUTIKKER_NOEGLE = "VALGTE_BUTIKKER";
const INDSTILLINGER_NOEGLE = "INDSTILLINGER";
const STANDARD_INDSTILLINGER = { nyeTilbud: true, paamindScan: true };

// ---------- Cashback-modellen ----------
// Pivot efter vores Think Out Loud-test: brugerne forstod ikke, hvorfor de kun fik cashback
// på enkelte varer fra mærkernes tilbud, og de fleste boner gav 0 kr. Nu får brugeren altid
// en lille procentdel af hele bonens total (basis), ligesom cashback på et betalingskort.
// Sponsorerede tilbud fra mærkerne i offers/ kan give ekstra cashback oveni (bonus).
// Kvitteringer gemt før pivoten beholder deres gamle cashback - beregningen gælder kun nye.
export const CASHBACK_SATS = 0.005; // 0,5 % af bonens total
// Satsen som tekst til skærmene, fx "0,5 %"
export const CASHBACK_SATS_TEKST = String(CASHBACK_SATS * 100).replace(".", ",") + " %";
// Cashback kan udbetales, når den tilgængelige saldo når dette beløb (i kroner).
// Den eneste grænse i appen: Hjem, Udbetaling og Indstillinger bruger alle denne konstant.
export const UDBETALING_MIN = 250;

// Firebase gemmer lister som objekter: { id1: {...}, id2: {...} }.
// Her laver vi dem om til et array, hvor id'et ligger på hvert element (mønster fra 05).
function tilListe(data) {
  if (!data) return [];
  return Object.keys(data).map((id) => ({ id: id, ...data[id] }));
}

// ---------- Regler mod snyd ----------
// Afrunder til hele øre, så 1.5649999 bliver 1.56
function tilOere(beloeb) {
  return Math.round(beloeb * 100) / 100;
}

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
  const [indkoebsliste, setIndkoebsliste] = useState([]);
  const [udbetalinger, setUdbetalinger] = useState([]);
  // Hvilke kommende funktioner brugeren har bedt om besked om, fx { madplan: { tidspunkt } }
  const [interesse, setInteresse] = useState({});
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

  // Lyt på brugerens indkøbsliste: users/{uid}/indkoebsliste.
  // Varer tilføjet før indkøbslisten blev bygget, har feltet "vare" i stedet for "navn",
  // så det rettes her, og skærmen kan altid bruge vare.navn.
  useEffect(() => {
    if (!user) {
      setIndkoebsliste([]);
      return;
    }
    const unsubscribe = onValue(ref(rtdb, `users/${user.uid}/indkoebsliste`), (snapshot) => {
      const liste = tilListe(snapshot.val()).map((v) => ({ ...v, navn: v.navn || v.vare || "" }));
      setIndkoebsliste(liste);
    });
    return unsubscribe;
  }, [user]);

  // Lyt på brugerens udbetalinger: users/{uid}/udbetalinger.
  // De trækkes fra den optjente cashback, så saldoen på Hjem falder efter en udbetaling.
  useEffect(() => {
    if (!user) {
      setUdbetalinger([]);
      return;
    }
    const unsubscribe = onValue(ref(rtdb, `users/${user.uid}/udbetalinger`), (snapshot) => {
      setUdbetalinger(tilListe(snapshot.val()));
    });
    return unsubscribe;
  }, [user]);

  // Lyt på brugerens interesse for kommende funktioner: users/{uid}/interesse (fake door-test,
  // se MadplanScreen). Så husker knappen "Du får besked", også efter genstart.
  useEffect(() => {
    if (!user) {
      setInteresse({});
      return;
    }
    const unsubscribe = onValue(ref(rtdb, `users/${user.uid}/interesse`), (snapshot) => {
      setInteresse(snapshot.val() || {});
    });
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

  // Ekstra cashback (bonus) på én vare fra et sponsoreret tilbud i offers/.
  // Bonussen gives per stk., så 2 stk. af en vare med tilbud giver dobbelt bonus.
  function bonusForVare(vare) {
    const match = findTilbud(tilbud, vare.navn);
    return match ? tilOere(match.cashback * vare.antal) : 0;
  }

  // Beregner cashback for hele bonen:
  // - basis: CASHBACK_SATS af AI'ens aflæste total (aiTotal), afrundet til hele øre.
  //   Vi bruger AI'ens total og ikke de priser, brugeren kan rette, så man ikke kan få mere
  //   cashback ved at skrive højere priser.
  // - bonus: summen af ekstra cashback fra sponsorerede tilbud på bonens varer.
  // Returnerer også varerne med deres bonus, så skærmene kan vise, hvilke varer gav ekstra.
  function beregnCashback(aiTotal, varer) {
    const varerMedBonus = varer.map((vare) => ({ ...vare, bonus: bonusForVare(vare) }));
    const basis = tilOere(aiTotal * CASHBACK_SATS);
    const bonus = tilOere(varerMedBonus.reduce((sum, v) => sum + v.bonus, 0));
    return { basis: basis, bonus: bonus, cashback: tilOere(basis + bonus), varer: varerMedBonus };
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
    // Cashback beregnes ud fra AI'ens aflæste total og AI'ens varenavne og antal,
    // som brugeren ikke kan ændre på godkendelsesskærmen
    const beregning = beregnCashback(kvittering.aiTotal, kvittering.varer);
    const aftryk = lavAftryk(kvittering.butik, kvittering.dato, kvittering.aiTotal);

    const nyKvittering = {
      butik: kvittering.butik,
      dato: kvittering.dato,
      // Total er summen af de godkendte varer, så den passer, hvis brugeren har slettet en vare.
      // Den bruges til forbrug på Hjem, ikke til cashback.
      total: tilOere(beregning.varer.reduce((sum, v) => sum + v.pris, 0)),
      aiTotal: kvittering.aiTotal, // totalen, som AI'en læste den på bonen (låst)
      // Fordelingen gemmes, så Kvittering-skærmen kan vise basis og bonus hver for sig
      cashbackBasis: beregning.basis,
      cashbackBonus: beregning.bonus,
      cashback: beregning.cashback,
      varer: beregning.varer,
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

  // ---------- Indkøbslisten (users/{uid}/indkoebsliste) ----------
  // Hver vare har: navn, butik (kæde), pris, cashback, afkrydset og tilfoejet (tidspunkt).

  // Tilføjer et tilbud fra offers/. Tilbuddets id bruges som nøgle (update), så samme tilbud
  // ikke kommer på listen to gange (mønster fra 05).
  async function tilfoejTilbudTilListe(etTilbud) {
    await update(ref(rtdb, `users/${user.uid}/indkoebsliste/${etTilbud.id}`), {
      navn: etTilbud.vare,
      butik: etTilbud.butik,
      pris: etTilbud.pris,
      cashback: etTilbud.cashback || 0,
      gyldig: etTilbud.gyldig || null, // fx "til søndag", vises under varen
      afkrydset: false,
      tilfoejet: Date.now(),
    });
  }

  // Tilføjer en vare, brugeren selv har skrevet. Den har ingen butik eller pris endnu.
  // push giver et nyt, unikt id (mønster fra 05).
  async function tilfoejEgenVare(navn) {
    await push(ref(rtdb, `users/${user.uid}/indkoebsliste`), {
      navn: navn,
      butik: "",
      pris: 0,
      cashback: 0,
      afkrydset: false,
      tilfoejet: Date.now(),
    });
  }

  // Krydser en vare af eller fjerner krydset igen
  async function skiftAfkrydset(id, afkrydset) {
    await update(ref(rtdb, `users/${user.uid}/indkoebsliste/${id}`), { afkrydset: afkrydset });
  }

  // Sletter én vare (remove, mønster fra 05)
  async function sletFraListe(id) {
    await remove(ref(rtdb, `users/${user.uid}/indkoebsliste/${id}`));
  }

  // Sletter alle afkrydsede varer i én skrivning: update med null på flere stier sletter dem
  async function rydAfkrydsede() {
    const sletninger = {};
    indkoebsliste
      .filter((vare) => vare.afkrydset)
      .forEach((vare) => {
        sletninger[`users/${user.uid}/indkoebsliste/${vare.id}`] = null;
      });
    await update(ref(rtdb), sletninger);
  }

  // Flytter en vare til en billigere butik: butik, pris og cashback skiftes til tilbuddets
  async function flytVare(id, etTilbud) {
    await update(ref(rtdb, `users/${user.uid}/indkoebsliste/${id}`), {
      butik: etTilbud.butik,
      pris: etTilbud.pris,
      cashback: etTilbud.cashback || 0,
      gyldig: etTilbud.gyldig || null,
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

  // Gemmer, at brugeren vil have besked, når en kommende funktion er klar (fake door-test).
  // Tidspunktet gemmes, så vi senere kan se, hvornår interessen opstod.
  async function visInteresse(funktion) {
    await update(ref(rtdb, `users/${user.uid}/interesse`), {
      [funktion]: { tidspunkt: Date.now() },
    });
  }

  // ---------- Udbetaling (simuleret) ----------
  // Der sendes INGEN rigtige penge. En udbetaling er kun en anmodning, der gemmes i Firebase,
  // så saldoen falder. Rigtig udbetaling kræver Stripe Connect, og det skal ske på en server
  // (fx Firebase Cloud Functions): serveren tjekker saldoen, kalder Stripe med en hemmelig nøgle,
  // som aldrig må ligge i appen, og opdaterer status fra "anmodet" til "udbetalt".
  // Databasereglerne sikrer, at en anmodning kun kan oprettes - ikke ændres eller slettes.
  async function anmodUdbetaling(beloeb, metode) {
    await push(ref(rtdb, `users/${user.uid}/udbetalinger`), {
      beloeb: beloeb,
      metode: metode, // den maskerede tekst, fx "Konto ••••5678" - aldrig det fulde nummer
      tidspunkt: Date.now(),
      status: "anmodet",
    });
  }

  // Tilgængelig cashback = al optjent cashback fra kvitteringer minus alt, der er udbetalt.
  // Afrundet til hele øre, så fx 262.39999 bliver 262.4.
  const optjent = kvitteringer.reduce((sum, k) => sum + (k.cashback || 0), 0);
  const udbetalt = udbetalinger.reduce((sum, u) => sum + (u.beloeb || 0), 0);
  const saldo = tilOere(optjent - udbetalt);

  return (
    <AppContext.Provider
      value={{
        user,
        profil,
        kvitteringer,
        tilbud,
        indkoebsliste,
        saldo,
        anmodUdbetaling,
        interesse,
        visInteresse,
        valgteButikker,
        indstillinger,
        bannerLukket,
        lukBanner: () => setBannerLukket(true),
        beregnCashback,
        tjekKvittering,
        gemKvittering,
        tilfoejTilbudTilListe,
        tilfoejEgenVare,
        skiftAfkrydset,
        sletFraListe,
        rydAfkrydsede,
        flytVare,
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
