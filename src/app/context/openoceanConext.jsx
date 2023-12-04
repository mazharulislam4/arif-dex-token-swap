import { createContext, useContext, useEffect, useState } from "react";

const Context = createContext({});
export const useOpenocean = () => useContext(Context);

export const OpenoceanSdkProvider = ({ children }) => {
  const [oceanSdk, setOceanSdk] = useState(null);


  //   initialize sdk
  useEffect(() => {
    (async () => {
      const res = await openoceanSdk();
      setOceanSdk(res);
    })();
  }, []);

  const openoceanSdk = async () => {
    const { OpenoceanSdk } = await import("@openocean.finance/openocean-sdk");
    const genSdk = new OpenoceanSdk();
    return genSdk;
  };


  return (
    <Context.Provider
      value={{ openoceanSdk: oceanSdk}}
    >
      {children}
    </Context.Provider>
  );
};
