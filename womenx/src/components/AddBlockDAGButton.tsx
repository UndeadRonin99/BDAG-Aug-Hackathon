"use client";
import { useChainId } from "wagmi";

export function AddBlockDAGButton() {
  const chainId = useChainId();

  async function add() {
    const ethereum = (window as any).ethereum;
    if (!ethereum?.request) return alert("MetaMask not found");

    try {
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: "0x413", // 1043 (BlockDAG Testnet) in hex
          chainName: "BlockDAG Testnet",
          nativeCurrency: { name: "BDAG", symbol: "BDAG", decimals: 18 },
          rpcUrls: ["https://rpc.primordial.bdagscan.com"],
          blockExplorerUrls: ["https://primordial.bdagscan.com"],
        }],
      });
    } catch (e: any) {
      alert(e?.message || "Failed to add/switch network");
    }
  }

  return (
    <button className="btn" onClick={add} title={`Current chain: ${chainId ?? "?"}`}>
      Add / Switch to BlockDAG
    </button>
  );
}
