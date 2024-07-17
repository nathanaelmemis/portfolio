import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC2nx7W_T_-0aunXJn7NbonjfcA0R6iVK8",
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