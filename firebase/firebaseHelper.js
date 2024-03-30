import { collection, addDoc, deleteDoc, doc, setDoc, getDocs, query, where, orderBy,getDoc,updateDoc,arrayUnion  } from 'firebase/firestore';
import { database, auth } from './firebaseSetup';
import { ref, uploadBytesResumable, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebaseSetup';

// support searching products by name
export async function searchFromDB(keyword) {
  // create a reference to products collection
  const productsRef = collection(database, "products");

  // perform a query of full-text match (use Typesense for more usable search functionality)
  const q = query(productsRef, where("name", "==", keyword));
  const querySnapshot = await getDocs(q);
  const productData = []
  querySnapshot.forEach((doc) => {
    productData.push({
      id: doc.id,
      data: doc.data()
    });
  })
  return productData;
}

// get all prices given a product id
export async function getPricesFromDB(productId) {
  const pricesRef = collection(database, "prices");
  // order prices from newest to oldest
  const q = query(pricesRef, where("product_id", "==", productId), orderBy("date", "desc"));
  //const q = query(pricesRef, where("product_id", "==", productId));
  const querySnapshot = await getDocs(q);
  const priceData = []
  querySnapshot.forEach((doc) => {
    priceData.push({
      id: doc.id,
      data: doc.data()
    });
  })
  return priceData;
}





export async function writeToDB(data) {

}

export async function deleteFromDB(id) {

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

export async function searchCategoriesFromDB(category) {
  try {
    const productsRef = collection(database, "products");
    const q = query(productsRef, where("category", "==", category));
    const querySnapshot = await getDocs(q);
    const productData = [];
    querySnapshot.forEach((doc) => {
      productData.push({
        id: doc.id,
        data: doc.data()
      });
    });
    return productData;
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw error;
  }
}


export const addToShoppingList = async (userId, productId) => {
  try {
    const userQuery = query(collection(database, 'users'), where('uid', '==', userId));
    const querySnapshot = await getDocs(userQuery);
    let userIdToUpdate;
    querySnapshot.forEach(doc => {
        userIdToUpdate = doc.id;
    });
    if (!userIdToUpdate) {
      console.error(`User document with ID ${userId} does not exist.`);
      return;
    }
    const userRef = doc(database, 'users', userIdToUpdate);
    // Get the found user document data
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    // Check if the shopping_list field exists and is an array
    if (!userData.shopping_list || !Array.isArray(userData.shopping_list)) {
      // Initialize the shopping_list field as an empty array
      await updateDoc(userRef, { shopping_list: [] });
    }
    console.log('Product ID:', productId);
    // Add the productId to the shopping_list array
    await updateDoc(userRef, { shopping_list: arrayUnion(productId) });
    console.log('Product added to shopping list successfully.');
  } catch (error) {
    console.error('Error adding product to shopping list:', error);
  }
};


export async function getShoppingList(userId) {
  try {
    const userQuery = query(collection(database, 'users'), where('uid', '==', userId));
    const querySnapshot = await getDocs(userQuery);
    let shoppingList = []; 
    querySnapshot.forEach((doc) => {
      const userData = doc.data(); 
      if (userData.shopping_list && Array.isArray(userData.shopping_list)) {
        shoppingList = userData.shopping_list; 
      }
    });
    return shoppingList;
  } catch (error) {
    console.error('Error getting shopping list:', error);
    throw error;
  }
};


export async function searchProductDetail(productId) {
  try {
    const productDoc = await doc(database, 'products', productId); 
    const productSnapshot = await getDoc(productDoc); 
    if (productSnapshot.exists()) {
      return productSnapshot.data(); 
    } else {
      return null; 
    }
  } catch (error) {
    console.error('Error searching product detail:', error);
    throw error;
  }
}