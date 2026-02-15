// Note: This requires 'react' as a peerDependency
import { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';

export function useEscrowState(program: Program, escrowAddress: PublicKey) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subId: number;

    const fetch = async () => {
      try {
        const account = await program.account.escrow.fetch(escrowAddress);
        setData(account);
      } finally {
        setLoading(false);
      }
    };

    fetch();

    // Real-time subscription
    subId = program.connection.onAccountChange(escrowAddress, (acc) => {
      const decoded = program.coder.accounts.decode("Escrow", acc.data);
      setData(decoded);
    });

    return () => {
      program.connection.removeAccountChangeListener(subId);
    };
  }, [program, escrowAddress]);

  return { data, loading };
}
