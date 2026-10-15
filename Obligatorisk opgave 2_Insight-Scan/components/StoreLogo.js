// StoreLogo: butikkens "logo" som forbogstavet i en grøn firkant (Figma: StoreLogo).
// Bruges i ReceiptRow, StoreRow og som stor udgave øverst på Kvittering-skærmen.
// Med "pin" bliver det en rund grøn markør til kortet på Butikker (Figma: Pin).

import React from "react";
import { View, Text } from "react-native";

import { GlobalStyle } from "../styles/GlobalStyle";

export default function StoreLogo({ butik, stor, pin }) {
  // Første bogstav i butikkens navn, fx "Netto" -> "N". Tomt navn giver ingen fejl.
  const forbogstav = butik ? butik.charAt(0).toUpperCase() : "";

  if (pin) {
    return (
      <View style={GlobalStyle.storeLogoPin}>
        <Text style={GlobalStyle.storeLogoPinTekst}>{forbogstav}</Text>
      </View>
    );
  }

  return (
    <View style={stor ? GlobalStyle.storeLogoStor : GlobalStyle.storeLogo}>
      <Text style={stor ? GlobalStyle.storeLogoStorTekst : GlobalStyle.storeLogoTekst}>{forbogstav}</Text>
    </View>
  );
}
