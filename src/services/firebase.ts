import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { StudentProfile } from '../types/curriculum';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore with custom databaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Auth Providers
const googleProvider = new GoogleAuthProvider();

// Sign In with Google
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await syncUserProfile(result.user);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/unauthorized-domain') {
      const domain = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
      throw new Error(`Domain Unauthorized: "${domain}" is not authorized in Firebase Console. Please sign in using Email & Password below, or add "${domain}" to Authorized Domains in Firebase Authentication Settings.`);
    }
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in popup was closed before completion. Please try again.');
    }
    if (error.code === 'auth/popup-blocked') {
      throw new Error('Sign-in popup was blocked by browser. Please allow popups or sign in with Email.');
    }
    console.error('Google Sign In Error:', error);
    throw error;
  }
};

// Sign In with Email & Password
export const loginWithEmail = async (email: string, pass: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    await syncUserProfile(result.user);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      throw new Error('Invalid email or password. If you don\'t have an account yet, switch to "Create New Account".');
    }
    if (error.code === 'auth/invalid-email') {
      throw new Error('Please enter a valid email address.');
    }
    if (error.code === 'auth/too-many-requests') {
      throw new Error('Access temporarily restricted due to many failed attempts. Please try again later.');
    }
    if (error.code === 'auth/operation-not-allowed') {
      throw new Error('Email/Password sign-in is not enabled in Firebase Console Authentication.');
    }
    throw new Error(error.message || 'Failed to sign in.');
  }
};

// Register with Email & Password
export const registerWithEmail = async (email: string, pass: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    await syncUserProfile(result.user);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('This email is already registered. Please click "Already registered? Sign In" below.');
    }
    if (error.code === 'auth/weak-password') {
      throw new Error('Password must be at least 6 characters long.');
    }
    if (error.code === 'auth/invalid-email') {
      throw new Error('Please enter a valid email address.');
    }
    if (error.code === 'auth/operation-not-allowed') {
      throw new Error('Email/Password registration is not enabled in Firebase Console Authentication.');
    }
    throw new Error(error.message || 'Failed to create account.');
  }
};

// Guest / Anonymous Auth
export const loginAnonymously = async () => {
  try {
    const result = await signInAnonymously(auth);
    await syncUserProfile(result.user);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/admin-restricted-operation') {
      console.warn('Anonymous sign-in is disabled in Firebase Console.');
      throw new Error('Anonymous guest sign-in is disabled on this project. Please sign in with Google or Email.');
    }
    if (error.code === 'auth/network-request-failed') {
      console.warn('Network request failed during guest login.');
      throw new Error('Network connection issue. Please check your network or try again.');
    }
    console.error('Guest Sign In Error:', error);
    throw error;
  }
};

// Logout
export const logoutFirebase = async () => {
  await signOut(auth);
};

// Sync basic User Record to Firestore `users/{uid}`
export const syncUserProfile = async (user: User) => {
  if (!user) return;
  try {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);

    const userData = {
      uid: user.uid,
      email: user.email || 'anonymous@student.edu',
      displayName: user.displayName || (user.isAnonymous ? 'Guest Student' : 'B.Tech IT Student'),
      photoURL: user.photoURL || '',
      lastLoginAt: new Date().toISOString()
    };

    if (!snap.exists()) {
      await setDoc(userRef, {
        ...userData,
        createdAt: new Date().toISOString()
      });
    } else {
      await setDoc(userRef, userData, { merge: true });
    }
  } catch (err) {
    console.warn('Sync user profile error:', err);
  }
};

// --- Firestore Data Operations ---

// Save Student Profile to Firestore `studentProfiles/{uid}`
export const saveStudentProfileCloud = async (uid: string, profile: StudentProfile) => {
  if (!uid) return;
  try {
    const profileRef = doc(db, 'studentProfiles', uid);
    await setDoc(profileRef, {
      uid,
      ...profile,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Save student profile cloud error:', err);
  }
};

// Fetch Student Profile from Firestore
export const loadStudentProfileCloud = async (uid: string): Promise<StudentProfile | null> => {
  if (!uid) return null;
  try {
    const profileRef = doc(db, 'studentProfiles', uid);
    const snap = await getDoc(profileRef);
    if (snap.exists()) {
      const data = snap.data();
      const { uid: _, updatedAt: __, ...profileData } = data;
      return profileData as StudentProfile;
    }
  } catch (err) {
    console.warn('Load student profile cloud error:', err);
  }
  return null;
};

// Subscribe to real-time Student Profile updates
export const subscribeStudentProfile = (uid: string, callback: (profile: StudentProfile | null) => void) => {
  if (!uid) return () => {};
  const profileRef = doc(db, 'studentProfiles', uid);
  return onSnapshot(profileRef, (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      const { uid: _, updatedAt: __, ...profileData } = data;
      callback(profileData as StudentProfile);
    } else {
      callback(null);
    }
  }, (error) => {
    console.warn('Error listening to student profile:', error);
  });
};

// Save Semester Plan (Selected Course IDs) to Firestore `semesterPlans/{uid}`
export const saveSemesterPlanCloud = async (uid: string, selectedCourseIds: string[]) => {
  if (!uid) return;
  try {
    const planRef = doc(db, 'semesterPlans', uid);
    await setDoc(planRef, {
      uid,
      selectedCourseIds,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Save semester plan cloud error:', err);
  }
};

// Subscribe to real-time Semester Plan updates
export const subscribeSemesterPlan = (uid: string, callback: (selectedCourseIds: string[] | null) => void) => {
  if (!uid) return () => {};
  const planRef = doc(db, 'semesterPlans', uid);
  return onSnapshot(planRef, (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      callback(data.selectedCourseIds || []);
    } else {
      callback(null);
    }
  }, (error) => {
    console.warn('Error listening to semester plan:', error);
  });
};

// Save Counselor Chat History to Firestore `counselorChats/{uid}`
export const saveCounselorChatCloud = async (uid: string, messages: any[]) => {
  if (!uid) return;
  try {
    const chatRef = doc(db, 'counselorChats', uid);
    await setDoc(chatRef, {
      uid,
      messages,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Save counselor chat cloud error:', err);
  }
};

// Subscribe to real-time Counselor Chat updates
export const subscribeCounselorChat = (uid: string, callback: (messages: any[] | null) => void) => {
  if (!uid) return () => {};
  const chatRef = doc(db, 'counselorChats', uid);
  return onSnapshot(chatRef, (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      callback(data.messages || []);
    } else {
      callback(null);
    }
  }, (error) => {
    console.warn('Error listening to counselor chat:', error);
  });
};

// Subscribe to Auth State Changes
export const subscribeAuthState = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};
