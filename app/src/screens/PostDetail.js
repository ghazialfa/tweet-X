import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useNavigation, useRoute } from "@react-navigation/native";
import tw from "../helpers/tw";
import ScreenContainer from "../components/ScreenContainer";
import { formatDate, formatHour } from "../helpers/timeUpload";
import CommentCard from "../components/CommentCard";
import Icon from "react-native-vector-icons/Ionicons";
import ButtonFollow from "../components/ButtonFollow";

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

const ADD_LIKE = gql`
  mutation AddLike($postId: ID!) {
    addLike(postId: $postId) {
      message
    }
  }
`;

const PostDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { _id } = route.params;

  const { data, loading, error, refetch } = useQuery(GET_POST_DETAIL, {
    variables: { id: _id },
  });

  const [addLike] = useMutation(ADD_LIKE);

  const handleLike = async () => {
    try {
      await addLike({
        variables: { postId: _id },
      });
      refetch();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  if (loading) {
    return (
      <ScreenContainer>
        <ActivityIndicator size="large" color="#0000ff" />
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Error loading post</Text>
      </View>
    );
  }

  const { content, Author, comments, likes, imgUrl, createdAt, authorId } =
    data?.getPostById || {};

  return (
    <ScrollView style={tw`flex m-3 gap-3`}>
      <View style={tw`flex gap-2`}>
        {/* header */}
        <View style={tw`flex-row items-center gap-3 justify-between`}>
          <View style={tw`flex-row items-center gap-3`}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Profile", {
                  _id: Author?._id,
                })
              }>
              <Image
                source={{
                  uri: `https://source.unsplash.com/random/?face,${Author?.username}`,
                }}
                style={tw`h-10 w-10 rounded-full mt-2`}
              />
            </TouchableOpacity>
            <View style={tw`flex`}>
              {Author?.name ? (
                <Text style={tw`text-4.5 font-bold`}>{Author?.name}</Text>
              ) : (
                <Text style={tw`text-4.5 font-bold`}>~</Text>
              )}
              <Text style={tw`text-3`}>@{Author?.username}</Text>
            </View>
          </View>
          <ButtonFollow _id={authorId} />
        </View>
        <Text style={tw`text-4.5`}>{content}</Text>
        {imgUrl && (
          <Image
            source={{ uri: imgUrl }}
            style={tw`w-full h-60 rounded-md mb-2`}
            resizeMode="cover"
          />
        )}
        {/* date and like */}
        <View style={tw`flex-row items-center gap-2 border-b border-gray-300`}>
          <Text style={tw`text-3 mb-2`}>{formatHour(createdAt)}</Text>
          <Text style={tw`text-3 mb-2`}>|</Text>
          <Text style={tw`text-3 mb-2`}>{formatDate(createdAt)}</Text>
        </View>
        <View style={tw`border-b border-gray-300`}>
          <View style={tw`flex-row items-center gap-5 mb-2`}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Likes", {
                  likes,
                })
              }
              style={tw`flex-row items-center gap-1`}>
              <Text style={tw`text-3.5 font-bold`}>{likes?.length}</Text>
              <Text style={tw`text-3.5`}> likes</Text>
            </TouchableOpacity>
            <View style={tw`flex-row items-center gap-1`}>
              <Text style={tw`text-3.5 font-bold`}>{comments?.length}</Text>
              <Text style={tw`text-3.5`}> comments</Text>
            </View>
          </View>
        </View>
        <View style={tw`border-b border-gray-300`}>
          <View style={tw`flex-row justify-center items-center gap-15 mb-2`}>
            <TouchableOpacity
              onPress={() => handleLike()}
              style={tw`flex-row items-center`}>
              <Icon name="heart-outline" size={24} color="black" />
              <Text style={tw`ml-1`}>Like</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("AddComment", { postId: _id })}
              style={tw`flex-row items-center`}>
              <Icon name="chatbubble-outline" size={24} color="black" />
              <Text style={tw`ml-1`}>Comment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* comments post list */}
      {comments.map((comment, index) => (
        <CommentCard key={index} comment={comment} />
      ))}
    </ScrollView>
  );
};

export default PostDetail;
