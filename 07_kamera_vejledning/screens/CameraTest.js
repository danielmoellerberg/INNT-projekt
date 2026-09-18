import React, { useState, useRef, useEffect } from 'react';
import {
  Alert,
  Button,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Linking,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import GlobalStyle from '../style/GlobalStyle';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function CameraTest({ navigation }) {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission, getPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const isFocused = useIsFocused();
  const [imagesArr, setImagesArr] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gallery, setGallery] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!isFocused) {
      setCameraReady(false);
    }
  }, [isFocused]);

  if (!permission) return <View style={GlobalStyle.container} />;

  if (!permission.granted) {
    return (
      <SafeAreaView style={GlobalStyle.container}>
        <Text style={GlobalStyle.text}>Appen skal have adgang til kameraet.</Text>
        {permission.canAskAgain ? (
          <Button onPress={requestPermission} title="Giv kameratilladelse" />
        ) : (
          <>
            <Text style={GlobalStyle.text}>
              Aktivér kamera i indstillingerne. Vend tilbage, og tjek tilladelsen igen.
            </Text>
            <Button onPress={() => Linking.openSettings()} title="Åbn indstillinger" />
            <Button onPress={getPermission} title="Tjek tilladelse igen" />
          </>
        )}
      </SafeAreaView>
    );
  }

  function toggleFacing() {
    if (loading) return;
    setCameraReady(false);
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  }

  async function snap() {
    if (!cameraRef.current || !cameraReady || loading || !isFocused) return;
    try {
      setLoading(true);
      const result = await cameraRef.current.takePictureAsync();
      setImagesArr((prev) => [...prev, result]);
    } catch (err) {
      console.log('Snap error:', err);
      Alert.alert('Billedet kunne ikke tages', 'Vent et øjeblik, og prøv igen.');
    } finally {
      setLoading(false);
    }
  }

  function toggleGallery() {
    setGallery((prev) => !prev);
  }

  const CameraGallery = () => (
    <View style={GlobalStyle.gallery}>
      <Text style={GlobalStyle.text}>Billeder taget: {imagesArr.length}</Text>
      <ScrollView horizontal>
        {imagesArr.length > 0 ? (
          imagesArr.map((image, index) => (
            <TouchableOpacity
              key={index}
              disabled={loading}
              onPress={() => navigation.navigate('image', { image: image.uri })}
            >
              <Image source={{ uri: image.uri }} style={{ width: 80, height: 80 }} />
            </TouchableOpacity>
          ))
        ) : (
          <Text style={GlobalStyle.text}>Der er endnu ikke taget billeder.</Text>
        )}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={GlobalStyle.safeview}>
      <View style={GlobalStyle.container}>
        <View style={GlobalStyle.cameraContainer}>
          {isFocused && (
            <CameraView
              key={facing}
              ref={cameraRef}
              style={GlobalStyle.camera}
              facing={facing}
              onCameraReady={() => setCameraReady(true)}
              onMountError={() => {
                setCameraReady(false);
                Alert.alert('Kameraet kunne ikke starte', 'Kontrollér kameratilladelsen, og åbn appen igen.');
              }}
            />
          )}
          <View style={GlobalStyle.buttonContainer}>
            {/* Flip kamera */}
            <TouchableOpacity
              style={[GlobalStyle.btn, loading && GlobalStyle.disabled]}
              disabled={loading}
              onPress={toggleFacing}
              accessibilityLabel="Skift kamera"
            >
              <Ionicons name="camera-reverse-outline" size={32} color="#fff" />
            </TouchableOpacity>

            {/* Tag billede */}
            <TouchableOpacity
              style={[GlobalStyle.snapbtn, (!cameraReady || loading) && GlobalStyle.disabled]}
              disabled={!cameraReady || loading}
              onPress={snap}
              accessibilityLabel="Tag billede"
            >
              <Text style={GlobalStyle.text}>{loading ? '...' : 'Foto'}</Text>
            </TouchableOpacity>

            {/* Toggle galleri */}
            <TouchableOpacity
              style={[GlobalStyle.btn, loading && GlobalStyle.disabled]}
              disabled={loading}
              onPress={toggleGallery}
              accessibilityLabel="Vis eller skjul galleri"
            >
              <Ionicons name="images-outline" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        {gallery ? <CameraGallery /> : null}
      </View>
    </SafeAreaView>
  );
}
