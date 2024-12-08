import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Panel,
} from 'reactflow';
import CustomNode from './CustomNode';
import { Trash2 } from 'lucide-react';
import { Button } from './ui/Button';
import { useStore } from '../store/flowStore';

const nodeTypes = {
  custom: CustomNode,
};

export function NodeCanvas() {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect,
    deleteSelectedNodes 
  } = useStore();

  const onKeyDown = useCallback((event) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      deleteSelectedNodes();
    }
  }, [deleteSelectedNodes]);

  return (
    <div className="w-full h-full" tabIndex={0} onKeyDown={onKeyDown}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <Panel position="top-right">
          <Button 
            variant="secondary" 
            onClick={deleteSelectedNodes}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Remove Selected
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
}