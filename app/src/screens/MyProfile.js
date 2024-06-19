import {
  View,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { useRoute, useNavigation } from "@react-navigation/native";
import ScreenContainer from "../components/ScreenContainer";
import tw from "../helpers/tw";
import ButtonFollow from "../components/ButtonFollow";
import * as SecureStore from "expo-secure-store";
import AuthContext from "../context/AuthContext";
import Following from "../components/Following";
import Follower from "../components/Follower";

const GET_PROFILE_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(_id: $id) {
      name
      username
      email
      _id
    }
  }
`;

const MyProfile = () => {
  const route = useRoute();
  const auth = useContext(AuthContext);
  const [userLogin, setUserLogin] = useState(null);
  const [follow, setFollow] = useState("following");

  useEffect(() => {
    getUserLogin();
  }, []);

  const getUserLogin = async () => {
    try {
      const login = await SecureStore.getItemAsync("userId");
      // console.log("🚀 ~ getUserLogin ~ login:", login);
      setUserLogin(login);
    } catch (error) {
      console.error("Error getting user login:", error);
    }
  };

  const userId = route.params?._id || userLogin;
  // console.log("🚀 ~ MyProfile ~ userId:", userId);

  const { data, loading, error, refetch } = useQuery(GET_PROFILE_BY_ID, {
    variables: { id: userId },
  });

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("userId");
      await SecureStore.deleteItemAsync("token");
      auth.setIsLogin(false);
    } catch (error) {
      console.log("🚀 ~ handleLogout ~ error:", error);
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  useEffect(() => {
    // if (userId) {
    refetch();
    // }
  }, [userId, refetch]);

  if (loading) {
    return (
      <ScreenContainer>
        <ActivityIndicator size="large" color="#0000ff" />
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer>
        <Text style={tw`text-center text-red-500`}>Error: {error.message}</Text>
      </ScreenContainer>
    );
  }

  const { name, username, email, _id } = data.getUserById;

  return (
    <>
      <View style={tw`flex-1 w-full h-full`}>
        <View style={tw`flex w-full h-25`}>
          <Image
            source={{
              uri: `https://source.unsplash.com/random/?landscape,${_id}`,
            }}
            style={tw`h-full w-full`}
          />
        </View>

        <View style={tw`absolute top-16 left-4`}>
          <Image
            source={{
              uri: `https://source.unsplash.com/random/?face,${username}`,
            }}
            style={tw`h-20 w-20 rounded-full border-4 border-white`}
          />
        </View>
        {userLogin !== userId ? (
          <View style={tw`items-end mr-4 mt-4`}>
            <ButtonFollow _id={_id} />
          </View>
        ) : (
          <View style={tw`items-end mr-4 mt-4`}>
            <TouchableOpacity
              onPress={handleLogout}
              style={tw`bg-red-500 border border-gray-300 px-3 py-1 rounded-full`}>
              <Text style={tw`text-white font-bold`}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={tw`flex m-3`}>
          <Text style={tw`font-bold text-xl`}>{name ? name : "~"}</Text>
          <Text style={tw`text-gray-500`}>@{username}</Text>
        </View>
        <View style={tw`flex-row border-b border-gray-400 justify-around mt-4`}>
          <TouchableOpacity
            onPress={() => setFollow("following")}
            style={tw`items-center`}>
            <Text
              style={tw`text-gray-500 ${
                follow === "following" && "text-green-800 font-bold"
              }`}>
              Following
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFollow("followers")}
            style={tw`items-center`}>
            <Text
              style={tw`text-gray-500 ${
                follow === "followers" && "text-green-800 font-bold"
              }`}>
              Followers
            </Text>
          </TouchableOpacity>
        </View>

        {follow === "following" ? <Following /> : <Follower />}
      </View>
    </>
  );
};

export default MyProfile;
