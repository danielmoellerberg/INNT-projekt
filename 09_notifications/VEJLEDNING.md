# 09_notifications_vejledning

I denne øvelse skal du bygge en app til dine bøger, appen kan:

- Tag billeder af dine bøger (kamera)
- Se dem i din “læseliste” (AsyncStorage + FileSystem)
- Få en daglig påmindelse om at læse (Expo Notifications)
- Del dine bøger med andre (expo-sharing / Share)
- Oplev animationer (Reanimated)

## Start med the basic

Lav din app
```
npx create-expo-app bookbuddy --template blank
```


Download de nødvendige dependencies 

```
  "dependencies": {
    "@react-native-async-storage/async-storage": "^2.2.0",
    "@react-navigation/native": "^7.1.17",
    "@react-navigation/native-stack": "^7.3.26",
    "babel-preset-expo": "~54.0.0",
    "expo": "~54.0.12",
    "expo-camera": "~17.0.8",
    "expo-device": "~8.0.9",
    "expo-file-system": "~19.0.16",
    "expo-notifications": "~0.32.12",
    "expo-sharing": "~14.0.7",
    "expo-status-bar": "~3.0.8",
    "react": "19.1.0",
    "react-native": "0.81.4",
    "react-native-gesture-handler": "~2.28.0",
    "react-native-reanimated": "~4.1.1",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0",
    "react-native-worklets": "0.5.1"
  },
```

Kør 
```
npx expo customize babel.config.js
```

Opret dine mapper med de nødvendige filer 
```
components/
  Library.js
  Notifications.js
  Sharing.js

screens/
  CameraScreen.js
  HomeScreen.js

style/
  (indsæt dine styling-filer her)
```

## App.js

Lav din navigation i app.js med en stack skærm

```
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '/*indsæt sti*/';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <???r>
      <???r>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Books" }} />
      </???>
    </???>
  );
}
```

## HomeScreen.js

```
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Velkommen til BookBuddy</Text>
      <Text style={styles.subtitle}>Gem og del dine læseoplevelser</Text>
      
      <TouchableOpacity style={styles.btn} onPress={() => {}}>
        <Text style={styles.btnText}>➕ Tilføj bog</Text>
      </TouchableOpacity>
    </View>
  );
}
```

Her er stylingen til HomeScreen, indsæt det i en seperat stylingsfil

```
const ?? = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#555', marginBottom: 40 },
  btn: { backgroundColor: '#4B7BE5', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 10 },
  btnText: { color: 'white', fontSize: 16, fontWeight: '600' }
});
```

Test om det virker 

## Tilføj kamera og AsyncStorage 

### Library.js
Start med at lave Library, dette komponent styrer hvordan bøger gemmes og hentes lokalt.

```
import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LIBRARY_KEY = 'BOOK_LIBRARY';
const DIR = FileSystem.documentDirectory + 'books';

async function ensureDir() {
  const info = await FileSystem.getInfoAsync(DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(DIR, { intermediates: true });
  }
}

export async function listBooks() {
  const json = await AsyncStorage.getItem(LIBRARY_KEY);
  const list = json ? JSON.parse(json) : [];
  return list.sort((a, b) => b.createdAt - a.createdAt);
}

export async function addBook(localUri) {
  await ensureDir();
  const id = Date.now().toString();
  const dest = `${DIR}/${id}.jpg`;
  await FileSystem.copyAsync({ from: localUri, to: dest });

  const book = { id, uri: dest, createdAt: Date.now() };
  const list = await listBooks();
  const next = [book, ...list];
  await AsyncStorage.setItem(LIBRARY_KEY, JSON.stringify(next));
  return book;
}

export async function getItem(id) {
    const list = await listBooks();
    return list.find((x) => x.id === id) || null;
  }
```

### CameraScreen.js
Skal vise et simpelt kamera, hvor vi kan tage et billede af bogen.

```
import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { addBook } from '/*indsæt stien her*/';

export default function CameraScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!permission || !permission.granted) requestPermission();
  }, [permission]);

  const takePhoto = async () => {
    if (cameraRef.current && !busy) {
      setBusy(true);
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.9 });
      const saved = await addBook(photo.uri);
      navigation.goBack();
      setBusy(false);
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text>Kamera-adgang kræves</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Giv tilladelse</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={StyleSheet.absoluteFill} ref={cameraRef} />
      <TouchableOpacity style={styles.shutter} onPress={takePhoto}>
        <Text style={{ fontSize: 32 }}></Text>
      </TouchableOpacity>
    </View>
  );
}
```

