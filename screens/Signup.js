import { View, Text, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseSetup";
import PressableButton from "../components/PressableButton";
import { writeToUsersDB } from "../firebase/firebaseHelper";

export default function Signup({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirm] = useState("");

  const signupHandler = async () => {
    if (!email || !password || !confirmPassword) {
      alert("Please fill out all fields");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await writeToUsersDB({
          email: email,
          uid: userCredential.user.uid
      });
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        alert("Invalid email");
      } else if (error.code === "auth/email-already-in-use") {
        alert("Email already in use");
      } else if (error.code === "auth/weak-password") {
        alert("Password must be at least 6 characters");
      } else {
        alert("Error signing up: " + error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text_header}>Sign up</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          placeholderTextColor="#aaa"
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          placeholderTextColor="#aaa"
        />
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          placeholder="Confirm Password"
          onChangeText={setConfirm}
          value={confirmPassword}
          placeholderTextColor="#aaa"
        />

        <PressableButton
          customStyle={styles.buttonDefault}
          pressedFunction={signupHandler}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </PressableButton>

        <PressableButton
          customStyle={styles.buttonDefault}
          pressedFunction={() => navigation.replace("Login")}
        >
          <Text style={styles.buttonText}>Already Registered? Login</Text>
        </PressableButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9E6",
    justifyContent: 'center'
  },
  header: {
    width: "80%",
    alignSelf: "center",
  },
  footer: {
    width: "100%",
    paddingVertical: 30,
    alignItems: "center",
  },
  text_header: {
    fontWeight: "bold",
    fontSize: 30,
  },
  input: {
    height: 50,
    width: "80%",
    margin: 12,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    padding: 10,
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: "10%",
    fontWeight: "bold",
    marginTop: 10,
    fontSize: 20,
  },
  buttonDefault: {
    width: "80%",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 30,
    borderColor: "#000",
    borderWidth: 1,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 20,
  }
});
