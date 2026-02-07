import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBPJ-B-e2SVUrzJRq4ZcOPfbW1YxPddRvI",
    authDomain: "txaa-b3fb2.firebaseapp.com",
    databaseURL: "https://txaa-b3fb2-default-rtdb.firebaseio.com",
    projectId: "txaa-b3fb2",
    messagingSenderId: "275934450633",
    appId: "1:275934450633:web:3f0d97fa11b23bf51a0e18"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

export default app;
