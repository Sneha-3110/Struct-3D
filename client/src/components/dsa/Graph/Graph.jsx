import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGraphStore } from '../../../context/graphStore';
import SceneSetup from '../../canvas/SceneSetup';
import GraphCanvas from './GraphCanvas';
import { Text } from '@react-three/drei';

// Tab definitions
const TABS = {
  NORMAL: 'normal',
  DFS: 'dfs', 
  BFS: 'bfs'
};

// Animated Label Component (3D floating text)
const AnimatedOperationLabel = ({ message, position, onComplete }) => {
  const labelRef = useRef();
  
  React.useEffect(() => {
    if (labelRef.current && message) {
      // Start animation
      labelRef.current.position.y = position[1] + 1;
      
      // Animate upward and fade
      const animate = () => {
        if (labelRef.current) {
          labelRef.current.position.y += 0.02;
          // After 3 seconds, call onComplete
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 3000);
        }
      };
      
      const interval = setInterval(animate, 16);
      return () => clearInterval(interval);
    }
  }, [message, position, onComplete]);

  if (!message) return null;

  return (
    <group ref={labelRef} position={position}>
      <Text
        fontSize={0.5}
        color="#00ff00"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
        outlineWidth={0.03}
        outlineColor="#000000"
      >
        {message}
      </Text>
    </group>
  );
};

const styles = {
  container: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: '"Segoe UI", Roboto, Helvetica, sans-serif',
    overflow: 'hidden',
  },
  taskbar: {
    width: '60px',
    background: 'linear-gradient(180deg, #2c3e50 0%, #34495e 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '20px',
    zIndex: 20,
    boxShadow: '2px 0 10px rgba(0,0,0,0.3)',
  },
  taskbarIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '15px',
    cursor: 'pointer',
    fontSize: '1.4rem',
    transition: 'all 0.3s ease',
    border: '2px solid transparent',
  },
  taskbarIconHover: {
    background: 'rgba(255,255,255,0.2)',
    transform: 'scale(1.1)',
    borderColor: 'rgba(255,255,255,0.3)',
  },
  workingArea: {
    flex: 1,
    position: 'relative',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)',
  },
  rightPanel: {
    width: '380px',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
    borderLeft: '1px solid #e9ecef',
    zIndex: 20,
    boxShadow: '-2px 0 20px rgba(0,0,0,0.1)',
  },
  tabContainer: {
    display: 'flex',
    background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
    borderBottom: '1px solid #dee2e6',
  },
  tab: {
    flex: 1,
    padding: '15px 10px',
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontWeight: '600',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    borderBottom: '3px solid transparent',
  },
  activeTab: {
    background: 'rgba(255,255,255,0.2)',
    borderBottomColor: '#ffffff',
    transform: 'translateY(-2px)',
  },
  sectionContent: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    background: 'white',
  },
  sectionTitle: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '20px',
    textAlign: 'center',
    borderBottom: '2px solid #3498db',
    paddingBottom: '10px',
  },
  controlGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '20px',
  },
  button: {
    padding: '12px 16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transform: 'translateY(0)',
  },
  primaryButton: {
    background: 'linear-gradient(45deg, #3498db, #2980b9)',
    color: 'white',
  },
  activeButton: {
    background: 'linear-gradient(45deg, #f39c12, #e67e22)',
    color: 'white',
    boxShadow: '0 0 10px rgba(243, 156, 18, 0.5)',
  },
  successButton: {
    background: 'linear-gradient(45deg, #2ecc71, #27ae60)',
    color: 'white',
  },
  warningButton: {
    background: 'linear-gradient(45deg, #f39c12, #e67e22)',
    color: 'white',
  },
  dangerButton: {
    background: 'linear-gradient(45deg, #e74c3c, #c0392b)',
    color: 'white',
  },
  buttonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  },
  disabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'none',
  },
  inputGroup: {
    marginBottom: '16px',
    padding: '15px',
    background: 'linear-gradient(145deg, #f8f9fa, #e9ecef)',
    borderRadius: '10px',
    border: '1px solid #dee2e6',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '2px solid #dee2e6',
    borderRadius: '6px',
    fontSize: '0.9rem',
    transition: 'border-color 0.3s ease',
    marginBottom: '8px',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    border: '2px solid #dee2e6',
    borderRadius: '6px',
    fontSize: '0.9rem',
    background: 'white',
    cursor: 'pointer',
  },
  algorithmControls: {
    background: 'linear-gradient(145deg, #fff3cd, #ffeaa7)',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '15px',
    border: '1px solid #ffc107',
  },
  stepLog: {
    background: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    padding: '12px',
    maxHeight: '150px',
    overflowY: 'auto',
    fontSize: '0.85rem',
    fontFamily: 'monospace',
    marginBottom: '15px',
  },
  speedControl: {
    marginBottom: '15px',
  },
  slider: {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    background: '#dee2e6',
    appearance: 'none',
    outline: 'none',
  },
  statsPanel: {
    background: 'linear-gradient(145deg, #d1ecf1, #bee5eb)',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '15px',
    border: '1px solid #17a2b8',
  },
  animationStatus: {
    background: 'linear-gradient(145deg, #d4edda, #c3e6cb)',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #28a745',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#155724',
  },
  legendBox: {
    position: 'fixed',
    top: '20px',
    left: '20px',
    background: 'rgba(255, 255, 255, 0.95)',
    border: '2px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    fontSize: '0.85rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 100,
    minWidth: '180px',
    marginLeft: '50px'
  },
  legendHeader: {
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#333',
    textAlign: 'center'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '4px',
    color: '#555'
  },
  legendDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    marginRight: '8px',
    border: '1px solid #333'
  }
};

