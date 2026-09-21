import React, { useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import ButtonComponent from "../components/ButtonComponent";
import { useApp } from "../context/AppContext";
import { GlobalStyle, Colors } from "../styles/GlobalStyle";

export default function ScanScreen({ navigation }) {
  const { scanNyKvittering } = useApp();

  // scanner = true mens vi "læser" kvitteringen
  const [scanner, setScanner] = useState(false);
  // besked = resultatet af sidste scanning
  const [besked, setBesked] = useState("");

  function scan() {
    setScanner(true);
    setBesked("");

    // Vi simulerer at en AI læser kvitteringen. I en rigtig app ville vi her
    // tage et billede og sende det til en tekstgenkendelse (OCR).
    setTimeout(() => {
      // Contexten tilføjer kvitteringen, matcher varerne mod cashback-tilbuddene
      // og lægger beløbet til saldoen
      const resultat = scanNyKvittering();

      setScanner(false);
      setBesked(
        "Kvittering fra " +
          resultat.kvittering.butik +
          " på " +
          resultat.kvittering.total +
          " kr er tilføjet. Du fik " +
          resultat.cashback +
          " kr i cashback."
      );

      // Send brugeren tilbage til overblikket, så de kan se de nye tal
      navigation.navigate("Overblik", { screen: "Overblik" });
    }, 1500);
  }

  return (
    <View style={GlobalStyle.container}>
      <View style={GlobalStyle.centreret}>
        <View style={GlobalStyle.scanBoks}>
          <Ionicons name="scan-outline" size={72} color={Colors.primary} />
          <Text style={GlobalStyle.scanTitel}>Scan din kvittering</Text>
          <Text style={GlobalStyle.scanTekst}>
            Vi læser varelinjerne og finder automatisk de varer, der giver
            cashback.
          </Text>

          {/* Mens der scannes viser vi en loader i stedet for teksten */}
          {scanner ? (
            <View>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={GlobalStyle.scanTekst}>Læser kvittering ...</Text>
            </View>
          ) : null}
        </View>

        {/* Knap der starter den simulerede scanning */}
        <ButtonComponent
          title={scanner ? "Scanner ..." : "Scan kvittering"}
          onPress={scan}
          disabled={scanner}
        />

        {/* Resultatet af sidste scanning */}
        {besked !== "" ? (
          <View style={GlobalStyle.statusBoks}>
            <Text style={GlobalStyle.statusTekst}>{besked}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
