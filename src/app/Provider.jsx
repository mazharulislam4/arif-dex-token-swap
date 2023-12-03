"use client";
import { ChakraProvider } from "@chakra-ui/react";
import { ChainProvider } from "./context/chainContext";
import { ConnectWalletProvider } from "./context/connectWalletProvider";

function Provider({ children }) {
  return (
    <ChakraProvider>
      <ChainProvider>
        <ConnectWalletProvider>{children}</ConnectWalletProvider>
      </ChainProvider>
    </ChakraProvider>
  );
}

export default Provider;
