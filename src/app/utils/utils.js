import { OpenoceanSdk } from "@openocean.finance/openocean-sdk";
import axios from "axios";
const genSdk = new OpenoceanSdk();
const { api, swapSdk, config } = genSdk;

// export sdk object
export const openoceanSdk = {
  api,
  swapSdk,
  config,
};

// console.log(swapSdk);

export const getAllChainNames = () => {
  return config.chains;
};

export const getAllWalletsName = () => {
  return config.wallets.walletList;
};

export const connectWallet = async (chain, walletName) => {
  return swapSdk.connectWallet({
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
  return await swapSdk.getBalance({
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
  return await api.getGasPrice({
    chain: chain,
  });
};

// get exchange for approve contact

export const getExchange = async (chain) => {
  if (!chain) throw new Error("Must need chain name");

  return await api.exchange({
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

  return await swapSdk.getAllowance({
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

  return await swapSdk.approve({
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

  return await swapSdk.swapQuote({
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

export const doSwap = (data) => {
  if (!data) throw new Error("Parameter missed!");

  return swapSdk.swap(data);
};

export const getTokenPrice = async (id) => {
  return await swapSdk.api.getTokenPrice(id);
};
