import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function CategoryCard() {
  const navigation = useNavigation();

  // Define your categories here
  const categories = [
    { name: 'Produce', image: require('../images/category_images/produce.png') },
    { name: 'Drinks', image: require('../images/category_images/drink.png') },
    { name: 'Food', image: require('../images/category_images/food.png') },
    { name: 'Groceries', image: require('../images/category_images/grocery.webp') },
    { name: 'Meat', image: require('../images/category_images/meat.png') },
    { name: 'Seafood', image: require('../images/category_images/seafood.png') },
  ];

  // Function to handle category press
  const handleCategoryPress = (categoryName) => {
    navigation.navigate('Search', { category: categoryName, focus: false});
  };

  // Divide categories into 2 rows
  const firstRowCategories = categories.slice(0, 3);
  const secondRowCategories = categories.slice(3);

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        {firstRowCategories.map((category, index) => (
          <TouchableOpacity key={index} style={styles.categoryContainer} onPress={() => handleCategoryPress(category.name)}>
          <View style={styles.buttonContainer}>
          {category.image &&
            <Image source={category.image} style={styles.image} />
          }
          </View>
          <Text style={styles.categoryText}>{category.name}</Text>
        </TouchableOpacity>
        ))}
      </View>
      <View style={styles.rowContainer}>
        {secondRowCategories.map((category, index) => (
          <TouchableOpacity key={index} style={styles.categoryContainer} onPress={() => handleCategoryPress(category.name)}>
            <View style={styles.buttonContainer}>
            {category.image &&
              <Image source={category.image} style={styles.image} />
            }
            </View>
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    width: '100%',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FAFAFA'
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: "2%"
  },
  categoryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    //borderWidth: 1
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 50,
    marginBottom: 10,
    backgroundColor: 'lightgray'
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 25,
  },
  categoryText: {
    fontWeight: '500',
  },
});