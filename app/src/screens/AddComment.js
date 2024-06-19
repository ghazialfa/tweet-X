import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import tw from "../helpers/tw";
import { gql, useMutation } from "@apollo/client";

const ADD_COMMENT = gql`
  mutation AddComment($postId: ID!, $content: String!) {
    addComment(postId: $postId, content: $content) {
      message
    }
  }
`;

const GET_POST_DETAIL = gql`
  query GetPostById($id: ID!) {
    getPostById(_id: $id) {
      _id
      content
      tags
      authorId
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      imgUrl
      createdAt
      updatedAt
      Author {
        _id
        name
        username
        email
      }
    }
  }
`;

const AddComment = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { postId } = route.params;
  const [commentText, setCommentText] = useState("");
  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [{ query: GET_POST_DETAIL, variables: { postId } }],
    onCompleted: () => {
      setCommentText("");
      navigation.goBack();
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  const handleAddComment = async () => {
    try {
      await addComment({
        variables: {
          postId,
          content: commentText,
        },
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={tw`flex-1 p-4`}>
      <TextInput
        style={tw`border border-gray-300 p-2 rounded-md mb-4`}
        placeholder="Write your comment..."
        value={commentText}
        onChangeText={setCommentText}
      />
      <Button title="Submit" onPress={handleAddComment} />
    </View>
  );
};

export default AddComment;
