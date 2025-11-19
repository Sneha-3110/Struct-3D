import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';

export const useDsaStore = create((set) => ({
  nodes: [
    { id: uuidv4(), value: 10 },
    { id: uuidv4(), value: 20 },
    { id: uuidv4(), value: 30 },
  ],

  // --- INSERTION LOGIC ---
  insertHead: (value) => set((state) => {
    toast.success(`Node with value ${value} inserted at head`);
    return {nodes: [{ id: uuidv4(), value: Number(value) }, ...state.nodes]}
    
  }),

  insertTail: (value) => set((state) => {
    toast.success(`Node with value ${value} inserted at tail`);
    return {nodes: [...state.nodes, { id: uuidv4(), value: Number(value) }]}
  }),

  insertAt: (index, value) => set((state) => {
    if (index < 0 || index > state.nodes.length) return state; // Bounds check
    toast.success(`Node with value ${value} inserted at index ${index}`);
    const newNodes = [...state.nodes];
    newNodes.splice(index, 0, { id: uuidv4(), value: Number(value) });
    return { nodes: newNodes };
  }),

  // --- DELETION LOGIC ---
  deleteHead: () => set((state) => {
    if (state.nodes.length === 0) {
      toast.error("Cannot delete: List is empty");
      return state;
    }
    
    toast.success("Head node deleted");
    return { nodes: state.nodes.slice(1) };
  }),

  deleteTail: () => set((state) => {
    if (state.nodes.length === 0) {
      toast.error("Cannot delete: List is empty");
      return state;
    }

    toast.success("Tail node deleted");
    return { nodes: state.nodes.slice(0, -1) };
  }),

  deleteAt: (index) => set((state) => {
    const idx = Number(index);

    if (state.nodes.length === 0) {
      toast.error("Cannot delete: List is empty");
      return state;
    }

    if (idx < 0 || idx >= state.nodes.length) {
      toast.error(`Invalid Index: ${idx}`);
      return state;
    }

    toast.success(`Node at index ${idx} deleted`);
    return { nodes: state.nodes.filter((_, i) => i !== idx) };
  }),

  deleteByValue: (value) => set((state) => {
    // Deletes the *first* occurrence of the value
    if (state.nodes.length === 0) {
      // console.log("empty")
      toast.error("Linked List is empty");
      return state; 
    }
    const index = state.nodes.findIndex(n => n.value === Number(value));
    if (index === -1) return state;
    return { nodes: state.nodes.filter((_, i) => i !== index) };
  }),

  resetNodes: () => set({ nodes: [] })
}));