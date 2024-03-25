import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import DeleteButton from '../components/DeleteButton';

export default function ShoppingList() {
  // Function to handle item deletion
  const handleDeleteItem = () => {
    // Implement your logic to delete the item here
    console.log('Item deleted');
  };

  return (
    <View style={styles.container}>
      {/* Shopping List Items */}
      {/* Map through shopping list items and display them */}

      {/* Example Item */}
      <View style={styles.itemContainer}>
        {/* Product Image */}
        <Image
          style={styles.image}
          source={{ uri: 'https://via.placeholder.com/150' }} // Placeholder image URL
        />

        {/* Product Information */}
        <View style={styles.infoContainer}>
          <Text style={styles.productName}>Item 1</Text>
          <Text style={styles.price}>Price: $1.00</Text>
          {/* Add/Remove Buttons */}
          <View style={styles.quantityControl}>
            <TouchableOpacity style={styles.controlButton}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>1</Text>
            <TouchableOpacity style={styles.controlButton}>
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Delete Button */}
        <DeleteButton entryId="your_entry_id" onDeleteSuccess={handleDeleteItem} />
      </View>
    </View>
  );
};

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