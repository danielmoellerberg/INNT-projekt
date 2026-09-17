import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../database/database';
import GlobalStyles from '../style/GlobalStyle';

// Login funktion
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // handleLogin metode
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      Alert.alert('Fejl', error.message);
    }
  };

  // return
  return (
    <View style={GlobalStyles.componentsBox}>
      <Text style={GlobalStyles.title}>Log ind</Text>
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
      <TouchableOpacity style={GlobalStyles.button} onPress={handleLogin}>
        <Text style={GlobalStyles.buttonText}>Log ind</Text>
      </TouchableOpacity>
    </View>
  );
}
