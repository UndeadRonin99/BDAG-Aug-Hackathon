// src/lib/wagmi.tsx
"use client";
import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { blockdag } from "./chain";

export const wagmiConfig = createConfig({
  chains: [blockdag],
  connectors: [
    injected({
      target: "metaMask", // prefer MetaMask if multiple injected wallets
      shimDisconnect: true,
    }),
  ],
  transports: {
    [blockdag.id]: http(blockdag.rpcUrls.default.http[0]),
  },
});
