import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useReactFlow } from 'reactflow';
import { Button } from './ui/Button';
import { NodeTypeSelector } from './NodeTypeSelector';
import { useStore } from '../store/flowStore';

export function AddNodeButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { screenToFlowPosition } = useReactFlow();
  const addNewNode = useStore((state) => state.addNewNode);

  const handleAddNode = (type: string) => {
    const position = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    addNewNode(type, position);
    setIsOpen(false);
  };

  return (
    <>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <Button 
          onClick={() => setIsOpen(true)} 
          className="rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      <NodeTypeSelector
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSelect={handleAddNode}
      />
    </>
  );
}