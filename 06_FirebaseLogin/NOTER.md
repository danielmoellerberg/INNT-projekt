# Noter – Login-app med Firebase (06_FirebaseLogin)

Denne app lader en bruger **oprette en konto**, **logge ind** og **logge ud** igen med email og kodeord. Alt gemmes og tjekkes af Firebase, en gratis "bagvedliggende service" fra Google, som håndterer login-logikken for os, så vi ikke selv skal bygge det fra bunden.

## Det store billede

Tænk på appen som to "rum", man kan være i:

1. **Login/Opret-rummet** — det man ser, når man ikke er logget ind. Her kan man enten oprette en ny bruger eller logge ind med en eksisterende.
2. **Hoved-rummet** — det man ser, når man ER logget ind. Her viser vi bare en velkomstbesked og en "Log ud"-knap.

Appen skifter selv mellem de to rum, alt efter om man er logget ind eller ej — man skal ikke selv trykke sig hen til det ene eller det andet.

## Hvordan filerne hænger sammen

- **`database/database.js`** — Forbindelsen til Firebase. Det er her, vi fortæller appen "dette er MIT Firebase-projekt" (via en unik kode, `firebaseConfig`, som vi fik fra Firebase-hjemmesiden). Alle andre filer, der skal snakke med Firebase, henter forbindelsen herfra.

- **`components/SignUpComponent.js`** — Formularen til at **oprette** en ny bruger. To indtastningsfelter (email + kodeord) og en knap. Når man trykker på knappen, sender vi email og kodeord til Firebase, som opretter en helt ny bruger.

- **`components/LogInComponent.js`** — Formularen til at **logge ind**. Ser næsten ud som Signup, men i stedet for at oprette en ny bruger, tjekker den om email+kodeord matcher en bruger, der allerede findes.

- **`screens/AuthScreen.js`** — "Login/Opret-rummet". Viser enten Login- eller Signup-formularen (aldrig begge på én gang), og har en lille knap nederst, hvor man kan skifte mellem de to ("Har du ikke en konto? Opret en" / "Har du en konto? Log ind").

- **`screens/MainScreen.js`** — "Hoved-rummet". Viser en velkomstbesked med brugerens email og en "Log ud"-knap.

- **`style/GlobalStyle.js`** — Alt det, der bestemmer hvordan tingene ser ud (farver, runde hjørner, skrifttyper). Ved at have det ét sted, ser hele appen ensartet ud, og vi skal kun ændre farverne ét sted, hvis vi vil style om.

- **`App.js`** — Selve "hjernen" i appen. Den holder styr på, om nogen er logget ind lige nu, og viser enten Login/Opret-rummet eller Hoved-rummet ud fra det.

## Hvordan "magien" virker: automatisk skift mellem rummene

Det smarteste ved denne løsning er, at **ingen af skærmene selv skal sige "gå til den anden skærm"**. I stedet fungerer det sådan:

1. `App.js` beder Firebase om at **holde øje** med, om nogen er logget ind (dette hedder `onAuthStateChanged` i koden — tænk på det som en vagt, der konstant kigger efter om der sidder nogen logget ind).
2. Så snart nogen logger ind (via Login-formularen) eller opretter sig (via Signup-formularen), opdager denne "vagt" det med det samme.
3. `App.js` reagerer automatisk på det og skifter fra at vise Login/Opret-rummet til at vise Hoved-rummet — ligesom en dør, der åbner sig af sig selv, når nogen viser det rigtige adgangskort.
4. Trykker man "Log ud", opdager vagten det igen, og døren lukker sig — man ender tilbage ved Login/Opret-rummet.

Det er grunden til, at hverken `Login`- eller `Signup`-komponenten selv behøver at "navigere" nogen steder hen efter et vellykket login — de opretter/logger bare ind, og `App.js` klarer resten.

## Hvorfor gemmer appen, at man er logget ind, selvom man lukker den?

I filen `database/database.js` bruger vi noget, der hedder `AsyncStorage` — det er lidt ligesom appens egen lille hukommelse på telefonen. Uden det ville man skulle logge ind hver eneste gang, man åbnede appen igen. Med det husker telefonen, at man var logget ind, indtil man selv trykker "Log ud".

## Fejlhåndtering: hvad sker der, hvis noget går galt?

Både Signup og Login er pakket ind i noget, der hedder `try/catch` i koden. Det er en sikkerhedsforanstaltning: "**prøv** at gøre dette — men hvis det fejler, **fang** fejlen i stedet for at lade appen gå ned". Fejler login (fx forkert kodeord) eller signup (fx email allerede i brug), viser appen i stedet en lille pop-up-besked med hvad der gik galt, så brugeren kan prøve igen.

## Kort opsummering af hele flowet

1. Bruger åbner appen → er ikke logget ind → ser Login/Opret-rummet.
2. Bruger trykker "Opret en" → udfylder email+kodeord → trykker "Opret bruger" → Firebase opretter brugeren.
3. Bruger trykker "Log ind" (eller er allerede logget ind fra signup, afhængig af flow) → udfylder email+kodeord → trykker "Log ind" → Firebase bekræfter, det er en rigtig bruger.
4. `App.js`'s "vagt" opdager, at nogen nu er logget ind → appen skifter automatisk til Hoved-rummet.
5. Bruger ser sin egen email og en "Log ud"-knap.
6. Trykker bruger "Log ud" → Firebase logger brugeren ud → "vagten" opdager det → appen skifter automatisk tilbage til Login/Opret-rummet.
