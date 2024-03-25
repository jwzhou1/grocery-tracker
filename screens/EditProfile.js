import { StyleSheet, Text, View, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { auth } from "../firebase/firebaseSetup";
import { updateProfile } from "firebase/auth";
import SaveCancelButtons from "../components/SaveCancelButtons";
import { ref, uploadBytesResumable, uploadBytes } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebaseSetup";
import LinearGradientComp from "../components/LinearGradient";

export default function EditProfile({ navigation }) {
  const user = auth.currentUser;
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const initialImageUri = null;
  const [imageUri, setImageUri] = useState(initialImageUri);

  useEffect(() => {
    // Fetch the current user's information when the component mounts
    const fetchUserData = async () => {
      try {
        setEmail(user.email);
        setUsername(user.displayName);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      // Update the username (displayName) in the Firebase Authentication
      await updateProfile(user, {
        displayName: newUsername,
      });

      // Update the local state
      setUsername(newUsername);
      // Reset the newUsername state
      setNewUsername("");

      // Handle image uploading
      if (imageUri) {
        const imageRef = await fetchImage(imageUri);
        if (imageRef) {
          // update user's profile photo
          await updateProfile(user, {
            photoURL: imageRef,
          });
        }
      }

      alert("Profile updated successfully!");
      navigation.goBack();
      navigation.navigate("Profile", { updateProfile: true });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  async function fetchImage(uri) {
    try {
      const response = await fetch(uri);
      const imageBlob = await response.blob();
      const imageName = uri.substring(uri.lastIndexOf("/") + 1);
      const imageRef = await ref(storage, `images/${imageName}`);
      const uploadResult = await uploadBytesResumable(imageRef, imageBlob);
      const downloadURL = await getDownloadURL(uploadResult.ref);
      return downloadURL;
    } catch (err) {
      console.log(err);
    }
  }

  function getImageUri(uri) {
    setImageUri(uri);
    onImageTaken && onImageTaken(uri);
  }

  function cancelHandler() {
    navigation.goBack();
  }

  return (
    <LinearGradientComp>
      <View style={styles.container}>
        <Text style={styles.label}>Email: {email}</Text>
        <Text style={styles.label}>
          Username: {auth.currentUser.displayName}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter New Username"
          value={newUsername}
          onChangeText={(text) => setNewUsername(text)}
        />
      </View>
      <SaveCancelButtons onCancel={cancelHandler} onSave={handleSave} />
    </LinearGradientComp>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: "10%",
    alignItems: "center",
  },
  input: {
    height: 50,
    width: "80%",
    margin: 12,
    borderWidth: 1,
    borderColor: "#309797",
    borderRadius: 5,
    padding: 10,
  },
  label: {
    color: "#2B2A4C",
    alignSelf: "flex-start",
    marginLeft: "10%",
    fontWeight: "bold",
    marginTop: "5%",
    fontSize: 18,
    marginBottom: "2%",
  },
});
