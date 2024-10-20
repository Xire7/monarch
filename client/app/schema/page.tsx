"use client";
import SchemaVisual from "@/components/SchemaVisualizer";
import React, { useState, useEffect } from "react";
import testData from "@/testData.json";
import Link from "next/link";
import ConfirmModal from "@/components/ConfirmModal";

const Schema = () => {
  const [isOpen, setIsOpen] = useState(false);
  const buildGraph = (data: any) => {
    const nodes = [];
    const edges = [];
    for (var k in data.datasets) {
      const dataset = data.datasets[k];
      // add dataset name
      nodes.push({
        id: dataset.name,
        type: "custom",
        data: { name: dataset.name, values: [], root: true },
        position: { x: 0, y: 0 },
      });
      for (let j = 0; j < dataset.cols.length; ++j) {
        const rowValues = dataset.rows.map((values: any) => values[j]);
        const newNode = {
          id: dataset.name + j,
          type: "custom",
          data: { name: dataset.cols[j], values: rowValues, root: false },
          position: { x: 0, y: 0 },
        };
        nodes.push(newNode);

        const newEdge = {
          id: "e" + dataset.name + dataset.cols[j],
          source: dataset.name,
          target: dataset.name + j,
          animated: true,
        };

        edges.push(newEdge);
      }
    }
    return { nodes, edges };
  };

  return (
    <div className="flex items-center justify-center ">
      <SchemaVisual graph={buildGraph(testData)} />

      {isOpen && (
        <ConfirmModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
      <div className="fixed bottom-8 space-x-8 animate-fadeup">
        <button className="bg-orange-400 hover:bg-orange-300 text-white font-bold border-b-4 border-orange-600 hover:border-orange-400 rounded-xl hover:scale-125 transition-transform duration-300">
          <Link href={"schema"}>
            <p className="text-xl font-medium p-6">Download CSV</p>
          </Link>
        </button>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-neutral-100 hover:bg-neutral-200 text-black font-medium border-b-4 border-neutral-400 hover:border-neutral-400 rounded-xl hover:scale-125 transition-transform duration-300"
        >
          <p className="text-xl font-medium p-6">Return Home</p>
        </button>
      </div>
    </div>
  );
};

export default Schema;
