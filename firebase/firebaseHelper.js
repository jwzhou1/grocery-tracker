import { collection, query,where, addDoc, deleteDoc, doc, setDoc, getDocs } from 'firebase/firestore';
import { database } from './firebaseSetup';
import { auth } from './firebaseSetup';
import { ref, uploadBytesResumable, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebaseSetup';

export async function writeToUsersDB(userInfo) {
  try {
    const docRef = await addDoc(collection(database, "Users"), userInfo);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id; 
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function updateInUsersDB(entryId, updateEntry) {
  try {
    const entryRef = doc(database, 'Users', entryId);
    await setDoc(entryRef, updateEntry, { merge: true });
    console.log('Updated');
  } catch (err) {
    console.log('error in updateInUsersDB: ', err);
  }
}

  
  export async function deleteFromDB(id) {
    try {
      // also delete photo from storage
      const docRef = doc(database, "Expenses", id);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      if (data.photo) {
        await deletePhotoFromStorage(data.photo);
      }

      await deleteDoc(docRef);
      console.log("Document successfully deleted!");
    } catch (err) {
      console.log(err);
    }
  }
  


  export async function searchProductsByName(productName) {
    try {
      const productsRef = collection(database, 'Products'); // Reference to the 'Products' collection
      const q = query(productsRef, where('name', '==', productName)); // Query for products with matching name
      const querySnapshot = await getDocs(q); // Get the query snapshot
      const results = []; // Array to store search results
      querySnapshot.forEach((doc) => {
        results.push(doc.data()); // Add each document's data to the results array
      });
      return results; // Return the array of search results
    } catch (error) {
      console.error('Error searching products:', error);
      return []; // Return an empty array if there's an error
    }
  }

  export async function getProductsByName(name) {
    try {
      const productsRef = collection(database, 'Products');
      const q = query(productsRef, where('name', '==', name));
      const querySnapshot = await getDocs(q);
      const products = [];
      querySnapshot.forEach((doc) => {
        // Check if the document data exists and has all required fields
        const data = doc.data();
        if (data && typeof data === 'object' && data.name && data.price && data.store && data.weight) {
          products.push(data);
        }
      });
      return products;
    } catch (error) {
      throw error;
    }
  }
  
  

export async function writeToBudgetsDB(budget) {
  try {
    const docRef = await addDoc(collection(database, "Budgets"), expense= {...budget, user:auth.currentUser.uid});
    console.log("Document written with ID: ", docRef.id);
  } catch (err) {
    console.log(err);
  }
}

export async function updateInBudgetsDB(entryId, updateEntry) {
  try {
      const entryRef = doc(database, 'Budgets', entryId);
      await setDoc(entryRef, updateEntry,  { merge: true });
      console.log('Updated');
  } catch (err) {
      console.log('error in updateInBudgetsDB: ', err);
  }
}
// delete photo from storage
export async function deletePhotoFromStorage(url) {
  try {
    const photoRef = ref(storage, url);
    await deleteObject(photoRef);
    console.log('Deleted in storage');
  } catch (err) {
    console.log('Error in deleting photo from storage: ', err);
  }
};


// delete photo from an expense
export async function deletePhotoFromExpense(url, entryId) {
  try {
    const photoRef = ref(storage, url);
    await deleteObject(photoRef);
    
    const entryRef = doc(database, 'Expenses', entryId);
    await setDoc(entryRef, {photo: null}, { merge: true });
    console.log('Deleted');
  }
  catch (err) {
    console.log('Error in deleting photo from expense: ', err);
  }
}


