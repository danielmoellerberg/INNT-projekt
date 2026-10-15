import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HjemScreen from "../screens/HjemScreen";
import KvitteringScreen from "../screens/KvitteringScreen";
import KvitteringBilledeScreen from "../screens/KvitteringBilledeScreen";
import IndstillingerScreen from "../screens/IndstillingerScreen";

import { GlobalStyle, Colors } from "../styles/GlobalStyle";

const Stack = createStackNavigator();

// Stack-navigation inde i "Hjem"-fanen (genbrugt fra opgave 1, hvor fanen hed "Overblik").
// Fra Hjem kan man gå videre til en enkelt kvittering eller til Indstillinger (profilknappen).
// Fra en kvittering kan man åbne billedet af bonen i fuld størrelse.
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
      <Stack.Screen name="Kvittering" component={KvitteringScreen} />
      {/* Tilbage-knappen fører til kvitteringen, så den hedder "Kvittering" i stedet for "Hjem" */}
      <Stack.Screen
        name="KvitteringBillede"
        component={KvitteringBilledeScreen}
        options={{ headerBackTitle: "Kvittering" }}
      />
      <Stack.Screen name="Indstillinger" component={IndstillingerScreen} />
    </Stack.Navigator>
  );
}
