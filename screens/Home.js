import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CategoryCard from '../components/CategoryCard';
import PressableButton from '../components/PressableButton';
import Colors from '../styles/Colors';

export default function Home({ navigation }) {
  const currentCategory = "Fruit";
  const selectedCategory = currentCategory;

  return (
    <View style={styles.container}>
      <CategoryCard />
      {/* Hot Deal Banner */}
      <Text style={styles.hotDealText}>Hot Deal</Text>
      <View style={styles.bannerContainer}>
        <ImageBackground source={require('../images/hotdeal.jpg')} style={styles.bannerImage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'space-around',
    alignItems: 'center',
  },
  bannerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  bannerImage: {
    width: 100,
    height: 100,
  },
  hotDealText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
});
