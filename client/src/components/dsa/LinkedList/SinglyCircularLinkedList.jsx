import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScllStore } from '../../../context/scllStore';
import SceneSetup from '../../../components/canvas/SceneSetup';
import Node3D from '../../../components/dsa/Node3D';
import Pointer3D from '../../dsa/LinkedList/Pointer3D'; // Standard pointer
import { QuadraticBezierLine, Text } from '@react-three/drei';

// --- SPECIAL COMPONENT: The Circular "Wrap-Around" Arrow ---
const ReturnPointer = ({ start, end }) => {
  // 1. Calculate the dip point (midpoint below the list)
  const midX = (start[0] + end[0]) / 2;
  const midY = -3;
  const mid = [midX, midY, 0]; 

  // 2. Calculate Arrow Rotation (math to make it point towards the head node)
  // We look at the vector from the "mid" point to the "end" point
  const dx = end[0] - midX;
  const dy = end[1] - midY;
  const angle = Math.atan2(dy, dx); // Angle of approach
  const rotationZ = angle - Math.PI / 2; // Adjust because Cone points UP by default

  // 3. Position the arrow slightly before the center of the node so it touches the surface
  // The node has radius ~0.5. We nudge the arrow back slightly.
  const arrowPos = [
      end[0] - Math.cos(angle) * 0.6, 
      end[1] - Math.sin(angle) * 0.6, 
      0
  ];

  return (
    <group>
      {/* The Curved Line */}
      <QuadraticBezierLine
        start={start}
        end={end}
        mid={mid}
        color="#ff9f43" 
        lineWidth={2}
        dashed={true}
        dashScale={5} 
      />
      
      {/* THE MISSING ARROW HEAD */}
      <mesh position={arrowPos} rotation={[0, 0, rotationZ]}>
        <coneGeometry args={[0.1, 0.3, 16]} />
        <meshStandardMaterial color="#ff9f43" />
      </mesh>
    </group>
  );
};

