import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  Play,
  RefreshCw,
  Menu,
  Info,
  Settings,
  Home,
  Database,
  Code,
  Activity,
} from "lucide-react";

/**
 * SelectionSort3DVisualizer.jsx
 *
 * Full-page component — Selection Sort visualization using Three.js.
 * Movement & animation style follows your previous Bubble Sort variant (bounce + arc).
 */

// ---------------------- Main App ----------------------
export default function App() {
  const [inputValue, setInputValue] = useState("5, 3, 8, 4, 2");
  const [isSorting, setIsSorting] = useState(false);
  const [liveStatus, setLiveStatus] = useState("Waiting to start...");
  const [sortStatus, setSortStatus] = useState("Ready");
  const visualizerRef = useRef();

  const handleGenerate = () => {
    visualizerRef.current?.generateArray(inputValue);
    setLiveStatus("Generated new array.");
    setSortStatus("Ready");
  };

  const handleRandom = () => {
    const count = 5 + Math.floor(Math.random() * 5); // 5-9 values
    const arr = Array.from({ length: count }, () => 1 + Math.floor(Math.random() * 9));
    const s = arr.join(", ");
    setInputValue(s);
    visualizerRef.current?.generateArray(s);
    setLiveStatus("Randomized array");
    setSortStatus("Ready");
  };

  const handleStart = () => {
    visualizerRef.current?.startSort();
  };

  return (
    <div className="flex h-screen w-full bg-slate-100 font-sans overflow-hidden">
      {/* LEFT NAV */}
      <aside className="w-16 bg-blue-900 flex flex-col items-center py-6 gap-6 text-white shadow-lg z-20 shrink-0">
        <div className="p-2 bg-blue-800 rounded-lg mb-4">
          <Menu size={22} />
        </div>
        <NavItem icon={<Home size={18} />} label="Home" active />
        <NavItem icon={<Database size={18} />} label="Data" />
        <NavItem icon={<Code size={18} />} label="Algo" />
        <NavItem icon={<Settings size={18} />} label="Settings" />
        <div className="mt-auto mb-4">
          <Info size={18} className="text-blue-300 hover:text-white cursor-pointer" />
        </div>
      </aside>

      {/* CENTER WORKING AREA */}
      <main className="flex-1 relative bg-blue-50 flex flex-col min-w-0">
        {/* Title (absolute) */}
        <div className="absolute top-4 left-0 right-0 text-center pointer-events-none z-10">
          <h1 className="text-3xl font-bold text-blue-900/20 uppercase tracking-widest select-none">
            3D Selection Sort Visualizer
          </h1>
        </div>

        {/* Canvas container: top padding to match layout */}
        <div className="w-full h-full relative overflow-hidden rounded-tl-3xl border-l-4 border-t-4 border-white/50 shadow-inner flex flex-col items-center pt-28">
          <SelectionSort3D
            ref={visualizerRef}
            setIsSorting={setIsSorting}
            onActionChange={setLiveStatus}
            onSortStatusChange={setSortStatus}
          />
        </div>
      </main>

      {/* RIGHT SIDEBAR */}
      <aside className="w-80 bg-slate-50 flex flex-col p-4 gap-4 shadow-xl shrink-0 overflow-y-auto border-l border-slate-200">
        <div className="bg-yellow-100 border-l-4 border-yellow-400 p-5 rounded-xl shadow-sm">
          <h2 className="font-bold text-lg text-yellow-900 mb-2 flex items-center gap-2">
            <Code size={18} /> Algorithm: Selection Sort
          </h2>
          <p className="text-sm text-yellow-800 mb-3 leading-relaxed">
            Selection Sort repeatedly finds the minimum element from the unsorted portion and places it at the beginning.
          </p>

          <div className="bg-white/60 p-3 rounded text-xs font-mono text-slate-700 border border-yellow-200">
            <p className="font-semibold text-yellow-700 mb-1">Pseudocode:</p>
            <p>1. for i from 0 to N-1</p>
            <p>2. &nbsp;&nbsp; min = i</p>
            <p>3. &nbsp;&nbsp; for j from i+1 to N-1</p>
            <p>4. &nbsp;&nbsp;&nbsp;&nbsp; if A[j] &lt; A[min] then min = j</p>
            <p>5. &nbsp;&nbsp; swap(A[i], A[min])</p>
            <p className="mt-2 text-yellow-900/70">Time Complexity: O(n²)</p>
          </div>
        </div>

        {/* Color Key */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-amber-200 text-sm">
          <p className="font-semibold mb-2">Color Key:</p>
          <div className="flex flex-col gap-2 text-xs">
            <LegendRow color="#3b82f6" label="Scanner (current j)" />
            <LegendRow color="#7c3aed" label="Current minimum" />
            <LegendRow color="#fb923c" label="Swapping (pair)" />
            <LegendRow color="#10b981" label="Sorted element" />
          </div>
        </div>

        {/* Controls */}
        <div className="bg-amber-100 border-l-4 border-amber-500 p-5 rounded-xl shadow-sm flex-1 flex flex-col">
          <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
            <Settings size={16} /> Controls
          </h3>

          <label className="text-xs text-amber-700 font-semibold">INPUT DATA</label>
          <input
            className="w-full p-2 rounded border border-amber-300 bg-white text-slate-700 font-mono text-sm mb-3"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isSorting}
            placeholder="e.g. 5, 3, 8, 4, 2"
          />

          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              className="bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2"
              disabled={isSorting}
              onClick={handleGenerate}
            >
              <RefreshCw size={14} /> Generate
            </button>

            <button
              className="bg-purple-600 text-white py-2 rounded flex items-center justify-center gap-2"
              disabled={isSorting}
              onClick={handleRandom}
            >
              Random
            </button>
          </div>

          <button
            className="bg-green-600 text-white py-3 rounded-lg text-lg font-semibold drop-shadow"
            disabled={isSorting}
            onClick={handleStart}
          >
            <div className="flex items-center justify-center gap-2">
              <Play size={16} /> Start Visualization
            </div>
          </button>

          <div className="mt-auto pt-6">
            <div className="bg-white/50 rounded p-3 border border-amber-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-amber-800">LIVE STATUS:</p>
                <Activity size={14} className={isSorting ? "text-green-600 animate-pulse" : "text-slate-400"} />
              </div>
              <div className="text-sm font-medium text-amber-900 mb-1">{liveStatus}</div>
              <div className="text-xs text-amber-700/70">{sortStatus}</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

// ---------------------- small UI components ----------------------
const NavItem = ({ icon, label, active }) => (
  <div className={`flex flex-col items-center gap-1 cursor-pointer group ${active ? "text-white" : "text-blue-300 hover:text-white"}`}>
    <div className={`p-2 rounded-lg transition-all ${active ? "bg-white/10" : "group-hover:bg-white/5"}`}>{icon}</div>
  </div>
);

const LegendRow = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div style={{ background: color }} className="w-3 h-3 rounded-full" />
    <div className="text-xs text-slate-700">{label}</div>
  </div>
);

// ---------------------- SelectionSort3D component ----------------------
const SelectionSort3D = React.forwardRef(({ onActionChange, onSortStatusChange, setIsSorting }, ref) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const animRef = useRef(null);

  // Data refs
  const cubesRef = useRef([]);
  const labelsRef = useRef([]);
  const stepsRef = useRef([]); // sequence of actions
  const currentStepRef = useRef(0);
  const sortingRef = useRef(false);

  // Colors
  const COLOR_DEFAULT = 0x10b981; // green-ish default
  const COLOR_COMPARE = 0x3b82f6; // blue (scanner)
  const COLOR_MIN = 0x7c3aed; // purple (current minimum)
  const COLOR_SWAP = 0xfb923c; // orange for swap
  const COLOR_SORTED = 0x059669; // dark green

  // Camera + layout initialisation
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Scene
    const scene = sceneRef.current;
    scene.background = new THREE.Color(0xf0f9ff);

    // Camera - wide enough and higher Y so bars show
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 3.5, 22); // match Bubble layout
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Resize handling
    const handleResize = () => {
      if (!mount || !cameraRef.current || !rendererRef.current) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(mount);

    // Render loop
    const animate = () => {
      animRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // initial data
    createCubes([5, 3, 8, 4, 2]);

    // cleanup
    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
      if (rendererRef.current) rendererRef.current.dispose();
      if (mount) mount.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Imperative API
  React.useImperativeHandle(ref, () => ({
    generateArray(input) {
      if (sortingRef.current) return;
      const arr = parseInput(input);
      if (arr.length === 0) return;
      createCubes(arr);
      stepsRef.current = generateSelectionSteps(arr);
      currentStepRef.current = 0;
      onSortStatusChange && onSortStatusChange("Ready");
      onActionChange && onActionChange("Array generated");
    },
    startSort() {
      if (sortingRef.current) return;
      if (!stepsRef.current || stepsRef.current.length === 0) {
        const arr = parseInput("5,3,8,4,2");
        stepsRef.current = generateSelectionSteps(arr);
      }
      sortingRef.current = true;
      setIsSorting && setIsSorting(true);
      onSortStatusChange && onSortStatusChange("Sorting");
      onActionChange && onActionChange("Starting Selection Sort...");
      animateStep();
    },
  }));

  // Parse input string -> number array (clamped)
  const parseInput = (str) =>
    String(str)
      .split(",")
      .map((v) => Number(v.trim()))
      .filter((n) => !isNaN(n) && n > 0)
      .slice(0, 50)
      .map((n) => Math.min(12, Math.max(1, Math.round(n)))); // clamp 1..12 heights

  // Create cubes
  function createCubes(arr) {
    const scene = sceneRef.current;
    // cleanup
    cubesRef.current.forEach((c) => scene.remove(c));
    labelsRef.current.forEach((l) => scene.remove(l));
    cubesRef.current = [];
    labelsRef.current = [];

    const spacing = 3.2;
    const startX = -((arr.length - 1) * spacing) / 2;
    const baseY = -4.0;

    arr.forEach((val, i) => {
      const height = val;
      const geo = new THREE.BoxGeometry(2.2, height, 1.8);
      geo.translate(0, height / 2, 0);
      const mat = new THREE.MeshStandardMaterial({ color: COLOR_DEFAULT, roughness: 0.35, metalness: 0.05 });
      const cube = new THREE.Mesh(geo, mat);
      cube.castShadow = true;
      cube.receiveShadow = true;

      const x = startX + i * spacing;
      cube.position.set(x, baseY, 0);
      cube.userData = { value: height, sorted: false };
      scene.add(cube);
      cubesRef.current.push(cube);

      // label
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 128;
      const ctx = canvas.getContext("2d");
      ctx.font = "bold 60px Arial";
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.clearRect(0, 0, 128, 128);
      ctx.fillText(String(height), 64, 64);
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
      sprite.scale.set(2.4, 2.4, 1);
      sprite.position.set(x, baseY + height + 1.4, 0);
      scene.add(sprite);
      labelsRef.current.push(sprite);
    });

    // build steps for new array
    stepsRef.current = generateSelectionSteps(arr);
    currentStepRef.current = 0;
  }

  // Generate selection sort steps
  function generateSelectionSteps(arr) {
    const a = [...arr];
    const steps = [];
    const n = a.length;
    for (let i = 0; i < n - 1; i++) {
      let min = i;
      // mark start of pass - not required, but we will mark min visually
      steps.push({ type: "markMin", index: min });
      for (let j = i + 1; j < n; j++) {
        steps.push({ type: "compare", i: j, j: min, values: [a[j], a[min]] });
        if (a[j] < a[min]) {
          min = j;
          steps.push({ type: "markMin", index: min });
        }
      }
      if (min !== i) {
        steps.push({ type: "swap", i: i, j: min, values: [a[i], a[min]] });
        // perform swap in local copy so future comparisons reflect positions
        [a[i], a[min]] = [a[min], a[i]];
      }
      steps.push({ type: "sorted", index: i });
    }
    steps.push({ type: "sorted", index: n - 1 });
    return steps;
  }

  // Reset colors helper
  const resetColors = () => {
    cubesRef.current.forEach((c) => {
      c.material.color.setHex(c.userData.sorted ? COLOR_SORTED : COLOR_DEFAULT);
    });
  };

  // Animate steps sequentially
  const animateStep = () => {
    const steps = stepsRef.current;
    const idx = currentStepRef.current;

    if (!steps || idx >= steps.length) {
      // finished
      sortingRef.current = false;
      setIsSorting && setIsSorting(false);
      onSortStatusChange && onSortStatusChange("Completed");
      onActionChange && onActionChange("Sorting Completed!");
      cubesRef.current.forEach((c) => {
        c.userData.sorted = true;
        c.material.color.setHex(COLOR_SORTED);
      });
      return;
    }

    const step = steps[idx];
    resetColors();

    if (step.type === "markMin") {
      // highlight min index purple
      const minCube = cubesRef.current[step.index];
      if (minCube) {
        minCube.material.color.setHex(COLOR_MIN);
      }
      onActionChange && onActionChange(`Current minimum at index ${step.index}`);
      currentStepRef.current++;
      // small pause so mark is visible
      setTimeout(animateStep, 220);
      return;
    }

    if (step.type === "compare") {
      const scanIdx = step.i;
      const minIdx = step.j; // note: in our step we used j as min index
      const cubeA = cubesRef.current[scanIdx];
      const cubeMin = cubesRef.current[minIdx];
      const labelA = labelsRef.current[scanIdx];
      const labelMin = labelsRef.current[minIdx];
      onActionChange && onActionChange(`Comparing ${step.values[0]} with current min ${step.values[1]}`);

      // compare bounce animation for scanner (blue) and keep min purple
      const duration = 650;
      const start = performance.now();

      // color set
      if (cubeA) cubeA.material.color.setHex(COLOR_COMPARE);
      if (cubeMin && !cubeMin.userData.sorted) cubeMin.material.color.setHex(COLOR_MIN);

      const anim = () => {
        const now = performance.now();
        let t = (now - start) / duration;
        if (t > 1) t = 1;
        const ease = Math.sin(t * Math.PI);
        const lift = ease * 0.9;

        if (cubeA) cubeA.position.y = -4.0 + lift;
        if (cubeMin && !cubeMin.userData.sorted) cubeMin.position.y = -4.0; // min stays at base

        if (labelA && cubeA) labelA.position.y = cubeA.position.y + cubeA.userData.value + 1.4;
        if (labelMin && cubeMin) labelMin.position.y = cubeMin.position.y + cubeMin.userData.value + 1.4;

        if (t < 1) requestAnimationFrame(anim);
        else {
          if (cubeA) cubeA.position.y = -4.0;
          if (labelA && cubeA) labelA.position.y = cubeA.position.y + cubeA.userData.value + 1.4;
          currentStepRef.current++;
          animateStep();
        }
      };
      anim();
      return;
    }

    if (step.type === "swap") {
      const i = step.i;
      const j = step.j;
      const cubeI = cubesRef.current[i];
      const cubeJ = cubesRef.current[j];
      const labelI = labelsRef.current[i];
      const labelJ = labelsRef.current[j];
      onActionChange && onActionChange(`Swapping ${step.values[0]} and ${step.values[1]}`);

      // color them swap color
      if (cubeI) cubeI.material.color.setHex(COLOR_SWAP);
      if (cubeJ) cubeJ.material.color.setHex(COLOR_SWAP);

      const xI = cubeI.position.x;
      const xJ = cubeJ.position.x;
      const hI = cubeI.userData.value;
      const hJ = cubeJ.userData.value;

      const duration = 900;
      const start = performance.now();

      const anim = () => {
        const now = performance.now();
        let t = (now - start) / duration;
        if (t > 1) t = 1;
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        const newXI = xI + (xJ - xI) * ease;
        const newXJ = xJ + (xI - xJ) * ease;
        const arc = Math.sin(ease * Math.PI) * 2.6;

        // one hops up, the other slightly down for visual cross
        cubeI.position.set(newXI, -4.0 + arc, 0);
        cubeJ.position.set(newXJ, -4.0 - arc * 0.3, 0);

        labelI.position.set(newXI, cubeI.position.y + hI + 1.4, 0);
        labelJ.position.set(newXJ, cubeJ.position.y + hJ + 1.4, 0);

        if (t < 1) requestAnimationFrame(anim);
        else {
          // finalize and swap references
          cubeI.position.set(newXI, -4.0, 0);
          cubeJ.position.set(newXJ, -4.0, 0);
          labelI.position.set(newXI, -4.0 + hI + 1.4, 0);
          labelJ.position.set(newXJ, -4.0 + hJ + 1.4, 0);

          // swap in arrays
          [cubesRef.current[i], cubesRef.current[j]] = [cubesRef.current[j], cubesRef.current[i]];
          [labelsRef.current[i], labelsRef.current[j]] = [labelsRef.current[j], labelsRef.current[i]];

          currentStepRef.current++;
          animateStep();
        }
      };
      anim();
      return;
    }

    if (step.type === "sorted") {
      const idx = step.index;
      const c = cubesRef.current[idx];
      if (c) {
        c.userData.sorted = true;
        c.material.color.setHex(COLOR_SORTED);
      }
      onActionChange && onActionChange(`Index ${idx} is sorted`);
      currentStepRef.current++;
      setTimeout(animateStep, 120);
      return;
    }
  };

  // render container
  return <div ref={mountRef} className="w-full h-full" />;
});



//mast
// import React, { useEffect, useRef, useState, forwardRef } from "react";
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { Play, RefreshCw, Menu, Info, Settings, Home, Database, Code, Activity } from "lucide-react";

// // --- 1. Helper Components ---

// /**
//  * Navigation Item component for the sidebar.
//  */
// const NavItem = ({ icon, label, active }) => (
//   <div className={`flex flex-col items-center gap-1 cursor-pointer group ${active ? 'text-white' : 'text-blue-300 hover:text-white'}`}>
//     <div className={`p-2 rounded-lg transition-all ${active ? 'bg-white/10' : 'group-hover:bg-white/5'}`}>
//       {icon}
//     </div>
//     {/* Tooltip for better UX */}
//     <span className="text-[10px] font-medium hidden group-hover:block absolute left-14 bg-slate-800 text-white px-2 py-1 rounded shadow-md z-50">
//       {label}
//     </span>
//   </div>
// );

// /**
//  * The core 3D visualization component for Selection Sort.
//  * It uses React's forwardRef to expose control functions to the parent component.
//  */
// const SelectionSort3D = forwardRef(({ onSortStatusChange, onActionChange, setIsSorting: setParentIsSorting }, ref) => {
//   const mountRef = useRef(null);
//   // Initialize Three.js objects using useRef to persist them across renders
//   const sceneRef = useRef(new THREE.Scene());
//   const rendererRef = useRef(null);
//   const cameraRef = useRef(null);
//   const controlsRef = useRef(null);
//   const animationIdRef = useRef(null);
  
//   // Data refs for tracking the visualization state
//   const cubesRef = useRef([]); // Stores all 3D bar meshes
//   const labelsRef = useRef([]); // Stores all 3D number labels
//   const stepsRef = useRef([]); // Stores the calculated steps for the algorithm
//   const currentStepRef = useRef(0);
//   const sortingRef = useRef(false); 
//   const currentMinIndexRef = useRef(-1); // Tracks the index of the current minimum element

//   // Constants for Colors (Hex values)
//   const COLOR_DEFAULT = 0x4ade80; // Green (Unsorted, not currently involved)
//   const COLOR_COMPARE = 0x3b82f6; // Blue (Currently being scanned/compared)
//   const COLOR_MIN     = 0xa855f7; // Purple (Current Minimum found so far)
//   const COLOR_SWAP    = 0xf59e0b; // Amber (Elements actively being swapped)
//   const COLOR_SORTED  = 0x15803d; // Dark Green (Final, sorted position)
  
//   // Initial array data
//   const DEFAULT_ARRAY = [5, 3, 8, 4, 2, 6, 7];

//   // --- Initialization (Runs once on component mount) ---
//   useEffect(() => {
//     if (!mountRef.current) return;

//     const { clientWidth, clientHeight } = mountRef.current;

//     // Scene Setup
//     const scene = sceneRef.current;
//     scene.background = new THREE.Color(0xf0f9ff); // Light blue background

//     // Camera Setup
//     const camera = new THREE.PerspectiveCamera(50, clientWidth / clientHeight, 0.1, 1000);
//     camera.position.set(0, 8, 15); 
//     cameraRef.current = camera;

//     // Renderer Setup
//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setSize(clientWidth, clientHeight);
//     renderer.shadowMap.enabled = true;
//     // Attach renderer to the DOM element
//     mountRef.current.appendChild(renderer.domElement);
//     rendererRef.current = renderer;

//     // Controls Setup (Allows user to rotate and zoom)
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;
//     controls.target.set(0, 4, 0); 
//     controlsRef.current = controls;

//     // Lighting
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
//     scene.add(ambientLight);

//     const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
//     dirLight.position.set(5, 10, 7);
//     dirLight.castShadow = true;
//     dirLight.shadow.mapSize.width = 1024;
//     dirLight.shadow.mapSize.height = 1024;
//     scene.add(dirLight);

//     // Ground Plane
//     const gridHelper = new THREE.GridHelper(30, 30, 0xcbd5e1, 0xe2e8f0);
//     scene.add(gridHelper);

//     // Resize Handler for responsiveness
//     const handleResize = () => {
//       if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
//       const width = mountRef.current.clientWidth;
//       const height = mountRef.current.clientHeight;
//       cameraRef.current.aspect = width / height;
//       cameraRef.current.updateProjectionMatrix();
//       rendererRef.current.setSize(width, height);
//     };

//     // Use ResizeObserver for modern, reliable resizing
//     const resizeObserver = new ResizeObserver(() => handleResize());
//     resizeObserver.observe(mountRef.current);
    
//     // Force initial layout and data setup
//     handleResize();
//     createCubes(DEFAULT_ARRAY);
//     stepsRef.current = generateSelectionSortSteps(DEFAULT_ARRAY);
    
//     // Animation Loop
//     const animate = () => {
//       animationIdRef.current = requestAnimationFrame(animate);
//       controls.update(); 
//       renderer.render(scene, camera);
//     };
//     animate();

//     // Cleanup function
//     return () => {
//       cancelAnimationFrame(animationIdRef.current);
//       resizeObserver.disconnect();
//       if (rendererRef.current) {
//         rendererRef.current.dispose();
//       }
//       if (mountRef.current) {
//         mountRef.current.innerHTML = "";
//       }
//     };
//   }, []);

//   // --- Logic Exposed to Parent via Ref ---
//   React.useImperativeHandle(ref, () => ({
//     /**
//      * Parses input string and creates a new 3D bar array.
//      */
//     generateArray: (inputStr) => {
//       if (sortingRef.current) return;
//       const arr = parseInput(inputStr);
//       if (arr.length === 0) {
//          console.warn("Invalid input or empty array");
//          return;
//       }
//       createCubes(arr);
//       stepsRef.current = generateSelectionSortSteps(arr);
//       currentStepRef.current = 0;
//       currentMinIndexRef.current = -1;
//       onSortStatusChange("Ready");
//       onActionChange("New array generated. Click 'Start Sort' to visualize.");
//     },
//     /**
//      * Starts the visualization of the sorting process.
//      */
//     startSort: () => {
//       if (sortingRef.current || stepsRef.current.length === 0) return;
//       sortingRef.current = true;
//       setParentIsSorting(true);
//       onSortStatusChange("Sorting");
//       onActionChange("Starting Selection Sort...");
//       animateSortStep();
//     }
//   }));

//   // --- Utility Functions ---

//   /** Converts comma-separated string to array of positive numbers. */
//   const parseInput = (str) => 
//     str.split(",").map(v => Number(v.trim())).filter(v => !isNaN(v) && v > 0 && v <= 10); // Max height 10 for visibility

//   /** Renders the 3D bars and labels based on the array values. */
//   const createCubes = (array) => {
//     const scene = sceneRef.current;

//     // Cleanup old elements from the scene
//     cubesRef.current.forEach(c => scene.remove(c));
//     labelsRef.current.forEach(l => scene.remove(l));
//     cubesRef.current = [];
//     labelsRef.current = [];

//     const spacing = 2.5;
//     const arrayLength = array.length;
//     const startX = -((arrayLength - 1) * spacing) / 2;

//     array.forEach((value, index) => {
//       const height = value; 
//       const geometry = new THREE.BoxGeometry(1.5, height, 1.5);
//       // Move pivot point to the bottom center of the bar
//       geometry.translate(0, height/2, 0);
      
//       const material = new THREE.MeshStandardMaterial({ 
//         color: COLOR_DEFAULT, 
//         roughness: 0.3,
//         metalness: 0.1
//       });
      
//       const cube = new THREE.Mesh(geometry, material);
//       cube.position.x = startX + index * spacing;
//       cube.position.y = 0; 
//       cube.castShadow = true;
//       cube.receiveShadow = true;
//       // Store the fixed X position for this index
//       cube.userData = { value: value, isSorted: false, originalX: cube.position.x }; 
      
//       scene.add(cube);
//       cubesRef.current.push(cube);

//       // Create 3D text label (Sprite) for the value
//       const canvas = document.createElement("canvas");
//       canvas.width = 128;
//       canvas.height = 128;
//       const ctx = canvas.getContext("2d");
//       ctx.font = "bold 60px Inter, Arial";
//       ctx.fillStyle = "#000000"; 
//       ctx.textAlign = "center";
//       ctx.textBaseline = "middle";
//       ctx.fillText(value, 64, 64);

//       const texture = new THREE.CanvasTexture(canvas);
//       const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
//       const sprite = new THREE.Sprite(spriteMat);
      
//       sprite.position.set(cube.position.x, height + 1.5, 0);
//       sprite.scale.set(2.5, 2.5, 1);
      
//       scene.add(sprite);
//       labelsRef.current.push(sprite);
//     });

//     if (rendererRef.current && cameraRef.current) {
//       rendererRef.current.render(sceneRef.current, cameraRef.current);
//     }
//   };

//   // --- Selection Sort Algorithm ---
//   /**
//    * Generates an array of steps (actions) needed to perform Selection Sort.
//    */
//   const generateSelectionSortSteps = (array) => {
//     let arr = [...array];
//     let steps = [];
//     let n = arr.length;

//     for (let i = 0; i < n - 1; i++) {
//       let min_idx = i;
      
//       // Step 1: Start of iteration (i)
//       steps.push({ type: "start_pass", index: i, value: arr[i] }); 
//       steps.push({ type: "set_min", index: min_idx, value: arr[min_idx] });

//       for (let j = i + 1; j < n; j++) {
//         // Step 2: Compare current scanner (j) with current minimum (min_idx)
//         steps.push({ type: "compare", indices: [j, min_idx], values: [arr[j], arr[min_idx]], i: i });
        
//         if (arr[j] < arr[min_idx]) {
//           min_idx = j;
//           // Step 3: Found new minimum
//           steps.push({ type: "found_min", index: min_idx, value: arr[min_idx] });
//         }
//       }

//       // Step 4: Swap if needed
//       if (min_idx !== i) {
//         steps.push({ type: "swap", indices: [i, min_idx], values: [arr[i], arr[min_idx]] });
//         // Perform the data swap here to update the state of the array
//         let temp = arr[i];
//         arr[i] = arr[min_idx];
//         arr[min_idx] = temp;
//       }
      
//       // Step 5: Mark i as sorted
//       steps.push({ type: "sorted", index: i });
//     }
//     // Last element is always sorted
//     steps.push({ type: "sorted", index: n - 1 });

//     return steps;
//   };

//   /**
//    * Animates a single step of the sorting algorithm based on the generated steps array.
//    */
//   const animateSortStep = () => {
//     const steps = stepsRef.current;
//     let stepIdx = currentStepRef.current;
//     const cubes = cubesRef.current;
//     const labels = labelsRef.current;

//     // Check for completion
//     if (stepIdx >= steps.length) {
//       sortingRef.current = false;
//       setParentIsSorting(false);
//       onSortStatusChange("Completed");
//       onActionChange("Sorting Completed! Array is fully sorted.");
//       return;
//     }

//     const step = steps[stepIdx];

//     // --- Durations ---
//     const SWAP_DURATION = 3000; // 3.0 seconds for clear swap motion
//     const COMPARE_DURATION = 1200; // 1.2 second pause for comparison highlight
//     const MIN_FOUND_PAUSE = 500; // 0.5 seconds to highlight new minimum
//     const SORTED_PAUSE = 300; // 0.3 seconds to confirm sorted bar

//     // Helper to advance the step and continue
//     const advanceStep = (delay = 0) => {
//         currentStepRef.current = stepIdx + 1;
//         if (sortingRef.current) {
//             setTimeout(animateSortStep, delay);
//         }
//     };

//     // Resets comparison/scanner colors to default/sorted
//     const resetTransientColors = () => {
//         cubes.forEach((c) => {
//             if (c.userData.isSorted) {
//                 c.material.color.setHex(COLOR_SORTED);
//             } else if (c.material.color.getHex() !== COLOR_MIN) {
//                 // Only reset non-sorted and non-minimum colored bars
//                 c.material.color.setHex(COLOR_DEFAULT);
//             }
//         });
//     };

//     if (step.type === "start_pass") {
//         currentMinIndexRef.current = step.index; // Reset min index for new pass
//         onActionChange(`Pass ${step.index + 1}: Finding minimum element from index ${step.index}.`);
//         advanceStep(100); 
//     }
//     else if (step.type === "set_min") {
//         resetTransientColors();
//         const idx = step.index;
//         currentMinIndexRef.current = idx;
//         onActionChange(`Initial Minimum: ${step.value} at index ${idx}`);
//         // Highlight the starting element as the initial minimum
//         if (cubes[idx]) cubes[idx].material.color.setHex(COLOR_MIN); 
        
//         advanceStep(MIN_FOUND_PAUSE);
//     }
//     else if (step.type === "found_min") {
//         const idx = step.index;
//         currentMinIndexRef.current = idx;
//         onActionChange(`NEW MINIMUM found: ${step.value} at index ${idx}.`);
//         // Color the new minimum purple
//         if (cubes[idx]) cubes[idx].material.color.setHex(COLOR_MIN);
        
//         advanceStep(MIN_FOUND_PAUSE);
//     }
//     else if (step.type === "compare") {
//         const [j, minIdx] = step.indices;
//         const i = step.i;
        
//         // 1. Reset all non-sorted bars to default (except the current min)
//         resetTransientColors();
        
//         // 2. Re-highlight the current minimum (in case it was reset)
//         if (cubes[minIdx]) cubes[minIdx].material.color.setHex(COLOR_MIN);
        
//         // 3. Color the scanner (Blue)
//         if (cubes[j]) cubes[j].material.color.setHex(COLOR_COMPARE);

//         onActionChange(`Scanning (j=${j}). Comparing ${step.values[0]} (Blue) vs ${step.values[1]} (Minimum: Purple)`);

//         // Wait for the comparison duration before moving to the next step
//         setTimeout(() => {
//             advanceStep();
//         }, COMPARE_DURATION);
//     } 
//     else if (step.type === "swap") {
//         const [i, j] = step.indices;
//         onActionChange(`SWAP: Moving minimum ${step.values[1]} (j=${j}) to sorted position (i=${i})`);

//         // Highlight elements being swapped
//         if (cubes[i]) cubes[i].material.color.setHex(COLOR_SWAP); // Target (i) is now Amber
//         if (cubes[j]) cubes[j].material.color.setHex(COLOR_SWAP); // Minimum (j) is now Amber

//         const cubeA = cubes[i];
//         const cubeB = cubes[j];
//         const labelA = labels[i];
//         const labelB = labels[j];
        
//         const targetXA = cubeB.position.x; 
//         const targetXB = cubeA.position.x; 
        
//         const startXA = cubeA.position.x;
//         const startXB = cubeB.position.x;

//         // Label Y positions (based on initial height for smooth transition)
//         const heightA = cubeA.userData.value;
//         const heightB = cubeB.userData.value;
//         const baseYA = heightA + 1.5;
//         const baseYB = heightB + 1.5;

//         const startTime = Date.now();

//         // Easing function for smooth animation (ease-in-out effect)
//         const ease = t => t<.5 ? 2*t*t : -1+(4-2*t)*t;

//         const animateSwap = () => {
//             if (!sortingRef.current) return; // Stop if sorting is canceled
//             const now = Date.now();
//             const progress = Math.min((now - startTime) / SWAP_DURATION, 1);
//             const p = ease(progress);

//             // Interpolate X position
//             const currentPosA = startXA + (targetXA - startXA) * p;
//             const currentPosB = startXB + (targetXB - startXB) * p;

//             // Add a slight hop for visual clarity
//             const jumpHeight = 3.0; 
//             const yOffset = Math.sin(p * Math.PI) * jumpHeight;

//             // Update Cube positions
//             cubeA.position.x = currentPosA;
//             cubeB.position.x = currentPosB;
//             cubeA.position.y = yOffset;
//             cubeB.position.y = yOffset;

//             // Update Label positions (move with the bar + jump)
//             labelA.position.x = currentPosA;
//             labelB.position.x = currentPosB;
//             // CRUCIAL: Label Y is the original base height + yOffset
//             labelA.position.y = baseYA + yOffset;
//             labelB.position.y = baseYB + yOffset;

//             if (progress < 1) {
//                 requestAnimationFrame(animateSwap);
//             } else {
//                 // Finalize positions (y=0)
//                 cubeA.position.x = targetXA;
//                 cubeB.position.x = targetXB;
//                 cubeA.position.y = 0; 
//                 cubeB.position.y = 0; 
                
//                 labelA.position.x = targetXA;
//                 labelB.position.x = targetXB;
//                 labelA.position.y = baseYA; 
//                 labelB.position.y = baseYB; 

//                 // CRUCIAL: Swap the cube and label references in the array 
//                 [cubes[i], cubes[j]] = [cubes[j], cubes[i]];
//                 [labels[i], labels[j]] = [labels[j], labels[i]];
                
//                 advanceStep();
//             }
//         };
//         requestAnimationFrame(animateSwap);
//     }
//     else if (step.type === "sorted") {
//         const idx = step.index;
//         onActionChange(`Position ${idx} is now sorted.`);
//         // Mark element as permanently sorted (dark green)
//         if(cubes[idx]) {
//             cubes[idx].userData.isSorted = true;
//             cubes[idx].material.color.setHex(COLOR_SORTED);
//         }
//         advanceStep(SORTED_PAUSE); // Pause for visual confirmation
//     }
//     else {
//         // Fallback for unexpected steps
//         advanceStep();
//     }
//   };

//   // The 3D view is rendered into this div
//   return <div ref={mountRef} className="w-full h-full" />;
// });

// // --- 2. Main Application Component ---

// export default function App() {
//   const [inputValue, setInputValue] = useState("5, 3, 8, 4, 2, 6, 7");
//   const [isSorting, setIsSorting] = useState(false);
//   const [sortStatus, setSortStatus] = useState("Ready"); 
//   const [currentAction, setCurrentAction] = useState("New array generated. Click 'Start Sort' to visualize.");
  
//   const visualizerRef = useRef();

//   const handleStartSort = () => {
//     if (visualizerRef.current) {
//       visualizerRef.current.startSort();
//     }
//   };

//   const handleGenerate = () => {
//     if (visualizerRef.current) {
//       visualizerRef.current.generateArray(inputValue);
//     }
//   };

//   const handleRandom = () => {
//     const min = 2;
//     const max = 10;
//     const length = Math.floor(Math.random() * 5) + 6; // 6 to 10 elements
//     const randomArray = Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
//     const newInputValue = randomArray.join(', ');
//     setInputValue(newInputValue);
//     if (visualizerRef.current) {
//         visualizerRef.current.generateArray(newInputValue);
//     }
//   };

//   return (
//     <div className="flex h-screen w-full bg-slate-100 font-sans overflow-hidden">
//       {/* --- LEFT SIDEBAR (Taskbar) --- */}
//       <aside className="w-16 bg-blue-900 flex flex-col items-center py-6 gap-6 text-white shadow-lg z-20 shrink-0">
//         <div className="p-2 bg-blue-800 rounded-lg mb-4">
//           <Menu size={24} />
//         </div>
//         <NavItem icon={<Home size={20} />} label="Home" active />
//         <NavItem icon={<Database size={20} />} label="Data" />
//         <NavItem icon={<Code size={20} />} label="Algo" />
//         <NavItem icon={<Settings size={20} />} label="Settings" />
//         <div className="mt-auto mb-4">
//           <Info size={20} className="text-blue-300 hover:text-white cursor-pointer" />
//         </div>
//       </aside>

//       {/* --- CENTER (Working Area) --- */}
//       <main className="flex-1 relative bg-blue-50 flex flex-col min-w-0">
//         {/* Header Overlay */}
//         <div className="absolute top-4 left-0 right-0 text-center pointer-events-none z-10">
//           <h1 className="text-3xl font-bold text-blue-900/20 uppercase tracking-widest select-none">
//             3D Selection Sort Visualizer
//           </h1>
//         </div>

//         {/* 3D Canvas Container */}
//         <div className="w-full h-full relative overflow-hidden rounded-tl-3xl border-l-4 border-t-4 border-white/50 shadow-inner group">
//           <SelectionSort3D 
//             ref={visualizerRef} 
//             onSortStatusChange={setSortStatus} 
//             onActionChange={setCurrentAction}
//             setIsSorting={setIsSorting}
//           />
//         </div>
//       </main>

//       {/* --- RIGHT SIDEBAR (Panels) --- */}
//       <aside className="w-80 bg-slate-50 flex flex-col p-4 gap-4 shadow-xl shrink-0 overflow-y-auto border-l border-slate-200">
        
//         {/* Top Panel: Description */}
//         <div className="bg-yellow-100 border-l-4 border-yellow-400 p-5 rounded-xl shadow-sm">
//           <h2 className="font-bold text-lg text-yellow-900 mb-2 flex items-center gap-2">
//             <Code size={18} /> Algorithm: Selection Sort
//           </h2>
//           <p className="text-sm text-yellow-800 mb-3 leading-relaxed">
//             Selection Sort repeatedly finds the minimum element from the unsorted portion of the list and swaps it with the element at the current sorted boundary.
//           </p>
//           <div className="bg-white/60 p-3 rounded text-xs font-mono text-slate-700 border border-yellow-200">
//             <p className="font-semibold text-yellow-700 mb-1">Color Key:</p>
//             <ul className="list-none space-y-1 mt-1">
//                 <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Current Comparison (Scanner)</li>
//                 <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-purple-600"></span> Current Minimum</li>
//                 <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Swapping Elements</li>
//                 <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-700"></span> Sorted Element</li>
//             </ul>
//           </div>
//         </div>

//         {/* Bottom Panel: Operations */}
//         <div className="bg-amber-100 border-l-4 border-amber-500 p-5 rounded-xl shadow-sm flex-1 flex flex-col">
//           <h2 className="font-bold text-lg text-amber-900 mb-4 flex items-center gap-2">
//             <Settings size={18} /> Controls
//           </h2>

//           <div className="space-y-4">
//             {/* Input Group */}
//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-semibold text-amber-800 uppercase">Input Data (2-10)</label>
//               <input
//                 type="text"
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 disabled={isSorting}
//                 className="w-full p-2 rounded border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-slate-700 font-mono text-sm"
//                 placeholder="e.g. 5, 3, 8, 4, 2"
//               />
//               <span className="text-[10px] text-amber-700/60">Comma separated numbers, max height 10 recommended</span>
//             </div>

//             {/* Buttons */}
//             <div className="grid grid-cols-2 gap-2 mt-2">
//               <button
//                 onClick={handleGenerate}
//                 disabled={isSorting}
//                 className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-3 rounded shadow transition-colors text-sm font-medium"
//               >
//                 <RefreshCw size={16} /> Generate
//               </button>
              
//               <button
//                 onClick={handleRandom}
//                 disabled={isSorting}
//                 className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white py-2 px-3 rounded shadow transition-colors text-sm font-medium"
//               >
//                 <Database size={16} /> Random
//               </button>
//             </div>
//              <button
//                 onClick={handleStartSort}
//                 disabled={isSorting}
//                 className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 px-3 rounded-xl shadow-lg transition-colors text-lg font-bold"
//               >
//                 <Play size={20} /> Start Visualization
//               </button>
//           </div>

//           {/* Status Log */}
//           <div className="mt-auto pt-6">
//              <div className="bg-white/50 rounded-xl p-4 border border-amber-200 shadow-lg">
//                 <div className="flex items-center justify-between mb-2">
//                     <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Live Action Log</p>
//                     <Activity size={16} className={`${isSorting ? 'text-green-600 animate-pulse' : 'text-slate-400'}`} />
//                 </div>
                
//                 <div className="text-md font-semibold text-amber-900 mb-1 min-h-[30px] flex items-center">
//                    {currentAction}
//                 </div>
                
//                 <div className="flex items-center gap-2 mt-3 p-2 bg-slate-100 rounded">
//                     <div className={`w-3 h-3 rounded-full ${isSorting ? 'bg-green-500' : 'bg-slate-400'}`}></div>
//                     <span className="text-sm font-mono text-amber-800/80">State: {sortStatus}</span>
//                 </div>
//              </div>
//           </div>

//         </div>
//       </aside>
//     </div>
//   );
// }

// import React, { useEffect, useRef, useState, forwardRef } from "react";
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { Play, RefreshCw, Menu, Info, Settings, Home, Database, Code, Activity } from "lucide-react";

// // --- 1. Helper Components ---

// /**
//  * Navigation Item component for the sidebar.
//  */
// const NavItem = ({ icon, label, active }) => (
//   <div className={`flex flex-col items-center gap-1 cursor-pointer group ${active ? 'text-white' : 'text-blue-300 hover:text-white'}`}>
//     <div className={`p-2 rounded-lg transition-all ${active ? 'bg-white/10' : 'group-hover:bg-white/5'}`}>
//       {icon}
//     </div>
//     {/* Tooltip for better UX */}
//     <span className="text-[10px] font-medium hidden group-hover:block absolute left-14 bg-slate-800 text-white px-2 py-1 rounded shadow-md z-50">
//       {label}
//     </span>
//   </div>
// );

// /**
//  * The core 3D visualization component for Selection Sort.
//  * It uses React's forwardRef to expose control functions to the parent component.
//  */
// const SelectionSort3D = forwardRef(({ onSortStatusChange, onActionChange, setIsSorting: setParentIsSorting }, ref) => {
//   const mountRef = useRef(null);
//   const sceneRef = useRef(new THREE.Scene());
//   const rendererRef = useRef(null);
//   const cameraRef = useRef(null);
//   const controlsRef = useRef(null);
//   const animationIdRef = useRef(null);
  
//   // Data refs for tracking the visualization state
//   const cubesRef = useRef([]);
//   const labelsRef = useRef([]);
//   const stepsRef = useRef([]);
//   const currentStepRef = useRef(0);
//   const sortingRef = useRef(false); 

//   // Constants for Colors (Hex values)
//   const COLOR_DEFAULT = 0x4ade80; // Green
//   const COLOR_COMPARE = 0xffa500; // Orange (Scanning/Checking)
//   const COLOR_MIN     = 0xa855f7; // Purple (Current Minimum)
//   const COLOR_SWAP    = 0xff0000; // Red (Elements being swapped)
//   const COLOR_SORTED  = 0x15803d; // Dark Green (Final Position)
  
//   // Initial array data
//   const DEFAULT_ARRAY = [5, 3, 8, 4, 2, 6, 7];

//   // --- Initialization (Runs once on component mount) ---
//   useEffect(() => {
//     if (!mountRef.current) return;

//     const { clientWidth, clientHeight } = mountRef.current;

//     // Scene Setup
//     const scene = sceneRef.current;
//     scene.background = new THREE.Color(0xf0f9ff); // Light blue background

//     // Camera Setup
//     const camera = new THREE.PerspectiveCamera(50, clientWidth / clientHeight, 0.1, 1000);
//     // Positioned for a clear, isometric view of the array
//     camera.position.set(0, 8, 15); 
//     cameraRef.current = camera;

//     // Renderer Setup
//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setSize(clientWidth, clientHeight);
//     renderer.shadowMap.enabled = true;
//     mountRef.current.appendChild(renderer.domElement);
//     rendererRef.current = renderer;

//     // Controls Setup (Allows user to rotate and zoom)
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;
//     controls.target.set(0, 4, 0); // Focus target on the center of the bars
//     controlsRef.current = controls;

//     // Lighting
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
//     scene.add(ambientLight);

//     const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
//     dirLight.position.set(5, 10, 7);
//     dirLight.castShadow = true;
//     scene.add(dirLight);

//     // Ground Plane
//     const gridHelper = new THREE.GridHelper(30, 30, 0xcbd5e1, 0xe2e8f0);
//     scene.add(gridHelper);

//     // Resize Handler for responsiveness
//     const handleResize = () => {
//       if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
//       const width = mountRef.current.clientWidth;
//       const height = mountRef.current.clientHeight;
//       cameraRef.current.aspect = width / height;
//       cameraRef.current.updateProjectionMatrix();
//       rendererRef.current.setSize(width, height);
//     };

//     // Use ResizeObserver for modern, reliable resizing
//     const resizeObserver = new ResizeObserver(() => handleResize());
//     resizeObserver.observe(mountRef.current);
    
//     // Force initial layout and data setup
//     handleResize();
//     createCubes(DEFAULT_ARRAY);
//     stepsRef.current = generateSelectionSortSteps(DEFAULT_ARRAY);
    
//     // Animation Loop
//     const animate = () => {
//       animationIdRef.current = requestAnimationFrame(animate);
//       controls.update(); // Update controls for damping
//       renderer.render(scene, camera);
//     };
//     animate();

//     // Cleanup function
//     return () => {
//       cancelAnimationFrame(animationIdRef.current);
//       resizeObserver.disconnect();
//       if (rendererRef.current) {
//         // Dispose of resources to prevent memory leaks
//         rendererRef.current.dispose();
//       }
//       if (mountRef.current) {
//         mountRef.current.innerHTML = "";
//       }
//     };
//   }, []);

//   // --- Logic Exposed to Parent via Ref ---
//   React.useImperativeHandle(ref, () => ({
//     /**
//      * Parses input string and creates a new 3D bar array.
//      * @param {string} inputStr - Comma-separated string of numbers.
//      */
//     generateArray: (inputStr) => {
//       if (sortingRef.current) return;
//       const arr = parseInput(inputStr);
//       if (arr.length === 0) {
//          console.warn("Invalid input or empty array");
//          return;
//       }
//       createCubes(arr);
//       stepsRef.current = generateSelectionSortSteps(arr);
//       currentStepRef.current = 0;
//       onSortStatusChange("Ready");
//     },
//     /**
//      * Starts the visualization of the sorting process.
//      */
//     startSort: () => {
//       if (sortingRef.current) return;
//       sortingRef.current = true;
//       setParentIsSorting(true);
//       onSortStatusChange("Sorting");
//       onActionChange("Starting Selection Sort...");
//       animateSortStep();
//     }
//   }));

//   // --- Utility Functions ---

//   /** Converts comma-separated string to array of positive numbers. */
//   const parseInput = (str) => 
//     str.split(",").map(v => Number(v.trim())).filter(v => !isNaN(v) && v > 0);

//   /** Renders the 3D bars and labels based on the array values. */
//   const createCubes = (array) => {
//     const scene = sceneRef.current;

//     // Cleanup old elements from the scene
//     cubesRef.current.forEach(c => scene.remove(c));
//     labelsRef.current.forEach(l => scene.remove(l));
//     cubesRef.current = [];
//     labelsRef.current = [];

//     const spacing = 2.5;
//     // Calculate start X to center the entire array
//     const startX = -((array.length - 1) * spacing) / 2;

//     array.forEach((value, index) => {
//       const height = value; 
//       const geometry = new THREE.BoxGeometry(1.5, height, 1.5);
//       // Move pivot point to the bottom center of the bar
//       geometry.translate(0, height/2, 0);
      
//       const material = new THREE.MeshStandardMaterial({ 
//         color: COLOR_DEFAULT, 
//         roughness: 0.3,
//         metalness: 0.1
//       });
      
//       const cube = new THREE.Mesh(geometry, material);
//       cube.position.x = startX + index * spacing;
//       cube.position.y = 0; 
//       cube.castShadow = true;
//       cube.receiveShadow = true;
//       cube.userData = { value: value, isSorted: false };
      
//       scene.add(cube);
//       cubesRef.current.push(cube);

//       // Create 3D text label (Sprite) for the value
//       const canvas = document.createElement("canvas");
//       canvas.width = 128;
//       canvas.height = 128;
//       const ctx = canvas.getContext("2d");
//       ctx.font = "bold 60px Inter, Arial";
//       ctx.fillStyle = "#000000"; 
//       ctx.textAlign = "center";
//       ctx.textBaseline = "middle";
//       ctx.fillText(value, 64, 64);

//       const texture = new THREE.CanvasTexture(canvas);
//       const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
//       const sprite = new THREE.Sprite(spriteMat);
      
//       sprite.position.set(cube.position.x, height + 1.5, 0);
//       sprite.scale.set(2, 2, 1);
      
//       scene.add(sprite);
//       labelsRef.current.push(sprite);
//     });

//     // Force a render after updating the scene
//     if (rendererRef.current && cameraRef.current) {
//       rendererRef.current.render(sceneRef.current, cameraRef.current);
//     }
//   };

//   // --- Selection Sort Algorithm ---
//   /**
//    * Generates an array of steps (actions) needed to perform Selection Sort.
//    */
//   const generateSelectionSortSteps = (array) => {
//     let arr = [...array];
//     let steps = [];
//     let n = arr.length;

//     for (let i = 0; i < n - 1; i++) {
//       let min_idx = i;
      
//       // Step 1: Highlight initial minimum candidate (i)
//       steps.push({ type: "set_min", index: min_idx, value: arr[min_idx] });

//       for (let j = i + 1; j < n; j++) {
//         // Step 2: Compare current scanner (j) with current minimum (min_idx)
//         steps.push({ type: "compare", indices: [j, min_idx], values: [arr[j], arr[min_idx]] });
        
//         if (arr[j] < arr[min_idx]) {
//           min_idx = j;
//           // Step 3: Found new minimum
//           steps.push({ type: "found_min", index: min_idx, value: arr[min_idx] });
//         }
//       }

//       // Step 4: Swap if needed
//       if (min_idx !== i) {
//         steps.push({ type: "swap", indices: [i, min_idx], values: [arr[i], arr[min_idx]] });
//         // Perform the data swap here to keep track of the current state of the array
//         let temp = arr[i];
//         arr[i] = arr[min_idx];
//         arr[min_idx] = temp;
//       }
      
//       // Step 5: Mark i as sorted
//       steps.push({ type: "sorted", index: i });
//     }
//     // Last element is always sorted
//     steps.push({ type: "sorted", index: n - 1 });

//     return steps;
//   };

//   /**
//    * Animates a single step of the sorting algorithm based on the generated steps array.
//    */
//   const animateSortStep = () => {
//     const steps = stepsRef.current;
//     const stepIdx = currentStepRef.current;

//     // Check for completion
//     if (stepIdx >= steps.length) {
//       sortingRef.current = false;
//       setParentIsSorting(false);
//       onSortStatusChange("Completed");
//       onActionChange("Sorting Completed!");
      
//       // Final coloring
//       cubesRef.current.forEach(c => {
//           c.userData.isSorted = true;
//           c.material.color.setHex(COLOR_SORTED);
//       });
//       return;
//     }

//     const step = steps[stepIdx];
//     const cubes = cubesRef.current;
//     const labels = labelsRef.current;

//     // Duration constants for animation timings
//     const swapDuration = 600;
//     const compareDuration = 400;

//     // Resets comparison/scanner colors to default/sorted
//     const resetTransientColors = () => {
//         cubes.forEach((c) => {
//             if (c.userData.isSorted) {
//                 c.material.color.setHex(COLOR_SORTED);
//             } else {
//                 c.material.color.setHex(COLOR_DEFAULT);
//             }
//         });
//     };

//     if (step.type === "set_min" || step.type === "found_min") {
//         resetTransientColors();
//         const idx = step.index;
//         onActionChange(`Current minimum: ${step.value}`);
//         if (cubes[idx]) cubes[idx].material.color.setHex(COLOR_MIN); // Purple
        
//         currentStepRef.current++;
//         setTimeout(animateSortStep, 400);
//     }
//     else if (step.type === "compare") {
        
//         const [j, minIdx] = step.indices;
        
//         resetTransientColors();

//         onActionChange(`Scanning... Comparing ${step.values[0]} (Scanner) vs ${step.values[1]} (Minimum)`);

//         // Color the current minimum (Purple)
//         if (cubes[minIdx]) cubes[minIdx].material.color.setHex(COLOR_MIN);
//         // Color the scanner (Orange)
//         if (cubes[j]) cubes[j].material.color.setHex(COLOR_COMPARE);

//         setTimeout(() => {
//             currentStepRef.current++;
//             animateSortStep();
//         }, compareDuration);
//     } 
//     else if (step.type === "swap") {
//         const [i, j] = step.indices;
//         onActionChange(`Swapping ${step.values[0]} (Target) and ${step.values[1]} (Min)`);

//         // Highlight elements being swapped
//         cubes[i].material.color.setHex(COLOR_SWAP);
//         cubes[j].material.color.setHex(COLOR_SWAP);

//         const cubeA = cubes[i];
//         const cubeB = cubes[j];
//         const labelA = labels[i];
//         const labelB = labels[j];
        
//         const startXA = cubeA.position.x;
//         const startXB = cubeB.position.x;
//         const startTime = Date.now();

//         // Easing function for smooth animation
//         const ease = t => t<.5 ? 2*t*t : -1+(4-2*t)*t;

//         const animateSwap = () => {
//             const now = Date.now();
//             const progress = Math.min((now - startTime) / swapDuration, 1);
//             const p = ease(progress);

//             const currentPosA = startXA + (startXB - startXA) * p;
//             const currentPosB = startXB + (startXA - startXB) * p;

//             // Add a slight hop for visual clarity
//             const jumpHeight = 3.0; 
//             const yOffset = Math.sin(p * Math.PI) * jumpHeight;

//             cubeA.position.x = currentPosA;
//             cubeB.position.x = currentPosB;
//             cubeA.position.y = yOffset;
//             cubeB.position.y = yOffset;

//             // Move labels with the cubes
//             const heightA = cubeA.userData.value;
//             const heightB = cubeB.userData.value;
//             labelA.position.x = currentPosA;
//             labelA.position.y = heightA + 1.5 + yOffset;
//             labelB.position.x = currentPosB;
//             labelB.position.y = heightB + 1.5 + yOffset;

//             if (progress < 1) {
//                 requestAnimationFrame(animateSwap);
//             } else {
//                 // Finalize positions (y=0)
//                 cubeA.position.y = 0;
//                 cubeB.position.y = 0;
//                 labelA.position.y = heightA + 1.5;
//                 labelB.position.y = heightB + 1.5;

//                 // Crucial step: Swap the cube and label references in the array
//                 [cubes[i], cubes[j]] = [cubes[j], cubes[i]];
//                 [labels[i], labels[j]] = [labels[j], labels[i]];
                
//                 currentStepRef.current++;
//                 animateSortStep();
//             }
//         };
//         animateSwap();
//     }
//     else if (step.type === "sorted") {
//         const idx = step.index;
//         // Mark element as permanently sorted (dark green)
//         if(cubes[idx]) {
//             cubes[idx].userData.isSorted = true;
//             cubes[idx].material.color.setHex(COLOR_SORTED);
//         }
//         currentStepRef.current++;
//         setTimeout(animateSortStep, 50); // Small pause for visual confirmation
//     }
//     else {
//         // Fallback for unexpected steps
//         currentStepRef.current++;
//         animateSortStep();
//     }
//   };

//   // The 3D view is rendered into this div
//   return <div ref={mountRef} className="w-full h-full" />;
// });

// // --- 2. Main Application Component ---

// export default function App() {
//   const [inputValue, setInputValue] = useState("5, 3, 8, 4, 2, 6, 7");
//   const [isSorting, setIsSorting] = useState(false);
//   const [sortStatus, setSortStatus] = useState("Ready"); 
//   const [currentAction, setCurrentAction] = useState("Waiting to start...");
  
//   const visualizerRef = useRef();

//   const handleStartSort = () => {
//     if (visualizerRef.current) {
//       visualizerRef.current.startSort();
//     }
//   };

//   const handleGenerate = () => {
//     if (visualizerRef.current) {
//       visualizerRef.current.generateArray(inputValue);
//       setCurrentAction("Generated new array");
//     }
//   };

//   return (
//     <div className="flex h-screen w-full bg-slate-100 font-sans overflow-hidden">
//       {/* --- LEFT SIDEBAR (Taskbar) --- */}
//       <aside className="w-16 bg-blue-900 flex flex-col items-center py-6 gap-6 text-white shadow-lg z-20 shrink-0">
//         <div className="p-2 bg-blue-800 rounded-lg mb-4">
//           <Menu size={24} />
//         </div>
//         <NavItem icon={<Home size={20} />} label="Home" active />
//         <NavItem icon={<Database size={20} />} label="Data" />
//         <NavItem icon={<Code size={20} />} label="Algo" />
//         <NavItem icon={<Settings size={20} />} label="Settings" />
//         <div className="mt-auto mb-4">
//           <Info size={20} className="text-blue-300 hover:text-white cursor-pointer" />
//         </div>
//       </aside>

//       {/* --- CENTER (Working Area) --- */}
//       <main className="flex-1 relative bg-blue-50 flex flex-col min-w-0">
//         {/* Header Overlay */}
//         <div className="absolute top-4 left-0 right-0 text-center pointer-events-none z-10">
//           <h1 className="text-3xl font-bold text-blue-900/20 uppercase tracking-widest select-none">
//             3D Selection Sort Visualizer
//           </h1>
//         </div>

//         {/* 3D Canvas Container */}
//         <div className="w-full h-full relative overflow-hidden rounded-tl-3xl border-l-4 border-t-4 border-white/50 shadow-inner group">
//           <SelectionSort3D 
//             ref={visualizerRef} 
//             onSortStatusChange={setSortStatus} 
//             onActionChange={setCurrentAction}
//             setIsSorting={setIsSorting}
//           />
//         </div>
//       </main>

//       {/* --- RIGHT SIDEBAR (Panels) --- */}
//       <aside className="w-80 bg-slate-50 flex flex-col p-4 gap-4 shadow-xl shrink-0 overflow-y-auto border-l border-slate-200">
        
//         {/* Top Panel: Description */}
//         <div className="bg-yellow-100 border-l-4 border-yellow-400 p-5 rounded-xl shadow-sm">
//           <h2 className="font-bold text-lg text-yellow-900 mb-2 flex items-center gap-2">
//             <Code size={18} /> Algorithm: Selection Sort
//           </h2>
//           <p className="text-sm text-yellow-800 mb-3 leading-relaxed">
//             Divides the list into two parts: sorted (left) and unsorted (right). It repeatedly finds the minimum element from the unsorted part and swaps it with the first element of the unsorted part.
//           </p>
//           <div className="bg-white/60 p-3 rounded text-xs font-mono text-slate-700 border border-yellow-200">
//             <p className="font-semibold text-yellow-700 mb-1">Pseudocode:</p>
//             <p>1. for i from 0 to N-1</p>
//             <p>2.   min_idx = i</p>
//             <p>3.   for j from i+1 to N</p>
//             <p>4.     if A[j] &lt; A[min_idx]</p>
//             <p>5.       min_idx = j</p>
//             <p>6.   swap(A[i], A[min_idx])</p>
//             <p className="mt-2 text-yellow-900/70">Time Complexity: O(n²)</p>
//           </div>
//         </div>

//         {/* Bottom Panel: Operations */}
//         <div className="bg-amber-100 border-l-4 border-amber-500 p-5 rounded-xl shadow-sm flex-1 flex flex-col">
//           <h2 className="font-bold text-lg text-amber-900 mb-4 flex items-center gap-2">
//             <Settings size={18} /> Operations
//           </h2>

//           <div className="space-y-4">
//             {/* Input Group */}
//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-semibold text-amber-800 uppercase">Input Data (1-9)</label>
//               <input
//                 type="text"
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 disabled={isSorting}
//                 className="w-full p-2 rounded border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-slate-700 font-mono text-sm"
//                 placeholder="e.g. 5, 3, 8, 4, 2"
//               />
//               <span className="text-[10px] text-amber-700/60">Comma separated numbers, max height 9 recommended</span>
//             </div>

//             {/* Buttons */}
//             <div className="grid grid-cols-2 gap-2 mt-2">
//               <button
//                 onClick={handleGenerate}
//                 disabled={isSorting}
//                 className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-3 rounded shadow transition-colors text-sm font-medium"
//               >
//                 <RefreshCw size={16} /> Generate
//               </button>
              
//               <button
//                 onClick={handleStartSort}
//                 disabled={isSorting}
//                 className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 px-3 rounded shadow transition-colors text-sm font-medium"
//               >
//                 <Play size={16} /> Start Sort
//               </button>
//             </div>
//           </div>

//           {/* Status Log */}
//           <div className="mt-auto pt-6">
//              <div className="bg-white/50 rounded p-3 border border-amber-200 shadow-sm">
//                 <div className="flex items-center justify-between mb-2">
//                     <p className="text-xs font-bold text-amber-800">LIVE ACTION:</p>
//                     <Activity size={14} className={`${isSorting ? 'text-green-600 animate-pulse' : 'text-slate-400'}`} />
//                 </div>
                
//                 <div className="text-sm font-medium text-amber-900 mb-1">
//                    {currentAction}
//                 </div>
                
//                 <div className="flex items-center gap-2 mt-2">
//                     <div className={`w-2 h-2 rounded-full ${isSorting ? 'bg-green-500' : 'bg-slate-400'}`}></div>
//                     <span className="text-xs font-mono text-amber-800/70">Status: {sortStatus}</span>
//                 </div>
//              </div>
//           </div>

//         </div>
//       </aside>
//     </div>
//   );
// }

// import React, { useEffect, useRef, useState, forwardRef } from "react";
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { Play, RefreshCw, Menu, Info, Settings, Home, Database, Code, Activity, Check } from "lucide-react";

// // --- 1. Helper Components (Defined first to prevent hoisting issues) ---

// const NavItem = ({ icon, label, active }) => (
//   <div className={`flex flex-col items-center gap-1 cursor-pointer group ${active ? 'text-white' : 'text-blue-300 hover:text-white'}`}>
//     <div className={`p-2 rounded-lg transition-all ${active ? 'bg-white/10' : 'group-hover:bg-white/5'}`}>
//       {icon}
//     </div>
//     <span className="text-[10px] font-medium hidden group-hover:block absolute left-14 bg-slate-800 text-white px-2 py-1 rounded shadow-md z-50">
//       {label}
//     </span>
//   </div>
// );

// const SelectionSort3D = forwardRef(({ onSortStatusChange, onActionChange, setIsSorting: setParentIsSorting }, ref) => {
//   const mountRef = useRef(null);
//   const sceneRef = useRef(new THREE.Scene());
//   const rendererRef = useRef(null);
//   const cameraRef = useRef(null);
//   const controlsRef = useRef(null);
//   const animationIdRef = useRef(null);
  
//   // Data refs
//   const cubesRef = useRef([]);
//   const labelsRef = useRef([]);
//   const stepsRef = useRef([]);
//   const currentStepRef = useRef(0);
//   const sortingRef = useRef(false); 

//   // Constants for Colors
//   const COLOR_DEFAULT = 0x4ade80; // Green
//   const COLOR_COMPARE = 0xffa500; // Orange (Scanning)
//   const COLOR_MIN     = 0xa855f7; // Purple (Current Minimum)
//   const COLOR_SWAP    = 0xff0000; // Red (Swapping)
//   const COLOR_SORTED  = 0x15803d; // Dark Green

//   // --- Initialization ---
//   useEffect(() => {
//     if (!mountRef.current) return;

//     const { clientWidth, clientHeight } = mountRef.current;

//     // Scene Setup
//     const scene = sceneRef.current;
//     scene.background = new THREE.Color(0xf0f9ff); 

//     // Camera
//     const camera = new THREE.PerspectiveCamera(50, clientWidth / clientHeight, 0.1, 1000);
//     camera.position.set(0, 6, 18);
//     cameraRef.current = camera;

//     // Renderer
//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setSize(clientWidth, clientHeight);
//     renderer.shadowMap.enabled = true;
//     mountRef.current.appendChild(renderer.domElement);
//     rendererRef.current = renderer;

//     // Controls
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;
//     controls.target.set(0, 2, 0);
//     controlsRef.current = controls;

//     // Lighting
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
//     scene.add(ambientLight);

//     const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
//     dirLight.position.set(5, 10, 7);
//     dirLight.castShadow = true;
//     scene.add(dirLight);

//     const gridHelper = new THREE.GridHelper(30, 30, 0xcbd5e1, 0xe2e8f0);
//     scene.add(gridHelper);

//     // Resize Handler
//     const handleResize = () => {
//       if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
//       const width = mountRef.current.clientWidth;
//       const height = mountRef.current.clientHeight;
//       cameraRef.current.aspect = width / height;
//       cameraRef.current.updateProjectionMatrix();
//       rendererRef.current.setSize(width, height);
//     };

//     const resizeObserver = new ResizeObserver(() => handleResize());
//     resizeObserver.observe(mountRef.current);
    
//     // Force initial resize
//     handleResize();

//     // Animation Loop
//     const animate = () => {
//       animationIdRef.current = requestAnimationFrame(animate);
//       controls.update();
//       renderer.render(scene, camera);
//     };
//     animate();

//     // Initial default array (Wrapped in timeout to ensure container is ready)
//     setTimeout(() => {
//        if (cubesRef.current.length === 0) {
//           createCubes([5, 3, 8, 4, 2]);
//           stepsRef.current = generateSelectionSortSteps([5, 3, 8, 4, 2]);
//        }
//     }, 100);

//     return () => {
//       cancelAnimationFrame(animationIdRef.current);
//       resizeObserver.disconnect();
//       if (rendererRef.current) {
//         rendererRef.current.dispose();
//       }
//       if (mountRef.current) {
//         mountRef.current.innerHTML = "";
//       }
//     };
//   }, []);

//   // --- Logic Exposed to Parent ---
//   React.useImperativeHandle(ref, () => ({
//     generateArray: (inputStr) => {
//       if (sortingRef.current) return;
//       const arr = parseInput(inputStr);
//       if (arr.length === 0) {
//          console.warn("Invalid input");
//          return;
//       }
//       createCubes(arr);
//       stepsRef.current = generateSelectionSortSteps(arr);
//       currentStepRef.current = 0;
//       onSortStatusChange("Ready");
//     },
//     startSort: () => {
//       if (sortingRef.current) return;
//       sortingRef.current = true;
//       setParentIsSorting(true);
//       onSortStatusChange("Sorting");
//       onActionChange("Starting Selection Sort...");
//       animateSortStep();
//     }
//   }));

//   // --- Helper Functions ---

//   const parseInput = (str) => 
//     str.split(",").map(v => Number(v.trim())).filter(v => !isNaN(v) && v > 0);

//   const createCubes = (array) => {
//     const scene = sceneRef.current;

//     // Cleanup old
//     cubesRef.current.forEach(c => scene.remove(c));
//     labelsRef.current.forEach(l => scene.remove(l));
//     cubesRef.current = [];
//     labelsRef.current = [];

//     const spacing = 2.5;
//     const startX = -((array.length - 1) * spacing) / 2;

//     array.forEach((value, index) => {
//       const height = value; 
//       const geometry = new THREE.BoxGeometry(1.5, height, 1.5);
//       geometry.translate(0, height/2, 0);
      
//       const material = new THREE.MeshStandardMaterial({ 
//         color: COLOR_DEFAULT, 
//         roughness: 0.3,
//         metalness: 0.1
//       });
      
//       const cube = new THREE.Mesh(geometry, material);
//       cube.position.x = startX + index * spacing;
//       cube.position.y = 0; 
//       cube.castShadow = true;
//       cube.receiveShadow = true;
//       cube.userData = { value: value, originalColor: COLOR_DEFAULT, isSorted: false };
      
//       scene.add(cube);
//       cubesRef.current.push(cube);

//       // Text Label
//       const canvas = document.createElement("canvas");
//       canvas.width = 128;
//       canvas.height = 128;
//       const ctx = canvas.getContext("2d");
//       ctx.font = "bold 60px Arial";
//       ctx.fillStyle = "#000000"; 
//       ctx.textAlign = "center";
//       ctx.textBaseline = "middle";
//       ctx.fillText(value, 64, 64);

//       const texture = new THREE.CanvasTexture(canvas);
//       const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
//       const sprite = new THREE.Sprite(spriteMat);
      
//       sprite.position.set(cube.position.x, height + 1.5, 0);
//       sprite.scale.set(2, 2, 1);
      
//       scene.add(sprite);
//       labelsRef.current.push(sprite);
//     });
//   };

//   // --- Selection Sort Logic ---
//   const generateSelectionSortSteps = (array) => {
//     let arr = [...array];
//     let steps = [];
//     let n = arr.length;

//     for (let i = 0; i < n - 1; i++) {
//       let min_idx = i;
      
//       // Step: Highlight initial minimum candidate (i)
//       steps.push({ type: "set_min", index: min_idx, value: arr[min_idx] });

//       for (let j = i + 1; j < n; j++) {
//         // Step: Compare current scanner (j) with current minimum (min_idx)
//         steps.push({ type: "compare", indices: [j, min_idx], values: [arr[j], arr[min_idx]] });
        
//         if (arr[j] < arr[min_idx]) {
//           min_idx = j;
//           // Step: Found new minimum
//           steps.push({ type: "found_min", index: min_idx, value: arr[min_idx] });
//         }
//       }

//       // Step: Swap if needed
//       if (min_idx !== i) {
//         steps.push({ type: "swap", indices: [i, min_idx], values: [arr[i], arr[min_idx]] });
//         let temp = arr[i];
//         arr[i] = arr[min_idx];
//         arr[min_idx] = temp;
//       }
      
//       // Step: Mark i as sorted
//       steps.push({ type: "sorted", index: i });
//     }
//     // Last element is always sorted
//     steps.push({ type: "sorted", index: n - 1 });

//     return steps;
//   };

//   const animateSortStep = () => {
//     const steps = stepsRef.current;
//     const stepIdx = currentStepRef.current;

//     if (stepIdx >= steps.length) {
//       sortingRef.current = false;
//       setParentIsSorting(false);
//       onSortStatusChange("Completed");
//       onActionChange("Sorting Completed!");
      
//       // Force all to sorted color
//       cubesRef.current.forEach(c => {
//           c.userData.isSorted = true;
//           c.material.color.setHex(COLOR_SORTED);
//       });
//       return;
//     }

//     const step = steps[stepIdx];
//     const cubes = cubesRef.current;
//     const labels = labelsRef.current;

//     const resetTransientColors = () => {
//         cubes.forEach((c, idx) => {
//             if (c.userData.isSorted) {
//                 c.material.color.setHex(COLOR_SORTED);
//             } else {
//                 c.material.color.setHex(COLOR_DEFAULT);
//             }
//         });
//     };

//     const swapDuration = 600;
//     const compareDuration = 500;

//     if (step.type === "set_min" || step.type === "found_min") {
//         resetTransientColors();
//         const idx = step.index;
//         onActionChange(`Current minimum: ${step.value}`);
//         if (cubes[idx]) cubes[idx].material.color.setHex(COLOR_MIN); // Purple
        
//         currentStepRef.current++;
//         setTimeout(animateSortStep, 400);
//     }
//     else if (step.type === "compare") {
//         resetTransientColors();
//         const [j, minIdx] = step.indices;
//         onActionChange(`Comparing ${step.values[0]} with min ${step.values[1]}`);

//         // Color the current minimum (Purple)
//         if (cubes[minIdx]) cubes[minIdx].material.color.setHex(COLOR_MIN);
//         // Color the scanner (Orange)
//         if (cubes[j]) cubes[j].material.color.setHex(COLOR_COMPARE);

//         setTimeout(() => {
//             currentStepRef.current++;
//             animateSortStep();
//         }, compareDuration);
//     } 
//     else if (step.type === "swap") {
//         const [i, j] = step.indices;
//         onActionChange(`Swapping ${step.values[0]} and ${step.values[1]}`);

//         // Mark for swap
//         cubes[i].material.color.setHex(COLOR_SWAP);
//         cubes[j].material.color.setHex(COLOR_SWAP);

//         const cubeA = cubes[i];
//         const cubeB = cubes[j];
//         const labelA = labels[i];
//         const labelB = labels[j];
        
//         const startXA = cubeA.position.x;
//         const startXB = cubeB.position.x;
//         const startTime = Date.now();

//         const animateSwap = () => {
//             const now = Date.now();
//             const progress = Math.min((now - startTime) / swapDuration, 1);
//             const ease = t => t<.5 ? 2*t*t : -1+(4-2*t)*t;
//             const p = ease(progress);

//             const currentPosA = startXA + (startXB - startXA) * p;
//             const currentPosB = startXB + (startXA - startXB) * p;

//             // Hop effect
//             const jumpHeight = 2.0;
//             const yOffset = Math.sin(p * Math.PI) * jumpHeight;

//             cubeA.position.x = currentPosA;
//             cubeB.position.x = currentPosB;
//             cubeA.position.y = yOffset;
//             cubeB.position.y = yOffset;

//             // Labels
//             const heightA = cubeA.userData.value;
//             const heightB = cubeB.userData.value;
//             labelA.position.x = currentPosA;
//             labelA.position.y = heightA + 1.5 + yOffset;
//             labelB.position.x = currentPosB;
//             labelB.position.y = heightB + 1.5 + yOffset;

//             if (progress < 1) {
//                 requestAnimationFrame(animateSwap);
//             } else {
//                 // Finalize
//                 cubeA.position.y = 0;
//                 cubeB.position.y = 0;
//                 labelA.position.y = heightA + 1.5;
//                 labelB.position.y = heightB + 1.5;

//                 // Swap in arrays
//                 [cubes[i], cubes[j]] = [cubes[j], cubes[i]];
//                 [labels[i], labels[j]] = [labels[j], labels[i]];
                
//                 currentStepRef.current++;
//                 animateSortStep();
//             }
//         };
//         animateSwap();
//     }
//     else if (step.type === "sorted") {
//         const idx = step.index;
//         if(cubes[idx]) {
//             cubes[idx].userData.isSorted = true;
//             cubes[idx].material.color.setHex(COLOR_SORTED);
//         }
//         currentStepRef.current++;
//         setTimeout(animateSortStep, 50);
//     }
//     else {
//         currentStepRef.current++;
//         animateSortStep();
//     }
//   };

//   return <div ref={mountRef} className="w-full h-full" />;
// });

// // --- 2. Main Application Component ---

// export default function App() {
//   const [inputValue, setInputValue] = useState("5, 3, 8, 4, 2");
//   const [isSorting, setIsSorting] = useState(false);
//   const [sortStatus, setSortStatus] = useState("Ready"); 
//   const [currentAction, setCurrentAction] = useState("Waiting to start...");
  
//   const visualizerRef = useRef();

//   const handleStartSort = () => {
//     if (visualizerRef.current) {
//       visualizerRef.current.startSort();
//     }
//   };

//   const handleGenerate = () => {
//     if (visualizerRef.current) {
//       visualizerRef.current.generateArray(inputValue);
//       setCurrentAction("Generated new array");
//     }
//   };

//   return (
//     <div className="flex h-screen w-full bg-slate-100 font-sans overflow-hidden">
//       {/* --- LEFT SIDEBAR (Taskbar) --- */}
//       <aside className="w-16 bg-blue-900 flex flex-col items-center py-6 gap-6 text-white shadow-lg z-20 shrink-0">
//         <div className="p-2 bg-blue-800 rounded-lg mb-4">
//           <Menu size={24} />
//         </div>
//         <NavItem icon={<Home size={20} />} label="Home" active />
//         <NavItem icon={<Database size={20} />} label="Data" />
//         <NavItem icon={<Code size={20} />} label="Algo" />
//         <NavItem icon={<Settings size={20} />} label="Settings" />
//         <div className="mt-auto mb-4">
//           <Info size={20} className="text-blue-300 hover:text-white cursor-pointer" />
//         </div>
//       </aside>

//       {/* --- CENTER (Working Area) --- */}
//       <main className="flex-1 relative bg-blue-50 flex flex-col min-w-0">
//         {/* Header */}
//         <div className="absolute top-4 left-0 right-0 text-center pointer-events-none z-10">
//           <h1 className="text-3xl font-bold text-blue-900/20 uppercase tracking-widest select-none">
//             Working Area
//           </h1>
//         </div>

//         {/* 3D Canvas Container */}
//         <div className="w-full h-full relative overflow-hidden rounded-tl-3xl border-l-4 border-t-4 border-white/50 shadow-inner group">
          
//           {/* --- ACTION OVERLAY --- */}
//           <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20 transition-all duration-300">
//             <div className={`
//               flex items-center gap-3 px-6 py-3 rounded-full shadow-lg border-2 backdrop-blur-md transition-all
//               ${isSorting 
//                 ? 'bg-white/90 border-blue-400 text-blue-900 scale-100 opacity-100' 
//                 : sortStatus === 'Completed' 
//                   ? 'bg-green-100/90 border-green-500 text-green-800 scale-100 opacity-100'
//                   : 'bg-white/60 border-slate-200 text-slate-500 scale-90 opacity-0 group-hover:opacity-100' 
//               }
//             `}>
//               {sortStatus === 'Completed' ? (
//                  <Check size={20} className="text-green-600" />
//               ) : (
//                  <Activity size={20} className={isSorting ? "animate-pulse text-blue-600" : "text-slate-400"} />
//               )}
//               <span className="font-bold font-mono text-sm tracking-wide">{currentAction}</span>
//             </div>
//           </div>

//           <SelectionSort3D 
//             ref={visualizerRef} 
//             onSortStatusChange={setSortStatus} 
//             onActionChange={setCurrentAction}
//             setIsSorting={setIsSorting}
//           />
//         </div>
//       </main>

//       {/* --- RIGHT SIDEBAR (Panels) --- */}
//       <aside className="w-80 bg-slate-50 flex flex-col p-4 gap-4 shadow-xl shrink-0 overflow-y-auto border-l border-slate-200">
        
//         {/* Top Panel: Description */}
//         <div className="bg-yellow-100 border-l-4 border-yellow-400 p-5 rounded-xl shadow-sm">
//           <h2 className="font-bold text-lg text-yellow-900 mb-2 flex items-center gap-2">
//             <Code size={18} /> Algorithm: Selection Sort
//           </h2>
//           <p className="text-sm text-yellow-800 mb-3 leading-relaxed">
//             Divides the list into two parts: sorted and unsorted. It repeatedly finds the minimum element from the unsorted part and moves it to the end of the sorted part.
//           </p>
//           <div className="bg-white/60 p-3 rounded text-xs font-mono text-slate-700 border border-yellow-200">
//             <p className="font-semibold text-yellow-700 mb-1">Pseudocode:</p>
//             <p>1. for i from 0 to N-1</p>
//             <p>2.   min_idx = i</p>
//             <p>3.   for j from i+1 to N</p>
//             <p>4.     if A[j] &lt; A[min_idx]</p>
//             <p>5.       min_idx = j</p>
//             <p>6.   swap(A[i], A[min_idx])</p>
//             <p className="mt-2 text-yellow-900/70">Time Complexity: O(n²)</p>
//           </div>
//         </div>

//         {/* Bottom Panel: Operations */}
//         <div className="bg-amber-100 border-l-4 border-amber-500 p-5 rounded-xl shadow-sm flex-1 flex flex-col">
//           <h2 className="font-bold text-lg text-amber-900 mb-4 flex items-center gap-2">
//             <Settings size={18} /> Operations
//           </h2>

//           <div className="space-y-4">
//             {/* Input Group */}
//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-semibold text-amber-800 uppercase">Input Data</label>
//               <input
//                 type="text"
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 disabled={isSorting}
//                 className="w-full p-2 rounded border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-slate-700 font-mono text-sm"
//                 placeholder="e.g. 5, 3, 8, 4, 2"
//               />
//               <span className="text-[10px] text-amber-700/60">Comma separated numbers</span>
//             </div>

//             {/* Buttons */}
//             <div className="grid grid-cols-2 gap-2 mt-2">
//               <button
//                 onClick={handleGenerate}
//                 disabled={isSorting}
//                 className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-3 rounded shadow transition-colors text-sm font-medium"
//               >
//                 <RefreshCw size={16} /> Generate
//               </button>
              
//               <button
//                 onClick={handleStartSort}
//                 disabled={isSorting}
//                 className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 px-3 rounded shadow transition-colors text-sm font-medium"
//               >
//                 <Play size={16} /> Sort
//               </button>
//             </div>
//           </div>

//           {/* Status Log */}
//           <div className="mt-auto pt-6">
//              <div className="bg-white/50 rounded p-3 border border-amber-200 shadow-sm">
//                 <div className="flex items-center justify-between mb-2">
//                     <p className="text-xs font-bold text-amber-800">STATUS LOG:</p>
//                 </div>
//                 <div className="text-sm font-medium text-amber-900 mb-1">
//                    {currentAction}
//                 </div>
//              </div>
//           </div>

//         </div>
//       </aside>
//     </div>
//   );
// }


// import React, { useEffect, useRef, useState } from "react";
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// const SelectionSort3D = () => {
//   const mountRef = useRef(null);
//   const rendererRef = useRef(null);
//   const cameraRef = useRef(null);
//   const sceneRef = useRef(new THREE.Scene());
//   const cubesRef = useRef([]);
//   const labelsRef = useRef([]);
//   const stepsRef = useRef([]);
//   const currentStepRef = useRef(0);
//   const [isSorting, setIsSorting] = useState(false);
//   const [inputValue, setInputValue] = useState("5,3,8,4,2");

//   useEffect(() => {
//     const scene = sceneRef.current;

//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     mountRef.current.appendChild(renderer.domElement);
//     rendererRef.current = renderer;

//     const camera = new THREE.PerspectiveCamera(
//       75,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       1000
//     );
//     camera.position.z = 15;
//     camera.position.y = 5;
//     cameraRef.current = camera;

//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;

//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//     scene.add(ambientLight);

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
//     directionalLight.position.set(0, 10, 5);
//     scene.add(directionalLight);

//     const animate = () => {
//       requestAnimationFrame(animate);
//       controls.update();
//       renderer.render(scene, camera);
//     };
//     animate();

//     handleGenerateArray();

//     return () => {
//       renderer.dispose();
//       if (mountRef.current) mountRef.current.innerHTML = "";
//     };
//   }, []);

//   const parseInput = () =>
//     inputValue
//       .split(",")
//       .map((v) => Number(v.trim()))
//       .filter((v) => !isNaN(v) && v > 0);

//   const createCubes = (array) => {
//     const scene = sceneRef.current;
//     cubesRef.current.forEach((cube) => scene.remove(cube));
//     labelsRef.current.forEach((label) => scene.remove(label));
//     cubesRef.current = [];
//     labelsRef.current = [];

//     const maxHeight = Math.max(...array, 1);
//     const scaleFactor = 5 / maxHeight;

//     array.forEach((value, index) => {
//       const height = value * scaleFactor;

//       // Cube
//       const geometry = new THREE.BoxGeometry(1, height, 1);
//       const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
//       const cube = new THREE.Mesh(geometry, material);
//       cube.position.x = index * 1.5 - (array.length * 1.5) / 2;
//       cube.position.y = height / 2;
//       scene.add(cube);
//       cubesRef.current.push(cube);

//       // Label
//       const canvas = document.createElement("canvas");
//       canvas.width = 128;
//       canvas.height = 64;
//       const ctx = canvas.getContext("2d");
//       ctx.font = "48px Arial";
//       ctx.fillStyle = "white";
//       ctx.textAlign = "center";
//       ctx.fillText(value, 64, 48);

//       const texture = new THREE.CanvasTexture(canvas);
//       texture.needsUpdate = true;
//       const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
//       const sprite = new THREE.Sprite(spriteMaterial);
//       sprite.scale.set(1, 0.5, 1);
//       sprite.position.set(cube.position.x, height + 0.5, 0);
//       scene.add(sprite);
//       labelsRef.current.push(sprite);
//     });
//   };

//   const generateSelectionSortSteps = (array) => {
//     let arr = [...array];
//     let steps = [];
//     for (let i = 0; i < arr.length - 1; i++) {
//       let minIndex = i;
//       for (let j = i + 1; j < arr.length; j++) {
//         steps.push({ type: "compare", indices: [minIndex, j] });
//         if (arr[j] < arr[minIndex]) {
//           minIndex = j;
//         }
//       }
//       if (minIndex !== i) {
//         steps.push({ type: "swap", indices: [i, minIndex] });
//         [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
//       }
//     }
//     return steps;
//   };

//   const animateSelectionSort = () => {
//     const step = stepsRef.current[currentStepRef.current];
//     if (!step) {
//       setIsSorting(false);
//       return;
//     }

//     const cubes = cubesRef.current;
//     const labels = labelsRef.current;

//     if (step.type === "compare") {
//       const [i, j] = step.indices;
//       cubes[i].material.color.set(0xffa500);
//       cubes[j].material.color.set(0xffa500);
//     }

//     if (step.type === "swap") {
//       const [i, j] = step.indices;
//       const cubeA = cubes[i];
//       const cubeB = cubes[j];
//       const tempX = cubeA.position.x;
//       cubeA.position.x = cubeB.position.x;
//       cubeB.position.x = tempX;
//       [cubes[i], cubes[j]] = [cubes[j], cubes[i]];

//       const labelA = labels[i];
//       const labelB = labels[j];
//       labelA.position.x = cubeA.position.x;
//       labelB.position.x = cubeB.position.x;
//       [labels[i], labels[j]] = [labels[j], labels[i]];

//       cubeA.material.color.set(0xff0000);
//       cubeB.material.color.set(0xff0000);
//     }

//     setTimeout(() => {
//       cubes.forEach((cube) => cube.material.color.set(0x00ff00));
//       currentStepRef.current++;
//       animateSelectionSort();
//     }, 700);
//   };

//   const handleGenerateArray = () => {
//     const arr = parseInput();
//     if (arr.length === 0) {
//       alert("Enter valid positive numbers separated by commas!");
//       return;
//     }
//     createCubes(arr);
//     stepsRef.current = generateSelectionSortSteps(arr);
//     currentStepRef.current = 0;
//     setIsSorting(false);
//   };

//   const handleStartSort = () => {
//     if (isSorting) return;
//     setIsSorting(true);
//     currentStepRef.current = 0;
//     animateSelectionSort();
//   };

//   return (
//     <>
//       <div
//         ref={mountRef}
//         style={{ width: "100%", height: "100vh", position: "relative" }}
//       />
//       <div
//         style={{
//           position: "absolute",
//           top: "20px",
//           left: "20px",
//           zIndex: 10,
//           display: "flex",
//           flexDirection: "column",
//           gap: "10px",
//         }}
//       >
//         <input
//           type="text"
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//           placeholder="Enter numbers, e.g., 5,3,8,1"
//           style={{ padding: "8px", fontSize: "16px", width: "250px" }}
//         />
//         <button
//           onClick={handleGenerateArray}
//           style={{
//             padding: "10px 20px",
//             fontSize: "16px",
//             background: "green",
//             color: "#fff",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//           }}
//         >
//           Generate Array
//         </button>
//         <button
//           onClick={handleStartSort}
//           style={{
//             padding: "10px 20px",
//             fontSize: "16px",
//             background: "#007bff",
//             color: "#fff",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//           }}
//         >
//           Selection Sort
//         </button>
//       </div>
//     </>
//   );
// };

// export default SelectionSort3D;
