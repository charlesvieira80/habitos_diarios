
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// CONFIGURAÇÃO DO FIREBASE
// Em um projeto real, estas variáveis deveriam estar em um arquivo .env
// Para este exemplo funcionar, estamos usando uma configuração pública de demonstração
// VOCÊ DEVE SUBSTITUIR ISSO PELAS SUAS PRÓPRIAS CREDENCIAIS DO FIREBASE CONSOLE
const firebaseConfig = {
  // Substitua as credenciais abaixo pelas do seu projeto no Firebase Console (https://console.firebase.google.com/)
  // Crie um projeto -> Adicione um App Web -> Copie as configs
  apiKey: "AIzaSyDD1MnxiX69T4t--WY8bnNtMaNx_UZknSY",
  authDomain: "app-habitos-diarios.firebaseapp.com",
  databaseURL: "https://app-habitos-diarios-default-rtdb.firebaseio.com",
  projectId: "app-habitos-diarios",
  storageBucket: "app-habitos-diarios.firebasestorage.app",
  messagingSenderId: "338926691234",
  appId: "1:338926691234:web:9d506a74057b00793008fb",
  measurementId: "G-Y1TXFW1B73"
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
