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
 * InsertionSort3DVisualizer.jsx
 *
 * True Insertion Sort visualization (Option C: key lift + shifts + nice arcs)
 * Layout and styling match the Selection/Bubble visualizers you've been using.
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
            3D Insertion Sort Visualizer
          </h1>
        </div>

        {/* Canvas container */}
        <div className="w-full h-full relative overflow-hidden rounded-tl-3xl border-l-4 border-t-4 border-white/50 shadow-inner flex flex-col items-center pt-28">
          <InsertionSort3D
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
            <Code size={18} /> Algorithm: Insertion Sort
          </h2>
          <p className="text-sm text-yellow-800 mb-3 leading-relaxed">
            Insertion Sort builds the sorted array one element at a time by taking the key
            and inserting it into the correct position in the already-sorted left portion.
          </p>

          <div className="bg-white/60 p-3 rounded text-xs font-mono text-slate-700 border border-yellow-200">
            <p className="font-semibold text-yellow-700 mb-1">Pseudocode:</p>
            <p>1. for i from 1 to N-1</p>
            <p>2. &nbsp;&nbsp; key = A[i]</p>
            <p>3. &nbsp;&nbsp; j = i - 1</p>
            <p>4. &nbsp;&nbsp; while j >= 0 and A[j] &gt; key</p>
            <p>5. &nbsp;&nbsp;&nbsp;&nbsp; A[j+1] = A[j]; j--</p>
            <p>6. &nbsp;&nbsp; A[j+1] = key</p>
            <p className="mt-2 text-yellow-900/70">Time Complexity: O(n²)</p>
          </div>
        </div>

        {/* Color Key */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-amber-200 text-sm">
          <p className="font-semibold mb-2">Color Key:</p>
          <div className="flex flex-col gap-2 text-xs">
            <LegendRow color="#3b82f6" label="Comparing (scanner)" />
            <LegendRow color="#7c3aed" label="Key (picked element)" />
            <LegendRow color="#fb923c" label="Shifting / Inserting" />
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

// ---------------------- InsertionSort3D component ----------------------
const InsertionSort3D = React.forwardRef(({ onActionChange, onSortStatusChange, setIsSorting }, ref) => {
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
  const COLOR_DEFAULT = 0x10b981;
  const COLOR_COMPARE = 0x3b82f6; // blue
  const COLOR_KEY = 0x7c3aed; // purple
  const COLOR_SHIFT = 0xfb923c; // orange
  const COLOR_SORTED = 0x059669;

  // Layout constants
  const spacingRef = useRef(3.2);
  const baseYRef = useRef(-4.0);

  // Camera + layout initialisation
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Scene
    const scene = sceneRef.current;
    scene.background = new THREE.Color(0xf0f9ff);

    // Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 3.5, 22);
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

    // Resize
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

    // initial cubes
    createCubes([5, 3, 8, 4, 2]);

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
      stepsRef.current = generateInsertionSteps(arr);
      currentStepRef.current = 0;
      onSortStatusChange && onSortStatusChange("Ready");
      onActionChange && onActionChange("Array generated");
    },
    startSort() {
      if (sortingRef.current) return;
      if (!stepsRef.current || stepsRef.current.length === 0) {
        stepsRef.current = generateInsertionSteps(parseInput("5,3,8,4,2"));
      }
      sortingRef.current = true;
      setIsSorting && setIsSorting(true);
      onSortStatusChange && onSortStatusChange("Sorting");
      onActionChange && onActionChange("Starting Insertion Sort...");
      animateStep();
    },
  }));

  // Parse input
  const parseInput = (str) =>
    String(str)
      .split(",")
      .map((v) => Number(v.trim()))
      .filter((n) => !isNaN(n) && n > 0)
      .slice(0, 50)
      .map((n) => Math.min(12, Math.max(1, Math.round(n))));

  // Create cubes
  function createCubes(arr) {
    const scene = sceneRef.current;
    cubesRef.current.forEach((c) => scene.remove(c));
    labelsRef.current.forEach((l) => scene.remove(l));
    cubesRef.current = [];
    labelsRef.current = [];

    const spacing = spacingRef.current;
    const startX = -((arr.length - 1) * spacing) / 2;
    const baseY = baseYRef.current;

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
      cube.userData = { value: height, sorted: false, isKey: false };
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

    stepsRef.current = generateInsertionSteps(arr);
    currentStepRef.current = 0;
  }

  // Build insertion sort step list
  // Steps: markKey {type:'markKey', index:i}, compare {type:'compare', j, keyIndex}, shift {type:'shift', from:j, to:j+1}, insert {type:'insert', target:pos, keyIndex}
  function generateInsertionSteps(arr) {
    const a = [...arr];
    const steps = [];
    const n = a.length;
    for (let i = 1; i < n; i++) {
      let key = a[i];
      let keyPos = i;
      steps.push({ type: "markKey", index: i }); // pick key up
      let j = i - 1;
      while (j >= 0 && a[j] > key) {
        // compare j with key
        steps.push({ type: "compare", j: j, keyIndex: i, values: [a[j], key] });
        // shift a[j] to j+1
        steps.push({ type: "shift", from: j, to: j + 1 });
        a[j + 1] = a[j];
        j--;
      }
      const insertPos = j + 1;
      steps.push({ type: "insert", fromIndex: i, toIndex: insertPos, keyValue: key });
      // actually place key in local copy to keep future steps consistent
      // We need to simulate the array mutation
      a.splice(i, 1); // remove original key at i
      a.splice(insertPos, 0, key);
      steps.push({ type: "sortedBoundary", index: i }); // optional visual marker for progress
    }
    // final mark all sorted
    for (let k = 0; k < n; k++) {
      steps.push({ type: "sorted", index: k });
    }
    return steps;
  }

  // Reset colors
  const resetColors = () => {
    cubesRef.current.forEach((c) => {
      c.material.color.setHex(c.userData.sorted ? COLOR_SORTED : COLOR_DEFAULT);
      if (c.userData.isKey) c.material.color.setHex(COLOR_KEY);
    });
  };

  // Helper: compute x position for index
  const xForIndex = (index, length) => {
    const spacing = spacingRef.current;
    const startX = -((length - 1) * spacing) / 2;
    return startX + index * spacing;
  };

  // Animate steps
  const animateStep = () => {
    const steps = stepsRef.current;
    const idx = currentStepRef.current;

    if (!steps || idx >= steps.length) {
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

    // Convenience
    const cubes = cubesRef.current;
    const labels = labelsRef.current;
    const n = cubes.length;

    if (step.type === "markKey") {
      const k = step.index;
      const cube = cubes[k];
      if (!cube) {
        currentStepRef.current++;
        setTimeout(animateStep, 50);
        return;
      }
      // mark as key: purple and lift a bit
      cube.userData.isKey = true;
      cube.material.color.setHex(COLOR_KEY);
      onActionChange && onActionChange(`Picked key at index ${k}`);
      const duration = 400;
      const start = performance.now();
      const startY = cube.position.y;
      const liftAmount = 2.4;
      const anim = () => {
        const now = performance.now();
        let t = (now - start) / duration;
        if (t > 1) t = 1;
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        cube.position.y = startY + ease * liftAmount;
        const lbl = labels[k];
        if (lbl) lbl.position.y = cube.position.y + cube.userData.value + 1.4;
        if (t < 1) requestAnimationFrame(anim);
        else {
          currentStepRef.current++;
          animateStep();
        }
      };
      anim();
      return;
    }

    if (step.type === "compare") {
      const scanIdx = step.j;
      const keyIdx = step.keyIndex;
      const cubeScan = cubes[scanIdx];
      const cubeKey = cubes[keyIdx];
      const labelScan = labels[scanIdx];
      const labelKey = labels[keyIdx];
      onActionChange && onActionChange(`Comparing ${step.values[0]} and key ${step.values[1]}`);

      // scanner bounce, key stays lifted (already purple)
      const duration = 650;
      const start = performance.now();
      cubeScan && cubeScan.material && cubeScan.material.color.setHex(COLOR_COMPARE);

      const anim = () => {
        const now = performance.now();
        let t = (now - start) / duration;
        if (t > 1) t = 1;
        const ease = Math.sin(t * Math.PI);
        const lift = ease * 0.8;
        if (cubeScan) cubeScan.position.y = baseYRef.current + lift;
        if (labelScan && cubeScan) labelScan.position.y = cubeScan.position.y + cubeScan.userData.value + 1.4;
        // key should remain lifted (unchanged) and purple
        if (t < 1) requestAnimationFrame(anim);
        else {
          if (cubeScan) cubeScan.position.y = baseYRef.current;
          if (labelScan && cubeScan) labelScan.position.y = cubeScan.position.y + cubeScan.userData.value + 1.4;
          currentStepRef.current++;
          animateStep();
        }
      };
      anim();
      return;
    }

    if (step.type === "shift") {
      // shift one cube from index 'from' to 'to' (to = from+1)
      const from = step.from;
      const to = step.to;
      const cubeFrom = cubes[from];
      const labelFrom = labels[from];
      onActionChange && onActionChange(`Shifting index ${from} to ${to}`);

      const duration = 700;
      const start = performance.now();
      const xStart = cubeFrom.position.x;
      const xEnd = xForIndex(to, n);
      cubeFrom.material.color.setHex(COLOR_SHIFT);

      const anim = () => {
        const now = performance.now();
        let t = (now - start) / duration;
        if (t > 1) t = 1;
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        const newX = xStart + (xEnd - xStart) * ease;
        cubeFrom.position.x = newX;
        if (labelFrom) labelFrom.position.x = newX;
        if (t < 1) requestAnimationFrame(anim);
        else {
          // finalize position
          cubeFrom.position.x = xEnd;
          if (labelFrom) labelFrom.position.x = xEnd;
          // update arrays: move element from index 'from' to index 'to'
          // Remove element at 'from' and insert at 'to'
          const movedCube = cubes.splice(from, 1)[0];
          const movedLabel = labels.splice(from, 1)[0];
          cubes.splice(to, 0, movedCube);
          labels.splice(to, 0, movedLabel);
          // After shift, positions of other cubes might need minor adjustments (snap them)
          // Snap all cubes to proper x positions to avoid drift
          cubes.forEach((c, idx) => {
            const tx = xForIndex(idx, n);
            c.position.x = tx;
            const lbl = labels[idx];
            if (lbl) lbl.position.x = tx;
          });
          currentStepRef.current++;
          animateStep();
        }
      };
      anim();
      return;
    }

    if (step.type === "insert") {
      // the key was originally at fromIndex and marked lifted. Now insert into toIndex.
      const fromIndex = step.fromIndex;
      const toIndex = step.toIndex;
      // find the key cube: it might be still at some index where userData.isKey true
      const keyIdx = cubes.findIndex((c) => c.userData.isKey);
      if (keyIdx === -1) {
        // fallback: use fromIndex (but indices may have shifted). Attempt to find by value.
        // We'll attempt to find a cube with matching value if available
        const candidate = cubes.find((c) => c.userData.value === step.keyValue && !c.userData.sorted);
        if (candidate) {
          // set it as key
          candidate.userData.isKey = true;
        }
      }
      const keyCubeIndex = cubes.findIndex((c) => c.userData.isKey);
      if (keyCubeIndex === -1) {
        currentStepRef.current++;
        setTimeout(animateStep, 50);
        return;
      }

      const keyCube = cubes[keyCubeIndex];
      const keyLabel = labels[keyCubeIndex];
      onActionChange && onActionChange(`Inserting key ${step.keyValue} at ${toIndex}`);

      // compute final x for toIndex (after shifts the current arrays length n is unchanged)
      const finalX = xForIndex(toIndex, n);

      const duration = 900;
      const start = performance.now();
      const startX = keyCube.position.x;
      const startY = keyCube.position.y;
      const arc = 2.4;

      keyCube.material.color.setHex(COLOR_SHIFT);

      const anim = () => {
        const now = performance.now();
        let t = (now - start) / duration;
        if (t > 1) t = 1;
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        const newX = startX + (finalX - startX) * ease;
        const newY = startY - arc * ease; // drop into place (startY is lifted)
        keyCube.position.set(newX, newY, 0);
        if (keyLabel) keyLabel.position.set(newX, newY + keyCube.userData.value + 1.4, 0);

        if (t < 1) requestAnimationFrame(anim);
        else {
          // finalize, snap to baseY
          keyCube.position.set(finalX, baseYRef.current, 0);
          if (keyLabel) keyLabel.position.set(finalX, baseYRef.current + keyCube.userData.value + 1.4, 0);

          // Remove keyCube from its current spot and insert at toIndex
          const movedCube = cubes.splice(keyCubeIndex, 1)[0];
          const movedLabel = labels.splice(keyCubeIndex, 1)[0];
          cubes.splice(toIndex, 0, movedCube);
          labels.splice(toIndex, 0, movedLabel);

          // clear isKey flag
          movedCube.userData.isKey = false;

          // snap positions
          cubes.forEach((c, idx) => {
            const tx = xForIndex(idx, n);
            c.position.x = tx;
            c.position.y = baseYRef.current;
            const lbl = labels[idx];
            if (lbl) lbl.position.x = tx;
            if (lbl) lbl.position.y = baseYRef.current + c.userData.value + 1.4;
          });

          currentStepRef.current++;
          animateStep();
        }
      };
      anim();
      return;
    }

    if (step.type === "sortedBoundary") {
      // optional: mark that left side up to index is considered processed (no action necessary)
      // we simply wait briefly
      onActionChange && onActionChange(`Processed up to ${step.index}`);
      currentStepRef.current++;
      setTimeout(animateStep, 120);
      return;
    }

    if (step.type === "sorted") {
      const idxSorted = step.index;
      const c = cubes[idxSorted];
      if (c) {
        c.userData.sorted = true;
        c.material.color.setHex(COLOR_SORTED);
      }
      currentStepRef.current++;
      setTimeout(animateStep, 60);
      return;
    }

    // fallback
    currentStepRef.current++;
    setTimeout(animateStep, 30);
  };

  return <div ref={mountRef} className="w-full h-full" />;
});




