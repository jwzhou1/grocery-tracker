import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Alert } from 'react-native';
import PressableButton from '../components/PressableButton';
import * as ImagePicker from 'expo-image-picker';
import { addToContributionList } from '../firebase/firebaseHelper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { auth, storage, database } from '../firebase/firebaseSetup';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export default function Feedback({ route, navigation }) {
  const { product, selectedPrice } = route.params;
  const [imageUri, setImageUri] = useState(null);
  const [uploadUri, setUploadUri] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
console.log("selectedPrice", selectedPrice);
console.log("product", product);
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
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const imageBlob = await response.blob();
      const imageName = uri.substring(uri.lastIndexOf('/') + 1);
      const storageRef = ref(storage, `contributions/${imageName}`);
      const uploadTask = uploadBytesResumable(storageRef, imageBlob);

      uploadTask.on('state_changed', null, (error) => {
        console.error('Error uploading image:', error);
      }, () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // Set the avatar URL to the full path of the uploaded image
          setImageUri(downloadURL);
          setUploadUri(uploadTask.snapshot.metadata.fullPath)
        });
      });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

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

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
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
    if (!imageUri) {
      Alert.alert('Error', 'Please take a photo');
      return;
    }
  
  
    const updatedPrice = {
      productId: selectedPrice.product_id,
      price: parseFloat(newPrice),
      date: selectedDate,
      uploadUri: uploadUri, 
    };
  
    console.log("imageUri", uploadUri);

    const userId = auth.currentUser.uid;
    addToContributionList(userId, selectedPrice.product_id, updatedPrice.price, updatedPrice.date, updatedPrice.uploadUri, product.name,selectedPrice.store_name)
      .then(() => {
        Alert.alert('Success', 'New price and photo have been submitted successfully');
        navigation.goBack();
      })
      .catch(error => {
        console.error('Error adding to contribution list:', error);
        Alert.alert('Error', 'Failed to submit new price and photo');
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