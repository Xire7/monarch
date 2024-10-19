import React from "react";

const Footer = () => {
  return (
    <div className="py-8 bg-orange-400 text-white flex flex-col items-center">
      <p className="text-sm">Copyright © Monarch {new Date().getFullYear()}</p>
    </div>
  );
};

export default Footer;
