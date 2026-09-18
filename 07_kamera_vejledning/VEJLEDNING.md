# 07_kamera_vejledning
I denne guide skal vi arbejde med kameraet i en React Native-app. Vi bruger `expo-camera` til at tage billeder og viser dem i appens eget galleri. Tryk på et billede for at åbne det på en separat skærm.

Dette er en udfyldningsøvelse: Alle `???` skal erstattes med din egen kode, før det pågældende trin kan køres. Galleriet viser billeder fra den aktuelle session; det læser ikke telefonens billedbibliotek og gemmer ikke billedlisten mellem genstarter.

Læs dokumentationen her:
- https://docs.expo.dev/versions/latest/sdk/camera/
- https://reactnavigation.org/docs/getting-started/
- https://reactnavigation.org/docs/stack-navigator/

## Start med at sætte dit projekt op

Brug en opdateret Node.js LTS-version og en fysisk Android-telefon eller iPhone med Expo Go. Kontrollér Node-versionen med `node --version`, og se minimumskravet for din Expo SDK-version i [Expo-dokumentationen](https://docs.expo.dev/versions/latest/). Kameraet skal testes på telefonen. Projektets Expo SDK skal være understøttet af den installerede Expo Go-version.

1. Opret et nyt projekt
  ````sh
   npx create-expo-app@latest CameraApp --template blank
  ````
2. Naviger ind i din projektmappe
  ````sh
  cd CameraApp
  ````
3. Installer navigation og de nødvendige pakker:
  ````sh
  npm install @react-navigation/native @react-navigation/stack
  npx expo install expo-camera @expo/vector-icons react-native-screens react-native-safe-area-context react-native-gesture-handler @react-native-masked-view/masked-view
  ````

`--template blank` giver et projekt med `App.js`, som denne øvelse bruger. `npx expo install` vælger versioner, der passer til projektets Expo SDK. Vi bruger Stack Navigation; der er ikke brug for bottom tabs eller `expo-image-picker` i denne øvelse.

## Tilføj kameraets plugin i app.json

Tilføj følgende `plugins`-indhold under den eksisterende `expo`-nøgle. Behold resten af filen, herunder `name`, `slug` og platformindstillinger. Hvis `plugins` allerede findes, tilføjer du kameraet til den eksisterende liste. Eksemplet viser kun den del, du skal tilføje:

````json
{
  "expo": {
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Tillad $(PRODUCT_NAME) at bruge kameraet til at tage billeder",
          "recordAudioAndroid": false
        }
      ]
    ]
  }
}
````

Øvelsen tager kun stillbilleder og bruger ikke mikrofonen. I Expo Go bruger du Expo Go-appens kameratilladelse. Pluginets egne indstillinger træder i kraft, når du bygger din egen app; runtime-tilladelsen skal stadig håndteres i koden nedenfor.

# Opret appens skelet 
1. Opret to mapper i roden af dit projekt ved navn screens og style
2. Naviger ind i screens og opret to filer:
  - CameraTest.js
  - ImageScreen.js
3. Naviger ind i style og opret en fil:
  - GlobalStyle.js
Indsæt følgende styling - vi kommer til at bruge det løbende.
  ````jsx
  import { StyleSheet } from 'react-native';
   
  const GlobalStyles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
      },
      img: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
      },
      safeview: {
        backgroundColor: 'black',
        flex: 1,
        width: '100%',
      },
      camera: {
        flex: 1,
        width: '100%',
      },
      cameraContainer: {
        flex: 1,
        width: '100%',
        position: 'relative',
      },
      buttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
        backgroundColor: 'transparent',
      },
      text: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
        alignSelf: 'center',
      },
      disabled: {
        opacity: 0.4,
      },
      gallery: {
        height: 130,
        paddingVertical: 10,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
      },
      snapbtn: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        height: 80,
        width: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      },
      btn: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderRadius: 40,
        padding: 12,
        alignSelf: 'center',
      },
    });
  
    export default GlobalStyles;
  ````
  
