import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../database/database';
import GlobalStyles from '../style/GlobalStyle';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Bruger oprettet!');
    } catch (error) {
      Alert.alert('Fejl', error.message);
    }
  };

  return (
    <View style={GlobalStyles.componentsBox}>
      <Text style={GlobalStyles.title}>Opret bruger</Text>
      <TextInput
        placeholder="Email"
        style={GlobalStyles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Kodeord"
        style={GlobalStyles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={GlobalStyles.button} onPress={handleSignup}>
        <Text style={GlobalStyles.buttonText}>Opret bruger</Text>
      </TouchableOpacity>
    </View>
  );
}
