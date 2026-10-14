// Faste værdier og hjælpefunktioner til Insight-Scan.
// Appens data (kvitteringer, tilbud, profil) ligger i Firebase - her ligger kun det,
// som ikke er brugerdata: kategorier og formatering af beløb og datoer.

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
