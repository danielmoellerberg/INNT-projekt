// LoginScreen: første skærm for brugere, der ikke er logget ind.
// Brugeren logger ind med email og kodeord. Når login lykkes, opdager onAuthStateChanged
// i App.js det og skifter selv til kunde- eller leverandørsiden, så denne skærm
// behøver ikke at navigere nogen steder hen (mønster fra øvelse 06).

import React, { useState } from "react";
import { Text, TextInput, Pressable, ScrollView, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";

import ButtonComponent from "../components/ButtonComponent";
import { auth } from "../database/firebase";
import { GlobalStyle } from "../styles/GlobalStyle";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [kodeord, setKodeord] = useState("");
  // Slår knappen fra, mens vi venter på svar fra Firebase, så man ikke trykker to gange
  const [arbejder, setArbejder] = useState(false);

  // Logger ind via Firebase Auth. Fejl (fx forkert kodeord) vises i en Alert
  async function logInd() {
    setArbejder(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), kodeord);
    } catch (error) {
      Alert.alert("Kunne ikke logge ind", error.message);
    } finally {
      setArbejder(false);
    }
  }

  return (
    <ScrollView
      style={GlobalStyle.container}
      contentContainerStyle={GlobalStyle.authIndhold}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={GlobalStyle.authTitel}>Insight-Scan</Text>
      <Text style={GlobalStyle.authUndertitel}>Log ind for at se dit forbrug og din cashback</Text>

      <TextInput
        style={GlobalStyle.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={GlobalStyle.input}
        placeholder="Kodeord"
        value={kodeord}
        onChangeText={setKodeord}
        secureTextEntry
      />

      <ButtonComponent title="Log ind" onPress={logInd} disabled={arbejder} />

      {/* Link til OpretBrugerScreen i samme stack */}
      <Pressable onPress={() => navigation.navigate("OpretBruger")}>
        <Text style={GlobalStyle.linkTekst}>Har du ikke en bruger? Opret bruger</Text>
      </Pressable>
    </ScrollView>
  );
}
