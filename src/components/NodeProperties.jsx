import React from 'react';

export function NodeProperties({ nodeType, properties, onChange }) {
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

  return (
    <div className="p-4 space-y-4">
      {nodeType.properties.map((prop) => (
        <div key={prop.name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {prop.name}
            {prop.required && <span className="text-red-500">*</span>}
          </label>
          {renderProperty(prop)}
        </div>
      ))}
    </div>
  );
}