import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, FlatList } from "react-native";

import { CARS } from "../data/const";

export default function FlatListScreen() {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, textAlign: "center", padding: 40 }}>
        Mine biler - Flatlist
      </Text>
      <View
        style={{
          height: 150,
          backgroundColor: "lightgrey",
          borderRadius: 10,
          width: "80%",
        }}
      >
        <FlatList
          data={CARS}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <Text style={{ fontSize: 15, textAlign: "center", padding: 10 }}>
                {item}
              </Text>
            );
          }}
        />
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
