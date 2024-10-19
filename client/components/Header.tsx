import Link from "next/link";
import React from "react";
import { ArrowRight } from "lucide-react";

const Header = () => {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="text-8xl font-semibold p-8">Monarch</div>
      <div className="text-xl">
        Allowing users to harness unprocessed data for processed measures.
      </div>
      <div className="flex flex-row space-x-4 p-12">
        <button className="bg-orange-400 hover:bg-orange-300 text-white font-bold py-2 px-4 border-b-4 border-orange-600 hover:border-orange-400 rounded">
          <Link className="flex flex-row space-x-2" href={"process"}>
            <p>Check It Out</p>
            <ArrowRight />
          </Link>
        </button>
        <button className="bg-neutral-100 hover:bg-neutral-200 text-black font-medium py-2 px-4 border-b-4 border-neutral-400 hover:border-neutral-400 rounded">
          <Link href={"about"}>
            <p>Learn More</p>
          </Link>
        </button>
      </div>
    </div>
  );
};

export default Header;
