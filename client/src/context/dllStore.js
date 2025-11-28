import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export const useDllStore = create((set) => ({
  nodes: [
    { id: uuidv4(), value: 10 },
    { id: uuidv4(), value: 20 },
    { id: uuidv4(), value: 30 },
  ],

  insertHead: (value) => set((state) => ({
    nodes: [{ id: uuidv4(), value: Number(value) }, ...state.nodes]
  })),

  insertTail: (value) => set((state) => ({
    nodes: [...state.nodes, { id: uuidv4(), value: Number(value) }]
  })),

  deleteHead: () => set((state) => ({
    nodes: state.nodes.length > 0 ? state.nodes.slice(1) : []
  })),

  deleteTail: () => set((state) => ({
    nodes: state.nodes.length > 0 ? state.nodes.slice(0, -1) : []
  })),

  resetNodes: () => set({ nodes: [] })
}));