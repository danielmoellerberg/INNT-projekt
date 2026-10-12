// LeverandoerScreen: den side, en bruger med rollen "leverandoer" ser efter login.
// Leverandørsiden bygges ikke funktionelt i opgave 2. Skærmen viser et mock-up-billede
// af, hvordan den kunne se ud (opgavebeskrivelsen tillader mock-up-skærme), og en Log ud-knap.
// Billedet er en midlertidig placeholder: erstat assets/leverandoer-mockup.png med det rigtige mockup.

import React from "react";
import { Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";

import ButtonComponent from "../components/ButtonComponent";
import { auth } from "../database/firebase";
import { GlobalStyle } from "../styles/GlobalStyle";

export default function LeverandoerScreen() {
  // Logger ud. onAuthStateChanged i App.js opdager det og viser login-skærmen igen (mønster fra 06)
  async function logUd() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Log ud fejlede:", error.message);
    }
  }

  return (
    // SafeAreaView holder indholdet fri af notch og home-indikator (mønster fra øvelse 07)
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.leverandoerIndhold]}>
      <Text style={GlobalStyle.authTitel}>Leverandør</Text>
      <Text style={GlobalStyle.authUndertitel}>Mock-up af leverandørsiden</Text>
      <Image source={require("../assets/leverandoer-mockup.png")} style={GlobalStyle.mockupBillede} />
      <ButtonComponent title="Log ud" type="secondary" onPress={logUd} />
    </SafeAreaView>
  );
}
