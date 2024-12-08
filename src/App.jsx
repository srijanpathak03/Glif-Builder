import React, { useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';

import { FlowCanvas } from './components/FlowCanvas';
import { Header } from './components/Header';
import { NodeSequence } from './components/NodeSequence';
import { NodeTypeSelector } from './components/NodeTypeSelector';
import { useFlowStore } from './store/flowStore';

function App() {
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);
  const addNewNode = useFlowStore((state) => state.addNewNode);

  const handleAddNode = (type) => {
    addNewNode(type, { x: 100, y: 100 });
    setIsAddNodeOpen(false);
  };

  return (
    <ReactFlowProvider>
      <div className="flex h-screen bg-gray-100">
        <NodeSequence />
        <div className="flex-1 flex flex-col">
          <Header onAddNode={() => setIsAddNodeOpen(true)} />
          <div className="flex-1 relative">
            <FlowCanvas />
          </div>
        </div>

        <NodeTypeSelector
          isOpen={isAddNodeOpen}
          onClose={() => setIsAddNodeOpen(false)}
          onSelect={handleAddNode}
        />
      </div>
    </ReactFlowProvider>
  );
}

export default App;