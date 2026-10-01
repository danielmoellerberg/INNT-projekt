import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { addBook } from '../components/Library';
import styles from '../style/CameraScreenStyle';

export default function CameraScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!permission || !permission.granted) requestPermission();
  }, [permission]);

  const takePhoto = async () => {
    if (cameraRef.current && !busy) {
      setBusy(true);
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.9 });
      const saved = await addBook(photo.uri);
      navigation.goBack();
      setBusy(false);
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text>Kamera-adgang kræves</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Giv tilladelse</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={StyleSheet.absoluteFill} ref={cameraRef} />
      <TouchableOpacity style={styles.shutter} onPress={takePhoto}>
        <Text style={styles.shutterIcon}>📷</Text>
      </TouchableOpacity>
    </View>
  );
}
