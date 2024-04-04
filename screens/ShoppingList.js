import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, FlatList } from "react-native";
import { getPricesFromDB } from "../firebase/firebaseHelper";
import { doc, updateDoc, deleteDoc, collection, onSnapshot, increment } from "firebase/firestore";
import { auth, database } from "../firebase/firebaseSetup";
import PressableButton from "../components/PressableButton";
import LoadingScreen from "./LoadingScreen";
import { MaterialIcons } from "@expo/vector-icons";

// Next steps:
// 1.save the store information when added to list, then group items by store
// 2.improve UI (layout, detail, snackbar)
// 3.navigate to productDetail
export default function ShoppingList() {
  const userId = auth.currentUser.uid
  const [shoppingList, setShoppingList] = useState([]);
  const [loading, setLoading] = useState(true); // set to true initially to adapt to firestore listener
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    // set up a listener to get realtime data from firestore
    const unsubscribe = onSnapshot(collection(database, `users/${userId}/shopping_list`),
      async (snapshot) => {
        if (snapshot.empty) {
          setLoading(false)
          return (
            <Text>Add something to your shopping list</Text>
          );
        }

        let promises = [];
        snapshot.forEach((doc) => {
          const productData = doc.data();
          const productId = doc.id;
          // fetch prices for the current product and collect the promise
          promises.push(getPricesFromDB(productId).then(prices => 
            ({ ...productData, id: productId, price: prices.at(0).data.price })));
          setQuantities(prevQuantities => ({ ...prevQuantities, [productId]: productData.quantity }));
        });
        // wait for all promises to resolve
        const productWithPrices = await Promise.all(promises);
        setShoppingList(productWithPrices);
        setLoading(false)
      },
      (error) => {
        console.log(error.message);
        setLoading(false)
      }
    );
    return () => {
      console.log("unsubscribe");
      unsubscribe();
    };
  }, []);

  const quantityHandler = async (productId, delta) => {
    // first update local states
    setQuantities(prevQuantities => ({
      ...prevQuantities, [productId]: prevQuantities[productId] + delta
    }));
    try {
      // get a reference to the item and update in firestore
      const listRef = collection(database, `users/${userId}/shopping_list`);
      const itemRef = doc(listRef, productId)
      await updateDoc(itemRef, { quantity: increment(delta) });
    } catch (error) {
      console.log(error)
    }
  }

  const deleteHandler = async (productId) => {
    try {
      await deleteDoc(doc(database, `users/${userId}/shopping_list/${productId}`))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View style={styles.container}>
      {loading && <LoadingScreen />}
      <FlatList
        // contentContainerStyle={}
        data={shoppingList}
        renderItem={({ item }) => {
          return (
            <View style={styles.itemContainer}>
              <Image style={styles.image} source={{ uri: item.image_url || 'https://via.placeholder.com/150' }} />
              <View style={styles.infoContainer}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.price}>Price: ${item.price}</Text>
                <View style={styles.quantityControl}>
                  <PressableButton
                    customStyle={styles.controlButton}
                    pressedFunction={() => quantityHandler(item.id, 1)}
                  >
                    <Text style={styles.buttonText}>+</Text>
                  </PressableButton>
                  <Text style={styles.quantity}>{quantities[item.id]}</Text>
                  <PressableButton
                    customStyle={styles.controlButton}
                    pressedFunction={() => quantityHandler(item.id, -1)}
                    disabled={quantities[item.id] === 1}
                  >
                    <Text style={styles.buttonText}>-</Text>
                  </PressableButton>
                </View>
              </View>
              <PressableButton pressedFunction={() => deleteHandler(item.id)}>
                <MaterialIcons name="delete" size={24} color="red" />
              </PressableButton>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 20,
  },
  infoContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  price: {
    fontSize: 16,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  controlButton: {
    backgroundColor: "#309797",
    padding: 5,
    borderRadius: 3,
    marginRight: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  quantity: {
    fontSize: 16,
  },
});
