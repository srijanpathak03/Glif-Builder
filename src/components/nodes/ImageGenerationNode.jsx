import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Image } from 'lucide-react';
import { MODEL_OPTIONS } from '../../types/nodes';

function ImageGenerationNode({ data, selected }: NodeProps) {
  const { properties } = data;

  return (
    <div
      className={`w-[300px] bg-white rounded-lg shadow-lg border-2 ${
        selected ? 'border-blue-500' : 'border-gray-200'
      }`}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Image className="w-5 h-5 text-purple-500" />
          <h3 className="font-medium">Image Generation</h3>
        </div>
        <select
          className="mt-2 w-full p-2 border rounded"
          value={properties.model}
          onChange={(e) => {
            data.onChange?.({ ...properties, model: e.target.value });
          }}
        >
          {MODEL_OPTIONS.imageGeneration.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default memo(ImageGenerationNode);