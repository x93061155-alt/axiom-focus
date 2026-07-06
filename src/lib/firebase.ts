import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAhL_XZ41NkN7-_RpnJcN-FWGl4AfqEMmc",
  authDomain: "gen-lang-client-0678153621.firebaseapp.com",
  projectId: "gen-lang-client-0678153621",
  storageBucket: "gen-lang-client-0678153621.firebasestorage.app",
  messagingSenderId: "442277541838",
  appId: "1:442277541838:web:0c0fedde187890218f1d9f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, "ai-studio-axiomfocus-c871657b-ca33-4738-97a5-da29b61d0f17");

