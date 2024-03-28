import { StyleSheet, Text, View } from 'react-native'
import { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native'
import SearchBar from './SearchBar';
import PressableButton from './PressableButton';
import Colors from '../styles/Colors';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';


export default function SearchHeader() {
  const navigation = useNavigation() 
  const [currentAddress, setCurrentAddress] = useState(null);
  const handleMapPress = () => {
    navigation.navigate('Map');
  };

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

  return (
    <View style={styles.container}>
      <View style={styles.addressContainer}>
        {/* Icon for coordinates */}
        <Ionicons name="location" size={16} color={Colors.header}/>
        {currentAddress && (
          <Text style={styles.addressText}>{currentAddress}</Text>
        )}
      </View>
      <View style={styles.searchAndMapContainer}>
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <SearchBar />
        </View>

        {/* Map Icon */}
        <PressableButton customStyle={styles.mapIcon} pressedFunction={handleMapPress}>
          <Ionicons name="map-outline" size={24} color={Colors.header} />
        </PressableButton>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    //justifyContent: 'space-around',
    alignItems: 'center',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 55
  },
  addressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.header,
  },
  searchAndMapContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    margin: 5
  },
  searchBar: {
    flex: 1,
  },
  mapIcon: {
    margin: 10,
  }
});