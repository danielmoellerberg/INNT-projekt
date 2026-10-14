// KvitteringScreen: detaljer om én kvittering i Hjem-stacken (Figma: 04 Kvittering).
// Genbrugt fra opgave 1: kvitteringen sendes med som parameter, og varer med cashback markeres.
// Nyt i opgave 2: opsætningen følger Figma, og kvitteringen kommer fra Firebase.

import React from "react";
import { View, Text, ScrollView } from "react-native";

import StoreLogo from "../components/StoreLogo";
import { formaterKroner, formaterTidspunkt } from "../data/const";
import { GlobalStyle } from "../styles/GlobalStyle";

export default function KvitteringScreen({ route }) {
  // Kvitteringen sendes med fra Hjem eller Scan med navigation.navigate (mønster fra 05 og 07)
  const { kvittering } = route.params;
  const varer = kvittering.varer || [];

  // Hvor mange varer gav cashback? Bruges i det gule banner øverst
  const varerMedCashback = varer.filter((vare) => vare.cashback > 0).length;

  return (
    <ScrollView style={GlobalStyle.skaerm} contentContainerStyle={GlobalStyle.skaermIndhold}>
      <View style={GlobalStyle.kvitteringHeader}>
        <StoreLogo butik={kvittering.butik} stor />
        <View>
          <Text style={GlobalStyle.kvitteringTitel}>{kvittering.butik}</Text>
          <Text style={GlobalStyle.kvitteringUndertitel}>
            {kvittering.adresse ? kvittering.adresse + " · " : ""}
            {formaterTidspunkt(kvittering.dato)}
          </Text>
        </View>
      </View>

      {/* Banneret vises kun, hvis kvitteringen faktisk gav cashback */}
      {kvittering.cashback > 0 ? (
        <View style={GlobalStyle.cashbackBanner}>
          <Text style={GlobalStyle.cashbackBannerTekst}>
            Du fik cashback på {varerMedCashback} {varerMedCashback === 1 ? "vare" : "varer"}
          </Text>
          <Text style={GlobalStyle.cashbackBannerBeloeb}>+ {formaterKroner(kvittering.cashback)}</Text>
        </View>
      ) : null}

      <View style={GlobalStyle.vareKort}>
        <Text style={GlobalStyle.vareKortTitel}>{varer.length} varer</Text>

        {varer.map((vare, index) => (
          <View key={index} style={GlobalStyle.vareRække}>
            <View style={GlobalStyle.vareNavnKolonne}>
              <Text style={GlobalStyle.vareNavn}>{vare.navn}</Text>
              {/* Ekstra linje med antal og/eller cashback - kun hvis der er noget at vise */}
              {vare.antal > 1 || vare.cashback > 0 ? (
                <View style={GlobalStyle.vareMeta}>
                  {vare.antal > 1 ? <Text style={GlobalStyle.vareAntal}>{vare.antal} stk.</Text> : null}
                  {vare.cashback > 0 ? (
                    <Text style={GlobalStyle.vareCashback}>+ {formaterKroner(vare.cashback)} cashback</Text>
                  ) : null}
                </View>
              ) : null}
            </View>
            <Text style={GlobalStyle.varePris}>{formaterKroner(vare.pris)}</Text>
          </View>
        ))}

        <View style={GlobalStyle.skillelinje} />
        <View style={GlobalStyle.vareRække}>
          <Text style={GlobalStyle.totalTekst}>I alt</Text>
          <Text style={GlobalStyle.totalBeloeb}>{formaterKroner(kvittering.total)}</Text>
        </View>
      </View>

      <Text style={GlobalStyle.fodnote}>
        Kvitteringen er gemt sikkert på din konto. Butikken og varerne deles kun anonymt.
      </Text>
    </ScrollView>
  );
}
