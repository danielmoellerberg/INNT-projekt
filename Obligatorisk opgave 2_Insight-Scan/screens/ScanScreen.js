// ScanScreen: kundens Scan-fane, den midterste fane (Figma: 06 Scan).
// Genbrugt fra opgave 1: scanningen er stadig simuleret - et tryk på udløseren "læser" en
// kvittering efter et kort øjeblik (setTimeout). Nyt i opgave 2: skærmen ligner et kamera
// som i Figma, og kvitteringen gemmes i Firebase. Bagefter åbnes kvitteringen, så brugeren
// kan se, hvad der blev læst, og hvor meget cashback det gav.

import React, { useState } from "react";
import { View, Text, Pressable, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { useApp } from "../context/AppContext";
import { GlobalStyle, Colors, bredde } from "../styles/GlobalStyle";

// Længden på de grå linjer i den stiliserede kvittering (fra Figma), så den ligner tekst
const SILHUET_LINJER = [90, 140, 120, 140, 100, 140, 130, 60];

export default function ScanScreen({ navigation }) {
  const { scanNyKvittering } = useApp();
  // scanner = true mens vi "læser" kvitteringen
  const [scanner, setScanner] = useState(false);
  // Statuslinjen skal kun være lys, mens Scan-skærmen er den aktive fane (mønster fra 07)
  const erFokuseret = useIsFocused();

  // Simulerer at en AI læser kvitteringen. I en rigtig app ville vi her tage et billede med
  // kameraet (mønster fra øvelse 07) og sende det til en tekstgenkendelse.
  function scan() {
    setScanner(true);
    setTimeout(async () => {
      try {
        // Contexten gemmer kvitteringen i Firebase og regner cashback ud
        const kvittering = await scanNyKvittering();
        // Åbn den nye kvittering inde i Hjem-fanens stack. initial: false lægger Hjem
        // nedenunder, så tilbage-knappen fører til Hjem.
        navigation.navigate("Hjem", { screen: "Kvittering", params: { kvittering }, initial: false });
      } catch (error) {
        Alert.alert("Kunne ikke gemme kvitteringen", error.message);
      } finally {
        setScanner(false);
      }
    }, 1500);
  }

  return (
    <SafeAreaView style={GlobalStyle.scanSkaerm}>
      {erFokuseret ? <StatusBar style="light" /> : null}

      <View style={GlobalStyle.scanTopBar}>
        {/* Luk sender brugeren tilbage til Hjem */}
        <Pressable
          onPress={() => navigation.navigate("Hjem")}
          accessibilityRole="button"
          accessibilityLabel="Luk scanning"
          style={GlobalStyle.glasKnap}
        >
          <Ionicons name="close" size={20} color={Colors.text} />
        </Pressable>
        <View style={GlobalStyle.scanHint}>
          <Text style={GlobalStyle.scanHintTekst}>Automatisk scanning</Text>
        </View>
        {/* Lommelygte-knappen er kun visuel, indtil kameraet kobles på */}
        <View style={GlobalStyle.glasKnap}>
          <Ionicons name="flash-outline" size={20} color={Colors.text} />
        </View>
      </View>

      <View style={GlobalStyle.scanSoeger}>
        <View style={GlobalStyle.scanRamme}>
          <View style={GlobalStyle.kvitteringSilhuet}>
            {SILHUET_LINJER.map((laengde, i) => (
              <View key={i} style={[GlobalStyle.silhuetLinje, bredde(laengde)]} />
            ))}
          </View>
          <View style={[GlobalStyle.hjoerne, GlobalStyle.hjoerneTopVenstre]} />
          <View style={[GlobalStyle.hjoerne, GlobalStyle.hjoerneTopHoejre]} />
          <View style={[GlobalStyle.hjoerne, GlobalStyle.hjoerneBundVenstre]} />
          <View style={[GlobalStyle.hjoerne, GlobalStyle.hjoerneBundHoejre]} />
        </View>
        {scanner ? (
          <ActivityIndicator size="large" color={Colors.onPrimary} />
        ) : null}
        <Text style={GlobalStyle.scanInstruktion}>
          {scanner ? "Læser kvittering ..." : "Hold kvitteringen inden for rammen"}
        </Text>
      </View>

      <View style={GlobalStyle.scanKontroller}>
        {/* Galleri er kun visuelt, indtil billedvalg kobles på */}
        <View style={GlobalStyle.kontrolKolonne}>
          <View style={GlobalStyle.galleriKnap}>
            <Ionicons name="image-outline" size={22} color={Colors.text} />
          </View>
          <Text style={GlobalStyle.kontrolTekst}>Galleri</Text>
        </View>

        {/* Udløseren starter den simulerede scanning */}
        <Pressable
          onPress={scan}
          disabled={scanner}
          accessibilityRole="button"
          accessibilityLabel="Scan kvittering"
          style={({ pressed }) => [GlobalStyle.udloeser, (pressed || scanner) && GlobalStyle.trykket]}
        >
          <View style={GlobalStyle.udloeserIndre} />
        </Pressable>

        {/* Tom plads, så udløseren står i midten som i Figma */}
        <View style={GlobalStyle.kontrolPlads} />
      </View>
    </SafeAreaView>
  );
}
