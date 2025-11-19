import React from 'react';
import { Link } from 'react-router-dom'; // Used for navigation

// --- Inline Styles ---
// We can make these more complex with Tailwind/CSS later
const pageStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  width: '100vw',
  background: 'linear-gradient(135deg, #232526, #414345)', // Dark gradient
  color: 'white',
  fontFamily: 'Arial, sans-serif',
  textAlign: 'center',
};

const titleStyles = {
  fontSize: '4.5rem',
  fontWeight: 'bold',
  marginBottom: '10px',
  letterSpacing: '2px',
};

const taglineStyles = {
  fontSize: '1.5rem',
  color: '#ccc',
  marginBottom: '40px',
};

const buttonStyles = {
  fontSize: '1.2rem',
  padding: '15px 30px',
  borderRadius: '50px',
  border: 'none',
  background: 'linear-gradient(90deg, #007bff, #00c6ff)', // Blue gradient
  color: 'white',
  textDecoration: 'none', // For the <Link> component
  cursor: 'pointer',
  transition: 'transform 0.2s ease',
};
// --- End of Styles ---

const LandingPage = () => {
  return (
    <div style={pageStyles}>
      <h1 style={titleStyles}>Struct3D</h1>
      <p style={taglineStyles}>
        Visualize Data Structures and Algorithms in Interactive 3D.
      </p>
      
      {/* This Link acts as an <a> tag to navigate to your visualizer page */}
      <Link to="/dashboard" style={buttonStyles}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      >
        Start Visualizing
      </Link>
    </div>
  );
};

export default LandingPage;