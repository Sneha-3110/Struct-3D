import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  // List of topics available in your project
  const topics = [
    {  path: '/data-structure/linked-list', id: 'linked-list', title: 'Linked List', desc: 'Linear collection of data elements.' },
    {  path: '/data-structure/binary-tree', id: 'bst', title: 'Binary Tree', desc: 'Hierarchical tree structure.' },
    {  path: '/data-structure/graph', id: 'graph', title: 'Graph Algorithms', desc: 'Nodes connected by edges.' },
    {  path: '/data-structure/sorting', id: 'sorting', title: 'Sorting Visualizer', desc: 'Bubble, Merge, and Quick sort.' },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Select a Data Structure</h1>
      
      <div style={styles.grid}>
        {topics.map((topic) => (
          <div 
            key={topic.id} 
            style={styles.card} 
            onClick={() => navigate(topic.path)} // Dynamic Routing
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }}
          >
            <h3 style={styles.cardTitle}>{topic.title}</h3>
            <p style={styles.cardDesc}>{topic.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Simple CSS-in-JS styles for a clean grid layout
const styles = {
  container: {
    minHeight: '100vh',
    padding: '50px',
    background: '#f4f4f9',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    color: '#333',
    fontSize: '2.5rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  card: {
    background: 'white',
    borderRadius: '15px',
    padding: '30px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    border: '1px solid #eaeaea',
  },
  cardTitle: {
    margin: '0 0 10px 0',
    color: '#007bff',
  },
  cardDesc: {
    color: '#666',
    lineHeight: '1.5',
  },
};

export default Dashboard;