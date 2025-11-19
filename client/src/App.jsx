import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage'; // Import new page
import LinkedList from './components/dsa/LinkedList/LinkedList';
import BinarySearchTree from './components/dsa/BinaryTree/BinarySearchTree';
import Dashboard from './pages/Dashboard';  // Import Dashboard page
import './App.css';

function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Route 2: The visualizer page (URL: "/visualizer") */}
        <Route path="/data-structure/linked-list" element={<LinkedList />} />
        <Route path="/data-structure/bst" element={<BinarySearchTree />} />

        {/* You can add more routes here later, e.g., /about, /login */}
      </Routes>
    </main>
  );
}

export default App;
