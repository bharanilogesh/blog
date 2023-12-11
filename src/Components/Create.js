import React, { useState } from 'react';
import { collection, setDoc, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../firebase/firebase';
import { useStoreConsumer } from '../context/storeProvider';
import "../Components/Create.css";

function Create({sameId})
{
  console.log(sameId)
  const { setUserLogInData } = useStoreConsumer();
  const [userImage, setUserImage] = useState("");
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')

  const handleSave = async (e) => {
    e.preventDefault();

    try {
        const photoURL = await handleImageUpload(sameId);
  
        if (photoURL !== null) {
          const userDoc = doc(db, 'users', sameId);
          await setDoc(
            userDoc,
            {
              id: sameId,
              title: title,
              desc: desc,
              photoURL: photoURL
            },
            { merge: true }
          );
  
          // Additional logic if needed after saving the document
        } else {
          console.error('Error uploading image or image not selected.');
        }
      } catch (error) {
        console.error('Error saving document:', error);
      }
    };

  const handleImageUpload = async (userUid) => {
    try {
      if (userImage) {
        if (!userImage.type.startsWith('image/')) {
          console.error('Selected file is not an image.');
          return null;
        }

        if (userImage.size > 5 * 1024 * 1024) {
          console.error('Selected image is too large. Please select a smaller image.');
          return null;
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

  return (
    <div className="form-container">
      <form>
        <div className="addNewBlog">
          <h2>Add a New Blog</h2>
        </div>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            placeholder=" Enter Your Title"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            placeholder=" Enter Your Description"
            value={desc}
            required
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <div className="file">
          <label htmlFor="file">
            Input File:
            <input
              className="img-input"
              type="file"
              accept="image/*"
              placeholder="Add photo"
              onChange={(e) => setUserImage(e.target.files[0])}
            />
          </label>
        </div>
        <button onClick={handleSave} className="newBlog-btn">Submit</button>
      </form>
    </div>
  );
}

export default Create;
