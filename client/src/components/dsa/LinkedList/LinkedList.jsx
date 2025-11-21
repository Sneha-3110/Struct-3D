import React, { useState } from 'react';
import { useDsaStore } from '../../../context/linkedListStore';
import SceneSetup from '../../canvas/SceneSetup';
import Node3D from '../Node3D';
import Pointer3D from '../LinkedList/Pointer3D'; 
import { useNavigate } from 'react-router-dom';

// --- ALGODICTIONARY ---
const algoDictionary = {
  default: {
    title: "Linked List",
    desc: "A linear data structure where elements are not stored at contiguous memory locations. The elements are linked using pointers.",
    code: "Select an operation to see the algorithm."
  },
  insertHead: {
    title: "Algorithm: Insert at Head",
    desc: "Adds a new node to the beginning of the list.",
    code: `1. Create a new node (newNode)
2. Set newNode.next = head
3. Set head = newNode
4. Time Complexity: O(1)`
  },
  insertTail: {
    title: "Algorithm: Insert at Tail",
    desc: "Adds a new node to the end of the list.",
    code: `1. Create a new node (newNode)
2. If head is NULL, head = newNode
3. Else, traverse to the last node (temp)
4. Set temp.next = newNode
5. Time Complexity: O(n)`
  },
  insertIndex: {
    title: "Algorithm: Insert at Index",
    desc: "Inserts a node at a specific position.",
    code: `1. Create newNode
2. Traverse to node at (index - 1) (temp)
3. Set newNode.next = temp.next
4. Set temp.next = newNode
5. Time Complexity: O(n)`
  },
  deleteHead: {
    title: "Algorithm: Delete Head",
    desc: "Removes the first node of the list.",
    code: `1. Check if list is empty
2. Set temp = head
3. Move head to head.next
4. Free memory of temp
5. Time Complexity: O(1)`
  },
  deleteTail: {
    title: "Algorithm: Delete Tail",
    desc: "Removes the last node of the list.",
    code: `1. If head.next is NULL, delete head
2. Traverse to second-to-last node (temp)
3. Delete temp.next
4. Set temp.next = NULL
5. Time Complexity: O(n)`
  },
  deleteIndex: {
    title: "Algorithm: Delete at Index",
    desc: "Removes the node at a specific position.",
    code: `1. Traverse to node at (index - 1) (temp)
2. Store node to be deleted: del = temp.next
3. Set temp.next = del.next
4. Free memory of del
5. Time Complexity: O(n)`
  },
  deleteValue: {
    title: "Algorithm: Delete by Value",
    desc: "Searches for a value and removes it.",
    code: `1. Traverse list with prev and curr pointers
2. If curr.data == value:
   a. Set prev.next = curr.next
   b. Free curr
3. Time Complexity: O(n)`
  }
};

const styles = {
  container: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    background: '#f0f2f5',
    fontFamily: '"Segoe UI", Roboto, Helvetica, sans-serif',
    overflow: 'hidden',
  },
  taskbar: {
    width: '50px',
    background: '#2c3e50',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '20px',
    zIndex: 20,
  },
  taskbarIcon: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px',
    cursor: 'pointer',
    fontSize: '1.2rem',
    transition: '0.2s',
  },
  workingArea: {
    flex: 1,
    position: 'relative',
    background: '#dbeafe',
    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)',
  },
  workingAreaLabel: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '3rem',
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.4)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  rightPanel: {
    width: '350px',
    display: 'flex',
    flexDirection: 'column',
    borderLeft: '1px solid #ccc',
    zIndex: 20,
    background: 'white',
  },
  descriptionSection: {
    flex: '0 0 40%',
    background: '#fff9c4',
    padding: '20px',
    borderBottom: '1px solid #ddd',
    overflowY: 'auto',
  },
  operationsSection: {
    flex: 1,
    background: '#ffecb3',
    padding: '20px',
    overflowY: 'auto',
  },
  heading: {
    marginTop: 0,
    color: '#333',
    borderBottom: '2px solid #333',
    display: 'inline-block',
    marginBottom: '10px',
  },
  inputGroup: {
    marginBottom: '15px',
    background: 'rgba(255,255,255,0.5)',
    padding: '10px',
    borderRadius: '8px',
  },
  input: {
    width: '100%',
    padding: '8px',
    marginBottom: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  btnGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '5px',
  },
  button: {
    padding: '8px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    background: '#007bff',
    color: 'white',
    fontWeight: 'bold',
  },
  deleteBtn: {
    background: '#dc3545',
    color: 'white',
  },
  codeBlock: {
    display: 'block',
    background: '#eee',
    padding: '10px',
    fontSize: '0.85rem',
    borderRadius: '4px',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap', // Preserves line breaks
    border: '1px solid #ddd'
  }
};

