import { Interval, DateTime } from "luxon";
import type { Receipt } from "../redux/apiSlice";
import { validateDate } from "../global/global";
import { mean as MathJS_mean, std as MathJS_std, sum as MathJS_sum, sqrt as MathJS_sqrt } from "mathjs"
import { normal, poisson } from '@stdlib/stats/base/dists'

export type Parameters = {
  label: string,
  lead_time: number,
  target_in_stock_probability: number,
  target_fill_rate: number,
  date_range: Interval,
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

/**
 * using order-up-to statistical formula from excel calculator template
 * all calculations are per date_range, not per entire set of data
 * @param data list of receipts
 * @param Parameters adjustable inputs for the given item label
 * @returns -1 if invalid inputs, S (order-up-to-level) otherwise
 */
export function forecast(data: Receipt[], params: Parameters): TargetResult | null {
  if(!data) { return null; }
  const receipts = extractQuantities(data, params);

  if(MathJS_sum(receipts) as number <= 10) { //use poisson (number of events, not samples)
    const lambda_single_period = MathJS_sum(receipts) as number;
    return usePoisson(lambda_single_period, params);
  }
  //else use normal
  const mean = MathJS_mean(receipts) as number;
  const standard_deviation =  MathJS_std(receipts) as unknown as number;
  return useGaussian(mean, standard_deviation, params);
};

function extractQuantities(data: Receipt[], params: Parameters): number[] {
  let receipts: number[] = [];
  
  for (const receipt of data) {
    if (params.label !== receipt.unit_description) continue;
    const dt = validateDate(receipt.transaction_date_time!);
    if (!dt || !params.date_range.contains(dt)) continue;

    receipts.push(receipt.quantity);
  }

  return receipts;
}

export function useGaussian(mean: number, standard_deviation: number, params: Parameters): TargetResult {
  const mu = (1+params.lead_time)*mean; //mean demand over l+1 periods
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

export function usePoisson(lambda_single_period: number, params: Parameters): TargetResult {
  const lambda = lambda_single_period*(1+params.lead_time); //mean demand over l+1 periods

  const critical_ratio = params.backorder_cost_per_unit/(params.backorder_cost_per_unit + params.holding_cost_per_unit);

  //https://stdlib.io/docs/api/latest/@stdlib/stats/base/dists/poisson/quantile
  const result: TargetResult = {
    target_in_stock_S: (poisson.quantile(params.target_in_stock_probability, lambda)).toString(),
    target_lost_sales: (lambda_single_period*(1-params.target_fill_rate)).toFixed(4), //not a proportion
    target_fill_S: (poisson.quantile(params.target_fill_rate, lambda)).toString(),
    minimize_holding_and_backorder_costs: (poisson.quantile(critical_ratio, lambda)).toString(),
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