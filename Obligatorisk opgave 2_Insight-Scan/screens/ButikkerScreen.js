// ButikkerScreen: kundens Butikker-fane (Figma: 08 Butikker).
// Øverst et kort med supermarkederne i nærheden, nederst et ark med én række per kæde
// ("Jeg handler her"). Kortet viser kun butikker fra de kæder, brugeren har slået til, og
// de samme valg bruges af filteret "Mine butikker" på Tilbud (via valgteButikker i AppContext).
//
// Trinene:
// 1. Spørg om lov til brugerens placering (expo-location, mønster fra øvelse 08).
// 2. Hent supermarkeder inden for 2 km fra OpenStreetMap (services/stores.js).
// 3. Vis en række per kæde med antal butikker og afstand til den nærmeste.
// 4. Vis en markør på kortet for hver butik i en valgt kæde, og zoom, så de alle kan ses.
// 5. Tryk på en markør viser en lille boks med adresse, afstand og rutevejledning.
// 6. Tryk på toppen af arket folder det ned, så kortet fylder hele skærmen (og op igen).

import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, Pressable, ActivityIndicator, Linking, Platform, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

import PrimaryButton from "../components/PrimaryButton";
import StoreRow from "../components/StoreRow";
import StoreLogo from "../components/StoreLogo";
import { useApp } from "../context/AppContext";
import { hentButikker, KAEDER, afstandIMeter, formaterAfstand } from "../services/stores";
import { GlobalStyle, Colors } from "../styles/GlobalStyle";

