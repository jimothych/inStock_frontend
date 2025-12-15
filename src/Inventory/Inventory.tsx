import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from 'react-native';
import theme from "../global/theme";
import { Header, SafeArea } from "../global/global";

export default function Inventory() {
  return (
    <SafeArea backgroundColor={theme.purple2}>
      <Header text="Inventory" />
    </SafeArea>
  );
}