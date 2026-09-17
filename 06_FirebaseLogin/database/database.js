import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAa5ZKy76c03pPGTiDi9T4uL8Eyzin2cVg',
  authDomain: 'innt-projekt.firebaseapp.com',
  projectId: 'innt-projekt',
  storageBucket: 'innt-projekt.firebasestorage.app',
  messagingSenderId: '461144918927',
  appId: '1:461144918927:web:206691d42711a4eccdd9fa'
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
