import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

const Node3D = ({ position, value, color = "orange" }) => {
  const meshRef = useRef();

  // Optional: Add gentle floating animation
  useFrame((state) => {
    meshRef.current.position.y += Math.sin(state.clock.elapsedTime) * 0.002;
  });

  return (
    <group position={position}>
      {/* The Node Body */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* The Text Value */}
      <Text position={[0, 0.8, 0]} fontSize={0.5} color="black">
        {value}
      </Text>
    </group>
  );
};

export default Node3D;