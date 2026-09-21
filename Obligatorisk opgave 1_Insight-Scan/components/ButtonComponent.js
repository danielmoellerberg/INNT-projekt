import React from "react";
import { Pressable, Text } from "react-native";

import { GlobalStyle } from "../styles/GlobalStyle";

// Genbrugelig knap - samme mønster som i styling-øvelsen.
// type: 'primary' (fyldt) eller 'secondary' (kun kant)
// halv: true når to knapper skal stå ved siden af hinanden
export default function ButtonComponent({ title, onPress, type, halv, disabled }) {
  const erPrimær = type !== "secondary";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      // Conditional styling - vi kigger på type, halv, disabled og pressed
      style={({ pressed }) => [
        erPrimær ? GlobalStyle.primaryBtn : GlobalStyle.secondaryBtn,
        pressed && (erPrimær ? GlobalStyle.primaryBtnTrykket : GlobalStyle.secondaryBtnTrykket),
        halv && GlobalStyle.halvKnap,
        disabled && GlobalStyle.deaktiveret,
      ]}
    >
      <Text style={erPrimær ? GlobalStyle.primaryBtnText : GlobalStyle.secondaryBtnText}>
        {title}
      </Text>
    </Pressable>
  );
}
