import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Dimensions, ColorValue } from 'react-native';
import theme from "../global/theme";
import { GlobalStyles, Header, SafeArea, Scroll } from "../global/global";
import { LineChart } from "react-native-gifted-charts";
import { Receipt } from "../redux/apiSlice";
import { IntervalOption, intervalOptionPrinter, Parameters, TargetResult } from "./calculations";
import { segmentData, getNewestDate } from "./calculations";

type GraphProps = {
  receipts: Receipt[],
  parameters: Parameters,
  forecastResults: TargetResult | null,
}
export default function Graph({ receipts, parameters, forecastResults } : GraphProps) {
  let data = parseDataForGraph(receipts, parameters);
  let content = null;
  if(data && forecastResults) {

    let data2 = [...data]
    data2.push(createPredictionPoint(2, forecastResults));

    let data3 = [...data];
    data3.push(createPredictionPoint(3, forecastResults));

    let data4 = [...data];
    data4.push(createPredictionPoint(4, forecastResults));

    content = <LineChart 
                adjustToWidth={true}
                width={250}
                curved={true}
                areaChart={true}
                data={data4}
                data2={data3}
                data3={data2}
                data4={data}

                //gradient4
                startOpacity1={0}
                endOpacity1={0}

                //gradient3
                startOpacity2={0}
                endOpacity2={0}

                //gradient2
                startOpacity3={0}
                endOpacity3={0}

                //gradient1
                startFillColor4={theme.magenta}
                endFillColor4={theme.magenta}
                startOpacity4={0.6}
                endOpacity4={0.05}

                //data4 line colors
                color1={theme.maroon2}
                dataPointsColor1={theme.maroon2}
                strokeDashArray1={[5, 5]}

                //data3 line colors
                color2={theme.maroon3}
                dataPointsColor2={theme.maroon3}
                strokeDashArray2={[5, 5]}

                //data2 line colors
                color3={theme.blue}
                dataPointsColor3={theme.blue}
                strokeDashArray3={[5, 5]}

                //data1
                color4={theme.magenta}
                dataPointsColor4={theme.magenta}

                // X-axis label styling
                xAxisLabelTextStyle={{
                  fontFamily: 'Inter', 
                  fontWeight: '700', 
                  fontStyle: 'italic',
                  fontSize: 10,
                  color: theme.black,
                }}
                
                // Y-axis label styling
                yAxisTextStyle={{
                  fontFamily: 'Inter', 
                  fontWeight: '700', 
                  fontStyle: 'italic',
                  fontSize: 10,
                  color: theme.black,
                }}
              />;
  }
  return content;
}
//https://github.com/Abhinandan-Kushwaha/react-native-gifted-charts/blob/master/docs/LineChart/LineChartProps.md
type DataPoint = {
  value: number,
  label: string,
  dataPointText?: string,
  textShiftX?: number,
  textColor?: string
}
function parseDataForGraph(receipts: Receipt[], parameters: Parameters): DataPoint[] | null {
  const newestDate = getNewestDate(receipts, parameters); //from calculations.ts
  if(!newestDate) return null;
  const valuePoints: number[] = segmentData(receipts, parameters, newestDate); //from calculations.ts

  const result: DataPoint[] = [];
  for(let i=0; i<valuePoints.length; i++) {
    const periodPrefix = intervalOptionPrinter(parameters.interval).charAt(0);

    result.push({
      value: valuePoints[i],
      label: `${periodPrefix}${i+1}`,
    });
  }

  //console.log(`HELLO WORLD: ${JSON.stringify(result)}`);
  return result;
}

function createPredictionPoint(type: number, forecastResults: TargetResult): DataPoint {
  let value;
  let dataPointText
  switch(type) {
    case 2: {
      value = forecastResults.minimize_holding_and_backorder_costs;
      dataPointText = "minimize"
      break;
    }
    case 3: {
      value = forecastResults.target_fill_S;
      dataPointText = "order-up-to"
      break;
    }
    case 4: {
      value = forecastResults.target_in_stock_S;
      dataPointText = "guarantee"
      break;
    }
  }
  return {
    value: Number(value) || 0,
    label: "->",
  };
};
