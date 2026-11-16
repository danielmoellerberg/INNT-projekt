// IndkoebslisteScreen: kundens indkøbsliste, første skærm i Indkøbsliste-fanen (IndkoebsStack).
// Figma: 11 og 11b Indkøbsliste. Herfra åbnes Butikker med "Supermarkeder nær dig".
// Listen ligger i Firebase (users/{uid}/indkoebsliste) og læses live via AppContext.
//
// Skærmen har to tilstande:
// - Listen (11): forventet pris og forventet cashback (0,5 % af prisen) øverst, varerne grupperet efter butik med afstand og
//   rutevejledning, afkrydsning, swipe for at slette og et forslag, hvis en vare er billigere
//   i en anden af brugerens butikker.
// - Søgning (11b): når brugeren skriver i "Tilføj en vare", vises samme vare i alle butikker,
//   billigst først. Findes varen ikke, kan den tilføjes uden pris.
//
// Søgning og prissammenligning ligger i services/offers.js. Afstande og ruten kommer fra
// services/stores.js, som Butikker-skærmen også bruger.

import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, Pressable, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Ionicons } from "@expo/vector-icons";

import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import StoreLogo from "../components/StoreLogo";
import { useApp } from "../context/AppContext";
import { soegVarer, findBilligereAndetsteds } from "../services/offers";
import { KAEDER, hentGemteButikker, naermesteIKaede, formaterAfstand, aabnRute } from "../services/stores";
import { formaterKroner, formaterHeltal } from "../data/const";
import { GlobalStyle, Colors } from "../styles/GlobalStyle";

// Beløb i en sætning: 3 -> "3 kr.", 2.5 -> "2,50 kr."
function kronerKort(beloeb) {
  return Number.isInteger(beloeb) ? beloeb + " kr." : formaterKroner(beloeb);
}

// Samler varerne i grupper per butik. Inden for en gruppe kommer de ikke-afkrydsede først
// (i den rækkefølge, de blev tilføjet), og de afkrydsede flyttes nederst.
// Grupperne står i samme rækkefølge som kæderne på Butikker. Varer uden butik kommer sidst.
function grupperEfterButik(liste) {
  const grupper = [];
  liste.forEach((vare) => {
    let gruppe = grupper.find((g) => g.butik === vare.butik);
    if (!gruppe) {
      gruppe = { butik: vare.butik, varer: [] };
      grupper.push(gruppe);
    }
    gruppe.varer.push(vare);
  });
  // true - false = 1, så afkrydsede (true) sorteres efter ikke-afkrydsede (false)
  grupper.forEach((g) => g.varer.sort((a, b) => a.afkrydset - b.afkrydset || a.tilfoejet - b.tilfoejet));
  const plads = (butik) => (KAEDER.includes(butik) ? KAEDER.indexOf(butik) : KAEDER.length);
  return grupper.sort((a, b) => plads(a.butik) - plads(b.butik));
}

// Én vare på listen. Tryk krydser af. Swipe til venstre viser et rødt felt, og når det er
// trukket helt ud, slettes varen (ReanimatedSwipeable fra react-native-gesture-handler).
function VareRaekke({ vare, sidst, onSkift, onSlet }) {
  return (
    <ReanimatedSwipeable
      renderRightActions={() => (
        <View style={GlobalStyle.sletSwipe}>
          <Ionicons name="trash-outline" size={22} color={Colors.onPrimary} />
          <Text style={GlobalStyle.sletSwipeTekst}>Slet</Text>
        </View>
      )}
      onSwipeableOpen={onSlet}
      rightThreshold={80}
      overshootRight={false}
    >
      <Pressable
        onPress={onSkift}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: vare.afkrydset === true }}
        accessibilityLabel={vare.navn}
        accessibilityHint="Swipe til venstre for at slette"
        style={[GlobalStyle.listeVare, !sidst && GlobalStyle.listeVareSkillelinje]}
      >
        <Ionicons
          name={vare.afkrydset ? "checkmark-circle" : "ellipse-outline"}
          size={26}
          color={vare.afkrydset ? Colors.primary : Colors.textTertiary}
        />
        <View style={GlobalStyle.vareNavnKolonne}>
          <Text style={[GlobalStyle.vareNavn, vare.afkrydset && GlobalStyle.listeVareAfkrydset]}>{vare.navn}</Text>
          {/* Tilbuddets gyldighed vises kun, før varen er krydset af */}
          {!vare.afkrydset && vare.gyldig ? <Text style={GlobalStyle.vareAntal}>Tilbud {vare.gyldig}</Text> : null}
        </View>
        {vare.pris > 0 ? (
          <Text style={[GlobalStyle.varePris, vare.afkrydset && GlobalStyle.listeVareAfkrydset]}>
            {formaterKroner(vare.pris)}
          </Text>
        ) : null}
      </Pressable>
    </ReanimatedSwipeable>
  );
}

