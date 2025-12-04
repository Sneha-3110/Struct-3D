import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Shadow } from '@react-three/drei';
import * as THREE from 'three';

const GraphNode3D = ({ 
  node, 
  onNodeClick, 
  onNodeDoubleClick, 
  onDragStart, 
  onDrag, 
  onDragEnd,
  isSelected = false,
  isSelectedForEdge = false 
}) => {
  const meshRef = useRef();
  const groupRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [dragOffset, setDragOffset] = useState(new THREE.Vector3());
  const [dragStartTime, setDragStartTime] = useState(0);
  const [dragStartPosition, setDragStartPosition] = useState({ x: 0, y: 0 });
  const { camera, gl } = useThree();

  // Color based on node state with enhanced colors
  const getNodeColor = () => {
    switch (node.state) {
      case 'current': return '#ff4444'; // Bright red for current node
      case 'visited': return '#00ff00'; // Bright green for visited
      case 'queued': return '#ffff00'; // Bright yellow for queued
      case 'stack': return '#4488ff'; // Bright blue for in stack
      case 'completed': return '#888888'; // Gray for completed
      default: return '#6366f1'; // Modern purple-blue for normal
    }
  };

  // Enhanced floating animation with different patterns per node (DISABLED for proper edge connection)
  useFrame((state) => {
    // Animation disabled to ensure edges connect properly to nodes
    // Keep nodes at their exact positions for proper edge alignment
    if (groupRef.current) {
      // Add subtle scale effect during dragging for visual feedback
      const targetScale = isDragging ? 1.1 : 1;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      // Position should remain at node.position exactly
    }
  });

  // Handle mouse events for dragging
  const handlePointerDown = (event) => {
    event.stopPropagation();
    event.preventDefault();
    
    // Capture the pointer to ensure we get all subsequent events
    event.target.setPointerCapture(event.pointerId);
    
    setDragStartTime(Date.now());
    setDragStartPosition({ x: event.clientX, y: event.clientY });
    gl.domElement.style.cursor = 'grabbing';
    
    // Store initial node position for smoother dragging
    const initialPos = new THREE.Vector3(...node.position);
    setDragOffset(initialPos);
    
    console.log('Node pointer down, starting drag for node:', node.value); // Debug log
    onDragStart?.(node.id);
  };

  const handlePointerMove = (event) => {
    if (dragStartTime > 0) {
      event.stopPropagation();
      event.preventDefault();
      
      // Check if we've moved enough distance to consider this a drag
      const deltaX = Math.abs(event.clientX - dragStartPosition.x);
      const deltaY = Math.abs(event.clientY - dragStartPosition.y);
      const dragThreshold = 5; // pixels
      
      if (!isDragging && (deltaX > dragThreshold || deltaY > dragThreshold)) {
        setIsDragging(true);
      }
      
      if (isDragging) {
        // Enhanced world position calculation for more accurate dragging
        const rect = gl.domElement.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Create a raycaster to find the new world position
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera({ x, y }, camera);
        
        // Project onto a plane at the node's current Z position for consistent movement
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -node.position[2]);
        const intersection = new THREE.Vector3();
        
        if (raycaster.ray.intersectPlane(plane, intersection)) {
          // Apply smooth constraints to keep nodes within reasonable bounds
          const maxDistance = 15; // Maximum distance from center
          const distance = intersection.length();
          
          if (distance > maxDistance) {
            intersection.normalize().multiplyScalar(maxDistance);
          }
          
          // Update position with the new calculated position
          onDrag?.(node.id, [intersection.x, intersection.y, node.position[2]]);
        }
      }
    }
  };

  const handlePointerUp = (event) => {
    event.stopPropagation();
    const wasJustClicked = dragStartTime > 0 && !isDragging;
    
    // Release pointer capture
    if (event.target.hasPointerCapture && event.target.hasPointerCapture(event.pointerId)) {
      event.target.releasePointerCapture(event.pointerId);
    }
    
    console.log('Pointer up on node:', node.value, 'wasJustClicked:', wasJustClicked); // Debug log
    
    // Reset drag state
    setIsDragging(false);
    setDragStartTime(0);
    setDragOffset(null);
    
    // Restore cursor with smooth transition
    gl.domElement.style.cursor = 'default';
    
    // Notify that dragging has ended
    onDragEnd?.(node.id);
    
    // If it was a quick click (not a drag), trigger click
    if (wasJustClicked) {
      onNodeClick?.(node.id);
    }
  };

  const handleClick = (event) => {
    event.stopPropagation();
    console.log('Click detected on node:', node.value); // Debug log
    // This is a backup for browsers that might not trigger pointerUp properly
    if (!isDragging) {
      onNodeClick?.(node.id);
    }
  };

  const handleDoubleClick = (event) => {
    event.stopPropagation();
    onNodeDoubleClick?.(node.id);
  };

  const handlePointerEnter = (event) => {
    event.stopPropagation();
    setIsHovering(true);
    gl.domElement.style.cursor = 'grab';
  };

  const handlePointerLeave = (event) => {
    event.stopPropagation();
    setIsHovering(false);
    if (!isDragging) {
      gl.domElement.style.cursor = 'default';
    }
  };

  // Ring effects for selection states
  const renderSelectionRing = () => {
    if (isSelectedForEdge) {
      return (
        <mesh position={[0, 0, 0]}>
          <ringGeometry args={[0.7, 0.8, 32]} />
          <meshBasicMaterial color="#ff8800" transparent opacity={0.8} />
        </mesh>
      );
    }
    if (isSelected) {
      return (
        <mesh position={[0, 0, 0]}>
          <ringGeometry args={[0.7, 0.8, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
      );
    }
    return null;
  };

  return (
    <group 
      position={node.position}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <group ref={groupRef}>
        {/* Selection ring */}
        {renderSelectionRing()}
        
        {/* Main node sphere */}
        <mesh 
          ref={meshRef}
          castShadow 
          receiveShadow
          onPointerDown={handlePointerDown}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
        >
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshPhysicalMaterial 
            color={getNodeColor()}
            roughness={isDragging ? 0.05 : (isHovering ? 0.1 : 0.2)}
            metalness={isDragging ? 0.7 : (isHovering ? 0.5 : 0.3)}
            clearcoat={isDragging ? 1.5 : 1}
            clearcoatRoughness={isDragging ? 0.05 : 0.1}
            transparent={node.state === 'queued' || isDragging}
            opacity={node.state === 'queued' ? 0.7 : (isDragging ? 0.9 : 1)}
            emissive={isDragging ? new THREE.Color(0x002244) : new THREE.Color(0x000000)}
            emissiveIntensity={isDragging ? 0.1 : 0}
          />
        </mesh>

        {/* Node label */}
        <Text 
          position={[0, 0.8, 0]} 
          fontSize={0.4} 
          color="black"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#ffffff"
          fontWeight="bold"
        >
          {node.value}
        </Text>

        {/* State indicator text */}
        {node.state !== 'normal' && (
          <Text 
            position={[0, -0.8, 0]} 
            fontSize={0.25} 
            color="black"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="#ffffff"
          >
            {node.state.toUpperCase()}
          </Text>
        )}
      </group>

      {/* Shadow - minimized for better edge connection appearance */}
      <Shadow
        color="black"
        colorStop={0}       
        opacity={0.1}      
        scale={[0.8, 0.8, 1]}
        position={[0, -0.1, 0]}
        rotation={[-Math.PI / 2, 0, 0]} 
      />
    </group>
  );
};

export default GraphNode3D;