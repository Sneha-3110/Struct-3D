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
 * MergeSort3DVisualizer.jsx
 *
 * Option C — Premium 3D Merge Sort animation:
 * - Subarray lift & split outward
 * - Compare = blue bounce
 * - Selected/taken element = orange arc into merged slot
 * - Merged segment returns and turns green
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
        {/* Title */}
        <div className="absolute top-4 left-0 right-0 text-center pointer-events-none z-10">
          <h1 className="text-3xl font-bold text-blue-900/20 uppercase tracking-widest select-none">
            3D Merge Sort Visualizer
          </h1>
        </div>

        {/* Canvas container */}
        <div className="w-full h-full relative overflow-hidden rounded-tl-3xl border-l-4 border-t-4 border-white/50 shadow-inner flex flex-col items-center pt-28">
          <MergeSort3D
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
            <Code size={18} /> Algorithm: Merge Sort
          </h2>
          <p className="text-sm text-yellow-800 mb-3 leading-relaxed">
            Merge Sort is a divide-and-conquer algorithm that splits the array, sorts halves, and merges them.
          </p>

          <div className="bg-white/60 p-3 rounded text-xs font-mono text-slate-700 border border-yellow-200">
            <p className="font-semibold text-yellow-700 mb-1">Pseudocode (high-level):</p>
            <p>1. if size &lt;= 1 return</p>
            <p>2. split array into left and right</p>
            <p>3. recursively sort left and right</p>
            <p>4. merge left and right into sorted array</p>
            <p className="mt-2 text-yellow-900/70">Time Complexity: O(n log n)</p>
          </div>
        </div>

        {/* Color Key */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-amber-200 text-sm">
          <p className="font-semibold mb-2">Color Key:</p>
          <div className="flex flex-col gap-2 text-xs">
            <LegendRow color="#3b82f6" label="Comparing (pair)" />
            <LegendRow color="#7c3aed" label="Subarray Lift / Split" />
            <LegendRow color="#fb923c" label="Taken / Moved into merged slot" />
            <LegendRow color="#10b981" label="Merged / Sorted segment" />
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

// ---------------------- MergeSort3D component ----------------------
const MergeSort3D = React.forwardRef(({ onActionChange, onSortStatusChange, setIsSorting }, ref) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const animRef = useRef(null);

  // Data refs
  const cubesRef = useRef([]); // ordered array of mesh cubes
  const labelsRef = useRef([]); // ordered array of sprites
  const idOrderRef = useRef([]); // ordered list of ids matching positions 0..n-1
  const stepsRef = useRef([]);
  const currentStepRef = useRef(0);
  const sortingRef = useRef(false);

  // Colors
  const COLOR_DEFAULT = 0x10b981; // green default
  const COLOR_COMPARE = 0x3b82f6; // blue
  const COLOR_SPLIT = 0x7c3aed; // purple for lifted subarray
  const COLOR_TAKE = 0xfb923c; // orange for moving into merged position
  const COLOR_SORTED = 0x10b981; // final green

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
      stepsRef.current = generateMergeSteps(arr);
      currentStepRef.current = 0;
      onSortStatusChange && onSortStatusChange("Ready");
      onActionChange && onActionChange("Array generated");
    },
    startSort() {
      if (sortingRef.current) return;
      if (!stepsRef.current || stepsRef.current.length === 0) {
        stepsRef.current = generateMergeSteps(parseInput("5,3,8,4,2"));
      }
      sortingRef.current = true;
      setIsSorting && setIsSorting(true);
      onSortStatusChange && onSortStatusChange("Sorting");
      onActionChange && onActionChange("Starting Merge Sort...");
      animateStep();
    },
  }));

  // parse input to numbers and clamp heights
  const parseInput = (str) =>
    String(str)
      .split(",")
      .map((v) => Number(v.trim()))
      .filter((n) => !isNaN(n) && n > 0)
      .slice(0, 50)
      .map((n) => Math.min(14, Math.max(1, Math.round(n))));

  // create cubes and labels, assign stable ids
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
      const id = `m${i}`;
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

    stepsRef.current = generateMergeSteps(arr);
    currentStepRef.current = 0;
  }

  // Utility: find cube/label index in cubesRef by id
  const findIndexById = (id) => cubesRef.current.findIndex((c) => c.userData.id === id);

  // Utility: compute x position for a global index
  const xForIndex = (index, length) => {
    const spacing = spacingRef.current;
    const startX = -((length - 1) * spacing) / 2;
    return startX + index * spacing;
  };

  // Build merge steps — use stable ids so animations can track objects
  // Steps:
  //  - {type:'split', range:[l,r]}  // visual lift for range
  //  - {type:'compare', aId, bId}
  //  - {type:'take', id, toIndex}  // move chosen element to global merged position
  //  - {type:'merged', range:[l,r]} // drop merged segment and mark sorted
  function generateMergeSteps(arr) {
    // create array of objects with id
    let seq = [];
    const items = arr.map((v, i) => ({ id: `m${i}`, value: v }));

    const n = items.length;

    function rec(subArr, leftIndex) {
      const len = subArr.length;
      if (len <= 1) {
        return subArr.slice();
      }
      const mid = Math.floor(len / 2);
      const left = subArr.slice(0, mid);
      const right = subArr.slice(mid);

      const leftStart = leftIndex;
      const leftEnd = leftIndex + left.length - 1;
      const rightStart = leftIndex + left.length;
      const rightEnd = leftIndex + left.length + right.length - 1;

      // Visual split: lift left and right ranges
      seq.push({ type: "split", range: [leftStart, leftEnd] });
      seq.push({ type: "split", range: [rightStart, rightEnd] });

      const sortedLeft = rec(left, leftStart);
      const sortedRight = rec(right, rightStart);

      // Merge step: merge sortedLeft and sortedRight
      let i = 0,
        j = 0;
      const merged = [];
      let k = 0;
      while (i < sortedLeft.length && j < sortedRight.length) {
        // compare a and b by id
        seq.push({ type: "compare", aId: sortedLeft[i].id, bId: sortedRight[j].id });
        if (sortedLeft[i].value <= sortedRight[j].value) {
          seq.push({ type: "take", id: sortedLeft[i].id, toIndex: leftIndex + k });
          merged.push(sortedLeft[i]);
          i++;
        } else {
          seq.push({ type: "take", id: sortedRight[j].id, toIndex: leftIndex + k });
          merged.push(sortedRight[j]);
          j++;
        }
        k++;
      }
      while (i < sortedLeft.length) {
        seq.push({ type: "take", id: sortedLeft[i].id, toIndex: leftIndex + k });
        merged.push(sortedLeft[i]);
        i++;
        k++;
      }
      while (j < sortedRight.length) {
        seq.push({ type: "take", id: sortedRight[j].id, toIndex: leftIndex + k });
        merged.push(sortedRight[j]);
        j++;
        k++;
      }

      // after merge done, mark merged region (optional drop + mark sorted)
      seq.push({ type: "merged", range: [leftIndex, leftIndex + merged.length - 1] });

      return merged;
    }

    rec(items, 0);
    // once whole array merged, seq will have 'merged' for full range
    return seq;
  }

  // Reset color helper
  const resetColors = () => {
    cubesRef.current.forEach((c) => {
      c.material.color.setHex(c.userData.sorted ? COLOR_SORTED : COLOR_DEFAULT);
    });
  };

  // Animate a single step from stepsRef
  const animateStep = () => {
    const steps = stepsRef.current;
    const idx = currentStepRef.current;

    if (!steps || idx >= steps.length) {
      // done
      sortingRef.current = false;
      setIsSorting && setIsSorting(false);
      onSortStatusChange && onSortStatusChange("Completed");
      onActionChange && onActionChange("Merge Sort Completed!");
      // mark sorted
      cubesRef.current.forEach((c) => {
        c.userData.sorted = true;
        c.material.color.setHex(COLOR_SORTED);
      });
      return;
    }

    const step = steps[idx];
    resetColors();

    // convenience refs
    const cubes = cubesRef.current;
    const labels = labelsRef.current;
    const n = cubes.length;

    if (step.type === "split") {
      const [lo, hi] = step.range;
      onActionChange && onActionChange(`Splitting range [${lo}, ${hi}]`);
      // lift and move outward: left half left, right half right.
      // We'll detect whether this range is left or right by comparing center to array center
      const centerIndex = (lo + hi) / 2;
      const arrayCenter = (n - 1) / 2;
      const isLeft = centerIndex <= arrayCenter;

      const offsetX = (hi - lo + 1) * spacingRef.current * 0.6;
      const liftY = 2.3;
      const duration = 500;
      const start = performance.now();

      const anim = () => {
        const now = performance.now();
        let t = (now - start) / duration;
        if (t > 1) t = 1;
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        for (let i = lo; i <= hi; i++) {
          const id = idOrderRef.current[i];
          const idxCube = findIndexById(id);
          if (idxCube === -1) continue;
          const cube = cubes[idxCube];
          const lbl = labels[idxCube];
          // compute horizontal shift: left moves left, right moves right
          const dir = isLeft ? -1 : 1;
          const targetX = xForIndex(i, n) + dir * offsetX;
          const newX = cube.position.x + (targetX - cube.position.x) * ease;
          const newY = baseYRef.current + liftY * ease;
          cube.position.x = newX;
          cube.position.y = newY;
          if (lbl) {
            lbl.position.x = newX;
            lbl.position.y = newY + cube.userData.value + 1.4;
          }
          cube.material.color.setHex(COLOR_SPLIT);
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

    if (step.type === "compare") {
      const aId = step.aId;
      const bId = step.bId;
      const aIdx = findIndexById(aId);
      const bIdx = findIndexById(bId);
      const cubeA = cubes[aIdx];
      const cubeB = cubes[bIdx];
      const labelA = labels[aIdx];
      const labelB = labels[bIdx];

      onActionChange && onActionChange(`Comparing ${cubeA?.userData.value} and ${cubeB?.userData.value}`);

      const duration = 650;
      const start = performance.now();
      if (cubeA) cubeA.material.color.setHex(COLOR_COMPARE);
      if (cubeB) cubeB.material.color.setHex(COLOR_COMPARE);

      const anim = () => {
        const now = performance.now();
        let t = (now - start) / duration;
        if (t > 1) t = 1;
        const lift = Math.sin(t * Math.PI) * 0.9;
        if (cubeA) cubeA.position.y = baseYRef.current + lift;
        if (cubeB) cubeB.position.y = baseYRef.current + lift;
        if (labelA && cubeA) labelA.position.y = cubeA.position.y + cubeA.userData.value + 1.4;
        if (labelB && cubeB) labelB.position.y = cubeB.position.y + cubeB.userData.value + 1.4;

        if (t < 1) requestAnimationFrame(anim);
        else {
          if (cubeA) cubeA.position.y = baseYRef.current;
          if (cubeB) cubeB.position.y = baseYRef.current;
          if (labelA && cubeA) labelA.position.y = cubeA.position.y + cubeA.userData.value + 1.4;
          if (labelB && cubeB) labelB.position.y = cubeB.position.y + cubeB.userData.value + 1.4;
          currentStepRef.current++;
          animateStep();
        }
      };
      anim();
      return;
    }

    if (step.type === "take") {
      const id = step.id;
      const toIndex = step.toIndex;
      const idxCube = findIndexById(id);
      if (idxCube === -1) {
        currentStepRef.current++;
        setTimeout(animateStep, 20);
        return;
      }
      const cube = cubes[idxCube];
      const label = labels[idxCube];
      onActionChange && onActionChange(`Moving ${cube.userData.value} to merged position ${toIndex}`);

      // compute global final x
      const finalX = xForIndex(toIndex, n);
      // animate along an arc downward into merged area (merged area is baseY)
      const startX = cube.position.x;
      const startY = cube.position.y;
      const duration = 900;
      const start = performance.now();
      cube.material.color.setHex(COLOR_TAKE);

      const anim = () => {
        const now = performance.now();
        let t = (now - start) / duration;
        if (t > 1) t = 1;
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        // x interp
        const newX = startX + (finalX - startX) * ease;
        // arc: lift early then drop
        const arc = Math.sin(ease * Math.PI) * 2.6;
        const newY = baseYRef.current + (startY > baseYRef.current ? (startY - baseYRef.current) * (1 - ease) : 0) + arc * (1 - ease);
        cube.position.set(newX, newY, 0);
        if (label) label.position.set(newX, newY + cube.userData.value + 1.4, 0);

        if (t < 1) requestAnimationFrame(anim);
        else {
          // finalize: snap to finalX, baseY
          cube.position.set(finalX, baseYRef.current, 0);
          if (label) label.position.set(finalX, baseYRef.current + cube.userData.value + 1.4, 0);

          // reorder cubes/labels arrays: remove current position and insert at toIndex
          const oldIndex = findIndexById(id);
          if (oldIndex !== -1) {
            // adjust insertion index depending on oldIndex
            let insertAt = toIndex;
            if (oldIndex < insertAt) insertAt--; // removal shifts index left
            const movedCube = cubes.splice(oldIndex, 1)[0];
            const movedLabel = labels.splice(oldIndex, 1)[0];
            cubes.splice(insertAt, 0, movedCube);
            labels.splice(insertAt, 0, movedLabel);
            // update idOrderRef to match current order
            idOrderRef.current = cubes.map((c) => c.userData.id);
            // snap all cubes to corresponding x positions to avoid any drift
            cubes.forEach((c, i) => {
              const tx = xForIndex(i, n);
              c.position.x = tx;
              c.position.y = baseYRef.current;
              const lbl = labels[i];
              if (lbl) {
                lbl.position.x = tx;
                lbl.position.y = baseYRef.current + c.userData.value + 1.4;
              }
            });
          }

          currentStepRef.current++;
          // small delay to make merge readable
          setTimeout(animateStep, 80);
        }
      };
      anim();
      return;
    }

    if (step.type === "merged") {
      const [lo, hi] = step.range;
      onActionChange && onActionChange(`Merged range [${lo}, ${hi}]`);
      // briefly highlight merged region and mark as sorted (green)
      const duration = 500;
      const start = performance.now();
      // find ids for this range in current idOrderRef: they should be located at positions lo..hi now
      const anim = () => {
        const now = performance.now();
        let t = (now - start) / duration;
        if (t > 1) t = 1;
        const ease = t;
        for (let pos = lo; pos <= hi; pos++) {
          const id = idOrderRef.current[pos];
          const idxCube = findIndexById(id);
          if (idxCube === -1) continue;
          const cube = cubes[idxCube];
          const label = labels[idxCube];
          // color to sorted gradually — we will set color at the end to final to avoid color flicker
          cube.material.color.setHex(COLOR_SORTED);
          cube.userData.sorted = true;
          // ensure cubes are at baseY
          cube.position.y = baseYRef.current;
          if (label) label.position.y = cube.position.y + cube.userData.value + 1.4;
        }
        if (t < 1) requestAnimationFrame(anim);
        else {
          currentStepRef.current++;
          setTimeout(animateStep, 60);
        }
      };
      anim();
      return;
    }

    // fallback: continue
    currentStepRef.current++;
    setTimeout(animateStep, 30);
  };

  return <div ref={mountRef} className="w-full h-full" />;
});
