import { View, Text, Image } from "react-native";
import React from "react";
import tw from "../helpers/tw";

export default function Logo({ style }) {
  return (
    <Image
      source={require("../../assets/tweet-icon.png")}
      style={[{ width: 50, height: 50 }, style]}
    />
  );
}
