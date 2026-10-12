import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue } from "firebase/database";

import { auth, rtdb } from "./database/firebase";
import AuthStack from "./components/AuthStack";
import StackComponent from "./components/StackComponent";
import CashbackScreen from "./screens/CashbackScreen";
import ScanScreen from "./screens/ScanScreen";
import MadplanScreen from "./screens/MadplanScreen";
import ButikkerScreen from "./screens/ButikkerScreen";
import LeverandoerScreen from "./screens/LeverandoerScreen";

import { AppProvider } from "./context/AppContext";
import { GlobalStyle, Colors } from "./styles/GlobalStyle";

const Tab = createBottomTabNavigator();

// Ikon per fane: udfyldt ikon når fanen er valgt, kun kant når den ikke er
const FANE_IKONER = {
  Hjem: "home",
  Tilbud: "pricetags",
  Scan: "scan",
  Madplan: "restaurant",
  Butikker: "storefront",
};

// Kundesiden: fem faner med Scan i midten, så den vigtigste handling er nemmest at nå.
// Hjem-fanen indeholder en stack (Hjem -> Kvittering), derfor slås fanens egen header fra,
// så stacken styrer headeren (mønster fra opgave 1).
function KundeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: GlobalStyle.header,
        headerTitleStyle: GlobalStyle.headerTitel,
        tabBarStyle: GlobalStyle.tabBar,
        tabBarActiveTintColor: Colors.surface,
        tabBarInactiveTintColor: Colors.primaryLight,
        tabBarIcon: ({ focused, color, size }) => {
          const ikon = FANE_IKONER[route.name];
          return <Ionicons name={focused ? ikon : ikon + "-outline"} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Hjem" component={StackComponent} options={{ headerShown: false }} />
      <Tab.Screen name="Tilbud" component={CashbackScreen} />
      <Tab.Screen name="Scan" component={ScanScreen} options={{ title: "Scan kvittering" }} />
      <Tab.Screen name="Madplan" component={MadplanScreen} />
      <Tab.Screen name="Butikker" component={ButikkerScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  // Den bruger, der er logget ind (null = ingen er logget ind)
  const [user, setUser] = useState(null);
  // Brugerens rolle fra profilen i databasen: "kunde" eller "leverandoer"
  const [rolle, setRolle] = useState(null);
  // true indtil vi ved, om nogen er logget ind, og hvilken rolle de har
  const [indlaeser, setIndlaeser] = useState(true);

  // Lyt på login-status (mønster fra øvelse 06). Firebase kalder funktionen, når appen
  // starter, og hver gang nogen logger ind eller ud - også efter genstart, fordi
  // login-status gemmes med AsyncStorage (se database/firebase.js).
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Vis indlæsning, indtil rollen er hentet, så en leverandør ikke kortvarigt ser kundesiden
        setIndlaeser(true);
      } else {
        setRolle(null);
        setIndlaeser(false);
      }
    });
    return unsubscribe; // fjern lytteren, hvis App lukkes
  }, []);

  // Når en bruger er logget ind, lytter vi på brugerens profil i databasen
  // (onValue, mønster fra øvelse 05) for at finde rollen.
  // Vi bruger onValue frem for at læse én gang, fordi profilen ved oprettelse først skrives
  // lige EFTER, at brugeren er logget ind. onValue får den nye rolle med det samme.
  useEffect(() => {
    if (!user) return;
    const profilRef = ref(rtdb, `users/${user.uid}/profil`);
    const unsubscribe = onValue(profilRef, (snapshot) => {
      const profil = snapshot.val();
      // Findes der ingen profil endnu, behandles brugeren som kunde (standardrollen)
      setRolle(profil && profil.rolle ? profil.rolle : "kunde");
      setIndlaeser(false);
    });
    return unsubscribe; // stop med at lytte, når brugeren logger ud
  }, [user]);

  // Vælg hvad der skal vises: indlæsning, login, leverandørside eller kundeside
  function visIndhold() {
    if (indlaeser) {
      return (
        <View style={[GlobalStyle.container, GlobalStyle.centreret]}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }
    if (!user) {
      return <AuthStack />;
    }
    if (rolle === "leverandoer") {
      return <LeverandoerScreen />;
    }
    return <KundeTabs />;
  }

  return (
    // SafeAreaProvider: giver skærmene besked om notch og home-indikator (mønster fra øvelse 07/08)
    // AppProvider: fælles data til kundesidens skærme (fra opgave 1)
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          {visIndhold()}
          {/* Hvid statuslinje-tekst på kundesidens farvede header, ellers mørk */}
          <StatusBar style={user && rolle === "kunde" ? "light" : "dark"} />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}
