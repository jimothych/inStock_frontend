import { Interval, DateTime } from "luxon";
import type { Receipt } from "../redux/apiSlice";
import { validateDate } from "../global/global";
import { mean as MathJS_mean, std as MathJS_std, sum as MathJS_sum, sqrt as MathJS_sqrt } from "mathjs"
import { normal, poisson } from '@stdlib/stats/base/dists'

export enum IntervalOption {
  Week = 0,
  Month = 1,
  Quarter = 2,
}

export function intervalOptionPrinter(option: IntervalOption): string {
  switch(option) {
    case IntervalOption.Week: return "week";
    case IntervalOption.Month: return "month";
    case IntervalOption.Quarter: return "quarter";
    default: return "ENUM PRINT FAILED";
  }
}

//to make it easier, interval is an enum, the actual luxon Interval is calculated separately
export type Parameters = {
  label: string,
  lead_time: number,
  target_in_stock_probability: number,
  target_fill_rate: number,
  interval: IntervalOption,
  holding_cost_per_unit: number,
  backorder_cost_per_unit: number,
}

//no need to export props as numbers cuz this is just for display
//also solves the annoyance of js number rounding
export type TargetResult = {
  target_in_stock_S: string,
  target_fill_S: string,
  target_lost_sales: string,
  minimize_holding_and_backorder_costs: string,
}

const dummyTargetResult: TargetResult = {
  target_in_stock_S: "_",
  target_fill_S: "_",
  target_lost_sales: "_",
  minimize_holding_and_backorder_costs: "_",
}

/**
 * DISCUSSION: 
 * no data will be shown if all dates are stale and we compute from DateTime.now(). to prevent this, we take the period from the latest transaction_date_time in our Receipt[] list, not from the current time, hence getNewestDate
 */

/**
 * Using order-up-to statistical formula from excel calculator template.
 * Caller must guarantee that input data is valid
 * @param data list of receipts
 * @param Parameters adjustable inputs for the given item label
 * @returns TargetResult
 */
export function forecast(data: Receipt[], params: Parameters): TargetResult {
  console.log(`\n\n\tNEW CALCULATION: ${params.label}\n\tSTEP INTERVAL: ${intervalOptionPrinter(params.interval)}`);

  const newestDate = getNewestDate(data, params);
  if(!newestDate) return dummyTargetResult; //cannot forecast, no valid dates (just need one)

  const sums: number[] = segmentData(data, params, newestDate);
  const lambda = MathJS_mean(sums) as number;

  //https://en.wikipedia.org/wiki/Poisson_distribution#General
  //"If λ is greater than about 10, then the normal distribution is a good approximation if an appropriate continuity correction is performed, i.e., if P(X ≤ x), where x is a non-negative integer, is replaced by P(X ≤ x + 0.5)"
  if (lambda >= 10) {
    const mean = lambda;
    const std = MathJS_std(sums) as unknown as number;
    if (std > 0) {
      console.log(`using gaussian | mean: ${mean} std: ${std}`);
      return useGaussian(lambda, std, params);
    }
  }

  // default + fallback
  console.log(`using poisson | lambda: ${lambda}`);
  return usePoisson(lambda, params);
};

export function getNewestDate(data: Receipt[], params: Parameters): DateTime | null {
  let newestDate;
  for(const receipt of data) {
    if (receipt.unit_description === params.label) {
      newestDate = validateDate(receipt.transaction_date_time);
      return newestDate; //first match is the newest, data comes in sorted newest to oldest
    }
  }

  return null;
}

//MAIN HELPER
//we need to return an array of sums (the sum of quantities in each interval)
export function segmentData(data: Receipt[], params: Parameters, newestDate: DateTime): number[] {
  const result: number[] = [];

  const oldestDate = getOldestDate(data, params.label);
  if (!oldestDate) return result;

  const intervalStep: Record<IntervalOption, { months?: number; days?: number }> = {
    [IntervalOption.Week]: { days: 7 },
    [IntervalOption.Month]: { months: 1 },
    [IntervalOption.Quarter]: { months: 3 },
  };
  
  const step = intervalStep[params.interval];
  if (!step) {
    console.error("error getting step interval...");
    return result;
  }

  // Start from the day AFTER newestDate to make it inclusive
  let end = newestDate.plus({ days: 1 });
  while (end.minus(step) >= oldestDate) {
    const start = end.minus(step);
    const interval = Interval.fromDateTimes(start, end);
    const total = sumQuantitiesInInterval(data, params.label, interval);
    result.push(total);
    end = start;
  }
  
  // Handle the final partial interval
  if (end > oldestDate) {
    const interval = Interval.fromDateTimes(oldestDate, end);
    const total = sumQuantitiesInInterval(data, params.label, interval);
    result.push(total);
  }

  //console.log(`Array of sums: ${JSON.stringify(result)} | TOTAL: ${MathJS_sum(result)}`);
  return result;
}

