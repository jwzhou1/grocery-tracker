import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { database, auth } from "./firebaseSetup";

// support searching products by name
export async function searchFromDB(keyword) {
  try {
    // create a reference to products collection
    const productsRef = collection(database, "products");

    // perform a query of full-text match (use Typesense for more usable search functionality)
    const q = query(productsRef, where("name", "==", keyword));
    const querySnapshot = await getDocs(q);
    const productData = [];
    querySnapshot.forEach((doc) => {
      productData.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    return productData;
  } catch (error) {
    console.log(error)
  }
}

// get all prices given a product id
export async function getPricesFromDB(productId) {
  try {
    // create a reference to prices subcollection
    const pricesRef = collection(database, `products/${productId}/prices`);

    // query prices and order from newest to oldest
    const q = query(
      pricesRef,
      where("product_id", "==", productId),
      orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(q);
    const priceData = [];
    querySnapshot.forEach((doc) => {
      priceData.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    return priceData;
  } catch (error) {
    console.log(error)
  }
}

export const writeToUsersDB = async (userData) => {
  try {
    const { email, uid } = userData;
    await setDoc(doc(database, "users", uid), { email: email, uid: uid });
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

export async function updateToUsersDB(entryId, updateEntry) {
  try {
    const entryRef = doc(database, "users", entryId);
    await setDoc(entryRef, updateEntry, { merge: true });
    console.log("Updated To Users DB Successfully");
  } catch (err) {
    console.log("error in updateToUsersDB: ", err);
  }
}

export async function searchCategoriesFromDB(category) {
  try {
    const productsRef = collection(database, "products");
    const q = query(productsRef, where("category", "==", category));
    const querySnapshot = await getDocs(q);
    const productData = [];
    querySnapshot.forEach((doc) => {
      productData.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    return productData;
  } catch (error) {
    console.error("Error fetching search results:", error);
  }
}

export async function addToShoppingList(userId, productId) {
  try {
    // Get a reference to the shoppinglist/productId
    const listRef = collection(database, `users/${userId}/shopping_list`);
    const itemRef = doc(listRef, productId)
    const itemDoc = await getDoc(itemRef);

    // Check if the item exists in the shopping list
    if (itemDoc.exists()) {
      // update its quantity
      await setDoc(itemRef, { quantity: increment(1) }, { merge: true });
    } else {
      // create a new doc and set quantity to 1
      await setDoc(doc(database, `users/${userId}/shopping_list/${productId}`), { quantity: 1 });
    }
  } catch (error) {
    console.log(error)
  }
};

export async function getShoppingList(userId) {
  try {
    const userQuery = query(
      collection(database, "users"),
      where("uid", "==", userId)
    );
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
    console.error("Error getting shopping list:", error);
  }
}

// export async function searchProductDetail(productId) {
//   try {
//     const productDoc = await doc(database, "products", productId);
//     const productSnapshot = await getDoc(productDoc);
//     if (productSnapshot.exists()) {
//       return productSnapshot.data();
//     } else {
//       return null;
//     }
//   } catch (error) {
//     console.error("Error searching product detail:", error);
//   }
// }

export async function deleteFromShoppingList(userId, productId) {
  try {
    const userQuery = query(
      collection(database, "users"),
      where("uid", "==", userId)
    );
    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.empty) {
      console.error(`User document with ID ${userId} does not exist.`);
      return;
    }
    const userDocId = querySnapshot.docs[0].id;
    const userData = querySnapshot.docs[0].data();
    if (!userData.shopping_list || !Array.isArray(userData.shopping_list)) {
      console.error(`Shopping list not found in user data.`);
      return;
    }
    const updatedShoppingList = userData.shopping_list.filter(
      (item) => item !== productId
    );
    const userDocRef = doc(database, "users", userDocId);
    await updateDoc(userDocRef, {
      shopping_list:
        updatedShoppingList.length > 0 ? updatedShoppingList : null,
    });

    console.log("Product removed from shopping list successfully.");
  } catch (error) {
    console.error("Error deleting product from shopping list:", error);
  }
}

export const updatePriceInDatabase = async (updatedPrice) => {
  try {
    const q = query(
      collection(database, "prices"),
      where("product_id", "==", updatedPrice.product_id) &&
        where("store_name", "==", updatedPrice.store_name)
    );
    const querySnapshot = await getDocs(q);
    let priceId;
    querySnapshot.forEach((doc) => {
      priceId = doc.id;
    });
    console.log("NewpriceId:", priceId);
    if (!priceId) {
      console.error("No matching price documents found in the subset");
      throw new Error("No matching price documents found in the subset");
    }
    await updateDoc(doc(collection(database, "prices"), priceId), updatedPrice);
    console.log("Price updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating price:", error);
  }
};
