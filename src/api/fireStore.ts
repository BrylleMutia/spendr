import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsP5UceMkPE0MAqwisUD4V4S9ta8XtfOA",
  authDomain: "spendr-8b8c8.firebaseapp.com",
  projectId: "spendr-8b8c8",
  storageBucket: "spendr-8b8c8.appspot.com",
  messagingSenderId: "660462696798",
  appId: "1:660462696798:web:e8e3379acce6d219fdf7cf"
};

// Initialize Firebase
export const firebase = initializeApp(firebaseConfig);

export const firestoreDb = getFirestore(firebase);
