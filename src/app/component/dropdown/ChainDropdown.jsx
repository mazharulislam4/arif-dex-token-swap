"use client";
import { useChain } from "@/app/context/chainContext";
import { getAllChainNames } from "@/app/utils/utils";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import arbitrumIcon from "../../assets/Icons/arbitrum.svg";
import bscIcon from "../../assets/Icons/bsc.svg";
import ethIcon from "../../assets/Icons/eth.svg";
import { DownArrow } from "./WalletsDropdown";

export default function ChainDropdown() {
  const [chainList, setChainList] = useState([]);
  const [selectedChain, setSelectedChain] = useState(null);
  const { addChain, addChainList } = useChain();

  useEffect(() => {
    if (chainList?.length === 0) {
      let AllChainNames = getAllChainNames();
      console.log(AllChainNames);
      const list = AllChainNames?.chainList.filter(
        (chain) =>
          chain.key === "arbitrum" || chain.key === "bsc" || chain.key === "eth"
      );

      const listWithIcon = list?.map((chain) => ({
        icon:
          (chain?.key === "bsc" && bscIcon) ||
          (chain?.key === "eth" && ethIcon) ||
          (chain?.key === "arbitrum" && arbitrumIcon),
        chain: chain,
      }));

      setChainList(listWithIcon);

      const findBsc = listWithIcon?.find(
        (value) => value?.chain?.key === "eth"
      );
      setSelectedChain(findBsc);
      addChain(findBsc);
      addChainList(listWithIcon);
    }
  }, []);


  const chainSelecteHandler = (chain) => {
    setSelectedChain(chain);
    addChain(chain);
  };
  

  return (
    <Menu className="px-[38px] py-[16px] !bg-secondary  !text-[#fff] rounded-full medium_font_size">
      <MenuButton
        className="bg-transparent text-white"
        as={Button}
        rightIcon={<DownArrow />}
      >
        <Stack direction={"row"} gap={"10px"}>
          <img src={selectedChain?.icon?.src} alt="chain icon" />
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
            <img src={value?.icon?.src} alt="icon" />
            <p className="capitalize text-black">{value?.chain?.key}</p>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
