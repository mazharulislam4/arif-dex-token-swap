import { createContext, useContext, useState } from "react";

const Context = createContext({});

export const useChain = () => useContext(Context);

export const ChainProvider = ({ children }) => {
  const [chain, setChain] = useState(null);
  const [chainList, setChainList] = useState([]);

  const addChain = (wallet) => {
    setChain(wallet);
  };

  const addChainList = (list) => {
    setChainList(list);
  };

  return (
    <Context.Provider value={{ chain, addChain, addChainList, chainList }}>
      {children}
    </Context.Provider>
  );
};
