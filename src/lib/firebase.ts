import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  Auth
} from 'firebase/auth';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  measurementId?: string;
}

// User-provided official production Firebase project configuration
export const DEFAULT_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: "AIzaSyAElrz-2vXTOBwC5NXvPeNp72zuM80KZrE",
  authDomain: "python-with-dsa.firebaseapp.com",
  projectId: "python-with-dsa",
  storageBucket: "python-with-dsa.firebasestorage.app",
  messagingSenderId: "39554569241",
  appId: "1:39554569241:web:a1e623443a881cfaa80688",
  measurementId: "G-VY5X1WRDCK"
};

const STORAGE_KEY = 'kapil_firebase_config';

export function getStoredFirebaseConfig(): FirebaseConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function saveFirebaseConfig(cfg: FirebaseConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
}

export function clearFirebaseConfig() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getActiveFirebaseConfig(): FirebaseConfig {
  const custom = getStoredFirebaseConfig();
  if (custom && custom.apiKey && custom.projectId) {
    return custom;
  }

  const env = (import.meta as any).env || {};
  return {
    apiKey: env.VITE_FIREBASE_API_KEY || DEFAULT_FIREBASE_CONFIG.apiKey,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || DEFAULT_FIREBASE_CONFIG.authDomain,
    projectId: env.VITE_FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_CONFIG.projectId,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || DEFAULT_FIREBASE_CONFIG.storageBucket,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || DEFAULT_FIREBASE_CONFIG.messagingSenderId,
    appId: env.VITE_FIREBASE_APP_ID || DEFAULT_FIREBASE_CONFIG.appId,
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || DEFAULT_FIREBASE_CONFIG.measurementId
  };
}

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;

export function getFirebaseAuth(): Auth | null {
  const cfg = getActiveFirebaseConfig();
  if (!cfg.apiKey || !cfg.projectId) {
    return null;
  }

  try {
    if (!appInstance) {
      if (!getApps().length) {
        appInstance = initializeApp(cfg);
      } else {
        appInstance = getApp();
      }
    }
    if (!authInstance && appInstance) {
      authInstance = getAuth(appInstance);
    }
    return authInstance;
  } catch (err) {
    console.error('Firebase initialization error:', err);
    return null;
  }
}

export interface GoogleAuthResult {
  email: string;
  name: string;
  photo: string;
  googleId: string;
  idToken?: string;
}

export async function loginWithFirebaseGoogle(): Promise<GoogleAuthResult> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Firebase Authentication is not initialized.');
  }

  const provider = new GoogleAuthProvider();
  provider.addScope('email');
  provider.addScope('profile');
  provider.setCustomParameters({ prompt: 'select_account' });

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const idToken = await user.getIdToken().catch(() => undefined);

    return {
      email: user.email || '',
      name: user.displayName || (user.email ? user.email.split('@')[0] : 'Learner'),
      photo: user.photoURL || '',
      googleId: user.uid,
      idToken
    };
  } catch (err: any) {
    console.warn('Firebase signInWithPopup error code:', err?.code, err);
    
    // Provide explicit, user-friendly error diagnostics
    if (err?.code === 'auth/unauthorized-domain') {
      const currentHost = window.location.hostname;
      const error = new Error(
        `Firebase Error: The domain "${currentHost}" is not yet added to your Firebase Authorized Domains.\n\nTo enable this domain:\n1. Open console.firebase.google.com\n2. Select "python-with-dsa"\n3. Go to Build > Authentication > Settings > Authorized domains\n4. Click "Add domain" and add "${currentHost}".`
      );
      (error as any).code = 'auth/unauthorized-domain';
      (error as any).host = currentHost;
      throw error;
    }

    if (err?.code === 'auth/popup-blocked') {
      const error = new Error('Popup blocked by browser. Please allow popups for this site or use the direct Google sign-in below.');
      (error as any).code = 'auth/popup-blocked';
      throw error;
    }

    if (err?.code === 'auth/popup-closed-by-user') {
      const error = new Error('Google Sign-In popup was closed before completing authentication.');
      (error as any).code = 'auth/popup-closed-by-user';
      throw error;
    }

    throw err;
  }
}

export async function checkFirebaseRedirectResult(): Promise<GoogleAuthResult | null> {
  const auth = getFirebaseAuth();
  if (!auth) return null;

  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      const user = result.user;
      const idToken = await user.getIdToken().catch(() => undefined);
      return {
        email: user.email || '',
        name: user.displayName || (user.email ? user.email.split('@')[0] : 'Learner'),
        photo: user.photoURL || '',
        googleId: user.uid,
        idToken
      };
    }
  } catch (err) {
    console.warn('Firebase getRedirectResult error:', err);
  }
  return null;
}

export async function logoutFromFirebase(): Promise<void> {
  const auth = getFirebaseAuth();
  if (auth && auth.currentUser) {
    await firebaseSignOut(auth).catch(() => {});
  }
}
