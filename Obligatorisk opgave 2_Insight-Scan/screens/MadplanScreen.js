// MadplanScreen: Madplan-fanen som en tydelig "kommende funktion" (Figma: 07 Madplan).
// Fanen beholdes, så Scan stadig står i midten af tab-baren. Skærmen fortæller, hvad Madplan
// vil kunne, og har én knap, der virker i dag (indkøbslisten).
//
// FAKE DOOR-TEST (Lean Startup): knappen "Giv mig besked, når den er klar" er en "falsk dør".
// Funktionen findes ikke endnu, men hvert tryk gemmes i users/{uid}/interesse/madplan. Så kan vi
// måle, hvor mange der faktisk vil have en madplan, FØR vi bruger tid på at bygge den.
// Det er en billig måde at teste værdihypotesen på med rigtig adfærd i stedet for at spørge.

import React from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import { useApp } from "../context/AppContext";
import { GlobalStyle, Colors } from "../styles/GlobalStyle";

// Hvad Madplan vil kunne (vises som tre korte punkter med ikon)
const PUNKTER = [
  { ikon: "pricetag-outline", tekst: "Madplan ud fra ugens tilbud" },
  { ikon: "cart-outline", tekst: "Indkøbsliste med ét tryk" },
  { ikon: "logo-tiktok", tekst: "Opskrifter fra TikTok og Instagram" },
];

export default function MadplanScreen({ navigation }) {
  const { interesse, visInteresse } = useApp();
  // Har brugeren allerede bedt om besked? Læses fra Firebase, så det huskes efter genstart.
  const harTilmeldt = Boolean(interesse.madplan);

  // Gemmer interessen i Firebase. Knappen skifter selv til "Du får besked", fordi AppContext
  // lytter på users/{uid}/interesse med onValue.
  async function tilmeld() {
    try {
      await visInteresse("madplan");
    } catch (error) {
      Alert.alert("Det lykkedes ikke", "Tjek din internetforbindelse, og prøv igen.");
    }
  }

  return (
    <SafeAreaView style={GlobalStyle.skaerm} edges={["top"]}>
      <ScrollView contentContainerStyle={[GlobalStyle.skaermIndhold, GlobalStyle.kommerSnart]}>
        <View style={GlobalStyle.kommerSnartTop}>
          <View style={GlobalStyle.tomIkon}>
            <Ionicons name="restaurant-outline" size={28} color={Colors.primary} />
          </View>
          <Text style={GlobalStyle.tomTitel}>Madplan kommer snart</Text>
          <Text style={GlobalStyle.tomTekst}>
            Snart kan AI lave en madplan ud fra ugens tilbud og det, du plejer at købe.
          </Text>
        </View>

        <View style={GlobalStyle.kommerSnartPunkter}>
          {PUNKTER.map((punkt) => (
            <View key={punkt.tekst} style={GlobalStyle.kommerSnartPunkt}>
              <Ionicons name={punkt.ikon} size={20} color={Colors.primary} />
              <Text style={GlobalStyle.kommerSnartPunktTekst}>{punkt.tekst}</Text>
            </View>
          ))}
        </View>

        <View style={GlobalStyle.kommerSnartKnapper}>
          {/* Indkøbslisten virker i dag. Den ligger i Tilbud-fanens stack, og initial: false
              lægger Tilbud nedenunder, så tilbage-knappen på indkøbslisten fører til Tilbud. */}
          <PrimaryButton
            label="Gå til indkøbsliste"
            onPress={() => navigation.navigate("Tilbud", { screen: "Indkoebsliste", initial: false })}
          />
          {/* Fake door: efter tryk vises et flueben, og knappen kan ikke trykkes igen */}
          <SecondaryButton
            label={harTilmeldt ? "Du får besked" : "Giv mig besked, når den er klar"}
            ikon={harTilmeldt ? "checkmark" : null}
            onPress={tilmeld}
            disabled={harTilmeldt}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
