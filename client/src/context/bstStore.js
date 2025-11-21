import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

// Helper: Sleep function for animations
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper: TreeNode Class
class TreeNode {
  constructor(value, position) {
    this.id = uuidv4(); // Unique ID for React keys
    this.value = value;
    this.position = position;
    this.left = null;
    this.right = null;
  }
}

export const useBstStore = create((set, get) => ({
  // --- STATE ---
  root: null,
  highlightNode: null,  
  comparisonText: "",   
  comparisonPos: null,  
  isAnimating: false,   
  traversalResult: [],  

  // --- ACTIONS ---
  
  resetTree: () => set({ root: null, highlightNode: null, comparisonText: "", traversalResult: [] }),

  // 1. INSERT
  insert: async (value) => {
    const { root } = get();
    if (get().isAnimating) return;
    set({ isAnimating: true, comparisonText: "" });

    const insertRecursively = async (node, depth = 0, x = 0, y = 0, z = 0, offset = 4) => {
      if (!node) {
        set({ highlightNode: null, comparisonText: "" });
        return new TreeNode(value, [x, y, z]);
      }

      // Animation Step: Visit Node
      set({ highlightNode: node, comparisonPos: node.position });
      set({ comparisonText: `${value} < ${node.value}?` });
      await sleep(800);

      if (value < node.value) {
        set({ comparisonText: "Yes, go Left ✅" });
        await sleep(800);
        const newX = x - offset / (depth + 1);
        const newY = y - 2;
        node.left = await insertRecursively(node.left, depth + 1, newX, newY, z, offset);
      } else if (value > node.value) {
        set({ comparisonText: "No, go Right ➡️" });
        await sleep(800);
        const newX = x + offset / (depth + 1);
        const newY = y - 2;
        node.right = await insertRecursively(node.right, depth + 1, newX, newY, z, offset);
      } else {
        set({ comparisonText: "Value exists! 🚫" });
        await sleep(1000);
      }
      return node;
    };

    const newRoot = await insertRecursively(root ? { ...root } : null);
    set({ root: newRoot, isAnimating: false, highlightNode: null, comparisonText: "" });
  },

  // 2. DELETE
  deleteNode: async (value) => {
    const { root } = get();
    if (get().isAnimating || !root) return;
    set({ isAnimating: true, comparisonText: "" });

    const deleteRecursively = async (node, target) => {
      if (!node) return null;

      set({ highlightNode: node, comparisonPos: node.position });
      await sleep(800);

      if (target < node.value) {
        set({ comparisonText: `Go Left` });
        await sleep(800);
        node.left = await deleteRecursively(node.left, target);
      } else if (target > node.value) {
        set({ comparisonText: `Go Right` });
        await sleep(800);
        node.right = await deleteRecursively(node.right, target);
      } else {
        // Found node to delete
        set({ comparisonText: `Found ${target} 🗑️` });
        await sleep(1000);

        // Case 1: No Children
        if (!node.left && !node.right) return null;

        // Case 2: One Child
        if (!node.left) {
           const child = node.right;
           child.position = node.position; // Move child up visually
           return child;
        }
        if (!node.right) {
           const child = node.left;
           child.position = node.position;
           return child;
        }

        // Case 3: Two Children (Find Inorder Successor)
        set({ comparisonText: "Finding Successor..." });
        await sleep(1000);
        
        let successor = node.right;
        while (successor.left) successor = successor.left;
        
        node.value = successor.value; // Replace value
        node.right = await deleteRecursively(node.right, successor.value); // Delete successor
      }
      return node;
    };

    // We clone root to trigger React re-render on update
    const newRoot = await deleteRecursively({ ...root }, value);
    set({ root: newRoot, isAnimating: false, highlightNode: null, comparisonText: "" });
  },

  // 3. SEARCH
  search: async (value) => {
    const { root } = get();
    if (get().isAnimating || !root) return;
    set({ isAnimating: true });

    const searchRecursively = async (node) => {
        if (!node) {
            set({ comparisonText: "Not Found ❌" });
            await sleep(1000);
            return;
        }
        set({ highlightNode: node, comparisonPos: node.position });
        await sleep(800);

        if (value === node.value) {
            set({ comparisonText: "Found! 🎉" });
            await sleep(1500);
            return;
        } else if (value < node.value) {
            set({ comparisonText: "Go Left" });
            await sleep(800);
            await searchRecursively(node.left);
        } else {
            set({ comparisonText: "Go Right" });
            await sleep(800);
            await searchRecursively(node.right);
        }
    };

    await searchRecursively(root);
    set({ isAnimating: false, highlightNode: null, comparisonText: "" });
  },

  // 4. TRAVERSALS
  startTraversal: async (type) => {
    const { root } = get();
    if (get().isAnimating || !root) return;
    set({ isAnimating: true, traversalResult: [] });

    const visited = [];

    const traverse = async (node) => {
        if (!node) return;

        // Preorder: Root -> Left -> Right
        if (type === 'preorder') {
            set({ highlightNode: node, comparisonPos: node.position, comparisonText: `${node.value}` });
            visited.push(node.value);
            set({ traversalResult: [...visited] });
            await sleep(800);
            await traverse(node.left);
            await traverse(node.right);
        }
        // Inorder: Left -> Root -> Right
        else if (type === 'inorder') {
            await traverse(node.left);
            set({ highlightNode: node, comparisonPos: node.position, comparisonText: `${node.value}` });
            visited.push(node.value);
            set({ traversalResult: [...visited] });
            await sleep(800);
            await traverse(node.right);
        }
        // Postorder: Left -> Right -> Root
        else if (type === 'postorder') {
            await traverse(node.left);
            await traverse(node.right);
            set({ highlightNode: node, comparisonPos: node.position, comparisonText: `${node.value}` });
            visited.push(node.value);
            set({ traversalResult: [...visited] });
            await sleep(800);
        }
    };

    await traverse(root);
    set({ isAnimating: false, highlightNode: null, comparisonText: "Traversal Complete" });
    await sleep(1000);
    set({ comparisonText: "" });
  }
}));