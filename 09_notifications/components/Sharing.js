import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Alert, Share } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Sharing from 'expo-sharing';
import styles from '../style/BookCardStyle';

export default function BookCard({ item, index }) {
  const doShare = async () => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(item.uri);
        return;
      }
      await Share.share({
        message: 'Se min bog i BookBuddy 📚',
        url: item.uri,
      });
    } catch (e) {
      Alert.alert('Kunne ikke dele', e.message);
    }
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 150).springify()}
      style={styles.card}
    >
      <Image source={{ uri: item.uri }} style={styles.img} />
      <Text style={styles.cardTitle}>Min bog #{item.id}</Text>

      <TouchableOpacity style={styles.shareBtn} onPress={doShare}>
        <Text style={styles.shareBtnText}>Del</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
