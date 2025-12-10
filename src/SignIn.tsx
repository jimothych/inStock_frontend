import React, { useEffect, useState } from "react";
import { View, Text, Image, Button, Pressable } from 'react-native';
import { StyleSheet, ImageBackground } from 'react-native';
import { GlobalStyles } from './global_components/global';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

import GoogleSignIn from './googleSignIn';

export default function SignIn() {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "366513490502-5ja2tekq3qn255g9b0d5gupkg90loo5o.apps.googleusercontent.com",
      iosClientId: "366513490502-t63q7meg415m6r4r6dva3qb269crs1p3.apps.googleusercontent.com"
    });
    console.log("\n\tinside SignIn.tsx");
  })

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
        style={styles.button}
        onPress={() => GoogleSignIn()}
        >
          <Image
            source={require("../assets/googleLogoButton.png")}
            style={styles.googleButton}
          ></Image>
          <Text style={{ paddingLeft: 25 }}>Google Sign In</Text>
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
  button: {
    height: 70, 
    width: "70%", 
    borderWidth: 4, 
    borderColor: "#eadee2",
    marginTop: 'auto', 
    marginBottom: 160,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
  },
  googleButton: {
    position: "absolute",
    width: 50,
    height: 50,
    left: 20
  }
})