// KvitteringScreen: detaljer om én kvittering i Hjem-stacken (Figma: 04 Kvittering).
// Genbrugt fra opgave 1: kvitteringen sendes med som parameter.
// Efter pivoten viser banneret cashback som procent af bonen plus eventuel bonus, og kun varer
// med ekstra cashback fra et sponsoreret tilbud får et mærke.
// Nyt i opgave 2: opsætningen følger Figma, og kvitteringen kommer fra Firebase.
// Er billedet af bonen gemt på telefonen, vises et lille billede i højre side af toppen.
// Trykker man på det, åbnes den rigtige kvittering i fuld størrelse (KvitteringBilledeScreen).

import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";

import StoreLogo from "../components/StoreLogo";
import CashbackBanner from "../components/CashbackBanner";
import { hentKvitteringBillede } from "../components/KvitteringBilleder";
import { formaterKroner, formaterTidspunkt } from "../data/const";
import { GlobalStyle } from "../styles/GlobalStyle";

export default function KvitteringScreen({ route, navigation }) {
  // Kvitteringen sendes med fra Hjem eller Scan med navigation.navigate (mønster fra 05 og 07)
  const { kvittering } = route.params;
  const varer = kvittering.varer || [];
  // Stien til billedet af bonen, eller null hvis der ikke er gemt et billede på denne telefon
  const [billede, setBillede] = useState(null);

  // Leder efter billedet, når skærmen åbnes. Det ligger i appens mappe under kvitteringens id
  // (se components/KvitteringBilleder.js). Ældre kvitteringer har intet billede.
  useEffect(() => {
    hentKvitteringBillede(kvittering.id)
      .then(setBillede)
      .catch(() => setBillede(null));
  }, [kvittering.id]);

  // Ekstra cashback på en vare. Nye kvitteringer gemmer den som "bonus". Kvitteringer fra før
  // pivoten havde cashback per vare i feltet "cashback", så den vises stadig, som den var.
  function ekstraPaaVare(vare) {
    return vare.bonus ?? vare.cashback ?? 0;
  }

  return (
    <ScrollView style={GlobalStyle.skaerm} contentContainerStyle={GlobalStyle.skaermIndhold}>
      <View style={GlobalStyle.kvitteringHeader}>
        <StoreLogo butik={kvittering.butik} stor />
        <View style={GlobalStyle.kvitteringHeaderTekst}>
          <Text style={GlobalStyle.kvitteringTitel}>{kvittering.butik}</Text>
          <Text style={GlobalStyle.kvitteringUndertitel}>{formaterTidspunkt(kvittering.dato)}</Text>
        </View>
        {/* Lille billede af bonen. Trykket sender stien med til fuldskærmsvisningen. */}
        {billede ? (
          <Pressable
            onPress={() => navigation.navigate("KvitteringBillede", { uri: billede })}
            accessibilityRole="button"
            accessibilityLabel="Vis billedet af kvitteringen"
            style={({ pressed }) => [GlobalStyle.bonMiniature, pressed && GlobalStyle.trykket]}
          >
            <Image source={{ uri: billede }} style={GlobalStyle.bonMiniatureBillede} />
          </Pressable>
        ) : null}
      </View>

      {/* Banneret vises kun, hvis kvitteringen gav cashback. Nye kvitteringer giver altid basis. */}
      {kvittering.cashback > 0 ? (
        <CashbackBanner
          basis={kvittering.cashbackBasis}
          bonus={kvittering.cashbackBonus}
          cashback={kvittering.cashback}
        />
      ) : null}

      <View style={GlobalStyle.vareKort}>
        <Text style={GlobalStyle.vareKortTitel}>{varer.length} varer</Text>

        {varer.map((vare, index) => (
          <View key={index} style={GlobalStyle.vareRække}>
            <View style={GlobalStyle.vareNavnKolonne}>
              <Text style={GlobalStyle.vareNavn}>{vare.navn}</Text>
              {/* Ekstra linje med antal og/eller cashback - kun hvis der er noget at vise */}
              {vare.antal > 1 || ekstraPaaVare(vare) > 0 ? (
                <View style={GlobalStyle.vareMeta}>
                  {vare.antal > 1 ? <Text style={GlobalStyle.vareAntal}>{vare.antal} stk.</Text> : null}
                  {ekstraPaaVare(vare) > 0 ? (
                    <Text style={GlobalStyle.vareCashback}>
                      + {formaterKroner(ekstraPaaVare(vare))} {vare.bonus !== undefined ? "ekstra" : "cashback"}
                    </Text>
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
