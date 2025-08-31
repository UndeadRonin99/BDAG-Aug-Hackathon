"use client";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

export default function WalletConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <button onClick={() => disconnect()} className="btn" title={address ?? ""}>
        {address?.slice(0, 6)}…{address?.slice(-4)} · Disconnect
      </button>
    );
  }
  return (
    <button onClick={() => connect({ connector: injected() })} disabled={isPending} className="btn">
      {isPending ? "Connecting…" : "Connect MetaMask"}
    </button>
  );
}
