// src/utils/amountMath.ts
import type { BNLike } from "../types/common";

/**
 * Normalise a BNLike into bigint.
 */
export function toBigInt(value: BNLike): bigint {
  if (typeof value === "bigint") return value;
  if (typeof value === "number") return BigInt(Math.trunc(value));
  // string
  const trimmed = value.trim();
  if (trimmed.includes(".")) {
    throw new Error(
      `toBigInt: cannot parse decimal string "${value}", pass base units instead`,
    );
  }
  return BigInt(trimmed);
}

/**
 * Apply basis points to an integer amount.
 * e.g. applyBps(1000n, 250) = 25n  (2.5%)
 */
export function applyBps(amount: BNLike, bps: number): bigint {
  if (bps < 0 || bps > 10_000) {
    throw new Error("bps must be between 0 and 10_000");
  }
  const value = toBigInt(amount);
  return (value * BigInt(bps)) / 10_000n;
}

/**
 * Split an amount between two parties using basis points.
 * `buyerBps` out of 10_000 goes to buyer, the rest to seller.
 */
export function splitAmountByBps(
  total: BNLike,
  buyerBps: number,
): { buyer: bigint; seller: bigint } {
  if (buyerBps < 0 || buyerBps > 10_000) {
    throw new Error("buyerBps must be between 0 and 10_000");
  }
  const value = toBigInt(total);
  const buyer = applyBps(value, buyerBps);
  const seller = value - buyer;

  return { buyer, seller };
}

/**
 * Check if `amount` is an exact multiple of `step`.
 * Useful for enforcing tick sizes / minimum increments in UIs.
 */
export function isMultipleOfStep(amount: BNLike, step: BNLike): boolean {
  const a = toBigInt(amount);
  const s = toBigInt(step);
  if (s <= 0n) throw new Error("step must be positive");
  return a % s === 0n;
}
