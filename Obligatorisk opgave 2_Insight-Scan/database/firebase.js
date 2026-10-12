// database/firebase.js
// Al Firebase-opsætning samlet ét sted (mønster fra øvelse 05 og 06).
// Resten af appen importerer app, auth og rtdb herfra, så Firebase kun sættes op ét sted,
// og vi undgår at to filer importerer hinanden ("require cycle").

import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getDatabase } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Konfigurationen læses fra .env (se .env.example), så nøglerne hverken ligger i koden eller i git.
// Expo bygger EXPO_PUBLIC_-variabler ind i appen, når Metro starter. Det virker kun, når de
// skrives præcis som process.env.EXPO_PUBLIC_NAVN, så de må ikke hentes på andre måder.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Init kun én gang (mønster fra 05): findes Firebase-appen allerede, fx efter hot reload,
// genbruger vi den i stedet for at oprette en ny, som ville give fejl.
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Login (mønster fra 06): AsyncStorage gemmer login-status på telefonen,
// så brugeren forbliver logget ind, når appen lukkes og åbnes igen.
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Realtime Database (mønster fra 05): URL'en gives med, fordi databasen ligger
// i europe-west1 (Belgien) og ikke på Firebase' standardadresse.
export const rtdb = getDatabase(app, firebaseConfig.databaseURL);
