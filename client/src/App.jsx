import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage'; // Import new page
import LinkedList from './components/dsa/LinkedList/LinkedList';
import BinarySearchTree from './components/dsa/BinaryTree/BinarySearchTree';
import Dashboard from './pages/Dashboard';  // Import Dashboard page
//import SortingWorkspace from "../src/components/dsa/Sorting/SortingWorkspace";
import SortingWorkspace from './pages/SortingMenu';
import BubbleSort3D from './components/dsa/Sorting/BubbleSort3D';
import InsertionSort3D from './components/dsa/Sorting/InsertionSort3D';
import SelectionSort3D from './components/dsa/Sorting/SelectionSort3D';
import MergeSort3D from './components/dsa/Sorting/MergeSort3D'; 
import QuickSort3D from './components/dsa/Sorting/QuickSort3D'; 
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
        <Route path="/data-structure/sorting" element={<SortingWorkspace />} />
        <Route path="/data-structure/sorting/bubble-sort-3d" element={<BubbleSort3D />} />
        <Route path="/data-structure/sorting/insertion-sort-3d" element={<InsertionSort3D />} />
        <Route path="/data-structure/sorting/selection-sort-3d" element={<SelectionSort3D />} />
        <Route path="/data-structure/sorting/merge-sort-3d" element={<MergeSort3D />} /> 
        <Route path="/data-structure/sorting/quick-sort-3d" element={<QuickSort3D />} />

        {/* You can add more routes here later, e.g., /about, /login */}
      </Routes>
    </main>
  );
}

export default App;