// import React, { useEffect, useRef, useState } from "react";
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { Play, RefreshCw, Menu, Info, Settings, Home, Database, Code, Activity } from "lucide-react";

// // --- Main Application Component ---
// export default function App() {
//   // State for the sorting visualization
//   const [inputValue, setInputValue] = useState("5, 3, 8, 4, 2");
//   const [isSorting, setIsSorting] = useState(false);
//   const [sortStatus, setSortStatus] = useState("Ready"); // 'Ready', 'Sorting', 'Completed'
//   const [currentAction, setCurrentAction] = useState("Waiting to start...");
  
//   // Refs for Three.js communication
//   const visualizerRef = useRef();

//   const handleStartSort = () => {
//     if (visualizerRef.current) {
//       visualizerRef.current.startSort();
//     }
//   };

//   const handleGenerate = () => {
//     if (visualizerRef.current) {
//       visualizerRef.current.generateArray(inputValue);
//       setCurrentAction("Generated new array.");
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
//         {/* Header/Title Area inside working area */}
//         <div className="absolute top-4 left-0 right-0 text-center pointer-events-none z-10">
//           <h1 className="text-3xl font-bold text-blue-900/20 uppercase tracking-widest select-none">
//             Working Area
//           </h1>
//         </div>

//         {/* 3D Canvas Container */}
//         <div className="w-full h-full relative overflow-hidden rounded-tl-3xl border-l-4 border-t-4 border-white/50 shadow-inner">
//           <InsertionSort3D 
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
//             <Code size={18} /> Algorithm: Insertion Sort
//           </h2>
//           <p className="text-sm text-yellow-800 mb-3 leading-relaxed">
//             Builds the sorted array one item at a time. It takes each element and inserts it into its correct position in the already sorted part of the list.
//           </p>
//           <div className="bg-white/60 p-3 rounded text-xs font-mono text-slate-700 border border-yellow-200">
//             <p className="font-semibold text-yellow-700 mb-1">Pseudocode:</p>
//             <p>1. i ← 1</p>
//             <p>2. while i &lt; length(A)</p>
//             <p>3.   j ← i</p>
//             <p>4.   while j &gt; 0 and A[j-1] &gt; A[j]</p>
//             <p>5.     swap A[j] and A[j-1]</p>
//             <p>6.     j ← j - 1</p>
//             <p>7.   i ← i + 1</p>
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
//                     <p className="text-xs font-bold text-amber-800">LIVE STATUS:</p>
//                     <Activity size={14} className={`${isSorting ? 'text-green-600 animate-pulse' : 'text-slate-400'}`} />
//                 </div>
                
