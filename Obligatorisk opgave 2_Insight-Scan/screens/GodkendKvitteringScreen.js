// GodkendKvitteringScreen: viser det, AI'en har aflæst, så brugeren kan tjekke det, før noget gemmes.
// Brugeren kan rette en pris og slette en vare, der er aflæst forkert. Først når brugeren
// trykker "Gem kvittering", gemmes kvitteringen i Firebase (users/{uid}/kvitteringer).
// Skærmen viser tydeligt, at varerne er aflæst af AI, fordi AI'en kan tage fejl.
//
// Regler mod snyd på denne skærm:
// - Antal og varenavn kan ikke rettes, og cashback beregnes kun ud fra AI'ens aflæsning.
// - Varer med cashback er låst, så deres pris ikke kan rettes.
// - Retter brugeren en pris, gemmes AI'ens oprindelige pris ved siden af (aiPris).

import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import PrimaryButton from "../components/PrimaryButton";
import StoreLogo from "../components/StoreLogo";
import { gemKvitteringBillede } from "../components/KvitteringBilleder";
import { useApp } from "../context/AppContext";
import { KATEGORI_NAVNE, formaterKroner, formaterTidspunkt } from "../data/const";
import { GlobalStyle, Colors } from "../styles/GlobalStyle";

// Laver brugerens tekst om til et tal: "23,95" -> 23.95. Ugyldig tekst giver NaN.
function tekstTilPris(tekst) {
  return parseFloat(String(tekst).replace(",", "."));
}

