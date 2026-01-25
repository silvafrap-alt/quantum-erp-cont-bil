import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBLmbUo3Ggj2mcmrpSnf3iKe1dZJCa3YzQ",
  authDomain: "quantum-saas-3d886.firebaseapp.com",
  projectId: "quantum-saas-3d886",
  storageBucket: "quantum-saas-3d886.firebasestorage.app",
  messagingSenderId: "210591235916",
  appId: "1:210591235916:web:34b128f29b7e564f1199e9",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
