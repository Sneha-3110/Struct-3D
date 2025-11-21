import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Line, Shadow } from '@react-three/drei';
import { useRbTreeStore } from '../../../context/redBlackTreeStore';

// --- 3D NODE COMPONENT ---
const RBNode3D = ({ position, value, color, highlight }) => {
  // Red or Black (Dark Grey)
  const baseColor = color === 'RED' ? '#ff4757' : '#2f3542'; 
  const emissiveColor = highlight ? '#ffdd59' : 'black'; 

  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={emissiveColor}
          emissiveIntensity={highlight ? 0.5 : 0}
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>
      <Text position={[0, 0, 0.6]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
        {value}
      </Text>
      <Shadow color="black" opacity={0.4} scale={[1.2, 1.2, 1]} position={[0, -0.6, 0]} rotation={[-Math.PI/2, 0, 0]} />
    </group>
  );
};

const StatusText = ({ text, position }) => {
    if (!text) return null;
    const pos = position ? [position[0], position[1] + 1.5, position[2]] : [0, 5, 0];
    return (
      <Text position={pos} fontSize={0.5} color="#333" anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="white">
        {text}
      </Text>
    );
};

const renderTree = (node, edges = [], nodes = [], highlightNode = null) => {
  if (!node) return { nodes, edges };

  nodes.push(
    <RBNode3D
      key={node.id}
      position={node.position}
      value={node.value}
      color={node.color}
      highlight={highlightNode === node}
    />
  );

  if (node.parent) {
    edges.push(
      <Line 
        key={`${node.parent.id}-${node.id}`} 
        points={[node.parent.position, node.position]} 
        color="#555" 
        lineWidth={2} 
      />
    );
  }

  renderTree(node.left, edges, nodes, highlightNode);
  renderTree(node.right, edges, nodes, highlightNode);
  return { nodes, edges };
};

// --- DICTIONARY ---
const algoDictionary = {
    default: {
      title: "Red-Black Tree Properties",
      desc: "A self-balancing BST.",
      code: `1. Root is Black.
2. No two Red nodes adjacent.
3. Every path has same number of Black nodes.`
    },
    insert: {
      title: "Insertion Algorithm",
      desc: "Inserts node as RED and fixes Double Red violations.",
      code: `1. Insert as RED.
2. If Parent Black: Done.
3. If Parent Red:
   - Uncle Red: Recolor Parent+Uncle Black, GP Red.
   - Uncle Black: Rotate Parent/GP.`
    },
    delete: {
      title: "Deletion Algorithm",
      desc: "Removes node and fixes Double Black violations.",
      code: `1. Perform BST Delete.
2. If deleted node was Red: Done.
3. If deleted node was Black (Double Black):
   - Sibling Red: Rotate Parent.
   - Sibling Black + Children Black: Recolor Sibling Red.
   - Sibling Black + One Red Child: Rotate Sibling/Parent.`
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

const RedBlackTree = () => {
  const navigate = useNavigate();
  const [val, setVal] = useState('');
  const [currentAlgo, setCurrentAlgo] = useState(algoDictionary.default);
  
  const { root, insert, deleteNode, resetTree, comparisonText, comparisonPos, isAnimating, highlightNode } = useRbTreeStore();
  const { nodes, edges } = renderTree(root, [], [], highlightNode);

  const handleAction = (algoKey, actionFn) => {
    setCurrentAlgo(algoDictionary[algoKey]);
    actionFn();
  };

  return (
    <div style={styles.container}>
      <div style={styles.taskbar}>
        <div style={styles.taskbarIcon} onClick={() => navigate('/dashboard')} title="Dashboard">⬅</div>
        <div style={styles.taskbarIcon} onClick={() => { resetTree(); setCurrentAlgo(algoDictionary.default); }} title="Reset">↻</div>
      </div>

      <div style={styles.workingArea}>
        <div style={{ position: 'absolute', top: 20, left: 20, color: '#999', fontWeight: 'bold', fontSize: '2rem', pointerEvents: 'none' }}>RB Tree Visualizer</div>
        <Canvas camera={{ position: [0, 5, 15], fov: 50 }} shadows>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 20, 10]} castShadow />
          <OrbitControls />
          {edges}
          {nodes}
          <StatusText text={comparisonText} position={comparisonPos} />
        </Canvas>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.descriptionSection}>
          <h3 style={styles.heading}>{currentAlgo.title}</h3>
          <p>{currentAlgo.desc}</p>
          <strong>Logic:</strong>
          <code style={styles.codeBlock}>{currentAlgo.code}</code>
        </div>

        <div style={styles.operationsSection}>
          <h3 style={styles.heading}>Controls</h3>
          <div style={styles.inputGroup}>
            <input 
              style={styles.input} 
              placeholder="Enter Value" 
              type="number" 
              value={val} 
              onChange={e => setVal(e.target.value)} 
            />
            <button 
              style={styles.button} 
              disabled={isAnimating}
              onClick={() => handleAction('insert', () => insert(Number(val)))}
            >
              Insert Node
            </button>
            <button 
              style={{...styles.button, background: '#ff4757'}} 
              disabled={isAnimating}
              onClick={() => handleAction('delete', () => deleteNode(Number(val)))}
            >
              Delete Node
            </button>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>
            Try: Insert 10, 20, 30, 15. <br/>
            Then: Delete 10 (Standard), Delete 20 (Complex Fix).
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedBlackTree;
