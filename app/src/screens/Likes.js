import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import tw from "../helpers/tw";
import ButtonFollow from "../components/ButtonFollow";

const Likes = () => {
  const route = useRoute();
  const { likes } = route.params;
  // console.log("🚀 ~ Likes ~ likes:", likes);
  return (
    <View style={tw`flex-row justify-between items-center m-4 mb-0`}>
      <View style={tw`flex-row items-center`}>
        <Image
          source={{
            uri: `https://source.unsplash.com/random/?face,${likes[0].username}`,
          }}
          style={tw`h-10 w-10 rounded-full`}
        />
        <View style={tw`ml-3`}>
          <Text style={tw`font-bold`}>{"~"}</Text>
          <Text style={tw`text-gray-500`}>@{likes[0].username}</Text>
        </View>
      </View>
      <ButtonFollow />
    </View>
  );
};

export default Likes;
