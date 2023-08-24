// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwWzTLAxDG5himDI3AuQweaUxuMT4yqUw",
  authDomain: "hikal-calendar-app.firebaseapp.com",
  projectId: "hikal-calendar-app",
  storageBucket: "hikal-calendar-app.appspot.com",
  messagingSenderId: "439673302779",
  appId: "1:439673302779:web:6c31bb7e74f60c8f680a5e",
  measurementId: "G-99PCL9HWWC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();