import { 
  getAssociatedTokenAddress, 
  getAccount, 
  TokenAccountNotFoundError 
} from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";

export async function getOrCreateATAInfo(
  connection: Connection,
  mint: PublicKey,
  owner: PublicKey
) {
  const address = await getAssociatedTokenAddress(mint, owner);
  
  try {
    const account = await getAccount(connection, address);
    return {
      address,
      exists: true,
      amount: account.amount
    };
  } catch (error: unknown) {
    if (error instanceof TokenAccountNotFoundError) {
      return { address, exists: false, amount: BigInt(0) };
    }
    throw error;
  }
}

export function isSol(mint: PublicKey): boolean {
  return mint.toBase58() === "So11111111111111111111111111111111111111112";
}
