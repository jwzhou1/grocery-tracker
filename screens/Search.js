import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import SearchBar from "../components/SearchBar";
import SearchResult from "../components/SearchResult";
import LoadingScreen from "./LoadingScreen"
import { searchFromDB, getPricesFromDB, searchCategoriesFromDB } from "../firebase/firebaseHelper";

export default function Search({ route }) {
  const { category, focus } = route.params
  const [headerText, setHeaderText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [queryResult, setQueryResult] = useState([])
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (queryResult.length === 0) {
      setShowResult(false)
    } else {
      setShowResult(true)
    }
  }, [queryResult])

  // handle searching by category
  useEffect(() => {
    async function fetchCategory() {
      if (category) {
        setHeaderText(`View all results for "${category}"`)
        setSubmitted(true)
        setLoading(true)
        // fetch all products from category
        try {
          const productData = await searchCategoriesFromDB(category)
          const productWithPrices = await Promise.all(productData.map(async (product) => {
            const prices = await getPricesFromDB(product.id);
            return { ...product, prices };
          }))
          setQueryResult(productWithPrices)
        } catch (error) {
          console.error("Error fetching category results:", error);
          setQueryResult([]); // reset query result
        } finally {
          setLoading(false)
        }
      }
    }
    fetchCategory()
  }, [])

  // handle searching by keyword
  const handleSearch = async (searchText) => {
    setSearchText(searchText)
    setHeaderText(`Results for "${searchText}"`)
    setSubmitted(true)
    setLoading(true)

    try {
      // first fetch a list of products
      const productData = await searchFromDB(searchText)
      // then fetch prices for each of them
      const productWithPrices = await Promise.all(productData.map(async (product) => {
        const prices = await getPricesFromDB(product.id);
        return { ...product, prices };
      }))
      setQueryResult(productWithPrices)
    } catch (error) {
      console.error("Error fetching search results:", error);
      setQueryResult([]); // reset query result
    } finally {
      setLoading(false)
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <SearchBar handleSearch={handleSearch} setSubmitted={setSubmitted} autoFocus={focus}/>
        {submitted && !loading && !showResult && <Text>No results</Text>}
      </View>
      {submitted && loading && <LoadingScreen />}
      {submitted && !loading && showResult && <SearchResult headerText={headerText} data={queryResult}/>}
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
    width: '90%',
    alignSelf: 'center',
  },
});
