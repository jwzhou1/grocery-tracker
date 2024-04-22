import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Entypo } from "@expo/vector-icons";

const EmptyScreen = ({ text, icon }) => {
  return (
    <View style={styles.container}>
      <Entypo name={icon} size={60} color="gray" />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: 'gray',
    marginVertical: 10
  },
});

export default EmptyScreen;
