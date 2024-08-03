import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { CookiesProvider } from 'react-cookie';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  arbitrumSepolia
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: 'zkfetch',
  projectId: '0d9656153fef40b42878cab6a5feef69',
  chains: [arbitrumSepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();


export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>

  <CookiesProvider>
  <Component {...pageProps} />;
  </CookiesProvider> 
  </RainbowKitProvider>
  </QueryClientProvider>
  </WagmiProvider>
  );
}
