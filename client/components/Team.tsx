import React from "react";
import TeamCard from "./TeamCard";

const Team = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 min-h-svh">
      <div className="text-2xl font-semibold p-8 animate-fadeup">Team</div>
      <div>
        <TeamCard />
      </div>
    </div>
  );
};

export default Team;
