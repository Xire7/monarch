import React from "react";

const Introduction = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="text-8xl font-semibold p-8">Monarch</div>
      <div className="text-xl">
        Allowing users to harness unprocessed data for processed measures.
      </div>
      <button className="bg-orange hover:bg-orange/80 text-white font-bold py-2 px-4 border-b-4 border-orange/10 hover:border-orange/50 rounded">
       Check It Out
      </button>
    </div>
  );
};

export default Introduction;
