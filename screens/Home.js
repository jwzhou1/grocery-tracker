import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import SearchBarForHome from '../components/SearchBarForHome';
import CategoryForHome from '../components/CategoryForHome';
import PressableButton from '../components/PressableButton';
import * as Location from 'expo-location';

export default function Home() {
  const navigation = useNavigation();
  const currentCategory = "Fruit";
  const selectedCategory = currentCategory;

  const [currentAddress, setCurrentAddress] = useState(null);

  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access location was denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const address = await Location.reverseGeocodeAsync({ latitude, longitude });
        const fullAddress = `${address[0].name}, ${address[0].city}, ${address[0].region}`;
        
        setCurrentAddress(fullAddress);
      } catch (error) {
        console.error('Error getting current location:', error);
      }
    };

    getCurrentLocation();
  }, []);

  const handleSearch = (searchTerm) => {
    console.log('Searching for:', searchTerm);
  };

  const handleMapPress = () => {
    navigation.navigate('Map');
  };

  return (
    <View style={styles.container}>
      {/* Display current address */}
      <View style={styles.addressContainer}>
        {/* Icon for coordinates */}
        <Ionicons name="location" size={24} color="#309797" style={styles.icon} />

        {/* Text for current address */}
        {currentAddress && (
          <Text style={styles.addressText}>{currentAddress}</Text>
        )}
      </View>

      {/* Search Bar and Map Icon */}
      <View style={styles.searchAndMapContainer}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBarForHome onSearch={handleSearch} />
        </View>

        {/* Map Icon */}
        <PressableButton customStyle={styles.mapIconContainer} pressedFunction={handleMapPress}>
          <Ionicons name="map-outline" size={24} color="#309797" />
        </PressableButton>
      </View>

      {/* Category */}
      <View style={styles.categoryContainer}>
        <CategoryForHome selectedCategory={selectedCategory}/>
      </View>

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
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: -10, // Adjusted margin here
  },
  icon: {
    marginRight: 10,
  },
  addressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#309797',
  },
  searchAndMapContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: -60, // Adjusted margin here
  },
  searchContainer: {
    flex: 1,
  },
  mapIconContainer: {
    marginLeft: 10,
  },
  categoryContainer: {
    width: '100%',
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
    color: 'black',
    marginTop: 20,
  },
});
