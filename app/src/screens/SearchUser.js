import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList } from "react-native";
import tw from "../helpers/tw";
import { gql, useQuery } from "@apollo/client";
import UserCard from "../components/UserCard";

const GET_USER_BY_USERNAME = gql`
  query GetUserByUsername($username: String) {
    getUserByUsername(username: $username) {
      email
      name
      username
      _id
    }
  }
`;

const SearchUser = () => {
  const [query, setQuery] = useState("");
  const { loading, data, error } = useQuery(GET_USER_BY_USERNAME, {
    variables: { username: query },
  });

  // console.log("🚀 ~ SearchUser ~ data:", data.getUserByUsername);
  return (
    <View style={tw`flex-1 p-5`}>
      <Text style={tw`text-center text-xl font-bold mb-5`}>Search User</Text>
      <TextInput
        style={tw`h-10 border border-gray-400 mb-5 px-3`}
        placeholder="Search"
        value={query}
        onChangeText={setQuery}
      />
      {query && data?.getUserByUsername ? (
        <FlatList
          data={data?.getUserByUsername}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <UserCard user={item} />}
        />
      ) : query && !data ? (
        <Text style={tw`text-gray-500`}>No users found.</Text>
      ) : (
        <Text style={tw`text-gray-500`}>
          Please enter a query to search users.
        </Text>
      )}
    </View>
  );
};

export default SearchUser;
