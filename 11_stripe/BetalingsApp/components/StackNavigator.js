import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import ShopScreen from "../screens/ShopScreen";
import ReceiptScreen from "../screens/ReceiptScreen";

const Stack = createStackNavigator();

// Kobler de to skærme sammen. Navnene "shop" og "kvittering" skal stå præcis
// som i navigation.navigate() i ShopScreen, ellers går appen ned.
export default function ShopNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="shop"
          component={ShopScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="kvittering" component={ReceiptScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
