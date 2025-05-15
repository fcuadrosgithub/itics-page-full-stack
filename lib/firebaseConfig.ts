import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDlkeXbIJXvfz05xbHV_Px9bsHjNbnWuPI",
  authDomain: "egresados-app.firebaseapp.com",
  projectId: "egresados-app",
  storageBucket: "egresados-app.appspot.com",
  messagingSenderId: "853139820207",
  appId: "1:853139820207:web:4ac04431493df3c1328e5a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
