// StoreLogo: butikkens "logo" som forbogstavet i en grøn firkant (Figma: StoreLogo).
// Bruges i ReceiptRow, StoreRow og som stor udgave øverst på Kvittering-skærmen.

import React from "react";
import { View, Text } from "react-native";

import { GlobalStyle } from "../styles/GlobalStyle";

export default function StoreLogo({ butik, stor }) {
  // Første bogstav i butikkens navn, fx "Netto" -> "N". Tomt navn giver ingen fejl.
  const forbogstav = butik ? butik.charAt(0).toUpperCase() : "";

  return (
    <View style={stor ? GlobalStyle.storeLogoStor : GlobalStyle.storeLogo}>
      <Text style={stor ? GlobalStyle.storeLogoStorTekst : GlobalStyle.storeLogoTekst}>{forbogstav}</Text>
    </View>
  );
}
