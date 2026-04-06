import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // ✅ ADD THIS

const firebaseConfig = {
  apiKey: "AIzaSyBLY2xqTGhznifhMSMetEgbNpRva40gLZY",
  authDomain: "taskora-auth.firebaseapp.com",
  projectId: "taskora-auth",
  storageBucket: "taskora-auth.appspot.com", 
  messagingSenderId: "844175873919",
  appId: "1:844175873919:web:aff5940c04047bd84a2c4a"
};

const app = initializeApp(firebaseConfig);

// ✅ EXPORT AUTH (VERY IMPORTANT)
export const auth = getAuth(app);