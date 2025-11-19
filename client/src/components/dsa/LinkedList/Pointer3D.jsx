import React from 'react';

const Pointer3D = ({ start, end }) => {
  // Calculate the midpoint between the two nodes to place the arrow
  const midX = (start[0] + end[0]) / 2;
  const midY = (start[1] + end[1]) / 2;
  const midZ = (start[2] + end[2]) / 2;

  // Calculate distance to stretch the arrow correctly
  const distance = Math.abs(end[0] - start[0]); 

  // We subtract a bit (0.8) so the arrow doesn't go inside the spheres
  const arrowLength = Math.max(0, distance - 1.0); 

  return (
    <group position={[midX, midY, midZ]}>
      {/* The Line/Stick */}
      <mesh rotation={[0, 0, -Math.PI / 2]}> 
        <cylinderGeometry args={[0.05, 0.05, arrowLength, 8]} />
        <meshStandardMaterial color="#888" />
      </mesh>

      {/* The Arrowhead (Cone) */}
      <mesh position={[arrowLength / 2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.15, 0.3, 16]} />
        <meshStandardMaterial color="#888" />
      </mesh>
    </group>
  );
};

export default Pointer3D;