import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import type { FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; 
import type { Firestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';
import { browser } from '$app/environment';

export let db: Firestore;
export let app: FirebaseApp;
export let auth: Auth;


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  useEmulator: import.meta.env.VITE_FIREBASE_USE_EMULATOR === 'true',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

export const initializeFirebase = () => {
  if (!browser) {
    throw new Error("Can't use the Firebase client on the server.");
  }
  if (!app) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    
  }
};



