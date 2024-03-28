import { StyleSheet, Text, View, FlatList } from 'react-native'
import React from 'react'

export default function SearchResult({ searchText, data }) {
  // NEXT STEPS: 
  // 1.create ProductCard component as preview
  // 2.navigate to ProductDetail screen to display detail
  // 3.implement CRUD operations to shoppingList
  // 4.implement AddPrice screen depending on progress
  return (
    <View>
      <Text>Results for "{searchText}"</Text>
      <FlatList
        data={data}
        renderItem={({item}) => {
          return (
            <View>
              <Text>{item.id}</Text>
              <Text>{item.data.name}</Text>
              <Text>{item.data.category}</Text>
              <Text>{item.data.unit}</Text>
            </View>
          ) 
        }}
        keyExtractor={item => item.id}
      />
    </View>
  )
}

const styles = StyleSheet.create({})