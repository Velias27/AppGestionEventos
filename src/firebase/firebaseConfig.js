import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCrMHDWDJ_geZPqdAMDBRhvDYpOI44tD0g",
  authDomain: "eventoscomunitariosapp.firebaseapp.com",
  projectId: "eventoscomunitariosapp",
  storageBucket: "eventoscomunitariosapp.firebasestorage.app",
  messagingSenderId: "635678680380",
  appId: "1:635678680380:web:ec345ce1caed700c97aa39"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);