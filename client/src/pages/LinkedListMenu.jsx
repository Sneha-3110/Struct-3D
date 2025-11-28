import React from 'react';
import { useNavigate } from 'react-router-dom';

const LinkedListMenu = () => {
  const navigate = useNavigate();

  const treeOptions = [
    { 
      id: 'sll', 
      title: 'Singly Linked List', 
      desc: 'A unidirectional sequence where each node points only to the next node, terminating in a null value.',
      path: '/data-structure/linked-list/sll' 
    },
    { 
      id: 'dll', 
      title: 'Doubly Linked List', 
      desc: 'A bidirectional structure where every node contains pointers to both the next and the previous node, allowing traversal in either direction.',
      path: '/data-structure/linked-list/dll' 
    },
    { 
      id: 'scll', 
      title: 'Singly Circular Linked List', 
      desc: 'A variation where the last node points back to the first node instead of null, creating a continuous, endless loop.',
      path: '/data-structure/linked-list/scll' 
    },
    { 
      id: 'dcll', 
      title: 'Doubly Circular Linked List', 
      desc: 'A hybrid structure where nodes have bidirectional pointers and the final node connects back to the head, enabling continuous scrolling in both directions.',
      path: '/data-structure/linked-list/dcll' 
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.headerSection}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Back</button>
        <h1 style={styles.header}>Select Linked List Type</h1>
      </div>
      
      <div style={styles.grid}>
        {treeOptions.map((option) => (
          <div 
            key={option.id} 
            style={styles.card} 
            onClick={() => navigate(option.path)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }}
          >
            <h3 style={styles.cardTitle}>{option.title}</h3>
            <p style={styles.cardDesc}>{option.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    padding: '50px',
    background: '#f4f4f9',
    fontFamily: 'Arial, sans-serif',
  },
  headerSection: {
    maxWidth: '1200px',
    margin: '0 auto 40px auto',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'center'
  },
  backBtn: {
    position: 'absolute',
    left: 0,
    padding: '10px 20px',
    background: '#2c3e50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  header: {
    color: '#333',
    fontSize: '2.5rem',
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  card: {
    background: 'white',
    borderRadius: '15px',
    padding: '40px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    border: '1px solid #eaeaea',
    textAlign: 'center',
  },
  cardTitle: {
    margin: '0 0 15px 0',
    color: '#007bff',
    fontSize: '1.5rem',
  },
  cardDesc: {
    color: '#666',
    lineHeight: '1.6',
  },
};

export default LinkedListMenu;