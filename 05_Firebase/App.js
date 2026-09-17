import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { firebaseApp, rtdb } from "./database/firebase";

import CarList from "./screens/CarList";
import CarDetails from "./screens/CarDetails";
import AddEditCar from "./screens/AddEditCar";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function StackNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Car List" component={CarList} />
      <Stack.Screen name="Car Details" component={CarDetails} />
      <Stack.Screen name="Edit Car" component={AddEditCar} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="Hjem"
            component={StackNavigation}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Tilføj"
            component={AddEditCar}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="add" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
