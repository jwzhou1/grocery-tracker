import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';

export default function WatchList() {
  return (
    <View style={styles.container}>
      {/* Watch List Items */}
      {/* Map through watch list items and display them */}

      {/* Example Item */}
      <View style={styles.itemContainer}>
        {/* Product Image */}
        <Image
          style={styles.image}
          source={{ uri: 'https://via.placeholder.com/150' }} // Placeholder image URL
        />

        {/* Product Information */}
        <View style={styles.infoContainer}>
          <Text style={styles.productName}>Watch 1</Text>
          <Text style={styles.description}>Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
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
  description: {
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