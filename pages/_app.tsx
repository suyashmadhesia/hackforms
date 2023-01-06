import "../styles/globals.css";
import "survey-core/defaultV2.min.css";
import 'survey-core/modern.min.css';
import "survey-creator-core/survey-creator-core.min.css";
// import "tailwindcss/tailwind.css";
import type { AppProps } from "next/app";
import { wrapper } from "../store";
import CustomErrorBoundary from "../components/common/CutomErrorBoundary";
import { useRouter } from "next/router";
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";

import { Web3Modal } from "@web3modal/react";

import { configureChains, createClient, WagmiConfig } from "wagmi";

import { goerli } from "wagmi/chains";

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();


  const chains = [goerli]

// Wagmi client
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: process.env.NEXT_PUBLIC_WC_ID as string }),
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: "Hackforms", chains }),
  provider
});

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains);

  return (
    <CustomErrorBoundary router={router}>
      <WagmiConfig client={wagmiClient}>
        <Component {...pageProps} />
      </WagmiConfig>
      <Web3Modal projectId={process.env.NEXT_PUBLIC_WC_ID as string} ethereumClient={ethereumClient} />
    </CustomErrorBoundary>
    
  );
}

export default wrapper.withRedux(App);