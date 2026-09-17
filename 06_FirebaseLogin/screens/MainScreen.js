import { View, Text, TouchableOpacity } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../database/database';
import GlobalStyles from '../style/GlobalStyle';

export default function MainScreen() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout fejlede:', error.message);
    }
  };

  const userEmail = auth.currentUser?.email;

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.welcome}>Hej {userEmail} 👋</Text>
      <Text style={GlobalStyles.subtitle}>Du er nu logget ind!</Text>

      <TouchableOpacity style={GlobalStyles.button} onPress={handleLogout}>
        <Text style={GlobalStyles.buttonText}>Log ud</Text>
      </TouchableOpacity>
    </View>
  );
}
