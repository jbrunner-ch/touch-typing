import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDi6uwqVQhUsaA_8gW_vht92cMVJRmmVyo',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'tippmeister-ch-2026.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'tippmeister-ch-2026',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'tippmeister-ch-2026.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '745790228587',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:745790228587:web:fd85444187006b787f492e',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});
export const db = getFirestore(app);
