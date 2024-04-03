// Import the functions you need from the SDKs you need
//import { browser } from '$app/environment';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdBWL67tGkQ9sVQ8GEn-V7VuxacXP4ddY",
  authDomain: "footyfriend-47a09.firebaseapp.com",
  projectId: "footyfriend-47a09",
  storageBucket: "footyfriend-47a09.appspot.com",
  messagingSenderId: "854785181568",
  appId: "1:854785181568:web:18586b73a9b940654ae365",
  measurementId: "G-43YHFYZXVM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
