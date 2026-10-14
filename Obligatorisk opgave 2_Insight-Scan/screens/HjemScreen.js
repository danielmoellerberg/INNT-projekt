// HjemScreen: kundens forside (Figma: 03 Hjem). Erstatter OverblikScreen fra opgave 1.
// Viser cashback-saldoen som en bon (appens signatur), nøgletal for måneden, forbrug fordelt
// på kategorier og de seneste kvitteringer. Alle tal beregnes ud fra kvitteringerne i Firebase,
// som hentes via AppContext. Uden kvitteringer vises en tom tilstand med en opfordring til at scanne.

import React, { useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import PrimaryButton from "../components/PrimaryButton";
import ReceiptRow from "../components/ReceiptRow";
import ScanReminderBanner from "../components/ScanReminderBanner";
import { useApp } from "../context/AppContext";
import {
  KATEGORI_NAVNE,
  erDenneMaaned,
  formaterHeltal,
  formaterKroner,
  formaterRelativDato,
  formaterUgedagOgDato,
  maanedsNavn,
} from "../data/const";
import { GlobalStyle, Colors, bredde } from "../styles/GlobalStyle";

// Cashback udbetales, når saldoen når dette beløb
const UDBETALINGSGRAENSE = 250;
// Hvor mange kvitteringer vises, før man trykker "Se alle"
const ANTAL_SENESTE = 3;
// Antal huller i bonens perforerede kant
const PERFORERINGS_HULLER = Array.from({ length: 15 }, (_, i) => i);

export default function HjemScreen({ navigation }) {
  const { profil, user, kvitteringer, saldo } = useApp();
  const [visAlle, setVisAlle] = useState(false);

  const navn = profil && profil.navn ? profil.navn : "";
  // Forbogstav til profilknappen: navnet, ellers e-mailen
  const forbogstav = (navn || (user && user.email) || "?").charAt(0).toUpperCase();

  // --- Beregninger for denne måned (genbrugt idé fra OverblikScreen i opgave 1) ---
  const maanedensKvitteringer = kvitteringer.filter((k) => erDenneMaaned(k.dato));
  const forbrugIMaaneden = maanedensKvitteringer.reduce((sum, k) => sum + k.total, 0);
  const cashbackIMaaneden = maanedensKvitteringer.reduce((sum, k) => sum + (k.cashback || 0), 0);

  // Forbrug per kategori: læg prisen på alle varer sammen for hver kategori,
  // og regn derefter andelen af månedens samlede forbrug ud i procent
  const perKategori = {};
  maanedensKvitteringer.forEach((k) => {
    (k.varer || []).forEach((vare) => {
      perKategori[vare.kategori] = (perKategori[vare.kategori] || 0) + vare.pris;
    });
  });
  const kategorier = Object.keys(perKategori)
    .map((noegle) => ({
      noegle: noegle,
      navn: KATEGORI_NAVNE[noegle] || noegle,
      procent: forbrugIMaaneden > 0 ? Math.round((perKategori[noegle] / forbrugIMaaneden) * 100) : 0,
    }))
    .sort((a, b) => b.procent - a.procent);

  // Udbetaling: hvor langt er brugeren mod næste udbetaling? (% sørger for, at det starter
  // forfra, når grænsen er nået)
  const optjentMod = saldo % UDBETALINGSGRAENSE;
  const tilNaesteUdbetaling = UDBETALINGSGRAENSE - optjentMod;
  const udbetalingProcent = Math.round((optjentMod / UDBETALINGSGRAENSE) * 100);

  const visteKvitteringer = visAlle ? kvitteringer : kvitteringer.slice(0, ANTAL_SENESTE);

  // Toppen af skærmen. Den sættes ind som ListHeaderComponent, så hele skærmen
  // scroller sammen med listen (mønster fra opgave 1).
  const Toppen = () => (
    <View style={GlobalStyle.sektioner}>
      <View style={GlobalStyle.hjemHeader}>
        <View>
          <Text style={GlobalStyle.hilsenDato}>{formaterUgedagOgDato(new Date())}</Text>
          <Text style={GlobalStyle.titelStor}>{navn ? "Hej " + navn : "Hej"}</Text>
        </View>
        {/* Profilknappen åbner Indstillinger i samme stack */}
        <Pressable
          onPress={() => navigation.navigate("Indstillinger")}
          accessibilityRole="button"
          accessibilityLabel="Indstillinger og profil"
          style={({ pressed }) => [GlobalStyle.profilKnap, pressed && GlobalStyle.trykket]}
        >
          <Text style={GlobalStyle.profilKnapTekst}>{forbogstav}</Text>
        </Pressable>
      </View>

      <ScanReminderBanner onScan={() => navigation.navigate("Scan")} />

      {/* Signaturen: cashback-kortet som en bon med perforeret kant */}
      <View style={GlobalStyle.cashbackKort}>
        <Text style={GlobalStyle.cashbackEtiket}>CASHBACK OPTJENT</Text>
        <Text style={GlobalStyle.cashbackBeloeb}>{formaterKroner(saldo)}</Text>
        <Text style={GlobalStyle.cashbackUndertekst}>+ {formaterKroner(cashbackIMaaneden)} denne måned</Text>
        <View style={GlobalStyle.udbetaling}>
          <View style={GlobalStyle.udbetalingSpor}>
            <View style={[GlobalStyle.udbetalingFremdrift, bredde(udbetalingProcent + "%")]} />
          </View>
          <Text style={GlobalStyle.udbetalingTekst}>
            {formaterKroner(tilNaesteUdbetaling)} til næste udbetaling ved {UDBETALINGSGRAENSE} kr.
          </Text>
        </View>
        <View style={GlobalStyle.perforering}>
          {PERFORERINGS_HULLER.map((i) => (
            <View key={i} style={GlobalStyle.perforeringHul} />
          ))}
        </View>
      </View>

      {kvitteringer.length > 0 ? (
        <>
          {/* Nøgletal for måneden */}
          <View style={GlobalStyle.kpiRække}>
            <View style={GlobalStyle.kpiKort}>
              <Text style={GlobalStyle.kpiTal}>{maanedensKvitteringer.length}</Text>
              <Text style={GlobalStyle.kpiLabel}>kvitteringer</Text>
            </View>
            <View style={GlobalStyle.kpiKort}>
              <Text style={GlobalStyle.kpiTal}>{formaterHeltal(forbrugIMaaneden)}</Text>
              <Text style={GlobalStyle.kpiLabel}>kr. brugt</Text>
            </View>
            <View style={GlobalStyle.kpiKort}>
              <Text style={GlobalStyle.kpiTal}>{formaterHeltal(saldo)}</Text>
              <Text style={GlobalStyle.kpiLabel}>kr. sparet</Text>
            </View>
          </View>

          {/* Forbrug fordelt på kategorier - vises kun, hvis der er købt noget i måneden */}
          {kategorier.length > 0 ? (
            <View style={GlobalStyle.forbrugKort}>
              <View style={GlobalStyle.forbrugHeader}>
                <Text style={GlobalStyle.sektionTitel}>Forbrug i {maanedsNavn(new Date())}</Text>
                <Text style={GlobalStyle.forbrugTotal}>{formaterHeltal(forbrugIMaaneden)} kr.</Text>
              </View>
              {kategorier.map((kat) => (
                <View key={kat.noegle} style={GlobalStyle.kategoriRække}>
                  <Text style={GlobalStyle.kategoriNavn}>{kat.navn}</Text>
                  <View style={GlobalStyle.kategoriSpor}>
                    <View style={[GlobalStyle.kategoriFremdrift, bredde(kat.procent + "%")]} />
                  </View>
                  <Text style={GlobalStyle.kategoriProcent}>{kat.procent} %</Text>
                </View>
              ))}
            </View>
          ) : null}

          <View style={GlobalStyle.sektionHeader}>
            <Text style={GlobalStyle.sektionTitel}>Seneste kvitteringer</Text>
            {/* "Se alle" vises kun, når der er flere kvitteringer, end der er plads til */}
            {kvitteringer.length > ANTAL_SENESTE ? (
              <Pressable onPress={() => setVisAlle(!visAlle)} accessibilityRole="button">
                <Text style={GlobalStyle.linkTekst}>{visAlle ? "Vis færre" : "Se alle"}</Text>
              </Pressable>
            ) : null}
          </View>
        </>
      ) : (
        // Tom tilstand: brugeren har endnu ikke scannet noget
        <View style={GlobalStyle.tomTilstand}>
          <View style={GlobalStyle.tomIkon}>
            <Ionicons name="receipt-outline" size={28} color={Colors.primary} />
          </View>
          <Text style={GlobalStyle.tomTitel}>Scan din første kvittering</Text>
          <Text style={GlobalStyle.tomTekst}>
            Så kan du se, hvad du bruger penge på, og hvor meget cashback du har tjent.
          </Text>
          <View style={GlobalStyle.tomHandling}>
            <PrimaryButton label="Scan kvittering" onPress={() => navigation.navigate("Scan")} />
          </View>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={GlobalStyle.skaerm} edges={["top"]}>
      <FlatList
        data={visteKvitteringer}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={Toppen}
        contentContainerStyle={GlobalStyle.listeIndhold}
        ItemSeparatorComponent={() => <View style={GlobalStyle.listeMellemrum} />}
        renderItem={({ item }) => (
          <ReceiptRow
            butik={item.butik}
            info={formaterRelativDato(item.dato) + " · " + (item.varer || []).length + " varer"}
            beloeb={formaterKroner(item.total)}
            cashback={item.cashback > 0 ? "+ " + formaterKroner(item.cashback) : null}
            onPress={() => navigation.navigate("Kvittering", { kvittering: item })}
          />
        )}
      />
    </SafeAreaView>
  );
}