4. Indsæt følgende i de to filer. Når du har oprettet navigationen i næste afsnit, kan du teste skærmskiftet.
  #### CameraTest.js:
  ````
  import React from 'react';
  import { Button, StyleSheet } from 'react-native';
  import { SafeAreaView } from 'react-native-safe-area-context';
  
  export default function CameraTest({ navigation }) {
    return (
      <SafeAreaView style={styles.container}>
        <Button
          title="Gå til billedskærm"
          onPress={() => navigation.navigate('image')}
        />
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  ````
  #### ImageScreen.js:
  ````
  import React from 'react';
  import { Text, StyleSheet } from 'react-native';
  import { SafeAreaView } from 'react-native-safe-area-context';
  
  export default function ImageScreen() {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Image Screen</Text>
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center', // centrer lodret
        alignItems: 'center',     // centrer vandret
        backgroundColor: '#fff',
      },
    });
  ````

## Opret Stack Navigation i App.js
Formålet er at kunne navigere mellem de to skærme.
Du kan læse om Stack Navigator her: https://reactnavigation.org/docs/stack-navigator/

1. Importer `NavigationContainer` fra `@react-navigation/native` og `createStackNavigator` fra `@react-navigation/stack`.
2. Importer de to skærme fra `./screens/CameraTest` og `./screens/ImageScreen`.
3. Opret `Stack` med `createStackNavigator()` uden for `App`-funktionen.
4. Udfyld navigationen med `NavigationContainer`, `Stack.Navigator` og `Stack.Screen`. Behold skærmnavnene `home` og `image`, som bruges i resten af øvelsen.

`GestureHandlerRootView` understøtter navigationens bevægelser, og `SafeAreaProvider` leverer oplysninger om telefonens skærmkanter til `SafeAreaView`.

**Hint:** 
````jsx
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// Tilføj selv imports til navigationen og de to skærme.

const Stack = ???();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <???>
          <???>
            <??? name="home" component={???} options={{ headerShown: false }} />
            <??? name="image" component={???} options={{ title: 'Billede' }} />
          </???>
        </???>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
````

## Test navigationen

Start din app og test, om knappen åbner billedskærmen, og om du kan gå tilbage.
````sh
npx expo start
````

Åbn projektet i Expo Go ved at scanne QR-koden. Telefonen og computeren skal normalt være på samme netværk. Hvis netværket blokerer forbindelsen, kan du prøve `npx expo start --tunnel`.

Hvis navigationen ikke virker, så kontrollér installationen, dine imports og skærmnavnene. Du kan kontrollere pakkeversionerne med `npx expo install --check` og genstarte Metro med `npx expo start --clear`.

## Hvis din navigation virker - Arbejd videre i CameraTest.js

### 1. Importer nødvendige moduler
- useState, useRef, useEffect: React hooks til state, en reference til kameraet og reaktion på skærmskift.
- useIsFocused: fortæller, om kameraskærmen er den aktive skærm.
- Komponenter: De nødvendige React Native-komponenter.
- CameraView: selve kameraet (fra expo-camera).
- useCameraPermissions: spørger brugeren om tilladelse til at bruge kameraet.
- Ionicons: små ikoner til knapperne.
- GlobalStyle: vores egne CSS-lignende styles.
  
  ````jsx
  import React, { useState, useRef, useEffect } from 'react';
  import {
    Alert,
    Button,
    Text,
    TouchableOpacity,
    View,
    Image,
    ScrollView,
    Linking,
  } from 'react-native';
  import { useIsFocused } from '@react-navigation/native';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import { CameraView, useCameraPermissions } from 'expo-camera';
  import GlobalStyle from '../style/GlobalStyle';
  import Ionicons from '@expo/vector-icons/Ionicons';
  ````
### 2. State og permission

Behold `export default function CameraTest({ navigation }) { ... }` fra dit skærmskelet. Erstat funktionens gamle indhold med trinnene nedenfor. Imports står øverst i filen; alle hooks, funktioner og den afsluttende `return` nedenfor skal stå inde i `CameraTest`.

Opret den state, du skal bruge:
- facing: om kameraet vender front/back.
- permission: tilladelse til kamera.
- imagesArr / setImagesArr: en liste af billeder, som starter med `[]`.
- loading / setLoading: om appen tager et billede, starter med `false`.
- gallery / setGallery: om galleriet vises, starter med `false`.
- cameraRef: reference til kameraet, oprettet med `useRef(null)`.
- cameraReady / setCameraReady: om kameraet er klar til at tage billeder.
- isFocused: om kameraskærmen er aktiv.

  Hint:
  ````jsx
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission, getPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const isFocused = useIsFocused();
  // Opret selv imagesArr, loading, gallery og cameraRef her.

  useEffect(() => {
    if (!isFocused) {
      setCameraReady(false);
    }
  }, [isFocused]);
  ````

