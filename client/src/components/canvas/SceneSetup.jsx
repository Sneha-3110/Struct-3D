import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';

const SceneSetup = ({ children }) => {
  return (
    <Canvas
      shadows 
      camera={{ position: [0, 5, 10], fov: 50 }}
      style={{ width: '100%', height: '100%' }}>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <spotLight 
        position={[10, 10, 10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={1}
        castShadow  
      />
      <Environment preset='night'/>
      <OrbitControls makeDefault/>
      {/* The 3D Content goes here */}
      {children}
    </Canvas>
  );
};

export default SceneSetup;