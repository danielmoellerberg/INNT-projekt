import React from "react";
import { View, Text, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import ButtonComponent from "./ButtonComponent";
import { useApp } from "../context/AppContext";
import { datoTilDate } from "../data/const";
import { GlobalStyle, Colors } from "../styles/GlobalStyle";

// Hvor mange dage må der gå uden en scanning, før vi minder brugeren om det?
// Ligger her øverst, så grænsen er nem at ændre.
const PAAMINDELSE_DAGE = 5;

// Påmindelsesbanner mod "glemsel" - det største tema i brugerundersøgelsen.
// Vises øverst på OverblikScreen, hvis den seneste kvittering er PAAMINDELSE_DAGE eller ældre.
export default function ScanReminderBanner({ navigation }) {
  const { kvitteringer, bannerLukket, lukBanner } = useApp();

  // Brugeren har lukket banneret i denne session, eller der er slet ingen kvitteringer
  if (bannerLukket || kvitteringer.length === 0) {
    return null;
  }

  // Find datoen på den nyeste kvittering.
  // Vi laver alle datoer om til Date-objekter og beholder den største (= nyeste).
  const senesteDato = kvitteringer
    .map((k) => datoTilDate(k.dato))
    .reduce((nyeste, dato) => (dato > nyeste ? dato : nyeste));

  // Dags dato kl. 00:00, så vi tæller hele dage og ikke timer
  const nu = new Date();
  const iDag = new Date(nu.getFullYear(), nu.getMonth(), nu.getDate());

  // Millisekunder mellem de to datoer, omregnet til dage
  const msPerDag = 1000 * 60 * 60 * 24;
  const dageSiden = Math.floor((iDag - senesteDato) / msPerDag);

  // Har brugeren scannet for nylig? Så er der ikke brug for en påmindelse.
  if (dageSiden < PAAMINDELSE_DAGE) {
    return null;
  }

  return (
    <View style={GlobalStyle.banner}>
      <View style={GlobalStyle.bannerTop}>
        <Ionicons
          name="alarm-outline"
          size={22}
          color={Colors.accent}
          style={GlobalStyle.bannerIkon}
        />
        <Text style={GlobalStyle.bannerTekst}>
          Du har ikke scannet i {dageSiden} dage. Husk dine bonner fra ugens indkøb!
        </Text>

        {/* Lille luk-knap - skjuler banneret resten af sessionen */}
        <Pressable style={GlobalStyle.bannerLukKnap} onPress={lukBanner}>
          <Text style={GlobalStyle.bannerLukTekst}>Luk</Text>
        </Pressable>
      </View>

      {/* Navigerer til Scan-fanen */}
      <ButtonComponent title="Scan nu" onPress={() => navigation.navigate("Scan")} />
    </View>
  );
}
