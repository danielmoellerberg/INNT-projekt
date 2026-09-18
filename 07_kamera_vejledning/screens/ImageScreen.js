import React from 'react';
import { View, Image, Text } from 'react-native';
import GlobalStyle from '../style/GlobalStyle';

export default function ImageScreen({ route }) {
  const { image } = route.params || {};

  return (
    <View style={GlobalStyle.container}>
      {image ? (
        <Image source={{ uri: image }} style={GlobalStyle.img} />
      ) : (
        <Text style={GlobalStyle.text}>Intet billede valgt</Text>
      )}
    </View>
  );
}
