import { Connection, Transaction, VersionedTransaction } from "@solana/web3.js";

export interface SimulationResult {
  success: boolean;
  logs: string[];
  unitsConsumed: number;
  error?: string;
}

export async function simulateTx(
  connection: Connection,
  tx: Transaction | VersionedTransaction
): Promise<SimulationResult> {
  const { value } = await connection.simulateTransaction(tx, {
    replaceRecentBlockhash: true,
    commitment: "processed"
  });

  if (value.err) {
    return {
      success: false,
      logs: value.logs || [],
      unitsConsumed: 0,
      error: JSON.stringify(value.err)
    };
  }

  return {
    success: true,
    logs: value.logs || [],
    unitsConsumed: value.unitsConsumed || 0
  };
}
