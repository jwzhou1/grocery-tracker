import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { auth } from "../firebase/firebaseSetup";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

const Profile = ({ navigation, route }) => {
  const userUid = auth.currentUser.uid;
  const [user, setUser] = useState(auth.currentUser);
  const [updatedUsername, setUpdatedUsername] = useState(null);
  

   // set updated user name every time the user updates the profile
   useEffect(() => {
    if (route.params?.updateProfile) {
      console.log("profile is updated");
      setUpdatedUsername(user.displayName);
  
      // Set the update flag to false after handling the update
      navigation.setParams({ updateProfile: false });
    }
  }, [route.params?.updateProfile]);


  const handleEditProfilePress = () => {
    navigation.navigate("Edit Profile");
  };

  const handleWatchListPress = () => {
    navigation.navigate("Watch List");
  };

  const handleMyContributionsPress = () => {
    navigation.navigate("My Contributions");
  };

  const handleDeleteAvatar = async () => {
    // try {
    //   // 删除用户头像的逻辑
    //   await auth.currentUser.updateProfile({ photoURL: null }); // 更新用户的 photoURL 为 null
    //   setUser({ ...user, photoURL: null }); // 更新本地用户对象的 photoURL 字段为 null
    //   // 在此处添加任何其他需要执行的逻辑，比如从存储中删除头像文件等
    // } catch (error) {
    //   console.error('Error deleting photo:', error);
    // }
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
     
        <Text style={styles.text}>Hello, {user.displayName}</Text>


        {auth.currentUser.photoURL ? (
          <View style={styles.avatarContainer}>
            <Image source={{ uri: auth.currentUser.photoURL }} style={styles.avatarImage} />
            <TouchableOpacity onPress={handleDeleteAvatar} style={styles.deleteIcon}>
              <AntDesign name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ) : (
          <Image source={require('../images/default-avatar.jpg')} style={styles.avatarImage} />
        )}


        <View style={styles.emailContainer}>
          <MaterialIcons name="email" size={24} />
          <Text style={[styles.emailText]}>
            {auth.currentUser.email}
          </Text>
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
          <MaterialIcons
            name="keyboard-arrow-right"
            size={26}
            color="black"
          />
        </TouchableOpacity>

        <TouchableOpacity
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
          <MaterialIcons
            name="keyboard-arrow-right"
            size={26}
            color="black"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleMyContributionsPress()}
          style={styles.linkButton}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <AntDesign name="star" size={24} />
            <Text style={styles.text}> My Contributions</Text>
          </View>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={26}
            color="black"
          />
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
    flexDirection: "row"
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
    resizeMode: 'cover', 
    borderRadius: 8, 
  },
  deleteIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 5,
    borderRadius: 20,
  },
  
});