Alle hooks skal stå før de tidlige `return`-udtryk i næste trin. Vi nulstiller `cameraReady`, når skærmen forlades. I trin 7 fjerner vi selve `CameraView`, mens billedskærmen er åben, så kameraet frigives. Kun kameravisningen fjernes; billedlisten bevares på kameraskærmen.

### 3. Håndtering af tilladelser
Hvis appen ikke har fået kamera-tilladelse, skal vi spørge brugeren:

````jsx
if (!permission) return <View style={GlobalStyle.container} />;

if (!permission.granted) {
  return (
    <SafeAreaView style={GlobalStyle.container}>
      <Text style={GlobalStyle.text}>Appen skal have adgang til kameraet.</Text>
      {permission.canAskAgain ? (
        <Button onPress={requestPermission} title="Giv kameratilladelse" />
      ) : (
        <>
          <Text style={GlobalStyle.text}>
            Aktivér kamera i indstillingerne. Vend tilbage, og tjek tilladelsen igen.
          </Text>
          <Button onPress={() => Linking.openSettings()} title="Åbn indstillinger" />
          <Button onPress={getPermission} title="Tjek tilladelse igen" />
        </>
      )}
    </SafeAreaView>
  );
}
````

Opgave: Tilpas selv afstand og tekstplacering på tilladelsesskærmen. I Expo Go ændrer du kameratilladelsen for Expo Go.

### 4. Kamera-funktioner

#### - Funktion til at skifte kamera
````jsx
function toggleFacing() {
  if (loading) return;
  setCameraReady(false);
  setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
}
````

I trin 7 får kameraet `key={facing}`, så det oprettes på ny ved skift mellem for- og bagkamera. Udløseren venter derefter på `onCameraReady`.

#### - Funktion til at tage billede
- Lav nu en asynkron funktion, der hedder `snap`, og som bruger `setLoading` og `setImagesArr`. Udfyld funktionsnavnet og de tre setter-kald.
````jsx
  async function ???() {
    if (!cameraRef.current || !cameraReady || loading || !isFocused) return;
    try {
      ???(true);
      const result = await cameraRef.current.takePictureAsync();
      ???((prev) => [...prev, result]);
    } catch (err) {
      console.log('Snap error:', err);
      Alert.alert('Billedet kunne ikke tages', 'Vent et øjeblik, og prøv igen.');
    } finally {
      ???(false);
    }
  }
````

Den funktionelle opdatering `(prev) => [...prev, result]` tilføjer billedet til den seneste liste. `loading` bruges også til at deaktivere knapperne, mens billedet tages.

### 5. Toggle galleri
Lav nu en funktion, der hedder `toggleGallery`, og som bruger `setGallery`.
````jsx
    function ???() {
    ???((prev) => !prev);
  }
````

### 6. Galleriet 
I denne del af guiden skal du implementere en galleri-komponent, der viser de billeder, du har taget med kameraet. Galleriet vil være rulleligt og vise en besked, hvis der endnu ikke er taget nogen billeder.

- Lav en `CameraGallery`-komponent inde i `CameraTest`, så den har adgang til `imagesArr`, `loading` og `navigation`. Udfyld navnet, billedlisten og den komponent, der kan scrolle gennem billederne.
````jsx
const ??? = () => (
  <View style={GlobalStyle.gallery}>
    <Text style={GlobalStyle.text}>Billeder taget: {???.length}</Text>
    {/* Her skal man kunne scrolle igennem billederne. */}
    <???>
    </???>
  </View>
);
````

- For at kunne se billederne skal vi bruge `ScrollView` (hint til opgaven ovenover). Inde i `ScrollView` bruger vi conditional rendering. Hvis der findes billeder i `imagesArr`, bruger vi `map()` til at vise hvert billede som en `Image`-komponent inde i en `TouchableOpacity`. Ellers vises en besked.
- Erstat de to scroll-tags fra skitsen ovenfor med hele denne blok; behold den ydre `View` og billedtælleren:

