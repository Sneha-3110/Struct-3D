import React from 'react';
import { Text } from '@react-three/drei';

const BFSQueueVisualization = ({ queue, visitedNodes, currentNode, nodes }) => {
  if (!queue || queue.length === 0) return null;

  // Get node values for display
  const getNodeValue = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? node.value : nodeId;
  };

  return (
    <group position={[-8, 4, 0]}>
      {/* Queue Header */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.4}
        color="black"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        BFS Queue
      </Text>

      {/* Queue visualization */}
      {queue.map((nodeId, index) => (
        <group key={`queue-${nodeId}-${index}`} position={[index * 1.2, 0, 0]}>
          {/* Queue item box */}
          <mesh>
            <boxGeometry args={[1, 0.8, 0.1]} />
            <meshBasicMaterial 
              color={nodeId === currentNode ? '#ff4444' : '#ffff44'}
              transparent
              opacity={0.8}
            />
          </mesh>
          
          {/* Queue item text */}
          <Text
            position={[0, 0, 0.1]}
            fontSize={0.3}
            color="black"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            {getNodeValue(nodeId)}
          </Text>
        </group>
      ))}

      {/* Arrow showing direction */}
      <mesh position={[queue.length * 1.2 + 0.5, 0, 0]}>
        <coneGeometry args={[0.2, 0.5, 8]} />
        <meshBasicMaterial color="#666666" />
      </mesh>

      {/* Visited count */}
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.3}
        color="green"
        anchorX="center"
        anchorY="middle"
      >
        Visited: {visitedNodes.size}
      </Text>
    </group>
  );
};

const DFSStackVisualization = ({ stackHistory, currentNode, nodes }) => {
  if (!stackHistory || stackHistory.length === 0) return null;

  // Get current stack state (only 'enter' actions that haven't been 'exit'ed)
  const currentStack = [];
  const enterCount = new Map();
  
  stackHistory.forEach(item => {
    if (item.action === 'enter') {
      enterCount.set(item.nodeId, (enterCount.get(item.nodeId) || 0) + 1);
      if (enterCount.get(item.nodeId) === 1) {
        currentStack.push(item);
      }
    } else if (item.action === 'exit') {
      const exitCount = (enterCount.get(item.nodeId) || 0) - 1;
      enterCount.set(item.nodeId, exitCount);
      if (exitCount === 0) {
        // Remove from stack
        const index = currentStack.findIndex(s => s.nodeId === item.nodeId);
        if (index !== -1) {
          currentStack.splice(index, 1);
        }
      }
    }
  });

  // Get node values for display
  const getNodeValue = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? node.value : nodeId;
  };

  return (
    <group position={[8, 4, 0]}>
      {/* Stack Header */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.4}
        color="black"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        DFS Call Stack
      </Text>

      {/* Stack visualization (vertical) */}
      {currentStack.map((item, index) => (
        <group key={`stack-${item.nodeId}-${index}`} position={[0, -index * 0.9, 0]}>
          {/* Stack frame */}
          <mesh>
            <boxGeometry args={[1.5, 0.7, 0.1]} />
            <meshBasicMaterial 
              color={item.nodeId === currentNode ? '#ff4444' : '#44aaff'}
              transparent
              opacity={0.8}
            />
          </mesh>
          
          {/* Function call text */}
          <Text
            position={[0, 0.1, 0.1]}
            fontSize={0.25}
            color="black"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            dfs({getNodeValue(item.nodeId)})
          </Text>
          
          {/* Depth indicator */}
          <Text
            position={[0, -0.2, 0.1]}
            fontSize={0.2}
            color="#333"
            anchorX="center"
            anchorY="middle"
          >
            depth: {item.depth}
          </Text>
        </group>
      ))}

      {/* Stack pointer */}
      {currentStack.length > 0 && (
        <mesh position={[-1, 0, 0]}>
          <coneGeometry args={[0.15, 0.3, 8]} />
          <meshBasicMaterial color="#666666" />
        </mesh>
      )}

      {/* Stack depth counter */}
      <Text
        position={[0, -currentStack.length * 0.9 - 1, 0]}
        fontSize={0.3}
        color="blue"
        anchorX="center"
        anchorY="middle"
      >
        Stack Depth: {currentStack.length}
      </Text>
    </group>
  );
};

export { BFSQueueVisualization, DFSStackVisualization };