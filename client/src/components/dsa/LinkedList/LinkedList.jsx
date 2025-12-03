import React from 'react';
import { useDsaStore } from '../../../context/dsaStore';
import SceneSetup from '../../canvas/SceneSetup';
import Node3D from '../Node3D';

// Basic inline styles for the UI overlay
const uiStyles = {
  position: 'absolute',
  top: '20px',
  left: '20px',
  zIndex: 100,
  background: 'rgba(255, 255, 255, 0.8)',
  padding: '15px',
  borderRadius: '10px',
  fontFamily: 'sans-serif',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
};

const buttonStyles = {
  margin: '5px',
  padding: '8px 12px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  background: '#007bff',
  color: 'white'
};

const LinkedList = () => {
  // 1. Connect to the Zustand store
  const nodes = useDsaStore((state) => state.nodes);
  const addNode = useDsaStore((state) => state.addNode);
  const resetNodes = useDsaStore((state) => state.resetNodes);

  // 2. Helper function to calculate the 3D position for each node
  const getNodePosition = (index) => {
    const spacing = 2.0; // How far apart nodes are
    // This logic centers the array at [0,0,0]
    const xPos = index * spacing - ((nodes.length - 1) * spacing) / 2;
    return [xPos, 0, 0];
  };

  return (
    // Set container to full-screen
    <div style={{ width: '100vw', height: '100vh', background: '#f0f0f0' }}>
      
      {/* --- 2D UI OVERLAY --- */}
      <div style={uiStyles}>
        <h3>Struct3D: Linked List</h3>
        <p>Current Nodes: {nodes.length}</p>
        <button style={buttonStyles} onClick={() => addNode()}>
          Add Random Node
        </button>
        <button 
          style={{...buttonStyles, background: '#dc3545'}} 
          onClick={() => resetNodes()}>
          Reset
        </button>
      </div>

      {/* --- 3D CANVAS --- */}
      <SceneSetup>
        {/* 3. Map over the state and render 3D objects */}
        {nodes.map((node, index) => (
          <Node3D 
            key={node.id} // CRITICAL: Use the unique ID for React's key
            position={getNodePosition(index)} 
            value={node.value} 
          />
        ))}
      </SceneSetup>
    </div>
  );
};

export default LinkedList;