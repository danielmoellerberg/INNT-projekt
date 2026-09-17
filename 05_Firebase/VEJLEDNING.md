# 05 firebase database vejledning
I dag skal vi connecte vores app til en database. Vi skal arbejde med Firebases realtime database.

## Slut produkt
Download filen `demovideo` og se hvordan app'en kan komme til at se ud

# Integration med Firebase
## Opret app'en i VSC
1. Start med at oprette et nyt projekt som vi plejer: `npx create-expo-app@latest 05_Firebase --template blank --no-agents-md`.
2. Husk at skrive `cd 05_Firebase` bagefter inden du går videre.
3. Installér følgende dependencies med `npx expo install` eller `npm install`;
   ````javascript
   # React Navigation pakker
   npm i @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
   # Peer-deps til navigation + ikoner + Firebase (Expo vælger korrekte versioner)
   npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler @expo/vector-icons expo-font firebase
   ````
4. Kør app'en: `npx expo start` eller `npx expo start --tunnel`

## Opret app struktur i VSC
### screens
1. Opret nu en `screens` mappe med følgende tre screens:
   - AddEditCar.js
   - CarDetails.js
   - CarList.js
2. Husk at importere de nødvendige komponenter fra node modules, som `Text` fra react native, præcis som I plejer at gøre + lave vores basic funktion

**Tip**
```javascript
   import React from "react";
   import { Text } from "react-native";
   import { SafeAreaView } from "react-native-safe-area-context";
   
   export default function AddEditCar() {
     return (
       <SafeAreaView>
         <Text>Add/Edit Car</Text>
       </SafeAreaView>
     );
   }
```

### database
1. Opret en mappe `database` med filen `firebase.js`. Her samler vi alt Firebase-setup ét sted, så vi undgår “require cycles”, og så både `App.js` og skærme kan importere fra samme sted
2. Kopier følgende kode ind i filen. Om lidt når vi har lavet et firebase projekt og database, får du din egen config og RTDB-URL 
```javascript
// database/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Indsæt din egen config her fra Firebase Console
const firebaseConfig = {
  apiKey: "DIN_API_KEY",
  authDomain: "DIT_PROJECT.firebaseapp.com",
  projectId: "DIT_PROJECT",
  storageBucket: "DIT_PROJECT.firebasestorage.app",
  messagingSenderId: "…",
  appId: "…",
};

// Init kun én gang
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Brug RTDB-URL’en fra Realtime Database (Belgium = europe-west1)
export const rtdb = getDatabase(
  firebaseApp,
  "https://DIT_PROJECT-default-rtdb.europe-west1.firebasedatabase.app"
);

```

### styles
1. Opret mappen `styles` med filen `GlobalStyle.js`. Her lægger vi fælles styling, så alle skærme kan bruge fx samme baggrund og spacing.
2. Du kan blot starte med dette kode:
```javascript
// styles/GlobalStyle.js
import { StyleSheet } from "react-native";

export const GlobalStyle = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e3e3e3ff" }, // fælles baggrund
  skærmIndhold: { padding: 16 },                        // standard indre padding
});
```
  
## Firebase
### Opret et projekt i Firebase:
   1. Følg dette link: https://firebase.google.com/
   2. Tryk på "Go to console" i header menuen
   3. Under Get started vælger du: "Create a new Firebase project"
   4. Giv projektet et vilkårligt navn og tryk "continue"
   5. Fjern Analytics og tryk "create project"
   6. Vent 20 sekunder mens projektet laves, og klik så på "continue"

### Opret en app i dit projekt
   1. Registrer nu en web applikation. Tryk på ⚙︎ ikonet, "Project settings" og derefter "</>" under "Your apps" - Se billedet herunder:
   <img src="FirebaseOpsætning.png"
   alt="Firebase opsætning"
   width="520">
   2. Giv applikationen et vilkårligt navn og tryk "Register app"
   3. Følg vejledningen der kommer frem. Firebase er allerede installeret, så du skal kun kopiere koden for Firebase configuration ind i din `firebase.js` — altså hele `const firebaseConfig = { ... }`
   4. Klik på "Continue to console"

