// UdbetalingSendtScreen: kort kvittering efter en udbetaling (sidste trin i udbetalingsflowet).
// Beløb, metode og tid sendes med fra UdbetalingScreen med route.params (mønster fra 05 og 07).
// Skærmen har ingen tilbage-knap (se StackComponent), så man ikke ender på Udbetaling igen.
// Knappen fører tilbage til Hjem, hvor saldoen nu er faldet.

import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import PrimaryButton from "../components/PrimaryButton";
import { formaterKroner } from "../data/const";
import { GlobalStyle, Colors } from "../styles/GlobalStyle";

export default function UdbetalingSendtScreen({ route, navigation }) {
  const { beloeb, metode, tid } = route.params;

  return (
    <SafeAreaView style={[GlobalStyle.skaerm, GlobalStyle.udbetalingSendt]}>
      <View style={GlobalStyle.tomIkon}>
        <Ionicons name="checkmark" size={32} color={Colors.primary} />
      </View>
      <Text style={GlobalStyle.titelStor}>Udbetaling på vej</Text>
      <Text style={GlobalStyle.cashbackBeloeb}>{formaterKroner(beloeb)}</Text>
      <Text style={GlobalStyle.tomTekst}>
        Pengene lander inden for {tid} på {metode}.
      </Text>
      <View style={GlobalStyle.tomHandling}>
        {/* navigate("Hjem") går tilbage til Hjem øverst i samme stack */}
        <PrimaryButton label="Tilbage til Hjem" onPress={() => navigation.navigate("Hjem")} />
      </View>
    </SafeAreaView>
  );
}
