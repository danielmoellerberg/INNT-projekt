// TilbudStack: stack-navigation inde i "Tilbud"-fanen (samme mønster som StackComponent til Hjem).
// Fra Tilbud kan man åbne indkøbslisten. Tilbage-knappen på indkøbslisten hedder "Tilbud".
// Madplan åbner også indkøbslisten her med navigate("Tilbud", { screen: "Indkoebsliste" }).

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import TilbudScreen from "../screens/TilbudScreen";
import IndkoebslisteScreen from "../screens/IndkoebslisteScreen";

import { GlobalStyle, Colors } from "../styles/GlobalStyle";

const Stack = createStackNavigator();

export default function TilbudStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: GlobalStyle.stackHeader,
        headerShadowVisible: false,
        headerTintColor: Colors.primary,
        headerTitle: "",
        headerBackTitle: "Tilbud",
        cardStyle: GlobalStyle.skaerm,
      }}
    >
      {/* Tilbud har sin egen store overskrift i indholdet, så stackens header er slået fra */}
      <Stack.Screen name="TilbudOversigt" component={TilbudScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Indkoebsliste" component={IndkoebslisteScreen} />
    </Stack.Navigator>
  );
}
