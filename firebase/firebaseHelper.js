import {collection, addDoc, deleteDoc,doc, setDoc, getDocs, query, where } from 'firebase/firestore';
import {database} from './firebaseSetup';

import {auth} from './firebaseSetup';
import {ref, uploadBytesResumable, uploadBytes, getDownloadURL, deleteObject} from 'firebase/storage';
import {storage} from './firebaseSetup';
 
export async function writeToDB(data) {

}

export async function deletefromDB(id) {

}

export async function updateDB(id, data) {

}

export async function writeToUsersDB(userData) {
    try {
      const docRef = await addDoc(collection(database, 'users'), userData);
      console.log('Document written with ID: ', docRef.id);
      console.log(docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding document: ', error);
      throw error;
    }
  }


  export const updateToUsersDB = async (userData, photoURL) => {
    try {
      const userID = auth.currentUser.uid; 
      console.log(auth.currentUser.uid);
      const updatedUserData = { ...userData, imageUri: photoURL }; 
      console.log(updatedUserData);
      const userQuery = query(collection(database, 'users'), where('uid', '==', userID));
      const querySnapshot = await getDocs(userQuery);
      let userId;
      querySnapshot.forEach(doc => {
          userId = doc.id;
      });
      const userRef = doc(database, 'users', userId);
      await setDoc(userRef, updatedUserData); 
      console.log('Suceessfully updated user imageUri in Firestore!');
    } catch (error) {
      console.error('imageUri upload Error:', error);
    }
};
