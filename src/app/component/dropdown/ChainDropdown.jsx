"use client";
import { useChain } from "@/app/context/chainContext";
import { useConnectWallet } from "@/app/context/connectWalletProvider";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { DownArrow } from "./WalletsDropdown";

export default function ChainDropdown() {
  const { wallet, connectWalletHandler } = useConnectWallet();
  const { addChain, chainList, chain } = useChain();
  const [selectedChain, setSelectedChain] = useState(chain);

  const chainSelecteHandler = async (chain) => {
    try {
      if (wallet) {
        await wallet.requestConnect(chain?.chain?.id);
        await connectWalletHandler(wallet.name, chain?.chain?.key);
      }
      setSelectedChain(chain);
      addChain(chain);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Menu className="px-[38px] py-[16px]   !text-[#fff] rounded-full medium_font_size">
      <MenuButton
        className="!bg-tailTransparent text-white"
        as={Button}
        rightIcon={<DownArrow />}
      >
        <Stack direction={"row"} gap={"10px"} alignItems={"center"}>
          <img
            src={selectedChain?.icon?.src}
            alt="chain icon"
            loading="lazy"
            decoding="async"
            className="w-8 h-8"
          />
          <Text
            bgGradient="linear-gradient(94deg, #A8DAFF 1.17%, #FFF7E6 106.1%)"
            bgClip="text"
            className=" !font-clashSemibold  !font-[500] text-[1.2rem]"
          >
            {selectedChain?.chain?.chainName}
          </Text>
        </Stack>
      </MenuButton>
      <MenuList>
        {chainList?.map((value) => (
          <MenuItem
            key={value?.chain?.key}
            href="#"
            className="gap-2"
            onClick={() => {
              chainSelecteHandler(value);
            }}
          >
            <img
              src={value?.icon?.src}
              alt="icon"
              loading="lazy"
              decoding="async"
              className="w-8 h-8"
            />
            <p className="capitalize !text-black">{value?.chain?.key}</p>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
