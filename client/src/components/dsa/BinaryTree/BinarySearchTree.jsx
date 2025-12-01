import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Line } from "@react-three/drei";

// 🌐 3D Node Component
const Node = ({ position, value, highlight }) => (
  <>
    <mesh position={position} castShadow receiveShadow>
      <sphereGeometry args={[0.4, 32, 32]} />
      <meshStandardMaterial
        color={highlight ? "red" : "skyblue"}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
    <Text
      position={[position[0], position[1] + 0.6, position[2]]}
      fontSize={0.3}
      color="black"
      anchorX="center"
      anchorY="middle"
    >
      {value}
    </Text>
  </>
);

// ➰ Edge Component
const Edge = ({ start, end }) => (
  <Line points={[start, end]} color="gray" lineWidth={2} />
);

// 🌲 Tree Node Class
class TreeNode {
  constructor(value, position) {
    this.value = value;
    this.position = position;
    this.left = null;
    this.right = null;
  }
}

// 🔍 Traverse and Generate Nodes & Edges
const traverseAndRender = (node, edges = [], parent = null, nodes = [], highlightNode = null) => {
  if (!node) return { nodes, edges };

  nodes.push(
    <Node
      key={node.value}
      position={node.position}
      value={node.value}
      highlight={highlightNode?.value === node.value}
    />
  );

  if (parent) {
    edges.push(
      <Edge key={`${parent.value}-${node.value}`} start={parent.position} end={node.position} />
    );
  }

  traverseAndRender(node.left, edges, node, nodes, highlightNode);
  traverseAndRender(node.right, edges, node, nodes, highlightNode);

  return { nodes, edges };
};

// 💬 3D Comparison Text
const ComparisonText3D = ({ text, position }) => {
  if (!text || !position) return null;
  const [x, y, z] = position;
  return (
    <Text
      position={[x, y + 1.2, z]}
      fontSize={0.4}
      color="black"
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  );
};

