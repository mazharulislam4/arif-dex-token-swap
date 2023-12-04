"use client";
import { useChain } from "@/app/context/chainContext";
import { useConnectWallet } from "@/app/context/connectWalletProvider";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";

export const DownArrow = ({ isVisible = true }) => {
  if (!isVisible) return <span></span>;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={12}
      height={9}
      viewBox="0 0 12 9"
      fill="none"
    >
      <path
        d="M7.63031 7.70567C6.83302 8.8277 5.16698 8.8277 4.36968 7.70567L1.31616 3.40848C0.375189 2.08425 1.32198 0.25 2.94648 0.25L9.05352 0.250001C10.678 0.250001 11.6248 2.08425 10.6838 3.40848L7.63031 7.70567Z"
        fill="url(#paint0_linear_1_70)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1_70"
          x1={14}
          y1="7.88372"
          x2="-3.92428"
          y2="6.18004"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#A8DAFF" />
          <stop offset={1} stopColor="#FFF7E6" />
        </linearGradient>
      </defs>
    </svg>
  );
};

function WalletsDropdown({ connectHandler, isArrow = true, text }) {
  const { walletList } = useConnectWallet();
  const { chain } = useChain();

  return (
    <Menu className="px-[38px] py-[16px] !bg-secondary  !text-[#fff] rounded-full medium_font_size">
      <MenuButton
        className="!bg-tailTransparent text-white"
        as={Button}
        rightIcon={<DownArrow isVisible={isArrow} />}
      >
        <Text
          bgGradient="linear-gradient(94deg, #A8DAFF 1.17%, #FFF7E6 106.1%)"
          bgClip="text"
          className=" !font-clashSemibold  !font-[500] text-[1.2rem]"
        >
          {text ? text : "Connect"}
        </Text>
      </MenuButton>
      <MenuList>
        {walletList?.map((item) => (
          <MenuItem
            key={item?.key}
            href="#"
            onClick={() => connectHandler(item?.name, chain?.chain?.key)}
            className="py-2 px-3 hover:bg-lightOrange block w-full "
          >
            <div className="flex items-center  gap-3 ">
              <img src={item?.icon?.src} alt="wallet icon" />
              <p className="text-black">{item?.name}</p>
            </div>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}

export default WalletsDropdown;