### Real time database
1. Gå ind under "Build" og derefter "Realtime database", og tryk "Create database".

    <img src="RealtimeFirebase.png"
     alt="Realtime Database"
     width="200">
2. Vælg Belgium som lokation
3. Vælg "Test mode" for hurtigt setup
4. Kopier URL'en der minder om "https://DIT_PROJECT-default-rtdb.europe-west1.firebasedatabase.app" og indsæt i `firebase.js`. Dette er også siden, hvor din database kommer til at være

# Nu til koden i VSC
## App.js - Opret React navigation
1. Importer de nødvendige komponenter, som vi plejer

**Tip**
   ```javascript
      import { NavigationContainer } from "@react-navigation/native";
      import { createStackNavigator } from "@react-navigation/stack";
      import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
      import { Ionicons } from "@expo/vector-icons";
      import { SafeAreaProvider } from "react-native-safe-area-context";
      import { StyleSheet } from 'react-native';
   ```
2. Importerer firebase filen
3. Importer også dine tre screens

### Stack Navigation
1. Efter ovenstående kode på App.js, opret en Stack navigator med `const Stack = createStackNavigator();` i export funktionen (og før return)
2. Lav derefter en funktion kaldet StackNavigation, som skal returnere 3 screens. De tre `name` skal være præcis `"Car List"`, `"Car Details"` og `"Edit Car"`, og de tre komponenter er CarList, CarDetails og AddEditCar.
   - Skriv de tre navne af, præcis som de står. Senere i øvelsen slår koden op på de navne, og staver du anderledes, holder redigering op med at virke uden at der kommer en fejlmeddelelse.
   - Læg mærke til, at den sidste screen hedder `"Edit Car"`, selvom komponenten hedder AddEditCar. Den samme komponent bruges nemlig både til at tilføje og til at redigere.
   - Vi forstår godt, hvis du undrer dig over, at vi skriver komponent men det er fordi en “screen” er egentlig bare en komponent, der bruges som en skærm i navigationen.
   - Det er vigtigt at CarList placeres øverst ;) (Dette er den første skærm brugeren bliver præsenteret for)
   - Du kan også se eksempler i tidligere øvelser

**Tip**
      ```javascript
        const StackNavigation = () => (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Car List" component={CarList} />
            <Stack.Screen name="Car Details" component={???} />
            <Stack.Screen name="Edit Car" component={???} />
          </Stack.Navigator>
        );
      ```
### Tab Navigation
1. Tilføj `const Tab = createBottomTabNavigator();` oppe ved `const Stack = createStackNavigator()`
2. Gå nu til return og slet hvad der står der. Opret en `<SafeAreaProvider> </SafeAreaProvider>` med en `<NavigationContainer> </NavigationContainer>` i, som skal wrappe din Tab.navigator --> Se https://reactnavigation.org/docs/bottom-tab-navigator/ & https://reactnavigation.org/docs/navigation-container
3. I Tab.Navigator wrapperen oprettes to Tab.Screen med name og component, som henholdsvis skal være din StackNavigation og AddEditCar
4. Tilføj et ikon til Home Tab.Screen (husk at Ionicons skal importeres)

**Tip**
`<Tab.Screen name="Hjem" component={StackNavigation} options={{tabBarIcon: () => <Ionicons name="home" size={20} />,}} />`

5. Tilføj nu også et ikon til den anden Tab.Screen, hvor ikon navnet er `add` istedet for home
Nu burde du kunne trykke imellem add og stacknavigatoren "Carlist"

**Tip**
```javascript
export default function App() {

 const Stack = createStackNavigator();
 const Tab = createBottomTabNavigator();
 const StackNavigation = () => {
    return(
        <Stack.Navigator>
          <Stack.Screen "din kode her" />
          <Stack.Screen "din kode her" />
          <Stack.Screen "din kode her" />
        </Stack.Navigator>
    )
  }

return(
    <SafeAreaProvider>
      <NavigationContainer>
         <Tab.Navigator>
            <Tab.Screen "din kode her" />
            <Tab.Screen "din kode her" />
         </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
)
}
```

