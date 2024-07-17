import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NODE_ENV === "development" ? import.meta.env.VITE_FIREBASE_API_KEY : process.env.FIREBASE_API_KEY,
  authDomain: "portfolio-7469a.firebaseapp.com",
  projectId: "portfolio-7469a",
  storageBucket: "portfolio-7469a.appspot.com",
  messagingSenderId: "527225927074",
  appId: "1:527225927074:web:fbf8f94445027230ecaefb"
}

const firebase = initializeApp(firebaseConfig)
const database = getFirestore(firebase)
const storage = getStorage(firebase)
const auth = getAuth(firebase)

export { database, storage, auth }