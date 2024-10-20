import React from "react";
import Image from "next/image";
import { FaLinkedin } from "react-icons/fa";
import Link from "next/link";

const TeamCard = (props: { member: any }) => {
  return (
    <div className="flex flex-col justify-center items-center bg-slate-50 h-80 w-64 rounded-xl border-2 border-slate-200 hover:scale-125 transition-transform duration-300">
      <Image
        width="100"
        height="100"
        className="w-24 h-24 rounded-full shadow-lg mb-8"
        src={props.member.image}
        alt="Profile Picture"
      />
      <p className="font-semibold">{props.member.name}</p>
      <p>{props.member.role}</p>
      <Link className="pt-6" href={props.member.linkedin} target="_blank">
        <FaLinkedin size={32} />
      </Link>
    </div>
  );
};

export default TeamCard;
