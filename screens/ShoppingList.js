import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, Text, Image, FlatList, Dimensions } from "react-native";
import { doc, updateDoc, deleteDoc, collection, increment } from "firebase/firestore";
import { auth, database } from "../firebase/firebaseSetup";
import PressableButton from "../components/PressableButton";
import LoadingScreen from "./LoadingScreen";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ShoppingListContext } from "../utils/ShoppingListContext";
import { Snackbar } from "react-native-paper";
const windowWidth = Dimensions.get('window').width;

export default function ShoppingList({ navigation }) {
  const userId = auth.currentUser.uid
  const { shoppingList, setShoppingList, loading, quantities, setQuantities } = useContext(ShoppingListContext);
  const [deletedItems, setDeletedItems] = useState([]);
  const [isSnackbarVisible, setSnackbarVisible] = useState(false);

  useEffect(() => {
    // delete the item from firestore
    if (deletedItems.length > 0 && !isSnackbarVisible) {
      try {
        deletedItems.map(async (deletedItem) => {
          await deleteDoc(doc(database, `users/${userId}/shopping_list/${deletedItem.id}`));
        })
        setDeletedItems([]);
        setSnackbarVisible(false);
        
      } catch (error) {
        console.log(error);
      }
    }
  }, [deletedItems, isSnackbarVisible])

  // remove the item from local state
  const deleteHandler = async (item) => {
    setShoppingList(shoppingList => shoppingList.filter((i) => i.id != item.id))
    setDeletedItems(deletedItems => [...deletedItems, item])
    setSnackbarVisible(true)
  }

  // restore the item
  const handleUndoDelete = () => {
    setShoppingList(shoppingList => [...shoppingList, deletedItems.pop()])
    setSnackbarVisible(false)
  }

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

  // Group items by store name
  const groupShoppingListByStore = () => {
    const groupedItems = [];
    const storeNames = [];

    shoppingList.forEach((item) => {
      const storeName = item.priceToShow.store_name;
      const index = storeNames.indexOf(storeName);
      const totalPrice = (item.priceToShow.price * item.product.quantity).toFixed(2);

      // if store is not in the list, add it and create a new group
      if (index === -1) {
        storeNames.push(storeName);
        groupedItems.push({ storeName, items: [item], totalPrice: totalPrice });
      } else {
        // add the item to its corresponding store group
        groupedItems[index].items.push(item);
        groupedItems[index].totalPrice = (parseFloat(groupedItems[index].totalPrice) + parseFloat(totalPrice)).toFixed(2);
      }
    });
    return groupedItems;
  };

  // render item within store group
  const renderShoppingListItem = ({ item }) => {
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
                <PressableButton pressedFunction={() => deleteHandler(item)} customStyle={styles.button}>
                  <Ionicons name="trash" size={18} color="black" />
                </PressableButton> :
                <PressableButton pressedFunction={() => quantityHandler(item.id, -1)} customStyle={styles.button}>
                  <MaterialCommunityIcons name="minus" size={18} color="black" />
                </PressableButton>}
              </View>
            </View>
          </View>
          <Text>${item.priceToShow.price}</Text>
        </View>
      </PressableButton>
    );
  };

  return (
    <View style={styles.container}>
      {loading && <LoadingScreen />}
      {shoppingList.length === 0 && !loading &&
        <Text>Add something to your shopping list</Text>
      }
      <FlatList
        data={groupShoppingListByStore()}
        renderItem={({ item }) => (
          <>
            <View style={styles.storeBanner}>
              <Text style={styles.bannerTitle}>{item.storeName}</Text>
              <Text style={{fontWeight: '600'}}>${item.totalPrice}</Text>
            </View>
            
            <FlatList
              data={item.items}
              renderItem={renderShoppingListItem}
              keyExtractor={(item) => item.id}
            />
          </>
        )}
        keyExtractor={(item) => item.storeName}
      />
      <Snackbar
        visible={isSnackbarVisible}
        action={{
          label: 'Undo',
          onPress: handleUndoDelete,
        }}
        onDismiss={() => setSnackbarVisible(false)}
        duration={5000}
      >
        {deletedItems.length > 0 ? `Item "${deletedItems.slice(-1)[0].product.nameToShow}" deleted` : ''}
      </Snackbar>
      {/* <View style={{height: 50}}></View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  storeBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ececec',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: '#ececec',
    paddingVertical: '2%',
    paddingHorizontal: 20,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: "5%",
  },
  infoContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "500",
  },
  size: {
    color: 'gray',
    marginVertical: "1%"
  },
  quantityControl: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: "center",
    borderRadius: 20,
    width: windowWidth*0.3,
    marginTop: "2%",
    backgroundColor: '#ececec',
    left: "-2%" // offset for radius
  },
  quantity: {
    fontSize: 14,
    fontWeight: '500'
  },
  button: {
    padding: 10,
  }
});
