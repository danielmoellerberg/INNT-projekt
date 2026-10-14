// LeverandoerScreen: den side, en bruger med rollen "leverandoer" ser efter login (Figma: 09 Leverandør).
// Leverandørsiden bygges ikke funktionelt i opgave 2. Skærmen viser et mock-up-billede af
// Figma-designet (opgavebeskrivelsen tillader mock-up-skærme) og en Log ud-knap.
// Billedet er et screenshot af Figma-skærmen, gemt som assets/leverandoer-mockup.png.

import React from "react";
import { Text, Image, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";

import { auth } from "../database/firebase";
import { GlobalStyle } from "../styles/GlobalStyle";

export default function LeverandoerScreen() {
  // Log ud med bekræftelse, som på kundens Indstillinger.
  // onAuthStateChanged i App.js viser login-skærmen igen bagefter (mønster fra 06).
  function bekraeftLogUd() {
    Alert.alert("Log ud?", "Du kan altid logge ind igen med din e-mail.", [
      { text: "Annuller", style: "cancel" },
      {
        text: "Log ud",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);
          } catch (error) {
            Alert.alert("Kunne ikke logge ud", error.message);
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={GlobalStyle.skaerm}>
      <ScrollView contentContainerStyle={GlobalStyle.leverandoerIndhold}>
        <Image
          source={require("../assets/leverandoer-mockup.png")}
          style={GlobalStyle.mockupBillede}
          accessibilityLabel="Mock-up af leverandørsiden med indsigt i køb"
        />
        <Text style={GlobalStyle.fodnoteCentreret}>
          Mock-up: leverandørsiden er designet, men ikke bygget endnu.
        </Text>
        <Pressable
          onPress={bekraeftLogUd}
          accessibilityRole="button"
          style={({ pressed }) => [GlobalStyle.logUdKnap, pressed && GlobalStyle.trykket]}
        >
          <Text style={GlobalStyle.logUdTekst}>Log ud</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
