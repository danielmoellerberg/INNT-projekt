// LoginScreen: første skærm for brugere, der ikke er logget ind (Figma: 01 Login).
// Brugeren logger ind med e-mail og adgangskode. Når login lykkes, opdager onAuthStateChanged
// i App.js det og skifter selv til kunde- eller leverandørsiden, så denne skærm
// behøver ikke at navigere nogen steder hen (mønster fra øvelse 06).

import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";

import PrimaryButton from "../components/PrimaryButton";
import TextField from "../components/TextField";
import { auth } from "../database/firebase";
import { GlobalStyle, Colors } from "../styles/GlobalStyle";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [kodeord, setKodeord] = useState("");
  // Slår knappen fra, mens vi venter på svar fra Firebase, så man ikke trykker to gange
  const [arbejder, setArbejder] = useState(false);

  // Logger ind via Firebase Auth. Fejl (fx forkert adgangskode) vises i en Alert
  async function logInd() {
    setArbejder(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), kodeord);
    } catch (error) {
      Alert.alert("Kunne ikke logge ind", "Tjek din e-mail og adgangskode, og prøv igen.");
    } finally {
      setArbejder(false);
    }
  }

  return (
    <SafeAreaView style={GlobalStyle.skaerm}>
      <ScrollView contentContainerStyle={GlobalStyle.loginIndhold} keyboardShouldPersistTaps="handled">
        <View style={GlobalStyle.brand}>
          <View style={GlobalStyle.logoFlise}>
            <Ionicons name="receipt-outline" size={38} color={Colors.onPrimary} />
          </View>
          <Text style={GlobalStyle.titelStor}>Insight-Scan</Text>
          <Text style={GlobalStyle.undertitel}>Scan bonen. Få cashback. Handl smartere.</Text>
        </View>

        <View style={GlobalStyle.felter}>
          <TextField
            label="E-mail"
            placeholder="navn@mail.dk"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextField
            label="Adgangskode"
            placeholder="••••••••"
            value={kodeord}
            onChangeText={setKodeord}
            secureTextEntry
          />
        </View>

        <PrimaryButton label="Log ind" onPress={logInd} disabled={arbejder} />

        {/* Link til OpretBrugerScreen i samme stack */}
        <Pressable onPress={() => navigation.navigate("OpretBruger")} accessibilityRole="button">
          <View style={GlobalStyle.opretLinkRække}>
            <Text style={GlobalStyle.opretLinkTekst}>Ny her?</Text>
            <Text style={GlobalStyle.opretLinkHandling}>Opret bruger</Text>
          </View>
        </Pressable>

        {/* Skubber fodnoten ned i bunden af skærmen */}
        <View style={GlobalStyle.fyld} />
        <Text style={GlobalStyle.fodnoteCentreret}>
          Dine kvitteringer deles kun anonymt og samlet med leverandører.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
