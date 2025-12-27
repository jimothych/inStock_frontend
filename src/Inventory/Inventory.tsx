import React, { useEffect, useState, useContext } from "react";
import { View, Text, Pressable, StyleSheet } from 'react-native';
import theme from "../global/theme";
import { GlobalStyles, Header, SafeArea, Scroll } from "../global/global";
import type { Parameters, TargetResult } from "./calculations";
import { forecast } from "./calculations";
import Graph from "./Graph";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";

//label picker 
//https://github.com/azeezat/react-native-select
//options icon w/ popup modal w/ param sliders https://github.com/callstack/react-native-slider
//SegmentedControl
//https://github.com/react-native-segmented-control/segmented-control
//Forecast
//graph https://github.com/Abhinandan-Kushwaha/react-native-gifted-charts
//minimize forecast

export default function Inventory() {
  const userSlice = useSelector((state: RootState) => state.user);
  //useState to handle param obj

  const dataValid: boolean = !!userSlice.receiptsList && 
                            userSlice.receiptsList.length > 0;

  let content = (
    <Text style={[GlobalStyles.italic, styles.none]}>
      Start uploading receipts to see inventory analytics!
    </Text>
  );
  if(dataValid) {
    content = (
      <>
      <View style={[GlobalStyles.container_card]}>
        <Text>label picker</Text>
        <Text>segmented control</Text>
        <Text>target stock-in slider</Text>
      </View>

      <View style={[GlobalStyles.container_card]}>
        <Text style={[GlobalStyles.bold]}>
          Order Up-To
        </Text>
        <Text style={[GlobalStyles.bold, { fontSize: 55 }]}>
          326
        </Text>
        <Text style={[GlobalStyles.light_italic]}>
          * 95% certainty 1 week demand for Hybrid Bike
        </Text>

        <Text style={[GlobalStyles.bold, { marginTop: 25 }]}>
          0.683
        </Text>
        <Text style={[GlobalStyles.light_italic]}>
          *estimated quantity of lost sales
        </Text>
      </View>

      <View style={[GlobalStyles.container_card]}>
        <Text style={[GlobalStyles.bold]}>
          Guarantee In Stock
        </Text>
        <Text style={[GlobalStyles.bold, { fontSize: 55 }]}>
          407
        </Text>
        <Text style={[GlobalStyles.light_italic]}>
          * 98% certainty 1 week demand for Hybrid Bike
        </Text>
      </View>

      <View style={[GlobalStyles.container_card]}>
        <Text>holding cost slider</Text>
        <Text>backorder slider</Text>
      </View>

      <View style={[GlobalStyles.container_card]}>
        <Text style={[GlobalStyles.bold]}>
          Minimize Costs
        </Text>
        <Text style={[GlobalStyles.bold, { fontSize: 55 }]}>
          269
        </Text>
        <Text style={[GlobalStyles.light_italic]}>
          *based on holding & backorder costs
        </Text>
      </View>
      </>
    );
  }
  
  return (
    <SafeArea backgroundColor={theme.purple2}>
      <Header text="Inventory" />
      <Scroll>
        {content}
      </Scroll>
    </SafeArea>
  );
}


const styles = StyleSheet.create({
  none: {
    color: theme.white3,
    marginTop: 150,
    alignSelf: "center",
  }
});