//                 <div className="text-sm font-medium text-amber-900 mb-1">
//                    {currentAction}
//                 </div>
                
//                 <div className="flex items-center gap-2 mt-2">
//                     <div className={`w-2 h-2 rounded-full ${isSorting ? 'bg-green-500' : 'bg-slate-400'}`}></div>
//                     <span className="text-xs font-mono text-amber-800/70">{isSorting ? "Running..." : "Idle"}</span>
//                 </div>
//              </div>
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
//     <span className="text-[10px] font-medium hidden group-hover:block absolute left-14 bg-slate-800 text-white px-2 py-1 rounded shadow-md z-50">
//       {label}
//     </span>
//   </div>
// );


// // --- Three.js Component ---
// const InsertionSort3D = React.forwardRef(({ onSortStatusChange, onActionChange, setIsSorting: setParentIsSorting }, ref) => {
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
//   const COLOR_COMPARE = 0xffa500; // Orange
//   const COLOR_SWAP = 0xff0000;    // Red
//   const COLOR_SORTED = 0x15803d;  // Dark Green (for final state)

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

//     // Animation Loop
//     const animate = () => {
//       animationIdRef.current = requestAnimationFrame(animate);
//       controls.update();
//       renderer.render(scene, camera);
//     };
//     animate();

//     // Initial default array
//     createCubes([5, 3, 8, 4, 2]);
//     stepsRef.current = generateInsertionSortSteps([5, 3, 8, 4, 2]);

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
//       stepsRef.current = generateInsertionSortSteps(arr);
//       currentStepRef.current = 0;
//       onSortStatusChange("Ready");
//     },
//     startSort: () => {
//       if (sortingRef.current) return;
//       sortingRef.current = true;
//       setParentIsSorting(true);
//       onSortStatusChange("Sorting");
//       onActionChange("Starting Insertion Sort...");
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
//       cube.userData = { value: value, originalColor: COLOR_DEFAULT };
      
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