const LinkedList = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [indexValue, setIndexValue] = useState('');
  
  // New State: Tracks which algorithm to display
  const [currentAlgo, setCurrentAlgo] = useState(algoDictionary.default);

  // State Connections
  const nodes = useDsaStore((state) => state.nodes);
  const insertHead = useDsaStore((state) => state.insertHead);
  const insertTail = useDsaStore((state) => state.insertTail);
  const insertAt = useDsaStore((state) => state.insertAt);
  const deleteHead = useDsaStore((state) => state.deleteHead);
  const deleteTail = useDsaStore((state) => state.deleteTail);
  const deleteAt = useDsaStore((state) => state.deleteAt);
  const deleteByValue = useDsaStore((state) => state.deleteByValue);
  const resetNodes = useDsaStore((state) => state.resetNodes);

  const getNodePosition = (index) => {
    const spacing = 3.0;
    const xPos = index * spacing - ((nodes.length - 1) * spacing) / 2;
    return [xPos, 0, 0];
  };

  // Wrapper functions to update Algo display AND perform action
  const handleAction = (algoKey, actionFn) => {
    setCurrentAlgo(algoDictionary[algoKey]);
    actionFn();
  };

  return (
    <div style={styles.container}>
      
      {/* 1. LEFT TASKBAR */}
      <div style={styles.taskbar}>
        <div style={styles.taskbarIcon} onClick={() => navigate('/dashboard')} title="Back to Dashboard">
          ⬅
        </div>
        <div style={styles.taskbarIcon} onClick={() => { resetNodes(); setCurrentAlgo(algoDictionary.default); }} title="Reset">
          ↻
        </div>
      </div>

      {/* 2. MIDDLE WORKING AREA */}
      <div style={styles.workingArea}>
        <div style={styles.workingAreaLabel}>Working Area</div>
        <SceneSetup>
          {nodes.map((node, index) => {
            const position = getNodePosition(index);
            const nextPosition = index < nodes.length - 1 ? getNodePosition(index + 1) : null;
            return (
              <React.Fragment key={node.id}>
                <Node3D position={position} value={node.value} />
                {nextPosition && <Pointer3D start={position} end={nextPosition} />}
              </React.Fragment>
            );
          })}
        </SceneSetup>
      </div>

      {/* 3. RIGHT PANEL */}
      <div style={styles.rightPanel}>
        
        {/* Description Box (Dynamic Content) */}
        <div style={styles.descriptionSection}>
          <h3 style={styles.heading}>{currentAlgo.title}</h3>
          <p>{currentAlgo.desc}</p>
          
          {/* Logic Display */}
          <strong>Pseudocode:</strong>
          <code style={styles.codeBlock}>
            {currentAlgo.code}
          </code>
        </div>

        {/* Operations Box (Controls) */}
        <div style={styles.operationsSection}>
          <h3 style={styles.heading}>Operations</h3>
          
          <div style={styles.inputGroup}>
            <label><strong>Input Data:</strong></label>
            <input 
              style={styles.input} 
              placeholder="Value" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <input 
              style={styles.input} 
              placeholder="Index (optional)" 
              type="number"
              value={indexValue}
              onChange={(e) => setIndexValue(e.target.value)}
            />
            
            <div style={styles.btnGrid}>
              <button 
                style={styles.button} 
                onClick={() => handleAction('insertHead', () => insertHead(inputValue))}
              >
                Insert Head
              </button>
              
              <button 
                style={styles.button} 
                onClick={() => handleAction('insertTail', () => insertTail(inputValue))}
              >
                Insert Tail
              </button>
              
              <button 
                style={{...styles.button, gridColumn: 'span 2'}} 
                onClick={() => handleAction('insertIndex', () => insertAt(Number(indexValue), inputValue))}
              >
                Insert at Index
              </button>
            </div>
          </div>

          <div style={styles.inputGroup}>
             <label><strong>Deletion:</strong></label>
             <div style={styles.btnGrid}>
              <button 
                style={{...styles.button, ...styles.deleteBtn}} 
                onClick={() => handleAction('deleteHead', deleteHead)}
              >
                Del Head
              </button>
              
              <button 
                style={{...styles.button, ...styles.deleteBtn}} 
                onClick={() => handleAction('deleteTail', deleteTail)}
              >
                Del Tail
              </button>
              
              <button 
                style={{...styles.button, ...styles.deleteBtn}} 
                onClick={() => handleAction('deleteIndex', () => deleteAt(Number(indexValue)))}
              >
                Del Index
              </button>
              
              <button 
                style={{...styles.button, ...styles.deleteBtn}} 
                onClick={() => handleAction('deleteValue', () => deleteByValue(inputValue))}
              >
                Del Value
              </button>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LinkedList;

// --- LAYOUT STYLES ---
// const styles = {
//   container: {
//     display: 'flex',            // This makes the layout horizontal
//     width: '100vw',
//     height: '100vh',
//     background: '#f0f2f5',
//     fontFamily: '"Segoe UI", Roboto, Helvetica, sans-serif',
//     overflow: 'hidden',
//   },
//   // 1. LEFT TASKBAR (Blue strip in your image)
//   taskbar: {
//     width: '50px',
//     background: '#2c3e50', // Dark blue
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     paddingTop: '20px',
//     zIndex: 20,
//   },
//   taskbarIcon: {
//     width: '30px',
//     height: '30px',
//     borderRadius: '50%',
//     background: 'rgba(255,255,255,0.2)',
//     color: 'white',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: '20px',
//     cursor: 'pointer',
//     fontSize: '1.2rem',
//     transition: '0.2s',
//   },
//   // 2. MIDDLE WORKING AREA (Light blue in your image)
//   workingArea: {
//     flex: 1, // Takes all remaining width
//     position: 'relative',
//     background: '#dbeafe', // Light blue tint
//     boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)',
//   },
//   workingAreaLabel: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     fontSize: '3rem',
//     fontWeight: 'bold',
//     color: 'rgba(255,255,255,0.4)', // Watermark style text
//     pointerEvents: 'none',
//     zIndex: 0,
//   },
//   // 3. RIGHT PANEL (Yellow/Orange boxes in your image)
//   rightPanel: {
//     width: '350px', // Fixed width for sidebar
//     display: 'flex',
//     flexDirection: 'column',
//     borderLeft: '1px solid #ccc',
//     zIndex: 20,
//     background: 'white',
//   },
//   // Top Box: Description
//   descriptionSection: {
//     flex: '0 0 40%', // Takes 40% of height
//     background: '#fff9c4', // Light Yellow (like your image)
//     padding: '20px',
//     borderBottom: '1px solid #ddd',
//     overflowY: 'auto',
//   },
//   // Bottom Box: Operations
//   operationsSection: {
//     flex: 1, // Takes remaining height (60%)
//     background: '#ffecb3', // Darker Yellow (like your image)
//     padding: '20px',
//     overflowY: 'auto',
//   },
//   // Reusable Element Styles
//   heading: {
//     marginTop: 0,
//     color: '#333',
//     borderBottom: '2px solid #333',
//     display: 'inline-block',
//     marginBottom: '10px',
//   },
//   inputGroup: {
//     marginBottom: '15px',
//     background: 'rgba(255,255,255,0.5)',
//     padding: '10px',
//     borderRadius: '8px',
//   },
//   input: {
//     width: '100%',
//     padding: '8px',
//     marginBottom: '8px',
//     borderRadius: '4px',
//     border: '1px solid #ccc',
//     boxSizing: 'border-box',
//   },
//   btnGrid: {
//     display: 'grid',
//     gridTemplateColumns: '1fr 1fr',
//     gap: '5px',
//   },
//   button: {
//     padding: '8px',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     background: '#007bff',
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   deleteBtn: {
//     background: '#dc3545',
//     color: 'white',
//   }
// };

// const LinkedList = () => {
//   const navigate = useNavigate();
//   const [inputValue, setInputValue] = useState('');
//   const [indexValue, setIndexValue] = useState('');

//   // State Connections
//   const nodes = useDsaStore((state) => state.nodes);
//   const insertHead = useDsaStore((state) => state.insertHead);
//   const insertTail = useDsaStore((state) => state.insertTail);
//   const insertAt = useDsaStore((state) => state.insertAt);
//   const deleteHead = useDsaStore((state) => state.deleteHead);
//   const deleteTail = useDsaStore((state) => state.deleteTail);
//   const deleteAt = useDsaStore((state) => state.deleteAt);
//   const deleteByValue = useDsaStore((state) => state.deleteByValue);
//   const resetNodes = useDsaStore((state) => state.resetNodes);

//   const getNodePosition = (index) => {
//     const spacing = 3.0;
//     const xPos = index * spacing - ((nodes.length - 1) * spacing) / 2;
//     return [xPos, 0, 0];
//   };

//   return (
//     <div style={styles.container}>
      
//       {/* 1. LEFT TASKBAR */}
//       <div style={styles.taskbar}>
//         <div style={styles.taskbarIcon} onClick={() => navigate('/dashboard')} title="Back to Dashboard">
//           ⬅
//         </div>
//         <div style={styles.taskbarIcon} onClick={resetNodes} title="Reset">
//           ↻
//         </div>
//       </div>

//       {/* 2. MIDDLE WORKING AREA */}
//       <div style={styles.workingArea}>
//         {/* Watermark Text */}
//         <div style={styles.workingAreaLabel}>Working Area</div>
        
//         <SceneSetup>
//           {nodes.map((node, index) => {
//             const position = getNodePosition(index);
//             const nextPosition = index < nodes.length - 1 ? getNodePosition(index + 1) : null;
//             return (
//               <React.Fragment key={node.id}>
//                 <Node3D position={position} value={node.value} />
//                 {nextPosition && <Pointer3D start={position} end={nextPosition} />}
//               </React.Fragment>
//             );
//           })}
//         </SceneSetup>
//       </div>

//       {/* 3. RIGHT PANEL */}
//       <div style={styles.rightPanel}>
        
//         {/* Description Box (Top) */}
//         <div style={styles.descriptionSection}>
//           <h3 style={styles.heading}>Description</h3>
//           <p><strong>Linked List:</strong> A linear data structure where elements are not stored at contiguous memory locations.</p>
//           <p>The elements are linked using pointers as shown in the visualization.</p>
          
//           <h4>Algorithm (Insertion):</h4>
//           <code style={{display:'block', background:'#eee', padding:'5px', fontSize:'0.8rem'}}>
//             1. Create new node<br/>
//             2. Set new.next = head<br/>
//             3. Set head = new node
//           </code>
//         </div>

//         {/* Operations Box (Bottom) */}
//         <div style={styles.operationsSection}>
//           <h3 style={styles.heading}>Operations</h3>
          
//           <div style={styles.inputGroup}>
//             <label><strong>Input Data:</strong></label>
//             <input 
//               style={styles.input} 
//               placeholder="Value" 
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//             />
//             <input 
//               style={styles.input} 
//               placeholder="Index (optional)" 
//               type="number"
//               value={indexValue}
//               onChange={(e) => setIndexValue(e.target.value)}
//             />
            
//             <div style={styles.btnGrid}>
//               <button style={styles.button} onClick={() => insertHead(inputValue)}>Insert Head</button>
//               <button style={styles.button} onClick={() => insertTail(inputValue)}>Insert Tail</button>
//               <button style={{...styles.button, gridColumn: 'span 2'}} onClick={() => insertAt(Number(indexValue), inputValue)}>
//                 Insert at Index
//               </button>
//             </div>
//           </div>

//           <div style={styles.inputGroup}>
//              <label><strong>Deletion:</strong></label>
//              <div style={styles.btnGrid}>
//               <button style={{...styles.button, ...styles.deleteBtn}} onClick={deleteHead}>Delete Head</button>
//               <button style={{...styles.button, ...styles.deleteBtn}} onClick={deleteTail}>Delete Tail</button>
//               <button style={{...styles.button, ...styles.deleteBtn}} onClick={() => deleteAt(Number(indexValue))}>Del Index</button>
//               <button style={{...styles.button, ...styles.deleteBtn}} onClick={() => deleteByValue(inputValue)}>Del Value</button>
//              </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default LinkedList;

