import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import tw from "../helpers/tw";
import { gql, useMutation } from "@apollo/client";

const CHECK_FOLLOW = gql`
  mutation CheckFollow($id: ID) {
    checkFollow(_id: $id)
  }
`;

const ADD_FOLLOW = gql`
  mutation AddFollow($id: ID) {
    addFollow(_id: $id) {
      message
    }
  }
`;

const REMOVE_FOLLOW = gql`
  mutation RemoveFollow($id: ID) {
    removeFollow(_id: $id) {
      message
    }
  }
`;

const ButtonFollow = ({ _id }) => {
  const [follow, setFollow] = useState(false);

  const [addFollow, { error: errorAdd }] = useMutation(ADD_FOLLOW);
  const [
    removeFollow,
    { data: dataRemove, loading: loadingRemove, error: errorRemove },
  ] = useMutation(REMOVE_FOLLOW);
  const [
    checkFollow,
    { data: dataCheck, loading: loadingCheck, error: errorCheck },
  ] = useMutation(CHECK_FOLLOW);

  const handleFollow = async () => {
    try {
      await addFollow({ variables: { id: _id } });
      const { data } = await checkFollow({ variables: { id: _id } });
      setFollow(data.checkFollow);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleUnfollow = async () => {
    try {
      await removeFollow({ variables: { id: _id } });
      const { data } = await checkFollow({ variables: { id: _id } });
      setFollow(data.checkFollow);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  useEffect(() => {
    const checkFollowingStatus = async () => {
      try {
        const { data } = await checkFollow({ variables: { id: _id } });
        setFollow(data.checkFollow);
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    };

    checkFollowingStatus();
  }, [_id, checkFollow]);

  return (
    <>
      {follow ? (
        <TouchableOpacity
          onPress={handleUnfollow}
          style={tw`bg-black border border-gray-300 px-3 py-1 rounded-full`}>
          <Text style={tw`text-white font-bold`}>Unfollow</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={handleFollow}
          style={tw`bg-black border border-gray-300 px-3 py-1 rounded-full`}>
          <Text style={tw`text-white font-bold`}>Follow</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

export default ButtonFollow;
