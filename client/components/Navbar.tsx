"use client";
import Link from "next/link";
import React, { useState } from "react";

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
      <div className="flex flex-row justify-between p-6">
        <div>
          <Link href={"/"}>LOGO</Link>
        </div>
        <div className="flex flex-row space-x-6">
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
