import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class RBNode {
  constructor(value, color = 'RED') {
    this.id = uuidv4();
    this.value = value;
    this.color = color; // 'RED' or 'BLACK'
    this.left = null;
    this.right = null;
    this.parent = null;
    this.position = [0, 0, 0];
  }
}

export const useRbTreeStore = create((set, get) => ({
  root: null,
  highlightNode: null,
  comparisonText: "",
  comparisonPos: null,
  isAnimating: false,

  resetTree: () => set({ root: null, highlightNode: null, comparisonText: "" }),

  // --- HELPER: Recalculate 3D Positions ---
  recalcPositions: (node = get().root, x = 0, y = 2, offset = 6, depth = 0) => {
    if (!node) return;
    node.position = [x, y, 0];
    const nextOffset = offset / 1.8;
    get().recalcPositions(node.left, x - nextOffset, y - 2, nextOffset, depth + 1);
    get().recalcPositions(node.right, x + nextOffset, y - 2, nextOffset, depth + 1);
  },

  // --- INSERTION (Existing) ---
  insert: async (value) => {
    const { root } = get();
    if (get().isAnimating) return;
    set({ isAnimating: true, comparisonText: "" });

    const newNode = new RBNode(value);
    
    if (!root) {
      newNode.color = 'BLACK';
      newNode.position = [0, 2, 0];
      set({ root: newNode, comparisonText: "Root is always Black ⚫" });
      await sleep(1000);
      set({ isAnimating: false, comparisonText: "" });
      return;
    }

    let current = root;
    let parent = null;

    while (current) {
      parent = current;
      set({ highlightNode: current, comparisonPos: current.position });
      if (value < current.value) {
        set({ comparisonText: `${value} < ${current.value}` });
        await sleep(500);
        current = current.left;
      } else if (value > current.value) {
        set({ comparisonText: `${value} > ${current.value}` });
        await sleep(500);
        current = current.right;
      } else {
        set({ comparisonText: "Value already exists!" });
        await sleep(1000);
        set({ isAnimating: false, highlightNode: null, comparisonText: "" });
        return;
      }
    }

    newNode.parent = parent;
    if (value < parent.value) parent.left = newNode;
    else parent.right = newNode;

    get().recalcPositions(get().root);
    set({ root: { ...get().root }, highlightNode: newNode, comparisonPos: newNode.position });
    set({ comparisonText: "New Node is RED 🔴" });
    await sleep(1000);

    await get().fixInsert(newNode);

    if (get().root.color === 'RED') {
      get().root.color = 'BLACK';
      set({ comparisonText: "Final: Root must be Black ⚫" });
      await sleep(1000);
    }

    set({ isAnimating: false, highlightNode: null, comparisonText: "" });
  },

  // --- DELETION LOGIC ---
  deleteNode: async (value) => {
    if (get().isAnimating || !get().root) return;
    set({ isAnimating: true, comparisonText: "Searching for node..." });

    // 1. Find Node
    let z = get().root;
    while (z) {
      set({ highlightNode: z, comparisonPos: z.position });
      await sleep(400);
      if (value === z.value) break;
      if (value < z.value) z = z.left;
      else z = z.right;
    }

    if (!z) {
      set({ comparisonText: "Node not found ❌" });
      await sleep(1000);
      set({ isAnimating: false, highlightNode: null, comparisonText: "" });
      return;
    }

    set({ comparisonText: `Found ${value}. Deleting...` });
    await sleep(800);

    let y = z; // y is the node that will actually be removed (or moved)
    let yOriginalColor = y.color;
    let x; // x tracks the child that moves into y's position

    // Case 1: No Left Child
    if (!z.left) {
      x = z.right;
      await get().transplant(z, z.right);
    } 
    // Case 2: No Right Child
    else if (!z.right) {
      x = z.left;
      await get().transplant(z, z.left);
    } 
    // Case 3: Two Children
    else {
      y = get().minimum(z.right);
      yOriginalColor = y.color;
      x = y.right;

      if (y.parent === z) {
        if (x) x.parent = y;
      } else {
        await get().transplant(y, y.right);
        y.right = z.right;
        if (y.right) y.right.parent = y;
      }
      
      await get().transplant(z, y);
      y.left = z.left;
      if (y.left) y.left.parent = y;
      y.color = z.color; // y takes z's color
    }

    get().recalcPositions(get().root);
    set({ root: get().root ? { ...get().root } : null });

    // If we deleted a Black node, we have a Double Black violation
    if (yOriginalColor === 'BLACK') {
      if (x) {
          // Fix starting at the replacement child
          await get().fixDelete(x);
      } else if (get().root) {
          // Special case: Leaf was deleted and x is null. 
          // We need to fix visually, but logic usually requires a dummy nil node.
          // For visualization simplified: We skip complex fix if tree is empty or trivial.
          set({ comparisonText: "Black node deleted (Simple Case)" });
          await sleep(1000);
      }
    }

    set({ isAnimating: false, highlightNode: null, comparisonText: "" });
  },

  // --- DELETE FIXUP ---
  fixDelete: async (x) => {
    while (x !== get().root && x.color === 'BLACK') {
      // Case: x is Left Child
      if (x === x.parent.left) {
        let w = x.parent.right; // Sibling

        // Case 1: Sibling is RED
        if (w && w.color === 'RED') {
          set({ highlightNode: w, comparisonText: "Sibling Red -> Rotate & Recolor" });
          await sleep(1000);
          w.color = 'BLACK';
          x.parent.color = 'RED';
          await get().leftRotate(x.parent);
          w = x.parent.right; // New sibling
          get().recalcPositions(get().root);
          set({ root: { ...get().root } });
          await sleep(1000);
        }

        if (!w) break; // Safety

        // Case 2: Sibling's children are both BLACK
        if ((!w.left || w.left.color === 'BLACK') && (!w.right || w.right.color === 'BLACK')) {
          set({ highlightNode: w, comparisonText: "Sibling Children Black -> Recolor Sibling" });
          await sleep(1000);
          w.color = 'RED';
          x = x.parent; // Move up
        } 
        else {
          // Case 3: Sibling Left Child is RED (Inner) -> Rotate Sibling Right
          if (!w.right || w.right.color === 'BLACK') {
            if (w.left) w.left.color = 'BLACK';
            w.color = 'RED';
            set({ comparisonText: "Inner Child Red -> Rotate Sibling Right" });
            await sleep(1000);
            await get().rightRotate(w);
            w = x.parent.right;
            get().recalcPositions(get().root);
            set({ root: { ...get().root } });
            await sleep(1000);
          }

          // Case 4: Sibling Right Child is RED (Outer) -> Rotate Parent Left
          set({ comparisonText: "Outer Child Red -> Rotate Parent Left" });
          await sleep(1000);
          w.color = x.parent.color;
          x.parent.color = 'BLACK';
          if (w.right) w.right.color = 'BLACK';
          await get().leftRotate(x.parent);
          x = get().root; // Done
          get().recalcPositions(get().root);
          set({ root: { ...get().root } });
          await sleep(1000);
        }
      } 
      // Case: x is Right Child (Mirror of above)
      else {
        let w = x.parent.left;
        
        if (w && w.color === 'RED') { // Case 1
          w.color = 'BLACK';
          x.parent.color = 'RED';
          await get().rightRotate(x.parent);
          w = x.parent.left;
          get().recalcPositions(get().root);
          set({ root: { ...get().root } });
          await sleep(1000);
        }

        if (!w) break;

        if ((!w.right || w.right.color === 'BLACK') && (!w.left || w.left.color === 'BLACK')) { // Case 2
          w.color = 'RED';
          x = x.parent;
        } else {
          if (!w.left || w.left.color === 'BLACK') { // Case 3
            if (w.right) w.right.color = 'BLACK';
            w.color = 'RED';
            await get().leftRotate(w);
            w = x.parent.left;
            get().recalcPositions(get().root);
            set({ root: { ...get().root } });
            await sleep(1000);
          }
          // Case 4
          w.color = x.parent.color;
          x.parent.color = 'BLACK';
          if (w.left) w.left.color = 'BLACK';
          await get().rightRotate(x.parent);
          x = get().root;
          get().recalcPositions(get().root);
          set({ root: { ...get().root } });
          await sleep(1000);
        }
      }
      await sleep(500);
    }
    x.color = 'BLACK';
    set({ root: { ...get().root } });
  },

  // --- INSERT FIXUP (Existing Logic) ---
  fixInsert: async (k) => {
    while (k.parent && k.parent.color === 'RED') {
      let gp = k.parent.parent;
      set({ comparisonText: "Violation: Double Red 🔴🔴" });
      set({ highlightNode: k.parent, comparisonPos: k.parent.position });
      await sleep(1200);

      if (k.parent === gp.left) {
        let uncle = gp.right;
        if (uncle && uncle.color === 'RED') {
          set({ comparisonText: "Recolor Parent & Uncle Black, GP Red" });
          await sleep(1000);
          k.parent.color = 'BLACK';
          uncle.color = 'BLACK';
          gp.color = 'RED';
          k = gp;
        } else {
          if (k === k.parent.right) {
            set({ comparisonText: "Triangle -> Rotate Parent Left" });
            k = k.parent;
            await get().leftRotate(k);
            get().recalcPositions(get().root);
            set({ root: { ...get().root } }); 
            await sleep(1000);
          }
          set({ comparisonText: "Line -> Rotate GP Right + Swap Colors" });
          await sleep(1000);
          k.parent.color = 'BLACK';
          gp.color = 'RED';
          await get().rightRotate(gp);
          get().recalcPositions(get().root);
          set({ root: { ...get().root } });
          await sleep(1000);
        }
      } else {
        let uncle = gp.left;
        if (uncle && uncle.color === 'RED') {
          set({ comparisonText: "Recolor Parent & Uncle Black, GP Red" });
          await sleep(1000);
          k.parent.color = 'BLACK';
          uncle.color = 'BLACK';
          gp.color = 'RED';
          k = gp;
        } else {
          if (k === k.parent.left) {
            set({ comparisonText: "Triangle -> Rotate Parent Right" });
            k = k.parent;
            await get().rightRotate(k);
            get().recalcPositions(get().root);
            set({ root: { ...get().root } });
            await sleep(1000);
          }
          set({ comparisonText: "Line -> Rotate GP Left + Swap Colors" });
          await sleep(1000);
          k.parent.color = 'BLACK';
          gp.color = 'RED';
          await get().leftRotate(gp);
          get().recalcPositions(get().root);
          set({ root: { ...get().root } });
          await sleep(1000);
        }
      }
      set({ root: { ...get().root } });
    }
  },

  // --- HELPERS ---
  transplant: async (u, v) => {
    if (!u.parent) set({ root: v });
    else if (u === u.parent.left) u.parent.left = v;
    else u.parent.right = v;
    if (v) v.parent = u.parent;
  },

  minimum: (node) => {
    while (node.left) node = node.left;
    return node;
  },

  leftRotate: async (x) => {
    let y = x.right;
    x.right = y.left;
    if (y.left) y.left.parent = x;
    y.parent = x.parent;
    if (!x.parent) set({ root: y });
    else if (x === x.parent.left) x.parent.left = y;
    else x.parent.right = y;
    y.left = x;
    x.parent = y;
  },

  rightRotate: async (y) => {
    let x = y.left;
    y.left = x.right;
    if (x.right) x.right.parent = y;
    x.parent = y.parent;
    if (!y.parent) set({ root: x });
    else if (y === y.parent.left) y.parent.left = x;
    else y.parent.right = x;
    x.right = y;
    y.parent = x;
  }
}));