import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CategoryCard from '../components/CategoryCard';
import PressableButton from '../components/PressableButton';
import Colors from '../styles/Colors';

export default function Home({ navigation }) {
  const currentCategory = "Produce";
  const selectedCategory = currentCategory;

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <CategoryCard />
        {/* Hot Deal Banner */}
        <Text style={styles.hotDealText}>Hot Deal</Text>
        <View style={styles.bannerContainer}>
          <ImageBackground source={require('../images/hot_deal/save-on-foods.jpg')} style={styles.bannerImage} />
        </View>
        {/* Vertical posters */}
        <View style={styles.postersContainer}>
          <ImageBackground source={require('../images/hot_deal/walmart.jpg')} style={styles.posterImage} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  bannerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  bannerImage: {
    width: 450,
    height: 150,
  },
  hotDealText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  postersContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: -10, // Adjust this value based on the height of save-on-foods image
  },
  posterImage: {
    width: 350,
    height: 350,
    marginBottom: 20, // Adjust as needed
  },
});
