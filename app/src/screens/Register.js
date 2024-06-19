import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import tw from "../helpers/tw";
import Logo from "../components/Logo";
import ScreenContainer from "../components/ScreenContainer";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

const REGISTER = gql`
  mutation Register(
    $username: String!
    $email: String!
    $password: String!
    $name: String
  ) {
    register(
      username: $username
      email: $email
      password: $password
      name: $name
    ) {
      _id
    }
  }
`;

const RegisterForm = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [registerInput, { loading, error, data }] = useMutation(REGISTER);

  const handleRegister = async () => {
    try {
      await registerInput({
        variables: {
          username,
          email,
          password,
          name,
        },
      });
      setEmail("");
      setPassword("");
      setUsername("");
      setName("");
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScreenContainer>
      <Logo style={tw`w-20 h-20 mb-5`} />
      <Text style={tw`text-2xl font-bold mb-5`}>Create your account</Text>
      <TextInput
        style={tw`w-full h-10 border border-gray-300 rounded px-3 mb-2`}
        value={name}
        onChangeText={setName}
        placeholder="Name"
      />
      <TextInput
        style={tw`w-full h-10 border border-gray-300 rounded px-3 mb-2`}
        value={username}
        onChangeText={setUsername}
        placeholder="User name"
      />
      <TextInput
        style={tw`w-full h-10 border border-gray-300 rounded px-3 mb-2`}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
      />
      <TextInput
        style={tw`w-full h-10 border border-gray-300 rounded px-3 mb-2`}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <TouchableOpacity
        onPress={handleRegister}
        style={tw`bg-green-800 w-40 p-1.5 rounded mt-5`}>
        <Text style={tw`text-white font-bold text-center text-lg`}>
          Register
        </Text>
      </TouchableOpacity>

      <Text style={tw`text-center text-lg mt-2`}>Or</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        style={tw`mt-1`}>
        <Text style={tw`text-blue-500 text-center text-lg`}>Login</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
};

export default RegisterForm;
