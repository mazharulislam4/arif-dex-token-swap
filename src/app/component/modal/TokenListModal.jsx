"use client";
import { useChain } from "@/app/context/chainContext";
import { useConnectWallet } from "@/app/context/connectWalletProvider";
import { getBalance } from "@/app/utils/utils";
import {
  Box,
  Input,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

function TokenListInputAndModal({
  data,
  value,
  onInputChange,
  token,
  tokenListData,
  setToken,
  topHeaderText,
}) {
  const [show, setShow] = useState(false);
  const { chain } = useChain();
  const searchInputRef = useRef();
  const [tokenList, setTokenList] = useState([]);
  const [notFoundError, setNotfoundError] = useState("");
  const [tokenBalance, setTokenBalance] = useState(0);
  const { address } = useConnectWallet();

  useEffect(() => {
    setTokenList(tokenListData);
  }, [tokenListData]);

  // get token balance

  useEffect(() => {
    if (token && address) {
      (async () => {
        try {
          const balance = await getBalance(
            address,
            chain?.chain?.key,
            token.address,
            token.decimals
          );

          setTokenBalance(balance.short);
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [token, address]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const searchHandler = (e) => {
    const selectedChain = chain?.chain?.key;

    if (e.target.value) {
      const searchValue = new RegExp(e.target.value, "i");
      if (data) {
        const tokenList = data.filter((token) => {
          return (
            token.chain === selectedChain &&
            (token.name.match(searchValue) ||
              token.symbol.match(searchValue) ||
              (token?.address && token.address.match(searchValue)))
          );
        });
        if (tokenList?.length === 0) {
          return setNotfoundError("Not found this token in this chain");
        }
        setNotfoundError("");
        return setTokenList(tokenListData);
      }
    }
    setNotfoundError("");
    return setTokenList(tokenList);
  };

  return (
    <>
      <Box className="mt-[39px]">
        {/* label  */}
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          className="mb-1"
        >
          <Text className="text-[1rem] text-gray leading-1">
            {topHeaderText}
          </Text>
          <Text className="text-[1rem] text-gray leading-1">
            Balance: {tokenBalance}
          </Text>
        </Stack>

        <Box className="bg-secondaryColor shadow-sm shadow-gray  rounded-lg">
          <Stack
            direction={"row"}
            alignItems={"center"}
            className="w-full py-[28px] px-[23px] "
          >
            {/* input filed  */}
            <Input
              type="text"
              value={value}
              onChange={(e) => {
                onInputChange(e);
              }}
              className="border-0 focus:!shadow-none"
            />

            <div className="flex gap-3 items-center">
              <img src={token?.icon} alt="icon" className="w-[25px]" />

              <p>{token?.symbol}</p>
              <button type="button" onClick={handleShow}>
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
              </button>
            </div>
          </Stack>
        </Box>
      </Box>

      <Modal
        blockScrollOnMount={false}
        isOpen={show}
        onClose={handleClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent className="!bg-primary py-[45px] ">
          <ModalHeader className="items-center !px-[45px] justify-between flex py-0">
            <Text
              bgGradient="linear-gradient(94deg, #A8DAFF 1.17%, #FFF7E6 106.1%)"
              bgClip="text"
              className="font-clashRegular font-[500] text-[35px]"
            >
              Select a Token
            </Text>
            <ModalCloseButton className="!static !text-gray !w-[30px] !h-[30px] !rounded-full border-2 border-gray" />
          </ModalHeader>

          <ModalBody className="p-0 m-0  max-h-[300px] overflow-auto">
            <List className=" m-0 !list-unstyled">
              <ListItem className="px-[45px] !list-unstyled my-[30px]">
                <Input
                  placeholder="Search or paste address"
                  size="md"
                  type="search"
                  ref={searchInputRef}
                  onChange={searchHandler}
                  className="!placeholder:text-secondaryColor border-0 py-[25px] !bg-darkColor  focus:!shadow-none"
                />
              </ListItem>

              {!notFoundError ? (
                tokenList?.map((token, index) => (
                  <ListItem
                    key={index}
                    className="flex hover:bg-darkColor items-center gap-3 py-3 px-[45px]  cursor-pointer"
                    onClick={() => {
                      setToken(token);
                      handleClose();
                    }}
                  >
                    <img
                      className="w-[25px] h-auto"
                      src={token?.icon}
                      alt="icon"
                    />
                    <Box>
                      <Text
                        bgGradient="linear-gradient(94deg, #A8DAFF 1.17%, #FFF7E6 106.1%)"
                        bgClip="text"
                        className="font-clashRegular font-[500] text-[20px]"
                      >
                        {token?.symbol}
                      </Text>

                      <Text className="text-gray leading-[10px]">
                        {token?.name}
                      </Text>
                    </Box>
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <Text className="px-2 py-2 text-red-200">
                    {notFoundError}
                  </Text>
                </ListItem>
              )}
            </List>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default TokenListInputAndModal;
