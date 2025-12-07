/**
 * Validation utilities for deal parameters and inputs
 */

import BN from "bn.js";
import { PublicKey } from "@solana/web3.js";
import {
  MAX_BPS,
  MIN_DEAL_AMOUNT,
  MAX_DEAL_AMOUNT,
  MIN_DISPUTE_WINDOW,
  MAX_DISPUTE_WINDOW,
} from "../constants";

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate deal amount
 */
export function validateAmount(amount: number | BN): ValidationResult {
  const amountBN = typeof amount === "number" ? new BN(amount) : amount;

  if (amountBN.lte(new BN(0))) {
    return { valid: false, error: "Amount must be positive" };
  }

  if (amountBN.lt(new BN(MIN_DEAL_AMOUNT))) {
    return {
      valid: false,
      error: `Amount must be at least ${MIN_DEAL_AMOUNT} base units`,
    };
  }

  if (amountBN.gt(new BN(MAX_DEAL_AMOUNT))) {
    return {
      valid: false,
      error: `Amount must not exceed ${MAX_DEAL_AMOUNT} base units`,
    };
  }

  return { valid: true };
}

/**
 * Validate fee basis points
 */
export function validateFeeBps(feeBps: number): ValidationResult {
  if (!Number.isInteger(feeBps)) {
    return { valid: false, error: "Fee BPS must be an integer" };
  }

  if (feeBps < 0) {
    return { valid: false, error: "Fee BPS cannot be negative" };
  }

  if (feeBps > MAX_BPS) {
    return {
      valid: false,
      error: `Fee BPS cannot exceed ${MAX_BPS} (100%)`,
    };
  }

  return { valid: true };
}

/**
 * Validate dispute deadline timestamp
 */
export function validateDisputeDeadline(
  disputeBy: number | BN,
  currentTime?: number
): ValidationResult {
  const disputeByNum = typeof disputeBy === "number" ? disputeBy : disputeBy.toNumber();
  const now = currentTime || Math.floor(Date.now() / 1000);
  const windowSeconds = disputeByNum - now;

  if (disputeByNum <= now) {
    return { valid: false, error: "Dispute deadline must be in the future" };
  }

  if (windowSeconds < MIN_DISPUTE_WINDOW) {
    return {
      valid: false,
      error: `Dispute window must be at least ${MIN_DISPUTE_WINDOW} seconds`,
    };
  }

  if (windowSeconds > MAX_DISPUTE_WINDOW) {
    return {
      valid: false,
      error: `Dispute window cannot exceed ${MAX_DISPUTE_WINDOW} seconds`,
    };
  }

  return { valid: true };
}

/**
 * Validate public key
 */
export function validatePublicKey(key: PublicKey | string): ValidationResult {
  try {
    if (typeof key === "string") {
      new PublicKey(key);
    } else if (!PublicKey.isOnCurve(key.toBuffer())) {
      return { valid: false, error: "Invalid public key: not on curve" };
    }
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: `Invalid public key: ${error instanceof Error ? error.message : "unknown error"}`,
    };
  }
}

/**
 * Validate all initiate deal parameters at once
 */
export function validateInitiateParams(params: {
  amount: number | BN;
  feeBps: number;
  disputeBy: number | BN;
  seller: PublicKey;
  buyer: PublicKey;
  arbiter: PublicKey;
  mint: PublicKey;
}): ValidationResult {
  // Validate amount
  const amountResult = validateAmount(params.amount);
  if (!amountResult.valid) return amountResult;

  // Validate fee
  const feeResult = validateFeeBps(params.feeBps);
  if (!feeResult.valid) return feeResult;

  // Validate dispute deadline
  const deadlineResult = validateDisputeDeadline(params.disputeBy);
  if (!deadlineResult.valid) return deadlineResult;

  // Validate public keys
  for (const [name, key] of Object.entries({
    seller: params.seller,
    buyer: params.buyer,
    arbiter: params.arbiter,
    mint: params.mint,
  })) {
    const keyResult = validatePublicKey(key);
    if (!keyResult.valid) {
      return { valid: false, error: `${name}: ${keyResult.error}` };
    }
  }

  // Ensure buyer and seller are different
  if (params.buyer.equals(params.seller)) {
    return { valid: false, error: "Buyer and seller must be different" };
  }

  return { valid: true };
}