//   // --- Insertion Sort Logic (Swapping approach for visualization) ---
//   const generateInsertionSortSteps = (array) => {
//     let arr = [...array];
//     let steps = [];
//     // Iterate from the second element
//     for (let i = 1; i < arr.length; i++) {
//       let j = i - 1;
      
//       // Move elements of arr[0..i-1], that are greater than key, to one position ahead
//       // For visualization, we simulate this as repeated swaps backwards
//       while (j >= 0 && arr[j] > arr[j + 1]) {
//         steps.push({ type: "compare", indices: [j, j + 1], values: [arr[j], arr[j+1]] });
        
//         // Swap
//         steps.push({ type: "swap", indices: [j, j + 1], values: [arr[j], arr[j+1]] });
//         [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]];
        
//         j--;
//       }
//     }
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
//       cubesRef.current.forEach(c => c.material.color.setHex(COLOR_SORTED));
//       return;
//     }

//     const step = steps[stepIdx];
//     const cubes = cubesRef.current;
//     const labels = labelsRef.current;

//     const resetColors = () => {
//       cubes.forEach((c) => {
//           // Simple reset to default blue/green
//           c.material.color.setHex(COLOR_DEFAULT); 
//       });
//     };

//     // Animation Settings
//     const swapDuration = 600; // ms
//     const compareDuration = 700; // ms

