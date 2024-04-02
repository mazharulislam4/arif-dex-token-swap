"use client";
import { ChakraProvider } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import arbitrumIcon from "./assets/Icons/arbitrum.svg";
import bscIcon from "./assets/Icons/bsc.svg";
import ethIcon from "./assets/Icons/eth.svg";
import Zksync from "./assets/Icons/zksync.svg";
import { ChainProvider } from "./context/chainContext";
import { ConnectWalletProvider } from "./context/connectWalletProvider";
import { getAllChainNames } from "./utils/utils";

function Provider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [chainList, setChainList] = useState([]);
  const [defaultChain, setDefaultChain] = useState({});

  // loading
  useEffect(() => {
    setInterval(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    (async () => {
      if (chainList?.length === 0) {
        let AllChainNames = await getAllChainNames();

        const list = AllChainNames?.chainList.filter(
          (chain) =>
            chain.key === "arbitrum" ||
            chain.key === "bsc" ||
            chain.key === "eth" ||
            chain.key === "zksync"
        );


        const listWithIcon = list?.map((chain) => ({
          icon:
            (chain?.key === "bsc" && bscIcon) ||
            (chain?.key === "eth" && ethIcon) ||
            (chain?.key === "arbitrum" && arbitrumIcon) ||
            (chain?.key === "zksync" && Zksync),

          chain: chain,
        }));

        const findDefault = listWithIcon?.find(
          (value) => value?.chain?.key === "eth"
        );

        setChainList(listWithIcon);
        setDefaultChain(findDefault);
      }
    })();
  }, []);

  return isLoading ? (
    <div className="h-screen w-full text-center flex justify-center items-center">
      loading......
    </div>
  ) : (
    <ChakraProvider>
      <ChainProvider chainList={chainList} defaultChain={defaultChain}>
        <ConnectWalletProvider>{children}</ConnectWalletProvider>
      </ChainProvider>
    </ChakraProvider>
  );
}

export default Provider;
