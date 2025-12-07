/**
 * Artha Network Solana Kit
 * TypeScript SDK for the on-chain escrow program
 */

// Core client
export { EscrowClient, ESCROW_IDL } from "./clients/escrowClient";
export type { WalletLike, EscrowClientConfig } from "./clients/escrowClient";

// Transaction builders
export {
  buildInitiate,
  buildFund,
  buildSubmitEvidence,
  buildOpenDispute,
  buildResolve,
  buildRelease,
  buildRefund,
} from "./builders/dealBuilders";
export type {
  BuilderContext,
  InitiateBuilderParams,
  FundBuilderParams,
  SubmitEvidenceBuilderParams,
  OpenDisputeBuilderParams,
  ResolveBuilderParams,
  ReleaseBuilderParams,
  RefundBuilderParams,
} from "./builders/dealBuilders";

// Types
export {
  DealStatus,
  Verdict,
} from "./types";
export type {
  EscrowState,
  InitiateDealParams,
  DealAccounts,
  PDASeed,
  Cluster,
  SolanaKitConfig,
} from "./types";

// Constants
export {
  ESCROW_SEED,
  VAULT_SEED,
  PROGRAM_IDS,
  USDC_MINTS,
  USDC_DECIMALS,
  MAX_BPS,
  DEFAULT_FEE_BPS,
  DEFAULT_DISPUTE_WINDOW,
  MIN_DISPUTE_WINDOW,
  MAX_DISPUTE_WINDOW,
  MIN_DEAL_AMOUNT,
  MAX_DEAL_AMOUNT,
  RPC_URLS,
  DEFAULT_COMMITMENT,
  DEFAULT_PREFLIGHT_COMMITMENT,
} from "./constants";

// Utilities
export {
  deriveEscrowStatePDA,
  deriveVaultAuthorityPDA,
  deriveAllPDAs,
  formatTokenAmount,
  parseTokenAmount,
  formatDealStatus,
  formatVerdict,
  formatTimestamp,
  formatBps,
  calculateFee,
  calculateAmountAfterFee,
  validateAmount,
  validateFeeBps,
  validateDisputeDeadline,
  validatePublicKey,
  validateInitiateParams,
} from "./utils";
export type { ValidationResult } from "./utils/validation";
