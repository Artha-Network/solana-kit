# solana-kit

TypeScript SDK for Artha Network's on-chain escrow program.

## Overview

Thin, typed client library providing transaction builders and utility functions for interacting with the Artha Network escrow program on Solana.

## Sprint 3 Additions

This sprint added developer utilities and type safety:

- **Types** (`src/types/`) - TypeScript definitions for all program structures
- **Constants** (`src/constants/`) - Program IDs, mints, limits, and network configs  
- **PDA Utils** (`src/utils/pda.ts`) - Derive escrow and vault addresses
- **Formatting** (`src/utils/formatting.ts`) - Convert and display token amounts
- **Validation** (`src/utils/validation.ts`) - Input validation with error messages

## Structure

```
src/
├── builders/       # Transaction builders (existing)
├── clients/        # Anchor client wrapper (existing)
├── types/          # TypeScript types (Sprint 3)
├── constants/      # Config constants (Sprint 3)
└── utils/          # Helper functions (Sprint 3)
```

## Usage

```typescript
import { 
  deriveEscrowStatePDA, 
  parseTokenAmount,
  validateAmount,
  PROGRAM_IDS 
} from "@artha-network/solana-kit";

// Derive PDA
const [escrowState, bump] = deriveEscrowStatePDA(
  seller, buyer, mint, PROGRAM_IDS.devnet
);

// Parse amounts
const amount = parseTokenAmount("100"); // 100 USDC

// Validate before sending
const result = validateAmount(amount);
if (!result.valid) throw new Error(result.error);
```

## Development

```bash
npm install
npm run build
npm run type-check
npm run lint
```

## License

MIT
