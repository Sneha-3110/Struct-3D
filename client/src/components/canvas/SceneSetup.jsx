import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';

const SceneSetup = ({ children }) => {
  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      
      {/* The 3D Content goes here */}
      {children}
    </Canvas>
  );
};

export default SceneSetup;