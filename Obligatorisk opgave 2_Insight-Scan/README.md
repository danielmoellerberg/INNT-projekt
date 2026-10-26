# Insight-Scan

Obligatorisk opgave 2 – Innovation og ny teknologi
Daniel Møller Berg og Amalie Sharon Koefoed-Hansen

## Om appen

Insight-Scan er en app hvor man scanner sine madkvitteringer. Appen viser hvor mange penge
man har brugt i fx Netto, Rema 1000, Føtex og Lidl, giver cashback på udvalgte varer og viser
en simpel indsigt i hvad man køber – fx hvor meget der går til snacks i forhold til protein.

I opgave 2 er appen blevet en tosidet platform. Kunden scanner sine kvitteringer og optjener
cashback, og leverandører (fx et brand) kan oprette cashback-tilbud, som kunderne kan se.

Det nye i opgave 2:

- **Ægte scanning** – man tager et billede af bonen eller vælger et fra sine fotos. En AI aflæser
  butik, dato og varer, og man tjekker resultatet, før kvitteringen gemmes.
- **Regler mod snyd** – hver bon kan kun bruges én gang, den må højst være 14 dage gammel, og
  varer med cashback kan ikke rettes.
- **Billedet af bonen** – på en gemt kvittering kan man trykke på et lille billede og se den
  rigtige bon igen.
- **Butikker nær dig** – et kort over supermarkeder i nærheden. Man vælger de kæder, man handler
  i, og Tilbud kan vise kun tilbud fra de kæder.
- **Brugere og data** – login med to roller (kunde og leverandør), og alle data gemmes i Firebase
  i stedet for mock-data.

Påmindelsen fra opgave 1 er beholdt: hvis man ikke har scannet i 5 dage, får man en påmindelse
øverst i appen, fordi glemsel var det største problem i den første brugerundersøgelse.

## Links

- Kode på GitHub: [indsæt link]
- Demovideo: [indsæt link]

## Sådan starter du appen

1. Åbn en terminal i mappen `Obligatorisk opgave 2_Insight-Scan`
2. Kør `npm install`
3. Kopiér filen `.env.example` til en ny fil, der hedder `.env`
4. Indsæt nøglerne til Firebase og AI'en (OpenAI) i `.env`. Nøglerne er ikke med på GitHub
5. Kør `npx expo start --clear`
6. Scan QR-koden med Expo Go på din telefon (Expo SDK 58)

## Testbrugere

Man kan logge ind med disse to brugere:

| Rolle | E-mail | Adgangskode |
|---|---|---|
| Kunde | testbruger@insightscan.dk | InsightTest2026! |
| Leverandør (Nordmejeri) | testleverandoer@insightscan.dk | InsightTest2026! |

Kunden ser hele appen. Leverandøren ser en mock-up af leverandørsiden. Nordmejeri har oprettet
tre tilbud, så Tilbud-skærmen har indhold.

## Skærme

Ansvaret for udviklingen og kodningen af de enkelte skærme er fordelt som angivet i parentes

- **Login / Opret bruger** (Amalie) – log ind, eller opret en bruger som kunde eller leverandør
- **Hjem** (fælles) – forbrug, cashback, indsigt per kategori og liste over kvitteringer
- **Kvittering** (Daniel) – varerne på en kvittering og et lille billede af den rigtige bon
- **Billede af bon** (Daniel) – den rigtige bon i fuld størrelse
- **Scan** (Daniel) – kameraet, hvor man tager et billede af bonen eller vælger et fra sine fotos
- **Tjek kvitteringen** (Daniel) – det AI'en har aflæst, som man tjekker, før kvitteringen gemmes
- **Tilbud** (Amalie) – cashback-tilbud fra leverandørerne med filtre, fx "Mine butikker"
- **Madplan** (fælles) – idé til en AI-madplan ud fra tilbud og købsvaner (ikke bygget endnu)
- **Butikker** (Amalie) – kort over supermarkeder i nærheden og valg af de kæder, man handler i
- **Indstillinger** (Amalie) – profil, påmindelser, mine butikker og log ud
- **Leverandør** (fælles) – mock-up af leverandørsiden (billede)

Kvitteringer, brugere og tilbud gemmes i Firebase. De valgte kæder og indstillinger gemmes på
telefonen med AsyncStorage, og billedet af bonen gemmes i appens egen mappe på telefonen.
Supermarkederne på kortet hentes fra OpenStreetMap.
