import React from "react";
import { CircleArrowRight, Upload, Wrench, Workflow } from "lucide-react";
import Link from "next/link";

const Guide = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-orange-400 min-h-svh p-16">
      <p className="text-4xl font-semibold pb-16 text-white">How It Works</p>

      <div className="flex flex-row space-x-10 items-center font-medium">
        <div className="flex flex-col justify-center items-center p-8 bg-slate-100 rounded-lg space-y-4 w-64 hover:scale-125 transition-transform duration-300">
          <p className="text-2xl">1. Upload Data</p>
          <Upload size={48} />
          <p className="text-center text-md text-gray-400 font-normal">
            Select at least 2 CSVs to analyze
          </p>
        </div>
        <CircleArrowRight color="white" size={64} />
        <div className="flex flex-col items-center p-8 bg-slate-100 rounded-lg space-y-4 w-64 hover:scale-125 transition-transform duration-300">
          <p className="text-2xl">2. Morph</p>
          <Wrench size={48} />
          <p className="text-center text-md text-gray-400 font-normal">
            Use our tool to refine and declutter your data
          </p>
        </div>
        <CircleArrowRight color="white" size={64} />
        <div className="flex flex-col items-center p-8 bg-slate-100 rounded-lg space-y-4 w-64 hover:scale-125 transition-transform duration-300s">
          <p className="text-2xl">3. View Schema</p>
          <Workflow size={48} />
          <p className="text-center text-md text-gray-400 font-normal">
            Explore your finalized results
          </p>
        </div>
      </div>
      <Link href={"morph"}>
        <button className="mt-32 bg-neutral-100 hover:bg-neutral-200 text-black font-medium py-4 px-8 border-b-4 border-neutral-400 hover:border-neutral-400 rounded-full hover:scale-125 transition-transform duration-300s">
          <p className="text-2xl font-medium">Try It Out</p>
        </button>
      </Link>
    </div>
  );
};

export default Guide;
