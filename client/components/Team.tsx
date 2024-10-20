import React from "react";
import TeamCard from "./TeamCard";
import { team } from "../app/data/team";

const Team = () => {
  return (
    <div className="flex flex-col items-center justify-center p-16 min-h-svh">
      <div className="text-4xl font-semibold animate-fadeup">Team</div>
      <p className="p-16 font-medium text-xl">
        A group of students from the University of California, Irvine.
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
