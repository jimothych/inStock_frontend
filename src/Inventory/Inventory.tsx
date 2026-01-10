import React, { useEffect, useState, useContext } from "react";
import { View, Text, Pressable, StyleSheet } from 'react-native';
import theme from "../global/theme";
import { GlobalStyles, Header, SafeArea, Scroll } from "../global/global";
import type { Parameters, TargetResult } from "./calculations";
import Graph from "./Graph";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import type { Receipt } from "../redux/apiSlice";
import ParametersPickers from "./ParametersPickers";
import { DateTime, Interval } from "luxon";
import { forecast, IntervalOption, intervalOptionPrinter } from "./calculations";

//Forecast
//graph https://github.com/Abhinandan-Kushwaha/react-native-gifted-charts
const dummyParameters: Parameters = {
  label: "Hybrid Bike",
  lead_time: 1,
  target_in_stock_probability: .98,
  target_fill_rate: .95,
  interval: IntervalOption.Month,
  holding_cost_per_unit: 1,
  backorder_cost_per_unit: 2,
}

export default function Inventory() {
  const userSlice = useSelector((state: RootState) => state.user);
  const [parameters, setParameters] = useState<Parameters>(dummyParameters);
  const [forecastResults, setForecastResults] = useState<TargetResult | null>(null);

  useEffect(() => {
    if(isDataValid(userSlice.receiptsList)) {
      //console.log(JSON.stringify(parameters));
      const result = forecast(userSlice.receiptsList, parameters)
      setForecastResults(result);
      console.log(`TargetResult: ${JSON.stringify(result)}`);
    }
  }, [parameters, userSlice.receiptsList]);

  let content = (
    <Text style={[GlobalStyles.italic, styles.none]}>
      Start uploading receipts to see inventory analytics!
    </Text>
  );
  if(isDataValid(userSlice.receiptsList)) {
    content = (
      <>
      <ParametersPickers 
        data={userSlice.receiptsList!} 
        parameters={parameters}
        setParameters={setParameters}
      />

      <View style={[GlobalStyles.container_card]}>
        <Text style={[GlobalStyles.bold]}>
          Order Up-To
        </Text>
        <Text style={[GlobalStyles.bold, { fontSize: 55 }]}>
          {`${forecastResults?.target_fill_S}`}
        </Text>
        <Text style={[GlobalStyles.light_italic]}>
          {`* ${parameters.target_fill_rate * 100}% certainty 1 ${intervalOptionPrinter(parameters.interval)} demand for ${parameters.label}`}
        </Text>

        <Text style={[GlobalStyles.bold, { marginTop: 25 }]}>
          {`${forecastResults?.target_lost_sales}`}
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
          {`${forecastResults?.target_in_stock_S}`}
        </Text>
        <Text style={[GlobalStyles.light_italic]}>
          {`* ${parameters.target_in_stock_probability * 100}% certainty 1 ${intervalOptionPrinter(parameters.interval)} demand for ${parameters.label}`}
        </Text>
      </View>

      <View style={[GlobalStyles.container_card]}>
        <Text style={[GlobalStyles.bold]}>
          Minimize Costs
        </Text>
        <Text style={[GlobalStyles.bold, { fontSize: 55 }]}>
          {`${forecastResults?.minimize_holding_and_backorder_costs}`}
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

function isDataValid(list: Receipt[] | null): list is Receipt[] {
  return Array.isArray(list) && list.length > 0;
}