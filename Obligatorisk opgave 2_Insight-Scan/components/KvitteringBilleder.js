// KvitteringBilleder: gemmer billedet af en bon lokalt på telefonen (mønster fra Library.js i øvelse 09).
// Billedet fra kameraet eller galleriet ligger kun i en midlertidig mappe, som telefonen selv
// kan rydde. Derfor kopieres det til appens egen mappe (documentDirectory), hvor det bliver liggende.
//
// Hvorfor ikke i Firebase? Realtime Database er lavet til små data, ikke billeder, og Firebase
// Storage er ikke brugt i kurset. Ulempen er, at billedet kun findes på den telefon, der scannede
// bonen. Selve kvitteringen (butik, dato, varer) ligger stadig i Firebase.
//
// Filen hedder det samme som kvitteringens id i Firebase, så billedet kan findes igen
// uden at gemme stien nogen steder.

import * as FileSystem from "expo-file-system/legacy";

const MAPPE = FileSystem.documentDirectory + "kvitteringer";

// Opretter mappen første gang, et billede gemmes
async function sikrMappe() {
  const info = await FileSystem.getInfoAsync(MAPPE);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(MAPPE, { intermediates: true });
  }
}

// Kopierer billedet (uri fra kameraet eller galleriet) til appens mappe under kvitteringens id
export async function gemKvitteringBillede(id, uri) {
  await sikrMappe();
  await FileSystem.copyAsync({ from: uri, to: `${MAPPE}/${id}.jpg` });
}

// Finder billedet til en kvittering. Giver null, hvis der ikke er et billede,
// fx for kvitteringer gemt før denne funktion, eller scannet på en anden telefon.
export async function hentKvitteringBillede(id) {
  const sti = `${MAPPE}/${id}.jpg`;
  const info = await FileSystem.getInfoAsync(sti);
  return info.exists ? sti : null;
}