//     if (step.type === "compare") {
//       resetColors();
//       const [i, j] = step.indices;
      
//       // Log Action
//       onActionChange(`Comparing ${step.values[0]} and ${step.values[1]}`);

//       cubes[i].material.color.setHex(COLOR_COMPARE); // Orange
//       cubes[j].material.color.setHex(COLOR_COMPARE);
      
//       setTimeout(() => {
//         currentStepRef.current++;
//         animateSortStep();
//       }, compareDuration); 
//     } 
//     else if (step.type === "swap") {
//       const [i, j] = step.indices;
      
//       // Log Action
//       onActionChange(`Inserting ${step.values[1]}...`);

//       cubes[i].material.color.setHex(COLOR_SWAP); // Red
//       cubes[j].material.color.setHex(COLOR_SWAP);

//       const cubeA = cubes[i];
//       const cubeB = cubes[j];
//       const labelA = labels[i];
//       const labelB = labels[j];
      
//       const startXA = cubeA.position.x;
//       const startXB = cubeB.position.x;
//       const startTime = Date.now();

//       const animateSwap = () => {
//         const now = Date.now();
//         const progress = Math.min((now - startTime) / swapDuration, 1);
        
//         // Smooth ease-in-out
//         const ease = t => t<.5 ? 2*t*t : -1+(4-2*t)*t;
//         const p = ease(progress);

//         // X Interpolation
//         const currentPosA = startXA + (startXB - startXA) * p;
//         const currentPosB = startXB + (startXA - startXB) * p;

//         // Y Interpolation (Arc/Hop effect)
//         const jumpHeight = 3;
//         const yOffset = Math.sin(p * Math.PI) * jumpHeight;

//         cubeA.position.x = currentPosA;
//         cubeB.position.x = currentPosB;
        
//         // Add hop
//         cubeA.position.y = yOffset;
//         cubeB.position.y = yOffset;

//         // Move Labels with cubes
//         const heightA = cubeA.userData.value;
//         const heightB = cubeB.userData.value;
//         labelA.position.x = currentPosA;
//         labelA.position.y = heightA + 1.5 + yOffset;
        
//         labelB.position.x = currentPosB;
//         labelB.position.y = heightB + 1.5 + yOffset;

//         if (progress < 1) {
//           requestAnimationFrame(animateSwap);
//         } else {
//           // Snap to final pos
//           cubeA.position.y = 0;
//           cubeB.position.y = 0;
//           labelA.position.y = heightA + 1.5;
//           labelB.position.y = heightB + 1.5;

//           // Swap in array
//           [cubes[i], cubes[j]] = [cubes[j], cubes[i]];
//           [labels[i], labels[j]] = [labels[j], labels[i]];
          
//           currentStepRef.current++;
//           animateSortStep();
//         }
//       };
//       animateSwap();
//     }
//   };

//   return <div ref={mountRef} className="w-full h-full" />;
// });

// import React, { useEffect, useRef, useState } from "react";
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { Play, RefreshCw, Menu, Info, Settings, Home, Database, Code, Activity } from "lucide-react";

// // --- Main Application Component ---
// export default function App() {
//   // State for the sorting visualization
//   const [inputValue, setInputValue] = useState("5, 3, 8, 4, 2");
//   const [isSorting, setIsSorting] = useState(false);
//   const [sortStatus, setSortStatus] = useState("Ready"); // 'Ready', 'Sorting', 'Completed'
//   const [currentAction, setCurrentAction] = useState("Waiting to start...");
  
//   // Refs for Three.js communication
//   const visualizerRef = useRef();

//   const handleStartSort = () => {
//     if (visualizerRef.current) {
//       visualizerRef.current.startSort();
//     }
//   };

//   const handleGenerate = () => {
//     if (visualizerRef.current) {
//       visualizerRef.current.generateArray(inputValue);
//       setCurrentAction("Generated new array.");
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
//         {/* Header/Title Area inside working area */}
//         <div className="absolute top-4 left-0 right-0 text-center pointer-events-none z-10">
//           <h1 className="text-3xl font-bold text-blue-900/20 uppercase tracking-widest select-none">
//             Working Area
//           </h1>
//         </div>

