import React, { createContext, useContext, useState } from "react";
import {
  KVITTERINGER,
  NYE_KVITTERINGER,
  CASHBACK_TILBUD,
  formaterDato,
} from "../data/const";

// Hjælpefunktion: hvor meget cashback giver en kvittering?
// Vi går varerne igennem og ser om varens navn matcher et cashback-tilbud.
export function beregnCashback(kvittering, tilbud) {
  let sum = 0;
  kvittering.varer.forEach((vare) => {
    const match = tilbud.find((t) => t.vare === vare.navn);
    if (match) {
      sum = sum + match.beloeb;
    }
  });
  return sum;
}

// Contexten er "beholderen" med appens fælles data.
// Alle skærme kan læse fra den, så nye kvitteringer og cashback vises alle steder.
export const AppContext = createContext();

export function AppProvider({ children }) {
  // Kvitteringer brugeren har scannet
  const [kvitteringer, setKvitteringer] = useState(KVITTERINGER);

  // Cashback-tilbuddene ændrer sig ikke, så de behøver ikke at være state
  const tilbud = CASHBACK_TILBUD;

  // Startsaldoen er den cashback, de allerede scannede kvitteringer har givet
  const [saldo, setSaldo] = useState(
    KVITTERINGER.reduce((sum, k) => sum + beregnCashback(k, CASHBACK_TILBUD), 0)
  );

  // Har brugeren lukket påmindelsesbanneret? Ligger i contexten (og ikke lokalt i banneret),
  // så det forbliver lukket resten af sessionen - også selvom skærmen gen-renderes.
  const [bannerLukket, setBannerLukket] = useState(false);

  function lukBanner() {
    setBannerLukket(true);
  }

  // Kaldes fra ScanScreen: "scanner" en tilfældig ny kvittering,
  // lægger den øverst på listen og lægger cashbacken til saldoen.
  function scanNyKvittering() {
    const tilfældigtIndex = Math.floor(Math.random() * NYE_KVITTERINGER.length);
    const skabelon = NYE_KVITTERINGER[tilfældigtIndex];

    // Vi giver kvitteringen et nyt id, så to scanninger af samme skabelon ikke får samme id,
    // og dags dato - så påmindelsesbanneret forsvinder automatisk efter en scanning.
    const nyKvittering = {
      ...skabelon,
      id: "k" + Date.now(),
      dato: formaterDato(new Date()),
    };

    // Match varerne mod cashback-tilbuddene
    const cashback = beregnCashback(nyKvittering, tilbud);

    setKvitteringer((prev) => [nyKvittering, ...prev]);
    setSaldo((prev) => prev + cashback);

    // Vi returnerer resultatet, så ScanScreen kan vise en besked til brugeren
    return { kvittering: nyKvittering, cashback: cashback };
  }

  return (
    <AppContext.Provider
      value={{ kvitteringer, saldo, tilbud, scanNyKvittering, bannerLukket, lukBanner }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Lille genvej, så skærmene bare kan skrive: const { kvitteringer } = useApp();
export function useApp() {
  return useContext(AppContext);
}
