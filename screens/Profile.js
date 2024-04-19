import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import {
  doc,
  getDocs,
  query,
  collection,
  where,
  getDoc,
  onSnapshot,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { database } from "../firebase/firebaseSetup";
import { auth, storage } from "../firebase/firebaseSetup";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { ref, getDownloadURL, deleteObject } from "firebase/storage";
import { Ionicons } from "@expo/vector-icons";
//import { fetchWeatherData, getUserLocation } from "../components/weatherAPI";

const Profile = ({ navigation }) => {
  const user = auth.currentUser;
  const [imageURL, setImageURL] = useState("");
  //const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(database, "users"), where("uid", "==", user.uid)),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "modified") {
            const userData = change.doc.data();
            const imageUri = userData.imageUri;
            // Ensure imageUri is not null or empty before proceeding
            if (imageUri) {
              const imageRef = ref(storage, imageUri);
              getDownloadURL(imageRef)
                .then((imageDownloadURL) => {
                  setImageURL(imageDownloadURL);
                })
                .catch((error) => {
                  console.error("Error fetching image URL:", error);
                });
            }
          }
        });
      }
    );
    return () => {
      console.log("unsubscribe");
      unsubscribe();
    };
  }, []);

  // useEffect(() => {
  //   const getWeatherData = async () => {
  //     const userLocation = await getUserLocation();
  //     if (userLocation) {
  //       const data = await fetchWeatherData(
  //         userLocation.latitude,
  //         userLocation.longitude
  //       );
  //       if (data) {
  //         setWeatherData(data);
  //       }
  //     }
  //   };

  //   getWeatherData();
  // }, []);

  useEffect(() => {
    async function getImageURL() {
      //console.log("auth.currentUser", auth.currentUser);
      if (auth.currentUser) {
        const userUid = auth.currentUser.uid;
        try {
          const userQuery = query(
            collection(database, "users"),
            where("uid", "==", userUid)
          );
          const querySnapshot = await getDocs(userQuery);

          let userId;
          querySnapshot.forEach((doc) => {
            userId = doc.id;
          });
          const userRef = doc(database, "users", userId);
          const userDocSnapshot = await getDoc(userRef);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            const imageUri = userData.imageUri;
            if (imageUri) {
              const imageRef = ref(storage, imageUri);
              const imageDownloadURL = await getDownloadURL(imageRef);
              console.log("imageDownloadURL", imageDownloadURL);
              setImageURL(imageDownloadURL);
            } else {
              console.log("imageUri is empty.");
            }
          } else {
            console.log("user document does not exist.");
          }
        } catch (error) {
          console.error("Error fetching image URL:", error);
        }
      }
    }
    getImageURL();
  }, []);

  const handleEditProfilePress = () => {
    navigation.navigate("Edit Profile");
  };

  // const handleWatchListPress = () => {
  //   navigation.navigate("Watch List");
  // };

  const handleMyContributionsPress = () => {
    navigation.navigate("My Contributions");
  };

  const handleNotificationPress = () => {
    navigation.navigate("Notification");
  };

  const handleDeleteAvatar = async () => {
    try {
      if (imageURL) {
        // Extract the image name from the URL
        const imageNameWithQueryParams = imageURL.substring(
          imageURL.lastIndexOf("/") + 1
        );
        const imageNameWithoutQueryParams =
          imageNameWithQueryParams.split("?")[0];
        const decodedImageName = decodeURIComponent(
          imageNameWithoutQueryParams
        );
        console.log("Deleting image:", decodedImageName);
        // Create a reference to the image in Firebase Storage
        const imageRef = ref(storage, decodedImageName);
        // Delete the image from Firebase Storage
        await deleteObject(imageRef);
        // Update the user data to remove the imageUri field
        const userID = auth.currentUser.uid;
        const userQuery = query(
          collection(database, "users"),
          where("uid", "==", userID)
        );
        const querySnapshot = await getDocs(userQuery);
        let userId;
        querySnapshot.forEach((doc) => {
          userId = doc.id;
        });
        const userRef = doc(database, "users", userId);
        await updateDoc(userRef, {
          imageUri: deleteField(),
        });
        // Reset the imageURL state to empty
        setImageURL("");
      } else {
        console.warn("No image to delete.");
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* {weatherData && (
        <View style={styles.weatherContainer}>
          <Text style={styles.weatherText}>
            Tomorrow's Weather: {weatherData.timezoneAbbreviation}
          </Text>
          <Text style={styles.weatherText}>
            High: {Math.max(...weatherData.hourly.temperature_2m)}°C
          </Text>
          <Text style={styles.weatherText}>
            Low: {Math.min(...weatherData.hourly.temperature_2m)}°C
          </Text>
          <Text style={styles.weatherText}>
            Precipitation Probability:{" "}
            {Math.round(
              weatherData.hourly.precipitation_probability.reduce(
                (a, b) => a + b
              ) / weatherData.hourly.precipitation_probability.length
            )}
            %
          </Text>
        </View>
      )} */}
      <View style={styles.userInfoContainer}>
        {imageURL ? (
          <View>
            <Image
              style={styles.avatarImage}
              source={{
                uri: imageURL,
              }}
            />
            <TouchableOpacity
              style={styles.deleteIcon}
              onPress={handleDeleteAvatar}
            >
              <MaterialIcons name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Image
              style={styles.avatarImage}
              source={require("../images/default-avatar.jpg")}
            />
          </View>
        )}

        <View style={styles.emailContainer}>
          <MaterialIcons name="email" size={24} />
          <Text style={[styles.emailText]}>{auth.currentUser.email}</Text>
        </View>
      </View>

      <View style={styles.linkContainer}>
        <TouchableOpacity
          onPress={() => handleEditProfilePress()}
          style={styles.linkButton}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <AntDesign name="edit" size={24} color="#163020" />
            <Text style={styles.text}> Edit Profile</Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={26} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleNotificationPress()}
          style={styles.linkButton}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="notifications-outline" size={24} />
            <Text style={styles.text}>Schedule an Notification</Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={26} color="black" />
        </TouchableOpacity>

        {/* <TouchableOpacity
          onPress={() => handleWatchListPress()}
          style={styles.linkButton}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons
              name="playlist-edit"
              size={24}
              color="#163020"
            />
            <Text style={styles.text}> My Watch List</Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={26} color="black" />
        </TouchableOpacity> */}

        <TouchableOpacity
          onPress={() => handleMyContributionsPress()}
          style={styles.linkButton}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <AntDesign name="star" size={24} />
            <Text style={styles.text}> My Contributions</Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={26} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  userInfoContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    height: "25%",
    padding: 10,
    marginTop: "5%",
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  displayNameText: {
    marginTop: "8%",
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: "5%",
    color: "black",
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: 'center',
  },
  emailText: {
    fontSize: 14,
    color: "#163020",
  },
  linkContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginVertical: 20,
  },
  linkButton: {
    flexDirection: "row",
    backgroundColor: "#fff",
    width: "90%",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    margin: 10,
    borderRadius: 8,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: "lightgray",
  },
  text: {
    color: "#163020",
    fontSize: 18,
    padding: 3,
    fontWeight: "bold",
  },
  avatarImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderRadius: 8,
  },
  deleteIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    padding: 5,
    borderRadius: 20,
  },
  weatherContainer: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  weatherText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
