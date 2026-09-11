import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useState, useEffect } from "react";

import { GET_USERS_URL } from "../data/const";

export default function FetchListScreen() {
  const [user, setUser] = useState([]);
  const [msg, setMsg] = useState("");
  const [amount, setAmount] = useState(2);

  const loadUsers = async () => {
    try {
      const response = await fetch(GET_USERS_URL + amount);
      if (!response.ok) {
        throw new Error("Kunne ikke hente brugere");
      }
      const data = await response.json();
      setUser(data.results);
      setMsg("");
    } catch (error) {
      setMsg("Der skete en fejl: " + error.message);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [amount]);

  return user.length > 0 ? (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Text style={{ fontSize: 20, textAlign: "center", padding: 40 }}>
          Brugere i liste: {user.length} - Fetch Object list
        </Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={amount.toString()}
          onChangeText={(text) => setAmount(Number(text) || 0)}
        />
        <View
          style={{
            height: 350,
            backgroundColor: "lightgrey",
            borderRadius: 10,
            width: "80%",
          }}
        >
          <ScrollView>
            {user.map((item) => {
              return (
                <View key={item.login.uuid} style={styles.userRow}>
                  <Image
                    source={{ uri: item.picture.thumbnail }}
                    style={styles.avatar}
                  />
                  <Text style={{ fontSize: 15, padding: 10 }}>
                    {item.name.first} {item.name.last}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
        <Text>{msg ? msg : ""}</Text>
        <StatusBar style="auto" />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  ) : (
    <View style={styles.container}>
      <Text>Loading...</Text>
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
  input: {
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 5,
    width: "40%",
    padding: 8,
    marginBottom: 20,
    textAlign: "center",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
