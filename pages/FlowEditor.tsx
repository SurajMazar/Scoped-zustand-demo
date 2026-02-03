
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  applyEdgeChanges,
  applyNodeChanges,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Handle,
  Position,
  NodeProps,
} from '@xyflow/react';

// Custom Editable Node Component
const EditableNode = ({ data, id, selected }: NodeProps) => {
  return (
    <div className={`
      p-3 rounded-xl bg-white border-2 transition-all duration-200 min-w-[150px]
      ${selected ? 'border-blue-500 shadow-xl scale-105' : 'border-slate-200 shadow-md'}
    `}>
      <Handle type="target" position={Position.Top} className="!bg-slate-400 !w-2.5 !h-2.5 !border-2 !border-white" />
      
      <div className="flex flex-col gap-1">
        <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
          Node Title
        </label>
        <input 
          value={data.label as string}
          onChange={(e) => {
            if (typeof data.onChange === 'function') {
              data.onChange(id, e.target.value);
            }
          }}
          // Stop propagation so typing doesn't trigger flow shortcuts (like backspace to delete)
          onKeyDown={(e) => e.stopPropagation()}
          className="bg-slate-50 border-none text-sm font-semibold focus:ring-2 focus:ring-blue-100 rounded px-2 py-1 outline-none w-full text-slate-700"
          placeholder="Unnamed Block"
        />
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-slate-400 !w-2.5 !h-2.5 !border-2 !border-white" />
    </div>
  );
};

// Define the nodeTypes outside the component to prevent re-renders
const nodeTypes = {
  editable: EditableNode,
};

const FlowEditor: React.FC = () => {
  // Initial Nodes Setup
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // Helper to handle label changes
  const onLabelChange = useCallback((id: string, newLabel: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: { ...node.data, label: newLabel },
          };
        }
        return node;
      })
    );
  }, []);

  // Initialize nodes with the handler
  useEffect(() => {
    const initialNodes: Node[] = [
      {
        id: 'node-1',
        type: 'editable',
        data: { label: 'Data Input', onChange: onLabelChange },
        position: { x: 250, y: 50 },
      },
      {
        id: 'node-2',
        type: 'editable',
        data: { label: 'Logic Processor', onChange: onLabelChange },
        position: { x: 100, y: 200 },
      },
      {
        id: 'node-3',
        type: 'editable',
        data: { label: 'Data Sink', onChange: onLabelChange },
        position: { x: 400, y: 200 },
      },
    ];

    const initialEdges: Edge[] = [
      { id: 'e1-2', source: 'node-1', target: 'node-2', animated: true, style: { stroke: '#3b82f6' } },
    ];

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [onLabelChange]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#3b82f6' } }, eds)),
    []
  );

  const addNode = useCallback(() => {
    const id = `node-${nodes.length + 1}`;
    const newNode: Node = {
      id,
      type: 'editable',
      data: { label: `New Block ${nodes.length + 1}`, onChange: onLabelChange },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [nodes, onLabelChange]);

  return (
    <div className="w-full h-full flex flex-col bg-slate-50">
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shadow-sm z-10">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Visual Pipeline Editor</h2>
          <p className="text-xs text-slate-500 font-medium">Click node labels to rename • Drag handles to connect</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={addNode}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
            Add Block
          </button>
          <div className="flex flex-col items-end justify-center">
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded border border-slate-200">
              {nodes.length} Blocks
            </span>
          </div>
        </div>
      </div>

      <div className="flex-grow relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          snapToGrid
          snapGrid={[15, 15]}
        >
          <Background color="#e2e8f0" gap={20} variant="dots" />
          <Controls className="bg-white border-2 border-slate-200 shadow-xl rounded-lg overflow-hidden" />
        </ReactFlow>
      </div>
    </div>
  );
};

export default FlowEditor;
