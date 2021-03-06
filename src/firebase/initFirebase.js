import firebase from "firebase/app";
// the below imports are option - comment out what you don't need
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";
import "firebase/performance";

const clientCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Stub method to ensure no console errors if
// firebase analytics doesn't init properly
let logEvent = () => {
  console.warn("Firebase Analytics not yet initialized");
};

export default function initFirebase() {
  // Alreay initialized
  if (firebase.apps.length) {
    return;
  }

  firebase.initializeApp(clientCredentials);
  // Check that `window` is in scope for the analytics module!
  if (typeof window === "undefined") {
    return;
  }

  // Enable analytics. https://firebase.google.com/docs/analytics/get-started
  if ("measurementId" in clientCredentials) {
    const analytics = firebase.analytics();
    logEvent = analytics.logEvent;
    firebase.performance();
  }
}

export { logEvent };
