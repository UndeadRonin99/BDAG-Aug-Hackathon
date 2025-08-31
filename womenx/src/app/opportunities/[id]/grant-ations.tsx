"use client";
import { useState } from "react";
import { useWriteContract } from "wagmi";
import { GrantsAbi } from "@/lib/abi/Grants";
import type { Address } from "viem";
import { isAddress, zeroAddress } from "viem";

export default function GrantActions({
  oppId,
  metadataUri,
}: { oppId: string; metadataUri: string }) {
  const [amount, setAmount] = useState("");        // wei as string
  const [tokenInput, setTokenInput] = useState("native"); // user-friendly
  const { writeContract, isPending } = useWriteContract();

  function resolveToken(input: string): Address {
    const raw = input.trim();
    if (raw === "" || raw.toLowerCase() === "native" || raw === "0x0") {
      return zeroAddress; // use zero address to mean native in your contract
    }
    if (isAddress(raw)) return raw as Address;
    throw new Error("Enter a valid token address (0x...) or 'native'.");
  }

  function createGrant() {
    let token: Address;
    try {
      token = resolveToken(tokenInput);
    } catch (e: any) {
      alert(e.message);
      return;
    }
    if (!amount || Number.isNaN(Number(amount))) {
      alert("Enter amount in wei (integer).");
      return;
    }
    const addr = process.env.NEXT_PUBLIC_GRANTS_ADDRESS as Address; // your deployed Grants.sol
    const amt = BigInt(amount);

    writeContract({
      abi: GrantsAbi,
      address: addr,
      functionName: "createGrant",
      args: [token, amt, metadataUri],
    });
  }

  return (
    <div className="card stack">
      <div style={{ fontWeight: 600 }}>On-chain actions</div>
      <input
        className="input"
        placeholder="Amount in wei"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        className="input"
        placeholder="Token address (0x...) or 'native'"
        value={tokenInput}
        onChange={(e) => setTokenInput(e.target.value)}
      />
      <button onClick={createGrant} disabled={isPending} className="btn">
        {isPending ? "Submitting…" : "Create Grant"}
      </button>
    </div>
  );
}
