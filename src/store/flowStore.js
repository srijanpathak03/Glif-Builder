import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from 'reactflow';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useFlowStore = create((set, get) => ({
  nodes: [],
  edges: [],
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  addNewNode: (type, position) => {
    const newNode = {
      id: generateId(),
      type: 'custom',
      position,
      data: {
        type,
        onChange: (properties) => {
          get().updateNodeProperties(newNode.id, properties);
        },
      },
    };

    set({
      nodes: [...get().nodes, newNode],
    });
  },
  deleteSelectedNodes: () => {
    const selectedNodes = get().nodes.filter((node) => node.selected);
    const selectedNodeIds = new Set(selectedNodes.map((node) => node.id));
    
    set({
      nodes: get().nodes.filter((node) => !selectedNodeIds.has(node.id)),
      edges: get().edges.filter(
        (edge) =>
          !selectedNodeIds.has(edge.source) && !selectedNodeIds.has(edge.target)
      ),
    });
  },
  updateNodeProperties: (nodeId, properties) => {
    set({
      nodes: get().nodes.map(node =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, properties } }
          : node
      ),
    });
  },
}));