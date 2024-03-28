import React, { useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "../components/SearchBar";
import { searchFromDB } from "../firebase/firebaseHelper";

export default function Search() {
  const handleSearch = async (searchText) => {
    console.log(searchText)
    const querySnapshot = await searchFromDB(searchText)
    querySnapshot.forEach((doc) => {
      console.log(doc.data())
      //console.log(doc.id, " => ", doc.data());
    });
  //   try {
  //     if (searchText.trim() !== "") {
  //       // Check if searchText is not empty
  //       const searchResults = await searchProductsByName(searchText);
  //       if (searchResults.length > 0) {
  //         console.log("Search results:", searchResults);
  //         navigation.navigate("SearchResult", { searchText }); // Pass searchText as parameter
  //       } else {
  //         console.log("No products found for:", searchText);
  //       }
  //     } else {
  //       console.log("Search text is empty");
  //     }
  //   } catch (error) {
  //     console.error("Error searching products:", error);
  //   }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <SearchBar handleSearch={handleSearch}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    paddingTop: 10,
  },
  searchBar: {
    width: '90%',
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: "black",
    paddingHorizontal: 10,
  },
});
