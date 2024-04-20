import { View, Text, StyleSheet, Alert, Image, Button } from "react-native";
import PressableButton from "./PressableButton";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useActionSheet } from '@expo/react-native-action-sheet';
import Colors from "../styles/Colors";

export default function ImageManager({ receiveImageURI }) {
  const { showActionSheetWithOptions } = useActionSheet();
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const [imageUri, setImageUri] = useState("");

  const showModal = () => {
    showActionSheetWithOptions({
      options: ['Take an Image', 'Upload from Library', 'Cancel'],
      cancelButtonIndex: 2,
      
    }, (selectedIndex) => {
      switch (selectedIndex) {
        case 0:
          takeImageHandler();
          break;

        case 1:
          pickImageHandler();
          break;
      }
    });
  }

  async function verifyPermission() {
    if (status.granted) {
      return true;
    }
    try {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async function takeImageHandler() {
    try {
      const havePermission = await verifyPermission();
      if (!havePermission) {
        Alert.alert("You need to give permission");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
      });

      if (!result.canceled) {
        receiveImageURI(result.assets[0].uri);
        setImageUri(result.assets[0].uri);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function pickImageHandler() {
    try {
      const havePermission = await verifyPermission();
      if (!havePermission) {
        Alert.alert("You need to give permission");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.canceled) {
        receiveImageURI(result.assets[0].uri);
        setImageUri(result.assets[0].uri);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <View style={styles.container}>
      <PressableButton pressedFunction={showModal} customStyle={styles.button}>
        <Text style={styles.buttonText}>Change Avatar</Text>
      </PressableButton>

      {imageUri && (
        <Image
          style={styles.image}
          source={{
            uri: imageUri,
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    alignItems: 'center'
  },
  button: {
    backgroundColor: Colors.header,
    padding: 10,
    borderRadius: 30,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  image: {
    width: 100,
    height: 100,
  },
});
