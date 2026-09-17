import { useState } from 'react';
import { View, Button } from 'react-native';
import GlobalStyles from '../style/GlobalStyle';
import Login from '../components/LogInComponent';
import Signup from '../components/SignUpComponent';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <View style={GlobalStyles.container}>
      {isLogin ? <Login /> : <Signup />}
      <View style={GlobalStyles.switchContainer}>
        <Button
          title={isLogin ? 'Har du ikke en konto? Opret en' : 'Har du en konto? Log ind'}
          onPress={() => setIsLogin(prev => !prev)}
        />
      </View>
    </View>
  );
}
