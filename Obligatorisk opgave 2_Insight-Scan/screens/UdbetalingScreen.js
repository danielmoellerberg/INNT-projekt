// UdbetalingScreen: udbetal den optjente cashback (Figma: 12 Udbetaling). Ligger i Hjem-stacken
// og åbnes fra knappen "Udbetal" i cashback-kortet, når saldoen har nået UDBETALING_MIN.
//
// Udbetalingen er SIMULERET: der sendes ingen penge. Ved bekræft gemmes en anmodning i
// users/{uid}/udbetalinger (se anmodUdbetaling i AppContext), så saldoen på Hjem falder til 0.
//
// Udbetalingsmetoden (bankkonto eller debetkort) gemmes på telefonen med AsyncStorage (mønster
// fra 08) - men kun som en maskeret tekst, fx "Konto ••••5678". Det fulde nummer gemmes aldrig.

import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, Pressable, Alert, KeyboardAvoidingView, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import BonKant from "../components/BonKant";
import { useApp, UDBETALING_MIN } from "../context/AppContext";
import { formaterKroner } from "../data/const";
import { GlobalStyle, Colors } from "../styles/GlobalStyle";

// Fast nøgle til AsyncStorage (mønster fra 08)
const METODER_NOEGLE = "UDBETALINGSMETODER";
// Tom standardværdi: ingen metoder gemt endnu
const INGEN_METODER = { bank: null, kort: null, valgt: null };

// De to udbetalingsmetoder. "tid" er, hvor hurtigt pengene lander (vises i rækken og bagefter).
const METODER = {
  bank: {
    navn: "Bankkonto",
    ikon: "business-outline",
    forstavelse: "Konto",
    tid: "1-2 hverdage",
    felt: "Reg.nr. og kontonummer",
    minCifre: 8,
  },
  kort: {
    navn: "Debetkort",
    ikon: "card-outline",
    forstavelse: "Kort",
    tid: "30 minutter",
    felt: "Kortnummer",
    minCifre: 13,
  },
};

// Laver et nummer om til en maskeret tekst med de sidste 4 cifre: "1234 5678" -> "Konto ••••5678".
// Kun den maskerede tekst gemmes, så telefonen aldrig har det fulde konto- eller kortnummer liggende.
function maskeret(type, nummer) {
  const cifre = nummer.replace(/[^0-9]/g, "");
  return METODER[type].forstavelse + " ••••" + cifre.slice(-4);
}

