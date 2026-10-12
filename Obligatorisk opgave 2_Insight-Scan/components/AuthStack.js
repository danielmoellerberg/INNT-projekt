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
        headerStyle: GlobalStyle.header,
        headerTitleStyle: GlobalStyle.headerTitel,
        headerTintColor: Colors.surface,
      }}
    >
      {/* Login har ingen header, så skærmen ser ud som en velkomstside */}
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OpretBruger" component={OpretBrugerScreen} options={{ title: "Opret bruger" }} />
    </Stack.Navigator>
  );
}
