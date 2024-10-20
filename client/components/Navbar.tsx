"use client";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import monarch_logo from "../public/assets/monarch logo.svg";

const Navbar = () => {
  const navLinks = [
    { title: "About", path: "#features" },
    { title: "Team", path: "#team" },
  ];
  const [nav, setNav] = useState(false);

  const toggleNav = () => {
    setNav(!nav);
  };

  const closeNav = () => {
    setNav(false);
  };

  return (
    <div>
      <div className="flex flex-row justify-between items-center px-6 py-4 animate-fadedown">
        <div>
          <Link href={"/"}>
            <Image
              src={monarch_logo}
              width={50}
              height={50}
              alt="monarch logo"
            />
          </Link>
        </div>
        <div className="flex flex-row space-x-8  items-center">
          {navLinks.map((link) => (
            <Link href={link.path}>
              <p className="hover:text-black/50">{link.title}</p>
            </Link>
          ))}
          <button className="bg-orange-400 hover:bg-orange-300 text-white font-bold py-2 px-4 border-b-4 border-orange-600 hover:border-orange-400 rounded hover:scale-110 transition-transform duration-300">
            <Link href={"morph"}>
              <p>Morph</p>
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
