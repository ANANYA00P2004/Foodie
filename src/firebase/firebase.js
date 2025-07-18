// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5qDj4EVCeUEWLrIZ2emBQZjR3KpJdBo8",
  authDomain: "foodie-dd2b1.firebaseapp.com",
  projectId: "foodie-dd2b1",
  storageBucket: "foodie-dd2b1.appspot.com",
  messagingSenderId: "1000267807083",
  appId: "1:1000267807083:web:516455e9827806d031f42e",
  measurementId: "G-5PZDRK2CYH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };