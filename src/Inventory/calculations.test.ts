import { useGaussian, usePoisson } from "./calculations";
import type { Parameters, TargetResult } from "./calculations";
import { DateTime, Interval } from "luxon";

//via jest-expo
//https://docs.expo.dev/develop/unit-testing/

const start = DateTime.fromISO("2024-03-01");
const end = DateTime.fromISO("2024-03-30");
const interval: Interval = Interval.fromDateTimes(start, end);

const params1: Parameters = {
  label: "Hybrid Bike",
  lead_time: 1,
  target_in_stock_probability: .98,
  target_fill_rate: .95,
  date_range: interval,
  holding_cost_per_unit: 1,
  backorder_cost_per_unit: 2,
}

const params2: Parameters = {
  label: "Hybrid Bike",
  lead_time: 3,
  target_in_stock_probability: .99,
  target_fill_rate: .80,
  date_range: interval,
  holding_cost_per_unit: 1,
  backorder_cost_per_unit: 4,
}

const gaussianResult: TargetResult = {
  target_in_stock_S: "407",
  target_fill_S: "326",
  target_lost_sales: "6", //in excel it says 0.0683 but this is the PROPORTION of predicted sales not the numerical value
  minimize_holding_and_backorder_costs: "269",
}

const poissonResult: TargetResult = {
  target_in_stock_S: "9",
  target_fill_S: "6",
  target_lost_sales: "0.2000",
  minimize_holding_and_backorder_costs: "6",
}

test('useGaussian', () => {
  expect(useGaussian(116, 60.07, params1)).toEqual(gaussianResult);
});

test('usePoisson', () => {
  expect(usePoisson(1, params2)).toEqual(poissonResult);
});