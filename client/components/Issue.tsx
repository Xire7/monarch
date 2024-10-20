import { CornerRightDown } from "lucide-react";
import Link from "next/link";
import React from "react";

const Issue = (props: {
  description: String;
  number: number;
  total: number;
}) => {
  return (
    <div className="min-h-screen text-8xl font-medium text-white pt-32 flex flex-col justify-between">
      {props.number}. {props.description}
      {props.number < props.total && (
        <CornerRightDown
          size={256}
          color="white"
          className="animate-bounce my-48"
        />
      )}
      {props.number == props.total && (
        <div className="flex flex-row items-end justify-center p-16">
          <button className=" bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full animate-bounce duration-100">
            <Link href={"schema"}>
              <p className="text-2xl font-medium p-8">View Schema</p>
            </Link>
          </button>
        </div>
      )}
    </div>
  );
};

export default Issue;
