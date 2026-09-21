# Insight-Scan

Obligatorisk opgave 1 – Innovation og ny teknologi
Daniel Møller Berg

## Om appen

Insight-Scan er en app hvor man scanner sine madkvitteringer. Appen viser hvor mange penge
man har brugt i Netto, Rema 1000, Føtex og Lidl, giver cashback på udvalgte varer og viser
en simpel indsigt i hvad man køber – fx hvor meget der går til snacks i forhold til protein.

Hvis man ikke har scannet i 5 dage, får man en påmindelse øverst i appen. Det er tilføjet
fordi glemsel var det største problem i min brugerundersøgelse.

## Links

- Kode på GitHub: https://github.com/danielmoellerberg/INNT-projekt/tree/main/Obligatorisk%20opgave%201_Insight-Scan
- Demovideo: https://youtu.be/RO-e5AQCrCs

## Sådan starter du appen

1. Åbn en terminal i mappen
2. Kør `npm install`
3. Kør `npx expo start`
4. Scan QR-koden med Expo Go på din telefon

## Skærme

- **Overblik** – forbrug, cashback, indsigt og liste over kvitteringer
- **Kvittering** – tryk på en kvittering for at se varerne
- **Scan** – tilføjer en ny kvittering (simuleret)
- **Cashback** – din saldo og de aktuelle tilbud

Appen bruger mock-data, så der er ingen database. Kvitteringerne gemmes kun mens appen kører.
