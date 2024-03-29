import React, { useState } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import PressableButton from '../components/PressableButton';

const ProductDetail = ({ route, navigation }) => {
  // Extracting product information from the route
  //console.log(route.params)
  const { product, prices } = route.params;
  const price = prices.at(0).data

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
        {/* Product Name and Unit */}
        <View style={styles.nameAndWeight}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.unitPrice}>${price.unit_price}/{product.unit}</Text>
        </View>

        {/* Price and Supermarket */}
        <View style={styles.priceAndSupermarket}>
          <Text style={styles.price}>${price.price} at {price.store_name}</Text>
          
        </View>

        {/* Line Chart */}
        <View style={styles.lineChartContainer}>
        </View>
        
        {/* Add to List Button */}
        <PressableButton customStyle={styles.addButton}>
          <Text style={styles.buttonText}>Add to List</Text>
        </PressableButton>

        {/* Feedback Link */}
        <PressableButton pressedFunction={goToFeedback} customStyle={styles.feedbackLink}>
          <Text style={styles.feedbackText}>Not agree on the price? Provide feedback.</Text>
        </PressableButton>
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
    alignSelf: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    flex: 1,
  },
  nameAndWeight: {
    flexDirection: 'row',
    alignItems: 'center',
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
