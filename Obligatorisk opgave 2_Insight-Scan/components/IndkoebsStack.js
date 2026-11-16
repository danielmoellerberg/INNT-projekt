// IndkoebsStack: stack-navigation inde i "Indkøbsliste"-fanen (samme mønster som StackComponent).
// Først indkøbslisten, og derfra kan man åbne Butikker ("Supermarkeder nær dig").
// Indkøbslisten er en fane, fordi testpersonerne i think-aloud-testene ledte efter den i
// tab-baren. Butikker var tidligere en fane, men blev vægtet lavest i spørgeskemaet og ligger
// derfor nu et trin inde.
//
// Andre faner åbner skærmene her med fx navigate("Indkøbsliste", { screen: "Butikker", initial: false }).

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import IndkoebslisteScreen from "../screens/IndkoebslisteScreen";
import ButikkerScreen from "../screens/ButikkerScreen";

import { GlobalStyle, Colors } from "../styles/GlobalStyle";

const Stack = createStackNavigator();

export default function IndkoebsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: GlobalStyle.stackHeader,
        headerShadowVisible: false,
        headerTintColor: Colors.primary,
        headerTitle: "",
        headerBackTitle: "Indkøbsliste",
        cardStyle: GlobalStyle.skaerm,
      }}
    >
      {/* Indkøbslisten har sin egen store overskrift i indholdet, så stackens header er slået fra */}
      <Stack.Screen name="Indkoebsliste" component={IndkoebslisteScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Butikker" component={ButikkerScreen} />
    </Stack.Navigator>
  );
}
