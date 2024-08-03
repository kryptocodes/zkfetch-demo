import React, { useEffect, useState } from 'react';
import { Inter } from 'next/font/google';
import { useCookies } from 'react-cookie';
import { useAccount, useSwitchChain, useWriteContract, useConfig } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import ProofDisplay from '../components/ProofDisplay';
import ActionButton from '../components/Button';
import ABI from '../contract/ABI.json';
import toast, { Toaster } from 'react-hot-toast';
import { arbitrumSepolia } from 'viem/chains';


const inter = Inter({ subsets: ["latin"] });


const API = 'https://54.169.171.35.nip.io'
export default function Home() {
  const { isConnected, chainId, connector } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { openConnectModal } = useConnectModal();
  const [cookies] = useCookies(["reclaim"]);
  const [user, setUser] = useState(false);
  const [proof, setProof] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [txLoading, setTxLoading] = useState(false);

  useEffect(() => {
    fetchUserLoginStatus();
  }, [cookies]);

  const { data: hash, isPending, writeContractAsync } = useWriteContract();


  const fetchUserLoginStatus = async () => {
    try {
      const res = await fetch(`${API}/user/isLoggedIn`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      if(data.loggedIn) {
         setUser(data);
      }
    } catch (error) {
      console.log(error);
    }
  }


  const fetchProof = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/user/info`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      console.log(data);
      setProof(data);
      setLoading(false);
    } catch (error) {
      toast.error(`Oops! you have been rateLimited, try again later`);
      console.log(error);
      setLoading(false);
    }
  };

  const verifyProof = async () => {
    if (!isConnected) {
      toast.error("Connect your wallet to verify proof");
      return;
    }
    if(isConnected && chainId !== arbitrumSepolia.id) {
      toast.error("Please switch to Arbitrum Sepolia");
      await switchChainAsync({ chainId: 421611 });
      return;
    }
    try {
      setTxLoading(true);
      const tx = await writeContractAsync({
        abi: ABI,
        address: "0x61a843440711261bb3095feB6c10F304673D6455",
        functionName: "verifyProof",
        args: [proof?.proofData],
      });

      if(tx) {
        toast.success('Proof Verified');
      }
      console.log(tx, hash);
      console.log("Proof Verified");
      setTxLoading(false);
    } catch (error) {
      toast.error(`${error}`);
      console.log(error);
      setTxLoading(false);
    }
  };

  return (
    <>
    <Toaster position='top-right' />
    <main className={`flex flex-col items-center justify-center p-8 ${inter.className} bg-gray-50 relative`}>
   
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-4 text-gray-800">
        zkFetch - Demo
      </h1>
      <p className="text-center text-md md:text-lg text-gray-600 mb-8">
        a simple demo to showcase how you can use zkFetch to verify your Twitter data 
      </p>
      {proof && (
        <ProofDisplay proof={proof} setProof={setProof} />
      )}
      <div className="gap-4 flex flex-col items-center">
        {user && !proof ? (
          <ActionButton
            onClick={fetchProof}
            isLoading={loading}
            loadingText='Generating Proof'
            label="Fetch Username and Generate Proof"
          />
        ) : proof ? (
          <ActionButton
            onClick={() => isConnected ? verifyProof() : openConnectModal?.()}
            isLoading={txLoading || isPending}
            label="Verify Proof"
          />
        ) : (
          <ActionButton
            onClick={() => window.open(`${API}/twitter/auth`, "_self")}
            isLoading={false}
            label="Login with Twitter"
          />
        )}
      </div>
     
    </main>
    </>
  );
}
