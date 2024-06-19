import { View, Text, Image } from "react-native";
import React from "react";
import { timeUpload } from "../helpers/timeUpload";
import tw from "../helpers/tw";

const CommentCard = ({ comment }) => {
  return (
    <View style={tw`flex-row border-b border-gray-300 items-start gap-3 mt-3`}>
      <View style={tw`flex-row gap-3 mb-3`}>
        <Image
          source={{
            uri: `https://source.unsplash.com/random/?face,${comment.username}`,
          }}
          style={tw`h-8 w-8 rounded-full`}
        />
        <View style={tw`flex-1`}>
          <Text style={tw`font-bold`}>{comment.username}</Text>
          <Text style={tw`text-3.7`}>{comment.content}</Text>
        </View>
        <Text style={tw`text-3 text-gray-500`}>
          {timeUpload(comment.createdAt)}
        </Text>
      </View>
    </View>
  );
};

export default CommentCard;
