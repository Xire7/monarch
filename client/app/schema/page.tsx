import SchemaVisual from "@/components/SchemaVisualizer";
import React, { useState, useEffect } from "react";
import testData from "@/testData.json";

const Schema = () => {
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
  //   { id: "e12", source: "1", target: "2", animated: true },

  return (
    <div className="flex items-center justify-center">
      <SchemaVisual graph={buildGraph(testData)} />
    </div>
  );
};

export default Schema;
