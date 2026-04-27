import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBacUnyeDLtPmbGjBGriRESGsB2wH_Tm-U",
  authDomain: "prepwise-ai-447f7.firebaseapp.com",
  projectId: "prepwise-ai-447f7",
  storageBucket: "prepwise-ai-447f7.firebasestorage.app",
  messagingSenderId: "262584652822",
  appId: "1:262584652822:web:79d337ecf82137500d1137"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();