export default function IndkoebslisteScreen({ navigation }) {
  const {
    indkoebsliste,
    tilbud,
    valgteButikker,
    tilfoejTilbudTilListe,
    tilfoejEgenVare,
    skiftAfkrydset,
    sletFraListe,
    rydAfkrydsede,
    flytVare,
    beregnCashback,
  } = useApp();
  const [soegetekst, setSoegetekst] = useState("");
  // De butikker, der sidst blev hentet på Butikker-skærmen (til afstand og rute), eller null
  const [gemteButikker, setGemteButikker] = useState(null);

  // Læs de gemte butikker én gang. Har brugeren ikke åbnet Butikker endnu, vises bare ingen afstand.
  useEffect(() => {
    hentGemteButikker().then(setGemteButikker);
  }, []);

  const soeger = soegetekst.trim() !== "";
  const resultater = soegVarer(tilbud, soegetekst);

  // Nøgletallene øverst. Forventet pris tæller kun varer, der ikke er krydset af endnu.
  const forventetPris = indkoebsliste.filter((v) => !v.afkrydset).reduce((sum, v) => sum + (v.pris || 0), 0);
  // Forventet cashback er 0,5 % af den forventede pris - det samme, som bonen vil give
  const cashback = beregnCashback(forventetPris);
  const antalButikker = new Set(indkoebsliste.map((v) => v.butik).filter((b) => b)).size;
  const antalAfkrydsede = indkoebsliste.filter((v) => v.afkrydset).length;

  const grupper = grupperEfterButik(indkoebsliste);
  // Er en vare billigere i en anden af brugerens valgte kæder? (simpel prissammenligning)
  const forslag = findBilligereAndetsteds(indkoebsliste, tilbud, valgteButikker);

  // "Rema 1000 · 600 m" - kæden og afstanden til den nærmeste butik, hvis den kendes
  function kaedeOgAfstand(kaede) {
    const naermeste = naermesteIKaede(gemteButikker, kaede);
    return naermeste ? kaede + " · " + formaterAfstand(naermeste.afstand) : kaede;
  }

  // Kalder en funktion fra AppContext og viser en venlig besked, hvis Firebase afviser den
  async function proev(handling) {
    try {
      await handling();
    } catch (error) {
      Alert.alert("Det lykkedes ikke", "Tjek din internetforbindelse, og prøv igen.");
    }
  }

  // Tilføjer et søgeresultat (et tilbud) og tømmer søgefeltet, så listen vises igen
  function tilfoejResultat(etTilbud) {
    proev(() => tilfoejTilbudTilListe(etTilbud));
    setSoegetekst("");
  }

  // Plus-knappen i feltet: tilføjer det, brugeren har skrevet, som en vare uden butik og pris
  function tilfoejSkrevetVare() {
    if (!soeger) return;
    proev(() => tilfoejEgenVare(soegetekst.trim()));
    setSoegetekst("");
  }

  // "Ryd afkrydsede varer" spørger først, fordi det ikke kan fortrydes
  function bekraeftRyd() {
    Alert.alert(
      "Ryd afkrydsede varer?",
      antalAfkrydsede === 1 ? "1 vare fjernes fra listen." : antalAfkrydsede + " varer fjernes fra listen.",
      [
        { text: "Annuller", style: "cancel" },
        { text: "Ryd", style: "destructive", onPress: () => proev(rydAfkrydsede) },
      ]
    );
  }

  // Søgeresultaterne (11b): samme vare i alle butikker, billigst først
  const soegeresultater = (
    <View style={GlobalStyle.gruppeKort}>
      {resultater.map((t, index) => {
        const billigst = index === 0;
        return (
          <View key={t.id} style={[GlobalStyle.soegResultat, index < resultater.length - 1 && GlobalStyle.listeVareSkillelinje]}>
            <StoreLogo butik={t.butik} />
            <View style={GlobalStyle.rækkeTekst}>
              <View style={GlobalStyle.soegNavnRække}>
                <Text style={GlobalStyle.rækkeTitel} numberOfLines={1}>{t.vare}</Text>
                {billigst ? (
                  <View style={GlobalStyle.billigstMaerke}>
                    <Text style={GlobalStyle.billigstMaerkeTekst}>Billigst</Text>
                  </View>
                ) : null}
              </View>
              <Text style={GlobalStyle.rækkeInfo}>{kaedeOgAfstand(t.butik)}</Text>
            </View>
            <Text style={[GlobalStyle.soegPris, billigst && GlobalStyle.soegPrisBilligst]}>{formaterKroner(t.pris)}</Text>
            {/* Den billigste har en udfyldt plus-knap, de andre en lys */}
            <Pressable
              onPress={() => tilfoejResultat(t)}
              accessibilityRole="button"
              accessibilityLabel={"Tilføj " + t.vare + " fra " + t.butik}
              style={({ pressed }) => [billigst ? GlobalStyle.plusKnap : GlobalStyle.plusKnapLys, pressed && GlobalStyle.trykket]}
            >
              <Ionicons name="add" size={22} color={billigst ? Colors.onPrimary : Colors.primary} />
            </Pressable>
          </View>
        );
      })}

      {/* Varen findes ikke i tilbuddene: den kan stadig tilføjes uden pris */}
      {resultater.length === 0 ? (
        <View style={GlobalStyle.soegResultat}>
          <View style={GlobalStyle.rækkeTekst}>
            <Text style={GlobalStyle.rækkeTitel} numberOfLines={1}>{soegetekst.trim()}</Text>
            <Text style={GlobalStyle.rækkeInfo}>Ingen tilbud lige nu. Tilføj uden pris.</Text>
          </View>
          <Pressable
            onPress={tilfoejSkrevetVare}
            accessibilityRole="button"
            accessibilityLabel={"Tilføj " + soegetekst.trim() + " uden pris"}
            style={({ pressed }) => [GlobalStyle.plusKnapLys, pressed && GlobalStyle.trykket]}
          >
            <Ionicons name="add" size={22} color={Colors.primary} />
          </Pressable>
        </View>
      ) : null}
    </View>
  );

  // Tom tilstand: der er ingen varer på listen endnu
  const tomListe = (
    <View style={GlobalStyle.tomTilstand}>
      <View style={GlobalStyle.tomIkon}>
        <Ionicons name="cart-outline" size={28} color={Colors.primary} />
      </View>
      <Text style={GlobalStyle.tomTitel}>Din indkøbsliste er tom</Text>
      <Text style={GlobalStyle.tomTekst}>Tilføj varer fra tilbuddene, eller skriv en vare i feltet ovenfor.</Text>
      <View style={GlobalStyle.tomHandling}>
        {/* Tilbud er en anden fane, så navigate skifter fane */}
        <PrimaryButton label="Se tilbud" onPress={() => navigation.navigate("Tilbud")} />
      </View>
    </View>
  );

  // Toppen af skærmen. Den gives til FlatList som et element (ikke en funktion), så søgefeltet
  // ikke bygges forfra ved hvert bogstav og mister tastaturet.
  const toppen = (
    <View style={GlobalStyle.sektioner}>
      <View style={GlobalStyle.skaermHeader}>
        <Text style={GlobalStyle.titelStor}>Indkøbsliste</Text>
        <Text style={GlobalStyle.undertitel}>
          {soeger
            ? "Sorteret efter pris, billigst først"
            : indkoebsliste.length + (indkoebsliste.length === 1 ? " vare" : " varer") +
              " fra " + antalButikker + (antalButikker === 1 ? " butik" : " butikker")}
        </Text>
      </View>

      {/* De to nøgletal skjules under søgning, så resultaterne står lige under feltet */}
      {!soeger && indkoebsliste.length > 0 ? (
        <View style={GlobalStyle.kpiRække}>
          <View style={GlobalStyle.kpiKort}>
            <Text style={GlobalStyle.kpiTal}>{formaterHeltal(forventetPris)} kr.</Text>
            <Text style={GlobalStyle.kpiLabel}>forventet pris</Text>
          </View>
          <View style={[GlobalStyle.kpiKort, GlobalStyle.kpiKortCashback]}>
            <Text style={[GlobalStyle.kpiTal, GlobalStyle.kpiTalCashback]}>+ {formaterKroner(cashback)}</Text>
            <Text style={GlobalStyle.kpiLabel}>forventet cashback</Text>
          </View>
        </View>
      ) : null}

      {/* Butikker ligger i samme stack. Knappen skjules under søgning, så resultaterne står
          lige under søgefeltet. */}
      {!soeger ? (
        <SecondaryButton
          label="Supermarkeder nær dig"
          ikon="location-outline"
          onPress={() => navigation.navigate("Butikker")}
        />
      ) : null}

      {/* Søgefeltet får en grøn kant, mens man søger (Figma 11b) */}
      <View style={[GlobalStyle.soegefelt, soeger && GlobalStyle.soegefeltAktiv]}>
        <TextInput
          style={GlobalStyle.soegefeltInput}
          value={soegetekst}
          onChangeText={setSoegetekst}
          placeholder="Tilføj en vare, fx mælk"
          placeholderTextColor={Colors.textTertiary}
          returnKeyType="done"
          onSubmitEditing={tilfoejSkrevetVare}
          accessibilityLabel="Tilføj en vare"
        />
        <Pressable
          onPress={tilfoejSkrevetVare}
          disabled={!soeger}
          accessibilityRole="button"
          accessibilityLabel="Tilføj varen"
          style={[GlobalStyle.plusKnap, !soeger && GlobalStyle.deaktiveret]}
        >
          <Ionicons name="add" size={22} color={Colors.onPrimary} />
        </Pressable>
      </View>

      {soeger ? soegeresultater : null}
      {!soeger && indkoebsliste.length === 0 ? tomListe : null}
    </View>
  );

  // Bunden af listen: forslag om en billigere butik og knappen, der rydder afkrydsede varer
  const bunden = (
    <View style={GlobalStyle.sektioner}>
      {forslag ? (
        <View style={GlobalStyle.forslagKort}>
          <Ionicons name="sparkles-outline" size={18} color={Colors.primary} />
          <Text style={GlobalStyle.forslagTekst}>
            {forslag.vare.navn} er {kronerKort(forslag.besparelse)} billigere i {forslag.tilbud.butik} i denne uge.
          </Text>
          <Pressable
            onPress={() => proev(() => flytVare(forslag.vare.id, forslag.tilbud))}
            accessibilityRole="button"
            accessibilityLabel={"Flyt " + forslag.vare.navn + " til " + forslag.tilbud.butik}
            style={GlobalStyle.forslagKnap}
          >
            <Text style={GlobalStyle.forslagKnapTekst}>Flyt</Text>
          </Pressable>
        </View>
      ) : null}
      {antalAfkrydsede > 0 ? <SecondaryButton label="Ryd afkrydsede varer" onPress={bekraeftRyd} /> : null}
    </View>
  );

  return (
    // Skærmen har ingen header (den er første skærm i fanen), så SafeAreaView holder den fri
    // af statuslinjen. KeyboardAvoidingView skubber indholdet op, så tastaturet ikke dækker
    // søgeresultaterne.
    <SafeAreaView style={GlobalStyle.skaerm} edges={["top"]}>
      <KeyboardAvoidingView style={GlobalStyle.rod} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <FlatList
          data={soeger ? [] : grupper}
          keyExtractor={(gruppe) => gruppe.butik || "andre"}
          ListHeaderComponent={toppen}
          ListHeaderComponentStyle={GlobalStyle.listeHeader}
          ListFooterComponent={soeger ? null : bunden}
          contentContainerStyle={GlobalStyle.listeIndhold}
          ItemSeparatorComponent={() => <View style={GlobalStyle.gruppeMellemrum} />}
          // Tryk på knapper virker, selvom tastaturet er oppe
          keyboardShouldPersistTaps="handled"
          renderItem={({ item: gruppe }) => {
            const naermeste = naermesteIKaede(gemteButikker, gruppe.butik);
            return (
              <View style={GlobalStyle.gruppeSektion}>
                {/* Gruppens top: kæde, nærmeste butik med afstand og en Rute-knap */}
                <View style={GlobalStyle.gruppeHoved}>
                  {gruppe.butik ? <StoreLogo butik={gruppe.butik} /> : null}
                  <View style={GlobalStyle.rækkeTekst}>
                    <Text style={GlobalStyle.rækkeTitel}>{gruppe.butik || "Andre varer"}</Text>
                    {naermeste ? (
                      <Text style={GlobalStyle.rækkeInfo} numberOfLines={1}>
                        {naermeste.butik.adresse ? naermeste.butik.adresse + " · " : ""}
                        {formaterAfstand(naermeste.afstand)}
                      </Text>
                    ) : null}
                  </View>
                  {naermeste ? (
                    <Pressable
                      onPress={() => aabnRute(naermeste.butik)}
                      accessibilityRole="button"
                      accessibilityLabel={"Rute til " + gruppe.butik}
                      hitSlop={8}
                      style={({ pressed }) => [GlobalStyle.ruteKnap, pressed && GlobalStyle.trykket]}
                    >
                      <Ionicons name="navigate" size={14} color={Colors.primary} />
                      <Text style={GlobalStyle.ruteKnapTekst}>Rute</Text>
                    </Pressable>
                  ) : null}
                </View>

                <View style={GlobalStyle.gruppeKort}>
                  {gruppe.varer.map((vare, index) => (
                    <VareRaekke
                      key={vare.id}
                      vare={vare}
                      sidst={index === gruppe.varer.length - 1}
                      onSkift={() => proev(() => skiftAfkrydset(vare.id, !vare.afkrydset))}
                      onSlet={() => proev(() => sletFraListe(vare.id))}
                    />
                  ))}
                </View>
              </View>
            );
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
