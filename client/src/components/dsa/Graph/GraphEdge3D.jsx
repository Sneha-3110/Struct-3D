import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

const GraphEdge3D = ({ edge, fromNode, toNode, isDirected = false, onEdgeClick }) => {
  const groupRef = useRef();
  const arrowRef = useRef();

  if (!fromNode || !toNode) return null;

  const start = new THREE.Vector3(...fromNode.position);
  const end = new THREE.Vector3(...toNode.position);
  
  // Calculate direction and distance
  const direction = new THREE.Vector3().subVectors(end, start);
  const distance = direction.length();
  
  if (distance === 0) return null; // Prevent division by zero
  
  direction.normalize();

  // Adjust start and end points to connect at node surfaces (radius = 0.5)
  const nodeRadius = 0.5;
  const adjustedStart = start.clone().add(direction.clone().multiplyScalar(nodeRadius));
  const adjustedEnd = end.clone().sub(direction.clone().multiplyScalar(nodeRadius));

  // Color based on edge state
  const getEdgeColor = () => {
    switch (edge.state) {
      case 'highlighted': return '#ffaa00'; // Orange for highlighted
      case 'traversed': return '#888888'; // Gray for traversed
      default: return '#333333'; // Dark gray for normal (more visible)
    }
  };

  // Pulsing animation for highlighted edges
  useFrame((state) => {
    if (edge.state === 'highlighted' && groupRef.current) {
      const t = state.clock.elapsedTime;
      const scale = 1 + Math.sin(t * 8) * 0.2;
      groupRef.current.scale.setScalar(scale);
    } else if (groupRef.current) {
      groupRef.current.scale.setScalar(1);
    }
  });

  // Calculate arrow position and rotation for directed edges
  const getArrowTransform = () => {
    const arrowPosition = new THREE.Vector3().lerpVectors(adjustedStart, adjustedEnd, 0.8);
    
    // Calculate proper rotation for arrow to point in edge direction
    const up = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(up, direction);
    
    return { position: arrowPosition, quaternion };
  };

  const arrowTransform = isDirected ? getArrowTransform() : null;

  const handleClick = (event) => {
    event.stopPropagation();
    onEdgeClick?.(edge.id);
  };

  return (
    <group ref={groupRef}>
      {/* Main edge as Line */}
      <Line
        points={[adjustedStart, adjustedEnd]}
        color={getEdgeColor()}
        lineWidth={edge.state === 'highlighted' ? 8 : 4}
        transparent
        opacity={edge.state === 'traversed' ? 0.4 : 1}
        onClick={handleClick}
      />

      {/* Arrow for directed edges */}
      {isDirected && arrowTransform && (
        <mesh
          ref={arrowRef}
          position={arrowTransform.position}
          quaternion={arrowTransform.quaternion}
          onClick={handleClick}
        >
          <coneGeometry args={[0.15, 0.3, 8]} />
          <meshStandardMaterial 
            color={getEdgeColor()}
            transparent
            opacity={edge.state === 'traversed' ? 0.4 : 1}
          />
        </mesh>
      )}
    </group>
  );
};

export default GraphEdge3D;