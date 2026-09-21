import React from "react";
import { View, Text, ScrollView } from "react-native";

import ButtonComponent from "../components/ButtonComponent";
import { useApp } from "../context/AppContext";
import { GlobalStyle } from "../styles/GlobalStyle";

export default function KvitteringScreen({ route, navigation }) {
  // Kvitteringen sendes med som parameter, når man trykker på den i OverblikScreen
  const { kvittering } = route.params;
  const { tilbud } = useApp();

  // Find de kategorier der faktisk er varer i på lige netop denne kvittering
  const kategorier = [...new Set(kvittering.varer.map((v) => v.kategori))];

  // Hjælpefunktion: gav denne vare cashback? Returnerer tilbuddet eller undefined.
  function findCashback(vare) {
    return tilbud.find((t) => t.vare === vare.navn);
  }

  // Samlet cashback på kvitteringen
  const cashbackIalt = kvittering.varer.reduce((sum, vare) => {
    const match = findCashback(vare);
    return match ? sum + match.beloeb : sum;
  }, 0);

  return (
    <ScrollView style={GlobalStyle.container} contentContainerStyle={GlobalStyle.listeIndhold}>
      {/* Overskrift med butik, dato og total */}
      <View style={GlobalStyle.kort}>
        <Text style={GlobalStyle.kvitteringButik}>{kvittering.butik}</Text>
        <Text style={GlobalStyle.kvitteringDato}>{kvittering.dato}</Text>
        <View style={GlobalStyle.rækkeMedLinje}>
          <Text style={GlobalStyle.etiket}>Total</Text>
          <Text style={GlobalStyle.værdi}>{kvittering.total} kr</Text>
        </View>
        <View style={GlobalStyle.række}>
          <Text style={GlobalStyle.etiket}>Cashback på denne kvittering</Text>
          <Text style={GlobalStyle.værdi}>{cashbackIalt} kr</Text>
        </View>
      </View>

      {/* Varelinjerne grupperet i kategorier - ét kort per kategori */}
      {kategorier.map((kategori) => (
        <View key={kategori} style={GlobalStyle.kort}>
          <Text style={GlobalStyle.kategoriTitel}>{kategori}</Text>

          {kvittering.varer
            .filter((vare) => vare.kategori === kategori)
            .map((vare, index) => {
              const cashback = findCashback(vare);
              return (
                <View key={index} style={GlobalStyle.rækkeMedLinje}>
                  <Text style={GlobalStyle.vareNavn}>{vare.navn}</Text>

                  {/* Varer der gav cashback får et lille mærke */}
                  {cashback ? (
                    <View style={GlobalStyle.cashbackMærke}>
                      <Text style={GlobalStyle.cashbackMærkeTekst}>
                        +{cashback.beloeb} kr
                      </Text>
                    </View>
                  ) : null}

                  <Text style={GlobalStyle.varePris}>{vare.pris} kr</Text>
                </View>
              );
            })}
        </View>
      ))}

      <ButtonComponent
        title="Tilbage til overblik"
        type="secondary"
        onPress={() => navigation.goBack()}
      />
    </ScrollView>
  );
}
