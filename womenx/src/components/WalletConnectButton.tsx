// src/components/WalletConnectButton.tsx
"use client";
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import type { Address } from "viem";

const DESIRED_CHAIN_ID = Number(process.env.NEXT_PUBLIC_BLOCKDAG_CHAIN_ID || 0);

export default function WalletConnectButton() {
  const { address, isConnected, status } = useAccount();
  const { connectors, connect, isPending, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const metaMaskConnector = connectors.find(c => c.id === "injected");

  function doConnect() {
    if (!metaMaskConnector) {
      alert("MetaMask not found. Please install the MetaMask extension.");
      return;
    }
    connect({ connector: metaMaskConnector });
  }

  const needsSwitch = isConnected && DESIRED_CHAIN_ID && chainId !== DESIRED_CHAIN_ID;

  if (isConnected) {
    return (
      <div style={{ display: "flex", gap: 8 }}>
        {needsSwitch && (
          <button
            className="btn"
            onClick={() => switchChain({ chainId: DESIRED_CHAIN_ID })}
            disabled={isSwitching}
            title={`Switch to chain ${DESIRED_CHAIN_ID}`}
          >
            {isSwitching ? "Switching…" : "Switch Network"}
          </button>
        )}
        <button onClick={() => disconnect()} className="btn" title={address ?? ""}>
          {address?.slice(0, 6)}…{address?.slice(-4)} · Disconnect
        </button>
      </div>
    );
  }

  return (
    <button onClick={doConnect} disabled={isPending} className="btn" title={status}>
      {isPending ? "Connecting…" : "Connect MetaMask"}
    </button>
  );
}
