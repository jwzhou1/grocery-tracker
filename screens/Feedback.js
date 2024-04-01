import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, TextInput, Alert,TouchableOpacity  } from 'react-native';
import PressableButton from '../components/PressableButton';
import * as ImagePicker from 'expo-image-picker';
import { updatePriceInDatabase } from '../firebase/firebaseHelper';

export default function Feedback({ route, navigation }) {
  const { product, price } = route.params;
  const [imageUri, setImageUri] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const oldPrice = price.price;
  console.log('price:', price);

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
  
    const updatedPrice = {
      ...price,
      price: parseFloat(newPrice),
    };
    console.log('updatedPrice:', updatedPrice);
    console.log('storename',updatedPrice.store_name);
    console.log("productid",updatedPrice.product_id);
    
    updatePriceInDatabase(updatedPrice)
      .then(() => {
        Alert.alert('Success', 'New price has been submitted successfully');
        navigation.goBack();
      })
      .catch(error => {
        console.error('Error updating price:', error);
        Alert.alert('Error', 'Failed to submit new price');
      });
  };

  return (
    <View style={styles.container}>
      {/* Product Image */}
      <TouchableOpacity onPress={takePhoto} style={styles.imageContainer}>
        <View style={styles.imageBox}>
          {imageUri ? (
            <Image style={styles.image} source={{ uri: imageUri }} />
          ) : (
            <Text style={styles.placeholderText}>Take a Photo</Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Product Information */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Product Name:</Text>
        <Text style={styles.value}>{product.name}</Text>

        <Text style={styles.label}>Weight:</Text>
        <Text style={styles.value}>{product.unit}</Text>

        <Text style={styles.label}>Store:</Text>
        {/* Dropdown for Store */}
        <TextInput style={styles.input} placeholder="Select Store" />

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
        {/* Calendar Dropdown for Date */}
        <TextInput style={styles.input} placeholder="Select Date" />

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#ccc' }]} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#309797' }]} onPress={submitNewPrice}>
            <Text style={[styles.buttonText, { color: 'white' }]}>Submit</Text>
          </TouchableOpacity>
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
  value: {
    fontSize: 16,
    marginBottom: 15,
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