# GlobalStyle.js
Hvis du bruger samme navngivning som vejledningen, kan du kopiere denne kode, og så bagefter tilpasse stylingen, som du ønsker.
Ved at udfylde GlobalStyle.js allerede nu, kommer du forhåbentlig ikke til at opleve de store problemer med stylingen.
```javascript
// Fælles farver og styles
import { StyleSheet } from "react-native";

export const Farver = {
  baggrund: "#e3e3e3ff",
  kort: "#FFFFFF",
  primær: "#2563EB",
  tekst: "#111827",
  kant: "#E5E7EB",
};

export const GlobalStyle = StyleSheet.create({
  // Layout
  container: { flex: 1, backgroundColor: Farver.baggrund },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  // Afstande
  skærmIndhold: { padding: 16 },
  listeIndhold: { padding: 12 },
  række: { marginBottom: 12 },

  // Tekst
  etiket: { fontWeight: "600", marginBottom: 6 },
  værdi: { color: Farver.tekst },
  titel: { fontWeight: "600", fontSize: 16, marginBottom: 4 },

  // Inputs
  input: {
    borderWidth: 1,
    borderColor: Farver.kant,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Farver.kort,
  },

  // Kort/kasser med skygge (bruges i begge screens)
  kort: {
    backgroundColor: Farver.kort,
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    // iOS-skygge
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    // Android-skygge
    elevation: 6,
  },

  // Kun hvis du stadig vil bruge linjeopdeling et andet sted
  rækkeMedBundlinje: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Farver.kant,
  },
});
```

# AddEditCar.js – tilføj og redigér biler i Realtime Database
1. Import de nødvendige komponenter som vi plejer. Husk også at importere database og globalStyle

**Tip**
   ```javascript
   import React, { useEffect, useState, useMemo } from "react";
   import { ScrollView, View, Text, TextInput, Button, Alert } from "react-native";
   import { SafeAreaView } from "react-native-safe-area-context";
   import { rtdb } from "../database/firebase";
   import { ref, push, update } from "firebase/database";
   import { GlobalStyle as GS } from "../styles/GlobalStyle";
   ```
