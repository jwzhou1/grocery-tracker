import { View, Text, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseSetup";
import PressableButton from "../components/PressableButton";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = async () => {
    if (!email || !password) {
      alert("Please fill out all fields");
      return;
    }

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      console.log(userCred);
    } catch (error) {
      console.log(error.code);
      if (error.code === "auth/invalid-login-credentials") {
        alert("Invalid email or password");
      } else if (error.code === "auth/wrong-password") {
        alert("Incorrect password");
      } else if (error.code === "auth/user-not-found") {
        alert("No user found with this email");
      } else {
        alert("Error logging in: " + error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text_header}>Let's get started!</Text>
      </View>
      <View style={styles.footerContainer}>
        <View style={styles.footer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            onChangeText={setEmail}
            value={email}
            placeholder="Email"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            placeholderTextColor="#aaa"
          />

          <PressableButton
            pressedFunction={loginHandler}
            pressedStyle={styles.buttonLoginPressed}
            defaultStyle={styles.buttonLoginDefault}
          >
            <Text style={styles.buttonLoginText}>
              Already Registered? Login
            </Text>
          </PressableButton>

          <PressableButton
            pressedFunction={() => navigation.navigate("Signup")}
            pressedStyle={styles.buttonSignupPressed}
            defaultStyle={styles.buttonSignupDefault}
          >
            <Text style={styles.buttonSignupText}>Register</Text>
          </PressableButton>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2FFE9",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
    alignItems: "center",
  },
  footerContainer: {
    flex: 3,
    alignItems: "center",
  },
  footer: {
    backgroundColor: "#F2FFE9",
    width: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 30,
    alignItems: "center",
  },
  text_header: {
    marginLeft: "5%",
    color: "#000",
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
    color: "#000",
  },
  label: {
    color: "#000",
    alignSelf: "flex-start",
    marginLeft: "10%",
    fontWeight: "bold",
    marginTop: 10,
    fontSize: 20,
  },
  buttonLoginDefault: {
    backgroundColor: "#F2FFE9",
    width: "80%",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 30,
    borderColor: "#000",
    borderWidth: 1,
  },
  buttonLoginPressed: {
    backgroundColor: "#000",
    width: "80%",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 30,
    borderColor: "#000",
    borderWidth: 1,
    opacity: 0.5,
  },
  buttonSignupDefault: {
    backgroundColor: "#F2FFE9",
    borderWidth: 1,
    borderColor: "#000",
    width: "80%",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 30,
  },
  buttonSignupPressed: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    width: "80%",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 30,
    opacity: 0.5,
  },
  buttonLoginText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 20,
  },
  buttonSignupText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});
