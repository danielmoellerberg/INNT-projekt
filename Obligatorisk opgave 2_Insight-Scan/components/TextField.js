// TextField: tekstfelt med en synlig label over feltet (Figma: TextField).
// Labelen står altid over feltet og forsvinder ikke som en placeholder, så brugeren
// altid kan se, hvad feltet er til - også når der allerede er skrevet noget i det.

import React from "react";
import { View, Text, TextInput } from "react-native";

import { GlobalStyle, Colors } from "../styles/GlobalStyle";

export default function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
}) {
  return (
    <View style={GlobalStyle.textField}>
      <Text style={GlobalStyle.textFieldLabel}>{label}</Text>
      <TextInput
        style={GlobalStyle.textFieldInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textTertiary}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        accessibilityLabel={label}
      />
    </View>
  );
}