const Graph = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(TABS.NORMAL);
  const [operationMessage, setOperationMessage] = useState('');
  const [operationPosition, setOperationPosition] = useState([0, 0, 0]);
  const [selectedStartNode, setSelectedStartNode] = useState('');
  const [algorithmSpeed, setAlgorithmSpeed] = useState(1);
  const [stepLog, setStepLog] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Graph store state
  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);
  const isDirected = useGraphStore((state) => state.isDirected);
  const isAnimating = useGraphStore((state) => state.isAnimating);
  const currentNode = useGraphStore((state) => state.currentNode);
  const selectedNodeForEdge = useGraphStore((state) => state.selectedNodeForEdge);

  // Graph store actions
  const addNode = useGraphStore((state) => state.addNode);
  const removeNode = useGraphStore((state) => state.removeNode);
  const addEdge = useGraphStore((state) => state.addEdge);
  const removeEdge = useGraphStore((state) => state.removeEdge);
  const toggleGraphType = useGraphStore((state) => state.toggleGraphType);
  const clearGraph = useGraphStore((state) => state.clearGraph);
  const resetVisualization = useGraphStore((state) => state.resetVisualization);
  const startBFS = useGraphStore((state) => state.startBFS);
  const startDFS = useGraphStore((state) => state.startDFS);
  const setAnimationSpeed = useGraphStore((state) => state.setAnimationSpeed);
  const setPaused = useGraphStore((state) => state.setPaused);
  const setSelectedNodeForEdge = useGraphStore((state) => state.setSelectedNodeForEdge);

  // Show animated operation message
  const showOperationMessage = (message, nodePosition = [0, 2, 0]) => {
    setOperationMessage(message);
    setOperationPosition(nodePosition);
    setTimeout(() => setOperationMessage(''), 3000);
  };

  // Enhanced operation handlers with animations
  const handleAddNode = () => {
    const newPosition = [Math.random() * 8 - 4, Math.random() * 4 - 2, 0];
    const nodeValue = nodes.length + 1;
    addNode(newPosition, nodeValue);
    showOperationMessage(`Node ${nodeValue} inserted`, newPosition);
  };

  const handleDeleteNode = () => {
    if (nodes.length === 0) return;
    const nodeToDelete = nodes[nodes.length - 1];
    removeNode(nodeToDelete.id);
    showOperationMessage(`Node ${nodeToDelete.value} deleted`, nodeToDelete.position);
  };

  const handleAddEdge = () => {
    if (nodes.length < 2) {
      showOperationMessage("Need at least 2 nodes to create an edge");
      return;
    }
    
    showOperationMessage("Click two nodes in sequence to create an edge");
  };

  const handleDeleteEdge = () => {
    if (edges.length === 0) return;
    const edgeToDelete = edges[edges.length - 1];
    const fromNode = nodes.find(n => n.id === edgeToDelete.from);
    const toNode = nodes.find(n => n.id === edgeToDelete.to);
    removeEdge(edgeToDelete.id);
    if (fromNode && toNode) {
      showOperationMessage(`Edge ${fromNode.value} → ${toNode.value} deleted`, fromNode.position);
    }
  };

  const addStepLog = (message) => {
    setStepLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleStartAlgorithm = async (algorithm) => {
    if (!selectedStartNode || isAnimating) return;
    
    const startNode = nodes.find(n => n.value.toString() === selectedStartNode);
    if (!startNode) return;

    setStepLog([]);
    setIsPlaying(true);
    setAnimationSpeed(algorithmSpeed); // Sync the speed with store
    addStepLog(`Starting ${algorithm.toUpperCase()} from node ${startNode.value}`);

    if (algorithm === 'bfs') {
      await startBFS(startNode.id);
    } else if (algorithm === 'dfs') {
      await startDFS(startNode.id);
    }

    setIsPlaying(false);
    addStepLog(`${algorithm.toUpperCase()} completed`);
  };

  const resetAlgorithm = () => {
    resetVisualization();
    setStepLog([]);
    setIsPlaying(false);
    setIsPaused(false);
  };

  // Render Normal Graph Operations Section
  const renderNormalOperations = () => (
    <div style={styles.sectionContent}>
      <h3 style={styles.sectionTitle}>Graph Building Operations</h3>
      
      <div style={styles.statsPanel}>
        <strong>Graph Statistics:</strong><br/>
        Nodes: {nodes.length} | Edges: {edges.length}<br/>
        Type: {isDirected ? 'Directed' : 'Undirected'}<br/>
        {selectedNodeForEdge && (
          <div style={{color: '#ff8800', fontWeight: 'bold', marginTop: '8px'}}>
            📍 First node selected. Click another node to create edge.
          </div>
        )}
      </div>

      <div style={styles.inputGroup}>
        <label><strong>Graph Type:</strong></label>
        <button 
          style={{
            ...styles.button,
            ...styles.warningButton,
            ...(isAnimating ? styles.disabled : {}),
            width: '100%',
            marginTop: '8px'
          }}
          onClick={toggleGraphType}
          disabled={isAnimating}
        >
          {isDirected ? '🔄 Switch to Undirected' : '🔄 Switch to Directed'}
        </button>
      </div>

      <div style={styles.inputGroup}>
        <label><strong>Node Operations:</strong></label>
        <div style={styles.controlGrid}>
          <button 
            style={{
              ...styles.button,
              ...styles.successButton,
              ...(isAnimating ? styles.disabled : {})
            }}
            onClick={handleAddNode}
            disabled={isAnimating}
          >
            ➕ Insert Node
          </button>
          
          <button 
            style={{
              ...styles.button,
              ...styles.dangerButton,
              ...(isAnimating || nodes.length === 0 ? styles.disabled : {})
            }}
            onClick={handleDeleteNode}
            disabled={isAnimating || nodes.length === 0}
          >
            ➖ Delete Node
          </button>
        </div>
      </div>

      <div style={styles.inputGroup}>
        <label><strong>Edge Operations:</strong></label>
        <div style={styles.controlGrid}>
          <button 
            style={{
              ...styles.button,
              ...styles.primaryButton,
              ...(isAnimating || nodes.length < 2 ? styles.disabled : {})
            }}
            onClick={handleAddEdge}
            disabled={isAnimating || nodes.length < 2}
          >
            🔗 Insert Edge
          </button>
          
          <button 
            style={{
              ...styles.button,
              ...styles.dangerButton,
              ...(isAnimating || edges.length === 0 ? styles.disabled : {})
            }}
            onClick={handleDeleteEdge}
            disabled={isAnimating || edges.length === 0}
          >
            ✂️ Delete Edge
          </button>
        </div>
      </div>

      <div style={styles.inputGroup}>
        <button 
          style={{
            ...styles.button,
            ...styles.dangerButton,
            ...(isAnimating ? styles.disabled : {}),
            width: '100%'
          }}
          onClick={() => {
            clearGraph();
            showOperationMessage('Graph cleared', [0, 0, 0]);
          }}
          disabled={isAnimating}
        >
          🗑️ Clear Graph
        </button>
      </div>

      <div style={styles.inputGroup}>
        <label><strong>Instructions:</strong></label>
        <ul style={{fontSize: '0.85rem', lineHeight: '1.4', margin: 0, paddingLeft: '20px'}}>
          <li><strong>Add Node:</strong> Click "Insert Node" button</li>
          <li><strong>Create Edge:</strong> Click any two nodes in sequence</li>
          <li><strong>Delete Node:</strong> Double-click the node</li>
          <li><strong>Delete Edge:</strong> Click the edge line</li>
          <li><strong>Move Node:</strong> Drag nodes to reposition</li>
          <li><strong>Graph Type:</strong> Toggle directed/undirected</li>
        </ul>
      </div>
    </div>
  );

  // Render DFS Visualization Section
  const renderDFSSection = () => (
    <div style={styles.sectionContent}>
      <h3 style={styles.sectionTitle}>DFS Traversal Visualization</h3>
      
      <div style={styles.algorithmControls}>
        <label><strong>Select Starting Node:</strong></label>
        <select 
          style={styles.select}
          value={selectedStartNode}
          onChange={(e) => setSelectedStartNode(e.target.value)}
          disabled={isAnimating}
        >
          <option value="">Choose starting node...</option>
          {nodes.map(node => (
            <option key={node.id} value={node.value}>
              Node {node.value}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.speedControl}>
        <label><strong>Animation Speed: {algorithmSpeed}x</strong></label>
        <input 
          type="range"
          min="0.5"
          max="3"
          step="0.5"
          value={algorithmSpeed}
          onChange={(e) => setAlgorithmSpeed(parseFloat(e.target.value))}
          style={styles.slider}
          disabled={isAnimating}
        />
      </div>

      <div style={styles.controlGrid}>
        <button 
          style={{
            ...styles.button,
            ...styles.successButton,
            ...(isAnimating || !selectedStartNode ? styles.disabled : {})
          }}
          onClick={() => handleStartAlgorithm('dfs')}
          disabled={isAnimating || !selectedStartNode}
        >
          ▶️ Start DFS
        </button>
        
        <button 
          style={{
            ...styles.button,
            ...styles.warningButton,
            ...(isAnimating ? {} : styles.disabled)
          }}
          onClick={() => setIsPaused(!isPaused)}
          disabled={!isAnimating}
        >
          {isPaused ? '▶️ Resume' : '⏸️ Pause'}
        </button>
        
        <button 
          style={{
            ...styles.button,
            ...styles.primaryButton,
          }}
          onClick={resetAlgorithm}
        >
          🔄 Reset
        </button>
        
        <button 
          style={{
            ...styles.button,
            ...styles.primaryButton,
            ...(isAnimating ? {} : styles.disabled)
          }}
          disabled={!isAnimating}
        >
          ⏭️ Next Step
        </button>
      </div>

      {stepLog.length > 0 && (
        <div style={styles.stepLog}>
          <strong>Step Log:</strong>
          {stepLog.slice(-10).map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      )}

      {isAnimating && activeTab === TABS.DFS && (
        <div style={styles.animationStatus}>
          🔄 DFS Algorithm Running...
        </div>
      )}

      <div style={styles.inputGroup}>
        <strong>DFS Algorithm:</strong>
        <div style={{fontSize: '0.85rem', fontFamily: 'monospace', background: '#f8f9fa', padding: '10px', borderRadius: '4px'}}>
          1. Start at selected node<br/>
          2. Mark current as visited (green)<br/>
          3. Push neighbors to stack (blue)<br/>
          4. Recursively visit unvisited neighbors<br/>
          5. Backtrack when no unvisited neighbors<br/>
          6. Complete nodes turn gray
        </div>
      </div>
    </div>
  );

  // Render BFS Visualization Section  
  const renderBFSSection = () => (
    <div style={styles.sectionContent}>
      <h3 style={styles.sectionTitle}>BFS Traversal Visualization</h3>
      
      <div style={styles.algorithmControls}>
        <label><strong>Select Starting Node:</strong></label>
        <select 
          style={styles.select}
          value={selectedStartNode}
          onChange={(e) => setSelectedStartNode(e.target.value)}
          disabled={isAnimating}
        >
          <option value="">Choose starting node...</option>
          {nodes.map(node => (
            <option key={node.id} value={node.value}>
              Node {node.value}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.speedControl}>
        <label><strong>Animation Speed: {algorithmSpeed}x</strong></label>
        <input 
          type="range"
          min="0.5"
          max="3"
          step="0.5"
          value={algorithmSpeed}
          onChange={(e) => setAlgorithmSpeed(parseFloat(e.target.value))}
          style={styles.slider}
          disabled={isAnimating}
        />
      </div>

      <div style={styles.controlGrid}>
        <button 
          style={{
            ...styles.button,
            ...styles.successButton,
            ...(isAnimating || !selectedStartNode ? styles.disabled : {})
          }}
          onClick={() => handleStartAlgorithm('bfs')}
          disabled={isAnimating || !selectedStartNode}
        >
          ▶️ Start BFS
        </button>
        
        <button 
          style={{
            ...styles.button,
            ...styles.warningButton,
            ...(isAnimating ? {} : styles.disabled)
          }}
          onClick={() => setIsPaused(!isPaused)}
          disabled={!isAnimating}
        >
          {isPaused ? '▶️ Resume' : '⏸️ Pause'}
        </button>
        
        <button 
          style={{
            ...styles.button,
            ...styles.primaryButton,
          }}
          onClick={resetAlgorithm}
        >
          🔄 Reset
        </button>
        
        <button 
          style={{
            ...styles.button,
            ...styles.primaryButton,
            ...(isAnimating ? {} : styles.disabled)
          }}
          disabled={!isAnimating}
        >
          ⏭️ Next Step
        </button>
      </div>

      {stepLog.length > 0 && (
        <div style={styles.stepLog}>
          <strong>Step Log:</strong>
          {stepLog.slice(-10).map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      )}

      {isAnimating && activeTab === TABS.BFS && (
        <div style={styles.animationStatus}>
          🔄 BFS Algorithm Running...
        </div>
      )}

      <div style={styles.inputGroup}>
        <strong>BFS Algorithm:</strong>
        <div style={{fontSize: '0.85rem', fontFamily: 'monospace', background: '#f8f9fa', padding: '10px', borderRadius: '4px'}}>
          1. Start with queue containing start node<br/>
          2. While queue not empty:<br/>
          &nbsp;&nbsp;a. Dequeue node (green)<br/>
          &nbsp;&nbsp;b. Enqueue unvisited neighbors (yellow)<br/>
          &nbsp;&nbsp;c. Mark as visited<br/>
          3. Complete nodes turn gray
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      
      {/* Left Taskbar */}
      <div style={styles.taskbar}>
        <div 
          style={styles.taskbarIcon} 
          onClick={() => navigate('/dashboard')} 
          title="Back to Dashboard"
          onMouseEnter={(e) => Object.assign(e.target.style, styles.taskbarIconHover)}
          onMouseLeave={(e) => Object.assign(e.target.style, styles.taskbarIcon)}
        >
          ⬅
        </div>
        <div 
          style={styles.taskbarIcon} 
          onClick={() => {
            clearGraph();
            resetVisualization();
            showOperationMessage('Everything cleared', [0, 0, 0]);
          }} 
          title="Clear Everything"
          onMouseEnter={(e) => Object.assign(e.target.style, styles.taskbarIconHover)}
          onMouseLeave={(e) => Object.assign(e.target.style, styles.taskbarIcon)}
        >
          🗑
        </div>
        <div 
          style={styles.taskbarIcon} 
          onClick={() => {
            resetVisualization();
            showOperationMessage('Visualization reset', [0, 0, 0]);
          }} 
          title="Reset Visualization"
          onMouseEnter={(e) => Object.assign(e.target.style, styles.taskbarIconHover)}
          onMouseLeave={(e) => Object.assign(e.target.style, styles.taskbarIcon)}
        >
          ↻
        </div>
      </div>

      {/* Working Area */}
      <div style={styles.workingArea}>
        <SceneSetup>
          <GraphCanvas />
          <AnimatedOperationLabel 
            message={operationMessage}
            position={operationPosition}
            onComplete={() => setOperationMessage('')}
          />
        </SceneSetup>
      </div>

      {/* Right Panel with Tabs */}
      <div style={styles.rightPanel}>
        
        {/* Tab Header */}
        <div style={styles.tabContainer}>
          <button 
            style={{
              ...styles.tab,
              ...(activeTab === TABS.NORMAL ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab(TABS.NORMAL)}
          >
            📊 Normal Graph
          </button>
          <button 
            style={{
              ...styles.tab,
              ...(activeTab === TABS.DFS ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab(TABS.DFS)}
          >
            🌳 DFS
          </button>
          <button 
            style={{
              ...styles.tab,
              ...(activeTab === TABS.BFS ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab(TABS.BFS)}
          >
            🌊 BFS
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === TABS.NORMAL && renderNormalOperations()}
        {activeTab === TABS.DFS && renderDFSSection()}
        {activeTab === TABS.BFS && renderBFSSection()}

      </div>

      {/* Front Legend Box */}
      <div style={styles.legendBox}>
        <div style={styles.legendHeader}>
          🎨 Node Colors        
        </div>
        <div style={styles.legendItem}>
          <span style={{...styles.legendDot, backgroundColor: '#44ff44'}}></span>
          Green: Visited
        </div>
        <div style={styles.legendItem}>
          <span style={{...styles.legendDot, backgroundColor: '#ffff44'}}></span>
          Yellow: In Queue (BFS)
        </div>
        <div style={styles.legendItem}>
          <span style={{...styles.legendDot, backgroundColor: '#4488ff'}}></span>
          Blue: In Stack (DFS)
        </div>
        <div style={styles.legendItem}>
          <span style={{...styles.legendDot, backgroundColor: '#888888'}}></span>
          Gray: Completed
        </div>
      </div>
    </div>
  );
};

export default Graph;