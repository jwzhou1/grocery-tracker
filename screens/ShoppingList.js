import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, Text, Image, FlatList } from "react-native";
import { doc, updateDoc, deleteDoc, collection, increment } from "firebase/firestore";
import { auth, database } from "../firebase/firebaseSetup";
import PressableButton from "../components/PressableButton";
import LoadingScreen from "./LoadingScreen";
import { MaterialIcons } from "@expo/vector-icons";
import { ShoppingListContext } from "../utils/ShoppingListContext";

// Next steps:
// 1.group items by store
// 2.improve UI (layout, detail, snackbar)
export default function ShoppingList({ navigation }) {
  const userId = auth.currentUser.uid
  const { shoppingList, loading, quantities, setQuantities } = useContext(ShoppingListContext);

  const navigateToProductDetail = (item) => {
    navigation.navigate("Product Detail", 
      { productId: item.id, product: item.product, prices: item.prices, priceToShow: item.priceToShow })
  }

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
      {shoppingList.length === 0 && !loading &&
        <Text>Add something to your shopping list</Text>
      }
      <FlatList
        // contentContainerStyle={}
        data={shoppingList}
        renderItem={({ item }) => {
          return (
            <PressableButton pressedFunction={() => navigateToProductDetail(item)}>
              <View style={styles.itemContainer}>
                <Image style={styles.image} source={{ uri: item.product.image_url || 'https://via.placeholder.com/150' }} />
                <View style={styles.infoContainer}>
                  <Text style={styles.productName}>{item.product.name}</Text>
                  <Text style={styles.price}>Price: ${item.priceToShow.price}</Text>
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
            </PressableButton>
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
