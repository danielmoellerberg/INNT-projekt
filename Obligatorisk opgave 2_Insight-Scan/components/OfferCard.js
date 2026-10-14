// OfferCard: ét tilbud med pris og cashback (Figma: OfferCard).
// Plus-knappen til højre tilføjer varen til indkøbslisten. Den er 44 x 44, som er
// Apples mindste anbefalede trykflade, så den er nem at ramme.

import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { GlobalStyle, Colors } from "../styles/GlobalStyle";

export default function OfferCard({ vare, butik, pris, cashback, onTilfoej }) {
  return (
    <View style={GlobalStyle.offerCard}>
      {/* Pladsholder for produktbillede, indtil tilbuddene har rigtige billeder */}
      <View style={GlobalStyle.offerCardBillede}>
        <Ionicons name="bag-outline" size={26} color={Colors.primary} />
      </View>

      <View style={GlobalStyle.rækkeTekst}>
        <Text style={GlobalStyle.rækkeTitel} numberOfLines={1}>{vare}</Text>
        <Text style={GlobalStyle.rækkeInfo} numberOfLines={1}>{butik}</Text>
        <View style={GlobalStyle.offerCardPrisRække}>
          <Text style={GlobalStyle.rækkeTitel}>{pris}</Text>
          <View style={GlobalStyle.cashbackBadge}>
            <Text style={GlobalStyle.cashbackBadgeTekst}>{cashback}</Text>
          </View>
        </View>
      </View>

      <Pressable
        onPress={onTilfoej}
        accessibilityRole="button"
        accessibilityLabel={`Tilføj ${vare} til indkøbslisten`}
        style={({ pressed }) => [GlobalStyle.offerCardTilfoejKnap, pressed && GlobalStyle.trykket]}
      >
        <Ionicons name="add" size={22} color={Colors.primary} />
      </Pressable>
    </View>
  );
}
