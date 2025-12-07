// src/types/common.ts
import type { PublicKey } from "@solana/web3.js";

/**
 * Supported cluster names used across the SDK.
 */
export type Cluster = "localnet" | "devnet" | "testnet" | "mainnet-beta";

/**
 * Values that can be interpreted as an on-chain integer.
 * (You can normalise them to bigint in helpers.)
 */
export type BNLike = bigint | number | string;

/**
 * Generic escrow parties used by builders/clients/UI.
 */
export interface EscrowParties {
  buyer: PublicKey;
  seller: PublicKey;
  arbiter?: PublicKey;
}

/**
 * Simple wrapper for an amount that always carries its decimals.
 */
export interface AmountWithDecimals {
  value: bigint; // in base units
  decimals: number;
}