// --- MAIN PAGE COMPONENT ---
const SinglyCircularLinkedList = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');

  // 1. AI & LANGUAGE STATE
  const [algoInfo, setAlgoInfo] = useState({
    title: "Singly Circular Linked List",
    desc: "A linked list where the last node points back to the first node, forming a circle. There is no NULL at the end.",
    code: "// Select an operation to see code",
    complexity: "-"
  });
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("Pseudocode");
  const [currentOp, setCurrentOp] = useState(null);

  // 2. STORE CONNECTION
  const { nodes, insertHead, insertTail, deleteHead, deleteTail, resetNodes, highlightNodeId, statusText, isAnimating } = useScllStore();

  // 3. FETCH FUNCTION
  const fetchExplanation = async (operation, selectedLang) => {
    setLoading(true);
    const langToSend = selectedLang || language; 

    setAlgoInfo({ 
      title: "Thinking...", 
      desc: `Generating ${langToSend} explanation for ${operation}...`, 
      code: "...", 
      complexity: "..." 
    });

    try {
      const response = await fetch('http://localhost:5000/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: "Singly Circular Linked List", 
          operation: operation,
          language: langToSend 
        })
      });
      const data = await response.json();
      setAlgoInfo(data);
    } catch (error) {
      setAlgoInfo({ title: "Error", desc: "AI Server unreachable.", code: "", complexity: "" });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (opName, actionFn) => {
    actionFn(); 
    setCurrentOp(opName);
    fetchExplanation(opName, language); 
  };

  const onLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    if (currentOp) fetchExplanation(currentOp, newLang);
  };

  const getNodePosition = (index) => {
    const spacing = 3.0;
    const xPos = index * spacing - ((nodes.length - 1) * spacing) / 2;
    return [xPos, 0, 0];
  };

  return (
    <div style={styles.container}>
      
      {/* TASKBAR */}
      <div style={styles.taskbar}>
        <div style={styles.taskbarIcon} onClick={() => navigate('/data-structure/linked-list')} title="Linked List">⬅</div>
        <div style={styles.taskbarIcon} onClick={resetNodes} title="Reset">↻</div>
      </div>

      {/* WORKING AREA */}
      <div style={styles.workingArea}>
        <div style={{ position: 'absolute', top: 20, left: 20, color: '#999', fontSize: '2rem', fontWeight: 'bold', pointerEvents: 'none', zIndex: 10 }}>Singly Circular Linked List</div>
        <SceneSetup>
          {nodes.map((node, index) => {
            const position = getNodePosition(index);
            const nextPosition = index < nodes.length - 1 ? getNodePosition(index + 1) : null;
            
            // Special Logic: If it's the LAST node, connect back to FIRST node
            const isLastNode = index === nodes.length - 1;
            const firstNodePos = getNodePosition(0);

            const isHighlighted = node.id === highlightNodeId;
            const nodeColor = isHighlighted ? "#e74c3c" : "#1abc9c";

            return (
              <React.Fragment key={node.id}>
                {/* Node */}
                <Node3D position={position} value={node.value} color={nodeColor} /> {/* Teal Color */}
                
                {/* Standard Pointer to Next Node */}
                {nextPosition && <Pointer3D start={position} end={nextPosition} />}
                
                {/* Circular Return Pointer (Only for Last Node) */}
                {isLastNode && nodes.length > 1 && (
                    <ReturnPointer start={position} end={firstNodePos} />
                )}
              </React.Fragment>
            );
          })}
        </SceneSetup>
      </div>

      {/* RIGHT PANEL */}
      <div style={styles.rightPanel}>
        <div style={styles.descriptionSection}>
           {loading ? (
             <div style={{textAlign: 'center', marginTop: '20px'}}>✨ Generating...</div>
           ) : (
             <>
               <h3 style={styles.heading}>{algoInfo.title}</h3>
               <p>{algoInfo.desc}</p>
               <div style={{fontSize: '0.8rem', fontWeight: 'bold', margin: '10px 0', color: '#555'}}>{algoInfo.complexity}</div>
               
               {/* Language Dropdown */}
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', marginBottom: '5px' }}>
                 <strong>Implementation:</strong>
                 <select 
                   value={language} 
                   onChange={onLanguageChange}
                   style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer', outline: 'none' }}
                 >
                   <option value="Pseudocode">Pseudocode</option>
                   <option value="Python">Python</option>
                   <option value="Java">Java</option>
                   <option value="C++">C++</option>
                 </select>
               </div>

               <code style={styles.codeBlock}>{algoInfo.code}</code>
             </>
           )}
        </div>

        {/* Controls */}
        <div style={styles.operationsSection}>
          <h3 style={styles.heading}>Operations</h3>
          <div style={styles.inputGroup}>
            <input 
              style={styles.input} 
              placeholder="Value" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
            />
            <button style={styles.button} onClick={() => handleAction('Insert at Head', () => insertHead(inputValue || 0))}
                disabled={isAnimating}
            >
              Insert Head
            </button>
            <button style={styles.button} onClick={() => handleAction('Insert at Tail', () => insertTail(inputValue || 0))}
                disabled={isAnimating}
            >
              Insert Tail
            </button>
            <button style={{...styles.button, background: '#dc3545'}} onClick={() => handleAction('Delete Head', deleteHead)}
                disabled={isAnimating}    
            >
              Delete Head
            </button>
            <button style={{...styles.button, background: '#dc3545'}} onClick={() => handleAction('Delete Tail', deleteTail)}
                disabled={isAnimating}    
            >
              Delete Tail
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- STYLES (Standardized) ---
const styles = {
  container: { display: 'flex', width: '100vw', height: '100vh', background: '#f0f2f5', fontFamily: 'Segoe UI, sans-serif', overflow: 'hidden' },
  taskbar: { width: '60px', background: '#2c3e50', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px', zIndex: 20, flexShrink: 0 },
  taskbarIcon: { width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px', cursor: 'pointer', fontSize: '1.2rem' },
  workingArea: { flex: 1, minWidth: 0, position: 'relative', background: '#dbeafe', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)' },
  rightPanel: { width: '350px', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #ccc', zIndex: 20, background: 'white', flexShrink: 0 },
  descriptionSection: { flex: '0 0 45%', background: '#fff9c4', padding: '20px', borderBottom: '1px solid #ddd', overflowY: 'auto' },
  operationsSection: { flex: 1, background: '#ffecb3', padding: '20px', overflowY: 'auto' },
  heading: { marginTop: 0, color: '#333', borderBottom: '2px solid #333', display: 'inline-block', marginBottom: '10px' },
  inputGroup: { marginBottom: '15px', background: 'rgba(255,255,255,0.5)', padding: '10px', borderRadius: '8px' },
  input: { width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' },
  button: { padding: '8px', border: 'none', borderRadius: '4px', cursor: 'pointer', background: '#007bff', color: 'white', fontWeight: 'bold', width: '100%', marginBottom: '5px' },
  codeBlock: { display: 'block', background: '#eee', padding: '10px', fontSize: '0.85rem', borderRadius: '4px', fontFamily: 'monospace', whiteSpace: 'pre-wrap', border: '1px solid #ddd' }
};

export default SinglyCircularLinkedList;