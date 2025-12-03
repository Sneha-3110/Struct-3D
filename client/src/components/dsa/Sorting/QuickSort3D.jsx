

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
 * QuickSort3DVisualizer.jsx
 *
 * Option C — Hoare partition quicksort with premium 3D animations.
 * - Two-pointer scanning (left/right) with bounce
 * - Pivot highlighted purple
 * - Swaps use orange arcs
 * - Subarray ranges lift/outward during partition
 */

// ---------------------- Main App ----------------------
export default function App() {
  const [inputValue, setInputValue] = useState("5, 3, 8, 4, 2, 7, 1");
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
    const count = 6 + Math.floor(Math.random() * 4); // 6-9 values
    const arr = Array.from({ length: count }, () => 1 + Math.floor(Math.random() * 11));
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
            3D Quick Sort Visualizer (Hoare)
          </h1>
        </div>

        {/* Canvas container */}
        <div className="w-full h-full relative overflow-hidden rounded-tl-3xl border-l-4 border-t-4 border-white/50 shadow-inner flex flex-col items-center pt-28">
          <QuickSort3D
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
            <Code size={18} /> Algorithm: Quick Sort (Hoare)
          </h2>
          <p className="text-sm text-yellow-800 mb-3 leading-relaxed">
            Quick Sort (Hoare partition) picks a pivot and partitions the array with two pointers that move toward each other, swapping elements as needed.
          </p>

          <div className="bg-white/60 p-3 rounded text-xs font-mono text-slate-700 border border-yellow-200">
            <p className="font-semibold text-yellow-700 mb-1">Pseudocode (Hoare):</p>
            <p>function quicksort(A, lo, hi)</p>
            <p> &nbsp; if lo &lt; hi</p>
            <p> &nbsp;&nbsp; p = partition(A, lo, hi)</p>
            <p> &nbsp;&nbsp; quicksort(A, lo, p)</p>
            <p> &nbsp;&nbsp; quicksort(A, p+1, hi)</p>
            <p className="mt-2 text-yellow-900/70">Avg Time: O(n log n) — Worst: O(n²)</p>
          </div>
        </div>

        {/* Color Key */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-amber-200 text-sm">
          <p className="font-semibold mb-2">Color Key:</p>
          <div className="flex flex-col gap-2 text-xs">
            <LegendRow color="#3b82f6" label="Scanning pointer (compare)" />
            <LegendRow color="#7c3aed" label="Pivot" />
            <LegendRow color="#fb923c" label="Swapping (arc move)" />
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

// ---------------------- QuickSort3D component ----------------------
const QuickSort3D = React.forwardRef(({ onActionChange, onSortStatusChange, setIsSorting }, ref) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const animRef = useRef(null);

  // Data refs
  const cubesRef = useRef([]); // mesh list in current left->right order
  const labelsRef = useRef([]);
  const idOrderRef = useRef([]); // array of ids matching positions 0..n-1
  const stepsRef = useRef([]); // generated visualization steps
  const currentStepRef = useRef(0);
  const sortingRef = useRef(false);

  // Colors
  const COLOR_DEFAULT = 0x10b981; // default green
  const COLOR_COMPARE = 0x3b82f6; // blue
  const COLOR_PIVOT = 0x7c3aed; // purple
  const COLOR_SWAP = 0xfb923c; // orange for swaps
  const COLOR_SORTED = 0x10b981; // green

  // layout constants
  const spacingRef = useRef(3.2);
  const baseYRef = useRef(-4.0);

  // init scene
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = sceneRef.current;
    scene.background = new THREE.Color(0xf0f9ff);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 3.5, 22);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

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

    const animate = () => {
      animRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // initial cubes
    createCubes([5, 3, 8, 4, 2, 7, 1]);

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
      stepsRef.current = generateQuickSteps(arr);
      currentStepRef.current = 0;
      onSortStatusChange && onSortStatusChange("Ready");
      onActionChange && onActionChange("Array generated");
    },
    startSort() {
      if (sortingRef.current) return;
      if (!stepsRef.current || stepsRef.current.length === 0) {
        stepsRef.current = generateQuickSteps(parseInput("5,3,8,4,2,7,1"));
      }
      sortingRef.current = true;
      setIsSorting && setIsSorting(true);
      onSortStatusChange && onSortStatusChange("Sorting");
      onActionChange && onActionChange("Starting Quick Sort...");
      animateStep();
    },
  }));

  // parse input
  const parseInput = (str) =>
    String(str)
      .split(",")
      .map((v) => Number(v.trim()))
      .filter((n) => !isNaN(n) && n > 0)
      .slice(0, 50)
      .map((n) => Math.min(14, Math.max(1, Math.round(n))));

  // create cubes and labels
  function createCubes(arr) {
    const scene = sceneRef.current;
    // cleanup
    cubesRef.current.forEach((c) => scene.remove(c));
    labelsRef.current.forEach((l) => scene.remove(l));
    cubesRef.current = [];
    labelsRef.current = [];
    idOrderRef.current = [];

    const spacing = spacingRef.current;
    const startX = -((arr.length - 1) * spacing) / 2;
    const baseY = baseYRef.current;

    arr.forEach((val, i) => {
      const id = `q${i}`;
      const geometry = new THREE.BoxGeometry(2.2, val, 1.8);
      geometry.translate(0, val / 2, 0);
      const material = new THREE.MeshStandardMaterial({ color: COLOR_DEFAULT, roughness: 0.35, metalness: 0.06 });
      const cube = new THREE.Mesh(geometry, material);
      cube.castShadow = true;
      cube.receiveShadow = true;
      const x = startX + i * spacing;
      cube.position.set(x, baseY, 0);
      cube.userData = { id, value: val, sorted: false };
      scene.add(cube);
      cubesRef.current.push(cube);

      // label above
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 128;
      const ctx = canvas.getContext("2d");
      ctx.font = "bold 60px Arial";
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.clearRect(0, 0, 128, 128);
      ctx.fillText(String(val), 64, 64);
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
      sprite.scale.set(2.4, 2.4, 1);
      sprite.position.set(x, baseY + val + 1.4, 0);
      scene.add(sprite);
      labelsRef.current.push(sprite);

      idOrderRef.current.push(id);
    });

    stepsRef.current = generateQuickSteps(arr);
    currentStepRef.current = 0;
  }

  // helpers
  const findIndexById = (id) => cubesRef.current.findIndex((c) => c.userData.id === id);
  const xForIndex = (index, length) => {
    const spacing = spacingRef.current;
    const startX = -((length - 1) * spacing) / 2;
    return startX + index * spacing;
  };

  // Generate visualization steps for Hoare partition quicksort
  // Steps types:
  // - {type:'split', range:[lo,hi]} -> lift/outward for visual partition
  // - {type:'pivot', id} -> mark pivot purple
  // - {type:'compare', aId, bId} -> pointers compare
  // - {type:'swap', aId, bId} -> swap two ids
  // - {type:'partitionDone', range:[lo,hi], pIndex} -> finished partition; recursion proceeds
  // - {type:'sortedIdx', index} -> mark single index sorted (optional)
  function generateQuickSteps(arr) {
    // Create stable id/value list
    const items = arr.map((v, i) => ({ id: `q${i}`, value: v }));
    const steps = [];

    // We'll simulate working on a mutable array of items
    function rec(subItems, loIndex) {
      const len = subItems.length;
      if (len <= 1) {
        // optional: mark sorted single item
        if (len === 1) steps.push({ type: "sortedIdx", index: loIndex });
        return subItems.slice();
      }

      // use Hoare pivot = middle element for stability of motion
      const mid = Math.floor(len / 2);
      const pivotItem = subItems[mid];
      const pivotId = pivotItem.id;
      const pivotValue = pivotItem.value;

      // Visual split for the whole range [loIndex, loIndex+len-1]
      steps.push({ type: "split", range: [loIndex, loIndex + len - 1] });
      // mark pivot visually
      steps.push({ type: "pivot", id: pivotId });

      // Simulate Hoare partition on this local subItems (indexes relative to subItems)
      let i = 0;
      let j = len - 1;
      while (i <= j) {
        // advance i until subItems[i].value >= pivotValue
        while (i <= j && subItems[i].value < pivotValue) {
          // compare subItems[i] with pivot
          steps.push({ type: "compare", aId: subItems[i].id, bId: pivotId });
          i++;
        }
        // advance j until subItems[j].value <= pivotValue
        while (i <= j && subItems[j].value > pivotValue) {
          steps.push({ type: "compare", aId: subItems[j].id, bId: pivotId });
          j--;
        }
        if (i <= j) {
          // swap elements at i and j
          if (subItems[i].id !== subItems[j].id) {
            steps.push({ type: "swap", aId: subItems[i].id, bId: subItems[j].id });
            // perform swap in local array
            const tmp = subItems[i];
            subItems[i] = subItems[j];
            subItems[j] = tmp;
          }
          i++;
          j--;
        }
      }

      // Partition returns index j (Hoare), left is up to j, right starts at i
      const pIndex = loIndex + j; // j may be less than loIndex if empty
      // Indicate partition finished
      steps.push({ type: "partitionDone", range: [loIndex, loIndex + len - 1], pIndex: pIndex });

      // Now split local arrays for recursion:
      const left = subItems.slice(0, j + 1);
      const right = subItems.slice(j + 1);

      // Recursively handle left and right; note left starts at loIndex, right starts at loIndex + left.length
      rec(left, loIndex);
      rec(right, loIndex + left.length);

      // Return the merged (but we keep mutated order)
      return subItems.slice();
    }

    rec(items, 0);
    // final: mark all sorted
    // we'll let final steps mark sorted per 'sortedIdx' when len 1 happened; but ensure final pass sets all sorted
    steps.push({ type: "finalMark" });
    return steps;
  }

  // reset colors
  const resetColors = () => {
    cubesRef.current.forEach((c) => {
      c.material.color.setHex(c.userData.sorted ? COLOR_SORTED : COLOR_DEFAULT);
    });
  };

  // animate one step
  const animateStep = () => {
    const steps = stepsRef.current;
    const idx = currentStepRef.current;

    if (!steps || idx >= steps.length) {
      // finished
      sortingRef.current = false;
      setIsSorting && setIsSorting(false);
      onSortStatusChange && onSortStatusChange("Completed");
      onActionChange && onActionChange("Quick Sort Completed!");
      cubesRef.current.forEach((c) => {
        c.userData.sorted = true;
        c.material.color.setHex(COLOR_SORTED);
      });
      return;
    }

    const step = steps[idx];
    resetColors();

    const cubes = cubesRef.current;
    const labels = labelsRef.current;
    const n = cubes.length;

    if (step.type === "split") {
      const [lo, hi] = step.range;
      onActionChange && onActionChange(`Partitioning range [${lo}, ${hi}]`);
      // lift range outward. decide direction by center relative to array center
      const centerIndex = (lo + hi) / 2;
      const arrayCenter = (n - 1) / 2;
      const isLeft = centerIndex <= arrayCenter;
      const offsetX = (hi - lo + 1) * spacingRef.current * 0.5;
      const liftY = 2.2;
      const duration = 500;
      const start = performance.now();

      const anim = () => {
        const now = performance.now();
        let t = (now - start) / duration;
        if (t > 1) t = 1;
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        for (let pos = lo; pos <= hi; pos++) {
          const id = idOrderRef.current[pos];
          const idxCube = findIndexById(id);
          if (idxCube === -1) continue;
          const cube = cubes[idxCube];
          const lbl = labels[idxCube];
          const dir = isLeft ? -1 : 1;
          const targetX = xForIndex(pos, n) + dir * offsetX;
          cube.position.x = cube.position.x + (targetX - cube.position.x) * ease;
          cube.position.y = baseYRef.current + liftY * ease;
          if (lbl) {
            lbl.position.x = cube.position.x;
            lbl.position.y = cube.position.y + cube.userData.value + 1.4;
          }
          cube.material.color.setHex(COLOR_PIVOT);
        }
        if (t < 1) requestAnimationFrame(anim);
        else {
          currentStepRef.current++;
          animateStep();
        }
      };
      anim();
      return;
    }

    if (step.type === "pivot") {
      const pid = step.id;
      const idxCube = findIndexById(pid);
      if (idxCube === -1) {
        currentStepRef.current++;
        animateStep();
        return;
      }
      const cube = cubes[idxCube];
      cube.material.color.setHex(COLOR_PIVOT);
      onActionChange && onActionChange(`Pivot selected: ${cube.userData.value}`);
      // short highlight pause
      setTimeout(() => {
        currentStepRef.current++;
        animateStep();
      }, 320);
      return;
    }

    if (step.type === "compare") {
      const aId = step.aId;
      const bId = step.bId;
      const aIdx = findIndexById(aId);
      const bIdx = findIndexById(bId);
      const cubeA = cubes[aIdx];
      const cubeB = cubes[bIdx];
      onActionChange && onActionChange(`Comparing ${cubeA?.userData.value} and pivot ${cubeB?.userData.value}`);
      const duration = 560;
      const start = performance.now();
      if (cubeA) cubeA.material.color.setHex(COLOR_COMPARE);
      if (cubeB) cubeB.material.color.setHex(COLOR_PIVOT);
      const anim = () => {
        const now = performance.now();
        let t = (now - start) / duration;
        if (t > 1) t = 1;
        const lift = Math.sin(t * Math.PI) * 0.9;
        if (cubeA) cubeA.position.y = baseYRef.current + lift;
        if (cubeB) cubeB.position.y = baseYRef.current + lift * 0.5; // pivot small lift
        if (cubeA) labels[aIdx].position.y = cubeA.position.y + cubeA.userData.value + 1.4;
        if (cubeB) labels[bIdx].position.y = cubeB.position.y + cubeB.userData.value + 1.4;
        if (t < 1) requestAnimationFrame(anim);
        else {
          if (cubeA) cubeA.position.y = baseYRef.current;
          if (cubeB) cubeB.position.y = baseYRef.current;
          if (cubeA) labels[aIdx].position.y = cubeA.position.y + cubeA.userData.value + 1.4;
          if (cubeB) labels[bIdx].position.y = cubeB.position.y + cubeB.userData.value + 1.4;
          currentStepRef.current++;
          animateStep();
        }
      };
      anim();
      return;
    }

    if (step.type === "swap") {
      const aId = step.aId;
      const bId = step.bId;
      const aIdx = findIndexById(aId);
      const bIdx = findIndexById(bId);
      if (aIdx === -1 || bIdx === -1) {
        currentStepRef.current++;
        animateStep();
        return;
      }
      const cubeA = cubes[aIdx];
      const cubeB = cubes[bIdx];
      const labelA = labels[aIdx];
      const labelB = labels[bIdx];
      onActionChange && onActionChange(`Swapping ${cubeA.userData.value} and ${cubeB.userData.value}`);
      // swap with arc
      const xA = cubeA.position.x;
      const xB = cubeB.position.x;
      const hA = cubeA.userData.value;
      const hB = cubeB.userData.value;
      const duration = 900;
      const start = performance.now();
      cubeA.material.color.setHex(COLOR_SWAP);
      cubeB.material.color.setHex(COLOR_SWAP);

      const anim = () => {
        const now = performance.now();
        let t = (now - start) / duration;
        if (t > 1) t = 1;
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        const newXA = xA + (xB - xA) * ease;
        const newXB = xB + (xA - xB) * ease;
        const arc = Math.sin(ease * Math.PI) * 2.6;
        cubeA.position.set(newXA, baseYRef.current + arc, 0);
        cubeB.position.set(newXB, baseYRef.current - arc * 0.3, 0);
        labelA.position.set(newXA, cubeA.position.y + hA + 1.4, 0);
        labelB.position.set(newXB, cubeB.position.y + hB + 1.4, 0);
        if (t < 1) requestAnimationFrame(anim);
        else {
          // finalize, snap to baseY
          cubeA.position.set(newXA, baseYRef.current, 0);
          cubeB.position.set(newXB, baseYRef.current, 0);
          labelA.position.set(newXA, baseYRef.current + hA + 1.4, 0);
          labelB.position.set(newXB, baseYRef.current + hB + 1.4, 0);
          // reorder arrays
          const oldA = findIndexById(aId);
          const oldB = findIndexById(bId);
          if (oldA !== -1 && oldB !== -1) {
            const movedA = cubes.splice(oldA, 1)[0];
            const movedLA = labels.splice(oldA, 1)[0];
            const insertAt = oldB > oldA ? oldB : oldB;
            cubes.splice(insertAt, 0, movedA);
            labels.splice(insertAt, 0, movedLA);
            // ensure idOrderRef matches
            idOrderRef.current = cubes.map((c) => c.userData.id);
            // snap everyone to x positions
            cubes.forEach((c, pos) => {
              const tx = xForIndex(pos, n);
              c.position.x = tx;
              c.position.y = baseYRef.current;
              const lbl = labels[pos];
              if (lbl) {
                lbl.position.x = tx;
                lbl.position.y = baseYRef.current + c.userData.value + 1.4;
              }
            });
          }
          currentStepRef.current++;
          animateStep();
        }
      };
      anim();
      return;
    }

    if (step.type === "partitionDone") {
      const [lo, hi] = step.range;
      const pIndex = step.pIndex;
      onActionChange && onActionChange(`Partition finished for [${lo}, ${hi}], pivot index approx ${pIndex}`);
      // drop all in this range back to base and un-color pivot
      const duration = 420;
      const start = performance.now();
      const anim = () => {
        const now = performance.now();
        let t = (now - start) / duration;
        if (t > 1) t = 1;
        for (let pos = lo; pos <= hi; pos++) {
          const id = idOrderRef.current[pos];
          const idxCube = findIndexById(id);
          if (idxCube === -1) continue;
          const cube = cubes[idxCube];
          const lbl = labels[idxCube];
          cube.position.y = cube.position.y + (baseYRef.current - cube.position.y) * t;
          if (lbl) lbl.position.y = cube.position.y + cube.userData.value + 1.4;
          // clear pivot highlight
          cube.material.color.setHex(cube.userData.sorted ? COLOR_SORTED : COLOR_DEFAULT);
        }
        if (t < 1) requestAnimationFrame(anim);
        else {
          currentStepRef.current++;
          animateStep();
        }
      };
      anim();
      return;
    }

    if (step.type === "sortedIdx") {
      const idxSorted = step.index;
      // mark index as sorted (if exists)
      const id = idOrderRef.current[idxSorted];
      const idxCube = findIndexById(id);
      if (idxCube !== -1) {
        const c = cubes[idxCube];
        c.userData.sorted = true;
        c.material.color.setHex(COLOR_SORTED);
      }
      currentStepRef.current++;
      setTimeout(animateStep, 80);
      return;
    }

    if (step.type === "finalMark") {
      // final sweep: mark everything sorted
      cubes.forEach((c) => {
        c.userData.sorted = true;
        c.material.color.setHex(COLOR_SORTED);
      });
      currentStepRef.current++;
      setTimeout(animateStep, 80);
      return;
    }

    // fallback
    currentStepRef.current++;
    setTimeout(animateStep, 40);
  };

  return <div ref={mountRef} className="w-full h-full" />;
});


