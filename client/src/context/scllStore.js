import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const useScllStore = create((set, get) => ({
  nodes: [
    { id: uuidv4(), value: 10 },
    { id: uuidv4(), value: 20 },
    { id: uuidv4(), value: 30 },
  ],
  highlightNodeId: null, // Tracks which node is active (for animation)
  isAnimating: false,
  statusText: "",        // To show what is happening (e.g. "Updating Tail...")

  // --- ACTIONS ---

  insertHead: async (value) => {
    if (get().isAnimating) return;
    set({ isAnimating: true, statusText: "Creating new node..." });
    
    // 1. Simulate Traversal to Tail (Required to update the circular link in logic)
    // Even though array logic is O(1), SCLL logic is O(n) to find tail
    const currentNodes = get().nodes;
    if (currentNodes.length > 0) {
        set({ statusText: "Traversing to Tail to update circular link..." });
        for (let node of currentNodes) {
            set({ highlightNodeId: node.id });
            await sleep(400); // Animation delay
        }
    }

    set({ 
        nodes: [{ id: uuidv4(), value: Number(value) }, ...get().nodes],
        statusText: "Inserted at Head & Updated Tail link!",
        highlightNodeId: null
    });
    toast.success("Inserted Head");
    await sleep(500);
    set({ isAnimating: false, statusText: "" });
  },

  insertTail: async (value) => {
    if (get().isAnimating) return;
    set({ isAnimating: true, statusText: "Traversing to end..." });

    const currentNodes = get().nodes;
    for (let node of currentNodes) {
        set({ highlightNodeId: node.id });
        await sleep(400);
    }

    set({ 
        nodes: [...currentNodes, { id: uuidv4(), value: Number(value) }],
        statusText: "Inserted at Tail!",
        highlightNodeId: null
    });
    toast.success("Inserted Tail");
    await sleep(500);
    set({ isAnimating: false, statusText: "" });
  },

  deleteHead: async () => {
    if (get().isAnimating) return;
    const currentNodes = get().nodes;

    if (currentNodes.length === 0) {
        toast.error("List is empty!");
        return;
    }

    set({ isAnimating: true, statusText: "Updating Tail link..." });

    // Visualize traversal to tail (since tail.next changes)
    if (currentNodes.length > 1) {
        for (let node of currentNodes) {
            set({ highlightNodeId: node.id });
            await sleep(300);
        }
    }
    
    set({ 
        statusText: "Deleting Head Node...",
        highlightNodeId: currentNodes[0].id // Highlight head just before delete
    });
    await sleep(600);

    set({ 
        nodes: currentNodes.slice(1),
        highlightNodeId: null
    });
    toast.success("Deleted Head");
    set({ isAnimating: false, statusText: "" });
  },

  deleteTail: async () => {
    if (get().isAnimating) return;
    const currentNodes = get().nodes;

    if (currentNodes.length === 0) {
        toast.error("List is empty!");
        return;
    }

    set({ isAnimating: true, statusText: "Traversing to second-to-last node..." });

    // Traverse to the node BEFORE the tail
    for (let i = 0; i < currentNodes.length - 1; i++) {
        set({ highlightNodeId: currentNodes[i].id });
        await sleep(400);
    }

    set({ 
        statusText: "Removing Tail link...",
        highlightNodeId: currentNodes[currentNodes.length - 1].id // Highlight tail
    });
    await sleep(600);

    set({ 
        nodes: currentNodes.slice(0, -1),
        highlightNodeId: null
    });
    toast.success("Deleted Tail");
    set({ isAnimating: false, statusText: "" });
  },

  resetNodes: () => set({ nodes: [], highlightNodeId: null, statusText: "" })
}));