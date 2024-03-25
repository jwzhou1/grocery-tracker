import React from "react";
import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { auth } from "./firebase/firebaseSetup";
import { onAuthStateChanged } from "firebase/auth";
import { Text, TouchableOpacity, Alert } from "react-native";

import WelcomePage from "./screens/WelcomePage";
import Signup from "./screens/Signup";
import Login from "./screens/Login";
import Search from "./screens/Search";
import Home from "./screens/Home";
import ShoppingList from "./screens/ShoppingList";
import Profile from "./screens/Profile";
import SearchResult from "./screens/SearchResult";
import Feedback from "./screens/Feedback";
import EditProfile from "./screens/EditProfile";
import WatchList from "./screens/WatchList";
import Map from "./screens/Map";
import MyContributions from "./screens/MyContributions";
import ProductDetail from "./screens/ProductDetail";
import BottomTabBar from "./components/BottomTabBar";
import Colors from "./styles/Colors";
import PressableButton from "./components/PressableButton";
import { Ionicons } from "@expo/vector-icons";
import ChangePassword from "./screens/ChangePassword";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Auth Screens
const AuthStack = (
  <>
    <Stack.Screen
      name="Welcome"
      component={WelcomePage}
      options={{ title: "Welcome" }}
    />
    <Stack.Screen
      name="Signup"
      component={Signup}
      options={{ title: "Sign Up" }}
    />
    <Stack.Screen
      name="Login"
      component={Login}
      options={{ title: "Log In" }}
    />
  </>
);

// Tab Screens
function TabNavigator() {
  return (
    <Tab.Navigator tabBar={(props) => <BottomTabBar {...props} />}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={({ navigation }) => ({
          headerStyle: {
            backgroundColor: Colors.header,
          },
          headerTintColor: Colors.headerText,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
        })}
      />

      <Tab.Screen
        name="ShoppingList"
        component={ShoppingList}
        options={({ navigation }) => ({
          headerStyle: {
            backgroundColor: Colors.header,
          },
          headerTintColor: Colors.headerText,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
        })}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={({ navigation }) => ({
          headerRight: () => (
            <PressableButton
              pressedFunction={() => auth.signOut()}
              pressedStyle={{
                backgroundColor: Colors.header,
                marginRight: 10,
                opacity: 0.5,
              }}
              defaultStyle={{
                backgroundColor: Colors.header,
                marginRight: 10,
              }}
            >
              <Text
                style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
              >
                Log Out
              </Text>
            </PressableButton>
          ),
          headerStyle: {
            backgroundColor: Colors.header,
          },
          headerTintColor: Colors.headerText,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
        })}
      />
    </Tab.Navigator>
  );
}

// App Screens
const AppStack = (
  <>
    <Stack.Screen name="Tabs" component={TabNavigator} />

    <Stack.Screen
      name="Edit Profile"
      component={EditProfile}
      options={{
        headerShown: true,
      }}
    />

    <Stack.Screen
      name="Search"
      component={Search}
      options={{
        headerShown: true,
      }}
    />

    <Stack.Screen
      name="SearchResult"
      component={SearchResult}
      options={{
        headerShown: true,
      }}
    />

    <Stack.Screen
      name="ProductDetail"
      component={ProductDetail}
      options={{
        headerShown: true
      }}
    />

    <Stack.Screen
      name="Feedback"
      component={Feedback}
      options={{
        headerShown: true,
      }}
    />

    <Stack.Screen
      name="Change Password"
      component={ChangePassword}
      options={{
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="Watch List"
      component={WatchList}
      options={{
        headerShown: true,
      }}
    />

    <Stack.Screen
      name="Map"
      component={Map}
      options={{
        headerShown: true,
      }}
    />

    <Stack.Screen
      name="My Contributions"
      component={MyContributions}
      options={{
        headerShown: true,
      }}
    />
  </>
);

// Default Header Options
const defaultHeaderOptions = {
  headerShown: false,
  headerStyle: {
    backgroundColor: Colors.header,
  },
  headerTintColor: Colors.headerText,
  headerTitleStyle: {
    fontWeight: "bold",
    fontSize: 20,
  },
};

// App
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={defaultHeaderOptions}>
        {loggedIn ? AppStack : AuthStack}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
