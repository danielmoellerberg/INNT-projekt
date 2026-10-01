import { Text, View, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import GlobalStyles from "../style/GlobalStyles";

export default function Home({ navigation }) {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [markers, setMarkers] = useState([]);

  // Tjekker at begge koordinater er tal, og at de ligger inden for gyldigt område
  const isValidCoord = (lat, lon) =>
    !isNaN(lat) &&
    !isNaN(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180;

  const addAndSaveMarker = async () => {
    const lat = parseFloat(latitude.replace(",", ".")); // konverter string → float
    const lon = parseFloat(longitude.replace(",", "."));
    if (!isValidCoord(lat, lon)) {
      Alert.alert("Ugyldige koordinater");
      return;
    }

    const newMarker = {
      id: Date.now().toString(),
      latitude: lat,
      longitude: lon,
      title: "Custom",
    };

    const updatedMarkers = [...markers, newMarker]; // tilføj til listen
    setMarkers(updatedMarkers);
    setLatitude("");
    setLongitude("");

    try {
      // Gem hele listen af markører i AsyncStorage
      await AsyncStorage.setItem("markers", JSON.stringify(updatedMarkers));
      navigation.navigate("Map"); // skift til Map-tab
    } catch (error) {
      console.error("Error saving markers", error);
    }
  };

  const styles = GlobalStyles.home;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#fff" }]}>
      <View style={styles.bcg}>
        {/* Logo hentet fra assets */}
        <Image source={require("../assets/logo.png")} style={styles.logo} />

        {/* Titel */}
        <Text style={styles.title}>INNT Map App</Text>

        {/* Inputfelter til latitude/longitude */}
        <TextInput
          style={styles.input}
          value={latitude}
          onChangeText={setLatitude}
          placeholder="latitude (-90 to 90)"
          keyboardType="decimal-pad"
          returnKeyType="next"
        />
        <TextInput
          style={styles.input}
          value={longitude}
          onChangeText={setLongitude}
          placeholder="longitude (-180 to 180)"
          keyboardType="decimal-pad"
        />

        {/* Knap til at gemme og hoppe til kortet */}
        <TouchableOpacity style={styles.button} onPress={addAndSaveMarker}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
