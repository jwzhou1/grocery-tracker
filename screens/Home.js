import React from 'react';
import { View, StyleSheet, ImageBackground, ScrollView, TouchableWithoutFeedback, Linking, Dimensions } from 'react-native';
import CategoryCard from '../components/CategoryCard';
const windowWidth = Dimensions.get('window').width;

export default function Home({ navigation }) {

  return (
    <ScrollView>
      <View style={styles.container}>
        <CategoryCard />
        {/* Example Banner */}
        <TouchableWithoutFeedback onPress={() => Linking.openURL('https://www.saveonfoods.com')}>
          <View style={styles.bannerContainer}>
            <ImageBackground source={require('../images/hot_deal/save-on-foods.jpg')} style={styles.bannerImage} />
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.postersContainer}>
          <ImageBackground source={require('../images/hot_deal/walmart.jpg')} style={styles.posterImage} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    width: windowWidth,
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