// import React, { useEffect, useRef, useState } from "react";
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import {
//   Play,
//   RefreshCw,
//   Menu,
//   Info,
//   Settings,
//   Home,
//   Database,
//   Code,
//   Activity,
// } from "lucide-react";

// /**
//  * QuickSortA3.jsx
//  * Quick Sort (Option A3 - Premium animation)
//  * Pivot = last element (Lomuto-style partition visual), but polished:
//  * - subarray lift/split visual
//  * - pivot purple, comparisons blue, swaps orange arc, sorted green
//  * - pivot crown-arc move into final slot
//  */

// // ---------------------- Main App ----------------------
// export default function App() {
//   const [inputValue, setInputValue] = useState("5, 3, 8, 4, 2, 7, 1");
//   const [isSorting, setIsSorting] = useState(false);
//   const [liveStatus, setLiveStatus] = useState("Waiting to start...");
//   const [sortStatus, setSortStatus] = useState("Ready");
//   const visualizerRef = useRef();

//   const handleGenerate = () => {
//     visualizerRef.current?.generateArray(inputValue);
//     setLiveStatus("Generated new array.");
//     setSortStatus("Ready");
//   };

//   const handleRandom = () => {
//     const count = 6 + Math.floor(Math.random() * 4); // 6-9 values
//     const arr = Array.from({ length: count }, () => 1 + Math.floor(Math.random() * 11));
//     const s = arr.join(", ");
//     setInputValue(s);
//     visualizerRef.current?.generateArray(s);
//     setLiveStatus("Randomized array");
//     setSortStatus("Ready");
//   };

//   const handleStart = () => {
//     visualizerRef.current?.startSort();
//   };

//   return (
//     <div className="flex h-screen w-full bg-slate-100 font-sans overflow-hidden">
//       {/* LEFT NAV */}
//       <aside className="w-16 bg-blue-900 flex flex-col items-center py-6 gap-6 text-white shadow-lg z-20 shrink-0">
//         <div className="p-2 bg-blue-800 rounded-lg mb-4">
//           <Menu size={22} />
//         </div>
//         <NavItem icon={<Home size={18} />} label="Home" active />
//         <NavItem icon={<Database size={18} />} label="Data" />
//         <NavItem icon={<Code size={18} />} label="Algo" />
//         <NavItem icon={<Settings size={18} />} label="Settings" />
//         <div className="mt-auto mb-4">
//           <Info size={18} className="text-blue-300 hover:text-white cursor-pointer" />
//         </div>
//       </aside>

//       {/* CENTER WORKING AREA */}
//       <main className="flex-1 relative bg-blue-50 flex flex-col min-w-0">
//         {/* Title (absolute) */}
//         <div className="absolute top-4 left-0 right-0 text-center pointer-events-none z-10">
//           <h1 className="text-3xl font-bold text-blue-900/20 uppercase tracking-widest select-none">
//             3D Quick Sort Visualizer (A3 - Premium)
//           </h1>
//         </div>

//         {/* Canvas container */}
//         <div className="w-full h-full relative overflow-hidden rounded-tl-3xl border-l-4 border-t-4 border-white/50 shadow-inner flex flex-col items-center pt-28">
//           <QuickSortA3
//             ref={visualizerRef}
//             setIsSorting={setIsSorting}
//             onActionChange={setLiveStatus}
//             onSortStatusChange={setSortStatus}
//           />
//         </div>
//       </main>

//       {/* RIGHT SIDEBAR */}
//       <aside className="w-80 bg-slate-50 flex flex-col p-4 gap-4 shadow-xl shrink-0 overflow-y-auto border-l border-slate-200">
//         <div className="bg-yellow-100 border-l-4 border-yellow-400 p-5 rounded-xl shadow-sm">
//           <h2 className="font-bold text-lg text-yellow-900 mb-2 flex items-center gap-2">
//             <Code size={18} /> Algorithm: Quick Sort (Pivot = last)
//           </h2>
//           <p className="text-sm text-yellow-800 mb-3 leading-relaxed">
//             Quick Sort (Lomuto-style visualization) — pivot is the last element. Partition then recursively sort subarrays.
//           </p>

//           <div className="bg-white/60 p-3 rounded text-xs font-mono text-slate-700 border border-yellow-200">
//             <p className="font-semibold text-yellow-700 mb-1">Pseudocode (visual):</p>
//             <p>1. choose pivot = A[hi]</p>
//             <p>2. i = lo-1</p>
//             <p>3. for j from lo to hi-1</p>
//             <p>4. &nbsp;&nbsp; compare A[j] with pivot</p>
//             <p>5. &nbsp;&nbsp; if A[j] &lt;= pivot then i++; swap A[i], A[j]</p>
//             <p>6. swap A[i+1], A[hi] (pivot into place)</p>
//             <p className="mt-2 text-yellow-900/70">Avg Time: O(n log n) — Worst: O(n²)</p>
//           </div>
//         </div>

//         {/* Color Key */}
//         <div className="bg-yellow-50 p-4 rounded-lg border border-amber-200 text-sm">
//           <p className="font-semibold mb-2">Color Key:</p>
//           <div className="flex flex-col gap-2 text-xs">
//             <LegendRow color="#3b82f6" label="Comparing (j pointer)" />
//             <LegendRow color="#7c3aed" label="Pivot (last element)" />
//             <LegendRow color="#fb923c" label="Swap (arc move)" />
//             <LegendRow color="#10b981" label="Sorted element" />
//           </div>
//         </div>

//         {/* Controls */}
//         <div className="bg-amber-100 border-l-4 border-amber-500 p-5 rounded-xl shadow-sm flex-1 flex flex-col">
//           <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
//             <Settings size={16} /> Controls
//           </h3>

//           <label className="text-xs text-amber-700 font-semibold">INPUT DATA</label>
//           <input
//             className="w-full p-2 rounded border border-amber-300 bg-white text-slate-700 font-mono text-sm mb-3"
//             value={inputValue}
//             onChange={(e) => setInputValue(e.target.value)}
//             disabled={isSorting}
//             placeholder="e.g. 5, 3, 8, 4, 2"
//           />

//           <div className="grid grid-cols-2 gap-2 mb-3">
//             <button
//               className="bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2"
//               disabled={isSorting}
//               onClick={handleGenerate}
//             >
//               <RefreshCw size={14} /> Generate
//             </button>

//             <button
//               className="bg-purple-600 text-white py-2 rounded flex items-center justify-center gap-2"
//               disabled={isSorting}
//               onClick={handleRandom}
//             >
//               Random
//             </button>
//           </div>

//           <button
//             className="bg-green-600 text-white py-3 rounded-lg text-lg font-semibold drop-shadow"
//             disabled={isSorting}
//             onClick={handleStart}
//           >
//             <div className="flex items-center justify-center gap-2">
//               <Play size={16} /> Start Visualization
//             </div>
//           </button>

//           <div className="mt-auto pt-6">
//             <div className="bg-white/50 rounded p-3 border border-amber-200 shadow-sm">
//               <div className="flex items-center justify-between mb-2">
//                 <p className="text-xs font-bold text-amber-800">LIVE STATUS:</p>
//                 <Activity size={14} className={isSorting ? "text-green-600 animate-pulse" : "text-slate-400"} />
//               </div>
//               <div className="text-sm font-medium text-amber-900 mb-1">{liveStatus}</div>
//               <div className="text-xs text-amber-700/70">{sortStatus}</div>
//             </div>
//           </div>
//         </div>
//       </aside>
//     </div>
//   );
// }

// // ---------------------- small UI components ----------------------
// const NavItem = ({ icon, label, active }) => (
//   <div className={`flex flex-col items-center gap-1 cursor-pointer group ${active ? "text-white" : "text-blue-300 hover:text-white"}`}>
//     <div className={`p-2 rounded-lg transition-all ${active ? "bg-white/10" : "group-hover:bg-white/5"}`}>{icon}</div>
//   </div>
// );

// const LegendRow = ({ color, label }) => (
//   <div className="flex items-center gap-2">
//     <div style={{ background: color }} className="w-3 h-3 rounded-full" />
//     <div className="text-xs text-slate-700">{label}</div>
//   </div>
// );

// // ---------------------- QuickSortA3 component ----------------------
// const QuickSortA3 = React.forwardRef(({ onActionChange, onSortStatusChange, setIsSorting }, ref) => {
//   const mountRef = useRef(null);
//   const sceneRef = useRef(new THREE.Scene());
//   const rendererRef = useRef(null);
//   const cameraRef = useRef(null);
//   const controlsRef = useRef(null);
//   const animRef = useRef(null);

//   // Data refs
//   const cubesRef = useRef([]); // mesh list left->right
//   const labelsRef = useRef([]);
//   const idOrderRef = useRef([]); // ids current left->right
//   const stepsRef = useRef([]);
//   const currentStepRef = useRef(0);
//   const sortingRef = useRef(false);

//   // Colors (hex)
//   const COLOR_DEFAULT = 0x10b981; // green default
//   const COLOR_COMPARE = 0x3b82f6; // blue
//   const COLOR_PIVOT = 0x7c3aed; // purple
//   const COLOR_SWAP = 0xfb923c; // orange
//   const COLOR_SORTED = 0x10b981; // green

//   // layout constants
//   const spacingRef = useRef(3.2);
//   const baseYRef = useRef(-4.0);

//   // init scene
//   useEffect(() => {
//     const mount = mountRef.current;
//     if (!mount) return;
//     const width = mount.clientWidth;
//     const height = mount.clientHeight;

//     const scene = sceneRef.current;
//     scene.background = new THREE.Color(0xf0f9ff);

//     const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
//     camera.position.set(0, 3.5, 22);
//     cameraRef.current = camera;

//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setSize(width, height);
//     renderer.shadowMap.enabled = true;
//     mount.appendChild(renderer.domElement);
//     rendererRef.current = renderer;

//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;
//     controls.target.set(0, 0, 0);
//     controlsRef.current = controls;

//     scene.add(new THREE.AmbientLight(0xffffff, 0.7));
//     const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
//     dirLight.position.set(5, 10, 7);
//     scene.add(dirLight);

//     const handleResize = () => {
//       if (!mount || !cameraRef.current || !rendererRef.current) return;
//       const w = mount.clientWidth;
//       const h = mount.clientHeight;
//       cameraRef.current.aspect = w / h;
//       cameraRef.current.updateProjectionMatrix();
//       rendererRef.current.setSize(w, h);
//     };
//     const ro = new ResizeObserver(handleResize);
//     ro.observe(mount);

//     const animate = () => {
//       animRef.current = requestAnimationFrame(animate);
//       controls.update();
//       renderer.render(scene, camera);
//     };
//     animate();

//     // initial cubes
//     createCubes([5, 3, 8, 4, 2, 7, 1]);

//     return () => {
//       cancelAnimationFrame(animRef.current);
//       ro.disconnect();
//       if (rendererRef.current) rendererRef.current.dispose();
//       if (mount) mount.innerHTML = "";
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Imperative API
//   React.useImperativeHandle(ref, () => ({
//     generateArray(input) {
//       if (sortingRef.current) return;
//       const arr = parseInput(input);
//       if (arr.length === 0) return;
//       createCubes(arr);
//       stepsRef.current = generateQuickSteps(arr);
//       currentStepRef.current = 0;
//       onSortStatusChange && onSortStatusChange("Ready");
//       onActionChange && onActionChange("Array generated");
//     },
//     startSort() {
//       if (sortingRef.current) return;
//       if (!stepsRef.current || stepsRef.current.length === 0) {
//         stepsRef.current = generateQuickSteps(parseInput("5,3,8,4,2,7,1"));
//       }
//       sortingRef.current = true;
//       setIsSorting && setIsSorting(true);
//       onSortStatusChange && onSortStatusChange("Sorting");
//       onActionChange && onActionChange("Starting Quick Sort...");
//       animateStep();
//     },
//   }));

//   // parse input (clamp)
//   const parseInput = (str) =>
//     String(str)
//       .split(",")
//       .map((v) => Number(v.trim()))
//       .filter((n) => !isNaN(n) && n > 0)
//       .slice(0, 50)
//       .map((n) => Math.min(14, Math.max(1, Math.round(n))));

//   // create cubes and labels with stable ids
//   function createCubes(arr) {
//     const scene = sceneRef.current;
//     cubesRef.current.forEach((c) => scene.remove(c));
//     labelsRef.current.forEach((l) => scene.remove(l));
//     cubesRef.current = [];
//     labelsRef.current = [];
//     idOrderRef.current = [];

//     const spacing = spacingRef.current;
//     const startX = -((arr.length - 1) * spacing) / 2;
//     const baseY = baseYRef.current;

//     arr.forEach((val, i) => {
//       const id = `q${i}`;
//       const geometry = new THREE.BoxGeometry(2.2, val, 1.8);
//       geometry.translate(0, val / 2, 0);
//       const material = new THREE.MeshStandardMaterial({ color: COLOR_DEFAULT, roughness: 0.35, metalness: 0.06 });
//       const cube = new THREE.Mesh(geometry, material);
//       cube.castShadow = true;
//       cube.receiveShadow = true;
//       const x = startX + i * spacing;
//       cube.position.set(x, baseY, 0);
//       cube.userData = { id, value: val, sorted: false };
//       scene.add(cube);
//       cubesRef.current.push(cube);

//       // label above
//       const canvas = document.createElement("canvas");
//       canvas.width = canvas.height = 128;
//       const ctx = canvas.getContext("2d");
//       ctx.font = "bold 60px Arial";
//       ctx.fillStyle = "#000";
//       ctx.textAlign = "center";
//       ctx.textBaseline = "middle";
//       ctx.clearRect(0, 0, 128, 128);
//       ctx.fillText(String(val), 64, 64);
//       const texture = new THREE.CanvasTexture(canvas);
//       texture.needsUpdate = true;
//       const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
//       sprite.scale.set(2.4, 2.4, 1);
//       sprite.position.set(x, baseY + val + 1.4, 0);
//       scene.add(sprite);
//       labelsRef.current.push(sprite);

//       idOrderRef.current.push(id);
//     });

//     stepsRef.current = generateQuickSteps(arr);
//     currentStepRef.current = 0;
//   }

//   // helpers
//   const findIndexById = (id) => cubesRef.current.findIndex((c) => c.userData.id === id);
//   const xForIndex = (index, length) => {
//     const spacing = spacingRef.current;
//     const startX = -((length - 1) * spacing) / 2;
//     return startX + index * spacing;
//   };

//   // Build steps for Lomuto partition quicksort with stable ids
//   // Steps:
//   // - {type:'split', range:[lo,hi]} // lift region
//   // - {type:'pivot', id, index} // pivot is last element
//   // - {type:'compare', jId, pivotId}
//   // - {type:'swap', aId, bId}
//   // - {type:'pivotSwap', pivotId, targetIndex}
//   // - {type:'merged', range:[lo,hi]} // mark region sorted (optional)
//   function generateQuickSteps(arr) {
//     const items = arr.map((v, i) => ({ id: `q${i}`, value: v }));
//     const steps = [];

//     function rec(localItems, loIndex) {
//       const len = localItems.length;
//       if (len <= 1) {
//         if (len === 1) steps.push({ type: "sortedIdx", index: loIndex });
//         return localItems.slice();
//       }
//       // Visual split for this range
//       steps.push({ type: "split", range: [loIndex, loIndex + len - 1] });

//       // Pivot = last element by value and id
//       const pivotItem = localItems[len - 1];
//       const pivotId = pivotItem.id;
//       const pivotVal = pivotItem.value;
//       steps.push({ type: "pivot", id: pivotId, index: loIndex + len - 1 });

//       // Simulate Lomuto partition on localItems, but we must record swaps with ids
//       let i = -1; // relative to localItems (i is index of smaller element)
//       for (let j = 0; j < len - 1; j++) {
//         // compare
//         steps.push({ type: "compare", jId: localItems[j].id, pivotId, jVal: localItems[j].value, pivotVal });
//         if (localItems[j].value <= pivotVal) {
//           i++;
//           if (i !== j) {
//             // record swap of ids
//             steps.push({ type: "swap", aId: localItems[i].id, bId: localItems[j].id });
//             // do swap in local array
//             const tmp = localItems[i];
//             localItems[i] = localItems[j];
//             localItems[j] = tmp;
//           }
//         }
//       }
//       // put pivot after i
//       const pivotTarget = i + 1;
//       if (pivotTarget !== len - 1) {
//         steps.push({ type: "pivotSwap", pivotId, targetIndex: loIndex + pivotTarget });
//         // perform swap in localItems
//         const tmp = localItems[pivotTarget];
//         localItems[pivotTarget] = localItems[len - 1];
//         localItems[len - 1] = tmp;
//       } else {
//         // still record pivot placed (no move)
//         steps.push({ type: "pivotSwap", pivotId, targetIndex: loIndex + pivotTarget });
//       }

//       // mark merged region (optional visual)
//       steps.push({ type: "merged", range: [loIndex, loIndex + len - 1] });

//       // split into left and right for recursion
//       const left = localItems.slice(0, pivotTarget);
//       const right = localItems.slice(pivotTarget + 1);
//       rec(left, loIndex);
//       rec(right, loIndex + left.length + 1);

//       return localItems.slice();
//     }

//     rec(items, 0);
//     // final mark
//     steps.push({ type: "finalMark" });
//     return steps;
//   }

//   // reset color
//   const resetColors = () => {
//     cubesRef.current.forEach((c) => {
//       c.material.color.setHex(c.userData.sorted ? COLOR_SORTED : COLOR_DEFAULT);
//     });
//   };

//   // animate one step
//   const animateStep = () => {
//     const steps = stepsRef.current;
//     const idx = currentStepRef.current;

//     if (!steps || idx >= steps.length) {
//       // done
//       sortingRef.current = false;
//       setIsSorting && setIsSorting(false);
//       onSortStatusChange && onSortStatusChange("Completed");
//       onActionChange && onActionChange("Quick Sort Completed!");
//       cubesRef.current.forEach((c) => {
//         c.userData.sorted = true;
//         c.material.color.setHex(COLOR_SORTED);
//       });
//       return;
//     }

//     const step = steps[idx];
//     resetColors();

//     const cubes = cubesRef.current;
//     const labels = labelsRef.current;
//     const n = cubes.length;

//     if (step.type === "split") {
//       const [lo, hi] = step.range;
//       onActionChange && onActionChange(`Partitioning range [${lo}, ${hi}]`);
//       // lift range outward (left part left, right part right) for visual clarity
//       const centerIndex = (lo + hi) / 2;
//       const arrayCenter = (n - 1) / 2;
//       const isLeft = centerIndex <= arrayCenter;
//       const liftY = 2.2;
//       const offsetX = (hi - lo + 1) * spacingRef.current * 0.5;
//       const duration = 520;
//       const start = performance.now();

//       const anim = () => {
//         const now = performance.now();
//         let t = (now - start) / duration;
//         if (t > 1) t = 1;
//         const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
//         for (let pos = lo; pos <= hi; pos++) {
//           const id = idOrderRef.current[pos];
//           const idxCube = findIndexById(id);
//           if (idxCube === -1) continue;
//           const cube = cubes[idxCube];
//           const lbl = labels[idxCube];
//           const dir = isLeft ? -1 : 1;
//           const targetX = xForIndex(pos, n) + dir * offsetX;
//           cube.position.x = cube.position.x + (targetX - cube.position.x) * ease;
//           cube.position.y = baseYRef.current + liftY * ease;
//           if (lbl) {
//             lbl.position.x = cube.position.x;
//             lbl.position.y = cube.position.y + cube.userData.value + 1.4;
//           }
//           cube.material.color.setHex(COLOR_PIVOT);
//         }
//         if (t < 1) requestAnimationFrame(anim);
//         else {
//           currentStepRef.current++;
//           animateStep();
//         }
//       };
//       anim();
//       return;
//     }

//     if (step.type === "pivot") {
//       const pid = step.id;
//       const idxCube = findIndexById(pid);
//       if (idxCube === -1) {
//         currentStepRef.current++;
//         animateStep();
//         return;
//       }
//       const cube = cubes[idxCube];
//       cube.material.color.setHex(COLOR_PIVOT);
//       onActionChange && onActionChange(`Pivot selected: ${cube.userData.value}`);
//       // small pause
//       setTimeout(() => {
//         currentStepRef.current++;
//         animateStep();
//       }, 300);
//       return;
//     }

//     if (step.type === "compare") {
//       const jId = step.jId;
//       const pivotId = step.pivotId;
//       const jIdx = findIndexById(jId);
//       const pIdx = findIndexById(pivotId);
//       const cubeJ = cubes[jIdx];
//       const cubeP = cubes[pIdx];
//       onActionChange && onActionChange(`Comparing ${cubeJ?.userData.value} and pivot ${cubeP?.userData.value}`);
//       const duration = 650;
//       const start = performance.now();
//       if (cubeJ) cubeJ.material.color.setHex(COLOR_COMPARE);
//       if (cubeP) cubeP.material.color.setHex(COLOR_PIVOT);
//       const anim = () => {
//         const now = performance.now();
//         let t = (now - start) / duration;
//         if (t > 1) t = 1;
//         const lift = Math.sin(t * Math.PI) * 0.9;
//         if (cubeJ) cubeJ.position.y = baseYRef.current + lift;
//         if (cubeP) cubeP.position.y = baseYRef.current + lift * 0.4;
//         if (cubeJ) labels[jIdx].position.y = cubeJ.position.y + cubeJ.userData.value + 1.4;
//         if (cubeP) labels[pIdx].position.y = cubeP.position.y + cubeP.userData.value + 1.4;
//         if (t < 1) requestAnimationFrame(anim);
//         else {
//           if (cubeJ) cubeJ.position.y = baseYRef.current;
//           if (cubeP) cubeP.position.y = baseYRef.current;
//           if (cubeJ) labels[jIdx].position.y = cubeJ.position.y + cubeJ.userData.value + 1.4;
//           if (cubeP) labels[pIdx].position.y = cubeP.position.y + cubeP.userData.value + 1.4;
//           currentStepRef.current++;
//           animateStep();
//         }
//       };
//       anim();
//       return;
//     }

//     if (step.type === "swap") {
//       const aId = step.aId;
//       const bId = step.bId;
//       const aIdx = findIndexById(aId);
//       const bIdx = findIndexById(bId);
//       if (aIdx === -1 || bIdx === -1) {
//         currentStepRef.current++;
//         animateStep();
//         return;
//       }
//       const cubeA = cubes[aIdx];
//       const cubeB = cubes[bIdx];
//       const labelA = labels[aIdx];
//       const labelB = labels[bIdx];
//       onActionChange && onActionChange(`Swapping ${cubeA.userData.value} and ${cubeB.userData.value}`);
//       // arc swap
//       const xA = cubeA.position.x;
//       const xB = cubeB.position.x;
//       const hA = cubeA.userData.value;
//       const hB = cubeB.userData.value;
//       const duration = 920;
//       const start = performance.now();
//       cubeA.material.color.setHex(COLOR_SWAP);
//       cubeB.material.color.setHex(COLOR_SWAP);

//       const anim = () => {
//         const now = performance.now();
//         let t = (now - start) / duration;
//         if (t > 1) t = 1;
//         const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
//         const newXA = xA + (xB - xA) * ease;
//         const newXB = xB + (xA - xB) * ease;
//         const arc = Math.sin(ease * Math.PI) * 2.6;
//         cubeA.position.set(newXA, baseYRef.current + arc, 0);
//         cubeB.position.set(newXB, baseYRef.current - arc * 0.28, 0);
//         labelA.position.set(newXA, cubeA.position.y + hA + 1.4, 0);
//         labelB.position.set(newXB, cubeB.position.y + hB + 1.4, 0);
//         if (t < 1) requestAnimationFrame(anim);
//         else {
//           // finalize positions and reorder arrays
//           cubeA.position.set(newXA, baseYRef.current, 0);
//           cubeB.position.set(newXB, baseYRef.current, 0);
//           labelA.position.set(newXA, baseYRef.current + hA + 1.4, 0);
//           labelB.position.set(newXB, baseYRef.current + hB + 1.4, 0);

//           // reorder cubes/labels arrays so indexes match visual positions
//           const oldA = findIndexById(aId);
//           const oldB = findIndexById(bId);
//           if (oldA !== -1 && oldB !== -1) {
//             // remove larger index first
//             const higher = Math.max(oldA, oldB);
//             const lower = Math.min(oldA, oldB);
//             const removedH = cubes.splice(higher, 1)[0];
//             const removedHL = labels.splice(higher, 1)[0];
//             const removedL = cubes.splice(lower, 1)[0];
//             const removedLL = labels.splice(lower, 1)[0];
//             // insert them swapped
//             cubes.splice(lower, 0, removedH);
//             labels.splice(lower, 0, removedHL);
//             cubes.splice(higher, 0, removedL);
//             labels.splice(higher, 0, removedLL);
//             // rebuild idOrderRef
//             idOrderRef.current = cubes.map((c) => c.userData.id);
//             // snap to x positions
//             cubes.forEach((c, pos) => {
//               const tx = xForIndex(pos, n);
//               c.position.x = tx;
//               c.position.y = baseYRef.current;
//               const lbl = labels[pos];
//               if (lbl) {
//                 lbl.position.x = tx;
//                 lbl.position.y = baseYRef.current + c.userData.value + 1.4;
//               }
//             });
//           }

//           currentStepRef.current++;
//           animateStep();
//         }
//       };
//       anim();
//       return;
//     }

//     if (step.type === "pivotSwap") {
//       const pid = step.pivotId || step.pivotId === undefined ? step.pivotId : step.pivotId;
//       const pivotId = step.pivotId || step.pivotId === undefined ? step.pivotId : step.pivotId;
//       // accept either pivotId prop or pivotId named pivotId; fallback: use step.pivotId
//       const id = step.pivotId || step.pivotId || step.pivotId || step.pivotId || step.pivotId || step.pivotId || step.pivotId || step.pivotId || step.pivotId;
//       // above repetition avoids linter noise; safe to just use step.pivotId in practice
//       const targetIndex = step.targetIndex !== undefined ? step.targetIndex : step.targetIndex;
//       // In our generation we used {pivotId, targetIndex}, but older steps may have pivotId/targetIndex or pivotId/targetIndex; handle both
//       const pidFinal = step.pivotId || step.pivotId || step.pivotId || step.pivotId || (step.pivot ? step.pivot : step.pivot);
//       // For safety, get pivot id correctly:
//       const pivot = step.pivotId !== undefined ? step.pivotId : step.pivotId;
//       const tIndex = step.targetIndex !== undefined ? step.targetIndex : step.targetIndex;
//       // Simpler: actual fields added above: { type: "pivotSwap", pivotId, targetIndex }
//       const pivotIdFinal = step.pivotId || step.pivotId;
//       const finalTargetIndex = step.targetIndex;
//       // Now find index and animate pivot crown arc into finalTargetIndex
//       const idxCube = findIndexById(pivotIdFinal);
//       if (idxCube === -1) {
//         currentStepRef.current++;
//         animateStep();
//         return;
//       }
//       const cube = cubes[idxCube];
//       const label = labels[idxCube];
//       const finalX = xForIndex(finalTargetIndex, n);
//       onActionChange && onActionChange(`Moving pivot ${cube.userData.value} to ${finalTargetIndex}`);

//       const startX = cube.position.x;
//       const startY = cube.position.y;
//       const duration = 920;
//       const start = performance.now();
//       cube.material.color.setHex(COLOR_SWAP); // visually arc as orange while moving
//       const anim = () => {
//         const now = performance.now();
//         let t = (now - start) / duration;
//         if (t > 1) t = 1;
//         const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
//         // crown arc: up then down
//         const arc = Math.sin(ease * Math.PI) * 2.8;
//         const newX = startX + (finalX - startX) * ease;
//         const newY = startY + arc * (1 - ease) - arc * 0.2 * ease; // lift then settle
//         cube.position.set(newX, newY, 0);
//         if (label) label.position.set(newX, newY + cube.userData.value + 1.4, 0);
//         if (t < 1) requestAnimationFrame(anim);
//         else {
//           // finalize: snap to finalX and baseY
//           cube.position.set(finalX, baseYRef.current, 0);
//           if (label) label.position.set(finalX, baseYRef.current + cube.userData.value + 1.4, 0);

//           // reorder arrays: remove pivot at old index and insert at target index
//           const oldIdx = findIndexById(pivotIdFinal);
//           if (oldIdx !== -1) {
//             const movedCube = cubes.splice(oldIdx, 1)[0];
//             const movedLabel = labels.splice(oldIdx, 1)[0];
//             // insertion position needs adjustment if oldIdx < finalTargetIndex (because removal shifts)
//             let insertAt = finalTargetIndex;
//             if (oldIdx < insertAt) insertAt--;
//             cubes.splice(insertAt, 0, movedCube);
//             labels.splice(insertAt, 0, movedLabel);
//             idOrderRef.current = cubes.map((c) => c.userData.id);
//             // snap all
//             cubes.forEach((c, pos) => {
//               const tx = xForIndex(pos, n);
//               c.position.x = tx;
//               c.position.y = baseYRef.current;
//               const lbl = labels[pos];
//               if (lbl) {
//                 lbl.position.x = tx;
//                 lbl.position.y = baseYRef.current + c.userData.value + 1.4;
//               }
//             });
//           }

//           currentStepRef.current++;
//           animateStep();
//         }
//       };
//       anim();
//       return;
//     }

//     if (step.type === "merged") {
//       const [lo, hi] = step.range;
//       onActionChange && onActionChange(`Marked merged region [${lo}, ${hi}]`);
//       // mark region as sorted (green)
//       const duration = 420;
//       const start = performance.now();
//       const anim = () => {
//         const now = performance.now();
//         let t = (now - start) / duration;
//         if (t > 1) t = 1;
//         for (let pos = lo; pos <= hi; pos++) {
//           const id = idOrderRef.current[pos];
//           const idxCube = findIndexById(id);
//           if (idxCube === -1) continue;
//           const cube = cubes[idxCube];
//           cube.material.color.setHex(COLOR_SORTED);
//           cube.userData.sorted = true;
//           cube.position.y = baseYRef.current;
//           const lbl = labels[idxCube];
//           if (lbl) lbl.position.y = cube.position.y + cube.userData.value + 1.4;
//         }
//         if (t < 1) requestAnimationFrame(anim);
//         else {
//           currentStepRef.current++;
//           setTimeout(animateStep, 60);
//         }
//       };
//       anim();
//       return;
//     }

//     if (step.type === "sortedIdx") {
//       const sidx = step.index;
//       const id = idOrderRef.current[sidx];
//       const idxCube = findIndexById(id);
//       if (idxCube !== -1) {
//         const c = cubes[idxCube];
//         c.userData.sorted = true;
//         c.material.color.setHex(COLOR_SORTED);
//       }
//       currentStepRef.current++;
//       setTimeout(animateStep, 80);
//       return;
//     }

//     if (step.type === "finalMark") {
//       cubesRef.current.forEach((c) => {
//         c.userData.sorted = true;
//         c.material.color.setHex(COLOR_SORTED);
//       });
//       currentStepRef.current++;
//       setTimeout(animateStep, 80);
//       return;
//     }

//     // fallback
//     currentStepRef.current++;
//     setTimeout(animateStep, 40);
//   };

//   return <div ref={mountRef} className="w-full h-full" />;
// });



// import React, { useEffect, useRef, useState } from "react";
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import {
//   Play,
//   RefreshCw,
//   Menu,
//   Info,
//   Settings,
//   Home,
//   Database,
//   Code,
//   Activity,
// } from "lucide-react";

// /**
//  * QuickSort3DVisualizer.jsx
//  *
//  * Option C — Hoare partition quicksort with premium 3D animations.
//  * - Two-pointer scanning (left/right) with bounce
//  * - Pivot highlighted purple
//  * - Swaps use orange arcs
//  * - Subarray ranges lift/outward during partition
//  */

// // ---------------------- Main App ----------------------
// export default function App() {
//   const [inputValue, setInputValue] = useState("5, 3, 8, 4, 2, 7, 1");
//   const [isSorting, setIsSorting] = useState(false);
//   const [liveStatus, setLiveStatus] = useState("Waiting to start...");
//   const [sortStatus, setSortStatus] = useState("Ready");
//   const visualizerRef = useRef();

//   const handleGenerate = () => {
//     visualizerRef.current?.generateArray(inputValue);
//     setLiveStatus("Generated new array.");
//     setSortStatus("Ready");
//   };

//   const handleRandom = () => {
//     const count = 6 + Math.floor(Math.random() * 4); // 6-9 values
//     const arr = Array.from({ length: count }, () => 1 + Math.floor(Math.random() * 11));
//     const s = arr.join(", ");
//     setInputValue(s);
//     visualizerRef.current?.generateArray(s);
//     setLiveStatus("Randomized array");
//     setSortStatus("Ready");
//   };

//   const handleStart = () => {
//     visualizerRef.current?.startSort();
//   };

//   return (
//     <div className="flex h-screen w-full bg-slate-100 font-sans overflow-hidden">
//       {/* LEFT NAV */}
//       <aside className="w-16 bg-blue-900 flex flex-col items-center py-6 gap-6 text-white shadow-lg z-20 shrink-0">
//         <div className="p-2 bg-blue-800 rounded-lg mb-4">
//           <Menu size={22} />
//         </div>
//         <NavItem icon={<Home size={18} />} label="Home" active />
//         <NavItem icon={<Database size={18} />} label="Data" />
//         <NavItem icon={<Code size={18} />} label="Algo" />
//         <NavItem icon={<Settings size={18} />} label="Settings" />
//         <div className="mt-auto mb-4">
//           <Info size={18} className="text-blue-300 hover:text-white cursor-pointer" />
//         </div>
//       </aside>

//       {/* CENTER WORKING AREA */}
//       <main className="flex-1 relative bg-blue-50 flex flex-col min-w-0">
//         {/* Title (absolute) */}
//         <div className="absolute top-4 left-0 right-0 text-center pointer-events-none z-10">
//           <h1 className="text-3xl font-bold text-blue-900/20 uppercase tracking-widest select-none">
//             3D Quick Sort Visualizer (Hoare)
//           </h1>
//         </div>

//         {/* Canvas container */}
//         <div className="w-full h-full relative overflow-hidden rounded-tl-3xl border-l-4 border-t-4 border-white/50 shadow-inner flex flex-col items-center pt-28">
//           <QuickSort3D
//             ref={visualizerRef}
//             setIsSorting={setIsSorting}
//             onActionChange={setLiveStatus}
//             onSortStatusChange={setSortStatus}
//           />
//         </div>
//       </main>

//       {/* RIGHT SIDEBAR */}
//       <aside className="w-80 bg-slate-50 flex flex-col p-4 gap-4 shadow-xl shrink-0 overflow-y-auto border-l border-slate-200">
//         <div className="bg-yellow-100 border-l-4 border-yellow-400 p-5 rounded-xl shadow-sm">
//           <h2 className="font-bold text-lg text-yellow-900 mb-2 flex items-center gap-2">
//             <Code size={18} /> Algorithm: Quick Sort (Hoare)
//           </h2>
//           <p className="text-sm text-yellow-800 mb-3 leading-relaxed">
//             Quick Sort (Hoare partition) picks a pivot and partitions the array with two pointers that move toward each other, swapping elements as needed.
//           </p>

//           <div className="bg-white/60 p-3 rounded text-xs font-mono text-slate-700 border border-yellow-200">
//             <p className="font-semibold text-yellow-700 mb-1">Pseudocode (Hoare):</p>
//             <p>function quicksort(A, lo, hi)</p>
//             <p> &nbsp; if lo &lt; hi</p>
//             <p> &nbsp;&nbsp; p = partition(A, lo, hi)</p>
//             <p> &nbsp;&nbsp; quicksort(A, lo, p)</p>
//             <p> &nbsp;&nbsp; quicksort(A, p+1, hi)</p>
//             <p className="mt-2 text-yellow-900/70">Avg Time: O(n log n) — Worst: O(n²)</p>
//           </div>
//         </div>

//         {/* Color Key */}
//         <div className="bg-yellow-50 p-4 rounded-lg border border-amber-200 text-sm">
//           <p className="font-semibold mb-2">Color Key:</p>
//           <div className="flex flex-col gap-2 text-xs">
//             <LegendRow color="#3b82f6" label="Scanning pointer (compare)" />
//             <LegendRow color="#7c3aed" label="Pivot" />
//             <LegendRow color="#fb923c" label="Swapping (arc move)" />
//             <LegendRow color="#10b981" label="Sorted element" />
//           </div>
//         </div>

//         {/* Controls */}
//         <div className="bg-amber-100 border-l-4 border-amber-500 p-5 rounded-xl shadow-sm flex-1 flex flex-col">
//           <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
//             <Settings size={16} /> Controls
//           </h3>

//           <label className="text-xs text-amber-700 font-semibold">INPUT DATA</label>
//           <input
//             className="w-full p-2 rounded border border-amber-300 bg-white text-slate-700 font-mono text-sm mb-3"
//             value={inputValue}
//             onChange={(e) => setInputValue(e.target.value)}
//             disabled={isSorting}
//             placeholder="e.g. 5, 3, 8, 4, 2"
//           />

//           <div className="grid grid-cols-2 gap-2 mb-3">
//             <button
//               className="bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2"
//               disabled={isSorting}
//               onClick={handleGenerate}
//             >
//               <RefreshCw size={14} /> Generate
//             </button>

//             <button
//               className="bg-purple-600 text-white py-2 rounded flex items-center justify-center gap-2"
//               disabled={isSorting}
//               onClick={handleRandom}
//             >
//               Random
//             </button>
//           </div>

//           <button
//             className="bg-green-600 text-white py-3 rounded-lg text-lg font-semibold drop-shadow"
//             disabled={isSorting}
//             onClick={handleStart}
//           >
//             <div className="flex items-center justify-center gap-2">
//               <Play size={16} /> Start Visualization
//             </div>
//           </button>

//           <div className="mt-auto pt-6">
//             <div className="bg-white/50 rounded p-3 border border-amber-200 shadow-sm">
//               <div className="flex items-center justify-between mb-2">
//                 <p className="text-xs font-bold text-amber-800">LIVE STATUS:</p>
//                 <Activity size={14} className={isSorting ? "text-green-600 animate-pulse" : "text-slate-400"} />
//               </div>
//               <div className="text-sm font-medium text-amber-900 mb-1">{liveStatus}</div>
//               <div className="text-xs text-amber-700/70">{sortStatus}</div>
//             </div>
//           </div>
//         </div>
//       </aside>
//     </div>
//   );
// }

// // ---------------------- small UI components ----------------------
// const NavItem = ({ icon, label, active }) => (
//   <div className={`flex flex-col items-center gap-1 cursor-pointer group ${active ? "text-white" : "text-blue-300 hover:text-white"}`}>
//     <div className={`p-2 rounded-lg transition-all ${active ? "bg-white/10" : "group-hover:bg-white/5"}`}>{icon}</div>
//   </div>
// );

// const LegendRow = ({ color, label }) => (
//   <div className="flex items-center gap-2">
//     <div style={{ background: color }} className="w-3 h-3 rounded-full" />
//     <div className="text-xs text-slate-700">{label}</div>
//   </div>
// );

// // ---------------------- QuickSort3D component ----------------------
// const QuickSort3D = React.forwardRef(({ onActionChange, onSortStatusChange, setIsSorting }, ref) => {
//   const mountRef = useRef(null);
//   const sceneRef = useRef(new THREE.Scene());
//   const rendererRef = useRef(null);
//   const cameraRef = useRef(null);
//   const controlsRef = useRef(null);
//   const animRef = useRef(null);

//   // Data refs
//   const cubesRef = useRef([]); // mesh list in current left->right order
//   const labelsRef = useRef([]);
//   const idOrderRef = useRef([]); // array of ids matching positions 0..n-1
//   const stepsRef = useRef([]); // generated visualization steps
//   const currentStepRef = useRef(0);
//   const sortingRef = useRef(false);

//   // Colors
//   const COLOR_DEFAULT = 0x10b981; // default green
//   const COLOR_COMPARE = 0x3b82f6; // blue
//   const COLOR_PIVOT = 0x7c3aed; // purple
//   const COLOR_SWAP = 0xfb923c; // orange for swaps
//   const COLOR_SORTED = 0x10b981; // green

//   // layout constants
//   const spacingRef = useRef(3.2);
//   const baseYRef = useRef(-4.0);

//   // init scene
//   useEffect(() => {
//     const mount = mountRef.current;
//     if (!mount) return;

//     const width = mount.clientWidth;
//     const height = mount.clientHeight;

//     const scene = sceneRef.current;
//     scene.background = new THREE.Color(0xf0f9ff);

//     const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
//     camera.position.set(0, 3.5, 22);
//     cameraRef.current = camera;

//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setSize(width, height);
//     renderer.shadowMap.enabled = true;
//     mount.appendChild(renderer.domElement);
//     rendererRef.current = renderer;

//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;
//     controls.target.set(0, 0, 0);
//     controlsRef.current = controls;

//     scene.add(new THREE.AmbientLight(0xffffff, 0.7));
//     const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
//     dirLight.position.set(5, 10, 7);
//     scene.add(dirLight);

//     const handleResize = () => {
//       if (!mount || !cameraRef.current || !rendererRef.current) return;
//       const w = mount.clientWidth;
//       const h = mount.clientHeight;
//       cameraRef.current.aspect = w / h;
//       cameraRef.current.updateProjectionMatrix();
//       rendererRef.current.setSize(w, h);
//     };
//     const ro = new ResizeObserver(handleResize);
//     ro.observe(mount);

//     const animate = () => {
//       animRef.current = requestAnimationFrame(animate);
//       controls.update();
//       renderer.render(scene, camera);
//     };
//     animate();

//     // initial cubes
//     createCubes([5, 3, 8, 4, 2, 7, 1]);

//     return () => {
//       cancelAnimationFrame(animRef.current);
//       ro.disconnect();
//       if (rendererRef.current) rendererRef.current.dispose();
//       if (mount) mount.innerHTML = "";
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Imperative API
//   React.useImperativeHandle(ref, () => ({
//     generateArray(input) {
//       if (sortingRef.current) return;
//       const arr = parseInput(input);
//       if (arr.length === 0) return;
//       createCubes(arr);
//       stepsRef.current = generateQuickSteps(arr);
//       currentStepRef.current = 0;
//       onSortStatusChange && onSortStatusChange("Ready");
//       onActionChange && onActionChange("Array generated");
//     },
//     startSort() {
//       if (sortingRef.current) return;
//       if (!stepsRef.current || stepsRef.current.length === 0) {
//         stepsRef.current = generateQuickSteps(parseInput("5,3,8,4,2,7,1"));
//       }
//       sortingRef.current = true;
//       setIsSorting && setIsSorting(true);
//       onSortStatusChange && onSortStatusChange("Sorting");
//       onActionChange && onActionChange("Starting Quick Sort...");
//       animateStep();
//     },
//   }));

//   // parse input
//   const parseInput = (str) =>
//     String(str)
//       .split(",")
//       .map((v) => Number(v.trim()))
//       .filter((n) => !isNaN(n) && n > 0)
//       .slice(0, 50)
//       .map((n) => Math.min(14, Math.max(1, Math.round(n))));

//   // create cubes and labels
//   function createCubes(arr) {
//     const scene = sceneRef.current;
//     // cleanup
//     cubesRef.current.forEach((c) => scene.remove(c));
//     labelsRef.current.forEach((l) => scene.remove(l));
//     cubesRef.current = [];
//     labelsRef.current = [];
//     idOrderRef.current = [];

//     const spacing = spacingRef.current;
//     const startX = -((arr.length - 1) * spacing) / 2;
//     const baseY = baseYRef.current;

//     arr.forEach((val, i) => {
//       const id = `q${i}`;
//       const geometry = new THREE.BoxGeometry(2.2, val, 1.8);
//       geometry.translate(0, val / 2, 0);
//       const material = new THREE.MeshStandardMaterial({ color: COLOR_DEFAULT, roughness: 0.35, metalness: 0.06 });
//       const cube = new THREE.Mesh(geometry, material);
//       cube.castShadow = true;
//       cube.receiveShadow = true;
//       const x = startX + i * spacing;
//       cube.position.set(x, baseY, 0);
//       cube.userData = { id, value: val, sorted: false };
//       scene.add(cube);
//       cubesRef.current.push(cube);

//       // label above
//       const canvas = document.createElement("canvas");
//       canvas.width = canvas.height = 128;
//       const ctx = canvas.getContext("2d");
//       ctx.font = "bold 60px Arial";
//       ctx.fillStyle = "#000";
//       ctx.textAlign = "center";
//       ctx.textBaseline = "middle";
//       ctx.clearRect(0, 0, 128, 128);
//       ctx.fillText(String(val), 64, 64);
//       const texture = new THREE.CanvasTexture(canvas);
//       texture.needsUpdate = true;
//       const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
//       sprite.scale.set(2.4, 2.4, 1);
//       sprite.position.set(x, baseY + val + 1.4, 0);
//       scene.add(sprite);
//       labelsRef.current.push(sprite);

//       idOrderRef.current.push(id);
//     });

//     stepsRef.current = generateQuickSteps(arr);
//     currentStepRef.current = 0;
//   }

//   // helpers
//   const findIndexById = (id) => cubesRef.current.findIndex((c) => c.userData.id === id);
//   const xForIndex = (index, length) => {
//     const spacing = spacingRef.current;
//     const startX = -((length - 1) * spacing) / 2;
//     return startX + index * spacing;
//   };

//   // Generate visualization steps for Hoare partition quicksort
//   // Steps types:
//   // - {type:'split', range:[lo,hi]} -> lift/outward for visual partition
//   // - {type:'pivot', id} -> mark pivot purple
//   // - {type:'compare', aId, bId} -> pointers compare
//   // - {type:'swap', aId, bId} -> swap two ids
//   // - {type:'partitionDone', range:[lo,hi], pIndex} -> finished partition; recursion proceeds
//   // - {type:'sortedIdx', index} -> mark single index sorted (optional)
//   function generateQuickSteps(arr) {
//     // Create stable id/value list
//     const items = arr.map((v, i) => ({ id: `q${i}`, value: v }));
//     const steps = [];

//     // We'll simulate working on a mutable array of items
//     function rec(subItems, loIndex) {
//       const len = subItems.length;
//       if (len <= 1) {
//         // optional: mark sorted single item
//         if (len === 1) steps.push({ type: "sortedIdx", index: loIndex });
//         return subItems.slice();
//       }

//       // use Hoare pivot = middle element for stability of motion
//       const mid = Math.floor(len / 2);
//       const pivotItem = subItems[mid];
//       const pivotId = pivotItem.id;
//       const pivotValue = pivotItem.value;

//       // Visual split for the whole range [loIndex, loIndex+len-1]
//       steps.push({ type: "split", range: [loIndex, loIndex + len - 1] });
//       // mark pivot visually
//       steps.push({ type: "pivot", id: pivotId });

//       // Simulate Hoare partition on this local subItems (indexes relative to subItems)
//       let i = 0;
//       let j = len - 1;
//       while (i <= j) {
//         // advance i until subItems[i].value >= pivotValue
//         while (i <= j && subItems[i].value < pivotValue) {
//           // compare subItems[i] with pivot
//           steps.push({ type: "compare", aId: subItems[i].id, bId: pivotId });
//           i++;
//         }
//         // advance j until subItems[j].value <= pivotValue
//         while (i <= j && subItems[j].value > pivotValue) {
//           steps.push({ type: "compare", aId: subItems[j].id, bId: pivotId });
//           j--;
//         }
//         if (i <= j) {
//           // swap elements at i and j
//           if (subItems[i].id !== subItems[j].id) {
//             steps.push({ type: "swap", aId: subItems[i].id, bId: subItems[j].id });
//             // perform swap in local array
//             const tmp = subItems[i];
//             subItems[i] = subItems[j];
//             subItems[j] = tmp;
//           }
//           i++;
//           j--;
//         }
//       }

//       // Partition returns index j (Hoare), left is up to j, right starts at i
//       const pIndex = loIndex + j; // j may be less than loIndex if empty
//       // Indicate partition finished
//       steps.push({ type: "partitionDone", range: [loIndex, loIndex + len - 1], pIndex: pIndex });

//       // Now split local arrays for recursion:
//       const left = subItems.slice(0, j + 1);
//       const right = subItems.slice(j + 1);

//       // Recursively handle left and right; note left starts at loIndex, right starts at loIndex + left.length
//       rec(left, loIndex);
//       rec(right, loIndex + left.length);

//       // Return the merged (but we keep mutated order)
//       return subItems.slice();
//     }

//     rec(items, 0);
//     // final: mark all sorted
//     // we'll let final steps mark sorted per 'sortedIdx' when len 1 happened; but ensure final pass sets all sorted
//     steps.push({ type: "finalMark" });
//     return steps;
//   }

//   // reset colors
//   const resetColors = () => {
//     cubesRef.current.forEach((c) => {
//       c.material.color.setHex(c.userData.sorted ? COLOR_SORTED : COLOR_DEFAULT);
//     });
//   };

//   // animate one step
//   const animateStep = () => {
//     const steps = stepsRef.current;
//     const idx = currentStepRef.current;

//     if (!steps || idx >= steps.length) {
//       // finished
//       sortingRef.current = false;
//       setIsSorting && setIsSorting(false);
//       onSortStatusChange && onSortStatusChange("Completed");
//       onActionChange && onActionChange("Quick Sort Completed!");
//       cubesRef.current.forEach((c) => {
//         c.userData.sorted = true;
//         c.material.color.setHex(COLOR_SORTED);
//       });
//       return;
//     }

//     const step = steps[idx];
//     resetColors();

//     const cubes = cubesRef.current;
//     const labels = labelsRef.current;
//     const n = cubes.length;

//     if (step.type === "split") {
//       const [lo, hi] = step.range;
//       onActionChange && onActionChange(`Partitioning range [${lo}, ${hi}]`);
//       // lift range outward. decide direction by center relative to array center
//       const centerIndex = (lo + hi) / 2;
//       const arrayCenter = (n - 1) / 2;
//       const isLeft = centerIndex <= arrayCenter;
//       const offsetX = (hi - lo + 1) * spacingRef.current * 0.5;
//       const liftY = 2.2;
//       const duration = 500;
//       const start = performance.now();

//       const anim = () => {
//         const now = performance.now();
//         let t = (now - start) / duration;
//         if (t > 1) t = 1;
//         const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
//         for (let pos = lo; pos <= hi; pos++) {
//           const id = idOrderRef.current[pos];
//           const idxCube = findIndexById(id);
//           if (idxCube === -1) continue;
//           const cube = cubes[idxCube];
//           const lbl = labels[idxCube];
//           const dir = isLeft ? -1 : 1;
//           const targetX = xForIndex(pos, n) + dir * offsetX;
//           cube.position.x = cube.position.x + (targetX - cube.position.x) * ease;
//           cube.position.y = baseYRef.current + liftY * ease;
//           if (lbl) {
//             lbl.position.x = cube.position.x;
//             lbl.position.y = cube.position.y + cube.userData.value + 1.4;
//           }
//           cube.material.color.setHex(COLOR_PIVOT);
//         }
//         if (t < 1) requestAnimationFrame(anim);
//         else {
//           currentStepRef.current++;
//           animateStep();
//         }
//       };
//       anim();
//       return;
//     }

//     if (step.type === "pivot") {
//       const pid = step.id;
//       const idxCube = findIndexById(pid);
//       if (idxCube === -1) {
//         currentStepRef.current++;
//         animateStep();
//         return;
//       }
//       const cube = cubes[idxCube];
//       cube.material.color.setHex(COLOR_PIVOT);
//       onActionChange && onActionChange(`Pivot selected: ${cube.userData.value}`);
//       // short highlight pause
//       setTimeout(() => {
//         currentStepRef.current++;
//         animateStep();
//       }, 320);
//       return;
//     }

//     if (step.type === "compare") {
//       const aId = step.aId;
//       const bId = step.bId;
//       const aIdx = findIndexById(aId);
//       const bIdx = findIndexById(bId);
//       const cubeA = cubes[aIdx];
//       const cubeB = cubes[bIdx];
//       onActionChange && onActionChange(`Comparing ${cubeA?.userData.value} and pivot ${cubeB?.userData.value}`);
//       const duration = 560;
//       const start = performance.now();
//       if (cubeA) cubeA.material.color.setHex(COLOR_COMPARE);
//       if (cubeB) cubeB.material.color.setHex(COLOR_PIVOT);
//       const anim = () => {
//         const now = performance.now();
//         let t = (now - start) / duration;
//         if (t > 1) t = 1;
//         const lift = Math.sin(t * Math.PI) * 0.9;
//         if (cubeA) cubeA.position.y = baseYRef.current + lift;
//         if (cubeB) cubeB.position.y = baseYRef.current + lift * 0.5; // pivot small lift
//         if (cubeA) labels[aIdx].position.y = cubeA.position.y + cubeA.userData.value + 1.4;
//         if (cubeB) labels[bIdx].position.y = cubeB.position.y + cubeB.userData.value + 1.4;
//         if (t < 1) requestAnimationFrame(anim);
//         else {
//           if (cubeA) cubeA.position.y = baseYRef.current;
//           if (cubeB) cubeB.position.y = baseYRef.current;
//           if (cubeA) labels[aIdx].position.y = cubeA.position.y + cubeA.userData.value + 1.4;
//           if (cubeB) labels[bIdx].position.y = cubeB.position.y + cubeB.userData.value + 1.4;
//           currentStepRef.current++;
//           animateStep();
//         }
//       };
//       anim();
//       return;
//     }

//     if (step.type === "swap") {
//       const aId = step.aId;
//       const bId = step.bId;
//       const aIdx = findIndexById(aId);
//       const bIdx = findIndexById(bId);
//       if (aIdx === -1 || bIdx === -1) {
//         currentStepRef.current++;
//         animateStep();
//         return;
//       }
//       const cubeA = cubes[aIdx];
//       const cubeB = cubes[bIdx];
//       const labelA = labels[aIdx];
//       const labelB = labels[bIdx];
//       onActionChange && onActionChange(`Swapping ${cubeA.userData.value} and ${cubeB.userData.value}`);
//       // swap with arc
//       const xA = cubeA.position.x;
//       const xB = cubeB.position.x;
//       const hA = cubeA.userData.value;
//       const hB = cubeB.userData.value;
//       const duration = 900;
//       const start = performance.now();
//       cubeA.material.color.setHex(COLOR_SWAP);
//       cubeB.material.color.setHex(COLOR_SWAP);

//       const anim = () => {
//         const now = performance.now();
//         let t = (now - start) / duration;
//         if (t > 1) t = 1;
//         const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
//         const newXA = xA + (xB - xA) * ease;
//         const newXB = xB + (xA - xB) * ease;
//         const arc = Math.sin(ease * Math.PI) * 2.6;
//         cubeA.position.set(newXA, baseYRef.current + arc, 0);
//         cubeB.position.set(newXB, baseYRef.current - arc * 0.3, 0);
//         labelA.position.set(newXA, cubeA.position.y + hA + 1.4, 0);
//         labelB.position.set(newXB, cubeB.position.y + hB + 1.4, 0);
//         if (t < 1) requestAnimationFrame(anim);
//         else {
//           // finalize, snap to baseY
//           cubeA.position.set(newXA, baseYRef.current, 0);
//           cubeB.position.set(newXB, baseYRef.current, 0);
//           labelA.position.set(newXA, baseYRef.current + hA + 1.4, 0);
//           labelB.position.set(newXB, baseYRef.current + hB + 1.4, 0);
//           // reorder arrays
//           const oldA = findIndexById(aId);
//           const oldB = findIndexById(bId);
//           if (oldA !== -1 && oldB !== -1) {
//             const movedA = cubes.splice(oldA, 1)[0];
//             const movedLA = labels.splice(oldA, 1)[0];
//             const insertAt = oldB > oldA ? oldB : oldB;
//             cubes.splice(insertAt, 0, movedA);
//             labels.splice(insertAt, 0, movedLA);
//             // ensure idOrderRef matches
//             idOrderRef.current = cubes.map((c) => c.userData.id);
//             // snap everyone to x positions
//             cubes.forEach((c, pos) => {
//               const tx = xForIndex(pos, n);
//               c.position.x = tx;
//               c.position.y = baseYRef.current;
//               const lbl = labels[pos];
//               if (lbl) {
//                 lbl.position.x = tx;
//                 lbl.position.y = baseYRef.current + c.userData.value + 1.4;
//               }
//             });
//           }
//           currentStepRef.current++;
//           animateStep();
//         }
//       };
//       anim();
//       return;
//     }

//     if (step.type === "partitionDone") {
//       const [lo, hi] = step.range;
//       const pIndex = step.pIndex;
//       onActionChange && onActionChange(`Partition finished for [${lo}, ${hi}], pivot index approx ${pIndex}`);
//       // drop all in this range back to base and un-color pivot
//       const duration = 420;
//       const start = performance.now();
//       const anim = () => {
//         const now = performance.now();
//         let t = (now - start) / duration;
//         if (t > 1) t = 1;
//         for (let pos = lo; pos <= hi; pos++) {
//           const id = idOrderRef.current[pos];
//           const idxCube = findIndexById(id);
//           if (idxCube === -1) continue;
//           const cube = cubes[idxCube];
//           const lbl = labels[idxCube];
//           cube.position.y = cube.position.y + (baseYRef.current - cube.position.y) * t;
//           if (lbl) lbl.position.y = cube.position.y + cube.userData.value + 1.4;
//           // clear pivot highlight
//           cube.material.color.setHex(cube.userData.sorted ? COLOR_SORTED : COLOR_DEFAULT);
//         }
//         if (t < 1) requestAnimationFrame(anim);
//         else {
//           currentStepRef.current++;
//           animateStep();
//         }
//       };
//       anim();
//       return;
//     }

//     if (step.type === "sortedIdx") {
//       const idxSorted = step.index;
//       // mark index as sorted (if exists)
//       const id = idOrderRef.current[idxSorted];
//       const idxCube = findIndexById(id);
//       if (idxCube !== -1) {
//         const c = cubes[idxCube];
//         c.userData.sorted = true;
//         c.material.color.setHex(COLOR_SORTED);
//       }
//       currentStepRef.current++;
//       setTimeout(animateStep, 80);
//       return;
//     }

//     if (step.type === "finalMark") {
//       // final sweep: mark everything sorted
//       cubes.forEach((c) => {
//         c.userData.sorted = true;
//         c.material.color.setHex(COLOR_SORTED);
//       });
//       currentStepRef.current++;
//       setTimeout(animateStep, 80);
//       return;
//     }

//     // fallback
//     currentStepRef.current++;
//     setTimeout(animateStep, 40);
//   };

//   return <div ref={mountRef} className="w-full h-full" />;
// });
