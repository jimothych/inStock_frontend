import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from 'react-native';
import Toast from "react-native-toast-message";

export type UserState = {
  photo: string | null;
  name: string | null;
  email: string | null;
  id: string | null;
}

type Children = { children?: React.ReactNode };

// export function Column({children}: Children) {
//   return(
//     <View style={styles.column}>{children}</View>
//   );
// }

// export function RowButton({children}: Children) {
//   return(
//     <View style={styles.row}>{children}</View>
//   );
// }

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
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bold: {
    fontFamily: 'Inter_28pt-Bold',
    fontSize: 19
  },
  r: {
    fontFamily: 'Inter_28pt-Regular',
    fontSize: 17
  },
  bold_italic: {
    fontFamily: 'Inter_28pt-BoldItalic',
    fontSize: 19
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