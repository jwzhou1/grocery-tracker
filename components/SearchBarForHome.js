import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SearchBarForHome = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation();

  const handleSearch = () => {
    onSearch(searchTerm);
    navigation.navigate('Search');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleSearch}>
      <TextInput
        style={styles.input}
        placeholder="Search..."
        placeholderTextColor="#b3b3b3"
        value={searchTerm}
        onChangeText={setSearchTerm}
        editable={false} // Disable editing
      />
      <Ionicons name="search" size={24} color="#309797" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderWidth: 1.5,
    borderColor: '#309797',
    borderRadius: 4,
    backgroundColor: '#FFFBF5',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 15,
    paddingVertical: 10, 
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: 'black',
    paddingHorizontal: 10,
  },
});

export default SearchBarForHome;
