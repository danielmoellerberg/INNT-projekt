# CLAUDE.md – INNT-projekt

Repo til kurset **Innovation og ny teknologi (CBS)**: kursets øvelser, obligatorisk opgave 1
og obligatorisk opgave 2. Arbejdet nu er **opgave 2**. Øvelserne og opgave 1 er afleveret.

## Projektet: Insight-Scan (opgave 2)

Insight-Scan er en kvitteringsapp, der udvikles til en **tosidet platform**:

- **Kunde:** scanner madkvitteringer, får overblik over forbrug på tværs af kæder (Netto,
  Rema 1000, Føtex, Lidl), indsigt i hvad der købes, og cashback på udvalgte varer.
- **Leverandør:** (fx et brand) opretter cashback-tilbud, som kunderne kan se og optjene.

Opgave 2 bygges videre i samme mappe som opgave 1, omdøbt til `Obligatorisk opgave 2_Insight-Scan`.
Den afleverede version af opgave 1 er bevaret i git-tagget `opgave-1`. Den største ændring er,
at data nu gemmes i Firebase i stedet for at være mock-data.

**Vi er to i gruppen.** README skal angive, hvem der har kodet hvad.

## Krav fra opgavebeskrivelsen (tjekliste)

Fuld tekst: `Obligatorisk opgave 2_Insight-Scan/opgavebeskrivelse.md`. Afleveringsfrist: 26. oktober kl. 23:55.

**Kode**
- [ ] 1-2 nye knapper, som brugeren kan interagere med
- [ ] 1 ny skærm per gruppemedlem (vi er to: mindst 2 nye skærme)
- [ ] Navigation mellem skærmene (stack og/eller tabs)
- [ ] Ny funktionalitet, der understøtter innovationen (fx søgning, kamera, kort, generativ AI)
- [ ] Data gemmes eller hentes, så det ikke bare er hardcodet (Firebase eller AsyncStorage).
      En statisk datafil er **ikke** nok
- [ ] Styling i en separat fil
- [ ] Egen kommentering i koden, og koden er ændret i forhold til opgave 1
- [ ] Hvis produktet pivoteres: mindst 5 skærme i alt (en skærm må være et mockup-billede)

**Aflevering**
- [ ] README med beskrivelse, opsætning, hvem der har kodet hvad, og link til demovideo
- [ ] Demovideo
- [ ] Public GitHub-repo med link
- [ ] Zip-fil som backup, uden `node_modules`
- [ ] Rapport (max 5 normalsider): skrives af gruppen selv, ikke af Claude

## Repoets struktur

| Mappe | Indhold |
|---|---|
| `01_komponenter` | Øvelse: grundkomponenter, props, useState |
| `02_navigation` | Øvelse: bottom tabs med stack inde i en fane |
| `03_Lister/ListProject` | Øvelse: lister, `FlatList`, `fetch` fra API |
| `04_Styling_code` | Øvelse: `GlobalStyle` med `Colors`, `Pressable`-knap, ikoner i tabs |
| `05_Firebase` | Øvelse: Firebase Realtime Database (CRUD) |
| `06_FirebaseLogin` | Øvelse: Firebase Auth med AsyncStorage-persistence |
| `07_kamera_vejledning` | Øvelse: `expo-camera` og galleri |
| `08_Maps` | Øvelse: kort, lokation, AsyncStorage |
| `09_notifications` | Øvelse: notifikationer, FileSystem, Reanimated, deling |
| `Obligatorisk opgave 2_Insight-Scan` | **Opgave 2** (app-koden, `opgavebeskrivelse.md`, `database.rules.json`). Var opgave 1, afleveret version ligger i tagget `opgave-1` |
| `.claude/skills/apple-design` | Skill til designreview efter Apples retningslinjer |

Hver øvelse har en `VEJLEDNING.md` fra underviseren (fra 05 og frem). Når et mønster er i tvivl,
er vejledningen kilden.

