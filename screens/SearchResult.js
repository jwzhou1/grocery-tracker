import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getProductsByName } from '../firebase/firebaseHelper';

const SearchResult = ({ route }) => {
  const navigation = useNavigation();
  const [searchResults, setSearchResults] = useState([]);
  const { searchText } = route.params;
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProductsByName(searchText);
        setSearchResults(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
  
    fetchProducts();
  }, [searchText]);

  const handleProductDetail = (name, price, store, weight) => {
    navigation.navigate('ProductDetail', {
      name,
      price,
      store,
      weight,
    });
  };
  

  return (
    <View style={styles.container}>
      {searchResults.map((item, index) => (
       <TouchableOpacity key={index} onPress={() => handleProductDetail(item.name, item.price, item.store, item.weight)}>
          <View style={styles.searchResult}>
          <Image
         style={styles.image}
        source={{ uri: 'https://via.placeholder.com/150' }} 
          />
            <View style={styles.description}>
              <Text style={styles.price}>From ${item.price}</Text>
              <Text style={styles.item}>{item.name} {item.weight}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 10,
  },
  searchResult: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
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
