import { View, StyleSheet, Button, Alert, Image } from "react-native";
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
      <Button title="Take an Image" onPress={takeImageHandler} />
      <Button title="Upload from Library" onPress={pickImageHandler} />
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
  image: {
    width: 100,
    height: 100,
  },
});
