import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, TextInput, Alert } from 'react-native';
import PressableButton from '../components/PressableButton';
import * as ImagePicker from 'expo-image-picker';
import { addToContributionList } from '../firebase/firebaseHelper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { auth } from "../firebase/firebaseSetup";

// Next steps:
// 1.reuse ImageManager functions
// 2.CRUD operations on users/:id/contribution
// 3.improve UI (layout, detail, snackbar)
export default function Feedback({ route, navigation }) {
  const { product, selectedPrice } = route.params;
  const [imageUri, setImageUri] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  // const [selectedStore, setSelectedStore] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  console.log("product",product);
  console.log("selectedPrice",selectedPrice);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const confirmDate = (date) => {
    hideDatePicker();
    setSelectedDate(date);
  };

  // Function to handle image selection from camera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Permission to access camera was denied');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.uri);
    }
  };

  // Function to handle image selection from gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Permission to access media library was denied');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };

  const submitNewPrice = () => {
    if (newPrice.trim() === '') {
      Alert.alert('Error', 'Please enter a new price');
      return;
    }
    if (!selectedDate) {
      Alert.alert('Error', 'Please select a date');
      return;
    }
  
    const updatedPrice = {
      productId: selectedPrice.product_id, 
      price: parseFloat(newPrice),
      date: selectedDate,
    };
    console.log('productId:', updatedPrice.productId);
    console.log("price",updatedPrice.price);
    console.log("date",updatedPrice.date);
    const userId = auth.currentUser.uid;
    addToContributionList(userId, selectedPrice.product_id, updatedPrice.price, updatedPrice.date)
      .then(() => {
        Alert.alert('Success', 'New price has been submitted successfully');
        navigation.goBack();
      })
      .catch(error => {
        console.error('Error adding to contribution list:', error);
        Alert.alert('Error', 'Failed to submit new price');
      });
  };

  return (
    <View style={styles.container}>
      {/* Product Image */}
      <PressableButton pressedFunction={takePhoto} customStyle={styles.imageContainer}>
        <View style={styles.imageBox}>
          {imageUri ? (
            <Image style={styles.image} source={{ uri: imageUri }} />
          ) : (
            <Text style={styles.placeholderText}>Take a Photo</Text>
          )}
        </View>
      </PressableButton>

      {/* Product Information */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Product Name: {product.name}</Text>
        <Text style={styles.label}>Unit: {product.quantity} {product.unit}</Text>
        <Text style={styles.label}>Store: {selectedPrice.store_name}</Text>

        <Text style={styles.label}>New Price:</Text>
        {/* Input for New Price */}
        <TextInput
          style={styles.input}
          placeholder="Enter New Price"
          keyboardType="numeric"
          value={newPrice}
          onChangeText={text => setNewPrice(text)}
        />

        <Text style={styles.label}>Date:</Text>
        {/* Date picker */}
        <PressableButton pressedFunction={showDatePicker} customStyle={styles.input}>
          <Text>{selectedDate.toDateString()}</Text>
        </PressableButton>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={confirmDate}
          onCancel={hideDatePicker}
        />


        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <PressableButton customStyle={[styles.button, { backgroundColor: '#ccc' }]} pressedFunction={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Cancel</Text>
          </PressableButton>
          <PressableButton customStyle={[styles.button, { backgroundColor: '#309797' }]} pressedFunction={submitNewPrice}>
            <Text style={[styles.buttonText, { color: 'white' }]}>Submit</Text>
          </PressableButton>
        </View>
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
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageBox: {
    width: 150,
    height: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
  placeholderText: {
    fontSize: 16,
    color: '#aaa',
  },
  infoContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 16,
  },
});