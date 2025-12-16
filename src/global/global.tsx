import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Toast from "react-native-toast-message";
import theme from "./theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { ProgressBar } from 'react-native-paper';
import { MainContext } from "./MainContext";

type SafeAreaProps = {
  children: React.ReactNode;
  backgroundColor: string;
};
export function SafeArea(props: SafeAreaProps) {
  return (
    <SafeAreaView style={[GlobalStyles.container_column, { backgroundColor: props.backgroundColor }]}>
      {props.children}
    </SafeAreaView>
  );
}

export function Scroll({children}: {children: React.ReactNode}) {
  return (
    <ScrollView style={{ flex: 1, width: "100%" }}>
      {children}
    </ScrollView>
  );
}

type HeaderProps = {
  text: string;
  isLoading?: boolean;
}

export function Header(props: HeaderProps) {
  const context = useContext(MainContext)
  const userSlice = useSelector((state: RootState) => state.user);

  // !! is js boolean conversion
  //useEffect not needed here because loading is derivative of state and not a side-effect
  const loadingBarVisible = !!userSlice.currentNumProcessingDocs || !!context?.isLoading;

  return (
    <View style={GlobalStyles.header}>
      <Text style={[GlobalStyles.bold, {color: theme.white3}]}>
        {props.text}
      </Text>

      <Text style={[GlobalStyles.light_italic, {color: theme.white2, paddingTop: 3}]}>
        {`Last Updated: ${context?.currentTime}  |  Currently Processing: ${userSlice.currentNumProcessingDocs} Files`}
      </Text>

      <View style={GlobalStyles.loadingBar}>
        <ProgressBar 
          color={theme.maroon1} 
          visible={loadingBarVisible} 
          indeterminate={true} 
        />
      </View>
    </View>
  );
}

export function showDefaultToast() {
  Toast.show({
    type: 'error',
    text1: "Error",
    text2: "Please Contact Support",
    visibilityTime: 4000,
  });
}

export const GlobalStyles = StyleSheet.create({
  container_column: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  container_card: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignSelf: "center",
    width: "90%",
    marginTop: 25,
    padding: 30,
    borderRadius: 8,
  },
  loadingBar: {
    height: 4, 
    width: '100%', 
    marginTop: 10,
  },
  header: {
    height: 60,
    width: "100%",
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  big_button: {
    position: "absolute",
    height: 70, 
    width: "70%", 
    borderWidth: 4, 
    borderColor: theme.white2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.white,
    borderRadius: 16,
  },
  bold: {
    fontFamily: 'Inter_28pt-Bold',
    fontSize: 21
  },
  r: {
    fontFamily: 'Inter_28pt-Regular',
    fontSize: 17
  },
  bold_italic: {
    fontFamily: 'Inter_28pt-BoldItalic',
    fontSize: 21
  },
  italic: {
    fontFamily: 'Inter_28pt-Italic',
    fontSize: 17
  },
  light: {
    fontFamily: 'Inter_28pt-Light',
    fontSize: 14
  },
  light_italic: {
    fontFamily: 'Inter_28pt-LightItalic',
    fontSize: 14
  },
});