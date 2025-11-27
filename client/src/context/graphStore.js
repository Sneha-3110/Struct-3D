import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';

export const useGraphStore = create((set, get) => ({
  // Graph state
  nodes: [],
  edges: [],
  isDirected: false,
  selectedNode: null,
  selectedNodeForEdge: null,
  
  // Algorithm visualization state
  visitedNodes: new Set(),
  queuedNodes: new Set(),
  currentNode: null,
  highlightedEdges: new Set(),
  isAnimating: false,
  
  // BFS/DFS specific state
  queue: [],
  stack: [],
  stackHistory: [],
  
  // Animation control
  animationSpeed: 1,
  isPaused: false,
  stepByStep: false,
  
  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
  setPaused: (paused) => set({ isPaused: paused }),
  setStepByStep: (stepByStep) => set({ stepByStep: stepByStep }),

  // Enhanced sleep function that respects speed and pause
  sleep: (baseMs) => {
    return new Promise(resolve => {
      const state = get();
      const adjustedMs = baseMs / state.animationSpeed;
      
      const checkPause = () => {
        if (state.isPaused && !state.stepByStep) {
          setTimeout(checkPause, 100);
        } else {
          resolve();
        }
      };
      
      setTimeout(checkPause, adjustedMs);
    });
  },
  addNode: (position = [0, 0, 0], value = null) => set((state) => {
    const nodeValue = value || state.nodes.length + 1;
    const newNode = {
      id: uuidv4(),
      value: nodeValue,
      position: position,
      state: 'normal' // normal, visited, queued, current
    };
    
    toast.success(`Node ${nodeValue} added`);
    return { 
      nodes: [...state.nodes, newNode]
    };
  }),

  removeNode: (nodeId) => set((state) => {
    const nodeToRemove = state.nodes.find(n => n.id === nodeId);
    if (!nodeToRemove) return state;
    
    // Remove all edges connected to this node
    const newEdges = state.edges.filter(
      edge => edge.from !== nodeId && edge.to !== nodeId
    );
    
    const newNodes = state.nodes.filter(node => node.id !== nodeId);
    
    toast.success(`Node ${nodeToRemove.value} removed`);
    return {
      nodes: newNodes,
      edges: newEdges,
      selectedNode: state.selectedNode === nodeId ? null : state.selectedNode,
      selectedNodeForEdge: state.selectedNodeForEdge === nodeId ? null : state.selectedNodeForEdge
    };
  }),

  addEdge: (fromNodeId, toNodeId) => set((state) => {
    // Check if edge already exists
    const edgeExists = state.edges.some(
      edge => 
        (edge.from === fromNodeId && edge.to === toNodeId) ||
        (!state.isDirected && edge.from === toNodeId && edge.to === fromNodeId)
    );

    if (edgeExists) {
      toast.error("Edge already exists");
      return state;
    }

    if (fromNodeId === toNodeId) {
      toast.error("Cannot create self-loop");
      return state;
    }

    const fromNode = state.nodes.find(n => n.id === fromNodeId);
    const toNode = state.nodes.find(n => n.id === toNodeId);

    if (!fromNode || !toNode) {
      toast.error("Invalid nodes for edge");
      return state;
    }

    const newEdge = {
      id: uuidv4(),
      from: fromNodeId,
      to: toNodeId,
      state: 'normal' // normal, highlighted, traversed
    };

    toast.success(`Edge added: ${fromNode.value} → ${toNode.value}`);
    return {
      edges: [...state.edges, newEdge],
      selectedNodeForEdge: null
    };
  }),

  removeEdge: (edgeId) => set((state) => {
    const newEdges = state.edges.filter(edge => edge.id !== edgeId);
    toast.success("Edge removed");
    return { edges: newEdges };
  }),

  toggleGraphType: () => set((state) => {
    const newIsDirected = !state.isDirected;
    toast.success(`Switched to ${newIsDirected ? 'directed' : 'undirected'} graph`);
    return { isDirected: newIsDirected };
  }),

  updateNodePosition: (nodeId, newPosition) => set((state) => ({
    nodes: state.nodes.map(node => 
      node.id === nodeId 
        ? { ...node, position: newPosition }
        : node
    )
  })),

  setSelectedNode: (nodeId) => set({ selectedNode: nodeId }),

  setSelectedNodeForEdge: (nodeId) => set((state) => {
    if (state.selectedNodeForEdge === null) {
      // First node selected for edge creation
      toast.success(`Node ${state.nodes.find(n => n.id === nodeId)?.value} selected. Select second node to create edge.`);
      return { selectedNodeForEdge: nodeId };
    } else if (state.selectedNodeForEdge === nodeId) {
      // Same node clicked - deselect
      toast.info("Edge creation cancelled");
      return { selectedNodeForEdge: null };
    } else {
      // Second node selected - create edge
      const firstNode = state.nodes.find(n => n.id === state.selectedNodeForEdge);
      const secondNode = state.nodes.find(n => n.id === nodeId);
      
      if (firstNode && secondNode) {
        get().addEdge(state.selectedNodeForEdge, nodeId);
      }
      
      return { selectedNodeForEdge: null };
    }
  }),

  // --- ALGORITHM VISUALIZATION METHODS ---
  resetVisualization: () => set({
    visitedNodes: new Set(),
    queuedNodes: new Set(),
    currentNode: null,
    highlightedEdges: new Set(),
    queue: [],
    stack: [],
    stackHistory: [],
    isAnimating: false,
    nodes: get().nodes.map(node => ({ ...node, state: 'normal' })),
    edges: get().edges.map(edge => ({ ...edge, state: 'normal' }))
  }),

  setNodeState: (nodeId, state) => set((prevState) => ({
    nodes: prevState.nodes.map(node => 
      node.id === nodeId ? { ...node, state } : node
    )
  })),

  setEdgeState: (edgeId, state) => set((prevState) => ({
    edges: prevState.edges.map(edge => 
      edge.id === edgeId ? { ...edge, state } : edge
    )
  })),

  setCurrentNode: (nodeId) => set({ currentNode: nodeId }),
  
  setAnimating: (isAnimating) => set({ isAnimating }),

  // Get neighbors of a node
  getNeighbors: (nodeId) => {
    const state = get();
    const neighbors = [];
    
    state.edges.forEach(edge => {
      if (edge.from === nodeId) {
        neighbors.push({
          nodeId: edge.to,
          edgeId: edge.id
        });
      } else if (!state.isDirected && edge.to === nodeId) {
        neighbors.push({
          nodeId: edge.from,
          edgeId: edge.id
        });
      }
    });
    
    return neighbors;
  },

  // BFS Algorithm with enhanced step control
  startBFS: async (startNodeId) => {
    const state = get();
    if (state.isAnimating) return;
    
    get().resetVisualization();
    get().setAnimating(true);
    
    const queue = [startNodeId];
    const visited = new Set();
    
    while (queue.length > 0 && get().isAnimating) {
      // Check for pause
      while (get().isPaused && get().isAnimating) {
        await get().sleep(100);
      }
      
      const currentNodeId = queue.shift();
      
      if (visited.has(currentNodeId)) continue;
      
      // Mark as current and visited
      visited.add(currentNodeId);
      get().setCurrentNode(currentNodeId);
      get().setNodeState(currentNodeId, 'current');
      
      // Wait for animation with speed control
      await get().sleep(1000);
      
      // Mark as visited
      get().setNodeState(currentNodeId, 'visited');
      
      // Get neighbors and add to queue
      const neighbors = get().getNeighbors(currentNodeId);
      
      for (const { nodeId, edgeId } of neighbors) {
        if (!visited.has(nodeId) && !queue.includes(nodeId)) {
          queue.push(nodeId);
          get().setNodeState(nodeId, 'queued');
          get().setEdgeState(edgeId, 'highlighted');
          
          // Wait for edge highlight with speed control
          await get().sleep(500);
        }
      }
      
      // Wait before next iteration
      await get().sleep(500);
    }
    
    // Mark all remaining queued nodes as completed
    queue.forEach(nodeId => {
      get().setNodeState(nodeId, 'completed');
    });
    
    get().setCurrentNode(null);
    get().setAnimating(false);
    toast.success("BFS completed!");
  },

  // DFS Algorithm with enhanced step control  
  startDFS: async (startNodeId) => {
    const state = get();
    if (state.isAnimating) return;
    
    get().resetVisualization();
    get().setAnimating(true);
    
    const visited = new Set();
    const stackHistory = [];
    
    const dfsRecursive = async (nodeId, depth = 0) => {
      // Check for pause
      while (get().isPaused && get().isAnimating) {
        await get().sleep(100);
      }
      
      if (visited.has(nodeId) || !get().isAnimating) return;
      
      // Add to stack history
      stackHistory.push({ nodeId, depth, action: 'enter' });
      set({ stackHistory: [...stackHistory] });
      
      visited.add(nodeId);
      get().setCurrentNode(nodeId);
      get().setNodeState(nodeId, 'current');
      
      // Wait for animation with speed control
      await get().sleep(1000);
      
      // Mark as visited
      get().setNodeState(nodeId, 'visited');
      
      // Get neighbors
      const neighbors = get().getNeighbors(nodeId);
      
      for (const { nodeId: neighborId, edgeId } of neighbors) {
        if (!visited.has(neighborId) && get().isAnimating) {
          get().setNodeState(neighborId, 'stack');
          get().setEdgeState(edgeId, 'highlighted');
          await get().sleep(500);
          
          await dfsRecursive(neighborId, depth + 1);
          
          // Backtrack visualization
          get().setEdgeState(edgeId, 'traversed');
          await get().sleep(300);
        }
      }
      
      // Mark as completed and add backtrack to stack history
      get().setNodeState(nodeId, 'completed');
      stackHistory.push({ nodeId, depth, action: 'exit' });
      set({ stackHistory: [...stackHistory] });
    };
    
    await dfsRecursive(startNodeId);
    
    get().setCurrentNode(null);
    get().setAnimating(false);
    toast.success("DFS completed!");
  },

  // Clear graph
  clearGraph: () => set({
    nodes: [],
    edges: [],
    selectedNode: null,
    selectedNodeForEdge: null,
    visitedNodes: new Set(),
    queuedNodes: new Set(),
    currentNode: null,
    highlightedEdges: new Set(),
    queue: [],
    stack: [],
    stackHistory: [],
    isAnimating: false
  })
}));