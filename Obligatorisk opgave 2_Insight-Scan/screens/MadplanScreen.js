// MadplanScreen: kundens Madplan-fane (Figma: 07 Madplan).
// Tanken er, at en AI-assistent foreslår en madplan ud fra brugerens tilbud og købsvaner.
// AI'en er ikke koblet på endnu, så der findes ingen madplan-data. Skærmen viser derfor
// AI-feltet og en tom tilstand i stedet for ugeplanen (ingen hardcodede retter).

import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import PrimaryButton from "../components/PrimaryButton";
import { useApp } from "../context/AppContext";
import { GlobalStyle, Colors } from "../styles/GlobalStyle";

export default function MadplanScreen({ navigation }) {
  const { kvitteringer } = useApp();
  const [spoergsmaal, setSpoergsmaal] = useState("");

  // Placeholder: her skal spørgsmålet sendes til AI'en med fetch (mønster fra 03),
  // når AI-integrationen bygges. Indtil da fortæller vi brugeren, at funktionen kommer.
  function sendTilAI() {
    Alert.alert("Kommer snart", "AI-assistenten bliver koblet på i næste version af appen.");
    setSpoergsmaal("");
  }

  return (
    <SafeAreaView style={GlobalStyle.skaerm} edges={["top"]}>
      <ScrollView contentContainerStyle={GlobalStyle.skaermIndhold} keyboardShouldPersistTaps="handled">
        <View style={GlobalStyle.skaermHeader}>
          <Text style={GlobalStyle.titelStor}>Madplan</Text>
          <Text style={GlobalStyle.undertitel}>Retter ud fra dine tilbud og købsvaner</Text>
        </View>

        <View style={GlobalStyle.aiKort}>
          <View style={GlobalStyle.aiTitelRække}>
            <Ionicons name="sparkles-outline" size={20} color={Colors.primary} />
            <Text style={GlobalStyle.aiTitel}>Spørg AI-assistenten</Text>
          </View>
          <View style={GlobalStyle.aiInputRække}>
            <TextInput
              style={GlobalStyle.aiInput}
              value={spoergsmaal}
              onChangeText={setSpoergsmaal}
              placeholder="Fx: madplan under 400 kr."
              placeholderTextColor={Colors.textTertiary}
              accessibilityLabel="Spørgsmål til AI-assistenten"
            />
            {/* Send-knappen er slået fra, indtil der er skrevet noget */}
            <Pressable
              onPress={sendTilAI}
              disabled={!spoergsmaal.trim()}
              accessibilityRole="button"
              accessibilityLabel="Send til AI-assistenten"
              style={[GlobalStyle.aiSendKnap, !spoergsmaal.trim() && GlobalStyle.deaktiveret]}
            >
              <Ionicons name="arrow-up" size={20} color={Colors.onPrimary} />
            </Pressable>
          </View>
          <Text style={GlobalStyle.aiFodnote}>
            Forslag laves af AI ud fra dine tilbud og købsvaner. Tjek altid priser og allergener.
          </Text>
        </View>

        {/* Tom tilstand i stedet for ugeplanen */}
        <View style={GlobalStyle.tomTilstand}>
          <View style={GlobalStyle.tomIkon}>
            <Ionicons name="calendar-outline" size={28} color={Colors.primary} />
          </View>
          <Text style={GlobalStyle.tomTitel}>Ingen madplan endnu</Text>
          <Text style={GlobalStyle.tomTekst}>
            {kvitteringer.length === 0
              ? "Scan dine kvitteringer, så kan AI-assistenten foreslå retter ud fra det, du køber."
              : "Spørg AI-assistenten ovenfor, så laver den en madplan til dig."}
          </Text>
          {/* Handlingen giver kun mening, hvis der endnu ikke er scannet noget */}
          {kvitteringer.length === 0 ? (
            <View style={GlobalStyle.tomHandling}>
              <PrimaryButton label="Scan kvittering" onPress={() => navigation.navigate("Scan")} />
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
