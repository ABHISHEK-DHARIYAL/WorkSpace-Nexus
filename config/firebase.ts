/// <reference types="vite/client" />
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfigJson from '../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
  measurementId: firebaseConfigJson.measurementId,
};

// Initialize Firebase App only if keys are present (lazy/fail-safe)
const isConfigured = !!firebaseConfig.apiKey && firebaseConfig.apiKey !== "remixed-api-key";

const app = isConfigured 
  ? (getApps().length > 0 ? getApp() : initializeApp(firebaseConfig))
  : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app, firebaseConfigJson.firestoreDatabaseId) : null;
export const storage = app ? getStorage(app) : null;

if (db) {
  enableIndexedDbPersistence(db).catch((err) => {
    console.warn("Firestore client offline persistent cache activation warning:", err.message);
  });
}

export default app;
