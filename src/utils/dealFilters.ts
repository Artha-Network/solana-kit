/**
 * Deal Filtering & Query Helpers
 *
 * Pure utility functions for filtering and sorting arrays of escrow deals.
 * Designed for use in dashboards and listing pages.
 */

import { DealStatus } from "../types";
import type { EscrowState } from "../types";

// ── Filter predicates ───────────────────────────────────────────────────

/** Returns true if the deal is in a terminal (non-actionable) state. */
export function isTerminal(deal: EscrowState): boolean {
  return (
    deal.status === DealStatus.Released ||
    deal.status === DealStatus.Refunded
  );
}

/** Returns true if the deal is still actionable (not terminal). */
export function isActive(deal: EscrowState): boolean {
  return !isTerminal(deal);
}

/** Returns true if the deal is in a disputed state. */
export function isDisputed(deal: EscrowState): boolean {
  return deal.status === DealStatus.Disputed;
}

/** Returns true if the dispute window has expired (deadline passed). */
export function isDisputeWindowExpired(deal: EscrowState, now?: Date): boolean {
  if (!deal.disputeBy) return false;
  const deadline =
    typeof deal.disputeBy === "number"
      ? deal.disputeBy * 1000 // unix seconds → ms
      : new Date(deal.disputeBy as unknown as string).getTime();
  return (now ?? new Date()).getTime() > deadline;
}

/** Filter deals involving a specific wallet (as buyer or seller). */
export function involvedWith(
  deals: EscrowState[],
  wallet: string
): EscrowState[] {
  const w = wallet.toLowerCase();
  return deals.filter(
    (d) =>
      d.seller?.toString().toLowerCase() === w ||
      d.buyer?.toString().toLowerCase() === w
  );
}

// ── Sorting helpers ─────────────────────────────────────────────────────

type SortField = "amount" | "status" | "disputeBy";

/**
 * Sort deals by a given field.
 * Returns a new array — does not mutate the original.
 */
export function sortDeals(
  deals: EscrowState[],
  field: SortField,
  direction: "asc" | "desc" = "asc"
): EscrowState[] {
  const sorted = [...deals].sort((a, b) => {
    switch (field) {
      case "amount": {
        const aAmt = Number(a.amount ?? 0);
        const bAmt = Number(b.amount ?? 0);
        return aAmt - bAmt;
      }
      case "status":
        return (a.status ?? 0) - (b.status ?? 0);
      case "disputeBy": {
        const aTime = Number(a.disputeBy ?? 0);
        const bTime = Number(b.disputeBy ?? 0);
        return aTime - bTime;
      }
      default:
        return 0;
    }
  });
  return direction === "desc" ? sorted.reverse() : sorted;
}

// ── Aggregation ─────────────────────────────────────────────────────────

export interface DealSummary {
  total: number;
  active: number;
  disputed: number;
  completed: number;
  totalVolume: bigint;
}

/** Compute summary statistics for a set of deals. */
export function summarizeDeals(deals: EscrowState[]): DealSummary {
  let active = 0;
  let disputed = 0;
  let completed = 0;
  let totalVolume = BigInt(0);

  for (const deal of deals) {
    const amt = BigInt(deal.amount?.toString() ?? "0");
    totalVolume += amt;

    if (isTerminal(deal)) {
      completed++;
    } else if (isDisputed(deal)) {
      disputed++;
    } else {
      active++;
    }
  }

  return { total: deals.length, active, disputed, completed, totalVolume };
}

/** Group deals by status. */
export function groupByStatus(
  deals: EscrowState[]
): Map<DealStatus, EscrowState[]> {
  const groups = new Map<DealStatus, EscrowState[]>();
  for (const deal of deals) {
    const key = deal.status;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(deal);
  }
  return groups;
}
