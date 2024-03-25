import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SearchScreen = () => {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleItem1Press = () => {
    navigation.navigate('SearchResult', { searchText: 'Item1' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search by video price..."
          placeholderTextColor="#b3b3b3"
        />
        <Ionicons name="search" size={24} color="#309797" />
      </View>
      {/* TouchableOpacity wraps around Item1 text */}
      <TouchableOpacity onPress={handleItem1Press}>
        <Text style={styles.defaultSearchItem}>Item1</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#309797',
    backgroundColor: '#FFFBF5',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: 'black',
    paddingHorizontal: 10,
  },
  backButton: {
    padding: 10,
  },
  defaultSearchItem: {
    fontSize: 16,
    color: '#309797',
    marginLeft: 10,
  },
});

export default SearchScreen;
