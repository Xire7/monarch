import React from "react";
import { Handle, Position } from "@xyflow/react";
import { motion } from "framer-motion";
import { useState } from "react";

const SchemaNode = (props: { data: any }) => {
  return (
    <div
      className={`flex px-4 py-2 shadow-lg rounded-2xl hover:scale-125 transition-transform duration-300  hover:border-2 hover:border-slate-500 ${
        props.data.root ? "bg-purple-100" : "bg-orange-50"
      }`}
    >
      <div className="flex p-4">
        <div className="flex flex-col">
          <div className="text-lg font-bold">{props.data.name}</div>

          {props.data.root ? (
            <p>TEST</p>
          ) : (
            props.data.values.map((value: string, index: number) => (
              <p key={index}>{value}</p>
            ))
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
