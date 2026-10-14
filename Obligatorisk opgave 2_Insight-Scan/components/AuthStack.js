import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/LoginScreen";
import OpretBrugerScreen from "../screens/OpretBrugerScreen";

import { GlobalStyle, Colors } from "../styles/GlobalStyle";

const Stack = createStackNavigator();

// Login-stacken vises, når brugeren ikke er logget ind (se App.js).
// Login er første skærm. Derfra kan man gå videre til Opret bruger og tilbage igen.
export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        // Som i Figma: headeren har samme baggrund som skærmen, ingen titel og en
        // grøn tilbage-knap med teksten "Log ind"
        headerStyle: GlobalStyle.stackHeader,
        headerShadowVisible: false,
        headerTintColor: Colors.primary,
        headerTitle: "",
        headerBackTitle: "Log ind",
        cardStyle: GlobalStyle.skaerm,
      }}
    >
      {/* Login har ingen header, så skærmen ser ud som en velkomstside */}
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OpretBruger" component={OpretBrugerScreen} />
    </Stack.Navigator>
  );
}
