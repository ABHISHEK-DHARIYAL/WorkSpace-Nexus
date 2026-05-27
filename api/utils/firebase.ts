import { initializeApp, cert, getApps } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

let db: any = null;

export async function getDb() {
  if (db) {
    return db;
  }

  const apps = getApps();
  if (apps.length === 0) {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    initializeApp({
      credential: cert(serviceAccount as any),
    });
  }

  db = getFirestore();
  return db;
}
