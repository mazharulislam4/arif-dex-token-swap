import axios from "axios";

export const openoceanSdk = async () => {
  const { OpenoceanSdk } = await import("@openocean.finance/openocean-sdk");
  const genSdk = new OpenoceanSdk();
  console.log(genSdk.web3);
  console.log("sdk ", genSdk);

  //  const res = await genSdk.api.getTokenPrice("wbnb");

  return genSdk;
};

export const getAllChainNames = async () => {
  const sdk = await openoceanSdk();
  return sdk.config.chains;
};

export const getAllWalletsName = async () => {
  const sdk = await openoceanSdk();

  return sdk.config.wallets.walletList;
};

export const connectWallet = async (chain, walletName) => {
  const sdk = await openoceanSdk();
  return await sdk.swapSdk.connectWallet({
    chainName: chain,
    walletName: walletName,
  });
};

// get token balance <Accordion>
export const getBalance = async (
  walletAddress,
  chain,
  tokenAddress,
  tokenDecimals
) => {
  const sdk = await openoceanSdk();

  return await sdk.swapSdk.getBalance({
    account: walletAddress,
    chain: chain,
    tokenAddressOrSymbol: tokenAddress,
    decimals: tokenDecimals,
  });
};

// get tokens quote
export const getQuote = async (
  chain,
  inTokenAddress,
  outTokenAddress,
  amount,
  gasPrice,
  slippage = 1
) => {
  if (!chain || !inTokenAddress || !outTokenAddress || !amount || !gasPrice)
    return;

  return await axios.get(
    `https://open-api.openocean.finance/v3/${chain}/quote`,
    {
      params: {
        chain: chain,
        inTokenAddress: inTokenAddress,
        outTokenAddress: outTokenAddress,
        amount: amount,
        gasPrice: gasPrice,
        slippage: slippage,
      },
    }
  );
};

// get gas price
export const getGasprice = async (chain) => {
  if (!chain) throw new Error("Must need chain name");
  const sdk = await openoceanSdk();
  return await sdk.api.getGasPrice({
    chain: chain,
  });
};

// get exchange for approve contact

export const getExchange = async (chain) => {
  if (!chain) throw new Error("Must need chain name");
  const sdk = await openoceanSdk();
  return await sdk.api.exchange({
    chain: chain,
  });
};

// get allowance
export const getAllowance = async (
  chainName,
  decimals,
  tokenAddress,
  approveContract,
  walletAddress
) => {
  if (
    !chainName ||
    !decimals ||
    !tokenAddress ||
    !approveContract ||
    !walletAddress
  )
    throw new Error("Parameter missed!");
  const sdk = await openoceanSdk();

  return await sdk.swapSdk.getAllowance({
    chain: chainName,
    decimals: decimals,
    tokenAddress: tokenAddress,
    approveContract: approveContract,
    account: walletAddress,
  });
};

// get approve

export const getApprove = async (
  chainName,
  decimals,
  tokenAddress,
  approveContract,
  gasPrice,
  amount
) => {
  if (
    !chainName ||
    !decimals ||
    !tokenAddress ||
    !approveContract ||
    !gasPrice ||
    !amount
  )
    throw new Error("Parameter missed!");
  const sdk = await openoceanSdk();

  return await sdk.swapSdk.approve({
    chain: chainName,
    tokenAddress: tokenAddress,
    approveContract: approveContract,
    gasPrice: gasPrice,
    decimals: decimals,
    amount: amount,
  });
};

// get swap quote

export const getSwapQuote = async (
  chainName,
  decimals,
  inTokenAddress,
  outTokenAddress,
  inAmount,
  walletAddress,
  gasPrice,
  slippage = 1
) => {
  if (
    !chainName ||
    !decimals ||
    !inTokenAddress ||
    !outTokenAddress ||
    !inAmount ||
    !walletAddress ||
    !gasPrice
  )
    throw new Error("Parameter missed!");
  const sdk = await openoceanSdk();

  return await sdk.swapSdk.swapQuote({
    chain: chainName,
    inTokenAddress: inTokenAddress,
    outTokenAddress: outTokenAddress,
    amount: inAmount,
    gasPrice: gasPrice,
    slippage: slippage, // 1%
    account: walletAddress,
  });
};

// do swap

export const doSwap = async (data) => {
  if (!data) throw new Error("Parameter missed!");
  const sdk = await openoceanSdk();

  return sdk.swapSdk.swap(data);
};
