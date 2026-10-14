// OpretBrugerScreen: her opretter en ny bruger sig og vælger sin rolle (Figma: 02 Opret bruger).
// Insight-Scan er en tosidet platform, så rollen afgør hvilken side af appen man ser:
// "kunde" (scanner kvitteringer) eller "leverandoer" (ser indsigt og opretter tilbud).
// Navn og rolle gemmes i Realtime Database under users/{uid}/profil, hvor App.js læser dem.

import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, update } from "firebase/database";

import PrimaryButton from "../components/PrimaryButton";
import TextField from "../components/TextField";
import { auth, rtdb } from "../database/firebase";
import { GlobalStyle, Colors } from "../styles/GlobalStyle";

// De to roller, man kan vælge imellem. Teksterne er fra Figma.
const ROLLER = [
  {
    noegle: "kunde",
    titel: "Kunde",
    beskrivelse: "Scan kvitteringer, få cashback og personlige tilbud",
    ikon: "receipt-outline",
  },
  {
    noegle: "leverandoer",
    titel: "Leverandør",
    beskrivelse: "Se anonymiseret indsigt i køb af dine varer",
    ikon: "trending-up-outline",
  },
];

export default function OpretBrugerScreen() {
  const [navn, setNavn] = useState("");
  const [email, setEmail] = useState("");
  const [kodeord, setKodeord] = useState("");
  // Kunde er valgt som standard, fordi de fleste brugere er kunder
  const [rolle, setRolle] = useState("kunde");
  const [arbejder, setArbejder] = useState(false);

  // Opretter brugeren i Firebase Auth og gemmer derefter profilen med navn og rolle.
  // Vi bruger update (mønster fra øvelse 05), som også opretter stien, hvis den ikke findes.
  // Når brugeren er oprettet, er man automatisk logget ind, og onAuthStateChanged i
  // App.js skifter selv skærm - derfor navigerer vi ikke herfra.
  async function opretBruger() {
    // Simpel tjek før vi spørger Firebase, så fejlbeskeden er forståelig
    if (!navn.trim()) {
      Alert.alert("Mangler fornavn", "Skriv dit fornavn, så vi kan hilse på dig.");
      return;
    }
    if (kodeord.length < 8) {
      Alert.alert("For kort adgangskode", "Adgangskoden skal være mindst 8 tegn.");
      return;
    }

    setArbejder(true);
    try {
      const resultat = await createUserWithEmailAndPassword(auth, email.trim(), kodeord);
      await update(ref(rtdb, `users/${resultat.user.uid}/profil`), {
        navn: navn.trim(),
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
      style={GlobalStyle.skaerm}
      contentContainerStyle={GlobalStyle.opretIndhold}
      keyboardShouldPersistTaps="handled"
    >
      <View style={GlobalStyle.skaermHeader}>
        <Text style={GlobalStyle.titelStor}>Opret bruger</Text>
        <Text style={GlobalStyle.undertitel}>Vælg hvordan du vil bruge Insight-Scan.</Text>
      </View>

      {/* Rollevalg: det valgte kort er grønt med et flueben, det andet har en tom cirkel */}
      <View style={GlobalStyle.rolleListe}>
        {ROLLER.map((r) => {
          const valgt = rolle === r.noegle;
          return (
            <Pressable
              key={r.noegle}
              onPress={() => setRolle(r.noegle)}
              accessibilityRole="radio"
              accessibilityState={{ selected: valgt }}
              style={[GlobalStyle.rolleKort, valgt && GlobalStyle.rolleKortValgt]}
            >
              <View style={[GlobalStyle.ikonFlise, valgt && GlobalStyle.ikonFliseHvid]}>
                <Ionicons name={r.ikon} size={22} color={Colors.primary} />
              </View>
              <View style={GlobalStyle.rækkeTekst}>
                <Text style={GlobalStyle.rækkeTitel}>{r.titel}</Text>
                <Text style={GlobalStyle.rækkeInfo}>{r.beskrivelse}</Text>
              </View>
              <View style={[GlobalStyle.radio, valgt && GlobalStyle.radioValgt]}>
                {valgt ? <Ionicons name="checkmark" size={16} color={Colors.onPrimary} /> : null}
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={GlobalStyle.felterTaet}>
        <TextField label="Fornavn" placeholder="Daniel" value={navn} onChangeText={setNavn} />
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
          placeholder="Mindst 8 tegn"
          value={kodeord}
          onChangeText={setKodeord}
          secureTextEntry
        />
      </View>

      <PrimaryButton label="Opret bruger" onPress={opretBruger} disabled={arbejder} />
    </ScrollView>
  );
}
