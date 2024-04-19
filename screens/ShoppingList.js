import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, Text, Image, FlatList, Dimensions } from "react-native";
import { doc, updateDoc, deleteDoc, collection, increment } from "firebase/firestore";
import { auth, database } from "../firebase/firebaseSetup";
import PressableButton from "../components/PressableButton";
import LoadingScreen from "./LoadingScreen";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ShoppingListContext } from "../utils/ShoppingListContext";
const windowWidth = Dimensions.get('window').width;

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
        data={shoppingList}
        renderItem={({ item }) => {
          return (
            <PressableButton pressedFunction={() => navigateToProductDetail(item)}>
              <View style={styles.itemContainer}>
                <Image style={styles.image} source={{ uri: item.product.image_url || 'https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png' }} />
                <View style={styles.infoContainer}>
                  <Text style={styles.productName}>{item.product.nameToShow}</Text>
                  <Text style={styles.size}>{item.product.size}</Text>
                  
                  <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 5}}>
                    <View style={styles.quantityControl}>
                      <PressableButton pressedFunction={() => quantityHandler(item.id, 1)} customStyle={styles.button}>
                        <MaterialCommunityIcons name="plus" size={18} color="black" />
                      </PressableButton>
                      <Text style={styles.quantity}>{quantities[item.id]}</Text>
                      {quantities[item.id] === 1 ?
                      <PressableButton pressedFunction={() => deleteHandler(item.id)} customStyle={styles.button}>
                        <Ionicons name="trash" size={18} color="black" />
                      </PressableButton> :
                      <PressableButton pressedFunction={() => quantityHandler(item.id, -1)} customStyle={styles.button}>
                        <MaterialCommunityIcons name="minus" size={18} color="black" />
                      </PressableButton>}
                    </View>
                  </View>
                </View>
                <Text style={styles.price}>${item.priceToShow.price}</Text>
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
    fontSize: 16,
    fontWeight: "bold",
  },
  size: {
    color: 'gray'
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  quantityControl: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: "center",
    borderRadius: 20,
    width: windowWidth*0.3,
    backgroundColor: '#ececec',
    left: "-2%" // offset for radius
  },
  quantity: {
    fontSize: 14,
    fontWeight: '500'
  },
  button: {
    padding: 10,
    //borderWidth:1
  }
});
