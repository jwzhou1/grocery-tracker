import { StyleSheet, Text, View, FlatList } from 'react-native'
import React from 'react'
import ProductCard from './ProductCard'

export default function SearchResult({ searchText, data }) {
  // NEXT STEPS: 
  // 1.create ProductCard component as preview
  // 2.navigate to ProductDetail screen to display detail
  // 3.implement CRUD operations to shoppingList
  // 4.implement AddPrice screen depending on progress
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Results for "{searchText}"</Text>
      <FlatList
        data={data}
        renderItem={({item}) => {
          return (
            <ProductCard productId={item.id} product={item.data}/>
          ) 
        }}
        keyExtractor={item => item.id}
        //numColumns={2}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginLeft: '5%',
    marginVertical: 5,
    fontSize: 16,
    fontWeight: 'bold'
  }
})