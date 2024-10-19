import { CornerRightDown } from "lucide-react";
import React from "react";

const Issue = (props: {
  description: String;
  number: number;
  total: number;
}) => {
  return (
    <div className="min-h-screen text-8xl font-medium text-white">
      {props.number}. {props.description}
      {props.number < props.total && (
        <CornerRightDown
          size={256}
          color="white"
          className="animate-bounce my-48"
        />
      )}
    </div>
  );
};

export default Issue;
