import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import OverblikScreen from "../screens/OverblikScreen";
import KvitteringScreen from "../screens/KvitteringScreen";

import { GlobalStyle, Colors } from "../styles/GlobalStyle";

const Stack = createStackNavigator();

// Stack-navigation inde i "Overblik"-fanen:
// man starter på overblikket og kan trykke sig videre ind på en enkelt kvittering.
export default function StackComponent() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: GlobalStyle.header,
        headerTitleStyle: GlobalStyle.headerTitel,
        headerTintColor: Colors.surface,
      }}
    >
      <Stack.Screen name="Overblik" component={OverblikScreen} />
      <Stack.Screen name="Kvittering" component={KvitteringScreen} />
    </Stack.Navigator>
  );
}
