// PrimaryButton: appens primære knap (Figma: Button/Primary).
// Kapselform som i iOS. Figma siger "én per skærm", så den bruges til skærmens vigtigste
// handling, fx "Log ind" eller "Opret bruger".

import React from "react";
import { Pressable, Text } from "react-native";

import { GlobalStyle } from "../styles/GlobalStyle";

export default function PrimaryButton({ label, onPress, disabled }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      // Styling afhænger af, om knappen trykkes eller er slået fra (mønster fra 04)
      style={({ pressed }) => [
        GlobalStyle.primaryButton,
        pressed && GlobalStyle.trykket,
        disabled && GlobalStyle.deaktiveret,
      ]}
    >
      <Text style={GlobalStyle.primaryButtonTekst}>{label}</Text>
    </Pressable>
  );
}
