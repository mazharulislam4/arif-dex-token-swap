import Link from "next/link";
import ConnectWallet from "./ConnectWallet";
import ChainDropdown from "./dropdown/ChainDropdown";
import Logo from "./global/Logo";


function Navbar() {
  return (
    <div className="bg-transparent">
      <div className="container mx-auto">
        <nav className="flex  justify-between items-center py-[20px]">
          {/* brand  */}
          <div className="flex  items-center justify-between  w-[30%]">
            <Link href={"/"}>
              <Logo />
            </Link>
    
            <div className="relative">
              <Link href={"/futures"}>Futures</Link>
            </div>
          </div>
          {/* menus  */}

          <div className="flex items-center justify-end">
            <ChainDropdown />
            {/* connect wallet  */}
            <ConnectWallet />
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
