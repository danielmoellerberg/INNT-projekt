// ButikkerScreen: kundens Butikker-fane (Figma: 08 Butikker).
// Brugeren vælger, hvilke butikker de handler i. Valget bruges af filteret "Mine butikker"
// på Tilbud og gemmes lokalt på telefonen med AsyncStorage (mønster fra øvelse 08).
// Listen bygges ud fra de butikker, brugeren har kvitteringer fra, så der ikke er nogen
// hardcodet butiksliste. Figmas kort over butikker nær dig er ikke bygget endnu.

import React from "react";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import PrimaryButton from "../components/PrimaryButton";
import StoreRow from "../components/StoreRow";
import { useApp } from "../context/AppContext";
import { formaterRelativDato } from "../data/const";
import { GlobalStyle, Colors } from "../styles/GlobalStyle";

export default function ButikkerScreen({ navigation }) {
  const { kvitteringer, valgteButikker, skiftButik } = useApp();

  // Saml kvitteringerne per butik: hvor mange, og hvornår brugeren sidst handlede der.
  // Kvitteringerne er sorteret nyeste først, så den første, vi møder, er den seneste.
  const butikker = [];
  kvitteringer.forEach((k) => {
    const fundet = butikker.find((b) => b.navn === k.butik);
    if (fundet) {
      fundet.antal = fundet.antal + 1;
    } else {
      butikker.push({ navn: k.butik, antal: 1, senest: k.dato });
    }
  });

  const Toppen = () => (
    <View style={GlobalStyle.sektioner}>
      <View style={GlobalStyle.skaermHeader}>
        <Text style={GlobalStyle.titelStor}>Butikker</Text>
        <Text style={GlobalStyle.undertitel}>Vi viser kun tilbud fra de butikker, du vælger.</Text>
      </View>

      {/* Tom tilstand: listen fyldes, når brugeren scanner kvitteringer */}
      {butikker.length === 0 ? (
        <View style={GlobalStyle.tomTilstand}>
          <View style={GlobalStyle.tomIkon}>
            <Ionicons name="location-outline" size={28} color={Colors.primary} />
          </View>
          <Text style={GlobalStyle.tomTitel}>Ingen butikker endnu</Text>
          <Text style={GlobalStyle.tomTekst}>
            Butikkerne, du handler i, dukker op her, når du scanner dine kvitteringer.
          </Text>
          <View style={GlobalStyle.tomHandling}>
            <PrimaryButton label="Scan kvittering" onPress={() => navigation.navigate("Scan")} />
          </View>
        </View>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={GlobalStyle.skaerm} edges={["top"]}>
      <FlatList
        data={butikker}
        keyExtractor={(item) => item.navn}
        ListHeaderComponent={Toppen}
        ListHeaderComponentStyle={GlobalStyle.listeHeader}
        contentContainerStyle={GlobalStyle.listeIndhold}
        // Skillelinjen ligger på hvid baggrund, så rækkerne ser ud som ét samlet kort
        ItemSeparatorComponent={() => (
          <View style={GlobalStyle.butikSkillelinjeOmraade}>
            <View style={GlobalStyle.skillelinje} />
          </View>
        )}
        renderItem={({ item, index }) => (
          // Første og sidste række får runde hjørner, så listen ligner ét kort som i Figma
          <View
            style={[
              GlobalStyle.butikRække,
              index === 0 && GlobalStyle.butikRækkeFoerste,
              index === butikker.length - 1 && GlobalStyle.butikRækkeSidste,
            ]}
          >
            <StoreRow
              butik={item.navn}
              info={item.antal + (item.antal === 1 ? " kvittering" : " kvitteringer") + " · senest " + formaterRelativDato(item.senest).toLowerCase()}
              valgt={valgteButikker[item.navn] === true}
              onSkift={(valgt) => skiftButik(item.navn, valgt)}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
