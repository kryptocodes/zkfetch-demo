import React, { useEffect, useState } from 'react';
import { Inter } from 'next/font/google';
import { useCookies } from 'react-cookie';
import { useAccount, useWriteContract } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import ProofDisplay from '../components/ProofDisplay';
import ActionButton from '../components/Button';
import ABI from '../contract/ABI.json';

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [cookies] = useCookies(["reclaim"]);
  const [user, setUser] = useState(false);
  const [proof, setProof] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [txLoading, setTxLoading] = useState(false);

  useEffect(() => {
    if (cookies.reclaim) {
      setTimeout(() => {
        fetchUserLoginStatus();
      }, 1000);
    }
  }, [cookies]);

  const { data: hash, isPending, writeContractAsync } = useWriteContract();


  const fetchUserLoginStatus = async () => {
    try {
      const res = await fetch("https://m8aanm1noe.execute-api.ap-southeast-1.amazonaws.com/user/isLoggedIn", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      console.log(data);
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  }


  const fetchProof = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://m8aanm1noe.execute-api.ap-southeast-1.amazonaws.com/user/info", {
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
      console.log(error);
      setLoading(false);
    }
  };

  const verifyProof = async () => {
    if (!isConnected) {
      alert("Please connect your wallet");
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
        alert("Transaction sent");
      }
      console.log(tx, hash);
      console.log("Proof Verified");
      setTxLoading(false);
    } catch (error) {
      console.log(error);
      setTxLoading(false);
    }
  };

  return (
    <>
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
            onClick={() => {
              if(!isConnected) {
                openConnectModal
                return;
              } else {
                verifyProof();
              }
            }}
            isLoading={txLoading || isPending}
            label="Verify Proof"
          />
        ) : (
          <ActionButton
            onClick={() => window.open("https://m8aanm1noe.execute-api.ap-southeast-1.amazonaws.com/twitter/auth", "_self")}
            isLoading={false}
            label="Login with Twitter"
          />
        )}
      </div>
     
    </main>
    </>
  );
}
