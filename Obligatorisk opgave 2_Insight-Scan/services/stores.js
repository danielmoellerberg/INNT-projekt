// stores.js: henter supermarkeder i nærheden fra OpenStreetMap. Al hente-logik ligger her,
// så Butikker-skærmen kun skal kalde hentButikker(position) og ikke kender til API'et.
//
// Data kommer fra Overpass API, som er en gratis søgetjeneste til OpenStreetMaps kortdata.
// Vi spørger efter alle steder med tagget shop=supermarket inden for 2 km og bruger tagget
// "brand" til at finde kæden (fx brand=Netto). Hentningen følger mønstret fra øvelse 03:
// fetch med async/await, response.json() og try/catch.
//
// Overpass er en gratis tjeneste, der ofte er overbelastet. Derfor gemmes resultatet i
// AsyncStorage med et tidsstempel (mønster fra øvelse 08), og vi henter kun igen, når de gemte
// butikker er over et døgn gamle, eller brugeren har flyttet sig mere end 1 km.

import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_NOEGLE = "BUTIKKER_I_NAERHEDEN";
const RADIUS_METER = 2000;
const MAKS_ALDER_MS = 24 * 60 * 60 * 1000; // et døgn
const MAKS_FLYTNING_METER = 1000;

// Hovedserveren og en reserve. Svarer den første ikke, prøver vi den næste.
const SERVERE = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

// De kæder, appen kender. "starterMed" er de navne, kæden har i OpenStreetMap
// (Coop 365 hedder fx stadig "365discount" der). Rækkefølgen er rækkefølgen i listen på skærmen.
const KAEDER_I_OSM = [
  { navn: "Netto", starterMed: ["netto"] },
  { navn: "Rema 1000", starterMed: ["rema 1000", "rema1000"] },
  { navn: "Føtex", starterMed: ["føtex", "fotex"] },
  { navn: "Lidl", starterMed: ["lidl"] },
  { navn: "Coop 365", starterMed: ["coop 365", "365discount", "365 discount"] },
  { navn: "Meny", starterMed: ["meny"] },
  { navn: "Bilka", starterMed: ["bilka"] },
];

// Kun navnene, fx til listen af kæder på Butikker-skærmen
export const KAEDER = KAEDER_I_OSM.map((kaede) => kaede.navn);

// Afstand i meter mellem to punkter på jorden ({ latitude, longitude }).
// Haversine-formlen regner med, at jorden er en kugle, hvilket er præcist nok på få kilometer.
export function afstandIMeter(fra, til) {
  const R = 6371000; // jordens radius i meter
  const tilRadianer = (grader) => (grader * Math.PI) / 180;
  const dLat = tilRadianer(til.latitude - fra.latitude);
  const dLon = tilRadianer(til.longitude - fra.longitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(tilRadianer(fra.latitude)) * Math.cos(tilRadianer(til.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// 350 -> "350 m", 1240 -> "1,2 km" (som i Figma)
export function formaterAfstand(meter) {
  if (meter < 1000) {
    return Math.round(meter / 10) * 10 + " m";
  }
  return (meter / 1000).toFixed(1).replace(".", ",") + " km";
}

// Finder kæden ud fra OpenStreetMaps tags. brand er det mest præcise, men nogle butikker har
// kun et navn. Vi bruger "starter med", så fx "Rema 1000 Valby" passer, men en kiosk, der
// bare har ordet "netto" et sted i navnet, ikke gør. Ukendte kæder giver null.
function findKaede(tags) {
  const tekst = (tags.brand || tags.name || "").toLowerCase();
  const kaede = KAEDER_I_OSM.find((k) => k.starterMed.some((ord) => tekst.startsWith(ord)));
  return kaede ? kaede.navn : null;
}

// Laver én butik om fra OpenStreetMaps format til appens format.
// Et punkt (node) har lat/lon direkte. En bygning (way/relation) har et midtpunkt (center).
function tilButik(element) {
  const tags = element.tags || {};
  const latitude = element.lat ?? element.center?.lat;
  const longitude = element.lon ?? element.center?.lon;
  const kaede = findKaede(tags);
  if (!kaede || latitude == null || longitude == null) return null;

  // Adressen er gade + husnummer. Mangler den, bruges butikkens filialnavn, hvis det findes.
  const gade = tags["addr:street"] ? (tags["addr:street"] + " " + (tags["addr:housenumber"] || "")).trim() : "";
  return {
    id: element.type + "/" + element.id,
    kaede: kaede,
    adresse: gade || tags.branch || "",
    latitude: latitude,
    longitude: longitude,
  };
}

// Spørger Overpass om supermarkeder inden for 2 km af positionen.
// "nwr" betyder punkter, bygninger og relationer. "out center tags" giver midtpunkt og tags.
// Overpass afviser forespørgsler uden User-Agent, så appen fortæller, hvem den er.
async function hentFraOpenStreetMap(position) {
  const forespoergsel =
    `[out:json][timeout:25];` +
    `nwr["shop"="supermarket"](around:${RADIUS_METER},${position.latitude},${position.longitude});` +
    `out center tags;`;

  let sidsteFejl = null;
  for (const server of SERVERE) {
    try {
      const response = await fetch(server, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          "User-Agent": "Insight-Scan/1.0 (CBS studieprojekt)",
        },
        body: "data=" + encodeURIComponent(forespoergsel),
      });
      if (!response.ok) {
        throw new Error("Overpass svarede med status " + response.status);
      }
      const data = await response.json();
      // Lav alle elementer om til butikker, og smid dem væk, der ikke hører til en kendt kæde
      return data.elements.map(tilButik).filter((butik) => butik !== null);
    } catch (error) {
      sidsteFejl = error; // prøv næste server
    }
  }
  throw sidsteFejl;
}

// Giver butikkerne omkring positionen. Bruger de gemte butikker, hvis de er nye nok og hentet
// tæt på, hvor brugeren er nu. Ellers hentes de fra OpenStreetMap og gemmes igen.
// Fejler hentningen, bruges de gemte butikker alligevel (gamle butikker er bedre end ingen).
// Er der hverken net eller gemte butikker, kastes fejlen videre, så skærmen kan vise en besked.
export async function hentButikker(position) {
  let gemt = null;
  try {
    const json = await AsyncStorage.getItem(CACHE_NOEGLE);
    gemt = json ? JSON.parse(json) : null;
  } catch (error) {
    gemt = null;
  }

  if (gemt) {
    const alder = Date.now() - gemt.tidspunkt;
    const flyttet = afstandIMeter(position, gemt.position);
    if (alder < MAKS_ALDER_MS && flyttet < MAKS_FLYTNING_METER) {
      return gemt.butikker;
    }
  }

  try {
    const butikker = await hentFraOpenStreetMap(position);
    try {
      await AsyncStorage.setItem(
        CACHE_NOEGLE,
        JSON.stringify({ tidspunkt: Date.now(), position: position, butikker: butikker })
      );
    } catch (error) {
      console.error("Kunne ikke gemme butikkerne", error);
    }
    return butikker;
  } catch (error) {
    if (gemt) return gemt.butikker;
    throw error;
  }
}
