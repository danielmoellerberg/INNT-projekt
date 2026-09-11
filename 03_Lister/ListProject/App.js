import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import ArrayListScreen from "./screens/ArrayListScreen";
import FetchListScreen from "./screens/FetchListScreen";
import FlatListScreen from "./screens/FlatListScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Flat List" component={FlatListScreen} />
          <Tab.Screen name="Array List" component={ArrayListScreen} />
          <Tab.Screen name="Fetch List" component={FetchListScreen} />
        </Tab.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
