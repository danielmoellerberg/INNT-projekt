// OpretBrugerScreen: her opretter en ny bruger sig og vælger sin rolle.
// Insight-Scan er en tosidet platform, så rollen afgør hvilken side af appen man ser:
// "kunde" (scanner kvitteringer) eller "leverandoer" (opretter cashback-tilbud).
// Rollen gemmes i Realtime Database under users/{uid}/profil, hvor App.js læser den.

import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, update } from "firebase/database";

import ButtonComponent from "../components/ButtonComponent";
import { auth, rtdb } from "../database/firebase";
import { GlobalStyle } from "../styles/GlobalStyle";

export default function OpretBrugerScreen() {
  const [email, setEmail] = useState("");
  const [kodeord, setKodeord] = useState("");
  // Kunde er valgt som standard, fordi de fleste brugere er kunder
  const [rolle, setRolle] = useState("kunde");
  const [arbejder, setArbejder] = useState(false);

  // Opretter brugeren i Firebase Auth og gemmer derefter profilen med rollen.
  // Vi bruger update (mønster fra øvelse 05), som også opretter stien, hvis den ikke findes.
  // Når brugeren er oprettet, er man automatisk logget ind, og onAuthStateChanged i
  // App.js skifter selv skærm - derfor navigerer vi ikke herfra.
  async function opretBruger() {
    setArbejder(true);
    try {
      const resultat = await createUserWithEmailAndPassword(auth, email.trim(), kodeord);
      const uid = resultat.user.uid;
      await update(ref(rtdb, `users/${uid}/profil`), {
        rolle: rolle,
        email: email.trim(),
        oprettet: Date.now(),
      });
    } catch (error) {
      Alert.alert("Kunne ikke oprette bruger", error.message);
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
      <Text style={GlobalStyle.authTitel}>Opret bruger</Text>
      <Text style={GlobalStyle.authUndertitel}>Vælg om du er kunde eller leverandør</Text>

      {/* Rollevalg: den valgte rolle vises som en fyldt knap, den anden som en kant-knap */}
      <View style={GlobalStyle.knapRække}>
        <ButtonComponent
          title="Kunde"
          type={rolle === "kunde" ? "primary" : "secondary"}
          halv={true}
          onPress={() => setRolle("kunde")}
        />
        <ButtonComponent
          title="Leverandør"
          type={rolle === "leverandoer" ? "primary" : "secondary"}
          halv={true}
          onPress={() => setRolle("leverandoer")}
        />
      </View>

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
        placeholder="Kodeord (mindst 6 tegn)"
        value={kodeord}
        onChangeText={setKodeord}
        secureTextEntry
      />

      <ButtonComponent title="Opret bruger" onPress={opretBruger} disabled={arbejder} />
    </ScrollView>
  );
}
