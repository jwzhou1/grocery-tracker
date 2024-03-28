import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { collection, query, where, onSnapshot, sum } from 'firebase/firestore';
import { database, auth } from "../firebase/firebaseSetup";
import Colors from '../styles/Colors';
import { Dimensions } from 'react-native';

const windowHeight = Dimensions.get('window').height;

export default function CategoryCard() {
  // Define your categories here
  const categories = [
    { name: 'Category 1' },
    { name: 'Category 2' },
    { name: 'Category 3' },
    { name: 'Category 4' },
    { name: 'Category 5' },
    { name: 'Category 6' },
    { name: 'Category 7' },
    { name: 'Category 8' },
    // Add more categories as needed
  ];

  const firstRowCategories = categories.slice(0, 4);
  const secondRowCategories = categories.slice(4);

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        {firstRowCategories.map((category, index) => (
          <View key={index} style={styles.categoryContainer}>
            <View style={styles.circle}></View>
            <Text style={styles.categoryText}>{category.name}</Text>
          </View>
        ))}
      </View>
      <View style={styles.rowContainer}>
        {secondRowCategories.map((category, index) => (
          <View key={index} style={styles.categoryContainer}>
            <View style={styles.circle}></View>
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
    //height: windowHeight * 0.23,
    backgroundColor: Colors.summaryBackground,
    borderRadius: 10,
    padding: 15,
    justifyContent: 'center',
    shadowColor: 'gray',
    shadowOffset: { width: 5, height: 5 }, // Shadow offset
    shadowOpacity: 0.8, // Shadow opacity
    shadowRadius: 8, // Shadow radius
    elevation: 10, // Android shadow elevation
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
