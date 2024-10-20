import React from "react";
import { Handle, Position } from "@xyflow/react";

import { useState } from "react";

const SchemaNode = (props: { data: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className={`flex px-4 py-2 shadow-lg rounded-2xl hover:scale-125 transition-transform duration-300  hover:border-2 hover:border-slate-500 ${
        props.data.root ? "bg-purple-100" : "bg-orange-50"
      } `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="flex p-4 transition-transform duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-col">
          <div className="text-lg font-bold">{props.data.name}</div>

          {isOpen && !props.data.root && (
            <div className="py-4">
              <p className="font-semibold">Values</p>
              {props.data.values.map((value: string, index: number) => (
                <p key={index}>
                  {index + 1}. {value}
                </p>
              ))}
            </div>
          )}
          {!props.data.root && (
            <p
              className={`text-xs text-gray-400 pt-1  ${
                isHovered ? "" : "hidden"
              }`}
            >
              Click To {isOpen ? "Close" : "Expand"}
            </p>
          )}
        </div>
        <Handle
          type="target"
          position={Position.Top}
          className="w-16 !bg-orange-500"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-16 !bg-orange-500"
        />
      </div>
    </div>
  );
};

export default SchemaNode;
