import React, { useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useGraphStore } from '../../../context/graphStore';
import GraphNode3D from './GraphNode3D';
import GraphEdge3D from './GraphEdge3D';

const GraphCanvas = () => {
  const canvasRef = useRef();
  const controlsRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  
  // Graph store state
  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);
  const isDirected = useGraphStore((state) => state.isDirected);
  const selectedNode = useGraphStore((state) => state.selectedNode);
  const selectedNodeForEdge = useGraphStore((state) => state.selectedNodeForEdge);
  const isAnimating = useGraphStore((state) => state.isAnimating);
  
  // Graph store actions
  const removeNode = useGraphStore((state) => state.removeNode);
  const removeEdge = useGraphStore((state) => state.removeEdge);
  const updateNodePosition = useGraphStore((state) => state.updateNodePosition);
  const setSelectedNode = useGraphStore((state) => state.setSelectedNode);
  const setSelectedNodeForEdge = useGraphStore((state) => state.setSelectedNodeForEdge);

  const handleCanvasClick = (event) => {
    if (isAnimating) return;
    event.stopPropagation();
    setSelectedNode(null);
    setSelectedNodeForEdge(null);
  };

  const handleNodeClick = (nodeId) => {
    if (isAnimating) return;
    setSelectedNodeForEdge(nodeId);
  };

  const handleNodeDoubleClick = (nodeId) => {
    if (isAnimating) return;
    removeNode(nodeId);
  };

  const handleNodeDrag = (nodeId, newPosition) => {
    if (isAnimating) return;
    updateNodePosition(nodeId, newPosition);
  };

  const handleNodeDragStart = (nodeId) => {
    setIsDragging(true);
    if (controlsRef.current) {
      controlsRef.current.enabled = false;
    }
  };

  const handleNodeDragEnd = (nodeId) => {
    setIsDragging(false);
    if (controlsRef.current) {
      controlsRef.current.enabled = true;
    }
  };

  const handleEdgeClick = (edgeId) => {
    if (isAnimating) return;
    removeEdge(edgeId);
  };

  const nodeMap = React.useMemo(() => {
    const map = new Map();
    nodes.forEach(node => map.set(node.id, node));
    return map;
  }, [nodes]);

  return (
    <group ref={canvasRef}>
      <OrbitControls 
        ref={controlsRef}
        makeDefault 
        enabled={!isDragging}
      />
      
      <mesh onClick={handleCanvasClick} visible={false} position={[0, 0, -5]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {edges.map(edge => {
        const fromNode = nodeMap.get(edge.from);
        const toNode = nodeMap.get(edge.to);
        
        return (
          <GraphEdge3D
            key={edge.id}
            edge={edge}
            fromNode={fromNode}
            toNode={toNode}
            isDirected={isDirected}
            onEdgeClick={handleEdgeClick}
          />
        );
      })}

      {nodes.map(node => (
        <GraphNode3D
          key={node.id}
          node={node}
          onNodeClick={handleNodeClick}
          onNodeDoubleClick={handleNodeDoubleClick}
          onDragStart={handleNodeDragStart}
          onDrag={handleNodeDrag}
          onDragEnd={handleNodeDragEnd}
          isSelected={selectedNode === node.id}
          isSelectedForEdge={selectedNodeForEdge === node.id}
        />
      ))}
    </group>
  );
};

export default GraphCanvas;
