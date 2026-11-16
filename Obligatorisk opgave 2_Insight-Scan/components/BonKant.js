// BonKant: den perforerede kant i bunden af et kort, så kortet ligner en kassebon
// (appens signatur, Figma: cashback-kortet). Hullerne er cirkler i baggrundsfarven, der ligger
// halvt over kortets bund. Bruges på Hjem og på Udbetaling.

import React from "react";
import { View } from "react-native";

import { GlobalStyle } from "../styles/GlobalStyle";

// Antal huller i kanten
const HULLER = Array.from({ length: 15 }, (_, i) => i);

export default function BonKant() {
  return (
    <View style={GlobalStyle.perforering}>
      {HULLER.map((i) => (
        <View key={i} style={GlobalStyle.perforeringHul} />
      ))}
    </View>
  );
}
