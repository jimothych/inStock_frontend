import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable } from 'react-native';
import { StyleSheet, ImageBackground } from 'react-native';
import { GlobalStyles } from './global_components/global';
import { GoogleSignin, isNoSavedCredentialFoundResponse, User } from '@react-native-google-signin/google-signin';
import { GSignIn, mapPayload } from "./googleSignIn";
import theme from "./global_components/theme";
import { UserState } from "./global_components/global";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setUser } from "./redux/userSlice";

export default function SignIn() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "366513490502-5ja2tekq3qn255g9b0d5gupkg90loo5o.apps.googleusercontent.com",
      iosClientId: "366513490502-t63q7meg415m6r4r6dva3qb269crs1p3.apps.googleusercontent.com"
    });
    console.log("\n\tinside SignIn.tsx");
  }, []);

  useEffect(() => {
    async function getStoredSignIn() {
      try {
        const response = await GoogleSignin.signInSilently();
        if (response.type === "success") {
          handleGoogleSignIn(false, response.data);
        } else if (isNoSavedCredentialFoundResponse(response)) {
          //do nothing
        }
      } catch (error) { console.log(error) }
    };

    getStoredSignIn();
  }, []);

  async function handleGoogleSignIn(isDemo: boolean, cachedUser?: User) {
    if (isDemo) {
      const user: UserState = {
        photo: null,
        name: "DEMO",
        email: "jameschang21205@gmail.com",
        id: "102674853057286251419",
      };
      navigateToMain(user);
      return;
    }

    if (cachedUser) {
      const user = mapPayload(cachedUser);
      navigateToMain(user);
      return;
    }

    try {
      const payload = await GSignIn();
      const user = mapPayload(payload);
      navigateToMain(user);
    } catch (error: unknown) {
      console.log(error);
    }
  }

  function navigateToMain(user: UserState) {
    dispatch(setUser(user));
    navigation.navigate("Main");
    console.log(user);
  }

  return (
    <ImageBackground 
      source={require("../assets/inStock_login_screen.png")}
      style={GlobalStyles.container_column}
      fadeDuration={0}
      resizeMode="stretch"
    >
      <Image
        source={require("../assets/InStock_logo_full_no_bg.png")}
        style={styles.logo}
      >
      
      </Image>
      <Pressable 
        style={styles.button1}
        onPress={() => handleGoogleSignIn(false)}
      >
          <Image
            source={require("../assets/googleLogoButton.png")}
            style={styles.googleButton}
          ></Image>
          <Text style={[GlobalStyles.bold, {paddingLeft: 25, color: theme.purple2}]}>Google Sign In</Text>
      </Pressable>

      <Pressable 
        style={styles.button2}
        onPress={() => handleGoogleSignIn(true)}
      >
          <Text style={[GlobalStyles.bold, {color: theme.purple2}]}>TAP HERE TO SEE DEMO</Text>
      </Pressable>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: "80%",
    height: "10%",
    marginTop: "25%",
  },
  button1: {
    height: 70, 
    width: "70%", 
    borderWidth: 4, 
    borderColor: theme.white2,
    marginTop: 500, 
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.white,
    borderRadius: 20,
  },
  button2: {
    height: 70, 
    width: "70%", 
    borderWidth: 4, 
    borderColor: theme.white2,
    marginTop: 20, 
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.white,
    borderRadius: 20,
  },
  googleButton: {
    position: "absolute",
    width: 50,
    height: 50,
    left: 20
  }
})