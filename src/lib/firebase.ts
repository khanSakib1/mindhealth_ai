import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};

const hasRequiredFirebaseConfig = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

const app = hasRequiredFirebaseConfig
  ? (!getApps().length ? initializeApp(firebaseConfig) : getApp())
  : null;

const auth = app ? getAuth(app) : null;
const firestoreDb = app ? getFirestore(app) : null;

// Mock Firestore for environments where Firebase is not configured.
const mockDb = {
  collection: () => ({
    doc: () => ({
      get: async () => ({
        exists: () => false,
        data: () => ({}),
      }),
      set: async () => {},
      update: async () => {},
    }),
    add: async () => {},
    where: () => ({
      orderBy: () => ({
        limit: () => ({
          get: async () => ({
            docs: [],
          }),
        }),
        get: async () => ({
          docs: [],
        }),
      }),
    }),
  }),
};

if (!hasRequiredFirebaseConfig) {
  console.warn("Firebase configuration is missing. Running with mock data.");
}

if (typeof window !== "undefined" && firestoreDb) {
  enableIndexedDbPersistence(firestoreDb).catch((err) => {
    if (err.code == "failed-precondition") {
      console.warn("Firebase persistence failed: multiple tabs open.");
    } else if (err.code == "unimplemented") {
      console.warn("Firebase persistence not available in this browser.");
    }
  });
}

const db = firestoreDb ?? (mockDb as any);

export { app, auth, db, hasRequiredFirebaseConfig };
