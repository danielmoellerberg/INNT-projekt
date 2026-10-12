// ButikkerScreen: ny fane i opgave 2. Placeholder indtil funktionen bygges.
// Tanken er, at brugeren vælger sine foretrukne butikker. Valget er en lokal præference
// og skal gemmes med AsyncStorage (mønster fra øvelse 08), ikke i Firebase.

import React from "react";
import { View, Text } from "react-native";

import { GlobalStyle } from "../styles/GlobalStyle";

export default function ButikkerScreen() {
  return (
    <View style={GlobalStyle.container}>
      <View style={GlobalStyle.centreret}>
        <Text style={GlobalStyle.placeholderTitel}>Butikker</Text>
        <Text style={GlobalStyle.placeholderTekst}>
          Her kan du vælge de butikker, du handler i.
        </Text>
      </View>
    </View>
  );
}
