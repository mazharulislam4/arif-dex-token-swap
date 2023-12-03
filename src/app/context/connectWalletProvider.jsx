import { createContext, useContext, useEffect, useState } from "react";
import { connectWallet, getAllWalletsName } from "../utils/utils";
import { useChain } from "./chainContext";
const Context = createContext({});

export const useConnectWallet = () => useContext(Context);

export const ConnectWalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [address, setAddress] = useState(null);
  const [walletList, setWalletList] = useState([]);
  const [connectedWalletName, setConnectedWalletName] = useState(null);
  const { chain } = useChain();

  useEffect(() => {
    if (walletList?.length === 0) {
      const AllWalletNames = getAllWalletsName()?.filter(
        (item) =>
          item.key === "MetaMask" ||
          item.key === "TrustWallet" ||
          item.key === "WalletConnect" ||
          item.key === "BitKeepWallet"
      );
      setWalletList(AllWalletNames);
    }
  }, []);

  //  wallet connect switch  when chain is changed
  useEffect(() => {
    if (chain) {
      (async () => {
        if (!wallet || !connectedWalletName) return;
        wallet.requestConnect(chain?.chain?.id);
        await connectWalletHandler(connectedWalletName, chain?.chain?.key);
      })();
    }
  }, [chain]);

  
  const connectWalletHandler = async (walletName, Chain) => {
    try {
      if (!Chain) {
        Chain = chain?.chain?.key;
      }

      if (!walletName) return;
      setConnectedWalletName(walletName);
      let data = await connectWallet(Chain, walletName);
      console.log(data?.wallet);
      setWallet(data.wallet);
      setAddress(data.wallet.address);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Context.Provider
      value={{ wallet, connectWalletHandler, address, walletList }}
    >
      {children}
    </Context.Provider>
  );
};
