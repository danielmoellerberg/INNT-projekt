// ScanReminderBanner: påmindelse om at scanne (fra opgave 1).
// Glemsel var det største tema i brugerundersøgelsen, så banneret vises øverst på Hjem,
// hvis den nyeste kvittering er PAAMINDELSE_DAGE eller ældre. Det kan slås fra under
// Indstillinger ("Påmind mig om at scanne") og lukkes resten af sessionen.

import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import PrimaryButton from "./PrimaryButton";
import { useApp } from "../context/AppContext";
import { dageSiden } from "../data/const";
import { GlobalStyle, Colors } from "../styles/GlobalStyle";

// Hvor mange dage må der gå uden en scanning, før vi minder brugeren om det?
const PAAMINDELSE_DAGE = 5;

export default function ScanReminderBanner({ onScan }) {
  const { kvitteringer, indstillinger, bannerLukket, lukBanner } = useApp();

  // Intet banner, hvis det er slået fra, lukket, eller der endnu ikke er nogen kvitteringer
  // (så viser Hjem i stedet en tom tilstand med en opfordring til at scanne)
  if (!indstillinger.paamindScan || bannerLukket || kvitteringer.length === 0) {
    return null;
  }

  // Kvitteringerne er sorteret nyeste først, så den første er den seneste
  const dage = dageSiden(kvitteringer[0].dato);
  if (dage < PAAMINDELSE_DAGE) {
    return null;
  }

  return (
    <View style={GlobalStyle.banner}>
      <View style={GlobalStyle.bannerTop}>
        <Ionicons name="alarm-outline" size={22} color={Colors.cashback} />
        <Text style={GlobalStyle.bannerTekst}>
          Du har ikke scannet i {dage} dage. Husk dine bonner fra ugens indkøb!
        </Text>
        <Pressable onPress={lukBanner} accessibilityRole="button" accessibilityLabel="Luk påmindelsen">
          <Text style={GlobalStyle.bannerLukTekst}>Luk</Text>
        </Pressable>
      </View>
      <PrimaryButton label="Scan nu" onPress={onScan} />
    </View>
  );
}
