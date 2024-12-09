import React, { useState } from 'react';

export function NodeProperties({ nodeType, properties, onChange, output, nodeName, onNameChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNameChange = (newName) => {
    try {
      onNameChange(newName);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleChange = (name, value) => {
    onChange({ ...properties, [name]: value });
  };

  const renderProperty = (prop) => {
    switch (prop.type) {
      case 'text':
        return (
          <textarea
            className="w-full p-2 border rounded"
            value={properties[prop.name] || ''}
            onChange={(e) => handleChange(prop.name, e.target.value)}
            placeholder={prop.required ? '(Required)' : '(Optional)'}
          />
        );
      case 'select':
        return (
          <select
            className="w-full p-2 border rounded"
            value={properties[prop.name] || prop.default}
            onChange={(e) => handleChange(prop.name, e.target.value)}
          >
            {prop.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'range':
        return (
          <div className="flex items-center gap-2">
            <input
              type="range"
              className="flex-1"
              min={prop.min}
              max={prop.max}
              step={prop.step}
              value={properties[prop.name] || prop.default}
              onChange={(e) => handleChange(prop.name, parseFloat(e.target.value))}
            />
            <span className="text-sm text-gray-600">
              {properties[prop.name] || prop.default}
            </span>
          </div>
        );
      case 'number':
        return (
          <input
            type="number"
            className="w-full p-2 border rounded"
            min={prop.min}
            max={prop.max}
            value={properties[prop.name] || prop.default}
            onChange={(e) => handleChange(prop.name, parseInt(e.target.value, 10))}
          />
        );
      case 'boolean':
        return (
          <input
            type="checkbox"
            checked={properties[prop.name] || prop.default}
            onChange={(e) => handleChange(prop.name, e.target.checked)}
          />
        );
      default:
        return null;
    }
  };

  const renderOutput = () => {
    if (!output) return null;

    switch (nodeType.id) {
      case 'text-generation':
        return (
          <textarea
            className="w-full h-32 p-2 border rounded bg-gray-50 font-mono text-sm"
            value={typeof output === 'object' ? JSON.stringify(output, null, 2) : output}
            readOnly
          />
        );
      case 'image-generation':
        return (
          <div className="space-y-2">
            <textarea
              className="w-full h-20 p-2 border rounded bg-gray-50 font-mono text-sm"
              value={typeof output === 'object' ? JSON.stringify(output, null, 2) : output}
              readOnly
            />
            {output?.url && (
              <img
                src={output.url}
                alt="Generated"
                className="max-w-full h-auto rounded"
              />
            )}
          </div>
        );
      case 'video-generation':
        return (
          <div className="space-y-2">
            <textarea
              className="w-full h-20 p-2 border rounded bg-gray-50 font-mono text-sm"
              value={typeof output === 'object' ? JSON.stringify(output, null, 2) : output}
              readOnly
            />
            {output?.url && (
              <video
                controls
                className="max-w-full h-auto rounded"
                src={output.url}
              />
            )}
          </div>
        );
      case 'audio-generation':
        return (
          <div className="space-y-2">
            <textarea
              className="w-full h-20 p-2 border rounded bg-gray-50 font-mono text-sm"
              value={typeof output === 'object' ? JSON.stringify(output, null, 2) : output}
              readOnly
            />
            {output?.url && (
              <audio
                controls
                className="w-full"
                src={output.url}
              />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Node Name Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Node Name
          <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={nodeName || ''}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Enter unique node name"
        />
      </div>

      {nodeType.properties.filter(prop => prop.name === 'model' || prop.name === 'prompt').map(prop => (
        <div key={prop.name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {prop.name}
            {prop.required && <span className="text-red-500">*</span>}
          </label>
          {renderProperty(prop)}
        </div>
      ))}

      <button
        className="text-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'Hide Options' : 'Advance Options'}
      </button>

      {isOpen && (
        <div className="mt-2">
          {nodeType.properties.filter(prop => prop.name !== 'model' && prop.name !== 'prompt').map(prop => (
            <div key={prop.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {prop.name}
                {prop.required && <span className="text-red-500">*</span>}
              </label>
              {renderProperty(prop)}
            </div>
          ))}
        </div>
      )}

      {/* Output Area */}
      <div className="mt-4">
        <div className="font-medium text-sm text-gray-700 mb-2">Output:</div>
        {renderOutput()}
      </div>
    </div>
  );
}