import React from "react";
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import theme from "../global/theme";
import { Surface } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function AddImageButton() {
  return (
    <TouchableOpacity onPress={() => console.log("hi")}>
      <Surface style={styles.button} elevation={4}>
        <Ionicons name="add-outline" color={theme.white2} size={70} />
      </Surface>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: "center",
    top: -125,
    backgroundColor: theme.maroon2,
    alignItems: "center",
    justifyContent: "center",
  }
});