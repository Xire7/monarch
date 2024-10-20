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
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import SchemaNode from "./SchemaNode";

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

const LayoutFlow = (props: {
  initialNodes: any;
  initialEdges: any;
  recenter: boolean;
  issueNumber: number;
}) => {
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
  }, [loading, props.recenter, props.issueNumber]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full animate-fadeup">
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
      </ReactFlow>
    </div>
  );
};

const SchemaVisualizer = (props: {
  graph: any;
  recenter: boolean;
  issueNumber: number;
}) => {
  return (
    <ReactFlowProvider>
      <LayoutFlow
        initialNodes={props.graph.nodes}
        initialEdges={props.graph.edges}
        recenter={props.recenter}
        issueNumber={props.issueNumber}
      />
    </ReactFlowProvider>
  );
};

export default SchemaVisualizer;
