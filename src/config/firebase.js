import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDC1e1WZoWE7D2Lo_Sl-9zTEFxSi8MEGjk",
    authDomain: "react-chat-app-6bce5.firebaseapp.com",
    projectId: "react-chat-app-6bce5",
    storageBucket: "react-chat-app-6bce5.appspot.com",
    messagingSenderId: "172174643739",
    appId: "1:172174643739:web:edfafbd69a6dd0c9ae5ebe",
    measurementId: "G-2C590R0GQ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)