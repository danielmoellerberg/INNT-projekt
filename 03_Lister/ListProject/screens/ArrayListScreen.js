import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView } from "react-native";

import { COUNTRIES } from "../data/const";

export default function ArrayListScreen() {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, textAlign: "center", padding: 40 }}>
        KvartFinale lande - Array Map
      </Text>
      <View
        style={{
          height: 150,
          backgroundColor: "lightgrey",
          borderRadius: 10,
          width: "80%",
        }}
      >
        <ScrollView>
          {COUNTRIES.map((country, index) => {
            return (
              <Text
                key={index}
                style={{ fontSize: 15, textAlign: "center", padding: 10 }}
              >
                {country} er et godt land!
              </Text>
            );
          })}
        </ScrollView>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
