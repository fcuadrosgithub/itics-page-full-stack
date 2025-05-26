// lib/firebaseConfig.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDlkeXbIJXvfz05xbHV_Px9bsHjNbnWuPI",
  authDomain: "egresados-app.firebaseapp.com",
  projectId: "egresados-app",
  storageBucket: "egresados-app.appspot.com",
  messagingSenderId: "853139820207",
  appId: "1:853139820207:web:4ac04431493df3c1328e5a",
};

// Evitar reinicialización en modo desarrollo (Next.js puede reiniciar)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Exportar Firestore y Storage
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
