"use client";
import React, { useCallback, useEffect, useState } from "react";

import Dagre from "@dagrejs/dagre";

import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  BackgroundVariant,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  Panel,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import SchemaNode from "./SchemaNode";
import Link from "next/link";
import Image from "next/image";
import monarch_logo from "../public/assets/monarch logo.svg";

const nodeTypes = {
  custom: SchemaNode,
};

const getLayout = (nodes: any, edges: any) => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB" });
  edges.forEach((edge: any) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node: any) =>
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 0,
      height: node.measured?.height ?? 0,
    })
  );
  Dagre.layout(g);
  return {
    nodes: nodes.map((node: any) => {
      // match dagre node position to react flow position
      const position = g.node(node.id);
      const x = position.x - (node.measured?.width ?? 0) / 2;
      const y = position.y - (node.measured?.height ?? 0) / 2;

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

const LayoutFlow = (props: { initialNodes: any; initialEdges: any }) => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(props.initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(props.initialEdges);
  const [loading, setLoading] = useState(true);

  const onLayout = useCallback(() => {
    const layout = getLayout(nodes, edges);
    setNodes([...layout.nodes]);
    setEdges([...layout.edges]);

    window.requestAnimationFrame(() => {
      fitView();
      setLoading(false);
    });
  }, [nodes, edges]);

  useEffect(() => {
    onLayout();
  }, [loading]);

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen animate-fadeup">
      <div className="fixed top-4 left-4 z-40 bg-transparent">
        <p className="text-2xl font-semibold">Monarch</p>
      </div>
      <ReactFlow
        className="z-0 absolute"
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Panel position="top-right">
          <button
            onClick={() => onLayout()}
            className="bg-neutral-100 hover:bg-neutral-200 text-black font-bold py-2 px-4 border-b-4 border-neutral-400 hover:border-neutral-400 rounded hover:scale-110 transition-transform duration-300"
          >
            <p>Recenter</p>
          </button>
        </Panel>
      </ReactFlow>
      <div className="fixed bottom-8 space-x-8">
        <button className="bg-orange-400 hover:bg-orange-300 text-white font-bold border-b-4 border-orange-600 hover:border-orange-400 rounded-xl hover:scale-125 transition-transform duration-300">
          <Link href={"schema"}>
            <p className="text-xl font-medium p-6">Download CSV</p>
          </Link>
        </button>
        <button className="bg-neutral-100 hover:bg-neutral-200 text-black font-medium border-b-4 border-neutral-400 hover:border-neutral-400 rounded-xl hover:scale-125 transition-transform duration-300">
          <Link href={"/"}>
            <p className="text-xl font-medium p-6">Return Home</p>
          </Link>
        </button>
      </div>
    </div>
  );
};

const SchemaVisualizer = (props: { graph: any }) => {
  return (
    <ReactFlowProvider>
      <LayoutFlow
        initialNodes={props.graph.nodes}
        initialEdges={props.graph.edges}
      />
    </ReactFlowProvider>
  );
};

export default SchemaVisualizer;
