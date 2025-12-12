import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Mock Firestore for server-side
const mockDb = {
    collection: () => ({
        doc: () => ({
            get: async () => ({
                exists: () => false,
                data: () => ({})
            }),
            set: async () => {},
            update: async () => {}
        }),
        add: async () => {},
        where: () => ({
            orderBy: () => ({
                limit: () => ({
                    get: async () => ({
                        docs: []
                    })
                }),
                get: async () => ({
                    docs: []
                })
            })
        })
    })
};

const firestore = typeof window === 'undefined' ? mockDb : db;

if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a time.
      console.warn('Firebase persistence failed: multiple tabs open.');
    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      console.warn('Firebase persistence not available in this browser.');
    }
  });
}

export { app, auth, firestore as db };
