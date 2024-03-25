import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { schedulePriceChangeNotification, cancelPriceChangeNotification } from '../components/NotificationManager';
import LineChartManager from '../components/LineChartManager';

const ProductDetail = ({ route }) => {
  // Extracting product information from the route
  const { name, price, store, weight } = route.params;
  const navigation = useNavigation();

  // Function to navigate to Feedback screen
  const goToFeedback = () => {
    navigation.navigate('Feedback');
  };

  return (
    <View style={styles.container}>
      {/* Product Image */}
      <Image
        style={styles.image}
        source={{ uri: 'https://via.placeholder.com/150' }} // Placeholder image URL
      />

      {/* Product Information */}
      <View style={styles.infoContainer}>
        {/* Product Name and Weight */}
        <View style={styles.nameAndWeight}>
          <Text style={styles.productName}>{name}</Text>
          <Text style={styles.weight}>{weight}g</Text>
        </View>

        {/* Price and Supermarket */}
        <View style={styles.priceAndSupermarket}>
          <Text style={styles.price}>Price: ${price} at {store}</Text>
          <Text style={styles.unitPrice}>Unit Price: ${parseFloat(price) / parseFloat(weight)} per g</Text>
        </View>

        {/* Line Chart */}
        <View style={styles.lineChartContainer}>
          <LineChartManager selectedDuration="1 Month" /> 
        </View>
        
        {/* Add to List Button */}
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.buttonText}>Add to List</Text>
        </TouchableOpacity>

        {/* Feedback Link */}
        <TouchableOpacity onPress={goToFeedback} style={styles.feedbackLink}>
          <Text style={styles.feedbackText}>Not agree on the price? Provide feedback.</Text>
        </TouchableOpacity>
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
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  infoContainer: {
    flex: 1,
  },
  nameAndWeight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  weight: {
    fontSize: 16,
  },
  priceAndSupermarket: {
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
  },
  unitPrice: {
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#309797',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  feedbackLink: {
    textDecorationLine: 'underline',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  feedbackText: {
    color: '#309797',
    fontSize: 16,
  },
  lineChartContainer: {
    marginTop: 20, // Add appropriate spacing
  },
});

export default ProductDetail;
