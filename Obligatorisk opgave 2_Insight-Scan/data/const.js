// Faste værdier og hjælpefunktioner til Insight-Scan.
// Appens data (kvitteringer, tilbud, profil) ligger i Firebase - her ligger kun det,
// som ikke er brugerdata: kategorier, skabeloner til den simulerede scanning og formatering.

// ---------- Kategorier ----------
// Nøglen gemmes i Firebase på hver vare, navnet vises i appen
export const KATEGORI_NAVNE = {
  "kød/protein": "Kød",
  "frugt/grønt": "Grønt",
  mejeri: "Mejeri",
  snacks: "Snacks",
  drikkevarer: "Drikkevarer",
  andet: "Andet",
};

// ---------- Simuleret AI-udtræk ----------
// Indtil kameraet og AI'en er koblet på, "læser" Scan-skærmen en tilfældig af disse kvitteringer
// (samme idé som i opgave 1). Kvitteringen gemmes derefter i Firebase med dags dato, og resten
// af appen læser den derfra - der er altså ingen hardcodede lister i skærmene.
// pris er linjens samlede pris; antal udelades, når der kun er købt én.
export const KVITTERING_SKABELONER = [
  {
    butik: "Netto",
    adresse: "Frederiksberg Allé",
    varer: [
      { navn: "Kyllingebryst 900 g", pris: 119.9, antal: 2, kategori: "kød/protein" },
      { navn: "Arla minimælk 1 l", pris: 11.95, kategori: "mejeri" },
      { navn: "Skyr naturel 1 kg", pris: 23.95, kategori: "mejeri" },
      { navn: "Rugbrød", pris: 18, kategori: "andet" },
      { navn: "Bananer 1 kg", pris: 16, kategori: "frugt/grønt" },
      { navn: "Gulerødder 1 kg", pris: 10, antal: 2, kategori: "frugt/grønt" },
      { navn: "Kaffe 400 g", pris: 52.5, kategori: "drikkevarer" },
    ],
  },
  {
    butik: "Rema 1000",
    adresse: "Gl. Kongevej",
    varer: [
      { navn: "Hakket oksekød 500 g", pris: 35, kategori: "kød/protein" },
      { navn: "Pasta penne 500 g", pris: 12.95, kategori: "andet" },
      { navn: "Hakkede tomater", pris: 21, antal: 3, kategori: "frugt/grønt" },
      { navn: "Revet ost", pris: 24.95, kategori: "mejeri" },
      { navn: "Danskvand", pris: 12, kategori: "drikkevarer" },
    ],
  },
  {
    butik: "Føtex",
    adresse: "Falkoner Allé",
    varer: [
      { navn: "Laks 400 g", pris: 79, kategori: "kød/protein" },
      { navn: "Broccoli", pris: 15, kategori: "frugt/grønt" },
      { navn: "Æbler 1 kg", pris: 22, kategori: "frugt/grønt" },
      { navn: "Æg 10 stk.", pris: 26.25, kategori: "kød/protein" },
      { navn: "Chips", pris: 25, kategori: "snacks" },
      { navn: "Appelsinjuice 1 l", pris: 22, kategori: "drikkevarer" },
    ],
  },
  {
    butik: "Lidl",
    adresse: "Vesterbrogade",
    varer: [
      { navn: "Kyllingebryst 900 g", pris: 49.95, kategori: "kød/protein" },
      { navn: "Økologiske bananer", pris: 12, kategori: "frugt/grønt" },
      { navn: "Yoghurt naturel", pris: 16, kategori: "mejeri" },
      { navn: "Chokolade", pris: 18, kategori: "snacks" },
    ],
  },
];

// ---------- Beløb ----------
// Sætter punktum som tusindtalsseparator, fx "2340" -> "2.340"
function medTusindtal(heltal) {
  let resultat = "";
  for (let i = 0; i < heltal.length; i++) {
    const cifreTilbage = heltal.length - i;
    resultat = resultat + heltal[i];
    // Efter hvert tredje ciffer fra højre (men ikke til sidst) kommer et punktum
    if (cifreTilbage > 1 && cifreTilbage % 3 === 1) {
      resultat = resultat + ".";
    }
  }
  return resultat;
}

// 312.5 -> "312,50 kr." (dansk komma og altid to decimaler)
export function formaterKroner(beloeb) {
  const [heltal, decimaler] = beloeb.toFixed(2).split(".");
  return medTusindtal(heltal) + "," + decimaler + " kr.";
}

// 2340.4 -> "2.340" (til nøgletal uden decimaler)
export function formaterHeltal(tal) {
  return medTusindtal(String(Math.round(tal)));
}

// ---------- Datoer ----------
// Kvitteringer gemmes med dato som millisekunder (Date.now()), så de er nemme at sortere
const UGEDAGE = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];
const MAANEDER = [
  "januar", "februar", "marts", "april", "maj", "juni",
  "juli", "august", "september", "oktober", "november", "december",
];
const MS_PER_DAG = 1000 * 60 * 60 * 24;

// Midnat på samme dag, så vi kan tælle hele dage og ikke timer
function startPaaDag(dato) {
  return new Date(dato.getFullYear(), dato.getMonth(), dato.getDate());
}

// Hvor mange hele dage siden et tidspunkt? (0 = i dag, 1 = i går)
export function dageSiden(ms) {
  const iDag = startPaaDag(new Date());
  const dengang = startPaaDag(new Date(ms));
  return Math.round((iDag - dengang) / MS_PER_DAG);
}

// "Onsdag 14. oktober" - til hilsenen på Hjem
export function formaterUgedagOgDato(dato) {
  return UGEDAGE[dato.getDay()] + " " + dato.getDate() + ". " + MAANEDER[dato.getMonth()];
}

// "oktober" - til "Forbrug i oktober"
export function maanedsNavn(dato) {
  return MAANEDER[dato.getMonth()];
}

// Kort, relativ dato til lister: "I dag", "I går", "Mandag" eller "12. okt."
export function formaterRelativDato(ms) {
  const dage = dageSiden(ms);
  const dato = new Date(ms);
  if (dage === 0) return "I dag";
  if (dage === 1) return "I går";
  if (dage < 7) return UGEDAGE[dato.getDay()];
  return dato.getDate() + ". " + MAANEDER[dato.getMonth()].slice(0, 3) + ".";
}

// "13. okt. kl. 17.42" - til kvitteringens detaljer
export function formaterTidspunkt(ms) {
  const dato = new Date(ms);
  const timer = String(dato.getHours()).padStart(2, "0");
  const minutter = String(dato.getMinutes()).padStart(2, "0");
  return dato.getDate() + ". " + MAANEDER[dato.getMonth()].slice(0, 3) + ". kl. " + timer + "." + minutter;
}

// Er tidspunktet i den nuværende måned?
export function erDenneMaaned(ms) {
  const nu = new Date();
  const dato = new Date(ms);
  return dato.getMonth() === nu.getMonth() && dato.getFullYear() === nu.getFullYear();
}
