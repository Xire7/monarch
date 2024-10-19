import Link from "next/link";
import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import monarch_logo from "../public/assets/monarch logo.svg";
import monarch_butterflies from "../public/assets/monarch_butterflies.png";

const Header = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Image
        className="drop-shadow-xl animate-fadeup"
        src={monarch_logo}
        width={400}
        height={400}
        alt="monarch logo"
      />
      <div className="text-8xl font-semibold p-8 animate-fadeup">Monarch</div>
      <div className="text-xl animate-fadeup">
        Elegantly harness unprocessed data for processed measures.
      </div>
      <div className="flex flex-row space-x-4 p-12 animate-fadeup">
        <button className="bg-orange-400 hover:bg-orange-300 text-white font-bold py-2 px-4 border-b-4 border-orange-600 hover:border-orange-400 rounded">
          <Link className="flex flex-row space-x-2" href={"#features"}>
            <p>Check It Out</p>
            <ArrowRight />
          </Link>
        </button>
        <button className="bg-neutral-100 hover:bg-neutral-200 text-black font-medium py-2 px-4 border-b-4 border-neutral-400 hover:border-neutral-400 rounded">
          <Link href={"#features"}>
            <p>Learn More</p>
          </Link>
        </button>
      </div>
      <Image
        className="absolute bottom-0 right-0 opacity-40"
        src={monarch_butterflies}
        width={250}
        height={250}
        alt="monarch butterflies"
      />
    </div>
  );
};

export default Header;
