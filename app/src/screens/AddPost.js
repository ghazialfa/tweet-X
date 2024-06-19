import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "../helpers/tw";
import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";

const CREATE_POST = gql`
  mutation CreatePost($content: String!, $tags: [String], $imgUrl: String) {
    createPost(content: $content, tags: $tags, imgUrl: $imgUrl) {
      _id
      content
      tags
      authorId
      imgUrl
      createdAt
      updatedAt
    }
  }
`;

const AddPost = () => {
  const navigation = useNavigation();

  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [imgUrl, setImgUrl] = useState("");

  const [createPost] = useMutation(CREATE_POST);

  const handleAddTag = () => {
    if (tagInput) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const handleDeleteTag = (index) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    setTags(updatedTags);
  };

  const handlePost = async () => {
    try {
      await createPost({
        variables: {
          content,
          tags,
          imgUrl,
        },
      });
      setContent("");
      setTags([]);
      setTagInput("");
      setImgUrl("");
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={tw`p-4`}>
      <TextInput
        style={tw`w-full h-40 border border-gray-200 rounded p-2 mb-4`}
        placeholder="Write what you feel now"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <View style={tw`flex-row items-center mb-4`}>
        <TextInput
          style={tw`w-3/4 h-10 border border-gray-200 rounded p-2 mr-2`}
          placeholder="Add tags"
          value={tagInput}
          onChangeText={setTagInput}
        />
        <TouchableOpacity
          style={tw`w-1/4 h-10 items-center justify-center bg-blue-500 rounded`}
          onPress={handleAddTag}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={tw`flex-row flex-wrap`}>
        {tags.map((tag, index) => (
          <TouchableOpacity
            key={index}
            style={tw`bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold m-2`}
            onPress={() => handleDeleteTag(index)}>
            <Text>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={tw`w-full h-40 border border-gray-200 rounded p-2 my-4`}
        placeholder="Image URL"
        value={imgUrl}
        onChangeText={setImgUrl}
      />
      <TouchableOpacity
        style={tw`bg-blue-500 rounded p-2`}
        onPress={handlePost}>
        <Text style={tw`text-white text-center`}>Post</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddPost;
