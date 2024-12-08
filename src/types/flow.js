export interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    properties: Record<string, any>;
  };
}

export interface NodeType {
  id: string;
  name: string;
  description: string;
  icon: string;
  inputs: number;
  outputs: number;
  properties: {
    name: string;
    type: string;
    default?: any;
  }[];
}