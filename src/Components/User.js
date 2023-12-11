import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Nav';
import { signOut } from 'firebase/auth';
import { auth, db, storage } from '../firebase/firebase';
import { useStoreConsumer } from '../context/storeProvider';
import { updateDoc, doc, getDoc, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { PacmanLoader } from 'react-spinners';
import "../Components/User.css";

const User = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isEditingPhoto, setIsEditingPhoto] = useState('');
  const [gender, setGender] = useState('');
  const [userImage, setUserImage] = useState(null);
  const { user, userEmailData } = useStoreConsumer();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const findUser =
  user &&
  user.find(
    (item) => item?.email === userEmailData.email && userEmailData.email
  );

console.log('findUser:', findUser);

const userId = findUser ? findUser.id : null;


  const handleImageUpload = async (userId) => {
    try {
      if (userImage) {
        if (!userImage.type.startsWith('image/')) {
          return null;
        }

        if (!userImage.type || !userImage.type.startsWith('image/')) {
          console.error('Selected file is not an image.');
          return;
        }
        if (userImage.size > 5 * 1024 * 1024) {
          console.error(
            'Selected image is too large. Please select a smaller image.'
          );
          return;
        }

        const storageRef = ref(storage, `profileImages/${userId}`);
        const uploadTask = uploadBytes(storageRef, userImage);
        await uploadTask;
        const url = await getDownloadURL(storageRef);
        console.log('Image URL:', url);
        return url;
      }

      return null;
    } catch (error) {
      console.error('Error uploading image:', error);

      return null;
    }
  };

  const handleSave = async () => {
    if (displayName && phoneNumber) {
      try {
        setLoading(true);
  
        let updatedData = {
          ...findUser,
          displayName,
          phoneNumber,
        };
  
        if (isEditingPhoto && userImage) {
          const photoURL = await handleImageUpload(userId);
          if (photoURL) {
            updatedData.photoURL = photoURL;
          } else {
            console.error('Image upload failed.');
            return;
          }
        }
  
        // Add debugging logs
        console.log('userId:', userId);
  
        if (userId) {
          const itemToEdit = doc(db, 'users', userId);
          await updateDoc(itemToEdit, updatedData);
        } else {
          console.error('User ID is null.');
          return;
        }
  
        setIsEditing(false);
        navigate('/home');
      } catch (error) {
        console.error('Error in updating:', error);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Phone number is mandatory');
    }
  };
  
  
  

  useEffect(() => {
    if (findUser) {
      setDisplayName(findUser?.displayName || '');
      setPhoneNumber(findUser?.phoneNumber || '');
      setUserImage(findUser?.photoURL || '');
      setGender(findUser?.gender);
    }
  }, [findUser]);
  const logout = async () => {
    signOut(auth)
      .then(() => {
        navigate('/');
      })
      .catch((err) => console.log('Error:', err));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setDisplayName(findUser?.displayName);
    setPhoneNumber(findUser?.phoneNumber);
    setUserImage(findUser?.photoURL || userImage);
  };
  const editPhoto = () => {
    setIsEditingPhoto(true);
    setIsEditing(true);
  };
  return (
    <div className='user-profile'>
      <Navbar />
      <div className='user-container'>
        <div className='user-details'>
          <h2 className='use'>User Profile</h2>
          <img
            className='user-img'
            src={findUser?.photoURL || userImage}
            alt=''
          />

          <div className={`user-data ${loading ? 'blur' : ''}`}>
            <div className='input-container'>
              <div className='input-section'>
                <input
                  type='text'
                  name='displayName'
                  placeholder='Name'
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className='input-section'>
                <input
                  type='text'
                  name='email'
                  placeholder='Email'
                  value={findUser?.email}
                  readOnly
                />
              </div>
              <div className='input-section'>
                <input
                  type='text'
                  name='Password'
                  placeholder='Password'
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className='img-section'>
                <div>
                  <label className='label'> Upload Profile picture </label>
                  <input
                    className='img-input'
                    type='file'
                    accept='image/*'
                    onChange={(e) => setUserImage(e.target.files[0])}
                    disabled={!isEditingPhoto}
                  />
                  <button
                  className='button edit'
                  onClick={editPhoto}
                  disabled={!isEditing}
                >
                  Edit Photo
                </button>
                </div>
                
              </div>
              <div className='input-section'>
                <div className='profile-gender'>
                  <label>Gender : </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    id='gender'
                    placeholder='gender'
                    required
                    disabled={!isEditing}
                  >
                    <option defaultChecked>Gender</option>
                    <option value='Male'>Male</option>
                    <option value='Women'>Women</option>
                    <option value='Other'>Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div>
            {!isEditing ? (
              <button className='button' onClick={handleEdit}>
                Edit profile
              </button>
            ) : (
              <>
                <button className='button' onClick={handleSave}>
                  Save Changes
                </button>
                {loading && (
                  <div className='loader-container'>
                    <PacmanLoader
                      color='#e62323'
                      margin={-1}
                      loading={loading}
                      size={100}
                    />
                  </div>
                )}
              </>
            )}
            <button className='button' onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
