// src/builders/dealBuilders.ts
//
// Generic instruction/transaction builders for the escrow program.
//
// These functions DO NOT assume:
// - any particular PDA layout
// - any cross-repo types
//
// They simply wrap Anchor's `program.methods.<name>()` with a single,
// consistent calling convention.
//
// You pass:
//   - `program`: the Anchor Program instance (from EscrowClient)
//   - `args`:   positional arguments for the instruction (in order, as IDL defines)
//   - `accounts`: record of account pubkeys `{ deal, buyer, seller, ... }`
//   - (optional) `remainingAccounts` if you need extra metas
//
// If your IDL uses different method names (e.g., `init_deal`), you can
// change the `methodName` strings below without touching the rest.

import {
  PublicKey,
  TransactionInstruction,
  Transaction,
  AccountMeta,
} from "@solana/web3.js";
import type { Program } from "@coral-xyz/anchor";

export interface BuilderContext {
  program: Program;
  /**
   * Optional: if you want the builder to set tx.feePayer.
   * If omitted, caller can set feePayer later.
   */
  feePayer?: PublicKey;
}

/**
 * Internal generic helper. Most callers won't use this directly.
 */
async function buildSingleInstructionTx(params: {
  ctx: BuilderContext;
  methodName: string;
  args: unknown[];
  accounts: Record<string, PublicKey>;
  remainingAccounts?: AccountMeta[];
}): Promise<{ ix: TransactionInstruction; tx: Transaction }> {
  const { ctx, methodName, args, accounts, remainingAccounts } = params;

  const methods: any = (ctx.program as any).methods;
  const methodFn =
    methods?.[methodName] ?? methods?.[camelToSnake(methodName)];

  if (!methodFn) {
    throw new Error(
      `Program has no method '${methodName}' or '${camelToSnake(
        methodName
      )}'. Please adjust builder to match your IDL.`
    );
  }

  const builder = methodFn(...args).accounts(accounts);

  if (remainingAccounts && remainingAccounts.length > 0) {
    builder.remainingAccounts(remainingAccounts);
  }

  const ix: TransactionInstruction = await builder.instruction();
  const tx = new Transaction().add(ix);

  if (ctx.feePayer) {
    tx.feePayer = ctx.feePayer;
  }

  return { ix, tx };
}

function camelToSnake(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toLowerCase();
}

// ------------- Public builders ------------- //

export interface InitiateBuilderParams {
  ctx: BuilderContext;
  /**
   * Positional args expected by the `initiate` method in your IDL.
   * Example (if your IDL is `initiate(ctx, params)`):
   *   args: [ { amount, expiresAt, metadataCid } ]
   */
  args: unknown[];
  accounts: Record<string, PublicKey>;
  remainingAccounts?: AccountMeta[];
}

/**
 * Build a transaction that initializes a new deal.
 */
export async function buildInitiate(
  params: InitiateBuilderParams
): Promise<{ ix: TransactionInstruction; tx: Transaction }> {
  return buildSingleInstructionTx({
    ctx: params.ctx,
    methodName: "initiate",
    args: params.args,
    accounts: params.accounts,
    remainingAccounts: params.remainingAccounts,
  });
}

export interface FundBuilderParams {
  ctx: BuilderContext;
  args: unknown[];
  accounts: Record<string, PublicKey>;
  remainingAccounts?: AccountMeta[];
}

/**
 * Build a transaction for funding a deal (buyer deposits USDC).
 */
export async function buildFund(
  params: FundBuilderParams
): Promise<{ ix: TransactionInstruction; tx: Transaction }> {
  return buildSingleInstructionTx({
    ctx: params.ctx,
    methodName: "fund",
    args: params.args,
    accounts: params.accounts,
    remainingAccounts: params.remainingAccounts,
  });
}

export interface SubmitEvidenceBuilderParams {
  ctx: BuilderContext;
  args: unknown[];
  accounts: Record<string, PublicKey>;
  remainingAccounts?: AccountMeta[];
}

/**
 * Build a transaction that submits new evidence (CID, role, etc.).
 */
export async function buildSubmitEvidence(
  params: SubmitEvidenceBuilderParams
): Promise<{ ix: TransactionInstruction; tx: Transaction }> {
  return buildSingleInstructionTx({
    ctx: params.ctx,
    methodName: "submitEvidence",
    args: params.args,
    accounts: params.accounts,
    remainingAccounts: params.remainingAccounts,
  });
}

export interface OpenDisputeBuilderParams {
  ctx: BuilderContext;
  args: unknown[];
  accounts: Record<string, PublicKey>;
  remainingAccounts?: AccountMeta[];
}

/**
 * Build a transaction that moves a deal into DISPUTED state.
 */
export async function buildOpenDispute(
  params: OpenDisputeBuilderParams
): Promise<{ ix: TransactionInstruction; tx: Transaction }> {
  return buildSingleInstructionTx({
    ctx: params.ctx,
    methodName: "openDispute",
    args: params.args,
    accounts: params.accounts,
    remainingAccounts: params.remainingAccounts,
  });
}

export interface ResolveBuilderParams {
  ctx: BuilderContext;
  args: unknown[];
  accounts: Record<string, PublicKey>;
  remainingAccounts?: AccountMeta[];
}

/**
 * Build a transaction that applies a ResolveTicket decision on-chain.
 */
export async function buildResolve(
  params: ResolveBuilderParams
): Promise<{ ix: TransactionInstruction; tx: Transaction }> {
  return buildSingleInstructionTx({
    ctx: params.ctx,
    methodName: "resolve",
    args: params.args,
    accounts: params.accounts,
    remainingAccounts: params.remainingAccounts,
  });
}

export interface ReleaseBuilderParams {
  ctx: BuilderContext;
  args: unknown[];
  accounts: Record<string, PublicKey>;
  remainingAccounts?: AccountMeta[];
}

/**
 * Build a transaction for the "happy path" release (buyer approves, seller paid).
 */
export async function buildRelease(
  params: ReleaseBuilderParams
): Promise<{ ix: TransactionInstruction; tx: Transaction }> {
  return buildSingleInstructionTx({
    ctx: params.ctx,
    methodName: "release",
    args: params.args,
    accounts: params.accounts,
    remainingAccounts: params.remainingAccounts,
  });
}

export interface RefundBuilderParams {
  ctx: BuilderContext;
  args: unknown[];
  accounts: Record<string, PublicKey>;
  remainingAccounts?: AccountMeta[];
}

/**
 * Build a transaction that refunds the buyer (e.g., seller never delivered).
 */
export async function buildRefund(
  params: RefundBuilderParams
): Promise<{ ix: TransactionInstruction; tx: Transaction }> {
  return buildSingleInstructionTx({
    ctx: params.ctx,
    methodName: "refund",
    args: params.args,
    accounts: params.accounts,
    remainingAccounts: params.remainingAccounts,
  });
}
