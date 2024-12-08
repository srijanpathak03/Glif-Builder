import React, { memo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { nodeTypes } from '../config/nodeTypes';
import { NodeProperties } from './NodeProperties';
import { Button } from './ui/Button';
import axios from 'axios';

export const CustomNode = memo(function CustomNode({ data, selected }) {
  const nodeType = nodeTypes.find((t) => t.id === data.type);

  if (!nodeType) return null;

  const handleRun = async () => {
    try {
      console.log(data);

      const response = await axios.post('http://localhost:3000/chat-completion', { prompt: data.properties.prompt });
      console.log('API Response:', response.data);
    } catch (error) {
      console.error('Error calling API:', error);
    }
  };

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.stopPropagation();
    }
  }, []);

  return (
    <div
      className={`bg-white rounded-lg shadow-lg border-2 min-w-[300px] ${selected ? 'border-blue-500' : 'border-gray-200'
        }`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-xl">{nodeType.icon}</span>
          <h3 className="font-medium">{nodeType.name}</h3>
        </div>
      </div>

      <NodeProperties
        nodeType={nodeType}
        properties={data.properties || {}}
        onChange={(newProperties) => {
          data.onChange?.(newProperties);
        }}
      />

      <Button onClick={handleRun} className="m-4">
        Run
      </Button>

      {Array.from({ length: nodeType.inputs }).map((_, i) => (
        <Handle
          key={`input-${i}`}
          type="target"
          position={Position.Left}
          style={{ top: `${((i + 1) * 100) / (nodeType.inputs + 1)}%` }}
        />
      ))}

      {Array.from({ length: nodeType.outputs }).map((_, i) => (
        <Handle
          key={`output-${i}`}
          type="source"
          position={Position.Right}
          style={{ top: `${((i + 1) * 100) / (nodeType.outputs + 1)}%` }}
        />
      ))}
    </div>
  );
});