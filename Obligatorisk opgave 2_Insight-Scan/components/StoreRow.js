// StoreRow: én butik med en "Jeg handler her"-kontakt (Figma: StoreRow).
// Kontakten er React Natives indbyggede Switch, som på iOS er systemets egen kontakt.
// Grøn betyder "til" som i Figma. Om brugeren handler i butikken er en lokal præference,
// som skal gemmes med AsyncStorage (mønster fra øvelse 08), når Butikker-skærmen bygges.

import React from "react";
import { View, Text, Switch } from "react-native";

import StoreLogo from "./StoreLogo";
import { GlobalStyle, Colors } from "../styles/GlobalStyle";

export default function StoreRow({ butik, info, valgt, onSkift }) {
  return (
    <View style={GlobalStyle.storeRow}>
      <StoreLogo butik={butik} />

      <View style={GlobalStyle.rækkeTekst}>
        <Text style={GlobalStyle.rækkeTitel} numberOfLines={1}>{butik}</Text>
        <Text style={GlobalStyle.rækkeInfo} numberOfLines={1}>{info}</Text>
      </View>

      <Switch
        value={valgt}
        onValueChange={onSkift}
        trackColor={{ false: Colors.separator, true: Colors.primary }}
        ios_backgroundColor={Colors.separator}
        accessibilityLabel={`Jeg handler i ${butik}`}
      />
    </View>
  );
}