2. Mellem vores imports og selve vores funktion skal vi definere felter og states.
```javascript
   // Standard-felter til en bil
   const initialState = { brand: "", model: "", year: "", licensePlate: "" };
   
   // Dansk label-tekst til felterne
   const labels = {
     brand: "Mærke",
     model: "Model",
     year: "År",
     licensePlate: "Nummerplade",
   };
```
3. Nu til selve vores funktion: `export default function AddEditCar({ navigation, route }) {}`
4. Opret state og find ud af om vi redigerer.
```javascript
   export default function AddEditCar({ navigation, route }) {
  // Skærmens data (formularen)
  const [nyBil, setNyBil] = useState(initialState);

  // Er vi på "Edit Car"? (navnet skal matche App.js)
  const erRediger = useMemo(() => route?.name === "Edit Car", [route?.name]);
```
5. Brug useEffect til at forudfylde felterne ved redigering (og ryd op)
```javascript
  ???(() => {
    if (erRediger) {
      const bilObjekt = route?.params?.car?.[1]; // [id, data] → tag data
      if (bilObjekt) setNyBil({ ...initialState, ...bilObjekt });
    }
    // Ryd formularen, når skærmen lukkes
    return () => setNyBil(initialState);
  }, [erRediger]);
```
6. Tilføj en lille hjælper, der opdaterer ét felt ad gangen
```javascript
  // Opdater ét felt i state
  const ændrTekst = (nøgle, værdi) =>
    setNyBil((prev) => ({ ...prev, [nøgle]: værdi }));
```
7. Nu til øvelsens kerne hvor vi skal skrive til RTDB (realtime database). `push`gemmer og `update` opdaterer. Derudover laver vi også en simpel validering (ingen tomme felter) og viser en Alert ved fejl
```javascript
     const gem = async () => {
    const { brand, model, year, licensePlate } = nyBil;

    // Simpel validering
    if (!brand?.trim() || !model?.trim() || !String(year).trim() || !licensePlate?.trim()) {
      ??? Alert.alert("Et af felterne er tomt.");
    }

    try {
      if (erRediger) {
        const id = route?.params?.car?.[0]; // [id, data] → tag id
        if (!id) return Alert.alert("Kunne ikke finde bilens ID.");

        await update(ref(rtdb, `Cars/${id}`), { brand, model, year, licensePlate });
        Alert.alert("Bilen er opdateret.");

        // Navigér tilbage til detaljer med de opdaterede data
        navigation.navigate("Car Details", { car: [id, { ...nyBil }] });
      } ??? {
        await push(ref(rtdb, "/Cars/"), { brand, model, year, licensePlate });
        Alert.alert("Bilen er gemt.");
        setNyBil(initialState);
      }
    } catch (e) {
      Alert.alert(e?.message || "Noget gik galt.");
    }
  };
```
8. Vi er der næsten. Nu skal vi arbejde med UI. Vi bruger SafeAreaView + ScrollView og genererer felter dynamisk fra initialState
```javascript
  return (
    <SafeAreaView style={GS.container}>
      <??? contentContainerStyle={GS.skærmIndhold}>
        {Object.keys(initialState).map((nøgle) => (
          <View style={GS.række} key={nøgle}>
            <Text style={GS.etiket}>{labels[nøgle]}</Text>
            <TextInput
              value={String(nyBil[nøgle] ?? "")}
              onChangeText={(v) => ændrTekst(nøgle, v)}
              style={GS.input}
              placeholder={labels[nøgle]}
              keyboardType={nøgle === "year" ? "number-pad" : "default"}
            />
          </View>
        ))}

        <Button title={erRediger ? "Gem ændringer" : "Tilføj bil"} onPress={gem} />
      </ScrollView>
    </SafeAreaView>
  );
}
```
STÆRKT! Nu har du lavet AddEditCar.js


# CarList.js – Læs og vis biler fra Realtime Database
1. Importer de nødvendige komponenter som vi plejer + database og style

**Tip**
```javascript
   import React, { useEffect, useState } from "react";
   import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
   import { SafeAreaView } from "react-native-safe-area-context";
   import { rtdb } from "../database/firebase";
   import { ref, onValue } from "firebase/database";
   import { GlobalStyle as GS } from "../styles/GlobalStyle";
```
2. Lav export funktionen og useState
```javascript
   export default ??? CarList({ navigation }) {
   const [biler, setBiler] = useState(null); // null = indlæser
```

3. Lav nu en `useEffect` funktion, hvori der laves en if, som håndterer loading og tom liste
   ```javascript
   ???(() => {
    const carsRef = ref(rtdb, "Cars");
    const unsubscribe = onValue(carsRef, (snap) => {
      const data = snap.val();
      setBiler(data || {}); // gem som objekt (id -> bil)
    });
    return unsubscribe; // fjern lytter ved unmount
     }, []);
   
     if (biler === null) {
       ??? (
         <??? style={GS.container}>
           <View style={GS.center}>
             <ActivityIndicator />
             <Text>Indlæser biler…</Text>
           </View>
         </SafeAreaView>
       );
     }
   
     const ids = ???.keys(biler);
     const liste = Object.values(biler);
   
     if (ids.length === 0) {
       return (
         <SafeAreaView style={GS.container}>
           <View style={GS.center}>
             <???>Ingen biler endnu</Text>
           </View>
         </SafeAreaView>
       );
     }
     ```
4. Lav en const som navigerer til bilens detaljer
   ```javascript
     const vælgBil = (id) => {
       const bil = biler[id];
       navigation.???("Car Details", { car: [id, bil] });
     };
   ```
