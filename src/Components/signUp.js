import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { collection, setDoc, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../firebase/firebase';
import { useStoreConsumer } from '../context/storeProvider';

import { v4 as uuidv4 } from 'uuid';
import { FadeLoader } from 'react-spinners';
import '../index.css';
const SignUp = () => {
  const { setUserLogInData } = useStoreConsumer();

  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [number, setNumber] = useState('');
  const [userImage, setUserImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const sameId = uuidv4();

  const handleImageUpload = async (userUid) => {
    try {
      if (userImage) {
        if (!userImage.type.startsWith('image/')) {
          console.error('Selected file is not an image.');
          return;
        }

        if (userImage.size > 5 * 1024 * 1024) {
          console.error(
            'Selected image is too large. Please select a smaller image.'
          );
          return;
        }

        const storageRef = ref(storage, `profileImages/${userUid}`);
        await uploadBytes(storageRef, userImage);

        const url = await getDownloadURL(storageRef);
        return url;
      }

      return null;
    } catch (error) {
      console.error('Error uploading image:', error);

      return null;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      
      const photoURL = await handleImageUpload(user.id);
      const loginDetails = {
        SignUpMethod: 'emailAndPassword',
        displayName: userName,
        phoneNumber: number,
        photoURL: photoURL,
      };
      const userDoc = doc(db, 'users', sameId);

      await setDoc(
        userDoc,
        {
          id: sameId,
          email: user.email,
          ...loginDetails,
        },
        { merge: true }
      );
      navigate('/');

      setEmail('');
      setPassword('');
      setError(false);
    } catch (error) {
      setError(true);
      console.error('Error creating user:', error);
    }
  };
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const { user } = await signInWithPopup(auth, provider);

      // Check if the user already exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        // User already exists, no need to create a new document
        setUserLogInData(user);
        navigate('/home');
      } else {
        // User doesn't exist in Firestore, create a new document
        await setDoc(userDocRef, {
          id: user.uid,
          email: user.email,
          displayName: user.displayName,
        });

        setUserLogInData(user);
        navigate('/home');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    
    <div className='sign-up-container'>
      <h1 className='title'>Sign up here</h1>
      <div className={`sign-up ${loading ? 'blur' : ''}`}>
        <form onSubmit={handleLogin}>
          <input
            type='email'
            placeholder='Enter your email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type='password'
            placeholder='Enter your password'
            onChange={(e) => setPassword(e.target.value)}
          />
  
        </form>
      </div>
      <button className='button' onClick={handleGoogleSignIn}>
        SignIn with Google
      </button>
      {loading && (
        <div className='loader-container'>
          <FadeLoader
            size={100}
            color='rgba(248, 12, 12, 1)'
            loading={loading}
          />
        </div>
      )}
      <button className='button' onClick={() => navigate('/')}>
        Already have an Account? Log in
      </button>
    </div>
  );
};

export default SignUp;
