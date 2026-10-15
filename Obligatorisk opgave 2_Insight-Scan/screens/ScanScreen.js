// ScanScreen: kameraet i Scan-fanen (Figma: 06 Scan).
// Brugeren tager et billede af kvitteringen eller vælger et fra sine fotos. Billedet sendes til
// AI'en (services/ai.js), som aflæser butik, dato og varer. Derefter tjekkes bonen mod reglerne
// mod snyd (allerede scannet? for gammel?), og resultatet vises på GodkendKvitteringScreen,
// hvor brugeren kan rette det, før noget gemmes.
//
// Kameraet følger mønstret fra øvelse 07: CameraView + useCameraPermissions, en reference
// (useRef) til kameraet, så vi kan kalde takePictureAsync(), og useIsFocused, så kameraet kun
// kører, mens Scan-fanen er åben. Galleriet bruger expo-image-picker (ikke i kurset, men
// godkendt), fordi mange tager et billede af bonen i butikken og først scanner det senere.

import React, { useState, useRef, useEffect } from "react";
import { View, Text, Pressable, ActivityIndicator, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import PrimaryButton from "../components/PrimaryButton";
import { useApp } from "../context/AppContext";
import { laesKvittering } from "../services/ai";
import { GlobalStyle, Colors } from "../styles/GlobalStyle";

export default function ScanScreen({ navigation }) {
  const { tjekKvittering } = useApp();
  // Kameratilladelse (mønster fra 07): permission fortæller, om vi har lov,
  // requestPermission spørger brugeren, getPermission tjekker igen efter indstillinger
  const [permission, requestPermission, getPermission] = useCameraPermissions();
  // Reference til kameraet, så vi kan tage et billede med takePictureAsync()
  const cameraRef = useRef(null);
  // Kameraet skal være klar, før man kan tage et billede (sættes af onCameraReady)
  const [kameraKlar, setKameraKlar] = useState(false);
  const [lommelygte, setLommelygte] = useState(false);
  // "klar" = kameraet vises, "laeser" = AI'en arbejder, "fejl" = noget gik galt
  const [status, setStatus] = useState("klar");
  const [fejlbesked, setFejlbesked] = useState("");
  // Er Scan-fanen den aktive skærm? Ellers slukkes kameraet (mønster fra 07)
  const erFokuseret = useIsFocused();

  // Når brugeren forlader skærmen, er kameraet ikke længere klar
  useEffect(() => {
    if (!erFokuseret) {
      setKameraKlar(false);
      setLommelygte(false);
    }
  }, [erFokuseret]);

  // Behandler et billede af en bon - uanset om det kommer fra kameraet eller galleriet:
  // send til AI -> tjek reglerne mod snyd -> vis resultatet til godkendelse.
  // base64 sendes til AI'en, mens uri (billedfilen på telefonen) sendes videre, så billedet
  // kan gemmes sammen med kvitteringen og vises igen senere.
  // Går noget galt, vises en venlig fejlbesked i stedet for, at appen går ned.
  async function behandlBillede(base64, uri) {
    setStatus("laeser");
    try {
      // 1. AI'en aflæser kvitteringen (al AI-kode ligger i services/ai.js)
      const resultat = await laesKvittering(base64);

      // 2. Er bonen scannet før, eller er den for gammel? (se tjekKvittering i AppContext)
      const problem = await tjekKvittering(resultat);
      if (problem) {
        setFejlbesked(problem);
        setStatus("fejl");
        return;
      }

      // 3. Vis resultatet til godkendelse. Intet er gemt endnu.
      setStatus("klar");
      navigation.navigate("GodkendKvittering", { resultat, billedeUri: uri });
    } catch (error) {
      setFejlbesked(error.message || "Noget gik galt. Prøv igen.");
      setStatus("fejl");
    }
  }

  // Udløseren: tag et billede med kameraet.
  // base64 er billedet som tekst, så det kan sendes til AI'en. Lav kvalitet giver et lille
  // billede, der sendes hurtigt, men stadig kan læses.
  async function tagBillede() {
    if (!cameraRef.current || !kameraKlar || status !== "klar") return;
    try {
      const billede = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.3 });
      await behandlBillede(billede.base64, billede.uri);
    } catch (error) {
      setFejlbesked("Billedet kunne ikke tages. Prøv igen.");
      setStatus("fejl");
    }
  }

  // Galleri: vælg et billede af en bon fra telefonens fotos (expo-image-picker).
  // Billedet behandles præcis som et billede fra kameraet.
  async function vaelgFraGalleri() {
    if (status !== "klar") return;
    try {
      const valg = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.3,
        base64: true,
      });
      // Brugeren fortrød og lukkede galleriet uden at vælge noget
      if (valg.canceled) return;
      await behandlBillede(valg.assets[0].base64, valg.assets[0].uri);
    } catch (error) {
      setFejlbesked("Billedet kunne ikke hentes fra dine fotos. Prøv igen.");
      setStatus("fejl");
    }
  }

  // Tilladelsen er ved at blive hentet
  if (!permission) {
    return <View style={GlobalStyle.scanSkaerm} />;
  }

  // Ingen kameratilladelse endnu: spørg brugeren (mønster fra 07)
  if (!permission.granted) {
    return (
      <SafeAreaView style={[GlobalStyle.scanSkaerm, GlobalStyle.scanCentreret]}>
        {erFokuseret ? <StatusBar style="light" /> : null}
        <View style={GlobalStyle.scanBeskedKort}>
          <View style={GlobalStyle.tomIkon}>
            <Ionicons name="camera-outline" size={28} color={Colors.primary} />
          </View>
          <Text style={GlobalStyle.tomTitel}>Kameraet skal bruges til at scanne</Text>
          <Text style={GlobalStyle.tomTekst}>
            Insight-Scan tager kun et billede af kvitteringen, når du trykker på knappen.
          </Text>
          <View style={GlobalStyle.tomHandling}>
            {/* Kan vi spørge igen, vises iOS' egen dialog. Ellers må brugeren åbne indstillinger. */}
            {permission.canAskAgain ? (
              <PrimaryButton label="Giv adgang til kameraet" onPress={requestPermission} />
            ) : (
              <PrimaryButton label="Åbn indstillinger" onPress={() => Linking.openSettings()} />
            )}
          </View>
          {!permission.canAskAgain ? (
            <Pressable onPress={getPermission} accessibilityRole="button">
              <Text style={GlobalStyle.linkTekst}>Jeg har givet adgang - tjek igen</Text>
            </Pressable>
          ) : null}
        </View>
        <Pressable onPress={() => navigation.navigate("Hjem")} accessibilityRole="button">
          <Text style={GlobalStyle.scanLukTekst}>Tilbage til Hjem</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <View style={GlobalStyle.scanSkaerm}>
      {erFokuseret ? <StatusBar style="light" /> : null}

      {/* Kameraet vises kun, mens skærmen er aktiv, så det slukkes igen bagefter.
          CameraView må ikke have børn, så knapperne ligger i et lag ovenpå (mønster fra 07). */}
      {erFokuseret ? (
        <CameraView
          ref={cameraRef}
          style={GlobalStyle.kamera}
          facing="back"
          enableTorch={lommelygte}
          onCameraReady={() => setKameraKlar(true)}
          onMountError={() => {
            setFejlbesked("Kameraet kunne ikke starte. Luk appen, og prøv igen.");
            setStatus("fejl");
          }}
        />
      ) : null}

      <SafeAreaView style={GlobalStyle.scanOverlay}>
        <View style={GlobalStyle.scanTopBar}>
          {/* Luk sender brugeren tilbage til Hjem */}
          <Pressable
            onPress={() => navigation.navigate("Hjem")}
            accessibilityRole="button"
            accessibilityLabel="Luk scanning"
            style={GlobalStyle.glasKnap}
          >
            <Ionicons name="close" size={20} color={Colors.text} />
          </Pressable>
          <View style={GlobalStyle.scanHint}>
            <Text style={GlobalStyle.scanHintTekst}>Aflæses af AI</Text>
          </View>
          {/* Lommelygten hjælper, når kvitteringen er svær at se */}
          <Pressable
            onPress={() => setLommelygte(!lommelygte)}
            accessibilityRole="button"
            accessibilityLabel={lommelygte ? "Sluk lommelygten" : "Tænd lommelygten"}
            style={[GlobalStyle.glasKnap, lommelygte && GlobalStyle.glasKnapAktiv]}
          >
            <Ionicons name={lommelygte ? "flash" : "flash-outline"} size={20} color={Colors.text} />
          </Pressable>
        </View>

        <View style={GlobalStyle.scanSoeger}>
          {status === "fejl" ? (
            // Fejl: venlig besked og mulighed for at prøve igen
            <View style={GlobalStyle.scanBeskedKort}>
              <View style={GlobalStyle.tomIkon}>
                <Ionicons name="alert-circle-outline" size={28} color={Colors.primary} />
              </View>
              <Text style={GlobalStyle.tomTitel}>Det lykkedes ikke</Text>
              <Text style={GlobalStyle.tomTekst}>{fejlbesked}</Text>
              <View style={GlobalStyle.tomHandling}>
                <PrimaryButton label="Prøv igen" onPress={() => setStatus("klar")} />
              </View>
            </View>
          ) : (
            <>
              {/* Rammen viser, hvor kvitteringen skal være */}
              <View style={GlobalStyle.scanRamme}>
                <View style={[GlobalStyle.hjoerne, GlobalStyle.hjoerneTopVenstre]} />
                <View style={[GlobalStyle.hjoerne, GlobalStyle.hjoerneTopHoejre]} />
                <View style={[GlobalStyle.hjoerne, GlobalStyle.hjoerneBundVenstre]} />
                <View style={[GlobalStyle.hjoerne, GlobalStyle.hjoerneBundHoejre]} />
                {status === "laeser" ? <ActivityIndicator size="large" color={Colors.onPrimary} /> : null}
              </View>
              <Text style={GlobalStyle.scanInstruktion}>
                {status === "laeser" ? "AI'en læser kvitteringen ..." : "Hold kvitteringen inden for rammen"}
              </Text>
            </>
          )}
        </View>

        <View style={GlobalStyle.scanKontroller}>
          {/* Galleri: vælg et billede, man allerede har taget af bonen */}
          <Pressable
            onPress={vaelgFraGalleri}
            disabled={status !== "klar"}
            accessibilityRole="button"
            accessibilityLabel="Vælg et billede af en kvittering fra dine fotos"
            style={({ pressed }) => [GlobalStyle.kontrolKolonne, (pressed || status !== "klar") && GlobalStyle.trykket]}
          >
            <View style={GlobalStyle.galleriKnap}>
              <Ionicons name="image-outline" size={22} color={Colors.text} />
            </View>
            <Text style={GlobalStyle.kontrolTekst}>Galleri</Text>
          </Pressable>

          {/* Udløseren tager billedet. Den er slået fra, indtil kameraet er klar,
              og mens AI'en arbejder, så man ikke kan tage flere billeder på én gang. */}
          <Pressable
            onPress={tagBillede}
            disabled={!kameraKlar || status !== "klar"}
            accessibilityRole="button"
            accessibilityLabel="Tag billede af kvitteringen"
            style={({ pressed }) => [
              GlobalStyle.udloeser,
              pressed && GlobalStyle.trykket,
              (!kameraKlar || status !== "klar") && GlobalStyle.deaktiveret,
            ]}
          >
            <View style={GlobalStyle.udloeserIndre} />
          </Pressable>

          <View style={GlobalStyle.kontrolPlads} />
        </View>
      </SafeAreaView>
    </View>
  );
}
