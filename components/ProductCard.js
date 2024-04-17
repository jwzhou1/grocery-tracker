import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PressableButton from './PressableButton';

export default function ProductCard({ productId, product, prices }) {
  const navigation = useNavigation()
  const [priceToShow, setPriceToShow] = useState({})

  useEffect(() => {
    const getLatestCheapestPrice = () => {
      const anchorDate = prices[0].data.date.toDate();
      const anchor = anchorDate.getUTCDay();
      const range = anchor < 4 ? anchor + 3 : anchor - 4 // calculate the date range to look for
      anchorDate.setDate(anchorDate.getDate() - range);
      // iterate through prices array to search for price within the range dating back from anchor
      const recentPrices = prices.filter(price => price.data.date.toDate() >= anchorDate)
      // then find out the minimum price in that range
      let minPrice = Infinity;
      let minPriceIndex = -1;

      recentPrices.forEach((price, index) => {
        if (price.data.price < minPrice) {
          minPrice = price.data.price;
          minPriceIndex = index;
        }
      });
      setPriceToShow(prices.at(minPriceIndex).data)
    }
    getLatestCheapestPrice()
  })

  const navigateToProductDetail = () => {
    navigation.navigate('Product Detail', { productId, product, prices, priceToShow });
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
