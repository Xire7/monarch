"use client";
import SchemaVisualizer from "@/components/SchemaVisualizer";
import React, { useState, useEffect } from "react";
import testData from "@/testData.json";
import Link from "next/link";
import ConfirmModal from "@/components/ConfirmModal";
import Prompts from "@/components/Prompts";

const Schema = () => {
  const [issues, setIssues] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [issueNumber, setIssueNumber] = useState(1);
  const [graph, setGraph] = useState({});
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [schemaData, setSchemaData] = useState(null);

useEffect(() => {
  const storedData = sessionStorage.getItem('schemaData');
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      setIssues(parsedData);
      setSchemaData(parsedData);
    } catch (error) {
      console.error('Error parsing stored data:', error);
      setIssues([]);
    }
  }
}, []);

  // temp
  const data = testData;

  const buildGraph = () => {
    setLoading(true);
    const nodes = [];
    const edges = [];

    for (var k in data.datasets) {
      const dataset = data.datasets[k];

      // add dataset name
      nodes.push({
        id: dataset.name,
        type: "custom",
        data: {
          name: dataset.name,
          values: [],
          root: true,
          used: false,
        },
        position: { x: 0, y: 0 },
      });

      for (let j = 0; j < dataset.cols.length; ++j) {
        const rowValues = dataset.rows.map((values: any) => values[j]);
        const newNode = {
          id: dataset.name + j,
          type: "custom",
          data: {
            name: dataset.cols[j],
            values: rowValues,
            root: false,
            used: false,
          },
          position: { x: 0, y: 0 },
        };

        newNode.data.used = issues[issueNumber - 1].cols_used.includes(
          dataset.cols[j]
        );

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

  const updateIssueNumber = () => {
    if (issueNumber < issues.length) {
      setIssueNumber((prevNumber) => prevNumber + 1);
    } else {
      setComplete(true);
    }
  };

  useEffect(() => {
    const newGraph = buildGraph();
    setGraph(newGraph);
    setLoading(false);
  }, [issueNumber, loading]);

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      {!complete && (
        <Prompts
          buildGraph={buildGraph}
          updateIssueNumber={updateIssueNumber}
          issueNumber={issueNumber}
          issuesCount={issues.length}
          issueMessage={issues[issueNumber - 1].message}
          additionalInfo={issues[issueNumber - 1].additional_info}
        />
      )}
      {loading ? (
        <div className="flex items-center justify-center w-full h-full bg-white text-xl font-semibold text-black">
          Updating...
        </div>
      ) : (
        <SchemaVisualizer
          graph={graph}
          recenter={issueNumber - 1 == issues.length}
          issueNumber={issueNumber}
        />
      )}

      {isOpen && (
        <ConfirmModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
      {complete && (
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
      )}
    </div>
  );
};

export default Schema;
