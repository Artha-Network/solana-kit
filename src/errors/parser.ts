import { AnchorError, ProgramError } from "@coral-xyz/anchor";

export class EscrowError extends Error {
  constructor(public code: number, public msg: string, public logs?: string[]) {
    super(msg);
    this.name = "EscrowError";
  }
}

const ERROR_MAP: Record<number, string> = {
  6000: "EscrowExpired: The deadline for this escrow has passed.",
  6001: "InvalidStage: The escrow is not in the correct stage for this action.",
  6002: "InsufficientFunds: The vault does not contain the required amount.",
  6003: "Unauthorized: You are not the designated signer."
};

export function parseError(err: any): EscrowError {
  // Handle Anchor Errors
  if (err instanceof AnchorError) {
    return new EscrowError(err.error.errorCode.number, err.error.errorMessage, err.logs);
  }

  // Handle Raw Logs (Regex for custom program errors)
  const customErrorRegex = /custom program error: (0x[0-9a-f]+)/i;
  const match = err.message?.match(customErrorRegex);

  if (match) {
    const code = parseInt(match[1], 16);
    const msg = ERROR_MAP[code] || "Unknown Program Error";
    return new EscrowError(code, msg);
  }

  return new EscrowError(500, "Unknown Client Error: " + err.message);
}
