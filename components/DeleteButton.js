import { StyleSheet, Pressable, View, Text, Alert } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import PressableButton from "./PressableButton";
import { deleteFromDB } from "../firebase/firebaseHelper";

export default function DeleteButton({ entryId, onDeleteSuccess }) {
  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this entry?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteFromDB(entryId);
              onDeleteSuccess(); // A callback to update the UI after deletion
            } catch (error) {
              console.log("Error in DeleteButton: ", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <PressableButton
      pressedFunction={handleDelete}
      pressedStyle={styles.buttonPressed}
      defaultStyle={styles.buttonDefault}
    >
      <Ionicons name="ios-trash-outline" size={24} color="white" />
    </PressableButton>
  );
}

const styles = StyleSheet.create({
  buttonDefault: {
    backgroundColor: "black",
    opacity: 1,
    justifyContent: "center",
  },
  buttonPressed: {
    backgroundColor: "black",
    opacity: 0.5,
  },
});
