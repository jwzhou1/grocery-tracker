import { View, Text, StyleSheet, Alert, Image } from "react-native";
import PressableButton from "./PressableButton";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";

export default function ImageManager({ receiveImageURI }) {
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const [imageUri, setImageUri] = useState("");

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
      <PressableButton pressedFunction={takeImageHandler} customStyle={styles.button}>
        <Text style={styles.buttonText}>Take an Image</Text>
      </PressableButton>
      <PressableButton pressedFunction={pickImageHandler} customStyle={styles.button}>
        <Text style={styles.buttonText}>Upload from Library</Text>
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
  },
  button: {
    backgroundColor: "#00796b",
    padding: 10,
    borderRadius: 5,
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
