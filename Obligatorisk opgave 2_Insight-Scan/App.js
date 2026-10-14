import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
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
import TilbudScreen from "./screens/TilbudScreen";
import ScanStack from "./components/ScanStack";
import MadplanScreen from "./screens/MadplanScreen";
import ButikkerScreen from "./screens/ButikkerScreen";
import LeverandoerScreen from "./screens/LeverandoerScreen";

import { AppProvider } from "./context/AppContext";
import { GlobalStyle, Colors } from "./styles/GlobalStyle";

const Tab = createBottomTabNavigator();

// Ikon per fane (Ionicons, kursets mønster fra 04 og 08). Scan har sit eget ikon nedenfor.
const FANE_IKONER = {
  Hjem: "home-outline",
  Tilbud: "pricetag-outline",
  Madplan: "calendar-outline",
  Butikker: "location-outline",
};

// Kundesiden: fem faner med Scan i midten, så den vigtigste handling er nemmest at nå.
// Tab-baren er "flydende" som i Figma: den ligger ovenpå indholdet med runde ender,
// halvgennemsigtig baggrund (Colors.glass) og skygge. Figmas baggrunds-blur kræver
// pakken expo-blur, som ikke er brugt i kurset - den kan tilføjes senere.
function KundeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // skærmene har deres egne store overskrifter som i Figma
        tabBarStyle: GlobalStyle.tabBar,
        tabBarItemStyle: GlobalStyle.tabItem,
        tabBarIconStyle: GlobalStyle.tabIkonOmraade,
        // Den aktive fane får en lysegrøn "pille" bag ikonet
        tabBarIcon: ({ focused }) => (
          <View style={[GlobalStyle.tabIkonPille, focused && GlobalStyle.tabIkonPilleAktiv]}>
            <Ionicons
              name={FANE_IKONER[route.name]}
              size={22}
              color={focused ? Colors.primary : Colors.textSecondary}
            />
          </View>
        ),
        tabBarLabel: ({ focused, children }) => (
          <Text style={focused ? GlobalStyle.tabLabelAktiv : GlobalStyle.tabLabel}>{children}</Text>
        ),
      })}
    >
      <Tab.Screen name="Hjem" component={StackComponent} />
      <Tab.Screen name="Tilbud" component={TilbudScreen} />
      {/* Scan er fremhævet med en grøn cirkel. Scan-fanen har sin egen stack (kamera ->
          godkend kvittering), og tab-baren skjules, mens man scanner og godkender. */}
      <Tab.Screen
        name="Scan"
        component={ScanStack}
        options={{
          tabBarStyle: GlobalStyle.tabBarSkjult,
          tabBarIconStyle: GlobalStyle.tabScanIkonOmraade,
          tabBarIcon: () => (
            <View style={GlobalStyle.tabScanKnap}>
              <Ionicons name="scan-outline" size={24} color={Colors.onPrimary} />
            </View>
          ),
          tabBarLabel: ({ children }) => <Text style={GlobalStyle.tabLabelAktiv}>{children}</Text>,
        }}
      />
      <Tab.Screen name="Madplan" component={MadplanScreen} />
      <Tab.Screen name="Butikker" component={ButikkerScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  // Den bruger, der er logget ind (null = ingen er logget ind)
  const [user, setUser] = useState(null);
  // Brugerens profil fra databasen: { navn, rolle, email }
  const [profil, setProfil] = useState(null);
  // true indtil vi ved, om nogen er logget ind, og hvem de er
  const [indlaeser, setIndlaeser] = useState(true);

  // Lyt på login-status (mønster fra øvelse 06). Firebase kalder funktionen, når appen
  // starter, og hver gang nogen logger ind eller ud - også efter genstart, fordi
  // login-status gemmes med AsyncStorage (se database/firebase.js).
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Vis indlæsning, indtil profilen er hentet, så en leverandør ikke kortvarigt ser kundesiden
        setIndlaeser(true);
      } else {
        setProfil(null);
        setIndlaeser(false);
      }
    });
    return unsubscribe; // fjern lytteren, hvis App lukkes
  }, []);

  // Når en bruger er logget ind, lytter vi på profilen i databasen (onValue, mønster fra 05).
  // Vi bruger onValue frem for at læse én gang, fordi profilen ved oprettelse først skrives
  // lige EFTER, at brugeren er logget ind. onValue får den med det samme, når den kommer.
  useEffect(() => {
    if (!user) return;
    const unsubscribe = onValue(ref(rtdb, `users/${user.uid}/profil`), (snapshot) => {
      setProfil(snapshot.val() || {});
      setIndlaeser(false);
    });
    return unsubscribe; // stop med at lytte, når brugeren logger ud
  }, [user]);

  // Findes der ingen rolle endnu, behandles brugeren som kunde (standardrollen)
  const rolle = profil && profil.rolle ? profil.rolle : "kunde";

  // Vælg hvad der skal vises: indlæsning, login, leverandørside eller kundeside
  function visIndhold() {
    if (indlaeser) {
      return (
        <View style={GlobalStyle.centreret}>
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
    // AppProvider: fælles data fra Firebase til alle skærme (se context/AppContext.js)
    <SafeAreaProvider>
      <AppProvider user={user} profil={profil}>
        <NavigationContainer>
          {visIndhold()}
          {/* Mørk statuslinje-tekst på de lyse skærme. Scan skifter selv til lys tekst. */}
          <StatusBar style="dark" />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}
