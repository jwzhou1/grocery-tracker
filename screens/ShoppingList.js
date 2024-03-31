import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getShoppingList, searchProductDetail, getPricesFromDB, deleteFromShoppingList } from '../firebase/firebaseHelper';
import LoadingScreen from './LoadingScreen';
import { useFocusEffect } from '@react-navigation/native'; 
import { MaterialIcons } from '@expo/vector-icons';

export default function ShoppingList() {
  const auth = getAuth();
  const [shoppingList, setShoppingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      async function fetchShoppingList() {
        try {
          const userId = auth.currentUser.uid;
          const list = await getShoppingList(userId);
          const detailedList = await Promise.all(list.map(async (productId) => {
            const productDetail = await searchProductDetail(productId);
            const productName = productDetail ? productDetail.name : 'Unknown';
            const priceData = await getPricesFromDB(productId);
            const productPrice = priceData.length > 0 ? priceData[0].data.price : 'Unknown';
            return { productId, name: productName, price: productPrice };
          }));
          setShoppingList(detailedList);
          setLoading(false); 
        } catch (error) {
          console.error('Error fetching shopping list:', error);
        }
      }
      fetchShoppingList();
    }, [])
  );

  const handleDeleteItem = async (productId) => {
    try {
      const userId = auth.currentUser.uid;
      await deleteFromShoppingList(userId, productId);
      setShoppingList(shoppingList.filter(item => item.productId !== productId));
      console.log('Item deleted');
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  if (loading) {
    return <LoadingScreen />; 
  }

  const handleIncreaseQuantity = (productId) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: (prevQuantities[productId] || 1) + 1,
    }));
  };

  const handleDecreaseQuantity = (productId) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: Math.max((prevQuantities[productId] || 1) - 1, 1),
    }));
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
            <TouchableOpacity style={styles.controlButton} onPress={() => handleIncreaseQuantity(item.productId)}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{quantities[item.productId] || 1}</Text>
              <TouchableOpacity style={styles.controlButton} onPress={() => handleDecreaseQuantity(item.productId)}>
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={() => handleDeleteItem(item.productId)}>
        <MaterialIcons name="delete" size={24} color="red" />
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
