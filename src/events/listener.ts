import { Program, Idl } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { EventEmitter } from "events";

export class EscrowEventListener extends EventEmitter {
  private listenerId: number | null = null;

  constructor(
    private program: Program<Idl>, 
    private escrowAddress?: PublicKey
  ) {
    super();
  }

  start() {
    // Listen for specific escrow state changes
    this.listenerId = this.program.addEventListener(
      "EscrowUpdate", 
      (event, slot) => {
        // Filter by address if specific listener
        if (this.escrowAddress && event.escrowId !== this.escrowAddress.toBase58()) return;
        
        this.emit("update", {
          stage: event.stage, // e.g., 'Funded', 'Released'
          amount: event.amount.toString(),
          slot
        });
      }
    );
    console.log(`Listening for events on pid: ${this.program.programId}`);
  }

  stop() {
    if (this.listenerId !== null) {
      this.program.removeEventListener(this.listenerId);
      this.listenerId = null;
    }
  }
}
