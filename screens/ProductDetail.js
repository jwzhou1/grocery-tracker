import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { View, StyleSheet, Text, Image, Alert, Modal, FlatList, ScrollView, Dimensions } from 'react-native';
import PressableButton from '../components/PressableButton';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { addToShoppingList } from '../firebase/firebaseHelper';
import { auth } from '../firebase/firebaseSetup';
import Colors from '../styles/Colors';
import { ShoppingListContext } from "../utils/ShoppingListContext";
import { LineChart } from "react-native-gifted-charts";
const windowWidth = Dimensions.get('window').width;

// Next steps:
// 1.improve UI (layout, detail, snackbar)
// 2.add 2/3/6 month filter
export default function ProductDetail({ route, navigation }) {
  const { productId, product, prices, priceToShow } = route.params;
  const { numItems } = useContext(ShoppingListContext); // using the context to show number of items
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(priceToShow);
  const [latestPrices, setLatestPrices] = useState({});
  const [historyPrices, setHistoryPrices] = useState([])
  const minPrice = Math.min(...prices.map(price => price.data.price));
  const maxPrice = Math.max(...prices.map(price => price.data.price));

  const chartData = historyPrices.map(price => ({
    label: price.data.date.toDate().toLocaleDateString('default', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
    value: price.data.price,
    dataPointText: "$"+price.data.price,
    labelTextStyle: {color: 'gray', fontSize: 12}
  }));

  // dynamically update headerRight
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <PressableButton 
            pressedFunction={() => navigation.navigate("Shopping List Stack")}
          >
            <Ionicons name="cart-outline" size={28} color={Colors.headerText} />
          </PressableButton>
          {numItems !== 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{numItems}</Text>
            </View>
          )}
        </View>
      ),
    });
  }, [navigation, numItems]);
  
  useEffect(() => {
    // keep the latest price for each store in more options modal
    function getLatestPrices() {
      const priceArray = []
      const storePrices = {}
      prices.forEach((price) => {
        const { store_name } = price.data;
        if (!(store_name in storePrices)) {
          storePrices[store_name] = 1;
          priceArray.push(price)
        }
      });
      priceArray.sort((a, b) => a.data.price - b.data.price) // sort the options in ascending prices
      setLatestPrices(priceArray)
    }
    getLatestPrices()
    setSelectedPrice(priceToShow) // update the state when navigating from shopping list
  }, [priceToShow])

  useEffect(() => {
    // filter all prices history for the selected store
    const priceArray = prices.filter((price) => price.data.store_name === selectedPrice.store_name)
    priceArray.sort((a, b) => a.data.date - b.data.date) // sort the history prices in ascending dates
    setHistoryPrices(priceArray)
  }, [selectedPrice])

  async function addHandler() {
    const userId = auth.currentUser.uid;
    Alert.alert('Success', `${product.nameToShow} is added to shopping list`); // replace with a snackbar later
    await addToShoppingList(userId, productId, product.nameToShow, product.size, product.image_url, 
      product.alt_name, product.brand, product.unit, selectedPrice.store_name);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          style={styles.image}
          source={{ uri: product.image_url || 'https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png' }}
        />
        {/* Product brand, name and unit price */}
        <Text style={styles.unitPrice}>{product.brand}</Text>
        <View style={styles.rowContainer}>
          {product.alt_name ? 
          <Text style={styles.productName}>{product.nameToShow}{'\n'}({product.alt_name})</Text> :
          <Text style={styles.productName}>{product.nameToShow}</Text>}
          {selectedPrice.unit_price &&
          <Text style={styles.unitPrice}>${selectedPrice.unit_price}/{product.unit}</Text>}
        </View>

        {/* Product size information */}
        {product.size !== "each" && !product.size.includes("per") &&
        <Text style={{color: 'gray'}}>{product.size}</Text>}
        
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
        <Text style={styles.date}>Price range (across different stores)</Text>
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
          <Text style={{color: 'green', fontSize: 14}}>${minPrice}</Text>
          <Text style={{color: 'red', fontSize: 14}}>${maxPrice}</Text>
        </View>

        {/* Price Trends Chart */}
        <Text style={styles.date}>Historical trend (same-store)</Text>
        <View style={styles.chartContainer}>
          {chartData.length > 1 ?
          <LineChart
            curved 
            areaChart
            data={chartData}
            // line options
            thickness={3}
            color="lightgray"
            // layout options
            width={windowWidth*0.8}
            height={windowWidth*0.5}
            scrollToEnd={true}
            initialSpacing={20}
            endSpacing={40}
            maxValue={maxPrice*1.3}
            noOfSections={3}
            // area options
            startFillColor='#75BEBB'
            endFillColor='#D9F0EE'
            endOpacity={0.2}
            // data point options
            dataPointsColor={'rgba(100, 100, 100, 0.5)'} // datapoint color
            textColor={'black'} // datapoint text color
            textShiftX={-10}
            textShiftY={-5}
            // axis options
            xAxisColor="white"
            yAxisColor="white"
            yAxisTextStyle={{color: 'gray', fontSize: 12}}
            formatYLabel={(label)=>'$'+label}
            hideRules
          /> :
          <Text>There is not enough data to show historical trends</Text>}
        </View>

        {/* More Buying Options Modal */}
        <Modal visible={showMoreOptions} transparent={true} animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>More Buying Options</Text>
              <FlatList
                data={latestPrices}
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
      </ScrollView>

      {/* Add to List and Feedback Button */}
      <View style={styles.bottomBar}>
        <PressableButton
          customStyle={[styles.bottomBarButton, styles.feedbackButton]}
          pressedFunction={() => navigation.navigate('Feedback', { product, selectedPrice })}
        >
          <Text style={styles.feedbackText}>Provide Feedback</Text>
        </PressableButton>
        <PressableButton
          customStyle={[styles.bottomBarButton, styles.addButton]}
          pressedFunction={addHandler}
        >
          <Text style={styles.buttonText}>Add to List</Text>
        </PressableButton>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // avoid overflow
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
  },
  image: {
    width: windowWidth*0.75,
    height: windowWidth*0.625,
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
    color: 'gray',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 5
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { // ios
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.2, // ios
    shadowRadius: 4, // ios
    elevation: 5, // android
  },
  bottomBarButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: Colors.header,
    marginLeft: 10,
  },
  feedbackButton: {
    backgroundColor: 'white',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'gray'
  },
  feedbackText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold'
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold'
  },
  moreOptionsLink: {
    marginBottom: 20,
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
    marginVertical: 5
  },
  priceRangeFiller: {
    height: 7,
    flex: 1,
    flexDirection: 'row',
  },
  priceLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
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
  },
  badgeContainer: {
    position: 'absolute',
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    top: -5,
    right: -5,
  },
  badgeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 11
  },
  chartContainer: {
    marginBottom: windowWidth*0.3,
    alignItems: 'center'
  }
});