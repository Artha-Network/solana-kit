/**
 * PDA (Program Derived Address) derivation utilities
 * These must match the on-chain program's seed derivations
 */

import { PublicKey } from "@solana/web3.js";
import { ESCROW_SEED, VAULT_SEED } from "../constants";

/**
 * Derive the escrow state PDA
 * Seeds: ["escrow", seller, buyer, mint]
 */
export function deriveEscrowStatePDA(
  seller: PublicKey,
  buyer: PublicKey,
  mint: PublicKey,
  programId: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(ESCROW_SEED),
      seller.toBuffer(),
      buyer.toBuffer(),
      mint.toBuffer(),
    ],
    programId
  );
}

/**
 * Derive the vault authority PDA
 * Seeds: ["vault", escrow_state]
 */
export function deriveVaultAuthorityPDA(
  escrowState: PublicKey,
  programId: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(VAULT_SEED), escrowState.toBuffer()],
    programId
  );
}

/**
 * Convenience function to derive both escrow and vault PDAs
 */
export function deriveAllPDAs(
  seller: PublicKey,
  buyer: PublicKey,
  mint: PublicKey,
  programId: PublicKey
): {
  escrowState: PublicKey;
  escrowBump: number;
  vaultAuthority: PublicKey;
  vaultBump: number;
} {
  const [escrowState, escrowBump] = deriveEscrowStatePDA(
    seller,
    buyer,
    mint,
    programId
  );
  const [vaultAuthority, vaultBump] = deriveVaultAuthorityPDA(
    escrowState,
    programId
  );

  return {
    escrowState,
    escrowBump,
    vaultAuthority,
    vaultBump,
  };
}
