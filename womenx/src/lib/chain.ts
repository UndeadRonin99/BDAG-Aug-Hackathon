import { defineChain } from "viem";
const id = Number(process.env.NEXT_PUBLIC_BLOCKDAG_CHAIN_ID || 0);
export const blockdag = defineChain({
  id,
  name: "BlockDAG",
  nativeCurrency: { name: "BDAG", symbol: "BDAG", decimals: 18 },
  rpcUrls: { default: { http: [process.env.NEXT_PUBLIC_BLOCKDAG_RPC_URL!] } },
});
