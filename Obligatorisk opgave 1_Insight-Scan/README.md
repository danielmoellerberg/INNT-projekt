# Insight-Scan

Individuel godkendelsesopgave – Innovation og ny teknologi (React Native / Expo).

## Om appen

**Insight-Scan** er en app, hvor brugeren scanner sine madkvitteringer og får indsigt i sit
handlemønster på tværs af kæderne Netto, Rema 1000, Føtex og Lidl – samtidig med at appen
automatisk finder cashback på udvalgte varer.

**Primært budskab:** Tjen og spar penge på det du alligevel køber.
**Sekundært:** Få indsigt i hvad du spiser – fx hvor stor en del af budgettet der går til
snacks kontra kød/protein, hvilket er relevant hvis man træner og holder øje med kosten.

**Målgruppe:** Bred – folk der vil spare eller tjene penge på deres indkøb, folk der træner
og holder øje med kosten, og studerende med et stramt madbudget.

### Sådan virker den

1. **Overblik** – viser samlet forbrug for ugen, forbrug fordelt per kæde, optjent cashback,
   en kort indsigt (snacks vs. protein, og hvilken kæde der er billigst per indkøb) samt en
   liste over alle scannede kvitteringer.
2. **Kvittering** – tryk på en kvittering i listen for at se alle varelinjer grupperet i
   kategorier (frugt/grønt, kød/protein, mejeri, snacks, drikkevarer, andet). Varer der har
   udløst cashback er markeret med et gult mærke.
3. **Scan** – knappen "Scan kvittering" simulerer et AI-udtræk af en kvittering: der er en kort
   indlæsning, hvorefter en ny kvittering tilføjes, varerne matches mod cashback-tilbuddene,
   beløbet lægges til saldoen, og appen navigerer tilbage til overblikket.
4. **Cashback** – viser brugerens cashback-saldo og en liste over aktuelle tilbud, inkl. om
   brugeren allerede har købt den pågældende vare.

Data er mock-data (`data/const.js`) – appen har ingen backend, og kvitteringer gemmes kun i
appens hukommelse, mens den kører.

## Sådan kører du appen

```bash
cd Insight-Scan
npm install
npx expo start
```

Scan derefter QR-koden med **Expo Go** på din telefon, eller tryk `i` / `a` i terminalen for
at åbne appen i iOS-simulator / Android-emulator.

Hvis telefonen ikke kan få forbindelse til computeren, kan du prøve:

```bash
npx expo start --tunnel
```

## Demovideo

Link til demovideo: _(indsæt link her)_

## Projektstruktur

```
Insight-Scan/
├── App.js                      # Navigation (bottom tabs) + AppProvider
├── components/
│   ├── ButtonComponent.js      # Genbrugelig knap (primary/secondary)
│   └── StackComponent.js       # Stack-navigation: Overblik -> Kvittering
├── context/
│   └── AppContext.js           # Fælles state: kvitteringer, cashback-saldo, tilbud
├── data/
│   └── const.js                # Mock-data: kvitteringer og cashback-tilbud
├── screens/
│   ├── OverblikScreen.js       # Nøgletal, indsigt og liste over kvitteringer
│   ├── KvitteringScreen.js     # Varelinjer grupperet i kategorier
│   ├── ScanScreen.js           # Simuleret AI-scanning af kvittering
│   └── CashbackScreen.js       # Saldo og liste over cashback-tilbud
└── styles/
    └── GlobalStyle.js          # Al styling og farvepalet samlet ét sted
```

## Teknik

- **Expo (SDK 57)** med React Native
- **React Navigation** – bottom tabs med en nested stack-navigator
- **React Context + useState** – så nye kvitteringer og cashback slår igennem i hele appen
- **FlatList** – til lister over kvitteringer og cashback-tilbud
- **@expo/vector-icons (Ionicons)** – ikoner i tab-baren og på scan-skærmen
- Al styling ligger i `styles/GlobalStyle.js` – der er ingen inline-styles i skærmene