## Hovedregel: følg kursets mønstre

- Ny kode **skal** følge de mønstre, kurset har brugt (se nedenfor). Koden skal ligne det, vi har
  lært, så den kan forklares til eksamen.
- **Spørg altid først**, før du introducerer et bibliotek, en hook eller en metode, som ikke er
  brugt i øvelserne eller i opgave 1. Foreslå, forklar hvorfor, og vent på svar.
- Installer pakker med `npx expo install`, så versionerne passer til **Expo SDK 57**.
- UI-tekst er på dansk.

**Kendte biblioteker** (må bruges uden at spørge): `@react-navigation/native`, `/bottom-tabs`,
`/stack`, `/native-stack`, `@expo/vector-icons`, `expo-font`, `firebase` (app, auth, database),
`@react-native-async-storage/async-storage`, `expo-camera`, `expo-location`, `react-native-maps`,
`expo-notifications`, `expo-device`, `expo-file-system`, `expo-sharing`, `react-native-reanimated`.
Ikke Firestore.

**Godkendt uden for kurset:** `expo-image-picker` (vælg et billede af en bon fra telefonens fotos).

## Kodekonventioner

### Struktur
```
App.js                  Navigation + AppProvider yderst + onAuthStateChanged
components/             Genbrugelige komponenter og StackComponent.js
context/AppContext.js   Fælles state (data fra Firebase)
database/firebase.js    Al Firebase-opsætning ét sted
services/ai.js          Al AI-kode (aflæsning af kvitteringer). Skærmene kender ikke udbyderen
screens/                Én fil per skærm
styles/GlobalStyle.js   Al styling
```
Kilde: opgave 1, med `database/` fra 05 og 06.

### Navigation
- `NavigationContainer` + `createBottomTabNavigator` i `App.js`. En fane med flere skærme får en
  stack (`createStackNavigator`) i en separat fil i `components/`, fx `StackComponent.js`.
  *Kilde: 02, opgave 1.*
- Fanen, der indeholder en stack, får `options={{ headerShown: false }}`, så stacken styrer
  headeren. *Kilde: opgave 1.*
- Ikoner i tab-baren: `screenOptions={({ route }) => ({ tabBarIcon: ... })}` med Ionicons.
  *Kilde: 04, 08.*
- Data til næste skærm sendes med `navigation.navigate("Navn", { ... })` og læses med
  `route.params`. *Kilde: 05, 07.*
- Login styres med `onAuthStateChanged` i `App.js`: er brugeren logget ind, vises app-navigationen,
  ellers login-skærmen. `return unsubscribe` i `useEffect`. *Kilde: 06.*

### Firebase
- Al opsætning ligger i `database/firebase.js`. *Kilde: 05, 06.*
- Init kun én gang: `getApps().length ? getApp() : initializeApp(firebaseConfig)`. *Kilde: 05.*
- Auth: `initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })`, så
  brugeren forbliver logget ind efter genstart. *Kilde: 06.*
- Database: `getDatabase(app, databaseURL)`, eksporteret som `rtdb`. *Kilde: 05.*
- Skriv med `push` (ny), `update` (ret), `remove` (slet). Læs live med `onValue` og
  `return unsubscribe` i `useEffect`. *Kilde: 05.*
- Kendt faldgrube: ændres `firebase.js` under kørsel, kan hot reload give
  `auth/already-initialized`. Løsning: genstart Metro med `npx expo start --clear`.

### Context
- `AppContext` fra opgave 1 beholdes. `AppProvider` ligger yderst i `App.js`, og skærmene henter
  data med `useApp()`.
- Data i context **hentes fra og gemmes i Firebase** (ingen mock-data). Context lytter med
  `onValue` på den indloggede brugers data og rydder op med `unsubscribe`.
- Context er **ikke undervist** i kurset. Derfor skal `AppContext.js` have ekstra forklarende
  kommentarer: hvad `createContext`, `Provider` og `useContext` gør, og hvorfor vi bruger det.

