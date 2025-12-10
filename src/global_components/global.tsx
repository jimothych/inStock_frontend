import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from 'react-native';

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
  }
});