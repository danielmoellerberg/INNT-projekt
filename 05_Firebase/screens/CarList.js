import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { rtdb } from "../database/firebase";
import { ref, onValue } from "firebase/database";
import { GlobalStyle as GS } from "../styles/GlobalStyle";

export default function CarList({ navigation }) {
  const [biler, setBiler] = useState(null); // null = indlæser

  useEffect(() => {
    const carsRef = ref(rtdb, "Cars");
    const unsubscribe = onValue(carsRef, (snap) => {
      const data = snap.val();
      setBiler(data || {}); // gem som objekt (id -> bil)
    });
    return unsubscribe; // fjern lytter ved unmount
  }, []);

  if (biler === null) {
    return (
      <SafeAreaView style={GS.container}>
        <View style={GS.center}>
          <ActivityIndicator />
          <Text>Indlæser biler…</Text>
        </View>
      </SafeAreaView>
    );
  }

  const ids = Object.keys(biler);
  const liste = Object.values(biler);

  if (ids.length === 0) {
    return (
      <SafeAreaView style={GS.container}>
        <View style={GS.center}>
          <Text>Ingen biler endnu</Text>
        </View>
      </SafeAreaView>
    );
  }

  const vælgBil = (id) => {
    const bil = biler[id];
    navigation.navigate("Car Details", { car: [id, bil] });
  };

  return (
    <SafeAreaView style={GS.container}>
      <FlatList
        data={liste}
        keyExtractor={(_, i) => ids[i]}
        contentContainerStyle={GS.listeIndhold}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={GS.kort} onPress={() => vælgBil(ids[index])}>
            <Text style={GS.titel}>
              {item.brand || "Uden mærke"} {item.model ? `• ${item.model}` : ""}
            </Text>
            <Text>
              {item.year ? `År: ${item.year}` : ""}{" "}
              {item.licensePlate ? `• Nummerplade: ${item.licensePlate}` : ""}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