export default function GodkendKvitteringScreen({ route, navigation }) {
  // Resultatet fra AI'en og billedet af bonen sendes med fra ScanScreen (mønster fra 05 og 07)
  const { resultat, billedeUri } = route.params;
  const { gemKvittering, cashbackForVare } = useApp();

  // Varerne i state, så de kan rettes. Prisen gemmes som tekst ("23,95"), mens brugeren skriver.
  const [varer, setVarer] = useState(
    resultat.varer.map((vare) => ({ ...vare, prisTekst: vare.pris.toFixed(2).replace(".", ",") }))
  );
  const [gemmer, setGemmer] = useState(false);

  // Summen af de varer, der er tilbage, med de priser brugeren har rettet
  const summen = varer.reduce((sum, vare) => {
    const pris = tekstTilPris(vare.prisTekst);
    return isNaN(pris) ? sum : sum + pris;
  }, 0);

  // Retter prisen på én vare (index er varens plads i listen)
  function retPris(index, tekst) {
    setVarer(varer.map((vare, i) => (i === index ? { ...vare, prisTekst: tekst } : vare)));
  }

  // Sletter én vare fra listen
  function sletVare(index) {
    setVarer(varer.filter((vare, i) => i !== index));
  }

  // Tjekker priserne og gemmer kvitteringen i Firebase via AppContext.
  // Bagefter går vi tilbage til kameraet og åbner den gemte kvittering på Hjem,
  // så Scan-fanen er klar til næste scanning.
  async function gem() {
    if (varer.length === 0) {
      Alert.alert("Ingen varer", "Der skal være mindst én vare på kvitteringen.");
      return;
    }
    const ugyldig = varer.find((vare) => {
      const pris = tekstTilPris(vare.prisTekst);
      return isNaN(pris) || pris < 0;
    });
    if (ugyldig) {
      Alert.alert("Tjek prisen", "Prisen på " + ugyldig.navn + " er ikke et gyldigt beløb.");
      return;
    }

    setGemmer(true);
    try {
      const kvittering = await gemKvittering({
        butik: resultat.butik,
        dato: resultat.dato,
        // Bonens egen total bruges til at genkende bonen, hvis den scannes igen
        bonTotal: resultat.total,
        varer: varer.map((vare) => {
          const pris = Math.round(tekstTilPris(vare.prisTekst) * 100) / 100;
          const gemt = { navn: vare.navn, antal: vare.antal, pris: pris, kategori: vare.kategori };
          // Har brugeren rettet prisen, gemmes AI'ens pris også, så rettelsen kan ses bagefter
          if (pris !== vare.pris) {
            gemt.aiPris = vare.pris;
          }
          return gemt;
        }),
      });
      // Billedet af bonen gemmes på telefonen under kvitteringens id, så det kan vises på
      // KvitteringScreen. Fejler det, er kvitteringen stadig gemt - den får bare intet billede.
      if (billedeUri) {
        try {
          await gemKvitteringBillede(kvittering.id, billedeUri);
        } catch (error) {
          console.error("Kunne ikke gemme billedet af kvitteringen", error);
        }
      }
      // Tilbage til kameraet i Scan-fanen, og åbn derefter kvitteringen i Hjem-fanens stack.
      // initial: false lægger Hjem nedenunder, så tilbage-knappen fører til Hjem.
      navigation.goBack();
      navigation.navigate("Hjem", { screen: "Kvittering", params: { kvittering }, initial: false });
    } catch (error) {
      // Fx hvis reglerne afviser bonen, fordi den allerede er scannet (se gemKvittering)
      setGemmer(false);
      Alert.alert("Kunne ikke gemme", error.message || "Tjek din internetforbindelse, og prøv igen.");
    }
  }

  return (
    <ScrollView style={GlobalStyle.skaerm} contentContainerStyle={GlobalStyle.skaermIndhold} keyboardShouldPersistTaps="handled">
      <View style={GlobalStyle.skaermHeader}>
        <Text style={GlobalStyle.titelStor}>Tjek kvitteringen</Text>
        <Text style={GlobalStyle.undertitel}>Ret det, der er forkert, og gem kvitteringen.</Text>
      </View>

      {/* Tydelig besked om, at indholdet er aflæst af AI */}
      <View style={GlobalStyle.aiMaerke}>
        <Ionicons name="sparkles-outline" size={20} color={Colors.primary} />
        <Text style={GlobalStyle.aiMaerkeTekst}>
          Varerne er aflæst af AI. Tjek at priserne passer med bonen, før du gemmer. Varer med
          cashback er låst, og en kvittering kan kun gemmes én gang.
        </Text>
      </View>

      <View style={GlobalStyle.kvitteringHeader}>
        <StoreLogo butik={resultat.butik} stor />
        <View>
          <Text style={GlobalStyle.kvitteringTitel}>{resultat.butik}</Text>
          <Text style={GlobalStyle.kvitteringUndertitel}>{formaterTidspunkt(resultat.dato)}</Text>
        </View>
      </View>

      <View style={GlobalStyle.vareKort}>
        <Text style={GlobalStyle.vareKortTitel}>{varer.length} varer</Text>

        {varer.map((vare, index) => {
          // Viser cashback allerede nu, hvis varen har et tilbud
          const cashback = cashbackForVare(vare);
          return (
            <View key={index} style={GlobalStyle.godkendVareRække}>
              <View style={GlobalStyle.vareNavnKolonne}>
                <Text style={GlobalStyle.vareNavn}>{vare.navn}</Text>
                <View style={GlobalStyle.vareMeta}>
                  <Text style={GlobalStyle.vareAntal}>
                    {vare.antal > 1 ? vare.antal + " stk. · " : ""}
                    {KATEGORI_NAVNE[vare.kategori]}
                  </Text>
                  {cashback > 0 ? (
                    <Text style={GlobalStyle.vareCashback}>+ {formaterKroner(cashback)} cashback</Text>
                  ) : null}
                </View>
              </View>
              {/* Varer med cashback er låst. Andre priser kan rettes direkte i feltet. */}
              {cashback > 0 ? (
                <View style={GlobalStyle.prisLaast} accessibilityLabel={"Pris for " + vare.navn + ", låst"}>
                  <Ionicons name="lock-closed-outline" size={14} color={Colors.textTertiary} />
                  <Text style={GlobalStyle.varePris}>{formaterKroner(vare.pris)}</Text>
                </View>
              ) : (
                <TextInput
                  style={[GlobalStyle.prisInput, isNaN(tekstTilPris(vare.prisTekst)) && GlobalStyle.prisInputFejl]}
                  value={vare.prisTekst}
                  onChangeText={(tekst) => retPris(index, tekst)}
                  keyboardType="decimal-pad"
                  accessibilityLabel={"Pris for " + vare.navn}
                />
              )}
              <Pressable
                onPress={() => sletVare(index)}
                accessibilityRole="button"
                accessibilityLabel={"Slet " + vare.navn}
                style={({ pressed }) => [GlobalStyle.sletKnap, pressed && GlobalStyle.trykket]}
              >
                <Ionicons name="trash-outline" size={20} color={Colors.danger} />
              </Pressable>
            </View>
          );
        })}

        <View style={GlobalStyle.skillelinje} />
        <View style={GlobalStyle.vareRække}>
          <Text style={GlobalStyle.totalTekst}>I alt</Text>
          <Text style={GlobalStyle.totalBeloeb}>{formaterKroner(summen)}</Text>
        </View>
      </View>

      {/* Bonens total kan afvige fra varerne, fx på grund af pant eller rabat */}
      {Math.abs(resultat.total - summen) >= 0.01 ? (
        <Text style={GlobalStyle.fodnote}>
          Bonens total er {formaterKroner(resultat.total)}. Forskellen skyldes typisk pant eller rabat,
          som ikke er varer.
        </Text>
      ) : null}

      <PrimaryButton label="Gem kvittering" onPress={gem} disabled={gemmer} />
    </ScrollView>
  );
}
