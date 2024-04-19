import { StyleSheet, Text, View, FlatList } from 'react-native'
import React from 'react'
import ProductCard from './ProductCard'

export default function SearchResult({ headerText, data }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{headerText}</Text>
      <FlatList
        contentContainerStyle={{marginBottom: 109}}
        data={data}
        renderItem={({item}) => {
          return (
            <ProductCard productId={item.id} productData={item.data} prices={item.prices}/>
          ) 
        }}
        keyExtractor={item => item.id}
        numColumns={2}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 30
  },
  title: {
    marginLeft: '5%',
    marginTop: 5,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
  }
})