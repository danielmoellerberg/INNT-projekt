// IndstillingerScreen: profil, notifikationer og log ud (Figma: 10 Indstillinger).
// Åbnes fra profilknappen øverst til højre på Hjem. Notifikations-indstillingerne gemmes
// lokalt med AsyncStorage (mønster fra 08) via AppContext. "Påmind mig om at scanne"
// styrer påmindelsesbanneret på Hjem.

import React from "react";
import { View, Text, ScrollView, Pressable, Switch, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";

import { useApp } from "../context/AppContext";
import { auth } from "../database/firebase";
import { GlobalStyle, Colors } from "../styles/GlobalStyle";

// Én række i en indstillingsliste: ikon, tekst og noget til højre (kontakt, værdi eller pil)
function IndstillingRaekke({ ikon, tekst, children }) {
  return (
    <View style={GlobalStyle.indstillingRække}>
      <View style={GlobalStyle.indstillingIkon}>
        <Ionicons name={ikon} size={18} color={Colors.primary} />
      </View>
      <Text style={GlobalStyle.indstillingTekst}>{tekst}</Text>
      {children}
    </View>
  );
}

export default function IndstillingerScreen({ navigation }) {
  const { profil, user, indstillinger, skiftIndstilling, valgteButikker } = useApp();

  const navn = profil && profil.navn ? profil.navn : "Din profil";
  const email = (profil && profil.email) || (user && user.email) || "";
  const rolle = profil && profil.rolle === "leverandoer" ? "Leverandør" : "Kunde";
  // Antal butikker, hvor kontakten står til
  const antalButikker = Object.keys(valgteButikker).filter((b) => valgteButikker[b]).length;

  // Log ud kræver en bekræftelse, så man ikke logger ud ved et uheld.
  // Alert med to knapper: "Annuller" lukker bare dialogen, "Log ud" logger ud.
  // Selve skærmskiftet til login sker i App.js via onAuthStateChanged (mønster fra 06).
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

  // Kort forklaring af, hvordan data bruges (svarer til fodnoterne i Figma)
  function visPrivatliv() {
    Alert.alert(
      "Privatliv og data",
      "Dine kvitteringer gemmes på din konto. Leverandører ser kun anonymiserede tal for grupper på mindst 50 kunder."
    );
  }

  return (
    <ScrollView style={GlobalStyle.skaerm} contentContainerStyle={GlobalStyle.skaermIndhold}>
      <Text style={GlobalStyle.titelStor}>Indstillinger</Text>

      <View style={GlobalStyle.profilKort}>
        <View style={GlobalStyle.avatar}>
          <Text style={GlobalStyle.avatarTekst}>{navn.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={GlobalStyle.rækkeTekst}>
          <Text style={GlobalStyle.profilNavn}>{navn}</Text>
          <Text style={GlobalStyle.rækkeInfo}>{email} · {rolle}</Text>
        </View>
      </View>

      <View style={GlobalStyle.gruppe}>
        <Text style={GlobalStyle.gruppeTitel}>NOTIFIKATIONER</Text>
        <View style={GlobalStyle.gruppeListe}>
          <IndstillingRaekke ikon="notifications-outline" tekst="Nye tilbud på dine varer">
            <Switch
              value={indstillinger.nyeTilbud}
              onValueChange={(til) => skiftIndstilling("nyeTilbud", til)}
              trackColor={{ false: Colors.separator, true: Colors.primary }}
              ios_backgroundColor={Colors.separator}
            />
          </IndstillingRaekke>
          <View style={GlobalStyle.skillelinje} />
          <IndstillingRaekke ikon="notifications-outline" tekst="Påmind mig om at scanne">
            <Switch
              value={indstillinger.paamindScan}
              onValueChange={(til) => skiftIndstilling("paamindScan", til)}
              trackColor={{ false: Colors.separator, true: Colors.primary }}
              ios_backgroundColor={Colors.separator}
            />
          </IndstillingRaekke>
        </View>
      </View>

      <View style={GlobalStyle.gruppe}>
        <Text style={GlobalStyle.gruppeTitel}>KONTO</Text>
        <View style={GlobalStyle.gruppeListe}>
          <IndstillingRaekke ikon="card-outline" tekst="Udbetaling">
            <Text style={GlobalStyle.indstillingVaerdi}>Ved 250 kr.</Text>
          </IndstillingRaekke>
          <View style={GlobalStyle.skillelinje} />
          {/* Går til Butikker-fanen, hvor butikkerne vælges */}
          <Pressable
            onPress={() => navigation.navigate("Butikker")}
            accessibilityRole="button"
            style={({ pressed }) => pressed && GlobalStyle.trykket}
          >
            <IndstillingRaekke ikon="location-outline" tekst="Mine butikker">
              <Text style={GlobalStyle.indstillingVaerdi}>{antalButikker} valgt</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
            </IndstillingRaekke>
          </Pressable>
          <View style={GlobalStyle.skillelinje} />
          <Pressable
            onPress={visPrivatliv}
            accessibilityRole="button"
            style={({ pressed }) => pressed && GlobalStyle.trykket}
          >
            <IndstillingRaekke ikon="lock-closed-outline" tekst="Privatliv og data">
              <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
            </IndstillingRaekke>
          </Pressable>
        </View>
      </View>

      <Pressable
        onPress={bekraeftLogUd}
        accessibilityRole="button"
        style={({ pressed }) => [GlobalStyle.logUdKnap, pressed && GlobalStyle.trykket]}
      >
        <Text style={GlobalStyle.logUdTekst}>Log ud</Text>
      </Pressable>

      <Text style={GlobalStyle.fodnoteCentreret}>Insight-Scan version 2.0</Text>
    </ScrollView>
  );
}
