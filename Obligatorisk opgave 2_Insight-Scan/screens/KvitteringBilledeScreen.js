// KvitteringBilledeScreen: viser billedet af den rigtige bon i fuld størrelse.
// Åbnes ved at trykke på det lille billede på KvitteringScreen, som sender stien med (route.params).
// Så kan brugeren selv sammenligne AI'ens aflæsning med det, der står på bonen.
// På iPhone kan man knibe for at zoome, fordi billedet ligger i en ScrollView med zoom.

import React from "react";
import { ScrollView, Image, Text } from "react-native";

import { GlobalStyle } from "../styles/GlobalStyle";

export default function KvitteringBilledeScreen({ route }) {
  const { uri } = route.params;

  return (
    <>
      {/* maximumZoomScale giver knib-zoom på iOS. resizeMode "contain" viser hele bonen uden at beskære den. */}
      <ScrollView
        style={GlobalStyle.bonFuldSkaerm}
        contentContainerStyle={GlobalStyle.bonFuldIndhold}
        maximumZoomScale={4}
        minimumZoomScale={1}
        centerContent
      >
        <Image
          source={{ uri: uri }}
          style={GlobalStyle.bonFuldBillede}
          resizeMode="contain"
          accessibilityLabel="Billede af kvitteringen"
        />
      </ScrollView>
      <Text style={GlobalStyle.bonFuldHint}>Knib for at zoome ind på bonen</Text>
    </>
  );
}