5. I return skal du lave en flatList, som er inde i en SafeAreaView 
   ```javascript
   return (
    <SafeAreaView style={GS.container}>
      <???
        data={liste}
        keyExtractor={(_, i) => ids[i]}
        contentContainerStyle={GS.listeIndhold}
        renderItem={({ item, index }) => (
          <??? style={GS.kort} onPress={() => vælgBil(ids[index])}>
            <Text style={GS.titel}>
              {item.brand || "Uden mærke"} {item.model ? `• ${item.model}` : ""}
            </Text>
            <Text>
              {item.year ? `År: ${item.year}` : ""}{" "}
              {item.licensePlate ? `• Nummerplade: ${item.licensePlate}` : ""}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
     );
   ```
Nu skulle du gerne kunne trykke på bil-modellen, du har oprettet i tidligere step og gå til car details


# CarDetails.js – vis, redigér og slet en bil
1. Importer de nødvendige komponenter, som vi plejer
```javascript
import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { rtdb } from "../database/firebase";
import { ref, remove } from "firebase/database";
import { ??? as GS } from "../styles/GlobalStyle";
```

2. Lav et `labels`-objekt på dansk mellem dine imports og din funktion, præcis som i AddEditCar.js. Springer du det over, crasher skærmen, fordi koden længere nede slår op i `labels`.
```javascript
const labels = {
  brand: "Mærke",
  model: "Model",
  year: "År",
  licensePlate: "Nummerplade",
};
```

3. Lav en `export default function` som henter data fra navigation og ligger det i useState. useState starter med at være tom
```javascript
   export ??? function CarDetails({ ??, ?? }) {
     const [bil, setBil] = ??(null);
     const id = route?.params?.car?.[0];
     const data = route?.params?.car?.[1];
```
4. Lav nu en `useEffect`, og hent bilernes values og sæt dem med `setBil(data ?? null);`. Når vi forlader screenen, skal objektet tømmes: `return () => setBil(null)`
```javascript
     useEffect(() => {
       ???(data ?? null);
       return () => setBil(null);
     }, []);
```
5. Send samme format [id, bil] videre til AddEditCar, og brug screen-navnet "Edit Car"
```const rediger = () => navigation.navigate("Edit Car", { car: [id, bil] });```

6. Vi viser en native bekræftelses-dialog (iOS/Android). På web bruger vi window.confirm som fallback. Selve sletningen er en remove på stien Cars/<id>.
```javascript
  const slet = async () => {
    try {
      await remove(ref(rtdb, `Cars/${id}`));
      navigation.goBack();
    } catch (e) {
      Alert.alert(e?.message || "Noget gik galt.");
    }
  };

  const bekræftSlet = () => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      ???.alert("Er du sikker?", "Vil du slette bilen?", [
        { text: "Annuller", style: "cancel" },
        { text: "Slet", style: "destructive", onPress: slet },
      ]);
    } ??? {
      const ok = window.confirm("Vil du slette bilen?");
      if (ok) slet();
    }
  };
```
7. Hvis ingen data er modtaget (fx direkte navigation uden params), vis en simpel besked.

**Tip**
Lav en if statement hvis ingen biler og returnér et tekst komponent, der fortæller, der ingen biler er.
```javascript
  if (!bil) {
    return (
      <SafeAreaView style={GS.container}>
        <View style={GS.center}>
          <???>Ingen data</Text>
        </View>
      </SafeAreaView>
    );
  }
```
8. Sidst men ikke mindst skal vi returnerer listen over bilerne.
```javascript
  return (
    <??? style={GS.container}>
      <ScrollView contentContainerStyle={GS.skærmIndhold}>
        {Object.entries(bil).map(([nøgle, værdi]) => (
          <View style={GS.kort} key={nøgle}>
            <??? style={GS.etiket}>{labels[nøgle] ?? nøgle}</Text>
            <Text style={GS.værdi}>{String(værdi)}</Text>
          </View>
        ))}

        <View style={{ height: 12 }} />
        <Button title="Redigér" ???={rediger} />
        <View style={{ height: 8 }} />
        <Button title="Slet" color="#d33" onPress={bekræftSlet} />
      </???>
    </SafeAreaView>
  );
}
```

Nu burde du se alle bilens informationer og kunne slette din bil. Og du burde kunne gå til edit/add screen

# Tillykke! Din app skulle gerne virke nu :) 
