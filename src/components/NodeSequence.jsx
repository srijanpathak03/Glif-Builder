import React from 'react';
import { useFlowStore } from '../store/flowStore';
import { nodeTypes } from '../config/nodeTypes';

export function NodeSequence() {
  const nodes = useFlowStore((state) => state.nodes);

  return (
    <div className="w-64 bg-white border-r p-4">
      <h2 className="text-sm font-semibold text-gray-500 mb-4">Flow Sequence</h2>
      <div className="space-y-2">
        {nodes.map((node) => {
          const nodeType = nodeTypes.find((t) => t.id === node.data.type);
          return (
            <div
              key={node.id}
              className="flex items-center p-2 rounded bg-gray-50 border border-gray-200"
            >
              <span className="text-xl mr-2">{nodeType?.icon}</span>
              <div className="text-sm">
                <div className="font-medium">{nodeType?.name}</div>
                <div className="text-xs text-gray-500">ID: {node.id}</div>
              </div>
            </div>
          );
        })}
        {nodes.length === 0 && (
          <div className="text-sm text-gray-500 text-center py-4">
            No nodes added yet
          </div>
        )}
      </div>
    </div>
  );
}