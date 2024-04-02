import { createContext, useContext, useState } from "react";

const Context = createContext({});

export const useChain = () => useContext(Context);

export const ChainProvider = ({ chainList , defaultChain,  children }) => {
  const [chain, setChain] = useState(defaultChain);
  const [chainsList, setChainList] = useState(chainList || []);

  const addChain = (wallet) => {
    setChain(wallet);
  };

  const addChainList = (list) => {
    setChainList(list);
  };

  return (
    <Context.Provider value={{ chain, addChain, addChainList, chainList: chainsList }}>
      {children}
    </Context.Provider>
  );
};