### AsyncStorage
- Bruges kun til **lokale præferencer** (fx valgte butikker), ikke til appens hoveddata.
- Gem med `JSON.stringify`, læs med `JSON.parse` og en tom standardværdi. Fast nøgle som konstant.
  Pak kald ind i `try/catch`. *Kilde: 08.*

### Hentning fra API (fx AI)
- `fetch` med `async/await`, `response.json()` og `try/catch`. *Kilde: 03.*

### Kamera, kort, lokation, notifikationer (hvis de bruges)
- Kamera: `CameraView` + `useCameraPermissions`, `useRef` til `takePictureAsync()`. *Kilde: 07, 09.*
- Kort og lokation: `MapView` + `Marker`, `requestForegroundPermissionsAsync`, plugin i `app.json`
  med dansk tilladelsestekst. *Kilde: 08.*
- Notifikationer: `components/Notifications.js`, trigger med
  `type: Notifications.SchedulableTriggerInputTypes.DAILY`. *Kilde: 09.*

### Komponenter og lister
- Skærme og komponenter er `export default function Navn()`.
- Genbrug `components/ButtonComponent.js` fra opgave 1 til knapper.
- Lister er `FlatList` med `keyExtractor`. *Kilde: 03, opgave 1.*

## Styling

**Kun én styling-fil: `styles/GlobalStyle.js`.** Ingen `theme.js` eller andre styling-filer.

- **Øverst** ligger designsystemet som eksporterede konstanter, efter samme mønster som `Colors`
  i 04: `Colors`, `Spacing`, `Radius`, `Typography` osv. Værdierne kommer fra designarbejdet med
  apple-design-skill'en.
- **Nedenunder** ligger `export const GlobalStyle = StyleSheet.create({ ... })`, som **kun** bruger
  konstanterne. Ingen løse hex-værdier eller tal, der burde være en konstant.
- Filen inddeles med tydelige kommentarsektioner i denne rækkefølge:
  1. Designværdier
  2. Fælles styles (container, kort, knapper, tekst)
  3. Én sektion per skærm
- **Ingen inline-styles**: hverken `style={{ ... }}` eller `contentContainerStyle={{ ... }}`.
  Alt går gennem `GlobalStyle`. Farver til props som `color` på Ionicons og `ActivityIndicator`
  tages fra `Colors`.

## Kommentarer

Koden skal kunne forklares til eksamen, så kommentarerne er **mere forklarende** end i
øvelserne. Alt på dansk.

- **Hver skærm** starter med en kommentar om, hvad skærmen er til.
- **Hver funktion med ikke-triviel logik** får en kommentar om, hvad den gør og **hvorfor**.
- Firebase-kald, context og navigation på tværs af faner forklares, hvor de bruges.
- Undgå at kommentere det åbenlyse (`// importer React`).

## Firebase-sikkerhed

- Opgave 2 bruger det **eksisterende Firebase-projekt `innt-projekt`** (samme som øvelse 05 og 06),
  nu med nye databaseregler.
- Databasereglerne skal **kræve login**, og brugere må **kun læse og skrive egne data**.
- Reglerne ligger i `Obligatorisk opgave 2_Insight-Scan/database.rules.json` og er indsat manuelt i
  Firebase-konsollen (Realtime Database → Regler). Databasen må ikke køre i "test mode".
- **Konsekvens:** Øvelse 05 kan ikke længere læse eller skrive `Cars/`, fordi den gør det uden
  login. Det er forventet og skal ikke rettes.
- Datamodellen skal passe til reglerne: brugerens egne data ligger under `users/{uid}/...`.
- Undtagelse: leverandørernes cashback-tilbud ligger under `offers/` og kan **læses** af alle
  indloggede brugere, men kun **skrives** af den leverandør, der har oprettet tilbuddet
  (`ownerId`). Ellers kan kunderne ikke se tilbuddene.
