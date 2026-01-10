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
import Ionicons from '@expo/vector-icons/Ionicons';

//graph https://github.com/Abhinandan-Kushwaha/react-native-gifted-charts
const dummyParameters: Parameters = {
  label: "Hybrid Bike",
  lead_time: 1,
  target_in_stock_probability: .98,
  target_fill_rate: .95,
  interval: IntervalOption.Week,
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

      <View style={[GlobalStyles.container_card, {alignItems: "flex-start", padding: 15}]}>

        <View style={styles.row}>
          <Ionicons name="cube" color={theme.maroon3} size={25} />
          <Text style={[GlobalStyles.bold]}>
            {" Order Up-To: "}
          </Text>
          <Text style={[GlobalStyles.bold, { color: theme.maroon3 }]}>
            {`${forecastResults?.target_fill_S}`}
          </Text>
        </View>
        <Text style={[GlobalStyles.light_italic, {fontSize: 10}]}>
          {`* ${parameters.target_fill_rate * 100}% certainty 1 ${intervalOptionPrinter(parameters.interval)} demand for ${parameters.label}`}
        </Text>

        <View style={styles.row}>
          <Ionicons name="cube" color={theme.maroon2} size={25} />
          <Text style={[GlobalStyles.bold]}>
            {" Guarantee In Stock: "}
          </Text>
          <Text style={[GlobalStyles.bold, { color: theme.maroon2 }]}>
            {`${forecastResults?.target_in_stock_S}`}
          </Text>
        </View>
        <Text style={[GlobalStyles.light_italic, {fontSize: 10}]}>
          {`* ${parameters.target_in_stock_probability * 100}% certainty 1 ${intervalOptionPrinter(parameters.interval)} demand for ${parameters.label}`}
        </Text>

        <View style={styles.row}>
          <Ionicons name="cube" color={theme.blue} size={25} />
          <Text style={[GlobalStyles.bold]}>
            {" Minimize Costs: "}
          </Text>
          <Text style={[GlobalStyles.bold, { color: theme.blue }]}>
            {`${forecastResults?.minimize_holding_and_backorder_costs}`}
          </Text>
        </View>
        <Text style={[GlobalStyles.light_italic, {fontSize: 10}]}>
          *based on holding & backorder costs
        </Text>

        <View style={styles.row}>
          <Ionicons name="cube" color={theme.grey1} size={25} />
          <Text style={[GlobalStyles.bold]}>
            {" Estimated Lost Sales: "}
          </Text>
          <Text style={[GlobalStyles.bold, { color: theme.grey1 }]}>
            {`${forecastResults?.target_lost_sales}`}
          </Text>
        </View>
        <Text style={[GlobalStyles.light_italic, {fontSize: 10, marginBottom: 15 }]}>
          *estimated quantity of lost sales given target fill rate
        </Text>

        <Graph 
          receipts={userSlice.receiptsList} 
          parameters={parameters}
          forecastResults={forecastResults}
        />

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
  },
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  }
});

function isDataValid(list: Receipt[] | null): list is Receipt[] {
  return Array.isArray(list) && list.length > 0;
}