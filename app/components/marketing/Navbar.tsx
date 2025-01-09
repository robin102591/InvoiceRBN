import { RainbowButton } from "@/components/ui/rainbow-button";
import Logo from "@/public/logo.png";
import Image from "next/image";
import Link from "next/link";

export const Navbar = () => {
  return (
    <div className="flex items-center justify-between py-5">
      <Link href="/" className="flex items-center gap-2">
        <Image src={Logo} alt="Logo" className="size-14" />
        <h3 className="text-3xl font-semibold">
          Invoice<span className="text-red-600">RBN</span>
        </h3>
      </Link>

      <Link href="/login">
        <RainbowButton>Get Started</RainbowButton>
      </Link>
    </div>
  );
};
