import { View, Text } from "react-native";
import React from "react";
import tw from "../helpers/tw";

const ScreenContainer = ({ children }) => {
  return (
    <View style={tw`flex-1 justify-center items-center px-5`}>{children}</View>
  );
};

export default ScreenContainer;
