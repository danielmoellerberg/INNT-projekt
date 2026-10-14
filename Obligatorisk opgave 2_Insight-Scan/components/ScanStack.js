import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ScanScreen from "../screens/ScanScreen";
import GodkendKvitteringScreen from "../screens/GodkendKvitteringScreen";

import { GlobalStyle, Colors } from "../styles/GlobalStyle";

const Stack = createStackNavigator();

// Stack-navigation inde i "Scan"-fanen (samme mønster som StackComponent til Hjem).
// Først kameraet, derefter godkendelse af det, AI'en har aflæst. Intet gemmes, før brugeren
// har trykket "Gem kvittering" på godkendelsesskærmen.
export default function ScanStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: GlobalStyle.stackHeader,
        headerShadowVisible: false,
        headerTintColor: Colors.primary,
        headerTitle: "",
        headerBackTitle: "Scan igen",
        cardStyle: GlobalStyle.skaerm,
      }}
    >
      {/* Kameraet fylder hele skærmen, så det har ingen header */}
      <Stack.Screen name="Kamera" component={ScanScreen} options={{ headerShown: false }} />
      <Stack.Screen name="GodkendKvittering" component={GodkendKvitteringScreen} />
    </Stack.Navigator>
  );
}
