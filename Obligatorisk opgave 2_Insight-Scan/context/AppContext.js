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
import { KVITTERING_SKABELONER } from "../data/const";

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

  // "Scanner" en kvittering: vælger en tilfældig skabelon (simuleret AI-udtræk som i opgave 1),
  // matcher varerne mod tilbuddene i Firebase og gemmer kvitteringen under brugeren med push.
  // Returnerer den gemte kvittering, så Scan-skærmen kan vise den bagefter.
  async function scanNyKvittering() {
    const skabelon = KVITTERING_SKABELONER[Math.floor(Math.random() * KVITTERING_SKABELONER.length)];

    // Hver vare får cashback, hvis der findes et tilbud på netop den vare
    const varer = skabelon.varer.map((vare) => {
      const match = tilbud.find((t) => t.vare === vare.navn);
      return { ...vare, cashback: match ? match.cashback : 0 };
    });

    const nyKvittering = {
      butik: skabelon.butik,
      adresse: skabelon.adresse,
      dato: Date.now(),
      total: varer.reduce((sum, v) => sum + v.pris, 0),
      cashback: varer.reduce((sum, v) => sum + v.cashback, 0),
      varer: varer,
    };

    // push laver et nyt, unikt id i Firebase (mønster fra 05)
    const nyRef = await push(ref(rtdb, `users/${user.uid}/kvitteringer`), nyKvittering);
    return { id: nyRef.key, ...nyKvittering };
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
        scanNyKvittering,
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
