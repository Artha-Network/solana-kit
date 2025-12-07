/**
 * Formatting utilities for display and conversion
 */

import BN from "bn.js";
import { DealStatus, Verdict } from "../types";
import { USDC_DECIMALS } from "../constants";

/**
 * Convert token base units to human-readable amount
 * @param lamports Amount in base units
 * @param decimals Token decimals (default: 6 for USDC)
 */
export function formatTokenAmount(
  lamports: number | BN,
  decimals: number = USDC_DECIMALS
): string {
  const bn = typeof lamports === "number" ? new BN(lamports) : lamports;
  const divisor = new BN(10).pow(new BN(decimals));
  const quotient = bn.div(divisor);
  const remainder = bn.mod(divisor);

  // Pad remainder with leading zeros
  const remainderStr = remainder.toString().padStart(decimals, "0");
  
  // Trim trailing zeros
  const trimmed = remainderStr.replace(/0+$/, "");
  
  if (trimmed.length === 0) {
    return quotient.toString();
  }
  
  return `${quotient.toString()}.${trimmed}`;
}

/**
 * Convert human-readable amount to token base units
 * @param amount Human-readable amount (e.g., "1.5")
 * @param decimals Token decimals (default: 6 for USDC)
 */
export function parseTokenAmount(
  amount: string | number,
  decimals: number = USDC_DECIMALS
): BN {
  const amountStr = amount.toString();
  const [whole = "0", fraction = "0"] = amountStr.split(".");
  
  // Pad or trim fraction to match decimals
  const paddedFraction = fraction.padEnd(decimals, "0").slice(0, decimals);
  
  const wholeBN = new BN(whole).mul(new BN(10).pow(new BN(decimals)));
  const fractionBN = new BN(paddedFraction);
  
  return wholeBN.add(fractionBN);
}

/**
 * Format deal status as human-readable string
 */
export function formatDealStatus(status: DealStatus): string {
  switch (status) {
    case DealStatus.Init:
      return "Initialized";
    case DealStatus.Funded:
      return "Funded";
    case DealStatus.Disputed:
      return "Disputed";
    case DealStatus.Resolved:
      return "Resolved";
    case DealStatus.Released:
      return "Released";
    case DealStatus.Refunded:
      return "Refunded";
    default:
      return "Unknown";
  }
}

/**
 * Format verdict as human-readable string
 */
export function formatVerdict(verdict: Verdict): string {
  switch (verdict) {
    case Verdict.ReleaseFull:
      return "Release to Seller";
    case Verdict.RefundFull:
      return "Refund to Buyer";
    case Verdict.Split:
      return "Split Payment";
    default:
      return "Unknown";
  }
}

/**
 * Format Unix timestamp as human-readable date
 */
export function formatTimestamp(unixTimestamp: number | BN): string {
  const ts = typeof unixTimestamp === "number" ? unixTimestamp : unixTimestamp.toNumber();
  return new Date(ts * 1000).toLocaleString();
}

/**
 * Format basis points as percentage
 * @param bps Basis points (e.g., 250 = 2.5%)
 */
export function formatBps(bps: number): string {
  return `${(bps / 100).toFixed(2)}%`;
}

/**
 * Calculate fee amount from total and fee basis points
 */
export function calculateFee(amount: BN, feeBps: number): BN {
  return amount.mul(new BN(feeBps)).div(new BN(10000));
}

/**
 * Calculate amount after fee deduction
 */
export function calculateAmountAfterFee(amount: BN, feeBps: number): BN {
  const fee = calculateFee(amount, feeBps);
  return amount.sub(fee);
}
