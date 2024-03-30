import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { collection, query, where, onSnapshot, sum } from 'firebase/firestore';
import { database, auth } from "../firebase/firebaseSetup";
import Colors from '../styles/Colors';
import { Dimensions } from 'react-native';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export default function CategoryCard() {
  // Define your categories here
  const categories = [
    { name: 'Produce', image: require('../images/category_images/produce.png') },
    { name: 'Drinks' },
    { name: 'Food' },
    { name: 'Groceries' },
    { name: 'Meat' },
    { name: 'Seafood' },
  ];

  // Divide categories into 2 rows
  const firstRowCategories = categories.slice(0, 3);
  const secondRowCategories = categories.slice(3);

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        {firstRowCategories.map((category, index) => (
          <View key={index} style={styles.categoryContainer}>
            {category.image ? (
              <Image source={category.image} style={styles.image} />
            ) : (
              <View style={styles.circle} />
            )}
            <Text style={styles.categoryText}>{category.name}</Text>
          </View>
        ))}
      </View>
      <View style={styles.rowContainer}>
        {secondRowCategories.map((category, index) => (
          <View key={index} style={styles.categoryContainer}>
            {category.image ? (
              <Image source={category.image} style={styles.image} />
            ) : (
              <View style={styles.circle} />
            )}
            <Text style={styles.categoryText}>{category.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '90%',
    backgroundColor: Colors.summaryBackground,
    borderRadius: 10,
    padding: 15,
    justifyContent: 'center',
    shadowColor: 'gray',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  categoryContainer: {
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    marginBottom: 5,
  },
  categoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
