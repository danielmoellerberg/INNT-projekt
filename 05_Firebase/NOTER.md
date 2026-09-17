# Noter – Firebase-opgave (05_Firebase)

## Trin 1: Opsætning og tjek af projektet

Vi kørte `create-expo-app` for at oprette `05_Firebase` inde i det eksisterende git-repo (ikke sit eget repo — derfor ingen `.git`-mappe i undermappen). Vi tjekkede at `package.json` indeholder de pakker, appen skal bruge:

- **firebase** – SDK til at forbinde til Firebase (her: Realtime Database).
- **@react-navigation/native**, **/stack**, **/bottom-tabs** – navigation mellem skærme (stack = skub skærme ovenpå hinanden, bottom-tabs = faneblade i bunden).
- **react-native-screens**, **react-native-safe-area-context**, **react-native-gesture-handler** – underliggende afhængigheder React Navigation kræver for native performance og korrekt layout omkring notch/statusbar.
- **@expo/vector-icons** – ikoner, fx til tab-baren.

## Trin 2: App-struktur

Vi oprettede tre mapper:

- **screens/** med `AddEditCar.js`, `CarDetails.js`, `CarList.js` — hver returnerer indtil videre bare en `SafeAreaView` med en `Text`, der viser skærmens navn. Det er "skeletter" vi bygger videre på, når navigation og Firebase kobles på.
- **database/firebase.js** — samler al Firebase-opsætning ét sted (config + `initializeApp`) med placeholder-værdier, som erstattes med den rigtige Firebase-config i næste trin.
- **styles/GlobalStyle.js** — en fælles styling-fil med et `Farver`-objekt og et `StyleSheet` med genbrugelige klasser (container, center, skærmIndhold, listeIndhold, række, etiket, værdi, titel, input, kort, rækkeMedBundlinje), så skærmene kan dele det samme visuelle sprog.

**Vigtige begreber:**

- **Require cycle:** Hvis to filer importerer fra hinanden (direkte eller via en kæde af imports), kan JavaScript ende i en cirkulær afhængighed, hvor modulerne ikke er færdig-indlæst når de bruges. Ved at samle Firebase-opsætningen i én dedikeret fil (`database/firebase.js`), som andre filer kun importerer *fra* (aldrig omvendt), undgår vi at skabe sådan en cyklus.
- **`getApps().length ? getApp() : initializeApp(...)`:** Firebase må kun initialiseres én gang pr. app. `getApps()` returnerer en liste over allerede initialiserede Firebase-apps. Er listen tom (`length` er 0), initialiserer vi en ny app med `initializeApp(firebaseConfig)`. Er der allerede en, henter vi den eksisterende med `getApp()` i stedet for at oprette en ny. Dette beskytter mod fejlen "Firebase App named '[DEFAULT]' already exists", som typisk opstår ved hot-reload i udvikling.
- **Fælles GlobalStyle-fil:** Ved at definere farver og layout ét sted undgår vi at gentage de samme StyleSheet-regler i hver skærm. Det gør det nemt at ændre f.eks. appens hovedfarve ét sted og få det opdateret overalt, og det sikrer et ensartet visuelt udtryk på tværs af skærmene.

## Trin 3: Rigtig Firebase-config

Vi erstattede placeholder-værdierne i `database/firebase.js` med den rigtige `firebaseConfig` fra Firebase-konsollen (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId) samt den rigtige Realtime Database-URL (`databaseURL`). Bemærk at `databaseURL` ikke er en del af det standard-snippet Firebase-konsollen viser for en "web app" — den skal hentes separat fra Realtime Database-sektionen, fordi den peger specifikt på RTDB-instansen (og ikke bare projektet generelt).

## Trin 4: App.js — React Navigation opsætning

Vi byggede `App.js` efter vejledningens mønster for navigation:

- **StackNavigation** (en `createStackNavigator()`) med tre skærme i rækkefølgen `"Car List"` → `"Car Details"` → `"Edit Car"`, som viser hhv. `CarList`, `CarDetails` og `AddEditCar`.
- **Tab.Navigator** (en `createBottomTabNavigator()`) med to faner: `"Hjem"` (viser hele StackNavigation, ikon `home`) og `"Tilføj"` (viser `AddEditCar` direkte, ikon `add`).
- Det hele er pakket ind i `SafeAreaProvider` (for korrekt layout omkring notch/statusbar) og `NavigationContainer` (holder styr på navigations-tilstanden for hele appen).
- Vi importerer firebase-filen i `App.js`, selvom den ikke bruges direkte der endnu — det sikrer at Firebase bliver initialiseret så snart appen starter.

**Dobbelt-header-problemet:** Uden justering ville man se to headere oven på hinanden — Tab-navigatorens egen header ("Hjem") oven på Stack-navigatorens header ("Car List"). Vi satte oprindeligt `screenOptions={{ headerShown: false }}` på `Tab.Navigator`. Efter at have sammenlignet med `VEJLEDNING.md` (se Trin 5) rettede vi det til at matche vejledningen: `headerShown: false` sidder nu på **Stack.Navigator** i stedet. Det betyder at det er Tab-headeren ("Hjem"/"Tilføj"), der vises, mens Stack-skærmenes egne headere ("Car List", "Car Details", "Edit Car") er skjulte.

**Vigtige begreber:**

- **Stack vs. Tab, og hvorfor Stack ligger inde i Tab:** Tab-navigation er det yderste lag — faste faneblade til at skifte mellem helt separate dele af appen, uden nogen "tilbage"-historik. Stack-navigation er til skærme, der hænger logisk sammen i rækkefølge (liste → detalje → rediger), hvor man kan navigere frem og tilbage. "Hjem"-fanen dækker over flere sammenhængende skærme, så den får sin egen Stack indeni; "Tilføj" er kun én skærm og har ikke brug for det.
- **Hvorfor skærmnavnene skal staves præcis rigtigt:** `navigation.navigate("Car Details")` matcher på en streng, ikke et komponentnavn — det er en nøgle i navigatorens interne opslagstabel. `AddEditCar` læser desuden `route.name` for at vide, om den bliver vist som "Tilføj" eller "Edit Car", så en stavefejl ville få den til at opføre sig forkert eller slet ikke blive fundet.
- **Genbrug af `AddEditCar` til både "Tilføj" og "Edit Car":** Formularen til at oprette og redigere en bil er identisk i felter og layout — forskellen er kun om der findes data at forudfylde, og om Firebase-kaldet skal oprette eller opdatere. Komponenten kan derfor kigge på `route.name` (og evt. `route.params`, fx et bil-id) for at afgøre sin tilstand, i stedet for at vi duplikerer koden i to separate komponenter.

## Trin 5: Sammenligning med VEJLEDNING.md og rettelser

Kursets vejledning blev lagt i `VEJLEDNING.md`. Vi sammenlignede det, vi havde bygget, med den og rettede fire afvigelser, så koden matcher vejledningens navngivning og struktur:

1. **`database/firebase.js`:** Skiftet fra én default-agtig eksport (`database`) til vejledningens to named exports `firebaseApp` og `rtdb`. RTDB-URL'en gives nu som **andet argument** til `getDatabase(firebaseApp, url)` i stedet for at ligge som `databaseURL`-felt i `firebaseConfig`. Dette er ikke kun kosmetisk — senere skærme (`AddEditCar`, `CarList`, `CarDetails`) importerer `{ rtdb }` fra denne fil, så uden rettelsen ville de imports fejle.
2. **`styles/GlobalStyle.js`:** Skiftet fra default export til named export (`export const GlobalStyle = ...`), og `Farver`/style-indholdet er opdateret til at matche vejledningens værdier præcist. Skærmene importerer senere `{ GlobalStyle as GS }`, som kun virker med en named export.
3. **`screens/*.js`:** `SafeAreaView` importeres nu fra `react-native-safe-area-context` (som vejledningen viser) i stedet for fra `react-native`. De to er ikke identiske — versionen fra `react-native-safe-area-context` tager højde for enhedens sikre områder (notch, home-indicator), hvilket er hele pointen med at have pakken installeret.
4. **`App.js`:** `headerShown: false` er flyttet fra `Tab.Navigator` til `Stack.Navigator`, så det matcher vejledningens tip. Import af firebase-filen er rettet til at bruge de nye navne (`firebaseApp`, `rtdb`).

**Vigtigt begreb:** En **named export** (`export const X = ...`) skal importeres med tuborg-klammer og præcis samme navn: `import { X } from "..."`. En **default export** (`export default X`) importeres uden klammer og kan kaldes hvad som helst ved import: `import HvadSomHelst from "..."`. Blander man de to typer forkert, får man ikke en fejl med det samme — man får bare `undefined`, hvilket typisk crasher længere nede i koden, når man forsøger at bruge den `undefined`-værdi. Det er præcis det, der var galt i punkt 1 og 2 ovenfor.

## Trin 6: AddEditCar.js — tilføj og redigér biler i Realtime Database

Vi udfyldte `screens/AddEditCar.js` efter vejledningens ???-huller:

- **useEffect-hullet:** Forudfylder formularen med bilens data, når skærmen bruges til redigering, og rydder formularen op igen, når skærmen forlades (se forklaring om oprydningsfunktion nedenfor).
- **`} ??? {`:** Blev til en almindelig `else` — adskiller "opdatér eksisterende bil" (`erRediger` er sand) fra "opret ny bil" (ellers).
- **UI-containeren:** `ScrollView` med `contentContainerStyle={GS.skærmIndhold}`, så formularen kan scrolles, hvis tastaturet fylder for meget af skærmen.

**Fejl i vejledningen, som vi rettede:** Ved valideringen stod der `??? Alert.alert("Et af felterne er tomt.");` uden noget foran. Uden et `return` ville koden vise fejlbeskeden, men *fortsætte* ned i `try`-blokken og gemme bilen i Firebase alligevel — selvom valideringen fejlede. Vi tilføjede `return` foran `Alert.alert(...)`, så funktionen stopper med det samme ved en tom validering.

**Vigtige begreber:**

- **`initialState` og `labels` + `Object.keys().map()`:** `initialState` definerer hvilke felter en bil har og deres tomme startværdi. `labels` oversætter feltnavnene til dansk visningstekst. I stedet for at skrive et `<TextInput>` for hvert felt manuelt, genererer vi dem dynamisk med `Object.keys(initialState).map(...)` — tilføjer man et nyt felt til `initialState`/`labels`, dukker det automatisk op i UI'et.
- **`erRediger` (useMemo + route.name):** Afgør om skærmen bruges til at redigere (`route.name === "Edit Car"`) eller tilføje en ny bil. `useMemo` sørger for, at denne sammenligning kun genberegnes, når `route.name` faktisk ændrer sig.
- **useEffect ved redigering og oprydningsfunktionen:** Når `erRediger` er sand, hentes bilens eksisterende data fra `route.params.car[1]` og lægges i formularens state. `useEffect`'s return-funktion (`() => setNyBil(initialState)`) er en oprydningsfunktion, som React kalder når skærmen forlades — uden den ville formularen "huske" den sidst redigerede bil, næste gang man åbnede "Tilføj"-skærmen.
- **`push` vs. `update`, og stien `Cars/${id}`:** `push` opretter et nyt datapunkt under `Cars` og lader Firebase generere et unikt id automatisk (bruges ved oprettelse). `update` skriver til en kendt, eksisterende sti uden at slette andre felter (bruges ved redigering). `Cars/${id}` er en template literal, der sætter det faktiske bil-id ind i stien, så vi rammer præcis den rigtige bils "mappe" i databasen.
- **Hvorfor `route.params.car` er `[id, data]`:** Firebase gemmer hver bil under et genereret id, som ikke er en del af selve bil-objektet. For at kunne både vise/redigere bilen (kræver `data`) og vide, hvor den skal gemmes/opdateres i databasen (kræver `id`), sendes begge dele sammen som et lille array, når man navigerer mellem skærmene.

## Trin 7: CarList.js — læs og vis biler fra Realtime Database

Vi udfyldte `screens/CarList.js`'s ni `???`-huller (`function`, `useEffect`, `return`, `SafeAreaView`, `Object`, `Text`, `navigate`, `FlatList`, `TouchableOpacity`) — de matchede alle vejledningens forventede struktur uden afvigelser.

**Vigtige begreber:**

- **`onValue` og selv-opdaterende liste:** `onValue(carsRef, callback)` sætter en live lytter op på `"Cars"`-stien. Modsat et engangs-`get()` kalder den sin callback igen, hver gang data ændrer sig i databasen — uanset hvem der lavede ændringen. Derfor opdaterer listen sig selv i realtid, uden at vi selv skal genindlæse noget.
- **`useEffect` returnerer `unsubscribe`:** `onValue` giver en funktion tilbage, der fjerner lytteren igen. Returneres den fra `useEffect`, kalder React den automatisk som oprydning, når skærmen forlades. Glemmer man det, hober lyttere sig op for hver gang man besøger skærmen igen — et memory leak, der gradvist gør appen langsommere.
- **De tre tilstande (`null`, tomt objekt, data):** `biler === null` betyder "har ikke svaret endnu" (vis loading). `setBiler(data || {})` sikrer, at et tomt svar fra Firebase bliver til `{}` og ikke `null`, så vi kan skelne det fra "endnu ikke svaret" og vise "Ingen biler endnu". Er der data, vises listen.
- **`Object.keys`/`Object.values` + index:** Firebase gemmer biler som `{id: data}`. `FlatList` skal bruge et array (`Object.values`), men vi skal stadig kunne finde det rigtige id. Da `Object.keys()` og `Object.values()` på samme objekt returnerer i samme rækkefølge, kan `ids[index]` bruges til at slå det korrekte id op, når man trykker på et kort (`vælgBil`) eller når `keyExtractor` skal identificere rækken.
- **`FlatList` frem for `.map()` i `ScrollView`:** `ScrollView` renderer alle elementer med det samme, uanset synlighed. `FlatList` bruger virtualisering — kun de (næsten) synlige elementer renderes — hvilket gør den langt mere effektiv til lister, der kan blive lange.

## Trin 8: CarDetails.js — vis, redigér og slet en bil

Vi udfyldte `screens/CarDetails.js`'s `???`-huller. Ingen afvigelser fra vejledningen.

**Vigtige begreber:**

- **`id`/`data` fra `route.params.car`:** Samme `[id, data]`-mønster som i `AddEditCar` — splittes op til hhv. Firebase-stien (`id`) og visningsdata (`data`).
- **useEffect med tom dependency-array:** Kører kun én gang, når skærmen først vises, og lægger den modtagne data i state. Oprydningsfunktionen (`setBil(null)`) sikrer at gamle data ikke "spøger" ved næste besøg på skærmen.
- **`rediger` sender til `"Edit Car"`:** Navnet afgør, at `AddEditCar` forudfylder formularen i stedet for at starte tom.
- **`remove(ref(rtdb, \`Cars/${id}\`))`:** Sletter bilen permanent på dens præcise sti i databasen.
- **Platform-forgrening i `bekræftSlet`:** Native `Alert.alert` med flere knapper findes kun på iOS/Android; på web bruges i stedet browserens `window.confirm`, som er en synkron ja/nej-dialog.
- **`Object.entries(bil).map(...)`:** Genererer automatisk et kort pr. felt i bil-objektet (etiket + værdi) — samme dynamiske princip som i `AddEditCar`, men her bruges `entries` fordi vi skal bruge både nøgle og værdi.
- **`if (!bil) return ...`:** Beskytter mod at appen crasher, hvis skærmen tilgås uden data at vise.