//         {/* 3D Canvas Container */}
//         <div className="w-full h-full relative overflow-hidden rounded-tl-3xl border-l-4 border-t-4 border-white/50 shadow-inner">
//           <InsertionSort3D 
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
//             <Code size={18} /> Algorithm: Insertion Sort
//           </h2>
//           <p className="text-sm text-yellow-800 mb-3 leading-relaxed">
//             Builds the sorted array one item at a time. It takes each element and inserts it into its correct position in the already sorted part of the list.
//           </p>
//           <div className="bg-white/60 p-3 rounded text-xs font-mono text-slate-700 border border-yellow-200">
//             <p className="font-semibold text-yellow-700 mb-1">Pseudocode:</p>
//             <p>1. i ← 1</p>
//             <p>2. while i &lt; length(A)</p>
//             <p>3.   j ← i</p>
//             <p>4.   while j &gt; 0 and A[j-1] &gt; A[j]</p>
//             <p>5.     swap A[j] and A[j-1]</p>
//             <p>6.     j ← j - 1</p>
//             <p>7.   i ← i + 1</p>
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
//                     <p className="text-xs font-bold text-amber-800">LIVE STATUS:</p>
//                     <Activity size={14} className={`${isSorting ? 'text-green-600 animate-pulse' : 'text-slate-400'}`} />
//                 </div>
                
//                 <div className="text-sm font-medium text-amber-900 mb-1">
//                    {currentAction}
//                 </div>
                
//                 <div className="flex items-center gap-2 mt-2">
//                     <div className={`w-2 h-2 rounded-full ${isSorting ? 'bg-green-500' : 'bg-slate-400'}`}></div>
//                     <span className="text-xs font-mono text-amber-800/70">{isSorting ? "Running..." : "Idle"}</span>
//                 </div>
//              </div>
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
//     <span className="text-[10px] font-medium hidden group-hover:block absolute left-14 bg-slate-800 text-white px-2 py-1 rounded shadow-md z-50">
//       {label}
//     </span>
//   </div>
// );


// // --- Three.js Component ---
// const InsertionSort3D = React.forwardRef(({ onSortStatusChange, onActionChange, setIsSorting: setParentIsSorting }, ref) => {
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
//   const COLOR_COMPARE = 0xffa500; // Orange
//   const COLOR_SWAP = 0xff0000;    // Red
//   const COLOR_SORTED = 0x15803d;  // Dark Green (for final state)

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

//     // Animation Loop
//     const animate = () => {
//       animationIdRef.current = requestAnimationFrame(animate);
//       controls.update();
//       renderer.render(scene, camera);
//     };
//     animate();

//     // Initial default array
//     createCubes([5, 3, 8, 4, 2]);
//     stepsRef.current = generateInsertionSortSteps([5, 3, 8, 4, 2]);

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
//       stepsRef.current = generateInsertionSortSteps(arr);
//       currentStepRef.current = 0;
//       onSortStatusChange("Ready");
//     },
//     startSort: () => {
//       if (sortingRef.current) return;
//       sortingRef.current = true;
//       setParentIsSorting(true);
//       onSortStatusChange("Sorting");
//       onActionChange("Starting Insertion Sort...");
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
//       cube.userData = { value: value, originalColor: COLOR_DEFAULT };
      
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

//   // --- Insertion Sort Logic (Swapping approach for visualization) ---
//   const generateInsertionSortSteps = (array) => {
//     let arr = [...array];
//     let steps = [];
//     // Iterate from the second element
//     for (let i = 1; i < arr.length; i++) {
//       let j = i - 1;
      
//       // Move elements of arr[0..i-1], that are greater than key, to one position ahead
//       // For visualization, we simulate this as repeated swaps backwards
//       while (j >= 0 && arr[j] > arr[j + 1]) {
//         steps.push({ type: "compare", indices: [j, j + 1], values: [arr[j], arr[j+1]] });
        
//         // Swap
//         steps.push({ type: "swap", indices: [j, j + 1], values: [arr[j], arr[j+1]] });
//         [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]];
        
//         j--;
//       }
//     }
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
//       cubesRef.current.forEach(c => c.material.color.setHex(COLOR_SORTED));
//       return;
//     }

//     const step = steps[stepIdx];
//     const cubes = cubesRef.current;
//     const labels = labelsRef.current;

//     const resetColors = () => {
//       cubes.forEach((c) => {
//           // Simple reset to default blue/green
//           c.material.color.setHex(COLOR_DEFAULT); 
//       });
//     };

//     // Animation Settings
//     const swapDuration = 600; // ms
//     const compareDuration = 700; // ms

//     if (step.type === "compare") {
//       resetColors();
//       const [i, j] = step.indices;
      
//       // Log Action
//       onActionChange(`Comparing ${step.values[0]} and ${step.values[1]}`);

//       cubes[i].material.color.setHex(COLOR_COMPARE); // Orange
//       cubes[j].material.color.setHex(COLOR_COMPARE);
      
//       setTimeout(() => {
//         currentStepRef.current++;
//         animateSortStep();
//       }, compareDuration); 
//     } 
//     else if (step.type === "swap") {
//       const [i, j] = step.indices;
      
//       // Log Action
//       onActionChange(`Inserting ${step.values[1]}...`);