export default function UdbetalingScreen({ navigation }) {
  const { saldo, anmodUdbetaling } = useApp();
  const [metoder, setMetoder] = useState(INGEN_METODER);
  // Hvilken metode der er ved at blive tilføjet ("bank" eller "kort"), eller null
  const [formType, setFormType] = useState(null);
  const [nummer, setNummer] = useState("");
  const [sender, setSender] = useState(false);

  // Hent de gemte metoder én gang (mønster fra 08: JSON.parse og en tom standardværdi)
  useEffect(() => {
    async function hentMetoder() {
      try {
        const json = await AsyncStorage.getItem(METODER_NOEGLE);
        setMetoder(json ? { ...INGEN_METODER, ...JSON.parse(json) } : INGEN_METODER);
      } catch (error) {
        console.error("Kunne ikke hente udbetalingsmetoder", error);
      }
    }
    hentMetoder();
  }, []);

  // Gemmer metoderne i state og på telefonen
  async function gemMetoder(nye) {
    setMetoder(nye);
    try {
      await AsyncStorage.setItem(METODER_NOEGLE, JSON.stringify(nye));
    } catch (error) {
      console.error("Kunne ikke gemme udbetalingsmetoder", error);
    }
  }

  // Tryk på en metode: er den gemt, vælges den. Ellers åbnes feltet, så den kan tilføjes.
  function vaelgMetode(type) {
    if (metoder[type]) {
      gemMetoder({ ...metoder, valgt: type });
    } else {
      setFormType(type);
    }
  }

  // Gemmer en ny metode som maskeret tekst og vælger den
  function tilfoejMetode() {
    const cifre = nummer.replace(/[^0-9]/g, "");
    if (cifre.length < METODER[formType].minCifre) {
      Alert.alert("Tjek nummeret", METODER[formType].felt + " skal have mindst " + METODER[formType].minCifre + " cifre.");
      return;
    }
    gemMetoder({ ...metoder, [formType]: maskeret(formType, cifre), valgt: formType });
    setNummer("");
    setFormType(null);
  }

  const valgtMetode = metoder.valgt && metoder[metoder.valgt] ? metoder.valgt : null;
  const kanUdbetale = saldo >= UDBETALING_MIN && valgtMetode !== null && !sender;

  // Gemmer anmodningen i Firebase og viser kvitteringsskærmen.
  // Saldoen på Hjem falder automatisk, fordi AppContext lytter på udbetalinger med onValue.
  async function udbetal() {
    setSender(true);
    try {
      await anmodUdbetaling(saldo, metoder[valgtMetode]);
      navigation.navigate("UdbetalingSendt", {
        beloeb: saldo,
        metode: metoder[valgtMetode],
        tid: METODER[valgtMetode].tid,
      });
    } catch (error) {
      setSender(false);
      Alert.alert("Udbetalingen lykkedes ikke", "Tjek din internetforbindelse, og prøv igen.");
    }
  }

  // Bekræftelse, før noget sendes (Alert med Annuller, som ved Log ud)
  function bekraeft() {
    Alert.alert(
      "Bekræft udbetaling",
      formaterKroner(saldo) + " udbetales til " + metoder[valgtMetode] + ".",
      [
        { text: "Annuller", style: "cancel" },
        { text: "Udbetal", onPress: udbetal },
      ]
    );
  }

  return (
    // KeyboardAvoidingView, så tastaturet ikke dækker feltet til konto- eller kortnummer
    <KeyboardAvoidingView style={GlobalStyle.skaerm} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={GlobalStyle.skaermIndhold} keyboardShouldPersistTaps="handled">
        <Text style={GlobalStyle.titelStor}>Udbetal cashback</Text>

        {/* Beløbet i bon-stilen, som cashback-kortet på Hjem */}
        <View style={[GlobalStyle.cashbackKort, GlobalStyle.udbetalingBon]}>
          <Text style={GlobalStyle.cashbackEtiket}>DU FÅR UDBETALT</Text>
          <Text style={GlobalStyle.cashbackBeloeb}>{formaterKroner(saldo)}</Text>
          <Text style={GlobalStyle.cashbackUndertekst}>Hele din optjente cashback</Text>
          <BonKant />
        </View>

        <View style={GlobalStyle.gruppe}>
          <Text style={GlobalStyle.gruppeTitel}>UDBETAL TIL</Text>
          <View style={GlobalStyle.gruppeListe}>
            {Object.keys(METODER).map((type) => {
              const valgt = valgtMetode === type;
              return (
                <Pressable
                  key={type}
                  onPress={() => vaelgMetode(type)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: valgt }}
                  accessibilityLabel={METODER[type].navn}
                  style={[GlobalStyle.metodeRække, GlobalStyle.listeVareSkillelinje]}
                >
                  <View style={GlobalStyle.metodeIkon}>
                    <Ionicons name={METODER[type].ikon} size={20} color={Colors.primary} />
                  </View>
                  <View style={GlobalStyle.rækkeTekst}>
                    <Text style={GlobalStyle.rækkeTitel}>{METODER[type].navn}</Text>
                    <Text style={GlobalStyle.rækkeInfo}>
                      {metoder[type] ? metoder[type] + " · " + METODER[type].tid : "Ikke tilføjet"}
                    </Text>
                  </View>
                  <Ionicons
                    name={valgt ? "checkmark-circle" : "ellipse-outline"}
                    size={26}
                    color={valgt ? Colors.primary : Colors.textTertiary}
                  />
                </Pressable>
              );
            })}

            {/* Tilføj (eller skift) en metode: feltet vises, når man har valgt en type */}
            {formType ? (
              <View style={GlobalStyle.metodeForm}>
                <View style={GlobalStyle.metodeTyper}>
                  {Object.keys(METODER).map((type) => (
                    <Pressable
                      key={type}
                      onPress={() => setFormType(type)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: formType === type }}
                      style={[GlobalStyle.chip, formType === type && GlobalStyle.chipAktiv]}
                    >
                      <Text style={formType === type ? GlobalStyle.chipTekstAktiv : GlobalStyle.chipTekst}>
                        {METODER[type].navn}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                <TextInput
                  style={GlobalStyle.metodeInput}
                  value={nummer}
                  onChangeText={setNummer}
                  placeholder={METODER[formType].felt}
                  placeholderTextColor={Colors.textTertiary}
                  keyboardType="number-pad"
                  accessibilityLabel={METODER[formType].felt}
                />
                <SecondaryButton label="Gem metode" onPress={tilfoejMetode} />
              </View>
            ) : (
              <Pressable
                onPress={() => setFormType("bank")}
                accessibilityRole="button"
                style={GlobalStyle.metodeRække}
              >
                <View style={GlobalStyle.metodeTilfoejIkon}>
                  <Ionicons name="add" size={22} color={Colors.primary} />
                </View>
                <Text style={GlobalStyle.linkTekst}>Tilføj udbetalingsmetode</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Opsummering: der er intet gebyr, så man modtager hele beløbet */}
        <View style={GlobalStyle.opsummering}>
          <View style={GlobalStyle.vareRække}>
            <Text style={GlobalStyle.vareNavn}>Cashback</Text>
            <Text style={GlobalStyle.varePris}>{formaterKroner(saldo)}</Text>
          </View>
          <View style={GlobalStyle.vareRække}>
            <Text style={GlobalStyle.vareNavn}>Gebyr</Text>
            <Text style={GlobalStyle.varePris}>{formaterKroner(0)}</Text>
          </View>
          <View style={GlobalStyle.skillelinje} />
          <View style={GlobalStyle.vareRække}>
            <Text style={GlobalStyle.totalTekst}>Du modtager</Text>
            <Text style={GlobalStyle.opsummeringBeloeb}>{formaterKroner(saldo)}</Text>
          </View>
        </View>

        <View style={GlobalStyle.sikkerhedLinje}>
          <Ionicons name="lock-closed-outline" size={16} color={Colors.textSecondary} />
          <Text style={GlobalStyle.sikkerhedTekst}>
            Udbetalingen sker sikkert via vores betalingspartner Stripe. Vi gemmer aldrig dine bank- eller
            kortoplysninger.
          </Text>
        </View>

        <PrimaryButton label="Bekræft udbetaling" onPress={bekraeft} disabled={!kanUdbetale} />
        {/* Forklaring, hvis knappen er slået fra */}
        {saldo < UDBETALING_MIN ? (
          <Text style={GlobalStyle.fodnoteCentreret}>Du kan udbetale, når du har {UDBETALING_MIN} kr. i cashback.</Text>
        ) : valgtMetode === null ? (
          <Text style={GlobalStyle.fodnoteCentreret}>Vælg, hvor pengene skal udbetales til.</Text>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
