import {collection, addDoc, deleteDoc, doc, setDoc, getDoc} from 'firebase/firestore';
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
      return docRef.id;
    } catch (error) {
      console.error('Error adding document: ', error);
      throw error;
    }
  }