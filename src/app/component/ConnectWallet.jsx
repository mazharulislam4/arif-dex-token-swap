"use client";
import { Text } from "@chakra-ui/react";
import { useConnectWallet } from "../context/connectWalletProvider";
import WalletsDropdown from "./dropdown/WalletsDropdown";

function ConnectWallet() {
  const { address, connectWalletHandler } = useConnectWallet();

  return (
    <>
      {!address ? (
        <WalletsDropdown
          connectHandler={connectWalletHandler}
        ></WalletsDropdown>
      ) : (
        <Text
          bgGradient="linear-gradient(94deg, #A8DAFF 1.17%, #FFF7E6 106.1%)"
          bgClip="text"
          className=" !font-clashSemibold  !font-[500] text-[1.2rem]"
        >
          {`${address.slice(0, 3)}...${address.slice(-4, address.length - 1)}`}
        </Text>
      )}
    </>
  );
}

export default ConnectWallet;
