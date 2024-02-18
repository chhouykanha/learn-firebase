// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, serverTimestamp  } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfkoxmpCjv0QBuHFUEJxsFtJT6CVhmURA",
  authDomain: "learn-firebase-9b082.firebaseapp.com",
  projectId: "learn-firebase-9b082",
  storageBucket: "learn-firebase-9b082.appspot.com",
  messagingSenderId: "760185711022",
  appId: "1:760185711022:web:f9f35db0a30b6dd4ca003f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const projectFirestore = getFirestore(app);
const auth = getAuth(app);
const projectStorage = getStorage(app);

const timeStamp = serverTimestamp();

export {projectFirestore, auth, projectStorage, timeStamp};