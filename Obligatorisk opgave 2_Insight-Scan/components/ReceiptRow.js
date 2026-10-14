// ReceiptRow: én kvittering i en liste (Figma: ReceiptRow).
// Viser butik, dato og antal varer til venstre, beløb og optjent cashback til højre.
// Hele rækken kan trykkes, fx for at åbne kvitteringens detaljer.

import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import StoreLogo from "./StoreLogo";
import { GlobalStyle, Colors } from "../styles/GlobalStyle";

export default function ReceiptRow({ butik, info, beloeb, cashback, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${butik}, ${info}, ${beloeb}`}
      style={({ pressed }) => [GlobalStyle.receiptRow, pressed && GlobalStyle.trykket]}
    >
      <StoreLogo butik={butik} />

      <View style={GlobalStyle.rækkeTekst}>
        <Text style={GlobalStyle.rækkeTitel} numberOfLines={1}>{butik}</Text>
        <Text style={GlobalStyle.rækkeInfo} numberOfLines={1}>{info}</Text>
      </View>

      <View style={GlobalStyle.receiptRowBeloeb}>
        <Text style={GlobalStyle.rækkeTitel}>{beloeb}</Text>
        {/* Cashback-linjen vises kun, hvis kvitteringen gav cashback */}
        {cashback ? <Text style={GlobalStyle.receiptRowCashback}>{cashback}</Text> : null}
      </View>

      <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
    </Pressable>
  );
}