````jsx
<ScrollView horizontal>
      {imagesArr.length > 0 ? (
        imagesArr.???((image, index) => (
          <TouchableOpacity
            key={index}
            disabled={loading}
            onPress={() => navigation.navigate('image', { image: image.uri })}
          >
            <Image source={{ uri: image.uri }} style={{ width: 80, height: 80 }} />
          </TouchableOpacity>
        ))
      ) : (
        <Text style={GlobalStyle.text}>Der er endnu ikke taget billeder.</Text>
      )}
    </ScrollView>
````

### 7. Return
Indsæt til sidst dette `return`-udtryk, og udfyld referencen og de tre knappers `onPress`. Den nødvendige layoutstruktur er udfyldt: Knapperne ligger i en separat `View` oven på kameraet. `CameraView` skal være selvlukkende og må ikke indeholde knapper eller andre børn.

`onCameraReady` aktiverer udløseren. `isFocused` sørger for, at kameraet kun findes, mens kameraskærmen er aktiv.

````jsx
return (
    <SafeAreaView style={GlobalStyle.safeview}>
      <View style={GlobalStyle.container}>
        <View style={GlobalStyle.cameraContainer}>
          {isFocused && (
            <CameraView
              key={facing}
              ref={??? /* reference til kameraet */}
              style={GlobalStyle.camera}
              facing={facing}
              onCameraReady={() => setCameraReady(true)}
              onMountError={() => {
                setCameraReady(false);
                Alert.alert('Kameraet kunne ikke starte', 'Kontrollér kameratilladelsen, og åbn appen igen.');
              }}
            />
          )}
          <View style={GlobalStyle.buttonContainer}>
            {/* Flip kamera */}
            <TouchableOpacity
              style={[GlobalStyle.btn, loading && GlobalStyle.disabled]}
              disabled={loading}
              onPress={??? /* skift kamera */}
              accessibilityLabel="Skift kamera"
            >
              <Ionicons name="camera-reverse-outline" size={32} color="#fff" />
            </TouchableOpacity>

            {/* Tag billede */}
            <TouchableOpacity
              style={[GlobalStyle.snapbtn, (!cameraReady || loading) && GlobalStyle.disabled]}
              disabled={!cameraReady || loading}
              onPress={??? /* tag et billede */}
              accessibilityLabel="Tag billede"
            >
              <Text style={GlobalStyle.text}>{loading ? '...' : 'Foto'}</Text>
            </TouchableOpacity>

            {/* Toggle galleri */}
            <TouchableOpacity
              style={[GlobalStyle.btn, loading && GlobalStyle.disabled]}
              disabled={loading}
              onPress={??? /* vis eller skjul galleriet */}
              accessibilityLabel="Vis eller skjul galleri"
            >
              <Ionicons name="images-outline" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        {gallery ? <CameraGallery /> : null}
      </View>
    </SafeAreaView>
  );
````

Du er nu færdig med `CameraTest.js`, når alle `???` er udfyldt. Sørg for, at hele funktionen afsluttes med `}` efter `return`-udtrykket.

## ImageScreen.js
Denne fil viser billedet i fuld størrelse.

Indsæt følgende i filen:
````jsx
import React from 'react';
import { View, Image, Text } from 'react-native';
import GlobalStyle from '../style/GlobalStyle';

export default function ImageScreen({ route }) {
  const { image } = route.params || {};

  return (
    <View style={GlobalStyle.container}>
      {image ? (
        <Image source={{ uri: image }} style={GlobalStyle.img} />
      ) : (
        <Text style={GlobalStyle.text}>Intet billede valgt</Text>
      )}
    </View>
  );
}
````

Reflekter over:
- Hvorfor bruger vi route.params her?
- Hvad sker der, hvis route.params er tom?

## Afprøv den færdige øvelse på telefonen

1. Tillad kameraadgang, og kontrollér, at kameravisningen kommer frem. Prøv også at afvise tilladelsen og derefter give den via indstillingerne.
2. Tag flere billeder. Udløseren skal være deaktiveret, indtil kameraet er klar, og mens et billede tages.
3. Skift mellem for- og bagkamera, og tag et billede med begge.
4. Åbn galleriet, scroll gennem billederne, og tryk på et billede for at se det i fuld størrelse.
5. Gå tilbage fra billedskærmen. Billederne skal stadig være i galleriet, og kameraet skal kunne tage et nyt billede.
6. Genindlæs appen. Billedlisten bliver tom, fordi den kun ligger i React-state. Selve billedfilerne ligger midlertidigt i appens cache; øvelsen gemmer dem ikke i telefonens fotobibliotek.
