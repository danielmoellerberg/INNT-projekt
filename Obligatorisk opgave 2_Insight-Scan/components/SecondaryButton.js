// SecondaryButton: sekundær knap med lysegrøn baggrund (primarySoft) og grøn tekst.
// Bruges til handlinger, der ikke er skærmens vigtigste, fx "Ryd afkrydsede varer",
// så de ikke konkurrerer med PrimaryButton.
// "ikon" viser et lille Ionicons-ikon før teksten (fx et flueben, når noget er gjort).
// "disabled" slår knappen fra, fx når brugeren allerede har trykket.

import React from "react";
import { Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { GlobalStyle, Colors } from "../styles/GlobalStyle";

export default function SecondaryButton({ label, onPress, ikon, disabled }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled === true }}
      style={({ pressed }) => [GlobalStyle.secondaryButton, pressed && GlobalStyle.trykket]}
    >
      {ikon ? <Ionicons name={ikon} size={20} color={Colors.primary} /> : null}
      <Text style={GlobalStyle.secondaryButtonTekst}>{label}</Text>
    </Pressable>
  );
}
