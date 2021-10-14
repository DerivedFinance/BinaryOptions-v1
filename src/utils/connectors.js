import { InjectedConnector } from "@web3-react/injected-connector";

// Add different connectors
export const injected = new InjectedConnector({
  supportedChainIds: [1, 4], // Change according to supported Network Ids
});

export const SUPPORTED_CHAINS = {
  1: "MAINNNET",
  3: "ROPSTEN",
  4: "RINKEBY",
  5: "GOERLI",
  42: "KOVAN",
  1337: "GANACHE",
};
