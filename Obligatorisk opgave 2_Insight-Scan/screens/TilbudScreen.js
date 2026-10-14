// TilbudScreen: kundens Tilbud-fane (Figma: 05 Tilbud). Erstatter CashbackScreen fra opgave 1.
// Tilbuddene oprettes af leverandørerne og læses fra Firebase (offers/) via AppContext.
// Øverst vises ét udvalgt tilbud i den kategori, brugeren køber mest i. Filtrene ("chips")
// viser kun tilbud i én kategori eller fra de butikker, brugeren har valgt under Butikker.

import React, { useState } from "react";
import { View, Text, FlatList, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import OfferCard from "../components/OfferCard";
import PrimaryButton from "../components/PrimaryButton";
import { useApp } from "../context/AppContext";
import { KATEGORI_NAVNE, formaterKroner } from "../data/const";
import { GlobalStyle, Colors } from "../styles/GlobalStyle";

// Filtrene fra Figma. "kategori" matcher feltet på tilbuddet, "mineButikker" er et særligt filter.
const FILTRE = [
  { noegle: "alle", navn: "Alle" },
  { noegle: "kød/protein", navn: "Kød" },
  { noegle: "frugt/grønt", navn: "Grønt" },
  { noegle: "mejeri", navn: "Mejeri" },
  { noegle: "mineButikker", navn: "Mine butikker" },
];

// "Rema 1000 · til søndag" - butik og hvor længe tilbuddet gælder
function butikOgGyldighed(etTilbud) {
  return etTilbud.gyldig ? etTilbud.butik + " · " + etTilbud.gyldig : etTilbud.butik;
}

export default function TilbudScreen({ navigation }) {
  const { tilbud, kvitteringer, valgteButikker, tilfoejTilIndkoebsliste } = useApp();
  const [filter, setFilter] = useState("alle");

  // Hvilken kategori køber brugeren oftest? Vi tæller varerne på alle kvitteringer.
  const antalPerKategori = {};
  kvitteringer.forEach((k) => {
    (k.varer || []).forEach((vare) => {
      antalPerKategori[vare.kategori] = (antalPerKategori[vare.kategori] || 0) + 1;
    });
  });
  const favoritKategori = Object.keys(antalPerKategori).sort(
    (a, b) => antalPerKategori[b] - antalPerKategori[a]
  )[0];

  // Anvend det valgte filter
  const filtrerede = tilbud.filter((t) => {
    if (filter === "alle") return true;
    if (filter === "mineButikker") return valgteButikker[t.butik] === true;
    return t.kategori === filter;
  });

  // Det udvalgte tilbud: første tilbud i favoritkategorien, ellers bare det første.
  // Resten vises som almindelige kort under "Flere tilbud".
  const udvalgt = filtrerede.find((t) => t.kategori === favoritKategori) || filtrerede[0];
  const flere = filtrerede.filter((t) => t !== udvalgt);

  // Tilføjer et tilbud til indkøbslisten i Firebase og giver en kort bekræftelse
  async function tilfoej(etTilbud) {
    try {
      await tilfoejTilIndkoebsliste(etTilbud);
      Alert.alert("Tilføjet", etTilbud.vare + " er på din indkøbsliste.");
    } catch (error) {
      Alert.alert("Kunne ikke tilføje", error.message);
    }
  }

  const Toppen = () => (
    <View style={GlobalStyle.sektioner}>
      <View style={GlobalStyle.skaermHeader}>
        <Text style={GlobalStyle.titelStor}>Tilbud til dig</Text>
        <Text style={GlobalStyle.undertitel}>Baseret på det, du plejer at købe</Text>
      </View>

      {/* Filtre i en vandret rulleliste */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={GlobalStyle.chipRække}>
        {FILTRE.map((f) => {
          const aktiv = filter === f.noegle;
          return (
            <Pressable
              key={f.noegle}
              onPress={() => setFilter(f.noegle)}
              accessibilityRole="button"
              accessibilityState={{ selected: aktiv }}
              style={[GlobalStyle.chip, aktiv && GlobalStyle.chipAktiv]}
            >
              <Text style={aktiv ? GlobalStyle.chipTekstAktiv : GlobalStyle.chipTekst}>{f.navn}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {udvalgt ? (
        <>
          {/* Det udvalgte tilbud med stort billede og primær knap */}
          <View style={GlobalStyle.udvalgtKort}>
            <View style={GlobalStyle.udvalgtEyebrow}>
              <Ionicons name="pricetag-outline" size={16} color={Colors.primary} />
              <Text style={GlobalStyle.udvalgtEyebrowTekst}>
                {favoritKategori && udvalgt.kategori === favoritKategori
                  ? "DU KØBER OFTE " + (KATEGORI_NAVNE[favoritKategori] || "").toUpperCase()
                  : "ANBEFALET TIL DIG"}
              </Text>
            </View>
            <View style={GlobalStyle.udvalgtBillede}>
              <Ionicons name="bag-outline" size={40} color={Colors.primary} />
            </View>
            <View>
              <Text style={GlobalStyle.udvalgtVare}>{udvalgt.vare}</Text>
              <Text style={GlobalStyle.udvalgtButik}>{butikOgGyldighed(udvalgt)}</Text>
            </View>
            <View style={GlobalStyle.udvalgtPrisRække}>
              <Text style={GlobalStyle.udvalgtPris}>{formaterKroner(udvalgt.pris)}</Text>
              {udvalgt.foerPris ? <Text style={GlobalStyle.foerPris}>{formaterKroner(udvalgt.foerPris)}</Text> : null}
              <View style={GlobalStyle.cashbackBadgeStor}>
                <Text style={GlobalStyle.cashbackBadgeStorTekst}>+ {formaterKroner(udvalgt.cashback)} cashback</Text>
              </View>
            </View>
            <PrimaryButton label="Tilføj til indkøbsliste" onPress={() => tilfoej(udvalgt)} />
          </View>

          {flere.length > 0 ? (
            <View style={GlobalStyle.sektionHeader}>
              <Text style={GlobalStyle.sektionTitel}>Flere tilbud</Text>
            </View>
          ) : null}
        </>
      ) : (
        // Tom tilstand: ingen tilbud (endnu), eller ingen der passer til filteret
        <View style={GlobalStyle.tomTilstand}>
          <View style={GlobalStyle.tomIkon}>
            <Ionicons name="pricetag-outline" size={28} color={Colors.primary} />
          </View>
          <Text style={GlobalStyle.tomTitel}>
            {tilbud.length === 0 ? "Ingen tilbud lige nu" : "Ingen tilbud her"}
          </Text>
          <Text style={GlobalStyle.tomTekst}>
            {filter === "mineButikker"
              ? "Vælg de butikker, du handler i, så viser vi deres tilbud her."
              : "Når leverandørerne opretter tilbud på varer, du køber, dukker de op her."}
          </Text>
          {filter === "mineButikker" ? (
            <View style={GlobalStyle.tomHandling}>
              <PrimaryButton label="Vælg butikker" onPress={() => navigation.navigate("Butikker")} />
            </View>
          ) : null}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={GlobalStyle.skaerm} edges={["top"]}>
      <FlatList
        data={flere}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={Toppen}
        contentContainerStyle={GlobalStyle.listeIndhold}
        ItemSeparatorComponent={() => <View style={GlobalStyle.listeMellemrum} />}
        renderItem={({ item }) => (
          <OfferCard
            vare={item.vare}
            butik={butikOgGyldighed(item)}
            pris={formaterKroner(item.pris)}
            cashback={"+ " + formaterKroner(item.cashback)}
            onTilfoej={() => tilfoej(item)}
          />
        )}
      />
    </SafeAreaView>
  );
}
