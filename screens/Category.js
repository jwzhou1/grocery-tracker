import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useRoute } from '@react-navigation/native';
import SearchResult from "../components/SearchResult";
import LoadingScreen from "./LoadingScreen";
import { searchCategoriesFromDB } from "../firebase/firebaseHelper";

export default function Category() {
  const route = useRoute();
  const category = route.params.category;

  const [queryResult, setQueryResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productData = await searchCategoriesFromDB(category);
        setQueryResult(productData);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setQueryResult([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  useEffect(() => {
    if (queryResult.length === 0) {
      setShowResult(false);
    } else {
      setShowResult(true);
    }
  }, [queryResult]);

  return (
    <View style={styles.container}>

      {loading && <LoadingScreen />}
      {!loading && showResult && <SearchResult searchText={category} data={queryResult} />}
      {!loading && !showResult && <Text>No results found for {category}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});