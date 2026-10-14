// services/ai.js
// Al kode, der taler med AI'en, ligger her. Skærmene kalder kun laesKvittering(billede)
// og ved ikke, hvilken AI-udbyder der bruges. Skifter vi udbyder, skal kun denne fil ændres.
//
// Flowet:
//   1. Billedet af kvitteringen sendes til OpenAI som base64 sammen med en instruktion.
//   2. AI'en svarer med JSON i et fast format (butik, dato, varer, total).
//   3. Svaret valideres og ryddes op, før appen bruger det - AI'en kan tage fejl.
//   4. Går noget galt, kastes en fejl med en venlig dansk besked, som skærmen kan vise.

import { KATEGORI_NAVNE } from "../data/const";

const API_URL = "https://api.openai.com/v1/chat/completions";
// gpt-4.1-mini kan læse billeder, er hurtig og billig per scanning
const MODEL = "gpt-4.1-mini";
// De kategorinøgler, AI'en må bruge (samme som resten af appen, se data/const.js)
const KATEGORIER = Object.keys(KATEGORI_NAVNE);

// Beskeden, brugeren ser, hvis billedet ikke kunne læses
const ULAESELIG =
  "Vi kunne ikke læse kvitteringen. Prøv igen med bedre lys, og hold hele bonen inden for rammen.";
// Dato, klokkeslæt og total skal kunne læses, fordi de bruges til at genkende en bon,
// der er scannet før (se gemKvittering i AppContext)
const MANGLER_DATO =
  "Dato, klokkeslæt eller total kunne ikke læses. Tag et nyt billede, hvor hele bonen er med - også toppen og bunden.";

// Instruktionen til AI'en. Den beskriver præcis, hvilket JSON-format vi vil have tilbage,
// så svaret kan bruges direkte i appen.
const INSTRUKTION = `Du aflæser danske kassebonner fra supermarkeder.
Svar KUN med JSON i præcis dette format:
{"butik": "Netto", "dato": "2026-10-14", "tidspunkt": "17:42", "varer": [{"navn": "Skyr naturel 1 kg", "antal": 1, "pris": 23.95, "kategori": "mejeri"}], "total": 23.95}

Regler:
- "butik" er kædens navn, fx Netto, Rema 1000, Føtex, Lidl, Coop 365 eller Bilka.
- "dato" er købsdatoen i formatet ÅÅÅÅ-MM-DD.
- "tidspunkt" er klokkeslættet på bonen i formatet TT:MM.
- Kan dato, tidspunkt eller total ikke læses tydeligt, så skriv null i feltet. Gæt aldrig.
- "pris" er linjens samlede pris i kroner som et tal med punktum (fx 23.95), inkl. antal.
- "antal" er et helt tal. Brug 1, hvis antallet ikke står på bonen.
- "kategori" skal være præcis én af: ${KATEGORIER.join(", ")}.
- Skriv varenavne, som et menneske ville skrive dem: stort begyndelsesbogstav, resten med små
  bogstaver, rigtige danske bogstaver (OE -> ø, AE -> æ, AA -> å) og udskrevne forkortelser.
  Fx "Skyr naturel 1 kg" i stedet for "SKYR NAT 1KG" og "Hakket oksekød 8-12%" i stedet for "HAKKET OKSEKOED 8-12%".
- Medtag ikke pant, rabatlinjer, betaling, byttepenge eller moms som varer.
- "total" er bonens samlede beløb.
- Hvis billedet ikke er en læselig kvittering, så svar {"fejl": "kort forklaring"}.`;

