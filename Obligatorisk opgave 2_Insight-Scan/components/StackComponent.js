import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HjemScreen from "../screens/HjemScreen";
import KvitteringScreen from "../screens/KvitteringScreen";
import AlleKvitteringerScreen from "../screens/AlleKvitteringerScreen";
import KvitteringBilledeScreen from "../screens/KvitteringBilledeScreen";
import IndstillingerScreen from "../screens/IndstillingerScreen";
import UdbetalingScreen from "../screens/UdbetalingScreen";
import UdbetalingSendtScreen from "../screens/UdbetalingSendtScreen";

import { GlobalStyle, Colors } from "../styles/GlobalStyle";

const Stack = createStackNavigator();

// Stack-navigation inde i "Hjem"-fanen (genbrugt fra opgave 1, hvor fanen hed "Overblik").
// Fra Hjem kan man gå videre til en enkelt kvittering, til alle kvitteringer ("Se alle")
// eller til Indstillinger (profilknappen).
// Fra en kvittering kan man åbne billedet af bonen i fuld størrelse.
// Fra cashback-kortet kan man udbetale: Udbetaling -> UdbetalingSendt -> tilbage til Hjem.
export default function StackComponent() {
  return (
    <Stack.Navigator
      screenOptions={{
        // Som i Figma: ingen titel, samme baggrund som skærmen og en grøn "< Hjem"-knap
        headerStyle: GlobalStyle.stackHeader,
        headerShadowVisible: false,
        headerTintColor: Colors.primary,
        headerTitle: "",
        headerBackTitle: "Hjem",
        cardStyle: GlobalStyle.skaerm,
      }}
    >
      {/* Hjem har sin egen store overskrift i indholdet, så stackens header er slået fra */}
      <Stack.Screen name="Hjem" component={HjemScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AlleKvitteringer" component={AlleKvitteringerScreen} />
      {/* Tilbage-knappen hedder "Hjem", medmindre kvitteringen blev åbnet fra en anden skærm,
          som sender sit navn med i route.params.fra (fx "Kvitteringer") */}
      <Stack.Screen
        name="Kvittering"
        component={KvitteringScreen}
        options={({ route }) => ({ headerBackTitle: route.params.fra || "Hjem" })}
      />
      {/* Tilbage-knappen fører til kvitteringen, så den hedder "Kvittering" i stedet for "Hjem" */}
      <Stack.Screen
        name="KvitteringBillede"
        component={KvitteringBilledeScreen}
        options={{ headerBackTitle: "Kvittering" }}
      />
      <Stack.Screen name="Indstillinger" component={IndstillingerScreen} />
      <Stack.Screen name="Udbetaling" component={UdbetalingScreen} />
      {/* Efter udbetalingen: ingen header og ingen swipe tilbage, kun knappen til Hjem */}
      <Stack.Screen
        name="UdbetalingSendt"
        component={UdbetalingSendtScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
}
