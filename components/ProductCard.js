import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PressableButton from './PressableButton';

export default function ProductCard({ productId, product, prices }) {
  const navigation = useNavigation()
  const [priceToShow, setPriceToShow] = useState(prices.at(0).data) // display most up-to-date price, change to recent cheapest
  const navigateToProductDetail = () => {
    navigation.navigate('Product Detail', { productId, product, prices });
  };

  return (
    <PressableButton pressedFunction={navigateToProductDetail}>
      {prices.at(0) &&
      <View style={styles.productCard}>
        <Image source={{ uri: product.image_url || "https://via.placeholder.com/150" }} style={styles.image} />
        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.category}>{product.category}</Text>
          <View style={styles.priceRow}>
            {product.unit && product.quantity === 1 ? 
            // if loose, show unit price only
            <Text style={styles.price}>${priceToShow.unit_price}/{product.unit}</Text> :
            // otherwise show both price & unit price
            <>
            <Text style={styles.price}>${priceToShow.price}</Text>
            <Text style={styles.category}>${priceToShow.unit_price}/{product.unit}</Text>
            </>}
          </View>
        </View>
      </View>}
    </PressableButton>
  );
}

const styles = StyleSheet.create({
  productCard: {
    flexDirection: 'column',
    alignSelf: 'center',
    width: '80%',
    margin: 5,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '50%',
    height: 150,
    alignSelf: 'center'
  },
  detailsContainer: {
    padding: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  category: {
    color: '#666666',
  },
  price: {
    color: '#009900',
    fontWeight: 'bold',
  },
});