const BinarySearchTree = () => {
  const [values, setValues] = useState([]);
  const [root, setRoot] = useState(null);
  const [highlightNode, setHighlightNode] = useState(null);
  const [comparisonText, setComparisonText] = useState("");
  const [comparisonPos, setComparisonPos] = useState(null);
  const [inserting, setInserting] = useState(false);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // 🔁 Insertion with animation
  const insertWithAnimation = async (value) => {
    setInserting(true);

    const insertRecursively = async (node, depth = 0, x = 0, y = 0, z = 0, offset = 4) => {
      if (!node) {
        setHighlightNode(null);
        setComparisonText("");
        return new TreeNode(value, [x, y, z]);
      }

      setHighlightNode(node);
      setComparisonPos(node.position);

      setComparisonText(`${value} < ${node.value}`);
      await sleep(1000);

      if (value < node.value) {
        setComparisonText(`${value} < ${node.value} ✅`);
        await sleep(1000);
        const newX = x - offset / (depth + 1);
        const newY = y - 2;
        node.left = await insertRecursively(node.left, depth + 1, newX, newY, z, offset);
      } else {
        setComparisonText(`${value} < ${node.value} ❌`);
        await sleep(1000);
        setComparisonText(`${value} > ${node.value}`);
        await sleep(1000);
        setComparisonText(`${value} > ${node.value} ✅`);
        await sleep(1000);
        const newX = x + offset / (depth + 1);
        const newY = y - 2;
        node.right = await insertRecursively(node.right, depth + 1, newX, newY, z, offset);
      }

      return node;
    };

    const updatedRoot = await insertRecursively(root);
    setRoot(updatedRoot);
    setHighlightNode(null);
    setComparisonText("");
    setComparisonPos(null);
    setValues((prev) => [...prev, value]);
    setInserting(false);
  };

  const handleInsert = () => {
    const input = document.getElementById("nodeInput").value;
    const num = parseInt(input);
    if (!isNaN(num) && !values.includes(num) && !inserting) {
      insertWithAnimation(num);
      document.getElementById("nodeInput").value = "";
    }
  };

  // 🧹 Deletion with animation
  const deleteNodeWithAnimation = async (valueToDelete) => {
    setInserting(true);

    const deleteRecursively = async (node, targetValue) => {
      if (!node) {
        setComparisonText("Node not found");
        await sleep(1000);
        return null;
      }
    
      setHighlightNode(node);
      setComparisonPos(node.position);
    
      if (targetValue < node.value) {
        setComparisonText(`${targetValue} < ${node.value} ✅`);
        await sleep(1000);
        node.left = await deleteRecursively(node.left, targetValue);
      } else if (targetValue > node.value) {
        setComparisonText(`${targetValue} > ${node.value} ✅`);
        await sleep(1000);
        node.right = await deleteRecursively(node.right, targetValue);
      } else {
        setComparisonText(`${targetValue} == ${node.value} ✅ Deleting...`);
        await sleep(1000);
    
        // Case 1: No children
        if (!node.left && !node.right) {
          return null;
        }
    
        // Case 2: One child
        if (!node.left || !node.right) {
          const child = node.left || node.right;
          setComparisonText("One child - moving up");
          await sleep(1000);
          // Move child to current node's position
          child.position = [...node.position];
          return child;
        }
    
        // Case 3: Two children
        let successorParent = node;
        let successor = node.right;
    
        while (successor.left) {
          successorParent = successor;
          successor = successor.left;
        }
    
        setComparisonText(`Replacing with inorder successor: ${successor.value}`);
        await sleep(1000);
    
        // Replace current node's value
        node.value = successor.value;
    
        // Now delete the actual successor node
        if (successorParent !== node) {
          successorParent.left = await deleteRecursively(successorParent.left, successor.value);
        } else {
          successorParent.right = await deleteRecursively(successorParent.right, successor.value);
        }
      }
    
      return node;
    };
    

    const updatedRoot = await deleteRecursively(root, valueToDelete);
    setRoot(updatedRoot);
    setValues((prev) => prev.filter((v) => v !== valueToDelete));
    setHighlightNode(null);
    setComparisonText("");
    setComparisonPos(null);
    setInserting(false);
  };

  const result = traverseAndRender(root, [], null, [], highlightNode);
  const nodes = result.nodes || [];
  const edges = result.edges || [];

  const searchWithAnimation = async (targetValue) => {
    if (!root || inserting) return;
  
    setInserting(true);
  
    const searchRecursively = async (node) => {
      if (!node) {
        setComparisonText("Not Found");
        await sleep(1000);
        setHighlightNode(null);
        setComparisonPos(null);
        return;
      }
  
      setHighlightNode(node);
      setComparisonPos(node.position);
      await sleep(1000);
  
      if (targetValue === node.value) {
        setComparisonText(`${targetValue} == ${node.value} ✅ Found`);
        await sleep(1000);
        return;
      }
  
      if (targetValue < node.value) {
        setComparisonText(`${targetValue} < ${node.value} ✅`);
        await sleep(1000);
        await searchRecursively(node.left);
      } else {
        setComparisonText(`${targetValue} > ${node.value} ✅`);
        await sleep(1000);
        await searchRecursively(node.right);
      }
    };
  
    await searchRecursively(root);
    setHighlightNode(null);
    setComparisonText("");
    setComparisonPos(null);
    setInserting(false);
  };
  
  const [preorderResult, setPreorderResult] = useState([]);

  const preorderTraversal = async () => {
    if (!root || inserting) return;
    setInserting(true);
    const visited = [];
  
    const traverse = async (node) => {
      if (!node) return;
  
      setHighlightNode(node);
      setComparisonPos(node.position);
      setComparisonText(`Visit: ${node.value}`);
      visited.push(node.value);
      await sleep(1000);
  
      await traverse(node.left);
      await traverse(node.right);
    };
  
    await traverse(root);
    setComparisonText("Traversal Complete");
    setPreorderResult(visited); // ← Set result to show below tree
    await sleep(1000);
    setHighlightNode(null);
    setComparisonText("");
    setComparisonPos(null);
    setInserting(false);
  };
  
  const [postorderResult, setPostorderResult] = useState([]);

  const postorderTraversal = async () => {
    if (!root || inserting) return;
    setInserting(true);
    const visited = [];
  
    const traverse = async (node) => {
      if (!node) return;

      await traverse(node.left);
      await traverse(node.right);
      await sleep(1000);
      setHighlightNode(node);
      setComparisonPos(node.position);
      setComparisonText(`Visit: ${node.value}`);
      visited.push(node.value);
      
    };
  
    await traverse(root);
    setComparisonText("Traversal Complete");
    setPostorderResult(visited); // ← Set result to show below tree
    await sleep(1000);
    setHighlightNode(null);
    setComparisonText("");
    setComparisonPos(null);
    setInserting(false);
  };

  const [inorderResult, setInorderResult] = useState([]);
  const inorderTraversal = async () => {
    if (!root || inserting) return;
    setInserting(true);
    const visited = [];
  
    const traverse = async (node) => {
      if (!node) return;

      await traverse(node.left);
      
      await sleep(1000);
      setHighlightNode(node);
      setComparisonPos(node.position);
      setComparisonText(`Visit: ${node.value}`);
      visited.push(node.value);
      await sleep(1000);
      await traverse(node.right);
      
    };
  
    await traverse(root);
    setComparisonText("Traversal Complete");
    setInorderResult(visited); // ← Set result to show below tree
    await sleep(1000);
    setHighlightNode(null);
    setComparisonText("");
    setComparisonPos(null);
    setInserting(false);
  };

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      {/* 💻 UI Panel */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 1,
          background: "white",
          // color: white,
          padding: 12,
          borderRadius: 8,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <div>
          <input id="nodeInput" type="number" placeholder="Insert value" />
          <button onClick={handleInsert} disabled={inserting}>
            Insert
          </button>
        </div>
        <div>
          <input id="deleteInput" type="number" placeholder="Delete value" />
          <button
            onClick={() => {
              const val = parseInt(document.getElementById("deleteInput").value);
              if (!isNaN(val) && values.includes(val) && !inserting) {
                deleteNodeWithAnimation(val);
                document.getElementById("deleteInput").value = "";
              }
            }}
            disabled={inserting}
          >
            Delete
          </button>
        </div>
        <div>
          <input id="searchInput" type="number" placeholder="Search value" />
            <button
              onClick={() => {
              const val = parseInt(document.getElementById("searchInput").value);
              if (!isNaN(val) && !inserting) {
                searchWithAnimation(val);
                document.getElementById("searchInput").value = "";
              }
            }}
            disabled={inserting}
          >
          Search
        </button>
      </div>
          
      <div>
  <button onClick={preorderTraversal} disabled={inserting}>
    Preorder Traversal
  </button>
  <button onClick={postorderTraversal} disabled={inserting}>
    Postorder Traversal
  </button>
  <button onClick={inorderTraversal} disabled={inserting}>
    Inorder Traversal
  </button>
</div>

      </div>

      {/* 🌌 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 15], fov: 50 }} shadows>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <OrbitControls />
        {edges}
        {nodes}
        <ComparisonText3D text={comparisonText} position={comparisonPos} />
      </Canvas>

      {preorderResult.length > 0 && (
  <div style={{
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(255, 255, 255, 0.9)",
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
  }}>
    Preorder Traversal: {preorderResult.join(" → ")}
  </div>
)}

{postorderResult.length > 0 && (
  <div style={{
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(255, 255, 255, 0.9)",
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
  }}>
    Postorder Traversal: {postorderResult.join(" → ")}
  </div>
)}

{inorderResult.length > 0 && (
  <div style={{
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(255, 255, 255, 0.9)",
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
  }}>
    Inorder Traversal: {inorderResult.join(" → ")}
  </div>
)}

    </div>
  );
};

export default BinarySearchTree;