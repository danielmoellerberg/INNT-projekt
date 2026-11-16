// AlleKvitteringerScreen: alle brugerens gemte kvitteringer i Hjem-stacken.
// Åbnes fra "Se alle" på Hjem. Kvitteringerne kommer fra AppContext (som allerede lytter på
// Firebase med onValue), så skærmen laver ingen ny forespørgsel.
//
// Listen er nyeste først og grupperet efter måned. Øverst kan man filtrere på kæde.
// Kvitteringer kan ikke slettes her: en slettet bon kan aldrig scannes igen, fordi dens aftryk
// bliver liggende i databasen (se reglerne mod snyd i AppContext).

import React, { useState } from "react";
import { View, Text, FlatList, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import PrimaryButton from "../components/PrimaryButton";
import ReceiptRow from "../components/ReceiptRow";
import { useApp } from "../context/AppContext";
import { formaterKroner, formaterHeltal, formaterRelativDato, maanedsNavn } from "../data/const";
import { GlobalStyle, Colors } from "../styles/GlobalStyle";

// "Oktober 2026" - månedens navn med stort begyndelsesbogstav og året
function maanedOgAar(ms) {
  const dato = new Date(ms);
  const navn = maanedsNavn(dato);
  return navn.charAt(0).toUpperCase() + navn.slice(1) + " " + dato.getFullYear();
}

// Laver kvitteringerne om til én lang liste til FlatList, hvor hver måned starter med en
// overskriftsrække. Hver række har en "type", så renderItem ved, hvad den skal tegne.
// Kvitteringerne er allerede sorteret nyeste først i AppContext, så månederne kommer i rækkefølge.
function lavRaekker(kvitteringer) {
  const raekker = [];
  let overskrift = null;
  kvitteringer.forEach((k) => {
    const maaned = maanedOgAar(k.dato);
    // Ny måned: start en ny overskrift med total og cashback på 0
    if (!overskrift || overskrift.titel !== maaned) {
      overskrift = { type: "maaned", id: "maaned-" + maaned, titel: maaned, total: 0, cashback: 0 };
      raekker.push(overskrift);
    }
    // Læg kvitteringen til månedens tal og til listen
    overskrift.total += k.total || 0;
    overskrift.cashback += k.cashback || 0;
    raekker.push({ type: "kvittering", id: k.id, kvittering: k });
  });
  return raekker;
}

export default function AlleKvitteringerScreen({ navigation }) {
  const { kvitteringer } = useApp();
  // "alle" eller navnet på en kæde, fx "Netto"
  const [filter, setFilter] = useState("alle");

  // Én chip per kæde, brugeren har kvitteringer fra (Set fjerner dubletter), sorteret alfabetisk
  const kaeder = [...new Set(kvitteringer.map((k) => k.butik))].sort((a, b) => a.localeCompare(b, "da"));
  const filtrerede = filter === "alle" ? kvitteringer : kvitteringer.filter((k) => k.butik === filter);
  const raekker = lavRaekker(filtrerede);

  // Tom tilstand: ingen kvitteringer overhovedet, eller ingen fra den valgte kæde
  const tomTilstand =
    kvitteringer.length === 0 ? (
      <View style={GlobalStyle.tomTilstand}>
        <View style={GlobalStyle.tomIkon}>
          <Ionicons name="receipt-outline" size={28} color={Colors.primary} />
        </View>
        <Text style={GlobalStyle.tomTitel}>Scan din første kvittering</Text>
        <Text style={GlobalStyle.tomTekst}>Dine kvitteringer samles her, når du har scannet dem.</Text>
        <View style={GlobalStyle.tomHandling}>
          {/* Scan er en fane, så navigate skifter fane (navigation på tværs af faner) */}
          <PrimaryButton label="Scan kvittering" onPress={() => navigation.navigate("Scan")} />
        </View>
      </View>
    ) : (
      <View style={GlobalStyle.tomTilstand}>
        <Text style={GlobalStyle.tomTitel}>Ingen kvitteringer fra {filter}</Text>
      </View>
    );

  // Toppen: titel og filterchips (samme chip-stil som på Tilbud).
  // Gives som et element, ikke en funktion, så chip-rækken ikke bygges forfra ved hvert tryk.
  const toppen = (
    <View style={GlobalStyle.sektioner}>
      <Text style={GlobalStyle.titelStor}>Kvitteringer</Text>
      {kvitteringer.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={GlobalStyle.chipRække}>
          {["alle", ...kaeder].map((noegle) => {
            const aktiv = filter === noegle;
            return (
              <Pressable
                key={noegle}
                onPress={() => setFilter(noegle)}
                accessibilityRole="button"
                accessibilityState={{ selected: aktiv }}
                style={[GlobalStyle.chip, aktiv && GlobalStyle.chipAktiv]}
              >
                <Text style={aktiv ? GlobalStyle.chipTekstAktiv : GlobalStyle.chipTekst}>
                  {noegle === "alle" ? "Alle" : noegle}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : null}
    </View>
  );

  return (
    <FlatList
      style={GlobalStyle.skaerm}
      data={raekker}
      keyExtractor={(raekke) => raekke.id}
      ListHeaderComponent={toppen}
      ListHeaderComponentStyle={GlobalStyle.listeHeader}
      ListEmptyComponent={tomTilstand}
      // listeIndhold har samme bundafstand som de andre skærme (plads til den flydende tab bar)
      contentContainerStyle={GlobalStyle.listeIndhold}
      ItemSeparatorComponent={() => <View style={GlobalStyle.listeMellemrum} />}
      renderItem={({ item }) => {
        // Overskrift for en måned: navn til venstre, total og cashback til højre
        if (item.type === "maaned") {
          return (
            <View style={GlobalStyle.maanedRække}>
              <Text style={GlobalStyle.sektionTitel}>{item.titel}</Text>
              <Text style={GlobalStyle.maanedTal}>
                {formaterHeltal(item.total)} kr.
                {item.cashback > 0 ? (
                  <Text style={GlobalStyle.maanedCashback}> · + {formaterKroner(item.cashback)}</Text>
                ) : null}
              </Text>
            </View>
          );
        }
        // En kvittering: samme række som på Hjem. Tryk åbner den med route.params (mønster fra 05)
        const k = item.kvittering;
        return (
          <ReceiptRow
            butik={k.butik}
            info={formaterRelativDato(k.dato) + " · " + (k.varer || []).length + " varer"}
            beloeb={formaterKroner(k.total)}
            cashback={k.cashback > 0 ? "+ " + formaterKroner(k.cashback) : null}
            // "fra" giver Kvittering-skærmens tilbage-knap teksten "Kvitteringer" (se StackComponent)
            onPress={() => navigation.navigate("Kvittering", { kvittering: k, fra: "Kvitteringer" })}
          />
        );
      }}
    />
  );
}
