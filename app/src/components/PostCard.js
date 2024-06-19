import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import tw from "../helpers/tw";
import { timeUpload } from "../helpers/timeUpload";
import { useNavigation } from "@react-navigation/native";

const PostCard = ({ post }) => {
  const navigation = useNavigation();

  const handlePostPress = () => {
    navigation.navigate("HomePage", {
      screen: "Post",
      params: {
        _id: post._id,
      },
    });
  };

  const handleAuthorPress = () => {
    navigation.navigate("Profile", {
      _id: post?.authorId,
    });
  };

  return (
    <TouchableOpacity onPress={handlePostPress}>
      <View
        style={tw`flex-row gap-2 mr-16 ml-3 mt-2 border-b border-gray-400 items-start max-w-full`}>
        <TouchableOpacity onPress={handleAuthorPress}>
          <Image
            source={{
              uri: `https://source.unsplash.com/random/?face,${post?.Author?.username}`,
            }}
            style={tw`h-10 w-10 rounded-full mt-2`}
          />
        </TouchableOpacity>
        <View style={tw`flex flex-col justify-between w-full`}>
          <View style={tw`flex-row items-center justify-between mb-1`}>
            <View style={tw`flex-row items-center`}>
              {post?.Author?.name ? (
                <Text style={tw`text-lg font-bold`}>{post?.Author?.name}</Text>
              ) : (
                <Text style={tw`text-lg font-bold`}>~</Text>
              )}
              <Text style={tw`text-sm text-gray-500 ml-1`}>
                @{post?.Author?.username}
              </Text>
            </View>
            <Text style={tw`text-sm text-gray-500`}>
              {timeUpload(post.createdAt)}
            </Text>
          </View>

          <Text style={tw`text-base mb-2`}>{post?.content}</Text>

          <View style={tw`flex-row gap-5 mb-2 mt-1 items-center`}>
            {post?.tags?.map((tag, index) => (
              <Text key={index} style={tw`text-sm text-gray-500`}>
                #{tag}
              </Text>
            ))}
          </View>

          {post?.imgUrl && (
            <Image
              source={{ uri: post?.imgUrl }}
              style={tw`w-full h-60 rounded-md mb-2`}
              resizeMode="cover"
            />
          )}

          <View style={tw`flex-row gap-10 mb-2 items-center`}>
            <Text style={tw`text-sm text-gray-500`}>
              {post?.likes?.length || 0} likes
            </Text>
            <Text style={tw`text-sm text-gray-500`}>
              {post?.comments?.length || 0} comments
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PostCard;
