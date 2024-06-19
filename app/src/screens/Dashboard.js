import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import tw from "../helpers/tw";
import Logo from "../components/Logo";
import ScreenContainer from "../components/ScreenContainer";

const Dashboard = ({ navigation }) => {
  return (
    <ScreenContainer>
      <Logo style={tw`w-20 h-20`} />
      <Text style={tw`text-10 text-green-900 font-bold mb-5`}>Tweet-X</Text>
      <View style={tw`flex mt-5 gap-4`}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={tw`bg-green-800 w-40 p-1.5 rounded`}>
          <Text style={tw`text-white font-bold text-center text-lg`}>
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
          style={tw`bg-white border border-green-800 w-40 p-1.5 rounded`}>
          <Text style={tw`text-green-800 font-bold text-center text-lg`}>
            Register
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};

export default Dashboard;
