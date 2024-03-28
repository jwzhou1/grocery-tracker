import React, { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Colors from "../styles/Colors";

export default function SearchBar() {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    navigation.navigate("Search");
  };

  return (
    // <PressableButton customStyle={styles.container} pressedFunction={handleSearch}>
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search..."
        placeholderTextColor="#b3b3b3"
        value={searchTerm}
        onChangeText={setSearchTerm}
        onPressIn={handleSearch}
        //editable={false} // Disable editing
      />
      <Ionicons name="search" size={24} color={Colors.header} />
    </View>
    // </PressableButton>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderWidth: 1.5,
    borderColor: "#309797",
    borderRadius: 4,
    backgroundColor: "#FFFBF5",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 15,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "black",
    paddingHorizontal: 10,
  },
});
