
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// CONFIGURAÇÃO DO FIREBASE
// Em um projeto real, estas variáveis deveriam estar em um arquivo .env
// Para este exemplo funcionar, estamos usando uma configuração pública de demonstração
// VOCÊ DEVE SUBSTITUIR ISSO PELAS SUAS PRÓPRIAS CREDENCIAIS DO FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDD1MnxiX69T4t--WY8bnNtMaNx_UZknSY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "app-habitos-diarios.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://app-habitos-diarios-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "app-habitos-diarios",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "app-habitos-diarios.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "338926691234",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:338926691234:web:9d506a74057b00793008fb",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-Y1TXFW1B73"
};

// Inicializa apenas se houver configuração válida, senão avisa no console
let app;
let db: any;

try {
    // Mock para evitar erro se o usuário não configurar, permitindo que o app funcione offline (apenas local)
    if (firebaseConfig.apiKey === "API_KEY_NAO_DEFINIDA") {
        console.warn("Firebase não configurado. O modo de sincronização não funcionará até que você adicione suas credenciais em firebase.ts");
    } else {
        app = initializeApp(firebaseConfig);
        db = getDatabase(app, firebaseConfig.databaseURL);
    }
} catch (e) {
    console.error("Erro ao inicializar Firebase:", e);
}

export { db };
