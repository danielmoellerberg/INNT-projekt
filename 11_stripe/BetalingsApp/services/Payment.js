import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

// Åbner Stripes betalingsside i en browser oven på appen og venter, til brugeren lukker den.
// Vi har ingen server og ingen nøgler i appen: betalingslinket er bare en almindelig webadresse.
export default async function betal(betalingsLink) {
  // 1. Retur-adressen bygges ud fra appens scheme ("betalingsapp" i app.json),
  //    så browseren ved, hvilken app den skal sende brugeren tilbage til.
  const returUrl = Linking.createURL("kvittering");

  // 2. openAuthSessionAsync venter, til vinduet lukkes, på både iOS og Android.
  //    openBrowserAsync ville på Android vende tilbage med det samme, før brugeren har betalt.
  const resultat = await WebBrowser.openAuthSessionAsync(betalingsLink, returUrl);

  // 3. Resultatet er fx { type: "cancel" }, når brugeren selv har lukket vinduet.
  return resultat;
}
