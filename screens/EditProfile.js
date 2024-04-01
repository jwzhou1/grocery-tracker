import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { auth, storage,database } from '../firebase/firebaseSetup';
import { updateProfile } from "firebase/auth";
import ImageManager from '../components/ImageManager';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { updateToUsersDB } from '../firebase/firebaseHelper';
import { getUsername } from '../firebase/firebaseHelper';
import { collection, query, where, onSnapshot } from "firebase/firestore";

const EditProfile = ({ navigation }) => {
  const user = auth.currentUser;
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [entryId, setEntryId] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(database, 'users'), where('uid', '==', user.uid)),
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const entryId = userDoc.id;
          setEntryId(entryId);
        } else {
          console.log('User document not found.');
        }
      },
      (err) => {
        console.log(err);
        if (err.code === 'permission-denied') {
          console.log('User does not have permission to access this collection');
        }
      }
    );
  
    return () => unsubscribe(); 
  }, []);


  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setEmail(user.email);
        setAvatarUrl(user.imageUri);
        const username = await getUsername(); 
        setUsername(username); 
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      if (imageUri) {
        const imageRef = await uploadImage(imageUri);
        if (imageRef) {
          // update user's profile photo
          await updateProfile(user, {
            imageUri: imageRef,
          });
        }
      }
      alert('Profile updated successfully!');
      navigation.goBack();
      navigation.navigate('Profile', { 
        updateProfile: true,
      }); 
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
              const updateEntry = {
                imageUri: uploadTask.snapshot.metadata.fullPath, // Add the image URL to the user data
              };
              updateToUsersDB(entryId, updateEntry); // Update the user document
            }
          });
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
  
  function receiveImageURI(takenImageUri) {
    setImageUri(takenImageUri);
  }

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.label}>Email: {email}</Text>
        <Text style={styles.label}>Username: {username}</Text> 
        <Text style={styles.label}>Upload New Avatar: </Text>
        <ImageManager receiveImageURI={receiveImageURI} />
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
