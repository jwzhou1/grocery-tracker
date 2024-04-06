import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, Alert, Modal, FlatList } from 'react-native';
import PressableButton from '../components/PressableButton';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { addToShoppingList } from '../firebase/firebaseHelper';
import { auth } from '../firebase/firebaseSetup';
import Colors from '../styles/Colors';

// Next steps:
// 1.save the store information when added to list (same as ShoppingList)
// 2.add historical trend chart
// 3.optimize price displaying logic (show latest price for each store)
// 4.navigate to ShoppingList
// 5.improve UI (layout, detail, snackbar)
// 6.set up notification when price drops
const ProductDetail = ({ route, navigation }) => {
  const { productId, product, prices } = route.params;
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(prices[0].data); // display most up-to-date price, change to recent cheapest
  const minPrice = Math.min(...prices.map(price => price.data.price));
  const maxPrice = Math.max(...prices.map(price => price.data.price));

  async function addHandler() {
    const userId = auth.currentUser.uid;
    Alert.alert('Success', `${product.name} is added to shopping list`); // replace with a snackbar later
    await addToShoppingList(userId, productId, product.name, product.image_url);
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{ uri: product.image_url || 'https://via.placeholder.com/150' }}
      />
      <View>
        <Text style={styles.unitPrice}>{product.brand}</Text>
        {/* Product brand, name and unit price */}
        <View style={styles.rowContainer}>
          <Text style={styles.productName}>{product.name}{'\n'}({product.alt_name})</Text>
          <Text style={styles.unitPrice}>${selectedPrice.unit_price}/{product.unit}</Text>
        </View>
        
        {/* Prices */}
        <View style={styles.rowContainer}>
          <Text style={styles.price}>${selectedPrice.price} at {selectedPrice.store_name}</Text>
          <Text style={styles.date}>Last update: {selectedPrice.date.toDate().toLocaleDateString("zh-cn", {timeZone: 'UTC'})}</Text>
        </View>

        {/* More Buying Options Button */}
        <PressableButton customStyle={styles.moreOptionsLink} pressedFunction={() => setShowMoreOptions(true)}>
          <Text style={styles.moreOptionsLinkText}>More Buying Options</Text>
        </PressableButton>

        {/* Price Range Bar */}
        <View style={styles.priceRangeContainer}>
          <View style={styles.priceRangeFiller}>
            <LinearGradient
              colors={['green', 'orange', 'red']}
              style={styles.gradientFiller}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            />
            <View style={[styles.currentPriceIndicator, { left: `${((selectedPrice.price - minPrice) / (maxPrice - minPrice)) * 99.5}%` }]} />
          </View>
        </View>
        <View style={styles.priceLabelsContainer}>
          <Text style={{color: 'green'}}>${minPrice}</Text>
          <Text style={{color: 'red'}}>${maxPrice}</Text>
        </View>
        
        {/* Add to List Button */}
        <PressableButton customStyle={styles.addButton} pressedFunction={addHandler}>
          <Text style={styles.buttonText}>Add to List</Text>
        </PressableButton>

        {/* Feedback Link */}
        <PressableButton customStyle={styles.feedbackLink} pressedFunction={() => navigation.navigate('Feedback', { product, selectedPrice })}>
          <Text style={styles.feedbackText}>Not agree on the price? Provide feedback.</Text>
        </PressableButton>

        {/* More Buying Options Modal */}
        <Modal visible={showMoreOptions} transparent={true} animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>More Buying Options</Text>
              <FlatList
                data={prices}
                renderItem={({ item }) => (
                  <PressableButton
                    customStyle={[styles.moreOptionItem, item.data === selectedPrice && styles.selectedItem]}
                    pressedFunction={() => {
                      setSelectedPrice(item.data);
                      setShowMoreOptions(false);
                    }}
                  >
                    <View style={styles.rowContainer}>
                      <Text style={styles.moreOptionText}>${item.data.price} at {item.data.store_name}</Text>
                      {item.data === selectedPrice && <MaterialIcons style={{marginRight: 5}} name="check-circle" size={24} color="green" />}
                    </View>
                  </PressableButton>
                )}
              />
              <PressableButton customStyle={styles.closeModalButton} pressedFunction={() => setShowMoreOptions(false)}>
                <Text style={styles.closeModalButtonText}>Close</Text>
              </PressableButton>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    // wrap text to the next line
    flex: 1, 
    flexWrap: 'wrap',
    maxWidth: '70%',
  },
  price: {
    fontSize: 16,
  },
  unitPrice: {
    fontSize: 16,
    color: '#666666'
  },
  date: {
    color: '#666666'
  },
  addButton: {
    backgroundColor: Colors.header,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  feedbackLink: {
    alignSelf: 'center'
  },
  feedbackText: {
    color: Colors.header,
    fontSize: 16,
  },
  moreOptionsLink: {
    marginBottom: 10,
  },
  moreOptionsLinkText: {
    color: Colors.header,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  moreOptionItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  selectedItem: {
    backgroundColor: '#F0F0F0',
  },
  moreOptionText: {
    fontSize: 16,
  },
  closeModalButton: {
    backgroundColor: Colors.header,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  closeModalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  priceRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  priceRangeFiller: {
    height: 7,
    flex: 1,
    flexDirection: 'row',
  },
  priceLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  gradientFiller: {
    flex: 1,
    borderRadius: 5,
    overflow: 'hidden',
  },
  currentPriceIndicator: {
    position: 'absolute',
    top: -4.5,
    width: 3,
    height: 15,
    backgroundColor: 'black',
  }
});

export default ProductDetail;
