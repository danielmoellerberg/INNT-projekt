// MadplanScreen: ny fane i opgave 2. Placeholder indtil funktionen bygges.
// Tanken er at foreslå en madplan ud fra det, brugeren faktisk køber,
// så appen også giver indsigt i kosten (det sekundære budskab fra opgave 1).

import React from "react";
import { View, Text } from "react-native";

import { GlobalStyle } from "../styles/GlobalStyle";

export default function MadplanScreen() {
  return (
    <View style={GlobalStyle.container}>
      <View style={GlobalStyle.centreret}>
        <Text style={GlobalStyle.placeholderTitel}>Madplan</Text>
        <Text style={GlobalStyle.placeholderTekst}>
          Her kommer forslag til en madplan baseret på dine indkøb.
        </Text>
      </View>
    </View>
  );
}
