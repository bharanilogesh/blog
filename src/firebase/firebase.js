import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage
import { getApp, getApps } from 'firebase/app';
import 'firebase/storage';
const firebaseConfig = {
  apiKey: "AIzaSyAaP1X7Les28EkXUZQ4lqpBYyD-HuGS0F0",
  authDomain: "blog-fb1eb.firebaseapp.com",
  projectId: "blog-fb1eb",
  storageBucket: "blog-fb1eb.appspot.com",
  messagingSenderId: "705965517277",
  appId: "1:705965517277:web:12137608382e3df75d2e34"
};
// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const commerceGoogleProvider = new GoogleAuthProvider();
const createUserDocumentFromAuth = async (userAuth) => {
  if (!userAuth) return;
  const userDocRef = doc(db, 'users', userAuth.uid);
  console.log(userDocRef);
  const userSnapShot = await getDoc(userDocRef);
  console.log(userSnapShot);
  console.log(userSnapShot.exists());
  if (!userSnapShot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await setDoc(userDocRef, { displayName, email, createdAt });
    } catch (error) {
      console.log('Error creating user', error.message);
    }
  }
  return userDocRef;
};
const db = getFirestore(app);
const storage = getStorage(app);
export { commerceGoogleProvider, db, app, storage, createUserDocumentFromAuth };
export const auth = getAuth(app);
