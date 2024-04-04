import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PressableButton from './PressableButton';

export default function ProductCard({ productId, product, prices }) {
  const navigation = useNavigation()
  const navigateToProductDetail = () => {
    navigation.navigate('Product Detail', { productId, product, prices });
  };

  return (
    <PressableButton pressedFunction={navigateToProductDetail}>
      {prices.at(0) &&
      <View style={styles.productCard}>
        <Image source={{ uri: "https://via.placeholder.com/150" }} style={styles.image} />
        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.price}>${prices.at(0).data.price}</Text>
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
    width: '100%',
    height: 150,
  },
  detailsContainer: {
    padding: 10,
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
