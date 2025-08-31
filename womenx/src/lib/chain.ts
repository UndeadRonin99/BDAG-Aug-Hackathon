import { defineChain } from "viem";

export const blockdag = defineChain({
  id: Number(process.env.NEXT_PUBLIC_BLOCKDAG_CHAIN_ID || 1043),
  name: "BlockDAG Testnet",
  nativeCurrency: { name: "BDAG", symbol: "BDAG", decimals: 18 },
  rpcUrls: { default: { http: [process.env.NEXT_PUBLIC_BLOCKDAG_RPC_URL!] } },
  blockExplorers: {
    default: { name: "BDAGScan", url: process.env.NEXT_PUBLIC_BLOCKDAG_EXPLORER || "https://primordial.bdagscan.com" },
  },
});
