import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import Toast from "react-native-toast-message";
import theme from "./theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { ProgressBar } from 'react-native-paper';
import { MainContext } from "./MainContext";
import { DateTime } from "luxon";
import type { Receipt } from "../redux/apiSlice";

type SafeAreaProps = {
  children: React.ReactNode;
  backgroundColor: string;
};
export function SafeArea(props: SafeAreaProps) {
  return (
    <SafeAreaView 
      edges={['right', 'top', 'left']} 
      style={[GlobalStyles.container_column, { backgroundColor: props.backgroundColor }]}
    >
      {props.children}
    </SafeAreaView>
  );
}

export function Scroll({children}: {children: React.ReactNode}) {
  const context = useContext(MainContext);

  return (
    <ScrollView 
      style={{ flex: 1, width: "100%" }}
      contentContainerStyle={{ alignItems: "center" }}
      refreshControl={
        <RefreshControl 
          refreshing={context!.isLoading} 
          onRefresh={context?.onRefresh} 
        />
      }
    >
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

export function ensureError(e: unknown): Error {
  return e instanceof Error ? e : new Error(String(e));
}

export function validateDate(str: string | null): DateTime | null {
  if(!str) return null;

  let dt = DateTime.fromFormat(str, 'MM-dd-yyyy');
  if (!dt.isValid) {
    dt = DateTime.fromFormat(str, 'yyyy-MM-dd');
  }

  if (!dt.isValid) {
    console.warn(`invalid date: ${str}`);
    return null;
  }
  
  return dt;
}

/** Sorts newest to oldest. Invalid dates are pushed to end of array
 */
export function sortByTransactionDate(arr: Receipt[]): Receipt[] {
  return [...arr].sort((a, b) => {
    let dateA = validateDate(a.transaction_date_time);
    let dateB = validateDate(b.transaction_date_time);

    if (!dateA && !dateB) return 0; //nothing happens
    if (!dateA) return 1;   // a goes after b
    if (!dateB) return -1;  // b goes after a

    return dateB.toMillis() - dateA.toMillis();  //newest first
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
    //alignSelf: "center",
    width: "95%",
    marginTop: 6,
    marginBottom: 6,
    padding: 30,
    borderRadius: 8,
    backgroundColor: theme.white3,
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
  bold: {
    fontFamily: 'Inter_28pt-Bold',
    fontSize: 21,
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