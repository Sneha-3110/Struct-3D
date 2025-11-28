import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDllStore } from '../../../context/dllStore';
import SceneSetup from '../../../components/canvas/SceneSetup';
import Node3D from '../../../components/dsa/Node3D';
import { Shadow } from '@react-three/drei';

// --- 3D COMPONENTS ---

// A special pointer that shows TWO arrows (Forward and Backward)
const BidirectionalPointer = ({ start, end }) => {
  const midX = (start[0] + end[0]) / 2;
  // Offset arrows slightly so they don't overlap
  const topY = 0.2; 
  const botY = -0.2;
  const distance = Math.abs(end[0] - start[0]) - 1.0; 

  return (
    <group>
      {/* Forward Arrow (Top) */}
      <group position={[midX, topY, 0]}>
        <mesh rotation={[0, 0, -Math.PI / 2]}> 
          <cylinderGeometry args={[0.03, 0.03, distance, 8]} />
          <meshStandardMaterial color="#007bff" /> {/* Blue for Next */}
        </mesh>
        <mesh position={[distance / 2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.08, 0.2, 16]} />
          <meshStandardMaterial color="#007bff" />
        </mesh>
      </group>

      {/* Backward Arrow (Bottom) */}
      <group position={[midX, botY, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}> 
          <cylinderGeometry args={[0.03, 0.03, distance, 8]} />
          <meshStandardMaterial color="#ff4757" /> {/* Red for Prev */}
        </mesh>
        <mesh position={[-distance / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.08, 0.2, 16]} />
          <meshStandardMaterial color="#ff4757" />
        </mesh>
      </group>
    </group>
  );
};

// --- MAIN PAGE COMPONENT ---
const DoublyLinkedList = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');

  // 1. AI STATE
  const [algoInfo, setAlgoInfo] = useState({
    title: "Doubly Linked List",
    desc: "A linked list where each node has two pointers: one to the next node and one to the previous node.",
    code: "// Select an operation to see code",
    complexity: "-"
  });
  const [loading, setLoading] = useState(false);

  const [language, setLanguage] = useState("Pseudocode");
  const [currentOp, setCurrentOp] = useState(null);

  // 2. STORE CONNECTION
  const { nodes, insertHead, insertTail, deleteHead, deleteTail, resetNodes } = useDllStore();

  // 3. GEMINI API FETCH FUNCTION
  // This is the key function you can copy to ALL your data structure pages
  
  const fetchExplanation = async (operation, selectedLang) => {
    setLoading(true);
    // Determine language to use (passed arg OR current state)
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
          topic: "Doubly Linked List",
          operation: operation,
          language: langToSend // <--- Dynamic Language
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

  // 4. ACTION HANDLER
  const handleAction = (opName, actionFn) => {
    actionFn(); 
    setCurrentOp(opName); // Remember this operation
    fetchExplanation(opName, language); // Fetch using current language
  };

  const onLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    
    // If we have an active operation, re-fetch immediately in the new language
    if (currentOp) {
      fetchExplanation(currentOp, newLang);
    }
  };

  const getNodePosition = (index) => {
    const spacing = 3.5; // Wider spacing for double arrows
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
        <div style={{ position: 'absolute', top: 20, left: 20, color: '#999', fontSize: '2rem', fontWeight: 'bold' }}>Doubly Linked List</div>
        <SceneSetup>
          {nodes.map((node, index) => {
            const position = getNodePosition(index);
            const nextPosition = index < nodes.length - 1 ? getNodePosition(index + 1) : null;
            return (
              <React.Fragment key={node.id}>
                <Node3D position={position} value={node.value} color="#8e44ad" /> {/* Purple Nodes */}
                {nextPosition && <BidirectionalPointer start={position} end={nextPosition} />}
              </React.Fragment>
            );
          })}
        </SceneSetup>
      </div>

      {/* RIGHT PANEL (AI POWERED) */}
      <div style={styles.rightPanel}>
        
        {/* Dynamic AI Content */}
        <div style={styles.descriptionSection}>
           {loading ? (
             <div style={{textAlign: 'center', marginTop: '20px'}}>✨ Generating Explanation...</div>
           ) : (
             <>
               <h3 style={styles.heading}>{algoInfo.title}</h3>
               <p>{algoInfo.desc}</p>
               <div style={{fontSize: '0.8rem', fontWeight: 'bold', margin: '10px 0', color: '#555'}}>{algoInfo.complexity}</div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', marginBottom: '5px' }}>
                 <strong>Implementation:</strong>
                 
                 <select 
                   value={language} 
                   onChange={onLanguageChange}
                   style={{
                     padding: '4px 8px',
                     borderRadius: '4px',
                     border: '1px solid #ccc',
                     fontSize: '0.85rem',
                     cursor: 'pointer',
                     background: 'white',
                     outline: 'none'
                   }}
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
            <button style={styles.button} onClick={() => handleAction('Insert at Head', () => insertHead(inputValue || 0))}>
              Insert Head
            </button>
            <button style={styles.button} onClick={() => handleAction('Insert at Tail', () => insertTail(inputValue || 0))}>
              Insert Tail
            </button>
            <button style={{...styles.button, background: '#dc3545'}} onClick={() => handleAction('Delete Head', deleteHead)}>
              Delete Head
            </button>
            <button style={{...styles.button, background: '#dc3545'}} onClick={() => handleAction('Delete Tail', deleteTail)}>
              Delete Tail
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- STYLES (Same as before) ---
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

export default DoublyLinkedList;