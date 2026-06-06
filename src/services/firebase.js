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

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID
// };

console.log("DEBUG: Database URL is:", process.env.REACT_APP_FIREBASE_DATABASE_URL);
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app)