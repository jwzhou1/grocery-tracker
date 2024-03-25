import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native'; // Import TouchableOpacity
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import SearchBarForHome from '../components/SearchBarForHome';
import CategoryForHome from '../components/CategoryForHome';
import LinearGradientComp from '../components/LinearGradient';

const Home = () => {
  const navigation = useNavigation();
  const currentCategory = "Fruit";
  const selectedCategory = currentCategory; // No need to use useState if the category is not changing dynamically

  const handleSearch = (searchTerm) => {
    console.log('Searching for:', searchTerm);
    // Add your search logic here
  };

  const handleMapPress = () => {
    // Navigate to Map screen
    navigation.navigate('Map');
  };

  return (
    <LinearGradientComp>
      <View style={styles.container}>
        {/* Search Bar and Map Icon */}
        <View style={styles.searchAndMapContainer}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <SearchBarForHome onSearch={handleSearch} />
          </View>

          {/* Map Icon */}
          <TouchableOpacity style={styles.mapIconContainer} onPress={handleMapPress}>
            <Ionicons name="map-outline" size={24} color="#309797" />
          </TouchableOpacity>
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
    </LinearGradientComp>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  searchAndMapContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: '2%',
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
