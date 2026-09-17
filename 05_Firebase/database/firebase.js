// database/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Indsæt din egen config her fra Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyAa5ZKy76c03pPGTiDi9T4uL8Eyzin2cVg",
  authDomain: "innt-projekt.firebaseapp.com",
  projectId: "innt-projekt",
  storageBucket: "innt-projekt.firebasestorage.app",
  messagingSenderId: "461144918927",
  appId: "1:461144918927:web:206691d42711a4eccdd9fa",
};

// Init kun én gang
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Brug RTDB-URL'en fra Realtime Database (Belgium = europe-west1)
export const rtdb = getDatabase(
  firebaseApp,
  "https://innt-projekt-default-rtdb.europe-west1.firebasedatabase.app"
);