// Kortet starter over København, så der er noget at se, mens placeringen hentes,
// og hvis brugeren ikke vil dele sin placering (som startpositionen i øvelse 08)
const KOEBENHAVN = {
  latitude: 55.6761,
  longitude: 12.5683,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

// Luft i kanten, når kortet zoomer, så markørerne ikke ligger under knappen eller arket
const KANT_LUFT = { top: 110, right: 50, bottom: 70, left: 50 };

export default function ButikkerScreen() {
  const { valgteButikker, skiftButik } = useApp();

  // Reference til kortet, så vi kan zoome og flytte det (samme idé som kameraet i øvelse 07)
  const kortRef = useRef(null);
  const [kortKlar, setKortKlar] = useState(false);

  // "spoerger" = vi venter på svar, "givet" = vi må bruge placeringen, "afvist" = nej
  const [tilladelse, setTilladelse] = useState("spoerger");
  // Kan appen spørge igen? Har brugeren sagt nej for altid, må de åbne indstillinger selv
  const [kanSpoergeIgen, setKanSpoergeIgen] = useState(true);
  const [position, setPosition] = useState(null);
  // Positionen, butikkerne blev hentet ved. Bruges til at se, om brugeren har flyttet sig langt
  const [hentetVed, setHentetVed] = useState(null);
  const [butikker, setButikker] = useState([]);
  // "henter", "klar" eller "fejl"
  const [status, setStatus] = useState("henter");
  // Den butik, brugeren har trykket på (vises i den lille boks), eller null
  const [valgt, setValgt] = useState(null);
  // Er arket foldet ned? Så vises kun overskriften, og kortet fylder resten af skærmen
  const [arkFoldet, setArkFoldet] = useState(false);

  // Trin 1 og 2: spørg om placeringen, find brugeren, og hent butikkerne omkring dem.
  // Går noget galt (ingen net, ingen GPS), vises en fejlbesked i arket. Appen crasher ikke.
  async function start() {
    setStatus("henter");
    try {
      const svar = await Location.requestForegroundPermissionsAsync();
      setKanSpoergeIgen(svar.canAskAgain);
      if (svar.status !== "granted") {
        // Uden placering bliver kortet over København, og arket forklarer hvorfor
        setTilladelse("afvist");
        setStatus("klar");
        return;
      }
      setTilladelse("givet");

      const { coords } = await Location.getCurrentPositionAsync({});
      const nyPosition = { latitude: coords.latitude, longitude: coords.longitude };
      setPosition(nyPosition);

      const fundne = await hentButikker(nyPosition);
      setButikker(fundne);
      setHentetVed(nyPosition);
      setStatus("klar");
    } catch (error) {
      setStatus("fejl");
    }
  }

  // Kør start én gang, når skærmen åbnes første gang
  useEffect(() => {
    start();
  }, []);

  // Kun butikker fra de kæder, brugeren har slået til, vises på kortet
  const synligeButikker = butikker.filter((butik) => valgteButikker[butik.kaede] === true);

  // Trin 4: zoom kortet, så alle synlige markører (og brugeren selv) kan ses.
  // Køres, når butikkerne er hentet, og når brugeren slår en kæde til eller fra.
  // fitToCoordinates er en funktion på kortet, derfor bruger vi kortRef.
  // Køres også, når arket foldes, fordi kortet så skifter størrelse.
  // position står ikke i listen nedenfor, så kortet ikke zoomer ud igen, når "Min placering"
  // flytter det. Positionen er altid sat, før butikkerne er hentet (se start).
  useEffect(() => {
    if (!kortKlar || !position) return;
    if (synligeButikker.length === 0) {
      kortRef.current.animateToRegion({ ...position, latitudeDelta: 0.02, longitudeDelta: 0.02 });
      return;
    }
    const punkter = synligeButikker.map((b) => ({ latitude: b.latitude, longitude: b.longitude }));
    kortRef.current.fitToCoordinates([...punkter, position], { edgePadding: KANT_LUFT, animated: true });
  }, [kortKlar, butikker, valgteButikker, arkFoldet]);

  // "Min placering": find brugeren igen og centrer kortet på dem.
  // Har brugeren flyttet sig over 1 km fra stedet, butikkerne blev hentet, hentes de igen.
  // Har brugeren ikke givet lov endnu, spørger vi igen.
  async function minPlacering() {
    if (tilladelse !== "givet") {
      start();
      return;
    }
    try {
      const { coords } = await Location.getCurrentPositionAsync({});
      const nyPosition = { latitude: coords.latitude, longitude: coords.longitude };
      setPosition(nyPosition);
      kortRef.current.animateToRegion({ ...nyPosition, latitudeDelta: 0.02, longitudeDelta: 0.02 });

      if (!hentetVed || afstandIMeter(hentetVed, nyPosition) > 1000) {
        const fundne = await hentButikker(nyPosition);
        setButikker(fundne);
        setHentetVed(nyPosition);
      }
    } catch (error) {
      Alert.alert("Kunne ikke finde dig", "Tjek, at placering er slået til, og prøv igen.");
    }
  }

  // Trin 5: åbn telefonens kort-app med ruten til butikken.
  // iPhone bruger Apple Kort (maps.apple.com), Android bruger Google Maps.
  // daddr/destination er målet. Startpunktet er brugerens placering, så det udelades.
  async function aabnRute(butik) {
    const maal = butik.latitude + "," + butik.longitude;
    const url = Platform.select({
      ios: "http://maps.apple.com/?daddr=" + maal,
      default: "https://www.google.com/maps/dir/?api=1&destination=" + maal,
    });
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Kunne ikke åbne kortet", "Prøv igen om lidt.");
    }
  }

  // Trin 3: tekst til en kædes række, fx "3 butikker · nærmeste 350 m"
  function infoOmKaede(kaede) {
    if (tilladelse === "afvist") return "Del din placering for at se afstand";
    if (status === "henter") return "Finder butikker ...";
    const iKaeden = butikker.filter((b) => b.kaede === kaede);
    if (iKaeden.length === 0 || !position) return "Ingen butikker inden for 2 km";
    // Den nærmeste er den med mindst afstand til brugeren
    const naermeste = Math.min(...iKaeden.map((b) => afstandIMeter(position, b)));
    const antal = iKaeden.length === 1 ? "1 butik" : iKaeden.length + " butikker";
    return antal + " · nærmeste " + formaterAfstand(naermeste);
  }

  // Lukker boksen, hvis brugeren trykker et tomt sted på kortet.
  // På iPhone kommer et tryk på en markør også hertil, så dem ignorerer vi.
  function trykPaaKort(event) {
    if (event.nativeEvent.action !== "marker-press") {
      setValgt(null);
    }
  }

  // Boksen vises kun, hvis butikkens kæde stadig er slået til
  const visBoks = valgt && valgteButikker[valgt.kaede] === true;

  // Hvor mange kæder er slået til? Vises under overskriften, når arket er foldet ned
  const antalValgte = KAEDER.filter((kaede) => valgteButikker[kaede] === true).length;

  // Beskeder øverst i listen: mangler placering, henter, eller fejl
  const ArkToppen = () => (
    <View>
      {tilladelse === "afvist" ? (
        <View style={GlobalStyle.arkBesked}>
          <Text style={GlobalStyle.arkBeskedTekst}>
            Uden din placering viser kortet København. Del din placering, så finder vi
            supermarkederne nær dig.
          </Text>
          {/* Har brugeren sagt nej for altid, kan appen ikke spørge igen - så må de åbne indstillinger */}
          {kanSpoergeIgen ? (
            <PrimaryButton label="Prøv igen" onPress={start} />
          ) : (
            <PrimaryButton label="Åbn indstillinger" onPress={() => Linking.openSettings()} />
          )}
        </View>
      ) : null}

      {status === "henter" && tilladelse !== "afvist" ? (
        <View style={[GlobalStyle.arkBesked, GlobalStyle.arkBeskedRække]}>
          <ActivityIndicator color={Colors.primary} />
          <Text style={GlobalStyle.arkBeskedTekst}>Finder supermarkeder i nærheden ...</Text>
        </View>
      ) : null}

      {/* Fejl og ingen gemte butikker at falde tilbage på (se hentButikker) */}
      {status === "fejl" ? (
        <View style={GlobalStyle.arkBesked}>
          <Text style={GlobalStyle.arkBeskedTekst}>
            Vi kunne ikke hente butikkerne lige nu. Tjek din internetforbindelse, og prøv igen.
          </Text>
          <PrimaryButton label="Prøv igen" onPress={start} />
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={GlobalStyle.butikkerSkaerm}>
      {/* Er arket foldet ned, fylder kortet hele skærmen (kortOmraadeFuld) */}
      <View style={arkFoldet ? GlobalStyle.kortOmraadeFuld : GlobalStyle.kortOmraade}>
        {/* Standardkortet: Apple Kort på iPhone, Google Maps på Android (ingen provider, ingen nøgle).
            showsUserLocation viser den blå prik. showsPointsOfInterest={false} skjuler kortets
            egne butikker og restauranter, så kun vores markører ses. */}
        <MapView
          ref={kortRef}
          style={GlobalStyle.kort}
          initialRegion={KOEBENHAVN}
          showsUserLocation={tilladelse === "givet"}
          showsMyLocationButton={false}
          showsPointsOfInterest={false}
          onMapReady={() => setKortKlar(true)}
          onPress={trykPaaKort}
        >
          {synligeButikker.map((butik) => (
            <Marker
              key={butik.id}
              coordinate={{ latitude: butik.latitude, longitude: butik.longitude }}
              onPress={() => setValgt(butik)}
              accessibilityLabel={butik.kaede + (butik.adresse ? ", " + butik.adresse : "")}
            >
              <StoreLogo butik={butik.kaede} pin />
            </Marker>
          ))}
        </MapView>

        {/* Knappen ligger ovenpå kortet under statuslinjen (SafeAreaView giver plads til den) */}
        <SafeAreaView edges={["top"]} style={GlobalStyle.kortKnapper}>
          <Pressable
            onPress={minPlacering}
            accessibilityRole="button"
            accessibilityLabel="Min placering"
            style={({ pressed }) => [GlobalStyle.minPlaceringKnap, pressed && GlobalStyle.trykket]}
          >
            <Ionicons name="locate-outline" size={22} color={Colors.primary} />
          </Pressable>
        </SafeAreaView>

        {visBoks ? (
          <View style={GlobalStyle.butikBoks}>
            <View style={GlobalStyle.butikBoksTop}>
              <StoreLogo butik={valgt.kaede} />
              <View style={GlobalStyle.rækkeTekst}>
                <Text style={GlobalStyle.rækkeTitel}>{valgt.kaede}</Text>
                <Text style={GlobalStyle.rækkeInfo} numberOfLines={1}>
                  {valgt.adresse ? valgt.adresse + " · " : ""}
                  {position ? formaterAfstand(afstandIMeter(position, valgt)) : ""}
                </Text>
              </View>
              <Pressable
                onPress={() => setValgt(null)}
                accessibilityRole="button"
                accessibilityLabel="Luk"
                style={GlobalStyle.butikBoksLuk}
              >
                <Ionicons name="close" size={20} color={Colors.textTertiary} />
              </Pressable>
            </View>
            <PrimaryButton label="Rutevejledning" onPress={() => aabnRute(valgt)} />
          </View>
        ) : null}
      </View>

      {/* Arket med én række per kæde. Valget gemmes med AsyncStorage via skiftButik (mønster fra 08). */}
      <View style={[GlobalStyle.ark, arkFoldet && GlobalStyle.arkFoldet]}>
        {/* Toppen af arket er en knap: tryk folder arket ned eller op (bare en useState) */}
        <Pressable
          onPress={() => setArkFoldet(!arkFoldet)}
          accessibilityRole="button"
          accessibilityLabel={arkFoldet ? "Vis butikker" : "Skjul butikker og vis kortet på hele skærmen"}
          accessibilityState={{ expanded: !arkFoldet }}
          style={GlobalStyle.arkTop}
        >
          <View style={GlobalStyle.arkGrabber} />
          <View style={GlobalStyle.arkHeader}>
            <View style={GlobalStyle.arkHeaderTekst}>
              <Text style={GlobalStyle.arkTitel}>Butikker nær dig</Text>
              <Text style={GlobalStyle.undertitel}>
                {arkFoldet
                  ? (antalValgte === 1 ? "1 kæde valgt" : antalValgte + " kæder valgt") + " · tryk for at ændre"
                  : "Vi viser kun tilbud fra de butikker, du vælger."}
              </Text>
            </View>
            <Ionicons name={arkFoldet ? "chevron-up" : "chevron-down"} size={22} color={Colors.textTertiary} />
          </View>
        </Pressable>

        {/* Listen vises kun, når arket er foldet op */}
        {!arkFoldet ? (
          <FlatList
            data={KAEDER}
            keyExtractor={(kaede) => kaede}
            ListHeaderComponent={ArkToppen}
            contentContainerStyle={GlobalStyle.arkIndhold}
            renderItem={({ item }) => (
              <StoreRow
                butik={item}
                info={infoOmKaede(item)}
                valgt={valgteButikker[item] === true}
                onSkift={(til) => skiftButik(item, til)}
              />
            )}
          />
        ) : null}
      </View>
    </View>
  );
}
