// src/clients/escrowClient.ts
//
// Thin, typed client for the on-chain escrow program.
// - loads PROGRAM_ID + RPC_URL from env
// - exposes Anchor Program + Connection
// - helpers for fetching deal accounts & simulating transactions
//
// No coupling to other repos – only depends on @solana/web3.js and @coral-xyz/anchor.

import {
  Commitment,
  Connection,
  PublicKey,
  Transaction,
  TransactionSignature,
} from "@solana/web3.js";
import {
  AnchorProvider,
  Program,
  Idl,
  BorshCoder,
} from "@coral-xyz/anchor";

// adjust path if your IDL lives somewhere else
// make sure `resolveJsonModule` is enabled in tsconfig
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import escrowIdl from "../idl/escrow.json";

export const ESCROW_IDL = escrowIdl as Idl;

export interface WalletLike {
  publicKey: PublicKey;
  signTransaction(tx: Transaction): Promise<Transaction>;
  signAllTransactions(txs: Transaction[]): Promise<Transaction[]>;
}

export interface EscrowClientConfig {
  connection: Connection;
  wallet: WalletLike;
  programId: PublicKey;
  commitment?: Commitment;
}

export class EscrowClient {
  readonly connection: Connection;
  readonly program: Program;
  readonly programId: PublicKey;
  readonly provider: AnchorProvider;
  readonly coder: BorshCoder;

  private constructor(cfg: EscrowClientConfig) {
    const { connection, wallet, programId, commitment } = cfg;

    this.connection = connection;
    this.programId = programId;

    this.provider = new AnchorProvider(connection, wallet as any, {
      preflightCommitment: commitment ?? "processed",
      commitment: commitment ?? "processed",
    });

    this.program = new Program(ESCROW_IDL, programId, this.provider);
    this.coder = new BorshCoder(ESCROW_IDL);
  }

  /**
   * Construct an EscrowClient from environment variables:
   *   - RPC_URL
   *   - PROGRAM_ID
   */
  static fromEnv(wallet: WalletLike, opts?: { commitment?: Commitment }) {
    const rpcUrl = process.env.RPC_URL;
    const programIdStr = process.env.PROGRAM_ID;

    if (!rpcUrl) {
      throw new Error("RPC_URL env var is required to create EscrowClient");
    }
    if (!programIdStr) {
      throw new Error("PROGRAM_ID env var is required to create EscrowClient");
    }

    const connection = new Connection(rpcUrl, opts?.commitment ?? "processed");
    const programId = new PublicKey(programIdStr);

    return new EscrowClient({
      connection,
      wallet,
      programId,
      commitment: opts?.commitment,
    });
  }

  /**
   * Fetch raw account data for a deal PDA.
   * The return value is `any` because we don't assume a specific IDL account name.
   * You can cast it to your concrete type in the app.
   */
  async fetchDealAccount(pda: PublicKey): Promise<any | null> {
    // if your IDL has an account named "deal", you can swap in:
    // return this.program.account.deal.fetchNullable(pda);
    const info = await this.connection.getAccountInfo(pda);
    if (!info) return null;

    // Leave decoding to the caller unless you're sure which account type it is.
    // You can use this.coder.accounts.decode(<name>, info.data) in your app.
    return info;
  }

  /**
   * Generic helper to simulate a transaction without sending it.
   */
  async simulate(
    tx: Transaction,
    opts?: { commitment?: Commitment; sigVerify?: boolean }
  ) {
    tx.feePayer ??= this.provider.wallet.publicKey;
    tx.recentBlockhash ??=
      (await this.connection.getLatestBlockhash()).blockhash;

    const encoded = tx.serialize({
      verifySignatures: opts?.sigVerify ?? false,
    });

    return this.connection.simulateTransaction(encoded, {
      commitment: opts?.commitment ?? "processed",
      replaceRecentBlockhash: true,
      sigVerify: opts?.sigVerify ?? false,
    });
  }

  /**
   * Send a transaction and wait for confirmation.
   * You can choose to pre-simulate in the calling code using `simulate()`.
   */
  async sendAndConfirm(
    tx: Transaction,
    opts?: {
      skipPreflight?: boolean;
      commitment?: Commitment;
    }
  ): Promise<TransactionSignature> {
    tx.feePayer ??= this.provider.wallet.publicKey;
    tx.recentBlockhash ??=
      (await this.connection.getLatestBlockhash()).blockhash;

    const signed = await this.provider.wallet.signTransaction(tx);
    const raw = signed.serialize();

    const sig = await this.connection.sendRawTransaction(raw, {
      skipPreflight: opts?.skipPreflight ?? false,
      maxRetries: 3,
    });

    await this.connection.confirmTransaction(
      {
        signature: sig,
        ...(await this.connection.getLatestBlockhash()),
      },
      opts?.commitment ?? "confirmed"
    );

    return sig;
  }
}
