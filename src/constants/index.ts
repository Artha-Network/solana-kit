/**
 * Constants for the Artha Network escrow program
 */

import { PublicKey } from "@solana/web3.js";

/**
 * PDA seed constants - must match on-chain program
 */
export const ESCROW_SEED = "escrow";
export const VAULT_SEED = "vault";

/**
 * Deployed program IDs by network
 */
export const PROGRAM_IDS: Record<string, PublicKey> = {
  devnet: new PublicKey("HM1zYGd6WVH8e73U9QZW8spamWmLqzd391raEsfiNzEZ"),
  // Add mainnet when deployed
  // mainnet: new PublicKey("..."),
};

/**
 * Default USDC mint addresses by network
 */
export const USDC_MINTS: Record<string, PublicKey> = {
  devnet: new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"), // USDC devnet
  mainnet: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"), // USDC mainnet
};

/**
 * Token decimals
 */
export const USDC_DECIMALS = 6;

/**
 * Basis points constants
 */
export const MAX_BPS = 10000; // 100%
export const DEFAULT_FEE_BPS = 250; // 2.5%

/**
 * Time constants (in seconds)
 */
export const DEFAULT_DISPUTE_WINDOW = 7 * 24 * 60 * 60; // 7 days
export const MIN_DISPUTE_WINDOW = 1 * 60 * 60; // 1 hour
export const MAX_DISPUTE_WINDOW = 30 * 24 * 60 * 60; // 30 days

/**
 * Amount limits (in base units, assuming 6 decimals)
 */
export const MIN_DEAL_AMOUNT = 1_000_000; // 1 USDC
export const MAX_DEAL_AMOUNT = 1_000_000_000_000; // 1M USDC

/**
 * RPC endpoint URLs
 */
export const RPC_URLS: Record<string, string> = {
  devnet: "https://api.devnet.solana.com",
  mainnet: "https://api.mainnet-beta.solana.com",
  testnet: "https://api.testnet.solana.com",
  localnet: "http://localhost:8899",
};

/**
 * Default configuration
 */
export const DEFAULT_COMMITMENT = "confirmed" as const;
export const DEFAULT_PREFLIGHT_COMMITMENT = "processed" as const;
