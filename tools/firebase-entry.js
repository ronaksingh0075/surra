// The slice of the Firebase SDK Surra uses: email/password auth + Firestore Lite (REST, no realtime).
export { initializeApp } from 'firebase/app';
export {
  initializeAuth, indexedDBLocalPersistence, browserLocalPersistence, onAuthStateChanged, connectAuthEmulator,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail,
  signOut, updateProfile, reauthenticateWithCredential, EmailAuthProvider, deleteUser,
} from 'firebase/auth';
export {
  getFirestore, connectFirestoreEmulator, doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp,
  collection, query, where, limit, getDocs,
} from 'firebase/firestore/lite';
