"use client";
import React from "react";
import UploadCSV from "@/components/UploadCSV";
import Image from "next/image";
import monarch_logo from "../../public/assets/monarch logo.svg";
import FileUploadComponent from "@/components/FileUploadComponent";

const Morph = () => {
  return (
    <div className="w-screen h-screen flex">
      <div className="flex justify-center items-center w-full h-full bg-orange-300">
        <Image
          className="drop-shadow-xl animate-fadedown"
          src={monarch_logo}
          width={500}
          height={500}
          alt="monarch logo"
        />
      </div>
      <div className="flex justify-center items-center w-full h-full bg-stone-900">
        <div className="animate-fadeup">
          <UploadCSV />
        </div>
      </div>
    </div>
  );
};

export default Morph;
