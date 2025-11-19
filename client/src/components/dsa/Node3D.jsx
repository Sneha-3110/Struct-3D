import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Shadow } from '@react-three/drei';

const Node3D = ({ position, value, color = "blue" }) => {
  // We animate this group so the Sphere AND Text float together
  const groupRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // A gentle floating sine wave
    groupRef.current.position.y = Math.sin(t * 2) * 0.1;
  });

  return (
    <group position={position}>
      
      <group ref={groupRef}>
        
        {/* --- THE SPHERE --- */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.5, 64, 64]} />
          
          <meshPhysicalMaterial 
            color={color} 
            roughness={0}      // Very smooth (0 = mirror, 1 = matte)
            metalness={0.4}      // Slight metallic tint
            clearcoat={1}        // Adds a polished "clear coat" layer like a car
            clearcoatRoughness={0.1} 
            reflectivity={0.8}
          />
        </mesh>
    
        <Text 
          position={[0, 0.8, 0]} 
          fontSize={0.5} 
          color="black"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {value}
        </Text>
      </group>

      <Shadow
        color="black"
        colorStop={0}       
        opacity={0.3}      
        scale={[1.5, 1.5, 1]}
        position={[0, -0.8, 0]}
        rotation={[-Math.PI / 2, 0, 0]} 
      />

    </group>
  );
};

export default Node3D;