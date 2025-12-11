import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "./redux/userSlice";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useNavigation } from "@react-navigation/native";
import { RootState } from "./redux/store";

export default function Main() {
  const userSlice = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Pressable onPress={async () => {
        await GoogleSignin.signOut();
        dispatch(clearUser());
        navigation.navigate("Sign In");
        console.log(`signed out | ${JSON.stringify(userSlice)}`)
      }}>
        <Text>Home Screen</Text>
      </Pressable>
    </View>
  );
}