// Sender et billede af en kvittering til AI'en og returnerer den aflæste kvittering:
// { butik, dato (millisekunder), varer: [{ navn, antal, pris, kategori }], total }
// Kaster en fejl med en dansk besked, hvis noget går galt.
export async function laesKvittering(base64Billede) {
  // Nøglen ligger i .env (se CLAUDE.md) og bygges ind i appen af Expo
  const noegle = process.env.EXPO_PUBLIC_AI_API_KEY;
  if (!noegle) {
    throw new Error("AI-nøglen mangler. Tjek, at EXPO_PUBLIC_AI_API_KEY står i .env.");
  }

  // 1. Send billedet med fetch (mønster fra øvelse 03)
  let response;
  try {
    response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + noegle,
      },
      body: JSON.stringify({
        model: MODEL,
        // Tvinger AI'en til at svare med gyldig JSON
        response_format: { type: "json_object" },
        // Lav temperatur = AI'en gætter mindre og aflæser mere præcist
        temperature: 0,
        messages: [
          { role: "system", content: INSTRUKTION },
          {
            role: "user",
            content: [
              { type: "text", text: "Aflæs denne kvittering." },
              {
                type: "image_url",
                // "high" giver AI'en billedet i høj opløsning, så den kan læse den lille tekst
                image_url: { url: "data:image/jpeg;base64," + base64Billede, detail: "high" },
              },
            ],
          },
        ],
      }),
    });
  } catch (error) {
    // fetch kaster kun en fejl, når der slet ikke er forbindelse
    throw new Error("Der er ingen forbindelse til internettet. Tjek din forbindelse, og prøv igen.");
  }

  // 2. Svarede AI-tjenesten med en fejl? (fx forkert nøgle eller for mange forespørgsler)
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("AI-nøglen virker ikke. Tjek nøglen i .env.");
    }
    if (response.status === 429) {
      throw new Error("AI-tjenesten har for travlt lige nu, eller forbruget er brugt op. Prøv igen om lidt.");
    }
    throw new Error("AI-tjenesten svarede ikke. Prøv igen om lidt.");
  }

  // 3. Hent AI'ens tekstsvar og lav det om til et objekt
  let svar;
  try {
    const data = await response.json();
    svar = JSON.parse(data.choices[0].message.content);
  } catch (error) {
    throw new Error(ULAESELIG);
  }

  // 4. Valider og ryd op i svaret, før appen bruger det
  return validerKvittering(svar);
}

// Laver et tal ud af AI'ens svar. AI'en skriver nogle gange "23,95" som tekst i stedet for 23.95.
function tilTal(vaerdi) {
  if (typeof vaerdi === "number") return vaerdi;
  if (typeof vaerdi === "string") return parseFloat(vaerdi.replace(",", "."));
  return NaN;
}

// Afrunder til hele øre, så 23.950000001 bliver 23.95
function tilOere(beloeb) {
  return Math.round(beloeb * 100) / 100;
}

// Laver datoen "2026-10-14" og klokkeslættet "17:42" om til millisekunder, som resten af appen
// bruger. Returnerer null, hvis de ikke kan læses, så vi ikke gætter på en dato.
function tolkTidspunkt(datoTekst, tidTekst) {
  if (typeof datoTekst !== "string" || typeof tidTekst !== "string") return null;
  const [aar, maaned, dag] = datoTekst.split("-").map(Number);
  // Klokkeslættet kan stå som "17:42" eller "17.42" på bonen
  const [timer, minutter] = tidTekst.replace(".", ":").split(":").map(Number);
  const dato = new Date(aar, maaned - 1, dag, timer, minutter);
  // Ugyldige tal (fx måned 13) giver en ugyldig dato
  if (isNaN(dato.getTime()) || dato.getMonth() !== maaned - 1 || minutter > 59) return null;
  return dato.getTime();
}

// Tjekker, at AI'ens svar har det rigtige format, og retter det, der kan rettes.
// Varer uden navn eller med en ugyldig pris fjernes. Er der intet brugbart tilbage,
// kastes en fejl, så brugeren kan prøve igen.
export function validerKvittering(svar) {
  // AI'en svarer {"fejl": ...}, når billedet ikke er en kvittering
  if (!svar || typeof svar !== "object" || svar.fejl) {
    throw new Error(ULAESELIG);
  }

  const butik = typeof svar.butik === "string" ? svar.butik.trim() : "";
  if (!butik || !Array.isArray(svar.varer)) {
    throw new Error(ULAESELIG);
  }

  const varer = svar.varer
    .map((vare) => {
      const antal = Math.round(tilTal(vare.antal));
      return {
        navn: typeof vare.navn === "string" ? vare.navn.trim() : "",
        antal: antal >= 1 ? antal : 1,
        pris: tilOere(tilTal(vare.pris)),
        // Ukendte kategorier bliver til "andet", så de stadig kan vises
        kategori: KATEGORIER.includes(vare.kategori) ? vare.kategori : "andet",
      };
    })
    .filter((vare) => vare.navn && !isNaN(vare.pris) && vare.pris >= 0);

  if (varer.length === 0) {
    throw new Error(ULAESELIG);
  }

  // Dato, klokkeslæt og total skal være læst, ellers kan bonen ikke genkendes senere
  const dato = tolkTidspunkt(svar.dato, svar.tidspunkt);
  const total = tilOere(tilTal(svar.total));
  if (dato === null || isNaN(total) || total <= 0) {
    throw new Error(MANGLER_DATO);
  }

  return {
    butik: butik,
    dato: dato, // dato og klokkeslæt i millisekunder
    varer: varer,
    total: total, // bonens total, som den står på bonen (inkl. fx pant)
  };
}
