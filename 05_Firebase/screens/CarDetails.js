import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { rtdb } from "../database/firebase";
import { ref, remove } from "firebase/database";
import { GlobalStyle as GS } from "../styles/GlobalStyle";

const labels = {
  brand: "Mærke",
  model: "Model",
  year: "År",
  licensePlate: "Nummerplade",
};

export default function CarDetails({ navigation, route }) {
  const [bil, setBil] = useState(null);
  const id = route?.params?.car?.[0];
  const data = route?.params?.car?.[1];

  useEffect(() => {
    setBil(data ?? null);
    return () => setBil(null);
  }, []);

  const rediger = () => navigation.navigate("Edit Car", { car: [id, bil] });

  const slet = async () => {
    try {
      await remove(ref(rtdb, `Cars/${id}`));
      navigation.goBack();
    } catch (e) {
      Alert.alert(e?.message || "Noget gik galt.");
    }
  };

  const bekræftSlet = () => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      Alert.alert("Er du sikker?", "Vil du slette bilen?", [
        { text: "Annuller", style: "cancel" },
        { text: "Slet", style: "destructive", onPress: slet },
      ]);
    } else {
      const ok = window.confirm("Vil du slette bilen?");
      if (ok) slet();
    }
  };

  if (!bil) {
    return (
      <SafeAreaView style={GS.container}>
        <View style={GS.center}>
          <Text>Ingen data</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={GS.container}>
      <ScrollView contentContainerStyle={GS.skærmIndhold}>
        {Object.entries(bil).map(([nøgle, værdi]) => (
          <View style={GS.kort} key={nøgle}>
            <Text style={GS.etiket}>{labels[nøgle] ?? nøgle}</Text>
            <Text style={GS.værdi}>{String(værdi)}</Text>
          </View>
        ))}

        <View style={{ height: 12 }} />
        <Button title="Redigér" onPress={rediger} />
        <View style={{ height: 8 }} />
        <Button title="Slet" color="#d33" onPress={bekræftSlet} />
      </ScrollView>
    </SafeAreaView>
  );
}
