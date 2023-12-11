import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const getUserData = async () => {
  const userData = await getDocs(collection(db, 'users'));

  return userData.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
};
export { getUserData };
