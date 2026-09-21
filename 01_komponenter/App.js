import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import FirstComponent from './components/FirstComponent';
import InputComponent from './components/InputComponent';
import ButtonComponent from './components/ButtonComponent';
import AssetComponent from './components/AssetComponent';
import PropsComponent from './components/PropsComponent';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={{flex: 1, backgroundColor: 'lightblue', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
        <FirstComponent />
      </View>

      <View style={{flex: 1, backgroundColor: 'lightgray', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
        <InputComponent />
      </View>

      <View style={{flex: 4, backgroundColor: 'blue', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
        <AssetComponent url={require('./assets/favicon.png')} />
      </View>

      <View style={{flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
        <ButtonComponent />
      </View>

      <View style={{flex: 1, backgroundColor: 'gray', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
        <PropsComponent name="React Native Elev" />
      </View>

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
    paddingTop: 50
  },
});
