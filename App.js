import React from "react";
import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { auth } from "./firebase/firebaseSetup";
import { onAuthStateChanged } from "firebase/auth";

import Signup from "./screens/Signup";
import Login from "./screens/Login";
import Search from "./screens/Search";
import Home from "./screens/Home";
import ShoppingList from "./screens/ShoppingList";
import Profile from "./screens/Profile";
import Feedback from "./screens/Feedback";
import EditProfile from "./screens/EditProfile";
import WatchList from "./screens/WatchList";
import Map from "./screens/Map";
import MyContributions from "./screens/MyContributions";
import Notification from "./screens/Notification";
import ProductDetail from "./screens/ProductDetail";
import SearchHeader from "./components/SearchHeader";
import PressableButton from "./components/PressableButton";
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from "./styles/Colors";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Auth Screens
const AuthStack = (
  <>
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
  const options = {
    headerStyle: {
      backgroundColor: Colors.header,
    },
    headerTintColor: Colors.headerText,
    headerTitleStyle: {
      fontWeight: "bold",
      fontSize: 20,
    },
    tabBarActiveTintColor: Colors.iconFocused,
    tabBarInactiveTintColor: Colors.headerText,
    tabBarLabelStyle: {
      fontSize: 11,
    },
    tabBarStyle: { backgroundColor: Colors.header, borderTopWidth: 0}, // remove default gap    
  }
  const homeOptions = {
    header: () => (
      <SearchHeader />
    ),
    tabBarIcon: ({ focused }) => (
      <FontAwesome5 name="home" size={24} color={focused ? Colors.iconFocused : Colors.headerText}/>
    ),
  }
  const listOptions = {
    tabBarIcon: ({ focused }) => (
      <FontAwesome5 name="list" size={24} color={focused ? Colors.iconFocused : Colors.headerText}/>
    ),
  }

  const profileOptions = ({ navigation }) => ({
    tabBarIcon: ({ focused }) => (
      <FontAwesome5 name="user" size={24} color={focused ? Colors.iconFocused : Colors.headerText}/>
    ),
    headerRight: () => (
      <PressableButton
        customStyle={{margin: 5}}
        pressedFunction={() => auth.signOut()}
      >
        <FontAwesome5 name="sign-out-alt" size={24} color={Colors.headerText}/>
      </PressableButton>
    ),
    headerStyle: {
      backgroundColor: Colors.header,
    },
    headerTintColor: Colors.headerText,
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 20,
    }
  });

  return (
    <Tab.Navigator screenOptions={options}>
      <Tab.Screen name="Home" component={Home} options={homeOptions}/>
      <Tab.Screen name="Shopping List" component={ShoppingList} options={listOptions}/>
      <Tab.Screen name="Profile" component={Profile} options={profileOptions}/>
    </Tab.Navigator>
  );
}

// App Screens
const AppStack = (
  <>
    <Stack.Screen name="Tabs" component={TabNavigator}/>
    <Stack.Screen name="Edit Profile" component={EditProfile}
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
      name="Product Detail"
      component={ProductDetail}
      options={{
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="Feedback"
      component={Feedback}
      options={{
        headerShown: true,
        headerBackTitleVisible: false
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
        <Stack.Screen
      name="Notification"
      component={Notification}
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