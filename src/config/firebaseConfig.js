import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBCMzr6kSr_MwTy2fgTiI7ZCh3p1XkruYA",
  authDomain: "musicapp-fuchoachu.firebaseapp.com",
  projectId: "musicapp-fuchoachu",
  storageBucket: "musicapp-fuchoachu.firebasestorage.app",
  messagingSenderId: "398598335148",
  appId: "1:398598335148:web:62fc4258105570c2f74d09",
  measurementId: "G-Q3XK8X6Y2R"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };