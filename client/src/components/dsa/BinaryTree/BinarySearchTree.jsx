import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Line, Shadow } from '@react-three/drei';
import { useBstStore } from '../../../context/bstStore';

// --- 3D COMPONENTS ---
const Node = ({ position, value, highlight }) => (
  <group position={position}>
    <mesh castShadow receiveShadow>
      <sphereGeometry args={[0.4, 32, 32]} />
      <meshPhysicalMaterial
        color={highlight ? "#ff4757" : "#2ed573"} // Red if active, Green otherwise
        roughness={0.1}
        metalness={0.1}
        clearcoat={0.8}
      />
    </mesh>
    <Text position={[0, 0.6, 0]} fontSize={0.3} color="black" anchorX="center" anchorY="middle">
      {value}
    </Text>
    {/* Shadow for depth */}
    <Shadow color="black" opacity={0.3} scale={[1, 1, 1]} position={[0, -0.5, 0]} rotation={[-Math.PI/2, 0, 0]} />
  </group>
);

const Edge = ({ start, end }) => (
  <Line points={[start, end]} color="#555" lineWidth={2} />
);

const ComparisonText3D = ({ text, position }) => {
  if (!text || !position) return null;
  return (
    <Text position={[position[0], position[1] + 1.2, position[2]]} fontSize={0.4} color="#333" anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="white">
      {text}
    </Text>
  );
};

// Helper to flatten the tree into renderable arrays
const traverseAndRender = (node, edges = [], parent = null, nodes = [], highlightNode = null) => {
  if (!node) return { nodes, edges };

  nodes.push(
    <Node
      key={node.id || node.value}
      position={node.position}
      value={node.value}
      highlight={highlightNode?.value === node.value}
    />
  );

  if (parent) {
    edges.push(
      <Edge key={`${parent.value}-${node.value}`} start={parent.position} end={node.position} />
    );
  }

  traverseAndRender(node.left, edges, node, nodes, highlightNode);
  traverseAndRender(node.right, edges, node, nodes, highlightNode);
  return { nodes, edges };
};

// --- ALGORITHM DICTIONARY (For Right Panel) ---
const algoDictionary = {
    default: {
      title: "Binary Search Tree",
      desc: "A hierarchical data structure where each node has at most two children. The left child is smaller than the parent, and the right child is greater.",
      code: "Select an operation to see logic."
    },
    insert: {
      title: "Algorithm: Insertion",
      desc: "Places a new node in the correct position to maintain BST property.",
      code: `1. Start at Root.
2. If Value < Current, go Left.
3. If Value > Current, go Right.
4. If NULL, insert Node here.`
    },
    search: {
      title: "Algorithm: Search",
      desc: "Finds if a value exists in O(h) time.",
      code: `1. Compare Value with Root.
2. If Equal, Found!
3. If Value < Root, recurse Left.
4. If Value > Root, recurse Right.`
    },
    traversal: {
        title: "Algorithm: Traversal",
        desc: "Visiting all nodes in a specific order.",
        code: `Inorder: Left -> Root -> Right
Preorder: Root -> Left -> Right
Postorder: Left -> Right -> Root`
    }
};