- Kun brugere med rollen `leverandoer` i `users/{uid}/profil/rolle` må skrive i `offers/`.
- Rollen er **låst**: den kan kun sættes én gang (ved oprettelsen) og hverken ændres eller
  slettes bagefter. Resten af profilen (navn, e-mail) kan stadig ændres. Derfor ligger
  skriveadgangen på de enkelte felter under `users/{uid}` og ikke på `users/{uid}` selv:
  `.write` arves nedad og kan ikke tages væk længere nede, og `.validate` køres ikke ved sletning.
- Kendt begrænsning: brugeren vælger stadig selv sin rolle ved oprettelsen, så reglerne kan ikke
  garantere, at en "leverandør" er en rigtig virksomhed. Det er acceptabelt i en prototype.

### Regler mod snyd med kvitteringer
- **Dubletter:** hver bon får et aftryk (butik + dato + klokkeslæt + bonens total), som gemmes i
  `aftryk/{aftryk}`. Et aftryk kan kun skrives én gang og aldrig slettes, på tværs af alle brugere.
  Kvittering og aftryk gemmes i én samlet `update` på flere stier, så begge dele gemmes eller ingen.
  En kvittering kan ikke gemmes uden et aftryk (`.validate`).
- **Ingen redigering bagefter:** en gemt kvittering kan kun oprettes eller slettes, ikke ændres.
  Sletter man den, bliver aftrykket liggende, så bonen ikke kan scannes igen.
- **Pris og antal:** antal og varenavn kan ikke rettes. Cashback beregnes ud fra AI'ens aflæsning.
  Varer med cashback er låst. Rettes en anden pris, gemmes AI'ens pris i `aiPris`.
- **Dato:** dato, klokkeslæt og total skal kunne læses, og bonen må højst være 14 dage gammel
  (`MAKS_ALDER_DAGE` i `AppContext.js`).
- **Begrænsning:** al logik kører i appen på brugerens telefon. En målrettet snyder kan skrive
  direkte til databasen med et opdigtet aftryk og cashback. Rigtig sikring kræver, at aflæsning og
  cashback beregnes på en server (fx Firebase Cloud Functions). Det er uden for kurset.

## API-nøgler og .env

- **Ingen nøgler i koden og aldrig i git.** Det gælder AI-nøglen og Firebase-konfigurationen.
- Nøgler ligger i `.env` i app-mappen med `EXPO_PUBLIC_`-prefix, fx `EXPO_PUBLIC_AI_API_KEY` og
  `EXPO_PUBLIC_FIREBASE_API_KEY`, og læses i koden med `process.env.EXPO_PUBLIC_...`.
- `.env` må **aldrig committes**. Den står i rodens `.gitignore`.
- Der skal ligge en **`.env.example`** med alle nøglenavne, men **uden rigtige værdier**.
- **README skal forklare opsætningen:** kopier `.env.example` til `.env`, indsæt egne nøgler,
  genstart Metro med `npx expo start --clear`.
- **Vigtigt at forstå:** `.env` holder nøglen ude af git, men **ikke ude af appen**. Variabler med
  `EXPO_PUBLIC_` bygges ind i app-koden, og alle med appen kan i princippet finde nøglen. Derfor:
  - Brug en **separat AI-nøgle** kun til dette projekt, som kan slettes efter eksamen.
  - Sæt et **forbrugsloft** hos AI-udbyderen.
  - Firebase beskyttes af databasereglerne, ikke af at nøglen er hemmelig.

## Må ikke røres

- `05_Firebase` (inkl. den kendte versionsfejl med `expo 46`).
- Skabelonfilerne `CLAUDE.md` og `AGENTS.md` i `02_navigation`, `03_Lister/ListProject` og
  `05_Firebase`.
- Git-tagget `opgave-1` (den afleverede version af opgave 1) må ikke flyttes eller slettes.