export function getOldestDate(data: Receipt[], label: string): DateTime | null {
  let oldest: DateTime | null = null;
  for (const receipt of data) {
    if (receipt.unit_description !== label) continue;
    const dt = validateDate(receipt.transaction_date_time);
    if (!dt) continue;
    if (!oldest || dt < oldest) oldest = dt;
  }
  return oldest;
}

function sumQuantitiesInInterval(data: Receipt[], label: string, interval: Interval): number {
  let total = 0;
  for (const receipt of data) {
    if (receipt.unit_description !== label) continue;
    const dt = validateDate(receipt.transaction_date_time);
    if (!dt || !interval.contains(dt)) continue;
    total += receipt.quantity;
  }
  return total;
}

export function useGaussian(mean: number, standard_deviation: number, params: Parameters): TargetResult {
  const mu_no_correction = (1+params.lead_time)*mean; //mean demand over l+1 periods
  const mu = mu_no_correction + 0.5; //continuity correction poisson to normal from wikipedia
  const sigma = (MathJS_sqrt(1+params.lead_time) as number)*standard_deviation; //standard deviation demand over l+1 periods

  //https://stdlib.io/docs/api/latest/@stdlib/stats/base/dists/normal
  //the quantile w/ mean=0, standard_deviation=1 is the norm inverse for finding z
  const lost_sales_proportion = mean*(1-params.target_fill_rate)/sigma; //this is actually a proportion??
  const z_in_stock_probability = normal.quantile(params.target_in_stock_probability, 0, 1);
  const z_fill_rate = findLz(lost_sales_proportion);

  const lost_sales = lost_sales_proportion * sigma;
  
  const critical_ratio = params.backorder_cost_per_unit/(params.backorder_cost_per_unit + params.holding_cost_per_unit);
  const z_critical_ratio = normal.quantile(critical_ratio, 0, 1);

  const result: TargetResult = {
    target_in_stock_S: Math.ceil(mu+z_in_stock_probability*sigma).toString(),
    target_lost_sales: Math.ceil(lost_sales).toString(),
    target_fill_S: Math.ceil(mu+z_fill_rate*sigma).toString(),
    minimize_holding_and_backorder_costs: Math.ceil(mu+z_critical_ratio*sigma).toString(),
  }
  return result;
}

export function usePoisson(lambda: number, params: Parameters): TargetResult {
  const lambda_forecast = lambda*(1+params.lead_time); //mean demand over l+1 periods

  const critical_ratio = params.backorder_cost_per_unit/(params.backorder_cost_per_unit + params.holding_cost_per_unit);
  
  const rounded_lost_sales = Math.round(lambda * (1 - params.target_fill_rate));

  //https://stdlib.io/docs/api/latest/@stdlib/stats/base/dists/poisson/quantile
  const result: TargetResult = {
    target_in_stock_S: (poisson.quantile(params.target_in_stock_probability, lambda_forecast)).toString(),
    target_lost_sales: rounded_lost_sales.toString(), //not a proportion
    target_fill_S: (poisson.quantile(params.target_fill_rate, lambda_forecast)).toString(),
    minimize_holding_and_backorder_costs: (poisson.quantile(critical_ratio, lambda_forecast)).toString(),
  }
  return result;
}

/** from @find_lz(target) | Return the z in the Standard Normal Loss Function Table such that LZ(z) = target.
 * numerically invert the standard normal loss function L(z) to find z for a given target, using binary search 
 */
function findLz(target: number, tol = 1e-6, maxIter = 100): number {
  let low = -10, high = 10;
  for (let i = 0; i < maxIter; i++) {
    const mid = (low + high) / 2;
    const val = standardNormalLoss(mid);
    if (Math.abs(val - target) < tol) return mid;
    if (val > target) low = mid;
    else high = mid;
  }
  return Math.ceil((low + high) / 2);
}

/** Standard normal loss function L(z) = φ(z) - z * (1 - Φ(z)) */
function standardNormalLoss(z: number): number {
  const phi = normal.pdf(z, 0, 1);   // φ(z)
  const Phi = normal.cdf(z, 0, 1);   // Φ(z)
  return phi - z * (1 - Phi);        // L(z)
}