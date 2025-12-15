import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../redux/userSlice";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useNavigation, StackActions } from "@react-navigation/native";
import { RootState } from "../redux/store";
import theme from "../global/theme";
import { GlobalStyles, Header, SafeArea, Scroll } from "../global/global";
import Toast from "react-native-toast-message";

export default function SettingsPage() {
  const userSlice = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  async function SignOut() {
    await GoogleSignin.signOut();
    dispatch(clearUser());
    navigation.dispatch(StackActions.replace('SignIn'));
    console.log(`signed out | ${JSON.stringify(userSlice)}`);
    Toast.show({
      type: 'info',
      text1: "SIGNED OUT",
      visibilityTime: 2000,
    });
  }

  return (
    <SafeArea backgroundColor={theme.purple2}>
      <Header text="Settings" />
      <Scroll>
      <View style={[GlobalStyles.container_card, { backgroundColor: theme.white2, marginTop: 10 }]}>
        <Image
          style={styles.profile_pic}
          source={userSlice.photo ? { uri: userSlice.photo } : require("@/assets/logo.png")}
        />
        <Text style={[GlobalStyles.bold_italic, {color: theme.purple2}]}>
          {userSlice.name}
        </Text>
        <Text style={[GlobalStyles.light_italic, {color: theme.purple2}]}>
          {userSlice.email}
        </Text>
      </View>
      </Scroll>

      <Pressable 
        style={styles.red_button}
        onPress={async () => SignOut()}
      >
        <Text style={[GlobalStyles.bold, {color: theme.white3}]}>
          SIGN OUT
        </Text>
      </Pressable>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  profile_pic: {
    marginBottom: 10,
    width: 180, 
    height: 180,
    borderRadius: 180, 
    borderColor: theme.white1,
    borderWidth: 4
  },
  red_button: {
    position: "absolute",
    height: 70, 
    width: "55%", 
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.magenta,
    borderRadius: 16,
    bottom: 35,
  },
})