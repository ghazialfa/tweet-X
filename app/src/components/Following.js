import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import UserCard from "./UserCard";
import tw from "../helpers/tw";
import ButtonFollow from "./ButtonFollow";
import { useRoute } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

const GET_FOLLOWING = gql`
  query GetFollowing($userId: ID) {
    getFollowing(userId: $userId) {
      _id
      followerId
      followingId
      createdAt
      updatedAt
      FollowerData {
        _id
        name
        username
        email
      }
      FollowingData {
        _id
        name
        username
        email
      }
    }
  }
`;

const Following = () => {
  const route = useRoute();
  const [userLogin, setUserLogin] = useState(null);

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
  // console.log("🚀 ~ Following ~ userId:", userId);

  const { data, loading, error, refetch } = useQuery(GET_FOLLOWING, {
    variables: {
      userId,
    },
  });
  // console.log("🚀 ~ Following ~ data:", data);
  const following = data?.getFollowing.FollowingData;
  // console.log("🚀 ~ Following ~ following:", following);

  const handleAuthorPress = () => {
    navigation.navigate("Profile", {
      _id: user?._id,
    });
  };

  return (
    <>
      {following ? (
        <FlatList
          data={following}
          keyExtractor={(item) => item?._id}
          renderItem={({ item }) => (
            <View
              style={tw`flex-row items-center py-2 border-b border-gray-400`}>
              <TouchableOpacity onPress={handleAuthorPress}>
                <Image
                  source={{
                    uri: `https://source.unsplash.com/random/?face,${item?.username}`,
                  }}
                  style={tw`h-12 w-12 rounded-full border-4 border-white mr-4`}
                />
              </TouchableOpacity>
              <View style={tw`flex-1`}>
                <Text style={tw`text-xl font-bold`}>
                  {item?.name ? item?.name : "~"}
                </Text>
                <Text style={tw`text-gray-600`}>@{item?.username}</Text>
              </View>
              <ButtonFollow _id={item?._id} />
            </View>
          )}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default Following;
