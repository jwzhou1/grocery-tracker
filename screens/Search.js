import React, { useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { searchProductsByName } from "../firebase/firebaseHelper";

export default function Search() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");

  const handleSearch = async () => {
    try {
      if (searchText.trim() !== "") {
        // Check if searchText is not empty
        const searchResults = await searchProductsByName(searchText);
        if (searchResults.length > 0) {
          console.log("Search results:", searchResults);
          navigation.navigate("SearchResult", { searchText }); // Pass searchText as parameter
        } else {
          console.log("No products found for:", searchText);
        }
      } else {
        console.log("Search text is empty");
      }
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search by product name..."
          placeholderTextColor="#b3b3b3"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity onPress={handleSearch}>
          <Ionicons name="search" size={24} color="#309797" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#309797",
    backgroundColor: "#FFFBF5",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: "black",
    paddingHorizontal: 10,
  },
});
