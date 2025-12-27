import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from 'react-native';
import theme from "../global/theme";
import { GlobalStyles, Header, SafeArea, Scroll } from "../global/global";
import { LineChart } from "react-native-gifted-charts";
import { Receipt } from "../redux/apiSlice";

export default function Graph({ receipts } : { receipts: Receipt[]}) {
  //clean data
  //construct each data pt https://github.com/Abhinandan-Kushwaha/react-native-gifted-charts/blob/master/docs/LineChart/LineChartProps.md#item-description-linedataitem
  //i want the final data point to be the prediction

  return (
    null
  );
}