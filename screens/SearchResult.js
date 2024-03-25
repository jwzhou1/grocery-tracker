import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SearchResult = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState(''); // State to hold search text

  // Function to handle going back
  const handleBack = () => {
    navigation.goBack();
  };

  // Function to navigate to product detail screen
  const handleProductDetail = () => {
    navigation.navigate('ProductDetail', {
      item: 'Product Name',
      weight: '100g',
      price: '$1',
      supermarket: 'Your Supermarket'
    });
  };

  return (
    <View style={styles.container}>
      {/* Search Result */}
      <TouchableOpacity onPress={handleProductDetail}>
        <View style={styles.searchResult}>
          {/* Image */}
          <Image
            style={styles.image}
            source={{ uri: 'https://via.placeholder.com/150' }} // Placeholder image URL
          />
          {/* Description */}
          <View style={styles.description}>
            <Text style={styles.price}>From $1 dollar</Text>
            <Text style={styles.item}>Item1 100g</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF', // Update with your desired background color
    paddingTop: 10,
  },
  searchBar: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  input: {
    fontSize: 18,
    color: 'black',
    borderBottomWidth: 1,
    borderBottomColor: '#309797',
  },
  searchResult: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  description: {
    flex: 1,
  },
  price: {
    fontSize: 16,
    color: '#309797',
  },
  item: {
    fontSize: 14,
    color: 'black',
  },
});

export default SearchResult;
