import {initializeApp} from "firebase/app";
import {getDatabase} from  "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAj2_N3HQTaMBGymQXQoPekoBoB7y2vn5Y",
  authDomain: "fga-verse-broadcasting.firebaseapp.com",
  databaseURL: "https://fga-verse-broadcasting-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fga-verse-broadcasting",
  storageBucket: "fga-verse-broadcasting.firebasestorage.app",
  messagingSenderId: "462617804184",
  appId: "1:462617804184:web:531df52110acf690c7bfed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app)