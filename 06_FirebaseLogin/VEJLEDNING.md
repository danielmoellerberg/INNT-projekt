# Øvelse 6 - Firebase Authentication & Login

## Intro
- Dagens mål er at lave en app med Firebase login med email og kodeord.

## Opret et projekt i Firebase:
   1. Følg dette link: https://firebase.google.com/
   2. Tryk på "Go to console" i header menuen
   3. Under Get started vælger du: "Create a new Firebase project"
   4. Giv projektet et vilkårligt navn og tryk "continue"
   5. Fjern Analytics og tryk "create project"
   6. Vent 20 sekunder mens projektet laves, og klik så på "continue"
   7. Gå til Authentication --> Get started --> Sign-in method
           - Vælg Email/password, slå "Enable" til og tryk "Save"
           - Uden dette trin fejler både oprettelse og login senere
   8. Gå til projektindstillinger --> generelt --> dine apps
      - Klik "</>" for web-app
      <img src="FirebaseOpsætning.png"
   alt="Firebase opsætning"
   width="520"> 
      - Giv applikationen et vilkårligt navn og tryk "Register app"
      - Klik på "Continue to console"

# Sæt React Native op 
- `npx create-expo-app@latest firebase-login-app --template blank --no-agents-md`
- `cd firebase-login-app`
- `npx expo install firebase`
- `npx expo install @react-native-async-storage/async-storage`


## Opret filer 
- Lav mapperne components, database, screens og style
- Filerne skal hedde præcis det her, ellers passer importerne senere i øvelsen ikke:
  - `components/SignUpComponent.js` og `components/LogInComponent.js`
  - `database/database.js`
  - `screens/AuthScreen.js` og `screens/MainScreen.js`
  - `style/GlobalStyle.js`

## Opret Firebase-konfiguration
I filen database.js skal du indsætte følgende og hente dit setup i firebase: 

````javascript
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: '...',
  authDomain: '...',
  projectId: '...',
  storageBucket: '...',
  messagingSenderId: '...',
  appId: '...'
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
````

## Tilføj styling 
- Til at style din app kan du bruge følgende styling eller lave din egen løbende 

````javascript
import { StyleSheet } from 'react-native';
 
const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#f5f7fa',
    justifyContent: 'center',
  },
  componentsBox: {
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#ffffff',
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
    textAlign: 'center',
  },
  welcome: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  switchContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
});


export default GlobalStyles;
````

## Opsæt App.js
Indsæt følgende kode i App.js og se om det virker. Se bort fra at SafeAreaView ser mærkeligt ud, det bliver ændret senere

````javascript
import { StatusBar } from 'expo-status-bar';
import { Text, View, SafeAreaView } from 'react-native';
import GlobalStyles from './style/GlobalStyle';

export default function AuthScreen() {
  return (
    <SafeAreaView style={GlobalStyles.container}>
      <View style={GlobalStyles.componentsBox}>
        <Text>Her skal vi have SignUp</Text>
      </View>
      <View style={GlobalStyles.componentsBox}>
        <Text>Her skal vi have Login</Text>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
````

## Byg SignUpComponent.js

-  Her skal du bruge `createUserWithEmailAndPassword`, useState, auth, komponenter og styling
- Husk at importer det der er nødvendigt (hint: importer 5 ting)

- Kopier koden til Signup komponentet og lav opgaverne beskrevet i kommentarerne:
````javascript
// importer herunder

export default function Signup() {
// Opret en const til email og en til password (Hint: https://react.dev/reference/react/useState) 
  

// Dette er en metode der opretter brugeren, den er næsten færdig, men mangler createUserWithEmailAndPassword
  const handleSignup = async () => {
    try {
      await (auth, email, password);
      Alert.alert('Bruger oprettet!');
    } catch (error) {
      Alert.alert('Fejl', error.message);
    }
  };

// Dette er return delen, der viser input felter og en knap til at oprette bruger. Den mangler at blive stylet
    return (
      <View style={}>
        <Text style={}>Opret bruger</Text>
        <TextInput
          placeholder="Email"
          style={}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Kodeord"
          style={}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={} onPress={handleSignup}>
          <Text style={}>Opret bruger</Text>
        </TouchableOpacity>
      </View>
    );
  }
````
 
- Importér Signup fra SignUpComponent.js i jeres App.js og placér komponentet i return()
- Se om det virker ved at oprette en bruger og tjek om den kommer ind i Firebase

## Byg LogInComponent.js
- Login er næsten ligesom signup, men der er nogle ting der er anderledes
- Din funktion skal hedde Login med stort L, ellers opfatter React den ikke som en komponent
- Her skal du bruge`signInWithEmailAndPassword`
- Lav en metode der hedder handleLogin

- Hint:

````javascript
// importer herunder

// Login funktion
export default function Login() {

// Lav to const

// handleLogin metode
  const = async () => {
    try {
      
    } catch (error) {
      
    }
  };

// return
  return (
    
  );
}
````

- Importér Login fra LogInComponent.js i jeres App.js og placér komponentet i return()

## Byg AuthScreen til at skifte mellem login og signup
- Importer alt det der er nødvendigt
- Indsæt et useState der tjekker om brugeren er logget ind
- Hint

````javascript
// Importer her react, nødvendige komponenter og tre filer

export default function AuthScreen() {
  // Indsæt et useState her
  

  return (
    <View style={GlobalStyles.container}>
      {isLogin ? <Login /> : <Signup />}
      <View style={GlobalStyles.switchContainer}>
        <Button
          title={isLogin ? 'Har du ikke en konto? Opret en' : 'Har du en konto? Log ind'}
          onPress={() => setIsLogin(prev => !prev)}
        />
      </View>
    </View>
  );
}
````

## Lav MainScreen og Logud

````javascript
// importer herunder 

export default function MainScreen() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout fejlede:', error.message);
    }
  };

  const userEmail = auth.currentUser?.email;

// tilføj styling
  return (
    <View style={}>
      <Text style={}>Hej {userEmail} 👋</Text>
      <Text style={}>Du er nu logget ind!</Text>

      <TouchableOpacity style={} onPress={handleLogout}>
        <Text style={}>Log ud</Text>
      </TouchableOpacity>
    </View>
  );
}
````

## Opdater App.js 
- Installer navigation
   - `npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context react-native-gesture-handler`
- Erstat det der er i din App.js med følgende: 

````javascript
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from './database/database';
import AuthScreen from './screens/AuthScreen';
import MainScreen from './screens/MainScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={MainScreen} />
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
````

## Tillykke nu har du en app hvor man kan oprette en bruger, logge ind og logge ud
