import React, { useState, useContext } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useStoreConsumer } from '../context/storeProvider';
import { auth, db } from '../firebase/firebase';
import { Link, useNavigate } from 'react-router-dom';

import '../index.css';

const LogIn = () => {
  const { setUserLogInData } = useStoreConsumer();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const onLogin = async (e) => {
    e.preventDefault();

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
      navigate('/home');
    // location.reload();
  };

  return (   <div className='log-in'>
      <h1>Welcome to e shop, please log in </h1>
      <form className='sing-in-form' onSubmit={onLogin}>
        <div className='content'>
          <input
            type='email'
            placeholder='Your mail id'
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='content'>
          <input
            type='password'
            placeholder='Your password'
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type='submit' className='button'>
          log in
        </button>
      </form>
      <button className='button' onClick={() => navigate('/signUp')}>
        Add account
      </button>
      {/* <div>
        <button className='button' onClick={() => setIsOpen(!isOpen)}>
          Test credential
        </button>
        {isOpen && (
          <div className='credential'>
            <p>
              <span>Email: </span>manojbharathi@gmail.com
            </p>
            <p>
              <span>Password: </span>123456
            </p>
          </div>
        )}
      </div> */}
    </div>
  );
};
export default LogIn;
