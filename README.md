# solana-kit
Thin, typed client for your program (and helpers for Actions/tx building).
```md
# @trust-escrow/solana-kit

TypeScript client SDK for the **Onchain Escrow** program:
- Typed builders for all instructions
- Helpers for simulation & decoding events
- Optional React hooks for read-only queries

## Install
```bash
pnpm add @trust-escrow/solana-kit
API Surface

builders/: buildInitiate, buildFund, buildSubmitEvidence, buildOpenDispute, buildResolve, buildRelease, buildRefund

idl/escrow.json: bundled IDL

clients/escrowClient.ts: low-level Anchor client helpers

hooks.ts (optional): useDeal, useBalance, etc.
Environment
Var	Description
PROGRAM_ID	Escrow program address
RPC_URL	Solana RPC endpoint
Dev & Test
pnpm i
pnpm test
# optional: spin local validator and run e2e simulations
License

MIT
