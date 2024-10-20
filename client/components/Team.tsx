import React from "react";
import TeamCard from "./TeamCard";
import { team } from "../app/data/team";

const Team = () => {
  return (
    <div className="flex flex-col items-center justify-center p-16 min-h-svh bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px]">
      <div className="text-4xl font-semibold animate-fadeup">Meet The Team</div>
      <p className="p-16 font-medium text-xl">
        A group of inspired students from the University of California, Irvine.
      </p>

      <div className="flex flex-row px-8">
        {team.map((member: any) => (
          <div className="px-8">
            <TeamCard member={member} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
