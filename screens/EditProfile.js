import { StyleSheet, Text, View, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { auth } from "../firebase/firebaseSetup";
import { updateProfile } from "firebase/auth";

export default function EditProfile({ navigation }) {
  const user = auth.currentUser;
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const initialImageUri = null;

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

  return (
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
  );
};

const styles = StyleSheet.create({
  container: {
    //marginBottom: "10%",
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
