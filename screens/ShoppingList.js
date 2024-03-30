import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getShoppingList,searchProductDetail, getPricesFromDB } from '../firebase/firebaseHelper'; 

export default function ShoppingList() {
  const auth = getAuth();
  const [shoppingList, setShoppingList] = useState([]);

  useEffect(() => {
    async function fetchShoppingList() {
      try {
        const userId = auth.currentUser.uid;
        const list = await getShoppingList(userId);
        console.log("Shopping List:", list);
        const detailedList = await Promise.all(list.map(async (productId) => {
          const productDetail = await searchProductDetail(productId);
          console.log("productDetail",productDetail);
          const productName = productDetail ? productDetail.name : 'Unknown';
          console.log("productName", productName);
          const priceData = await getPricesFromDB(productId);
          const productPrice = priceData.length > 0 ? priceData[0].data.price : 'Unknown'; 
          return { productId, name: productName, price: productPrice }; 
        }));
        setShoppingList(detailedList);
      } catch (error) {
        console.error('Error fetching shopping list:', error);
      }
    }

    fetchShoppingList();
  }, []);

  const handleDeleteItem = () => {
    console.log('Item deleted');
  };

  return (
    <View style={styles.container}>
      {shoppingList.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <Image
            style={styles.image}
            source={{ uri: item.imageUrl }}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.price}>Price: ${item.price}</Text>
            <View style={styles.quantityControl}>
              <TouchableOpacity style={styles.controlButton}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <TouchableOpacity style={styles.controlButton}>
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={handleDeleteItem}>
            <Text style={{ color: 'red' }}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  controlButton: {
    backgroundColor: '#309797',
    padding: 5,
    borderRadius: 3,
    marginRight: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  quantity: {
    fontSize: 16,
  },
});