//       cubes[i].material.color.setHex(COLOR_SWAP); // Red
//       cubes[j].material.color.setHex(COLOR_SWAP);

//       const cubeA = cubes[i];
//       const cubeB = cubes[j];
//       const labelA = labels[i];
//       const labelB = labels[j];
      
//       const startXA = cubeA.position.x;
//       const startXB = cubeB.position.x;
//       const startTime = Date.now();

//       const animateSwap = () => {
//         const now = Date.now();
//         const progress = Math.min((now - startTime) / swapDuration, 1);
        
//         // Smooth ease-in-out
//         const ease = t => t<.5 ? 2*t*t : -1+(4-2*t)*t;
//         const p = ease(progress);

//         // X Interpolation
//         const currentPosA = startXA + (startXB - startXA) * p;
//         const currentPosB = startXB + (startXA - startXB) * p;

//         // Y Interpolation (Arc/Hop effect)
//         const jumpHeight = 3;
//         const yOffset = Math.sin(p * Math.PI) * jumpHeight;

//         cubeA.position.x = currentPosA;
//         cubeB.position.x = currentPosB;
        
//         // Add hop
//         cubeA.position.y = yOffset;
//         cubeB.position.y = yOffset;

//         // Move Labels with cubes
//         const heightA = cubeA.userData.value;
//         const heightB = cubeB.userData.value;
//         labelA.position.x = currentPosA;
//         labelA.position.y = heightA + 1.5 + yOffset;
        
//         labelB.position.x = currentPosB;
//         labelB.position.y = heightB + 1.5 + yOffset;

//         if (progress < 1) {
//           requestAnimationFrame(animateSwap);
//         } else {
//           // Snap to final pos
//           cubeA.position.y = 0;
//           cubeB.position.y = 0;
//           labelA.position.y = heightA + 1.5;
//           labelB.position.y = heightB + 1.5;

//           // Swap in array
//           [cubes[i], cubes[j]] = [cubes[j], cubes[i]];
//           [labels[i], labels[j]] = [labels[j], labels[i]];
          
//           currentStepRef.current++;
//           animateSortStep();
//         }
//       };
//       animateSwap();
//     }
//   };

//   return <div ref={mountRef} className="w-full h-full" />;
// });

// // import React, { useEffect, useRef, useState } from "react";
// // import * as THREE from "three";
// // import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// // const InsertionSort3D = () => {
// //   const mountRef = useRef(null);
// //   const rendererRef = useRef(null);
// //   const cameraRef = useRef(null);
// //   const sceneRef = useRef(new THREE.Scene());
// //   const cubesRef = useRef([]);
// //   const labelsRef = useRef([]);
// //   const stepsRef = useRef([]);
// //   const currentStepRef = useRef(0);
// //   const [isSorting, setIsSorting] = useState(false);
// //   const [inputValue, setInputValue] = useState("5,3,8,4,2");

// //   useEffect(() => {
// //     const scene = sceneRef.current;

// //     const renderer = new THREE.WebGLRenderer({ antialias: true });
// //     renderer.setSize(window.innerWidth, window.innerHeight);
// //     mountRef.current.appendChild(renderer.domElement);
// //     rendererRef.current = renderer;

// //     const camera = new THREE.PerspectiveCamera(
// //       75,
// //       window.innerWidth / window.innerHeight,
// //       0.1,
// //       1000
// //     );
// //     camera.position.z = 15;
// //     camera.position.y = 5;
// //     cameraRef.current = camera;

// //     const controls = new OrbitControls(camera, renderer.domElement);
// //     controls.enableDamping = true;

// //     const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// //     scene.add(ambientLight);

// //     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
// //     directionalLight.position.set(0, 10, 5);
// //     scene.add(directionalLight);

// //     const animate = () => {
// //       requestAnimationFrame(animate);
// //       controls.update();
// //       renderer.render(scene, camera);
// //     };
// //     animate();

// //     handleGenerateArray();

// //     return () => {
// //       renderer.dispose();
// //       if (mountRef.current) mountRef.current.innerHTML = "";
// //     };
// //   }, []);

// //   const parseInput = () =>
// //     inputValue
// //       .split(",")
// //       .map((v) => Number(v.trim()))
// //       .filter((v) => !isNaN(v) && v > 0);

// //   const createCubes = (array) => {
// //     const scene = sceneRef.current;
// //     cubesRef.current.forEach((cube) => scene.remove(cube));
// //     labelsRef.current.forEach((label) => scene.remove(label));
// //     cubesRef.current = [];
// //     labelsRef.current = [];

// //     const maxHeight = Math.max(...array, 1);
// //     const scaleFactor = 5 / maxHeight;

// //     array.forEach((value, index) => {
// //       const height = value * scaleFactor;

// //       // Cube
// //       const geometry = new THREE.BoxGeometry(1, height, 1);
// //       const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
// //       const cube = new THREE.Mesh(geometry, material);
// //       cube.position.x = index * 1.5 - (array.length * 1.5) / 2;
// //       cube.position.y = height / 2;
// //       scene.add(cube);
// //       cubesRef.current.push(cube);

