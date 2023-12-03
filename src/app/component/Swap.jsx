"use client";

import { Box, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useChain } from "../context/chainContext";
import { useConnectWallet } from "../context/connectWalletProvider";
import {
  doSwap,
  getAllowance,
  getApprove,
  getBalance,
  getExchange,
  getGasprice,
  getQuote,
  getSwapQuote,
  getTokenPrice,
} from "../utils/utils";
import WalletsDropdown from "./dropdown/WalletsDropdown";
import TokenListInputAndModal from "./modal/TokenListModal";

function Swap() {
  const { chain } = useChain();
  const [tokenList, setTokenList] = useState([]);
  const [allTokenList, setAllTokenList] = useState([]);
  const [inToken, setInToken] = useState(null);
  const [outToken, setOutToken] = useState(null);
  const [inTokenInput, setInTokenInput] = useState("0.00");
  const [outTokenInput, setOutTokenInput] = useState("0.00");
  const { wallet, address, connectWalletHandler } = useConnectWallet();
  const [gasprice, setGasprice] = useState(null);

  useEffect(() => {
    (async () => {
      if (chain) {
        const selectedChain = chain?.chain?.key;
        let tokenList = [];
        try {
          const res = await axios.get(
            `https://open-api.openocean.finance/v3/${chain?.chain?.key}/tokenList`
          );

          setAllTokenList(res?.data?.data);
          tokenList = filteredTokenList(res?.data?.data, selectedChain);
          setTokenList(tokenList);
          setInToken(tokenList[0]);
          setOutToken(tokenList[1]);
        } catch (err) {
          console.log(err);
        }
      }
    })();
  }, [chain]);

  // set gasprice

  useEffect(() => {
    if (chain) {
      (async () => {
        try {
          const price = await getGasprice(chain.chain.key);
          setGasprice(price);
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [chain]);

  // filter token list
  const filteredTokenList = (data, selectedChain) => {
    const bscChainKey = "bsc";
    const arbitrumChainKey = "arbitrum";

    const allowedEthSymbols = [
      "UNI",
      "AAVE",
      "ETH",
      "WETH",
      "1INCH",
      "DAI",
      "USDC",
      "ARB",
      "USDT",
      "BAND",
      "WBTC",
    ];

    const allowedBscSymbols = [
      "BNB",
      "WBNB",
      "CAKE",
      "USDT",
      "USDC",
      "DAI",
      "FET",
      "HFT",
      "SUSHI",
      "UNI",
      "WOO",
    ];
    const allowedArbitrumSymbols = [
      "ARB",
      "ETH",
      "USDC",
      "USDT",
      "WETH",
      "WBTC",
      "GMX",
      "FTM",
    ];

    return data.filter((token) => {
      const symbol = token?.symbol;
      switch (selectedChain) {
        case arbitrumChainKey:
          return allowedArbitrumSymbols.includes(symbol);

        case bscChainKey:
          return allowedBscSymbols.includes(symbol);
        default:
          return allowedEthSymbols.includes(symbol);
      }
    });
  };

  const tokenSwitchHandler = () => {
    setInToken(outToken);
    setOutToken(inToken);
    setInTokenInput("0.00");
    setOutTokenInput("0.00");
  };

  // get tokens  quote
  useEffect(() => {
    if (!inTokenInput) return;

    const amount = !isNaN(inTokenInput) ? Number(inTokenInput) : 0;

    if (amount > 0 && inToken?.address && outToken?.address) {
      (async () => {
        try {
          const res = await getTokenPrice(inToken?.address);
          console.log(res);
          const quote = await getQuote(
            chain?.chain?.key,
            inToken?.address,
            outToken?.address,
            amount,
            5
          );

          if (quote?.data?.code === 200 && quote?.data?.data) {
            setOutTokenInput(
              new BigNumber(quote.data.data.outAmount)
                .div(10 ** outToken.decimals)
                .toFixed(4)
            );
          }
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [inTokenInput, inToken, outToken, chain]);

  // handlers
  const setInTokenHandler = (token) => {
    setInToken(token);
    setInTokenInput("0.00");
    setOutTokenInput("0.00");
  };

  const setOutTokenHandler = (token) => {
    setOutToken(token);
    setInTokenInput("0.00");
    setOutTokenInput("0.00");
  };

  const onSwapHandler = async () => {
    if (!inToken) return;
    const amount = !isNaN(inTokenInput) ? Number(inTokenInput) : 0;

    try {
      if (amount > 0) {
        const balance = await getBalance(
          address,
          chain?.chain?.key,
          inToken.address,
          inToken.decimals
        );

        if (balance?.short < amount) {
          return alert(`${inToken.symbol} Insufficient balance.`);
        }

        const exchange = await getExchange(chain.chain.key);
        if (!exchange) return;
        const allowance = await allowanceHandler(exchange.data.approveContract);

        if (new BigNumber(allowance).lt(amount)) {
          await approveHandler(amount, exchange.data.approveContract);
          return;
        }

        const res = await swapQuoteHandler(amount);

        console.log(res);

        if (res?.data) {
          const swp = doSwap(res.data);

          swp
            .on("error", (err) => {
              console.log("swap error", err);
            })
            .on("transactionHash", (hash) => {
              console.log(" swap hash", hash);
            })
            .on("receipt", (data) => {
              console.log(" swap data", data);
            })
            .on("success", (data) => {
              console.log(" swap success", data);
            });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // approve handler
  const approveHandler = async (amount, approveContract) => {
    try {
      const res = await getApprove(
        chain.chain?.key,
        inToken.decimals,
        inToken.address,
        approveContract,
        gasprice,
        amount
      );

      if (!res?.code) {
        res
          .on("error", (err) => {
            console.log(err);
          })
          .on("transactionHash", (hash) => {
            console.log(hash);
          })
          .on("receipt", (data) => {
            console.log("receipt", data);
          })
          .on("success", (data) => {
            console.log("success", data);
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  // allowance handler

  const allowanceHandler = async (approveContract) => {
    try {
      const res = await getAllowance(
        chain.chain?.key,
        inToken.decimals,
        inToken.address,
        approveContract,
        address
      );

      return res;
    } catch (err) {
      console.log(err);
    }
  };

  // swap quote handler

  const swapQuoteHandler = async (amount) => {
    try {
      const res = await getSwapQuote(
        chain?.chain?.key,
        inToken.decimals,
        inToken.address,
        outToken.address,
        amount,
        address,
        gasprice,
        1
      );

      return res;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box className="lg:w-[559px] w-full block rounded-[30px] !bg-primary pb-[50px] pt-[24px] px-[43px]">
      {/* header  */}
      <Box className="w-full relative ">
        <Box className="text-center">
          <Text
            bgGradient="linear-gradient(94deg, #A8DAFF 1.17%, #FFF7E6 106.1%)"
            bgClip="text"
            className=" !font-clashSemibold  !font-[500] text-[2.81rem]"
          >
            Swap
          </Text>
          <Text className="font-[16rem] leading-[10px] text-gray ">
            Trade tokens at best rates
          </Text>
        </Box>
        <Box className="absolute  top-[50%] right-0 transform translate-y-[-50%] ">
          <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_1_54)">
              <path
                d="M12.0001 16.0002C10.9392 16.0002 9.92178 15.5788 9.17163 14.8286C8.42148 14.0785 8.00006 13.0611 8.00006 12.0002C8.00006 10.9394 8.42148 9.92194 9.17163 9.17179C9.92178 8.42165 10.9392 8.00022 12.0001 8.00022C13.0609 8.00022 14.0783 8.42165 14.8285 9.17179C15.5786 9.92194 16.0001 10.9394 16.0001 12.0002C16.0001 13.0611 15.5786 14.0785 14.8285 14.8286C14.0783 15.5788 13.0609 16.0002 12.0001 16.0002ZM12.0001 10.0002C11.4696 10.0002 10.9609 10.2109 10.5858 10.586C10.2108 10.9611 10.0001 11.4698 10.0001 12.0002C10.0001 12.5307 10.2108 13.0394 10.5858 13.4144C10.9609 13.7895 11.4696 14.0002 12.0001 14.0002C12.5305 14.0002 13.0392 13.7895 13.4143 13.4144C13.7893 13.0394 14.0001 12.5307 14.0001 12.0002C14.0001 11.4698 13.7893 10.9611 13.4143 10.586C13.0392 10.2109 12.5305 10.0002 12.0001 10.0002ZM12.0001 24.0002C10.9092 23.9991 9.84859 23.6418 8.97946 22.9826C8.11034 22.3234 7.48026 21.3984 7.18506 20.3482C6.12973 20.5813 5.02756 20.4712 4.03912 20.0342C3.05067 19.5972 2.2276 18.8559 1.6898 17.9185C1.152 16.9811 0.927569 15.8964 1.04921 14.8225C1.17085 13.7486 1.6322 12.7416 2.36606 11.9482C-1.03394 8.43722 2.37506 2.34822 7.20006 3.59922C7.51129 2.56838 8.14611 1.66511 9.01059 1.0231C9.87506 0.381081 10.9233 0.0344238 12.0001 0.0344238C13.0769 0.0344238 14.1251 0.381081 14.9895 1.0231C15.854 1.66511 16.4888 2.56838 16.8001 3.59922C21.7001 2.38322 25.0001 8.41222 21.6291 11.9912C25.0371 15.5292 21.6401 21.4332 16.8151 20.3482C16.5199 21.3984 15.8898 22.3234 15.0207 22.9826C14.1515 23.6418 13.0909 23.9991 12.0001 24.0002ZM8.00006 18.0002C8.26527 18.0002 8.51963 18.1056 8.70716 18.2931C8.8947 18.4806 9.00006 18.735 9.00006 19.0002C9.00006 19.7959 9.31613 20.5589 9.87874 21.1215C10.4413 21.6842 11.2044 22.0002 12.0001 22.0002C12.7957 22.0002 13.5588 21.6842 14.1214 21.1215C14.684 20.5589 15.0001 19.7959 15.0001 19.0002C15 18.8241 15.0464 18.651 15.1347 18.4986C15.223 18.3461 15.35 18.2197 15.5029 18.1321C15.6557 18.0445 15.829 17.9989 16.0051 17.9998C16.1813 18.0007 16.3541 18.0481 16.5061 18.1372C19.9721 19.8122 22.9061 14.9552 19.5221 12.8782C19.3659 12.7909 19.2359 12.6635 19.1454 12.5091C19.0548 12.3548 19.0071 12.1791 19.0071 12.0002C19.0071 11.8213 19.0548 11.6456 19.1454 11.4913C19.2359 11.337 19.3659 11.2096 19.5221 11.1222C22.8351 9.11322 20.0441 3.90322 16.5031 5.86822C16.3508 5.95682 16.1779 6.00364 16.0017 6.00393C15.8256 6.00423 15.6525 5.95799 15.4999 5.8699C15.3474 5.78181 15.2208 5.65499 15.1331 5.50227C15.0453 5.34956 14.9994 5.17636 15.0001 5.00022C15.0001 4.20457 14.684 3.44151 14.1214 2.8789C13.5588 2.31629 12.7957 2.00022 12.0001 2.00022C11.2044 2.00022 10.4413 2.31629 9.87874 2.8789C9.31613 3.44151 9.00006 4.20457 9.00006 5.00022C9.0004 5.17592 8.95445 5.34862 8.86682 5.50091C8.7792 5.65321 8.65299 5.77972 8.50091 5.86773C8.34884 5.95573 8.17626 6.00211 8.00055 6.00219C7.82485 6.00228 7.65222 5.95607 7.50006 5.86822C4.00006 3.90822 1.13806 9.08022 4.47806 11.0702C4.63419 11.1577 4.76418 11.2852 4.85466 11.4396C4.94514 11.594 4.99283 11.7698 4.99283 11.9487C4.99283 12.1277 4.94514 12.3034 4.85466 12.4578C4.76418 12.6122 4.63419 12.7397 4.47806 12.8272C1.13006 14.9402 3.96406 19.8002 7.49406 18.1372C7.64754 18.0474 7.82221 18.0001 8.00006 18.0002Z"
                fill="#3C497C"
              />
            </g>
            <defs>
              <clipPath id="clip0_1_54">
                <rect width={24} height={24} fill="white" />
              </clipPath>
            </defs>
          </svg>
        </Box>
      </Box>

      {/* Token modal  */}

      <TokenListInputAndModal
        data={allTokenList}
        tokenListData={tokenList}
        token={inToken}
        value={inTokenInput}
        onInputChange={(e) => setInTokenInput(e.target.value)}
        setToken={setInTokenHandler}
        topHeaderText={"You sell"}
      />

      {/* switch token  */}
      <Button
        className="h-[65px]  w-[65px]  p-[15px] my-[30px] mx-auto rounded-2xl flex justify-center items-center bg-secondaryColor  hover:bg-buttonHover focus:!bg-buttonHover border-0"
        onClick={tokenSwitchHandler}
      >
        <svg
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_1_66)">
            <path
              d="M18.05 17.79C17.9571 17.6963 17.8465 17.6219 17.7246 17.5711C17.6028 17.5203 17.472 17.4942 17.34 17.4942C17.208 17.4942 17.0773 17.5203 16.9555 17.5711C16.8336 17.6219 16.723 17.6963 16.63 17.79L13 21.42V1C13 0.734783 12.8947 0.480429 12.7071 0.292893C12.5196 0.105357 12.2653 0 12 0V0C11.7348 0 11.4805 0.105357 11.2929 0.292893C11.1054 0.480429 11 0.734783 11 1V21.41L7.38004 17.79C7.29432 17.6728 7.18412 17.5757 7.05708 17.5054C6.93005 17.4351 6.78922 17.3933 6.6444 17.3829C6.49958 17.3725 6.35424 17.3938 6.21847 17.4452C6.0827 17.4967 5.95976 17.5771 5.85821 17.6809C5.75665 17.7846 5.67891 17.9093 5.63038 18.0461C5.58185 18.183 5.56371 18.3287 5.57721 18.4733C5.5907 18.6178 5.63552 18.7577 5.70854 18.8832C5.78156 19.0087 5.88103 19.1168 6.00004 19.2L9.92004 23.12C10.4825 23.6818 11.245 23.9974 12.04 23.9974C12.835 23.9974 13.5975 23.6818 14.16 23.12L18.08 19.2C18.2624 19.0087 18.3615 18.753 18.3559 18.4888C18.3503 18.2246 18.2403 17.9734 18.05 17.79Z"
              fill="url(#paint0_linear_1_66)"
            />
          </g>
          <defs>
            <linearGradient
              id="paint0_linear_1_66"
              x1="5.57288"
              y1="3.90655"
              x2="19.9985"
              y2="4.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#A8DAFF" />
              <stop offset={1} stopColor="#FFF7E6" />
            </linearGradient>
            <clipPath id="clip0_1_66">
              <rect width={24} height={24} fill="white" />
            </clipPath>
          </defs>
        </svg>
      </Button>

      <TokenListInputAndModal
        data={allTokenList}
        tokenListData={tokenList}
        token={outToken}
        value={outTokenInput}
        setToken={setOutTokenHandler}
        onInputChange={(e) => setOutTokenInput(e.target.value)}
        topHeaderText={"You buy"}
      />

      {/* price and gas fee  */}

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        className="py-[24px]"
      >
        <Text>1bnb = 345usdc</Text>
        <Text>Est Gas: {gasprice}gwei</Text>
      </Stack>

      {/* swap button  */}

      <Box
        type="button"
        className="border-0 flex justify-center items-center w-full py-[27px] bg-secondaryColor hover:bg-buttonHover duration-300  "
      >
        {address ? (
          <Button
            type="button"
            className="border-0 focus:!bg-transparent bg-transparent"
            onClick={onSwapHandler}
          >
            <Text
              bgGradient="linear-gradient(94deg, #A8DAFF 1.17%, #FFF7E6 106.1%)"
              bgClip="text"
              className=" !font-clashSemibold  !font-[500] text-[1.56rem]"
            >
              Swap
            </Text>
          </Button>
        ) : (
          <WalletsDropdown
            connectHandler={connectWalletHandler}
            text="Connect Wallet"
            isArrow={false}
          />
        )}
      </Box>
    </Box>
  );
}

export default Swap;
