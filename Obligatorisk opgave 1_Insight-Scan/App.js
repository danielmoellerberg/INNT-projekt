import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import StackComponent from "./components/StackComponent";
import ScanScreen from "./screens/ScanScreen";
import CashbackScreen from "./screens/CashbackScreen";

import { AppProvider } from "./context/AppContext";
import { GlobalStyle, Colors } from "./styles/GlobalStyle";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    // AppProvider ligger yderst, så alle skærme kan læse kvitteringer og saldo
    <AppProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerStyle: GlobalStyle.header,
            headerTitleStyle: GlobalStyle.headerTitel,
            tabBarStyle: GlobalStyle.tabBar,
            tabBarActiveTintColor: Colors.surface,
            tabBarInactiveTintColor: Colors.primaryLight,
            // Ikon per fane - udfyldt ikon når fanen er valgt
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "Overblik") {
                iconName = focused ? "stats-chart" : "stats-chart-outline";
              } else if (route.name === "Scan") {
                iconName = focused ? "scan" : "scan-outline";
              } else if (route.name === "Cashback") {
                iconName = focused ? "cash" : "cash-outline";
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          {/* Overblik-fanen indeholder en stack: Overblik -> Kvittering.
              Derfor slår vi fanens egen header fra, så stacken styrer headeren. */}
          <Tab.Screen
            name="Overblik"
            component={StackComponent}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Scan"
            component={ScanScreen}
            options={{ title: "Scan kvittering" }}
          />
          <Tab.Screen name="Cashback" component={CashbackScreen} />
        </Tab.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </AppProvider>
  );
}
