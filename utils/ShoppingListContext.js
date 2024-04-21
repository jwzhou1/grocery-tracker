import React, { createContext, useState, useEffect } from 'react';
import { auth, database } from "../firebase/firebaseSetup";
import { getPricesFromDB } from "../firebase/firebaseHelper";
import { collection, onSnapshot } from "firebase/firestore";

export const ShoppingListContext = createContext();

// grant access to shopping list data across components
export const ShoppingListProvider = ({ children }) => {
  const [numItems, setNumItems] = useState(0);
  const [shoppingList, setShoppingList] = useState([]);
  const [loading, setLoading] = useState(true); // set to true initially to adapt to firestore listener
  const [quantities, setQuantities] = useState({});
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  useEffect(() => {
    if (!userId) {
      return;
    }
    // set up a listener to get realtime data from firestore
    const unsubscribe = onSnapshot(collection(database, `users/${userId}/shopping_list`),
      async (snapshot) => {
        if (snapshot.empty) {
          setLoading(false)
          setNumItems(0)
        }

        let promises = [];
        let numItems = 0;
        snapshot.forEach((doc) => {
          numItems += 1
          const productData = doc.data();
          const productId = doc.id;
          // fetch prices for the current product and collect the promise
          promises.push(getPricesFromDB(productId).then(prices => 
            ({ product: productData, id: productId, prices: prices, 
              priceToShow: prices.filter((price) => price.data.store_name === productData.store_name).at(0).data })));
          setQuantities(prevQuantities => ({ ...prevQuantities, [productId]: productData.quantity }));
        });
        // wait for all promises to resolve
        const productWithPrices = await Promise.all(promises);
        setShoppingList(productWithPrices);
        setNumItems(numItems)
        setLoading(false)
      },
      (error) => {
        console.log(error.message);
        setLoading(false)
      }
    );
    return () => {
      unsubscribe();
      //console.log("unsubscribe");
    };
  }, [auth.currentUser]);

  return (
    <ShoppingListContext.Provider value={{ numItems, shoppingList, setShoppingList, loading, quantities, setQuantities }}>
      {children}
    </ShoppingListContext.Provider>
  );
};