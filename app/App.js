import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ApolloProvider } from "@apollo/client";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons untuk ikon
import client from "./config/apollo";
import AuthContext from "./src/context/AuthContext";
import Dashboard from "./src/screens/Dashboard";
import Home from "./src/screens/Home";
import LoginForm from "./src/screens/Login";
import Profile from "./src/screens/Profile";
import Register from "./src/screens/Register";
import PostDetail from "./src/screens/PostDetail";
import AddComment from "./src/screens/AddComment";
import Likes from "./src/screens/Likes";
import AddPost from "./src/screens/AddPost";
import SearchUser from "./src/screens/SearchUser";
import MyProfile from "./src/screens/MyProfile";
import { Text } from "react-native";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const HomeScreen = createNativeStackNavigator();

export default function App() {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync("token").then((value) => {
      if (value) {
        setIsLogin(true);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ isLogin, setIsLogin }}>
      <ApolloProvider client={client}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!isLogin ? (
              <>
                <Stack.Screen name="Dashboard" component={Dashboard} />
                <Stack.Screen name="Login" component={LoginForm} />
                <Stack.Screen name="Register" component={Register} />
              </>
            ) : (
              <Stack.Screen name="Root" component={Root} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </ApolloProvider>
    </AuthContext.Provider>
  );
}

const Root = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomePage"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let iconName;
          let color = focused ? "green" : "green";

          if (route.name === "HomePage") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "AddPost") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "MyProfile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabel: ({ focused }) => {
          let label;
          let color = focused ? "green" : "green";

          if (route.name === "HomePage") {
            label = "Home";
          } else if (route.name === "AddPost") {
            label = "Add Post";
          } else if (route.name === "Search") {
            label = "Search";
          } else if (route.name === "MyProfile") {
            label = "Profile";
          }

          return <Text style={{ color }}>{label}</Text>;
        },
      })}>
      <Tab.Screen name="HomePage" component={HomePageNavigator} />
      <Tab.Screen name="AddPost" component={AddPost} />
      <Tab.Screen name="Search" component={SearchUser} />
      <Tab.Screen name="MyProfile" component={MyProfile} />
    </Tab.Navigator>
  );
};

const HomePageNavigator = () => {
  return (
    <HomeScreen.Navigator screenOptions={{ headerShown: false }}>
      <HomeScreen.Screen name="Home" component={Home} />
      <HomeScreen.Screen name="Post" component={PostDetail} />
      <HomeScreen.Screen name="Likes" component={Likes} />
      <HomeScreen.Screen name="AddComment" component={AddComment} />
      <HomeScreen.Screen name="Profile" component={Profile} />
    </HomeScreen.Navigator>
  );
};
