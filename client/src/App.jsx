import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage'; // Import new page
import LinkedList from './components/dsa/LinkedList/LinkedList';
import BinarySearchTree from './components/dsa/BinaryTree/BinarySearchTree';
import Graph from './components/dsa/Graph/Graph';
import Dashboard from './pages/Dashboard';  // Import Dashboard page

import { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
  return (
    <main>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Route 2: The visualizer page (URL: "/visualizer") */}
        <Route path="/data-structure/linked-list" element={<LinkedList />} />
        <Route path="/data-structure/bst" element={<BinarySearchTree />} />
        <Route path="/data-structure/graph" element={<Graph />} />

        {/* You can add more routes here later, e.g., /about, /login */}
      </Routes>
    </main>
  );
}

export default App;
