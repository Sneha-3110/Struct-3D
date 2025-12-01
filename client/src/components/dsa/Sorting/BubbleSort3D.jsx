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
 * BubbleSort3DVisualizer.jsx
 *
 * Single-file bubble sort visualizer matching the Selection Sort layout you provided.
 * - Place this as a page/component in your React app.
 * - Uses minimal external deps: three, lucide-react, tailwind for styling.
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
            3D Bubble Sort Visualizer
          </h1>
        </div>

        {/* Canvas container: important - large top padding to match layout */}
        <div className="w-full h-full flex items-center justify-center overflow-hidden pt-24">
          <BubbleSort3D
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
            <Code size={18} /> Algorithm: Bubble Sort
          </h2>
          <p className="text-sm text-yellow-800 mb-3 leading-relaxed">
            Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.
          </p>

          <div className="bg-white/60 p-3 rounded text-xs font-mono text-slate-700 border border-yellow-200">
            <p className="font-semibold text-yellow-700 mb-1">Pseudocode:</p>
            <p>1. for i from 0 to N-1</p>
            <p>2. &nbsp;&nbsp; for j from 0 to N-i-1</p>
            <p>3. &nbsp;&nbsp;&nbsp;&nbsp; if A[j] &gt; A[j+1]</p>
            <p>4. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; swap(A[j], A[j+1])</p>
            <p className="mt-2 text-yellow-900/70">Time Complexity: O(n²)</p>
          </div>
        </div>

        {/* Color Key */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-amber-200 text-sm">
          <p className="font-semibold mb-2">Color Key:</p>
          <div className="flex flex-col gap-2 text-xs">
            <LegendRow color="#3b82f6" label="Comparing (pair)" />
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

// ---------------------- BubbleSort3D component ----------------------
const BubbleSort3D = React.forwardRef(({ onActionChange, onSortStatusChange, setIsSorting }, ref) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const animRef = useRef(null);

  // Data refs
  const cubesRef = useRef([]);
  const labelsRef = useRef([]);
  const stepsRef = useRef([]);
  const currentStepRef = useRef(0);
  const sortingRef = useRef(false);

  // Colors
  const COLOR_DEFAULT = 0x10b981; // green-ish default (kept pleasant)
  const COLOR_COMPARE = 0x3b82f6; // blue
  const COLOR_SWAP = 0xfb923c; // orange
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
    camera.position.set(0, 3.5, 22); // slightly back and above
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

    // Grid helper (subtle)
    // scene.add(new THREE.GridHelper(60, 60, 0xcbd5e1, 0xe2e8f0));

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
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
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
      stepsRef.current = generateSteps(arr);
      currentStepRef.current = 0;
      onSortStatusChange && onSortStatusChange("Ready");
      onActionChange && onActionChange("Array generated");
    },
    startSort() {
      if (sortingRef.current) return;
      if (!stepsRef.current || stepsRef.current.length === 0) {
        // generate from default string if missing
        stepsRef.current = generateSteps(parseInput("5,3,8,4,2"));
      }
      sortingRef.current = true;
      setIsSorting && setIsSorting(true);
      onSortStatusChange && onSortStatusChange("Sorting");
      onActionChange && onActionChange("Starting Bubble Sort...");
      animateStep();
    },
  }));

  // Parse input string -> number array (clip to reasonable heights)
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

    // drop scene a bit by making cube Y negative (keeps top padding visually)
    const baseY = -4.0;

    arr.forEach((val, i) => {
      const height = val;

      const geometry = new THREE.BoxGeometry(2.2, height, 1.8);
      geometry.translate(0, height / 2, 0); // pivot at floor
      const material = new THREE.MeshStandardMaterial({ color: COLOR_DEFAULT, roughness: 0.35, metalness: 0.05 });
      const cube = new THREE.Mesh(geometry, material);
      cube.castShadow = true;
      cube.receiveShadow = true;

      // position
      const x = startX + i * spacing;
      cube.position.set(x, baseY, 0);
      cube.userData = { value: height, sorted: false };
      scene.add(cube);
      cubesRef.current.push(cube);

      // text label (CanvasTexture on Sprite)
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
      sprite.position.set(x, baseY + height + 1.4, 0); // label above top of cube
      scene.add(sprite);
      labelsRef.current.push(sprite);
    });

    // rebuild steps
    stepsRef.current = generateSteps(arr);
    currentStepRef.current = 0;
  }

  // Generate bubble sort steps (compare, swap, sorted)
  function generateSteps(array) {
    const a = [...array];
    const steps = [];
    const n = a.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        steps.push({ type: "compare", i: j, j: j + 1, values: [a[j], a[j + 1]] });
        if (a[j] > a[j + 1]) {
          steps.push({ type: "swap", i: j, j: j + 1, values: [a[j], a[j + 1]] });
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
        }
      }
      steps.push({ type: "sorted", index: n - 1 - i });
    }
    steps.push({ type: "sorted", index: 0 });
    return steps;
  }

  // Reset colors helper
  const resetColors = () => {
    cubesRef.current.forEach((c) => {
      c.material.color.setHex(c.userData.sorted ? COLOR_SORTED : COLOR_DEFAULT);
    });
  };

  // Animate one step
  const animateStep = () => {
    const steps = stepsRef.current;
    const idx = currentStepRef.current;

    if (!steps || idx >= steps.length) {
      // complete
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

    if (step.type === "compare") {
      const a = step.i;
      const b = step.j;
      const cubeA = cubesRef.current[a];
      const cubeB = cubesRef.current[b];
      const labelA = labelsRef.current[a];
      const labelB = labelsRef.current[b];
      onActionChange && onActionChange(`Comparing ${step.values[0]} and ${step.values[1]}`);

      // compare bounce animation
      const duration = 650;
      const start = performance.now();
      cubeA.material.color.setHex(COLOR_COMPARE);
      cubeB.material.color.setHex(COLOR_COMPARE);

      const anim = () => {
        const now = performance.now();
        let t = (now - start) / duration;
        if (t > 1) t = 1;
        const ease = Math.sin(t * Math.PI);
        const lift = ease * 0.9;

        cubeA.position.y = -4.0 + lift;
        cubeB.position.y = -4.0 + lift;

        labelA.position.y = cubeA.position.y + cubeA.userData.value + 1.4;
        labelB.position.y = cubeB.position.y + cubeB.userData.value + 1.4;

        if (t < 1) requestAnimationFrame(anim);
        else {
          cubeA.position.y = -4.0;
          cubeB.position.y = -4.0;
          labelA.position.y = cubeA.position.y + cubeA.userData.value + 1.4;
          labelB.position.y = cubeB.position.y + cubeB.userData.value + 1.4;
          currentStepRef.current++;
          animateStep();
        }
      };
      anim();
      return;
    }

    if (step.type === "swap") {
      const a = step.i;
      const b = step.j;
      const cubeA = cubesRef.current[a];
      const cubeB = cubesRef.current[b];
      const labelA = labelsRef.current[a];
      const labelB = labelsRef.current[b];
      onActionChange && onActionChange(`Swapping ${step.values[0]} and ${step.values[1]}`);

      cubeA.material.color.setHex(COLOR_SWAP);
      cubeB.material.color.setHex(COLOR_SWAP);

      const xA = cubeA.position.x;
      const xB = cubeB.position.x;
      const hA = cubeA.userData.value;
      const hB = cubeB.userData.value;

      const duration = 900;
      const start = performance.now();

      const anim = () => {
        const now = performance.now();
        let t = (now - start) / duration;
        if (t > 1) t = 1;
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        const newXA = xA + (xB - xA) * ease;
        const newXB = xB + (xA - xB) * ease;
        const arc = Math.sin(ease * Math.PI) * 2.6; // arc height

        // A hops up, B goes down to cross (looks crisp)
        cubeA.position.set(newXA, -4.0 + arc, 0);
        cubeB.position.set(newXB, -4.0 - arc * 0.3, 0);

        labelA.position.set(newXA, cubeA.position.y + hA + 1.4, 0);
        labelB.position.set(newXB, cubeB.position.y + hB + 1.4, 0);

        if (t < 1) requestAnimationFrame(anim);
        else {
          // finalize positions and swap references
          cubeA.position.set(newXA, -4.0, 0);
          cubeB.position.set(newXB, -4.0, 0);
          labelA.position.set(newXA, -4.0 + hA + 1.4, 0);
          labelB.position.set(newXB, -4.0 + hB + 1.4, 0);

          // swap in arrays
          [cubesRef.current[a], cubesRef.current[b]] = [cubesRef.current[b], cubesRef.current[a]];
          [labelsRef.current[a], labelsRef.current[b]] = [labelsRef.current[b], labelsRef.current[a]];

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
      currentStepRef.current++;
      setTimeout(animateStep, 80);
      return;
    }
  };

  // render container
  return <div ref={mountRef} className="w-full h-full" />;
});


// import React, { useEffect, useRef, useState } from "react";
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { Play, RefreshCw, Menu, Info, Settings, Home, Database, Code, Activity } from "lucide-react";

// export default function App() {
//   const [inputValue, setInputValue] = useState("5, 3, 8, 4, 2");
//   const [isSorting, setIsSorting] = useState(false);
//   const [sortStatus, setSortStatus] = useState("Ready");
//   const [currentAction, setCurrentAction] = useState("Waiting to start...");
//   const visualizerRef = useRef();

//   const handleStartSort = () => {
//     if (visualizerRef.current) visualizerRef.current.startSort();
//   };

//   const handleGenerate = () => {
//     if (visualizerRef.current) {
//       visualizerRef.current.generateArray(inputValue);
//       setCurrentAction("Generated new array.");
//     }
//   };

//   return (
//     <div className="flex h-screen w-full bg-slate-100 font-sans overflow-hidden">
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

//       <main className="flex-1 relative bg-blue-50 flex flex-col min-w-0">
//         <div className="absolute top-4 left-0 right-0 text-center pointer-events-none z-10">
//           <h1 className="text-3xl font-bold text-blue-900/20 uppercase tracking-widest select-none">
//             Working Area
//           </h1>
//         </div>

//         <div className="w-full h-full relative overflow-hidden rounded-tl-3xl border-l-4 border-t-4 border-white/50 shadow-inner flex items-center justify-center">
//           <BubbleSort3D 
//             ref={visualizerRef} 
//             onSortStatusChange={setSortStatus} 
//             onActionChange={setCurrentAction}
//             setIsSorting={setIsSorting}
//           />
//         </div>
//       </main>

//       <aside className="w-80 bg-slate-50 flex flex-col p-4 gap-4 shadow-xl shrink-0 overflow-y-auto border-l border-slate-200">
//         <div className="bg-yellow-100 border-l-4 border-yellow-400 p-5 rounded-xl shadow-sm">
//           <h2 className="font-bold text-lg text-yellow-900 mb-2 flex items-center gap-2">
//             <Code size={18} /> Algorithm: Bubble Sort
//           </h2>
//           <p className="text-sm text-yellow-800 mb-3 leading-relaxed">
//             Repeatedly steps through the list, compares adjacent elements and swaps them if needed.
//           </p>
//         </div>

//         <div className="bg-amber-100 border-l-4 border-amber-500 p-5 rounded-xl shadow-sm flex-1 flex flex-col">
//           <h2 className="font-bold text-lg text-amber-900 mb-4 flex items-center gap-2">
//             <Settings size={18} /> Operations
//           </h2>

//           <div className="space-y-4">
//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-semibold text-amber-800 uppercase">Input Data</label>
//               <input
//                 type="text"
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 disabled={isSorting}
//                 className="w-full p-2 rounded border border-amber-300 bg-white text-slate-700 font-mono text-sm"
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-2">
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

//           <div className="mt-auto pt-6">
//             <div className="bg-white/50 rounded p-3 border border-amber-200 shadow-sm">
//               <p className="text-xs font-bold text-amber-800 mb-2">LIVE STATUS:</p>
//               <div className="text-sm font-medium text-amber-900 mb-1">{currentAction}</div>
//             </div>
//           </div>
//         </div>
//       </aside>
//     </div>
//   );
// }

// const NavItem = ({ icon, label, active }) => (
//   <div className={`flex flex-col items-center gap-1 cursor-pointer group ${active ? 'text-white' : 'text-blue-300 hover:text-white'}`}>
//     <div className={`p-2 rounded-lg transition-all ${active ? 'bg-white/10' : 'group-hover:bg-white/5'}`}>
//       {icon}
//     </div>
//   </div>
// );

// const BubbleSort3D = React.forwardRef(({ onSortStatusChange, onActionChange, setIsSorting }, ref) => {
//   const mountRef = useRef(null);
//   const sceneRef = useRef(new THREE.Scene());
//   const rendererRef = useRef(null);
//   const cameraRef = useRef(null);
//   const controlsRef = useRef(null);
//   const animationIdRef = useRef(null);

//   const cubesRef = useRef([]);
//   const labelsRef = useRef([]);
//   const stepsRef = useRef([]);
//   const currentStepRef = useRef(0);
//   const sortingRef = useRef(false);

//   const COLOR_DEFAULT = 0x4ade80;
//   const COLOR_COMPARE = 0xffa500;
//   const COLOR_SWAP = 0xff0000;
//   const COLOR_SORTED = 0x15803d;

//   useEffect(() => {
//     if (!mountRef.current) return;
//     const { clientWidth, clientHeight } = mountRef.current;

//     const scene = sceneRef.current;
//     scene.background = new THREE.Color(0xf0f9ff);

//     const camera = new THREE.PerspectiveCamera(50, clientWidth / clientHeight, 0.1, 1000);
//     camera.position.set(0, 1, 14);
//     cameraRef.current = camera;

//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setSize(clientWidth, clientHeight);
//     mountRef.current.appendChild(renderer.domElement);
//     rendererRef.current = renderer;

//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;
//     controls.target.set(0, -1, 0);
//     controlsRef.current = controls;

//     scene.add(new THREE.AmbientLight(0xffffff, 0.6));
//     const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
//     dirLight.position.set(5, 10, 7);
//     scene.add(dirLight);

//     const animate = () => {
//       animationIdRef.current = requestAnimationFrame(animate);
//       controls.update();
//       renderer.render(scene, camera);
//     };
//     animate();

//     createCubes([5, 3, 8, 4, 2]);
//     stepsRef.current = generateSteps([5, 3, 8, 4, 2]);
//   }, []);

//   React.useImperativeHandle(ref, () => ({
//     generateArray: (input) => {
//       if (sortingRef.current) return;
//       const arr = input.split(",").map(v => Number(v.trim())).filter(v => !isNaN(v));
//       createCubes(arr);
//       stepsRef.current = generateSteps(arr);
//       currentStepRef.current = 0;
//     },
//     startSort: () => {
//       if (sortingRef.current) return;
//       sortingRef.current = true;
//       setIsSorting(true);
//       animateStep();
//     }
//   }));

//   const createCubes = (arr) => {
//     const scene = sceneRef.current;
//     cubesRef.current.forEach(c => scene.remove(c));
//     labelsRef.current.forEach(l => scene.remove(l));
//     cubesRef.current = [];
//     labelsRef.current = [];

//     const spacing = 2.5;
//     const startX = -((arr.length - 1) * spacing) / 2;

//     arr.forEach((val, i) => {
//       const h = val;
//       const geo = new THREE.BoxGeometry(1.5, h, 1.5);
//       geo.translate(0, h / 2, 0);
//       const mat = new THREE.MeshStandardMaterial({ color: COLOR_DEFAULT });
//       const cube = new THREE.Mesh(geo, mat);
//       cube.position.set(startX + i * spacing, -2.5, 0);

//       cube.userData.value = val;
//       scene.add(cube);
//       cubesRef.current.push(cube);

//       const canvas = document.createElement("canvas");
//       canvas.width = canvas.height = 128;
//       const ctx = canvas.getContext("2d");
//       ctx.font = "bold 60px Arial";
//       ctx.textAlign = "center";
//       ctx.textBaseline = "middle";
//       ctx.fillText(val, 64, 64);
//       const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas) }));
//       sprite.position.set(cube.position.x, h - 1, 0);
//       sprite.scale.set(2, 2, 1);
//       scene.add(sprite);
//       labelsRef.current.push(sprite);
//     });
//   };

//   const generateSteps = (arr) => {
//     let a = [...arr], steps = [];
//     for (let i = 0; i < a.length - 1; i++) {
//       for (let j = 0; j < a.length - i - 1; j++) {
//         steps.push({ type: "compare", idx: [j, j + 1] });
//         if (a[j] > a[j + 1]) {
//           steps.push({ type: "swap", idx: [j, j + 1] });
//           [a[j], a[j + 1]] = [a[j + 1], a[j]];
//         }
//       }
//       steps.push({ type: "sorted", index: a.length - 1 - i });
//     }
//     steps.push({ type: "sorted", index: 0 });
//     return steps;
//   };

//   const animateStep = () => {
//     const steps = stepsRef.current;
//     const i = currentStepRef.current;
//     if (i >= steps.length) return;

//     const step = steps[i];

//     const cubes = cubesRef.current;
//     const labels = labelsRef.current;

//     const resetColors = () => {
//       cubes.forEach((c) =>
//         c.material.color.setHex(c.userData.sorted ? COLOR_SORTED : COLOR_DEFAULT)
//       );
//     };

//     resetColors();

//     if (step.type === "compare") {
//       const [a, b] = step.idx;

//       // ⭐ UPDATED — COMPARE BOUNCE ANIMATION
//       const duration = 650;
//       const startTime = Date.now();

//       const cubeA = cubes[a];
//       const cubeB = cubes[b];
//       const labelA = labels[a];
//       const labelB = labels[b];

//       const hA = cubeA.userData.value;
//       const hB = cubeB.userData.value;

//       const startYA = cubeA.position.y;
//       const startYB = cubeB.position.y;

//       const anim = () => {
//         const p = Math.min((Date.now() - startTime) / duration, 1);
//         const ease = Math.sin(p * Math.PI);
//         const lift = ease * 0.8; // ⭐ UPDATED – slight hop

//         cubeA.position.y = startYA + lift;
//         cubeB.position.y = startYB + lift;

//         labelA.position.y = hA + 1.5 + lift;
//         labelB.position.y = hB + 1.5 + lift;

//         cubeA.material.color.setHex(COLOR_COMPARE);
//         cubeB.material.color.setHex(COLOR_COMPARE);

//         if (p < 1) requestAnimationFrame(anim);
//         else {
//           cubeA.position.y = startYA;
//           cubeB.position.y = startYB;
//           labelA.position.y = hA + 1.5;
//           labelB.position.y = hB + 1.5;

//           currentStepRef.current++;
//           animateStep();
//         }
//       };
//       anim();
//       return;
//     }

//     if (step.type === "swap") {
//       const [a, b] = step.idx;

//       const cubeA = cubes[a];
//       const cubeB = cubes[b];
//       const labelA = labels[a];
//       const labelB = labels[b];

//       const xA = cubeA.position.x;
//       const xB = cubeB.position.x;
//       const hA = cubeA.userData.value;
//       const hB = cubeB.userData.value;

//       // ⭐ UPDATED – swap arc: one goes up, one down
//       const duration = 900;
//       const startTime = Date.now();

//       const anim = () => {
//         const t = Math.min((Date.now() - startTime) / duration, 1);
//         const ease = t < .5 ? 2*t*t : -1+(4-2*t)*t;

//         const newXA = xA + (xB - xA) * ease;
//         const newXB = xB + (xA - xB) * ease;

//         const yOffset = Math.sin(ease * Math.PI) * 2; // ⭐ UPDATED

//         cubeA.position.set(newXA, yOffset, 0);
//         cubeB.position.set(newXB, -yOffset, 0);

//         labelA.position.set(newXA, hA + 1.5 + yOffset, 0);
//         labelB.position.set(newXB, hB + 1.5 - yOffset, 0);

//         cubeA.material.color.setHex(COLOR_SWAP);
//         cubeB.material.color.setHex(COLOR_SWAP);

//         if (t < 1) requestAnimationFrame(anim);
//         else {
//           cubeA.position.y = 0;
//           cubeB.position.y = 0;
//           labelA.position.y = hA + 1.5;
//           labelB.position.y = hB + 1.5;

//           // swap references
//           [cubesRef.current[a], cubesRef.current[b]] =
//             [cubesRef.current[b], cubesRef.current[a]];
//           [labelsRef.current[a], labelsRef.current[b]] =
//             [labelsRef.current[b], labelsRef.current[a]];

//           currentStepRef.current++;
//           animateStep();
//         }
//       };
//       anim();
//       return;
//     }

//     if (step.type === "sorted") {
//       const idx = step.index;
//       if (cubes[idx]) {
//         cubes[idx].userData.sorted = true;
//         cubes[idx].material.color.setHex(COLOR_SORTED);
//       }
//       currentStepRef.current++;
//       setTimeout(animateStep, 80);
//     }
//   };

//   return <div ref={mountRef} className="w-full h-full" />;
// });

