"use client";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import monarch_logo from "../public/assets/monarch logo.svg";

const Navbar = () => {
  const navLinks = [
    // { title: "Home", path: "/" },
    { title: "About", path: "about" },
    { title: "Process Data", path: "process" },
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
      <div className="flex flex-row justify-between items-center px-6 py-4">
        <div>
          <Link href={"/"}>
            <Image src={monarch_logo} width={50} height={50} alt="monarch logo" />
          </Link>
        </div>
        <div className="flex flex-row space-x-8">
          {navLinks.map((link) => (
            <Link href={link.path}>
              <p className="hover:text-black/50">{link.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
