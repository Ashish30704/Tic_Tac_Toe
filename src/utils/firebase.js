import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// You need to replace these with your own Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA-K67faUNRA-z26KO-mVIL6dR0IprFLXM",
  // authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "tic-tac-toe-a8aa0",
  storageBucket: "tic-tac-toe-a8aa0.firebasestorage.app",
  messagingSenderId: "483600784847",
  appId: "1:483600784847:android:258c56912b5614bfc146ba"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }; 