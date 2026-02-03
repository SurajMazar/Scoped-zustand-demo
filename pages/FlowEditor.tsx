
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
 * Custom node component that allows inline editing of both the label and description.
 * StopPropagation is used to prevent React Flow from capturing 
 * keystrokes (like backspace) while the user is typing.
 */
const EditableNode = ({ data, id, selected }: NodeProps) => {
  const label = (data.label as string) || '';
  const description = (data.description as string) || '';

  return (
    <div className={`
      p-4 rounded-xl bg-white border-2 transition-all duration-200 min-w-[240px]
      ${selected ? 'border-blue-500 shadow-xl ring-4 ring-blue-50' : 'border-slate-200 shadow-sm'}
    `}>
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!bg-slate-300 !w-3 !h-3 !border-2 !border-white" 
      />
      
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">
            Block ID: {id.split('-').pop()}
          </label>
          {selected && (
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          )}
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Title</label>
          <input 
            value={label}
            onChange={(e) => {
              if (typeof data.onChange === 'function') {
                data.onChange(id, 'label', e.target.value);
              }
            }}
            onKeyDown={(e) => e.stopPropagation()}
            className="bg-slate-50 border border-slate-100 text-sm font-bold focus:ring-2 focus:ring-blue-100 focus:bg-white rounded-lg px-2 py-1.5 outline-none w-full text-slate-800 transition-all"
            placeholder="Node Title"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Description</label>
          <textarea 
            value={description}
            onChange={(e) => {
              if (typeof data.onChange === 'function') {
                data.onChange(id, 'description', e.target.value);
              }
            }}
            onKeyDown={(e) => e.stopPropagation()}
            rows={2}
            className="bg-slate-50 border border-slate-100 text-xs focus:ring-2 focus:ring-blue-100 focus:bg-white rounded-lg px-2 py-1.5 outline-none w-full text-slate-600 transition-all resize-none"
            placeholder="What does this node do?"
          />
        </div>
      </div>

      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!bg-slate-300 !w-3 !h-3 !border-2 !border-white" 
      />
    </div>
  );
};

const nodeTypes = {
  editable: EditableNode,
};

const FlowEditor: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // Updated change handler to handle different fields
  const onNodeDataChange = useCallback((id: string, field: string, value: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: { ...node.data, [field]: value },
          };
        }
        return node;
      })
    );
  }, []);

  useEffect(() => {
    const initialNodes: Node[] = [
      {
        id: 'node-1',
        type: 'editable',
        data: { 
          label: 'Data Ingestion', 
          description: 'Fetch raw events from external API endpoints.',
          onChange: onNodeDataChange 
        },
        position: { x: 250, y: 50 },
      },
      {
        id: 'node-2',
        type: 'editable',
        data: { 
          label: 'Data Cleaning', 
          description: 'Filter out duplicates and normalize timestamps.',
          onChange: onNodeDataChange 
        },
        position: { x: 100, y: 280 },
      },
      {
        id: 'node-3',
        type: 'editable',
        data: { 
          label: 'Metric Storage', 
          description: 'Persist aggregated results to Postgres.',
          onChange: onNodeDataChange 
        },
        position: { x: 400, y: 280 },
      },
    ];

    const initialEdges: Edge[] = [
      { id: 'e1-2', source: 'node-1', target: 'node-2', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
      { id: 'e1-3', source: 'node-1', target: 'node-3', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
    ];

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [onNodeDataChange]);

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
    const id = `node-${Date.now()}`;
    const newNode: Node = {
      id,
      type: 'editable',
      data: { 
        label: `New Logic Block`, 
        description: 'New step in the pipeline.',
        onChange: onNodeDataChange 
      },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [onNodeDataChange]);

  return (
    <div className="w-full h-full flex flex-col bg-slate-50">
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shadow-sm z-10">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">System Flow Designer</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Architect your logic visually</p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={addNode}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-xl shadow-slate-200 transition-all flex items-center gap-2 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create Node
          </button>
          <div className="flex items-center px-4 py-2 bg-slate-100 rounded-xl border border-slate-200">
            <span className="text-slate-800 text-xs font-black">{nodes.length} Components</span>
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
          <Background color="#cbd5e1" gap={30} variant="dots" />
          <Controls className="!bg-white !border-slate-200 !shadow-2xl !rounded-xl !overflow-hidden !p-1" />
        </ReactFlow>
      </div>
    </div>
  );
};

export default FlowEditor;
