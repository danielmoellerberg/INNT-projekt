import React from "react";
import { View, Text, FlatList, Pressable } from "react-native";

import ButtonComponent from "../components/ButtonComponent";
import ScanReminderBanner from "../components/ScanReminderBanner";
import { useApp } from "../context/AppContext";
import { GlobalStyle } from "../styles/GlobalStyle";

export default function OverblikScreen({ navigation }) {
  // Vi henter de fælles data fra contexten, så tallene opdaterer sig
  // med det samme når man scanner en ny kvittering.
  const { kvitteringer, saldo } = useApp();

  // --- Samlet forbrug denne uge ---
  const samletForbrug = kvitteringer.reduce((sum, k) => sum + k.total, 0);

  // --- Forbrug per kæde ---
  // new Set fjerner dubletter, så vi får hver kæde én gang
  const kæder = [...new Set(kvitteringer.map((k) => k.butik))];
  const forbrugPerKæde = kæder.map((butik) => {
    const kvitteringerFraKæden = kvitteringer.filter((k) => k.butik === butik);
    const total = kvitteringerFraKæden.reduce((sum, k) => sum + k.total, 0);
    return {
      butik: butik,
      total: total,
      antal: kvitteringerFraKæden.length,
      // gennemsnitligt beløb per indkøb i den kæde
      snit: Math.round(total / kvitteringerFraKæden.length),
    };
  });

  // --- Indsigt 1: hvilken kæde er billigst per indkøb? ---
  const billigsteKæde = forbrugPerKæde.reduce((lavest, kæde) =>
    kæde.snit < lavest.snit ? kæde : lavest
  );

  // --- Indsigt 2: snacks vs. protein ---
  // flatMap samler alle varelinjer fra alle kvitteringer i én lang liste
  const alleVarer = kvitteringer.flatMap((k) => k.varer);
  const snacksForbrug = alleVarer
    .filter((v) => v.kategori === "snacks")
    .reduce((sum, v) => sum + v.pris, 0);
  const proteinForbrug = alleVarer
    .filter((v) => v.kategori === "kød/protein")
    .reduce((sum, v) => sum + v.pris, 0);
  const snacksAndel = Math.round((snacksForbrug / samletForbrug) * 100);
  const proteinAndel = Math.round((proteinForbrug / samletForbrug) * 100);

  // Toppen af skærmen (nøgletal + indsigt).
  // Den sættes ind som ListHeaderComponent, så hele skærmen scroller sammen med listen.
  const Toppen = () => (
    <View>
      {/* Påmindelse om at scanne - vises kun hvis det er længe siden sidst */}
      <ScanReminderBanner navigation={navigation} />

      {/* Nøgletal: samlet forbrug */}
      <View style={GlobalStyle.forbrugKort}>
        <Text style={GlobalStyle.forbrugEtiket}>Forbrug denne uge</Text>
        <Text style={GlobalStyle.forbrugTal}>{samletForbrug} kr</Text>
      </View>

      {/* Nøgletal: optjent cashback */}
      <View style={GlobalStyle.cashbackKort}>
        <View style={GlobalStyle.række}>
          <Text style={GlobalStyle.etiket}>Optjent cashback</Text>
          <Text style={GlobalStyle.cashbackTal}>{saldo} kr</Text>
        </View>
      </View>

      {/* Forbrug per kæde */}
      <View style={GlobalStyle.kort}>
        <Text style={GlobalStyle.sektionsTitel}>Forbrug per kæde</Text>
        {forbrugPerKæde.map((kæde) => (
          <View key={kæde.butik} style={GlobalStyle.rækkeMedLinje}>
            <Text style={GlobalStyle.værdi}>{kæde.butik}</Text>
            <Text style={GlobalStyle.etiket}>
              {kæde.total} kr ({kæde.antal} indkøb)
            </Text>
          </View>
        ))}
      </View>

      {/* Den simple "indsigt" */}
      <View style={GlobalStyle.indsigtKort}>
        <Text style={GlobalStyle.indsigtTitel}>Din indsigt</Text>
        <Text style={GlobalStyle.indsigtTekst}>
          Du bruger {snacksAndel}% på snacks og {proteinAndel}% på kød/protein.
        </Text>
        <Text style={GlobalStyle.indsigtTekst}>
          {billigsteKæde.butik} er din billigste kæde med {billigsteKæde.snit} kr
          i gennemsnit per indkøb.
        </Text>
      </View>

      {/* To knapper - begge navigerer videre til en anden fane */}
      <View style={GlobalStyle.knapRække}>
        <ButtonComponent
          title="Scan kvittering"
          halv={true}
          onPress={() => navigation.navigate("Scan")}
        />
        <ButtonComponent
          title="Se cashback"
          type="secondary"
          halv={true}
          onPress={() => navigation.navigate("Cashback")}
        />
      </View>

      <Text style={GlobalStyle.sektionsTitel}>Dine kvitteringer</Text>
    </View>
  );

  return (
    <View style={GlobalStyle.container}>
      {/* Listen over kvitteringer - tryk på en for at se detaljerne */}
      <FlatList
        data={kvitteringer}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={Toppen}
        contentContainerStyle={GlobalStyle.listeIndhold}
        renderItem={({ item }) => (
          <Pressable
            style={GlobalStyle.kvitteringKort}
            onPress={() => navigation.navigate("Kvittering", { kvittering: item })}
          >
            <View style={GlobalStyle.kvitteringVenstre}>
              <Text style={GlobalStyle.kvitteringButik}>{item.butik}</Text>
              <Text style={GlobalStyle.kvitteringDato}>
                {item.dato} · {item.varer.length} varer
              </Text>
            </View>
            <Text style={GlobalStyle.kvitteringTotal}>{item.total} kr</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