// //       // Label
// //       const canvas = document.createElement("canvas");
// //       canvas.width = 128;
// //       canvas.height = 64;
// //       const ctx = canvas.getContext("2d");
// //       ctx.font = "48px Arial";
// //       ctx.fillStyle = "white";
// //       ctx.textAlign = "center";
// //       ctx.fillText(value, 64, 48);

// //       const texture = new THREE.CanvasTexture(canvas);
// //       texture.needsUpdate = true;
// //       const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
// //       const sprite = new THREE.Sprite(spriteMaterial);
// //       sprite.scale.set(1, 0.5, 1);
// //       sprite.position.set(cube.position.x, height + 0.5, 0);
// //       scene.add(sprite);
// //       labelsRef.current.push(sprite);
// //     });
// //   };

// //   const generateInsertionSortSteps = (array) => {
// //     let arr = [...array];
// //     let steps = [];
// //     for (let i = 1; i < arr.length; i++) {
// //       let key = arr[i];
// //       let j = i - 1;
// //       while (j >= 0 && arr[j] > key) {
// //         steps.push({ type: "compare", indices: [j, j + 1] });
// //         steps.push({ type: "swap", indices: [j, j + 1] });
// //         [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]];
// //         j--;
// //       }
// //     }
// //     return steps;
// //   };

// //   const animateInsertionSort = () => {
// //     const step = stepsRef.current[currentStepRef.current];
// //     if (!step) {
// //       setIsSorting(false);
// //       return;
// //     }

// //     const cubes = cubesRef.current;
// //     const labels = labelsRef.current;

// //     if (step.type === "compare") {
// //       const [i, j] = step.indices;
// //       cubes[i].material.color.set(0xffa500);
// //       cubes[j].material.color.set(0xffa500);
// //     }

// //     if (step.type === "swap") {
// //       const [i, j] = step.indices;
// //       const cubeA = cubes[i];
// //       const cubeB = cubes[j];
// //       const tempX = cubeA.position.x;
// //       cubeA.position.x = cubeB.position.x;
// //       cubeB.position.x = tempX;
// //       [cubes[i], cubes[j]] = [cubes[j], cubes[i]];

// //       const labelA = labels[i];
// //       const labelB = labels[j];
// //       labelA.position.x = cubeA.position.x;
// //       labelB.position.x = cubeB.position.x;
// //       [labels[i], labels[j]] = [labels[j], labels[i]];

// //       cubeA.material.color.set(0xff0000);
// //       cubeB.material.color.set(0xff0000);
// //     }

// //     setTimeout(() => {
// //       cubes.forEach((cube) => cube.material.color.set(0x00ff00));
// //       currentStepRef.current++;
// //       animateInsertionSort();
// //     }, 700);
// //   };

// //   const handleGenerateArray = () => {
// //     const arr = parseInput();
// //     if (arr.length === 0) {
// //       alert("Enter valid positive numbers separated by commas!");
// //       return;
// //     }
// //     createCubes(arr);
// //     stepsRef.current = generateInsertionSortSteps(arr);
// //     currentStepRef.current = 0;
// //     setIsSorting(false);
// //   };

// //   const handleStartSort = () => {
// //     if (isSorting) return;
// //     setIsSorting(true);
// //     currentStepRef.current = 0;
// //     animateInsertionSort();
// //   };

// //   return (
// //     <>
// //       <div
// //         ref={mountRef}
// //         style={{ width: "100%", height: "100vh", position: "relative" }}
// //       />
// //       <div
// //         style={{
// //           position: "absolute",
// //           top: "20px",
// //           left: "20px",
// //           zIndex: 10,
// //           display: "flex",
// //           flexDirection: "column",
// //           gap: "10px",
// //         }}
// //       >
// //         <input
// //           type="text"
// //           value={inputValue}
// //           onChange={(e) => setInputValue(e.target.value)}
// //           placeholder="Enter numbers, e.g., 5,3,8,1"
// //           style={{ padding: "8px", fontSize: "16px", width: "250px" }}
// //         />
// //         <button
// //           onClick={handleGenerateArray}
// //           style={{
// //             padding: "10px 20px",
// //             fontSize: "16px",
// //             background: "green",
// //             color: "#fff",
// //             border: "none",
// //             borderRadius: "5px",
// //             cursor: "pointer",
// //           }}
// //         >
// //           Generate Array
// //         </button>
// //         <button
// //           onClick={handleStartSort}
// //           style={{
// //             padding: "10px 20px",
// //             fontSize: "16px",
// //             background: "#007bff",
// //             color: "#fff",
// //             border: "none",
// //             borderRadius: "5px",
// //             cursor: "pointer",
// //           }}
// //         >
// //           Insertion Sort
// //         </button>
// //       </div>
// //     </>
// //   );
// // };

// // export default InsertionSort3D;
