import * as Location from "expo-location";
import { useState, useCallback } from "react";
import { ActivityIndicator } from "react-native";
import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import GlobalStyles from "../style/GlobalStyles";

export default function Map() {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  // Startposition for kortet - København
  const [region, setRegion] = useState({
    latitude: 55.6761,
    longitude: 12.5683,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const styles = GlobalStyles.map;

  const getMarkers = async () => {
    try {
      const raw = await AsyncStorage.getItem("markers");
      const list = raw ? JSON.parse(raw) : [];
      setMarkers(list);

      // Flyt kortet til den senest gemte markør
      const latest = list.at(-1);
      if (latest) {
        setRegion((r) => ({
          ...r,
          latitude: latest.latitude,
          longitude: latest.longitude,
        }));
      }
      return list;
    } catch (e) {
      console.error("Error retrieving markers", e);
      return [];
    }
  };

  const getLocation = async (recenter) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const { coords } = await Location.getCurrentPositionAsync({});
      if (recenter) {
        setRegion((r) => ({
          ...r,
          latitude: coords.latitude,
          longitude: coords.longitude,
        }));
      }
    } catch (e) {
      console.error("Error retrieving location", e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setLoading(true);
        const list = await getMarkers();
        // Centrer kun på brugerens lokation hvis der ikke findes markører endnu
        await getLocation(list.length === 0);
        if (active) setLoading(false);
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region} // styrer kortets position
        onRegionChangeComplete={setRegion}
        showsUserLocation
        // Mulighed: long-press for at tilføje ny markør direkte på kortet
        onLongPress={(e) => {
          const { latitude, longitude } = e.nativeEvent.coordinate;
          const newMarker = {
            id: Date.now().toString(),
            latitude,
            longitude,
            title: "Drop pin",
          };
          const next = [...markers, newMarker];
          setMarkers(next);
          AsyncStorage.setItem("markers", JSON.stringify(next));
        }}
      >
        {/* Tegn alle markører på kortet */}
        {markers.map((m) => (
          <Marker
            key={m.id ?? `${m.latitude},${m.longitude}`}
            coordinate={{ latitude: m.latitude, longitude: m.longitude }}
            title={m.title ?? "Marker"}
            tracksViewChanges={false}
            pinColor="#FF0000"
          />
        ))}
      </MapView>
    </View>
  );
}