**Vigtigt:** `takePhoto` skal defineres, *før* du rammer `if (!permission?.granted) return ...`. Begge er `const`, og en `const` kan ikke bruges, før dens egen linje er kørt (den "temporal dead zone" — modsat en almindelig function-erklæring, som bliver hoisted). Hvis du bytter rundt på rækkefølgen, og appen rendere uden kamera-tilladelse endnu, får du en `ReferenceError: Cannot access 'takePhoto' before initialization`, og skærmen crasher med det samme.

Indsæt styligen i en seperat fil
```
const ??? = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  btn: { backgroundColor: '#333', padding: 12, borderRadius: 8, marginTop: 10 },
  btnText: { color: 'white' },
  shutter: { position: 'absolute', bottom: 50, alignSelf: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 40 },
});
```

### Opdater HomeScreen.js

- Importer useEffect og useState
- Importer FlatList
- Importer listBooks fra Library

indsæt følgende øverst i HomeScreen funktion:
```
const [books, setBooks] = useState([]);

  const loadBooks = async () => {
    const data = await listBooks();
    setBooks(data);
  };

  // Her sørger vi for at listen altid loader når man kommer tilbage
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadBooks);
    return unsubscribe; // rydder op når komponenten unmountes
  }, [navigation]);
```

Opdater din return:
```
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Min læseliste</Text>

      {books.length === 0 ? (
        <Text style={{ marginTop: 20 }}>Ingen bøger endnu. Tilføj din første!</Text>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(b) => b.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.uri }} style={styles.img} />
            </View>
          )}
          numColumns={2}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Camera')}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}
```


Opdater din styling
```
const ??? = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa', padding: 10 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  card: { flex: 1, margin: 6, aspectRatio: 0.7, borderRadius: 10, overflow: 'hidden', backgroundColor: '#ddd' },
  img: { width: '100%', height: '100%' },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#4B7BE5', alignItems: 'center', justifyContent: 'center' },
  fabText: { fontSize: 28, color: '#fff' },
});
```

### App.js

Importer kamera skærmen i app.js og indsæt den som en stack screen

## Notifikationer

Indsæt dette i notifikation filen og opdater hvornår på dagen notifikationen skal komme 
```
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Spørg om tilladelse
export async function registerForPush() {
  if (!Device.isDevice) return null;

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  return true;
}

// Planlæg en daglig notifikation
export async function scheduleDailyReminder() {
  await Notifications.cancelAllScheduledNotificationsAsync(); // rydder gamle
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "BookBuddy",
      body: "Tid til at læse lidt i din bog!",
    },
    trigger: {
      type: Notifications.???.DAILY,
      hour: ???,
      minute: ???,
    },
  });
}
```

**Bemærk:** I `expo-notifications` skal et gentaget trigger have et eksplicit `type`-felt (`Notifications.SchedulableTriggerInputTypes.DAILY`). Den ældre form uden `type` (bare `{ hour, minute, repeats: true }`) er en "breaking change" og kaster nu en fejl ved kørsel i stedet for at planlægge notifikationen.

## App.js
Importer følgende i app.js

```
import React, { useEffect } from 'react'; // vær opmærksom på at denne skal erstatte en anden
import * as Notifications from 'expo-notifications';
import { registerForPush, scheduleDailyReminder } from './components/Notifications';
```

Indsæt dette under din stack konstant. Vær opmærksom på at der ikke kan være på App funktioner
```
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    (async () => {
      const ok = await registerForPush();
      if (ok) {
        await scheduleDailyReminder();
      }
    })();
  }, []);

```

**Bemærk:** `shouldShowAlert` findes ikke længere. iOS 14+ har to separate steder en notifikation kan vises: banneret øverst (`shouldShowBanner`) og selve notifikationscenteret/låseskærmen (`shouldShowList`). Sæt begge til `true`, så din notifikation vises begge steder.

## Lav noget sej styling

### Opdater HomeScreen.js

```
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { listBooks } from '../components/Library';

export default function HomeScreen({ navigation }) {
  const [books, setBooks] = useState([]);

  const loadBooks = async () => {
    const data = await listBooks();
    setBooks(data);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadBooks);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}> Min læseliste</Text>

      {books.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Ingen bøger endnu. Tilføj din første!</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(b) => b.id}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Camera')}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

Opdater stylingen
```
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 10 },
  header: { fontSize: 28, fontWeight: 'bold', marginVertical: 20, textAlign: 'center', color: '#333' },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3, // Android skygge
    alignItems: 'center',
  },
  img: { width: '100%', height: 180, resizeMode: 'cover' },
  cardTitle: { fontSize: 14, fontWeight: '600', padding: 8, color: '#444' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 16, color: '#666' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 65,
    height: 65,
    borderRadius: 32,
    backgroundColor: '#4B7BE5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  fabText: { fontSize: 30, color: '#fff', fontWeight: 'bold' },
});
``

