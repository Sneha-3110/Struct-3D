import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid'; // We installed this in Phase 1

/**
 * This store holds the state for our data structure.
 * We'll start with a simple array of nodes.
 */
export const useDsaStore = create((set) => ({
  // --- STATE ---
  // An array of node objects. Each node has a unique ID and a value.
  nodes: [
    { id: uuidv4(), value: 42 },
    { id: uuidv4(), value: 17 },
    { id: uuidv4(), value: 88 },
  ],

  // --- ACTIONS ---
  // Actions are functions that modify the state.

  /**
   * Adds a new node with a random value to the end of the array.
   */
  addNode: (value) => {
    const newValue = value || Math.floor(Math.random() * 100);
    set((state) => ({
      nodes: [
        ...state.nodes,
        { id: uuidv4(), value: newValue }
      ],
    }));
  },

  /**
   * Removes a node by its ID.
   * (We won't use this button yet, but it's good to have)
   */
  removeNode: (id) => {
    set((state) => ({
      nodes: state.nodes.filter(node => node.id !== id),
    }));
  },
  
  /**
   * Clears all nodes from the visualizer.
   */
  resetNodes: () => {
    set({ nodes: [] });
  }
}));