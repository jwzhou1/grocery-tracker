import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Alert } from 'react-native';
import PressableButton from '../components/PressableButton';
import * as ImagePicker from 'expo-image-picker';
import { addToContributionList } from '../firebase/firebaseHelper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { auth, storage } from '../firebase/firebaseSetup';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Colors from '../styles/Colors';

export default function Feedback({ route, navigation }) {
  const { productId, product, selectedPrice } = route.params;
  const [imageUri, setImageUri] = useState(null);
  const [uploadUri, setUploadUri] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const { showActionSheetWithOptions } = useActionSheet();

  const showModal = () => {
    showActionSheetWithOptions({
      options: ['Take an Image', 'Upload from Library', 'Cancel'],
      cancelButtonIndex: 2,
      
    }, (selectedIndex) => {
      switch (selectedIndex) {
        case 0:
          takePhoto();
          break;

        case 1:
          pickImage();
          break;
      }
    });
  }

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

  const submitNewPrice = async () => {
    if (newPrice.trim() === '') {
      Alert.alert('Error', 'Please enter a new price');
      return;
    }
    if (!selectedDate) {
      Alert.alert('Error', 'Please select a date');
      return;
    }

    const updatedPrice = {
      product_id: productId,
      product_name: product.nameToShow,
      size: product.size,
      store_name: selectedPrice.store_name,
      price: parseFloat(newPrice),
      date: selectedDate,
      uploadUri: uploadUri,
    };

    const userId = auth.currentUser.uid;
    try {
      await addToContributionList(userId, updatedPrice)
      Alert.alert('Success', 'Thank you for the feedback. You can view it in Profile > My Contributions');
      navigation.goBack();
    } catch (error) {
      console.log(error)
      Alert.alert('Error', 'Failed to submit new price');
    }
  };

  return (
    <View style={styles.container}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <PressableButton pressedFunction={showModal} customStyle={styles.imageBox}>
          {imageUri ? (
            <Image style={styles.image} source={{ uri: imageUri }} />
          ) : (
            <Text style={styles.placeholderText}>Add a Photo</Text>
          )}
        </PressableButton>
      </View>

      {/* Product Information */}
      <View style={styles.infoContainer}>
        <View style={styles.rowContainer}>
          <Text style={styles.label}>Product: </Text>
          <Text style={styles.value}>{product.nameToShow}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.label}>Size:</Text>
          <Text style={styles.value}>{product.size}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.label}>Store:</Text>
          <Text style={styles.value}>{selectedPrice.store_name}</Text>
        </View>

        <Text style={styles.label}>New Price:</Text>
        {/* Input for New Price */}
        <TextInput
          style={styles.input}
          placeholder="Enter price for the size of the product"
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
          <PressableButton customStyle={[styles.button, styles.cancelButton]} pressedFunction={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Cancel</Text>
          </PressableButton>
          <PressableButton customStyle={[styles.button, styles.submitButton]} pressedFunction={submitNewPrice}>
            <Text style={[styles.buttonText, {color: 'white'}]}>Submit</Text>
          </PressableButton>
        </View>
        <Text style={styles.noteText}>Adding a photo of the price you found could expedite the processing.</Text>
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
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.header
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
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    marginLeft: 10,
    backgroundColor: Colors.header
  },
  cancelButton: {
    marginRight: 10,
    backgroundColor: '#ccc'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600'
  },
  noteText: {
    fontSize: 10, 
    color:'gray', 
    alignSelf: 'center',
    marginVertical: 10
  }
});