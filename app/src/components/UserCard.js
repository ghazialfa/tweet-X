import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import tw from "../helpers/tw";
import ButtonFollow from "./ButtonFollow";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";

const UserCard = ({ user }) => {
  const navigation = useNavigation();
  const [idLogin, setIdLogin] = useState(null);

  useEffect(() => {
    SecureStore.getItemAsync("userId").then((id) => {
      setIdLogin(id);
    });
  });

  const handleAuthorPress = () => {
    navigation.navigate("Profile", {
      _id: user?._id,
    });
  };

  return (
    <View style={tw`flex-row items-center py-2 border-b border-gray-400`}>
      <TouchableOpacity onPress={handleAuthorPress}>
        <Image
          source={{
            uri: `https://source.unsplash.com/random/?face,${user.username}`,
          }}
          style={tw`h-12 w-12 rounded-full border-4 border-white mr-4`}
        />
      </TouchableOpacity>
      <View style={tw`flex-1`}>
        <Text style={tw`text-xl font-bold`}>{user.name ? user.name : "~"}</Text>
        <Text style={tw`text-gray-600`}>@{user.username}</Text>
      </View>
      {user._id !== idLogin && <ButtonFollow _id={user._id} />}
    </View>
  );
};

export default UserCard;
