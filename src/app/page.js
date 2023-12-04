"use client";

import Swap from "./component/Swap";
import { createStandaloneToast } from "@chakra-ui/react";
const { ToastContainer, toast } = createStandaloneToast();


export default function Home() {


  return (
    <div className="flex w-full min-h-screen flex-col items-center mt-16 px-5 ">
      <Swap />
      <ToastContainer/>
    </div>
  );
}
