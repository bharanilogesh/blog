import React, {
  createContext,
  useEffect,
  useReducer,
  useState,
  useContext,
} from 'react';
import { db, auth } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { getUserData } from '../utils/fetchFunction';
import userReducer from '../reducers/userReducer';
import { onAuthStateChanged } from 'firebase/auth';


const UserContext = createContext();
const initialState = {
  user: null,
};
const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const [userEmailData, setUserEmailData] = useState('');
  const [loading, setLoading] = useState(true);
  const [userLogInData, setUserLogInData] = useState('');
  const fetchData = async () => {
    await getUserData().then((data) => {
      dispatch({ type: 'SET_USER_DATA', userData: data });
    });
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    onAuthStateChanged(auth, (userLogInData) => {
      if (userLogInData) {
        setUserEmailData(userLogInData.providerData[0]);
      }
    });
  }, []);

  return (
    <UserContext.Provider value={{ ...state, userEmailData, setUserLogInData }}>
      {children}
    </UserContext.Provider>
  );
};
const useStoreConsumer = () => {
  return useContext(UserContext);
};
export { StoreProvider, UserContext, useStoreConsumer };
