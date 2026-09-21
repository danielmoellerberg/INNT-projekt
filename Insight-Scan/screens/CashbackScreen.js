import React from "react";
import { View, Text, FlatList } from "react-native";

import ButtonComponent from "../components/ButtonComponent";
import { useApp } from "../context/AppContext";
import { GlobalStyle } from "../styles/GlobalStyle";

export default function CashbackScreen({ navigation }) {
  // Saldoen og tilbuddene kommer fra contexten, så saldoen er den samme
  // som på overblikket
  const { saldo, tilbud, kvitteringer } = useApp();

  // Hvor mange af brugerens varer har matchet et tilbud?
  const alleVarer = kvitteringer.flatMap((k) => k.varer);

  // Toppen af skærmen: saldo + forklaring + knap
  const Toppen = () => (
    <View>
      {/* Brugerens cashback-saldo */}
      <View style={GlobalStyle.saldoKort}>
        <Text style={GlobalStyle.saldoEtiket}>Din cashback-saldo</Text>
        <Text style={GlobalStyle.saldoTal}>{saldo} kr</Text>
      </View>

      <View style={GlobalStyle.kort}>
        <Text style={GlobalStyle.brødtekst}>
          Du tjener penge på varer du alligevel køber. Scan din kvittering, og
          vi lægger automatisk cashbacken til din saldo.
        </Text>
      </View>

      <ButtonComponent
        title="Scan en kvittering"
        onPress={() => navigation.navigate("Scan")}
      />

      <Text style={GlobalStyle.sektionsTitel}>Aktuelle tilbud</Text>
    </View>
  );

  return (
    <View style={GlobalStyle.container}>
      {/* Listen over cashback-tilbud */}
      <FlatList
        data={tilbud}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={Toppen}
        contentContainerStyle={GlobalStyle.listeIndhold}
        renderItem={({ item }) => {
          // Har brugeren købt varen før? Så viser vi det som et lille hint.
          const antalKøbt = alleVarer.filter((v) => v.navn === item.vare).length;

          return (
            <View style={GlobalStyle.tilbudKort}>
              <View style={GlobalStyle.tilbudVenstre}>
                <Text style={GlobalStyle.tilbudBrand}>{item.brand}</Text>
                <Text style={GlobalStyle.tilbudVare}>{item.vare}</Text>
                <Text style={GlobalStyle.tilbudBrand}>
                  {antalKøbt > 0
                    ? "Du har købt den " + antalKøbt + " gange"
                    : "Du har ikke købt den endnu"}
                </Text>
              </View>
              <View style={GlobalStyle.tilbudBeloebBoks}>
                <Text style={GlobalStyle.tilbudBeloeb}>{item.beloeb} kr</Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
