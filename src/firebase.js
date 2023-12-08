import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyATcOfqj9jgF3HQRwgoIiryOy0OIrD2F2w",
  authDomain: "neastlist.firebaseapp.com",
  projectId: "neastlist",
  storageBucket: "neastlist.appspot.com",
  messagingSenderId: "551996804214",
  appId: "1:551996804214:web:273198731d33c43b67e357",
  measurementId: "G-BDPKHZH0N6"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);   
export const db = getFirestore(app);