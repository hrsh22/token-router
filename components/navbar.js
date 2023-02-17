import React from "react";
import { useState, useEffect } from "react";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { signIn } from "next-auth/react";
import { useAccount, useConnect, useSignMessage, useDisconnect } from "wagmi";
import { useRouter } from "next/router";
import { useAuthRequestChallengeEvm } from "@moralisweb3/next";
import Home from "./home";

const Navbar = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [Connected, setConnected] = useState(false);

  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { requestChallengeAsync } = useAuthRequestChallengeEvm();
  const { push } = useRouter();

  const handleAuth = async () => {
    if (isConnected) {
      await disconnectAsync();
    }

    const { account, chain } = await connectAsync({
      connector: new MetaMaskConnector(),
    });

    const { message } = await requestChallengeAsync({
      address: account,
      chainId: chain.id,
    });
     
    setWalletAddress(account);
    setConnected(true);

    const signature = await signMessageAsync({ message });

    // redirect user after success authentication to '/user' page
    // const { url } = await signIn("moralis-auth", {
    //   message,
    //   signature,
    //   redirect: false,
    //   callbackUrl: "/home",
    // });
    // /**
    //  * instead of using signIn(..., redirect: "/user")
    //  * we get the url from callback and push it to the router to avoid page refreshing
    //  */
    // push(url);
  };

  return (
    <>
    <nav class="bg-gray-100">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex justify-between">
          <div class="flex space-x-4">
            {/* <!-- logo --> */}
            <div>
              <a
                href="#"
                class="flex items-center py-5 px-2 text-gray-700 hover:text-gray-900"
              >
                <svg
                  class="h-6 w-6 mr-1 text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                <span class="font-bold">MetaMask Integration</span>
              </a>
            </div>

            {/* <!-- primary nav --> */}
            {/* <div class="hidden md:flex items-center space-x-1">
          <a href="#" class="py-5 px-3 text-gray-700 hover:text-gray-900">Features</a>
          <a href="#" class="py-5 px-3 text-gray-700 hover:text-gray-900">Pricing</a>
        </div> */}
          </div>

          {/* <!-- secondary nav --> */}
          <div class="hidden md:flex items-center space-x-1">
            {/* <a href="" class="py-5 px-3">Login</a> */}
            {walletAddress && Connected ? (
              <button
                href=""
                class="py-2 px-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 hover:text-yellow-800 rounded transition duration-300"
              >
                {walletAddress}
              </button>
            ) : (
              <button
                href=""
                class="py-2 px-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 hover:text-yellow-800 rounded transition duration-300"
                onClick={handleAuth}
              >
                Connect Wallet
              </button>
            )}
            
          </div>
          
          {/* <!-- mobile button goes here --> */}
          <div class="md:hidden flex items-center">
            <button class="mobile-menu-button">
              <svg
                class="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* <!-- mobile menu --> */}
      <div class="mobile-menu hidden md:hidden">
        <a href="#" class="block py-2 px-4 text-sm hover:bg-gray-200">
          Features
        </a>
        <a href="#" class="block py-2 px-4 text-sm hover:bg-gray-200">
          Pricing
        </a>
      </div>
    </nav>
    <Home walletAddress={walletAddress} />
    </>
  );
};

export default Navbar;
