import React, { useState, useCallback, useEffect } from 'react';
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

/**
 * Custom node component that allows inline editing of the label.
 */
const EditableNode = ({ data, id, selected }: NodeProps) => {
  return (
    <div className={`
      p-3 rounded-xl bg-white border-2 transition-all duration-200 min-w-[160px]
      ${selected ? 'border-blue-500 shadow-xl scale-[1.02]' : 'border-slate-200 shadow-sm'}
    `}>
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!bg-slate-400 !w-2.5 !h-2.5 !border-2 !border-white" 
      />
      
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex justify-between items-center">
          <span>Block ID: {id.split('-').pop()}</span>
          {selected && <span className="text-blue-500">Selected</span>}
        </label>
        <input 
          value={data.label as string || ''}
          onChange={(e) => {
            if (typeof data.onChange === 'function') {
              data.onChange(id, e.target.value);
            }
          }}
          // Essential: prevent React Flow from handling backspace/delete while typing
          onKeyDown={(e) => e.stopPropagation()}
          className="bg-slate-50 border border-slate-100 text-sm font-semibold focus:ring-2 focus:ring-blue-100 focus:bg-white rounded px-2 py-1.5 outline-none w-full text-slate-700 transition-colors"
          placeholder="Rename this block..."
        />
      </div>

      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!bg-slate-400 !w-2.5 !h-2.5 !border-2 !border-white" 
      />
    </div>
  );
};

// Registered node types for React Flow
const nodeTypes = {
  editable: EditableNode,
};

const FlowEditor: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // Function to update a node's label in state
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

  // Initialization: Define initial state
  useEffect(() => {
    const initialNodes: Node[] = [
      {
        id: 'node-1',
        type: 'editable',
        data: { label: 'Input Stream', onChange: onLabelChange },
        position: { x: 250, y: 50 },
      },
      {
        id: 'node-2',
        type: 'editable',
        data: { label: 'Data Filter', onChange: onLabelChange },
        position: { x: 100, y: 200 },
      },
      {
        id: 'node-3',
        type: 'editable',
        data: { label: 'Analytics Engine', onChange: onLabelChange },
        position: { x: 400, y: 200 },
      },
    ];

    const initialEdges: Edge[] = [
      { id: 'e1-2', source: 'node-1', target: 'node-2', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
      { id: 'e1-3', source: 'node-1', target: 'node-3', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
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
    (params) => setEdges((eds) => addEdge({ 
      ...params, 
      animated: true, 
      style: { stroke: '#3b82f6', strokeWidth: 2 } 
    }, eds)),
    []
  );

  const addNode = useCallback(() => {
    const timestamp = Date.now();
    const id = `node-${timestamp}`;
    const newNode: Node = {
      id,
      type: 'editable',
      data: { label: `New Block`, onChange: onLabelChange },
      position: { x: Math.random() * 300 + 100, y: Math.random() * 300 + 100 },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [onLabelChange]);

  return (
    <div className="w-full h-full flex flex-col bg-slate-50">
      {/* Header Toolbar */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-slate-800">Visual Pipeline Editor</h2>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1"><kbd className="px-1 bg-slate-100 border rounded">Click</kbd> to rename</span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1"><kbd className="px-1 bg-slate-100 border rounded">Drag</kbd> to connect</span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={addNode}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-md shadow-blue-100 transition-all flex items-center gap-2 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Block
          </button>
          <div className="flex items-center px-3 py-1 bg-slate-100 rounded-lg border border-slate-200">
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-tighter mr-2">Status</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2"></span>
            <span className="text-slate-700 text-xs font-bold">{nodes.length} Blocks</span>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
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
          <Background color="#cbd5e1" gap={20} variant="dots" />
          <Controls className="!bg-white !border-slate-200 !shadow-lg !rounded-lg !overflow-hidden" />
        </ReactFlow>
      </div>
    </div>
  );
};

export default FlowEditor;