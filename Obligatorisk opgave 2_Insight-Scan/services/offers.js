// offers.js: søgning og prissammenligning i tilbuddene (offers/ i Firebase).
// Tilbud er almindelige tilbud fra butikkernes tilbudsaviser (vare, butik, pris, førpris,
// kategori og gyldighed). De giver ikke cashback - cashback er 0,5 % af hele bonen.
// Tilbuddene hentes live af AppContext (onValue), så funktionerne her får listen som argument
// og regner bare på den. Al logik er almindelig sammenligning i koden - ikke et AI-kald.
//
// På sigt hentes tilbuddene via API'er fra kæderne (fx Salling Group), uden at skærmene skal
// ændres: de kalder kun soegVarer og findBilligereAndetsteds.

// Gør et varenavn sammenligneligt: små bogstaver og kun bogstaver og tal.
// Så bliver "Revet ost 175g" til "revetost175g" og "Revet ost" til "revetost".
export function normaliser(navn) {
  return String(navn).toLowerCase().replace(/[^a-z0-9æøå]/g, "");
}

// Er to varenavne den samme vare? Navnet på en bon eller en liste er sjældent helt det samme
// som i tilbuddet (fx "Revet ost 175g" og "Revet ost"), så vi tjekker, om det ene indeholder
// det andet.
export function sammeVare(navnA, navnB) {
  const a = normaliser(navnA);
  const b = normaliser(navnB);
  return a !== "" && b !== "" && (a.includes(b) || b.includes(a));
}

// Hvor meget sparer man på et tilbud? Førpris minus tilbudspris, afrundet til hele øre.
// Har tilbuddet ingen førpris (eller er den ikke højere), giver det 0.
export function besparelse(etTilbud) {
  if (!etTilbud.foerPris || etTilbud.foerPris <= etTilbud.pris) return 0;
  return Math.round((etTilbud.foerPris - etTilbud.pris) * 100) / 100;
}

// Søger efter en vare i alle butikker. Resultatet er sorteret efter pris, billigst først,
// så det første resultat er det billigste (det får mærket "Billigst" på skærmen).
export function soegVarer(alleTilbud, soegetekst) {
  const soeg = normaliser(soegetekst);
  if (soeg === "") return [];
  return alleTilbud
    .filter((t) => normaliser(t.vare).includes(soeg))
    .sort((a, b) => a.pris - b.pris);
}

// Finder én vare på indkøbslisten, der er billigere i en anden kæde, brugeren har valgt.
// Kun varer, der ikke er krydset af, og som har en pris, sammenlignes.
// Returnerer { vare, tilbud, besparelse } for den største besparelse, eller null.
export function findBilligereAndetsteds(liste, alleTilbud, valgteButikker) {
  let bedste = null;
  liste.forEach((vare) => {
    if (vare.afkrydset || !vare.pris) return;
    alleTilbud.forEach((t) => {
      const andenValgtKaede = t.butik !== vare.butik && valgteButikker[t.butik] === true;
      if (andenValgtKaede && t.pris < vare.pris && sammeVare(t.vare, vare.navn)) {
        const besparelse = Math.round((vare.pris - t.pris) * 100) / 100;
        if (!bedste || besparelse > bedste.besparelse) {
          bedste = { vare: vare, tilbud: t, besparelse: besparelse };
        }
      }
    });
  });
  return bedste;
}
