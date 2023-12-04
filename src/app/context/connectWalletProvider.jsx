import { createContext, useContext, useEffect, useState } from "react";
import { connectWallet, getAllWalletsName } from "../utils/utils";
import { useChain } from "./chainContext";
const Context = createContext({});



export const useConnectWallet = () => useContext(Context);

export const ConnectWalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [address, setAddress] = useState(null);
  const [walletList, setWalletList] = useState([]);
  const { chain } = useChain();

  
  useEffect(() => {
    (async () => {
      if (walletList?.length === 0) {
        const rs = await getAllWalletsName();

        const AllWalletNames = rs?.filter(
          (item) =>
            item.key === "MetaMask" ||
            item.key === "TrustWallet" ||
            item.key === "WalletConnect" ||
            item.key === "BitKeepWallet"
        );
        setWalletList(AllWalletNames);
      }
    })();
  }, []);

  const connectWalletHandler = async (walletName, Chain) => {
    try {
      if (!Chain) {
        Chain = chain?.chain?.key;
      }

      if (!walletName) return;
      let data = await connectWallet(Chain, walletName);

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
