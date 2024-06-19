import React, { useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import tw from "../helpers/tw";
import PostCard from "../components/PostCard";
import { gql, useQuery } from "@apollo/client";
import ScreenContainer from "../components/ScreenContainer";
import { useFocusEffect } from "@react-navigation/native";

const GET_POSTS = gql`
  query GetPosts {
    getPosts {
      _id
      Author {
        name
        username
        email
        _id
      }
      content
      createdAt
      imgUrl
      tags
      updatedAt
      authorId
      likes {
        username
      }
      comments {
        username
      }
    }
  }
`;

const Home = ({ navigation }) => {
  const { data, loading, error, refetch } = useQuery(GET_POSTS);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

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

  const renderPost = ({ item }) => <PostCard post={item} />;

  return (
    <FlatList
      data={data.getPosts}
      keyExtractor={(item) => item._id}
      renderItem={renderPost}
    />
  );
};

export default Home;
