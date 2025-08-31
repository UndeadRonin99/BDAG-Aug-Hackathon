"use client";
import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { blockdag } from "./chain";

export const wagmiConfig = createConfig({
  chains: [blockdag],
  connectors: [injected()],
  transports: { [blockdag.id]: http(blockdag.rpcUrls.default.http[0]) },
});