const styles = {
    container: { display: 'flex', width: '100vw', height: '100vh', background: '#f0f2f5', fontFamily: '"Segoe UI", sans-serif', overflow: 'hidden' },
    taskbar: { width: '60px', background: '#2c3e50', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px', zIndex: 20, flexShrink: 0 },
    taskbarIcon: { width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px', cursor: 'pointer', fontSize: '1.2rem' },
    workingArea: { flex: 1, minWidth: 0, position: 'relative', background: '#dbeafe', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)' },
    rightPanel: { width: '350px', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #ccc', zIndex: 20, background: 'white', flexShrink: 0 },
    descriptionSection: { flex: '0 0 40%', background: '#fff9c4', padding: '20px', borderBottom: '1px solid #ddd', overflowY: 'auto' },
    operationsSection: { flex: 1, background: '#ffecb3', padding: '20px', overflowY: 'auto' },
    heading: { marginTop: 0, color: '#333', borderBottom: '2px solid #333', display: 'inline-block', marginBottom: '10px' },
    inputGroup: { marginBottom: '15px', background: 'rgba(255,255,255,0.5)', padding: '10px', borderRadius: '8px' },
    input: { width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' },
    button: { padding: '8px', border: 'none', borderRadius: '4px', cursor: 'pointer', background: '#007bff', color: 'white', fontWeight: 'bold', width: '100%', marginBottom: '5px' },
    codeBlock: { display: 'block', background: '#eee', padding: '10px', fontSize: '0.85rem', borderRadius: '4px', fontFamily: 'monospace', whiteSpace: 'pre-wrap', border: '1px solid #ddd' }
};

const BinarySearchTree = () => {
  const navigate = useNavigate();
  const [inputVal, setInputVal] = useState('');
  const [currentAlgo, setCurrentAlgo] = useState(algoDictionary.default);

  // Store Hooks
  const { root, highlightNode, comparisonText, comparisonPos, isAnimating, traversalResult, insert, deleteNode, search, startTraversal, resetTree } = useBstStore();

  // Generate 3D Objects
  const { nodes: renderedNodes, edges: renderedEdges } = traverseAndRender(root, [], null, [], highlightNode);

  const handleAction = (algoKey, actionFn) => {
      setCurrentAlgo(algoDictionary[algoKey] || algoDictionary.default);
      actionFn();
  };

  return (
    <div style={styles.container}>
      
      {/* 1. LEFT TASKBAR */}
      <div style={styles.taskbar}>
        <div style={styles.taskbarIcon} onClick={() => navigate('/dashboard')} title="Dashboard">⬅</div>
        <div style={styles.taskbarIcon} onClick={() => { resetTree(); setCurrentAlgo(algoDictionary.default); }} title="Reset">↻</div>
      </div>

      {/* 2. MIDDLE WORKING AREA */}
      <div style={styles.workingArea}>
        <div style={{ position: 'absolute', top: 20, left: 20, color: '#999', fontWeight: 'bold', fontSize: '2rem', pointerEvents: 'none' }}>BST Playground</div>
        
        <Canvas camera={{ position: [0, 2, 15], fov: 50 }} shadows>
          <ambientLight intensity={0.4} />
          <spotLight position={[10, 20, 10]} angle={0.3} penumbra={1} castShadow intensity={1} />
          <OrbitControls />
          
          {/* Render the Tree */}
          {renderedEdges}
          {renderedNodes}
          
          {/* Floating Text for comparisons */}
          <ComparisonText3D text={comparisonText} position={comparisonPos} />
        </Canvas>

        {/* Traversal Result Overlay */}
        {traversalResult.length > 0 && (
            <div style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.9)', padding: '15px 25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontWeight: 'bold', color: '#333' }}>
                Traversal: {traversalResult.join(" → ")}
            </div>
        )}
      </div>

      {/* 3. RIGHT PANEL */}
      <div style={styles.rightPanel}>
        
        {/* Description */}
        <div style={styles.descriptionSection}>
          <h3 style={styles.heading}>{currentAlgo.title}</h3>
          <p style={{fontSize: '0.9rem'}}>{currentAlgo.desc}</p>
          <strong>Logic:</strong>
          <code style={styles.codeBlock}>{currentAlgo.code}</code>
        </div>

        {/* Operations */}
        <div style={styles.operationsSection}>
          <h3 style={styles.heading}>Controls</h3>
          
          <div style={styles.inputGroup}>
             <input 
               style={styles.input} 
               placeholder="Enter Value (e.g. 42)" 
               value={inputVal} 
               onChange={(e) => setInputVal(e.target.value)} 
               type="number"
             />
             <button style={styles.button} disabled={isAnimating} onClick={() => handleAction('insert', () => insert(Number(inputVal)))}>
               Insert Node
             </button>
             <button style={{...styles.button, background: '#2ed573'}} disabled={isAnimating} onClick={() => handleAction('search', () => search(Number(inputVal)))}>
               Search Node
             </button>
             <button style={{...styles.button, background: '#ff4757'}} disabled={isAnimating} onClick={() => handleAction('insert', () => deleteNode(Number(inputVal)))}>
               Delete Node
             </button>
          </div>

          <div style={styles.inputGroup}>
             <strong style={{display:'block', marginBottom:'5px'}}>Traversals:</strong>
             <button style={{...styles.button, background: '#ffa502'}} disabled={isAnimating} onClick={() => handleAction('traversal', () => startTraversal('inorder'))}>
               Inorder (L-Root-R)
             </button>
             <button style={{...styles.button, background: '#ffa502'}} disabled={isAnimating} onClick={() => handleAction('traversal', () => startTraversal('preorder'))}>
               Preorder (Root-L-R)
             </button>
             <button style={{...styles.button, background: '#ffa502'}} disabled={isAnimating} onClick={() => handleAction('traversal', () => startTraversal('postorder'))}>
               Postorder (L-R-Root)
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BinarySearchTree;