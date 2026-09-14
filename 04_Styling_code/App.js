import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';


import ListScreen from './screens/ListScreen';
import ProfileScreen from './screens/ProfileScreen';

import { GlobalStyle, Colors } from './styles/GlobalStyle';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: {
              backgroundColor: Colors.primary,
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
              shadowColor: Colors.textDark,
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
          },
          headerTitleStyle: {
              fontSize: 24,
              fontFamily: 'Segoe UI',
              fontWeight: 'semibold',
              color: Colors.surface,
          },
          tabBarStyle: {
              backgroundColor: Colors.primary,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              shadowColor: Colors.textDark,
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
          },
          tabBarActiveTintColor: Colors.surface,
          tabBarInactiveTintColor: Colors.primaryLight,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'List') {
                iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === 'Profile') {
                iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
        },
          
      })}
        >
        <Tab.Screen name="List" component={ListScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
