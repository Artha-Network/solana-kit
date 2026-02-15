import { PublicKey } from "@solana/web3.js";

export type Cluster = 'devnet' | 'testnet' | 'mainnet-beta';

export interface NetworkConfig {
  programId: PublicKey;
  usdcMint: PublicKey;
  pythOracle: PublicKey;
  feeCollector: PublicKey;
}

export const REGISTRY: Record<Cluster, NetworkConfig> = {
  'mainnet-beta': {
    programId: new PublicKey("Artha..."),
    usdcMint: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
    pythOracle: new PublicKey("..."),
    feeCollector: new PublicKey("...")
  },
  'devnet': {
    programId: new PublicKey("ArthaDev..."),
    usdcMint: new PublicKey("4zMMC9MRTSc56aPvGkp4s5jD96nD5Xq5aJ1jlNq2N5F5"), // Devnet USDC
    pythOracle: new PublicKey("..."),
    feeCollector: new PublicKey("...")
  },
  'testnet': {
    // ... config
  } as any
};

export const getConfig = (cluster: Cluster) => REGISTRY[cluster];
