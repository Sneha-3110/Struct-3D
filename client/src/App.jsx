import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage'; // Import new page

import BinarySearchTree from './components/dsa/BinaryTree/BinarySearchTree';
import Dashboard from './pages/Dashboard';  // Import Dashboard page
import BinaryTreeMenu from './pages/BinaryTreeMenu';
import RedBlackTree from './components/dsa/BinaryTree/RedBlackTree';
import SortingWorkspace from './pages/SortiingMenu';

import LinkedListMenu from './pages/LinkedListMenu'
import SinglyLinkedList from './components/dsa/LinkedList/SinglyLinkedList';
import DoublyLinkedList from './components/dsa/LinkedList/DoublyLinkedList';

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
        <Route path="/data-structure/linked-list" element={<LinkedListMenu />} />
        <Route path="/data-structure/linked-list/sll" element={<SinglyLinkedList />} />
        <Route path="/data-structure/linked-list/dll" element={<DoublyLinkedList />} />
        
        <Route path="/data-structure/binary-tree" element={<BinaryTreeMenu />} />
        <Route path="/data-structure/binary-tree/bst" element={<BinarySearchTree />} />
        <Route path="/data-structure/binary-tree/rb-tree" element={<RedBlackTree />} />

        <Route path="/data-structure/sorting" element={<SortingWorkspace />} />

      </Routes>
    </main>
  );
}

export default App;
