import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import ButtonComponent from '../components/ButtonComponents';

const navController = (navigation, route) => {
  navigation.navigate(route)
}

export default function DetailsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ButtonComponent onPress ={()=>navController(navigation,'User Profile')} title="User Profile"/>
      <ButtonComponent onPress ={()=>navController(navigation,'App Details')} title="App Details"/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
