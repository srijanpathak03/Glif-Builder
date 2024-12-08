import React from 'react';
import { Play, Plus } from 'lucide-react';
import { Button } from './ui/Button';
import { useFlowStore } from '../store/flowStore';

export function Header({ onAddNode }) {
  const nodes = useFlowStore((state) => state.nodes);
  
  const handleRun = () => {
    console.log('Running flow with nodes:', nodes);
  };

  return (
    <div className="p-4 bg-white border-b flex justify-between items-center">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">GLIF Builder</h1>
        <Button onClick={handleRun} className="bg-black hover:bg-gray-800">
          <Play className="w-4 h-4 mr-2" />
          Run Flow
        </Button>
      </div>
      <Button onClick={onAddNode} className="flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Add Node
      </Button>
    </div>
  );
}