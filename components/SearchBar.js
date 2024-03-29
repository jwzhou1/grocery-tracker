import React, { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Colors from "../styles/Colors";

export default function SearchBar({ handleSearch, setSubmitted }) {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");

  const handleSearchTap = () => {
    navigation.navigate("Search");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        autoFocus={true}
        placeholder="Search products"
        placeholderTextColor="#b3b3b3"
        value={searchText}
        onChangeText={setSearchText}
        onChange={() => setSubmitted(false)}
        onFocus={handleSearchTap}
        onSubmitEditing={() => handleSearch(searchText)} // avoid direct function call
        enablesReturnKeyAutomatically={true} // ios
        clearButtonMode={'while-editing'} // ios
      />
      <Ionicons name="search" size={24} color={Colors.header} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderWidth: 1.5,
    borderColor: "#309797",
    borderRadius: 4,
    backgroundColor: "#FFFBF5",
    marginVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "black",
    paddingHorizontal: 5,
  },
});
