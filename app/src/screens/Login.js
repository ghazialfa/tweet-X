import React, { useContext, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import tw from "../helpers/tw";
import Logo from "../components/Logo";
import ScreenContainer from "../components/ScreenContainer";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import AuthContext from "../context/AuthContext";
import * as SecureStore from "expo-secure-store";

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      name
      username
      email
      _id
      access_token
    }
  }
`;

const LoginForm = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const auth = useContext(AuthContext);

  const [loginInput, { loading, error, data }] = useMutation(LOGIN);

  const handleLogin = async () => {
    try {
      const response = await loginInput({
        variables: {
          username,
          password,
        },
      });

      if (response.data && response.data.login) {
        // console.log("🚀 ~ handleLogin ~ data:", response.data);
        await SecureStore.setItemAsync(
          "token",
          response.data.login.access_token
        );
        await SecureStore.setItemAsync("userId", response.data.login._id);
      }

      auth.setIsLogin(true);
      // console.log(auth);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // console.log(username, password, "username, password");

  return (
    <ScreenContainer>
      <Logo style={tw`w-20 h-20 mb-5`} />
      <Text style={tw`text-2xl font-bold mb-5`}>Login to your account</Text>
      <TextInput
        style={tw`w-full h-10 border border-gray-300 rounded px-3 mb-2`}
        value={username}
        onChangeText={setUsername}
        placeholder="User name"
      />
      <TextInput
        style={tw`w-full h-10 border border-gray-300 rounded px-3 mb-2`}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <TouchableOpacity
        onPress={handleLogin}
        style={tw`bg-green-800 w-40 p-1.5 rounded mt-5`}>
        <Text style={tw`text-white font-bold text-center text-lg`}>Login</Text>
      </TouchableOpacity>

      <Text style={tw`text-center text-lg mt-2`}>Or</Text>
      <TouchableOpacity
        style={tw`mt-1`}
        onPress={() => navigation.navigate("Register")}>
        <Text style={tw`text-blue-500 text-center text-lg`}>Register</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
};

export default LoginForm;