### Opdater CameraScreen.js
Gør knappen lidt pænere

```
<TouchableOpacity style={styles.shutter} onPress={takePhoto}>
  <Text style={styles.shutterIcon}></Text>
</TouchableOpacity>
```

Styling til knappen
```
shutter: {
  position: 'absolute',
  bottom: 50,
  alignSelf: 'center',
  width: 80,
  height: 80,
  borderRadius: 40,
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: '#000',
  shadowOpacity: 0.25,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
  elevation: 5,
},
shutterIcon: { fontSize: 32 },
```

Test din app

## Brug reanimated 

Indsæt dette i App.json. Du kan læse mere om det her: https://docs.expo.dev/guides/using-hermes/ 
```
{
  "expo": {
    "jsEngine": "hermes"
  }
}
```

Indsæt dette i babel.config.js
```
plugins: ['react-native-worklets/plugin'],
```

**Bemærk:** I Reanimated 4 er selve worklets-maskineriet flyttet ud i en separat pakke, `react-native-worklets` (som allerede står i dine dependencies). Babel-pluginet hedder derfor `react-native-worklets/plugin` nu. Den gamle sti, `react-native-reanimated/plugin`, findes stadig af hensyn til bagudkompatibilitet, men bruger du den, stopper dine worklets med at blive transformeret helt uden en advarsel, og du ender med kryptiske runtime-fejl.

### HomeScreen.js

Importer reanimated 
```
import Animated, {
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
```

```
// Pulsing FAB som separat komponent
function PulsingFab({ onPress }) {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 600 }),
        withTiming(1, { duration: 600 })
      ),
      -1, // uendeligt loop
      true
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[fabStyles.fab, style]}>
      <TouchableOpacity onPress={onPress}>
        <Text style={fabStyles.fabText}>＋</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeScreen({ navigation }) {
  const [books, setBooks] = useState([]);

  const loadBooks = async () => {
    const data = await listBooks();
    setBooks(data);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadBooks);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item, index }) => (
    <Animated.View
      entering={FadeInUp
        .delay(index * 150)   // staggered effekt
        .springify()          // lille bounce
      }
      style={styles.card}
    >
      <Image source={{ uri: item.uri }} style={styles.img} />
      <Text style={styles.cardTitle}>Min bog #{item.id}</Text>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Min læseliste</Text>

      {books.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Ingen bøger endnu. Tilføj din første!</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(b) => b.id}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <PulsingFab onPress={() => navigation.navigate('Camera')} />
    </View>
  );
}
```

Opdater stylingen
```
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 10 },
  header: { fontSize: 28, fontWeight: 'bold', marginVertical: 20, textAlign: 'center', color: '#333' },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
  },
  img: { width: '100%', height: 180, resizeMode: 'cover' },
  cardTitle: { fontSize: 14, fontWeight: '600', padding: 8, color: '#444' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 16, color: '#666' },
});

const fabStyles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 65,
    height: 65,
    borderRadius: 32,
    backgroundColor: '#4B7BE5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  fabText: { fontSize: 30, color: '#fff', fontWeight: 'bold' },
});
```

## Deling af bøger 

### Sharing.js

Til at dele bøgerne bruger vi Expo sharing, du kan læse mere om det her: https://docs.expo.dev/versions/latest/sdk/sharing/

Indsæt dette i sharing: 
```
import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Alert, Share } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Sharing from 'expo-sharing';

export default function BookCard({ item, index }) {
  const doShare = async () => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(item.uri);
        return;
      }
      await Share.share({
        message: 'Se min bog i BookBuddy 📚',
        url: item.uri,
      });
    } catch (e) {
      Alert.alert('Kunne ikke dele', e.message);
    }
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 150).springify()}
      style={styles.card}
    >
      <Image source={{ uri: item.uri }} style={styles.img} />
      <Text style={styles.cardTitle}>Min bog #{item.id}</Text>

      <TouchableOpacity style={styles.shareBtn} onPress={doShare}>
        <Text style={styles.shareBtnText}>Del</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
```

Indsæt stylingen i en seperat fil
```
const ??? = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
  },
  img: { width: '100%', height: 180, resizeMode: 'cover' },
  cardTitle: { fontSize: 14, fontWeight: '600', padding: 8, color: '#444' },
  shareBtn: {
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#4B7BE5',
  },
  shareBtnText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});
```

### HomeScreen.js

- Import BookCard fra Sharing.js
- Indsæt dette `renderItem={({ item, index }) => <BookCard item={item} index={index} />}` i din FlatList

Test din app

# Tillykke du er færdig 





