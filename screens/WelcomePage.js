import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';

export default function WelcomePage({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome to</Text>
        <Text style={styles.appName}>Grocery Tracker</Text>
        <FontAwesome name="shopping-bag" size={height_logo} color="white" style={styles.logo} />
      </View>

      <Animatable.View
        style={[styles.footer, { backgroundColor: '#309797' }]}
        animation="fadeInUpBig"
      >
        <Text style={styles.title}>Save Smart,</Text>
        <Text style={styles.title}>Buy With Confidence!</Text>

        <Animatable.View
          animation="fadeIn"
          delay={1500} 
          style={styles.button}
        >
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <LinearGradient
              colors={['#A6CF98', '#309797']}
              style={styles.signIn}
            >
              <Text style={styles.textSign}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>
      </Animatable.View>
    </View>
  );
};

const { height } = Dimensions.get("screen");
const height_logo = height * 0.2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#309797'
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  welcomeText: {
    fontSize: 24,
    color: 'white',
    position: 'absolute',
    top: '80%',
    textAlign: 'center',
    left: 0,
    right: 0,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    position: 'absolute',
    top: '85%', 
    textAlign: 'center',
    left: 0,
    right: 0,
  },
  footer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 30
  },
  logo: {
    alignSelf: 'center',
    marginTop: '5%',
  },
  title: {
    color: 'white',
    fontSize: 24,
    marginTop: 20,
    textAlign: 'center'
  },
  text: {
    color: 'grey',
    marginTop: 5
  },
  button: {
    alignItems: 'center',
    marginTop: 40
  },
  signIn: {
    width: '80%', 
    height: 50, 
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10, 
    flexDirection: 'row'
  },
  textSign: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 8,
    textAlign: 'center', 
    flex: 1, 
  }
});
