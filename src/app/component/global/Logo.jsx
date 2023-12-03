import Image from "next/image";
import logo from '../../assets/logo.svg';




function Logo() {
  return (
    <figure>
      <Image
        src={logo}
        alt="logo"
      />
    </figure>
  );
}

export default Logo