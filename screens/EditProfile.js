import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { auth, storage } from '../firebase/firebaseSetup';
import { updateProfile } from "firebase/auth";
import ImageManager from '../components/ImageManager';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { updateToUsersDB } from '../firebase/firebaseHelper';

const EditProfile = ({ navigation }) => {
  const user = auth.currentUser;
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setEmail(user.email);
        setUsername(user.displayName);
        setAvatarUrl(user.photoURL);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      await updateProfile(user, {
        displayName: newUsername,
        photoURL: avatarUrl, // Set the avatar URL if it exists
      });

      alert('Profile updated successfully!');
      navigation.goBack();
      navigation.navigate('Profile', { updateProfile: true });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  async function uploadImage(uri) {
    try {
      const response = await fetch(uri);
      const imageBlob = await response.blob();
      const imageName = uri.substring(uri.lastIndexOf('/') + 1);
      const imageRef = ref(storage, `images/${imageName}`);
      const uploadTask = uploadBytesResumable(imageRef, imageBlob);
  
      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          console.error('Error uploading image:', error);
        },
        () => {
          // Upload completed successfully, get the metadata
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // Set the avatar URL to the full path of the uploaded image
            setAvatarUrl(uploadTask.snapshot.metadata.fullPath);
            if (user) {
              let newuser = {
                email: user.email,
                uid: user.uid,
              }
              console.log(uploadTask.snapshot.metadata.fullPath);
              updateToUsersDB(newuser, uploadTask.snapshot.metadata.fullPath); // Update user data in Firestore
            }
          });
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
  

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.label}>Email: {email}</Text>
        <Text style={styles.label}>Username: {auth.currentUser.displayName}</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter New Username"
          value={newUsername}
          onChangeText={(text) => setNewUsername(text)}
        />
        <Text style={styles.label}>Upload New Avatar: </Text>
        <ImageManager receiveImageURI={setImageUri} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => {
          handleSave();
          if (imageUri) {
            uploadImage(imageUri);
          }
        }}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    marginBottom: "10%",
    alignItems: 'center'
  },
  input: {
    height: 50,
    width: '80%',
    margin: 12,
    borderWidth: 1,
    borderColor: '#309797',
    borderRadius: 5,
    padding: 10,
  },
  label: {
    color: '#2B2A4C',
    alignSelf: 'flex-start',
    marginLeft: '10%',
    fontWeight: 'bold',
    marginTop: "5%",
    fontSize: 18,
    marginBottom: "2%",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
  }
});
