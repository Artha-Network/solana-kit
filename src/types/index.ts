/**
 * Type definitions for the Artha Network on-chain escrow program.
 * These types match the Rust program state structures.
 */

import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

/**
 * Deal status enum matching on-chain program states
 */
export enum DealStatus {
  /** Initial state - deal created but not funded */
  Init = 0,
  /** Buyer has deposited funds into escrow */
  Funded = 1,
  /** Either party has opened a dispute */
  Disputed = 2,
  /** Dispute has been resolved by arbiter */
  Resolved = 3,
  /** Funds have been released to seller */
  Released = 4,
  /** Funds have been refunded to buyer */
  Refunded = 5,
}

/**
 * Verdict types for dispute resolution
 */
export enum Verdict {
  /** Release full amount to seller */
  ReleaseFull = 0,
  /** Refund full amount to buyer */
  RefundFull = 1,
  /** Split funds between parties based on split_bps */
  Split = 2,
}

/**
 * On-chain escrow state account structure
 */
export interface EscrowState {
  /** The seller receiving payment */
  seller: PublicKey;
  /** The buyer depositing funds */
  buyer: PublicKey;
  /** Token mint for the escrow (e.g., USDC) */
  mint: PublicKey;
  /** Designated arbiter authority */
  arbiter: PublicKey;
  /** Amount to be escrowed (in token base units) */
  amount: BN;
  /** Platform fee in basis points (e.g., 250 = 2.5%) */
  feeBps: number;
  /** Current status of the deal */
  status: DealStatus;
  /** Unix timestamp - deadline for dispute window */
  disputeBy: BN;
  /** PDA bump seed for escrow account */
  bump: number;
  /** PDA bump seed for vault authority */
  vaultBump: number;
}

/**
 * Parameters for initiating a new deal
 */
export interface InitiateDealParams {
  /** Amount in token base units (e.g., 1000000 for 1 USDC with 6 decimals) */
  amount: number | BN;
  /** Platform fee in basis points (0-10000) */
  feeBps: number;
  /** Unix timestamp for dispute deadline */
  disputeBy: number | BN;
}

/**
 * Account addresses needed for deal operations
 */
export interface DealAccounts {
  escrowState: PublicKey;
  seller: PublicKey;
  buyer: PublicKey;
  arbiter: PublicKey;
  mint: PublicKey;
  vaultAuthority: PublicKey;
  vaultAta: PublicKey;
  buyerAta?: PublicKey;
  sellerAta?: PublicKey;
}

/**
 * Result from PDA derivation
 */
export interface PDASeed {
  address: PublicKey;
  bump: number;
}

/**
 * Network configuration
 */
export type Cluster = "mainnet-beta" | "devnet" | "testnet" | "localnet";

/**
 * SDK configuration options
 */
export interface SolanaKitConfig {
  /** Solana cluster */
  cluster: Cluster;
  /** RPC endpoint URL */
  rpcUrl?: string;
  /** Program ID (defaults to deployed program) */
  programId?: PublicKey;
  /** Commitment level for transactions */
  commitment?: "processed" | "confirmed" | "finalized";
}
