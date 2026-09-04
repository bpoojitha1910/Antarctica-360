import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react";

/* =========================================================
   BHARATI ANTARCTIC DIGITAL TWIN
   Realistic Low-Poly / Cinematic Version
========================================================= */

export default function BharatiDigitalTwin() {
  const controlsRef = useRef();

  const [viewMode, setViewMode] = useState("3D View");
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);

  const moveCamera = (mode) => {
    setViewMode(mode);

    if (!controlsRef.current) return;

    const camera = controlsRef.current.object;

    if (mode === "Top View") {
      camera.position.set(0, 48, 0.1);
      controlsRef.current.target.set(0, 0, 0);
    } else if (mode === "System View") {
      camera.position.set(26, 16, 20);
      controlsRef.current.target.set(0, 4, 0);
    } else {
      camera.position.set(30, 20, 32);
      controlsRef.current.target.set(0, 4, 0);
    }

    controlsRef.current.update();
  };

  const resetCamera = () => {
    setViewMode("3D View");

    if (!controlsRef.current) return;

    controlsRef.current.object.position.set(30, 20, 32);
    controlsRef.current.target.set(0, 4, 0);

    controlsRef.current.update();
  };

  const zoomIn = () => {
    if (!controlsRef.current) return;

    const camera = controlsRef.current.object;
    const target = controlsRef.current.target;

    camera.position.lerp(target, 0.15);

    controlsRef.current.update();
  };

  const zoomOut = () => {
    if (!controlsRef.current) return;

    const camera = controlsRef.current.object;
    const target = controlsRef.current.target;

    const direction = camera.position.clone().sub(target);

    camera.position.copy(
      target.clone().add(direction.multiplyScalar(1.18))
    );

    controlsRef.current.update();
  };

  return (
    <div
      className={`relative w-full overflow-hidden bg-[#061224] ${
        fullscreen
          ? "fixed inset-0 z-[9999] h-screen"
          : "h-[600px]"
      }`}
    >
      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-4 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <h2 className="text-sm font-semibold text-white">
            Bharati Station Digital Twin
          </h2>

          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-[#071326]/90 backdrop-blur-md border border-emerald-500/30 rounded-lg px-3 py-1.5 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

          <div className="flex flex-col">
            <span className="text-[9px] text-slate-500">
              Environment Status
            </span>

            <span className="text-[10px] font-semibold text-emerald-400">
              All Systems Normal
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================
          3D SCENE
      ===================================================== */}

      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{
          position: [30, 20, 32],
          fov: 45,
          near: 0.1,
          far: 200,
        }}
        className="absolute inset-0"
      >
        {/* ATMOSPHERE */}

        <color attach="background" args={["#06182d"]} />

        <fog attach="fog" args={["#07192c", 40, 115]} />

        {/* LIGHTING */}

        <ambientLight intensity={0.45} />

        <hemisphereLight
          color="#a9d6ff"
          groundColor="#07121d"
          intensity={1.1}
        />

        <directionalLight
          position={[25, 32, 18]}
          intensity={2.4}
          color="#b9dcff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-35}
          shadow-camera-right={35}
          shadow-camera-top={35}
          shadow-camera-bottom={-35}
        />

        <pointLight
          position={[0, 12, 4]}
          intensity={2.2}
          color="#4fc3ff"
          distance={42}
          decay={2}
        />

        <pointLight
          position={[-10, 5, 6]}
          intensity={1.4}
          color="#ffc45b"
          distance={15}
        />

        {/* SCENE */}

        <AntarcticTerrain />

        <IcePaths />

        <BackgroundMountains />

        <BharatiStation
          onSelect={() =>
            setSelectedSystem({
              name: "Bharati Research Station",
              status: "Normal",
              description:
                "Main research and operational facility. All primary station systems are connected and operational.",
            })
          }
        />

        <StationModules onSelect={setSelectedSystem} />

        <CommunicationSystem
          onSelect={() =>
            setSelectedSystem({
              name: "Communication System",
              status: "Normal",
              description:
                "Satellite communication, radar monitoring and external communication systems are operational.",
            })
          }
        />

        <SolarField
          onSelect={() =>
            setSelectedSystem({
              name: "Solar Power Array",
              status: "Normal",
              description:
                "Solar panels are contributing to the station power infrastructure.",
            })
          }
        />

        <FuelSystem
          onSelect={() =>
            setSelectedSystem({
              name: "Power System",
              status: "Watch",
              description:
                "Power generation and fuel infrastructure are operational but require continuous monitoring.",
            })
          }
        />

        <IndianFlag />

        <StationLights />

        <SnowParticles />

        <DigitalLabels onSelect={setSelectedSystem} />

        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.07}
          enableRotate
          enableZoom
          enablePan
          minDistance={13}
          maxDistance={70}
          minPolarAngle={0.12}
          maxPolarAngle={Math.PI / 2.02}
          target={[0, 4, 0]}
        />
      </Canvas>

      {/* =====================================================
          BOTTOM CONTROLS
      ===================================================== */}

      <div className="absolute bottom-4 left-4 right-4 z-30 flex items-end justify-between pointer-events-none">
        {/* VIEW MODES */}

        <div className="flex items-center gap-1 bg-[#071326]/95 backdrop-blur-md border border-slate-700 rounded-xl p-1 pointer-events-auto">
          {["3D View", "Top View", "System View"].map((mode) => (
            <button
              key={mode}
              onClick={() => moveCamera(mode)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-medium transition ${
                viewMode === mode
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* CAMERA CONTROLS */}

        <div className="flex items-center gap-1 bg-[#071326]/95 backdrop-blur-md border border-slate-700 rounded-xl p-1 pointer-events-auto">
          <button
            onClick={resetCamera}
            title="Reset View"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <RotateCcw size={15} />
          </button>

          <button
            onClick={zoomIn}
            title="Zoom In"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <ZoomIn size={15} />
          </button>

          <button
            onClick={zoomOut}
            title="Zoom Out"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <ZoomOut size={15} />
          </button>

          <button
            onClick={() => setFullscreen(!fullscreen)}
            title="Fullscreen"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <Maximize2 size={15} />
          </button>
        </div>
      </div>

      {/* =====================================================
          SELECTED SYSTEM PANEL
      ===================================================== */}

      {selectedSystem && (
        <div className="absolute top-16 right-4 z-40 w-[255px] bg-[#071326]/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-4 shadow-2xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-white">
                {selectedSystem.name}
              </h3>

              <div
                className={`text-xs mt-2 ${
                  selectedSystem.status === "Watch"
                    ? "text-amber-400"
                    : "text-emerald-400"
                }`}
              >
                ● {selectedSystem.status}
              </div>
            </div>

            <button
              onClick={() => setSelectedSystem(null)}
              className="text-slate-500 hover:text-white text-lg"
            >
              ×
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-3 leading-relaxed">
            {selectedSystem.description}
          </p>
        </div>
      )}

      {/* HELP */}

      <div className="absolute top-16 left-4 z-20 hidden md:block bg-[#071326]/70 backdrop-blur-md border border-slate-700/70 rounded-lg px-3 py-2 text-[10px] text-slate-400 pointer-events-none">
        Drag to rotate • Scroll to zoom • Right-click to pan
      </div>
    </div>
  );
}

/* =========================================================
   REALISTIC LOW-POLY ANTARCTIC TERRAIN
========================================================= */

function AntarcticTerrain() {
  const terrainGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(120, 120, 90, 90);

    const positions = geometry.attributes.position;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);

      const distance = Math.sqrt(x * x + y * y);

      let height =
        Math.sin(x * 0.12) * 0.5 +
        Math.cos(y * 0.16) * 0.45 +
        Math.sin((x + y) * 0.08) * 0.6;

      /* Keep station center relatively flat */

      if (distance < 25) {
        height *= 0.22;
      }

      /* Higher uneven terrain outside station */

      if (distance > 35) {
        height += (distance - 35) * 0.06;
      }

      positions.setZ(i, height);
    }

    geometry.computeVertexNormals();

    return geometry;
  }, []);

  const rocks = useMemo(() => {
    return Array.from({ length: 110 }, (_, index) => ({
      id: index,
      x: (Math.random() - 0.5) * 100,
      z: (Math.random() - 0.5) * 100,
      scale: 0.12 + Math.random() * 0.7,
      rotation: Math.random() * Math.PI,
    }));
  }, []);

  return (
    <group>
      {/* MAIN ICE TERRAIN */}

      <mesh
        geometry={terrainGeometry}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial
          color="#7f9bab"
          roughness={0.95}
          metalness={0.05}
          flatShading
        />
      </mesh>

      {/* CENTRAL SNOW PLATFORM */}

      <mesh
        position={[0, 0.18, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[29, 64]} />

        <meshStandardMaterial
          color="#d6e6ed"
          roughness={0.9}
        />
      </mesh>

      {/* ICE PATCHES */}

      {[
        [-22, 0.22, 10, 8],
        [20, 0.22, -15, 10],
        [5, 0.22, 24, 7],
        [-28, 0.22, -12, 9],
      ].map(([x, y, z, scale], index) => (
        <mesh
          key={index}
          position={[x, y, z]}
          rotation={[-Math.PI / 2, 0, index * 0.7]}
        >
          <circleGeometry args={[scale, 32]} />

          <meshStandardMaterial
            color="#9fc6d5"
            transparent
            opacity={0.55}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* ROCKS */}

      {rocks.map((rock) => (
        <mesh
          key={rock.id}
          position={[
            rock.x,
            rock.scale * 0.45,
            rock.z,
          ]}
          rotation={[
            rock.rotation,
            rock.rotation * 0.7,
            rock.rotation * 0.2,
          ]}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry
            args={[rock.scale, 0]}
          />

          <meshStandardMaterial
            color="#354a57"
            roughness={1}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}

/* =========================================================
   GLOWING DIGITAL PATHWAYS
========================================================= */

function IcePaths() {
  return (
    <group>
      {/* Main pathway */}

      <mesh
        position={[0, 0.32, 7]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[3.5, 28]} />

        <meshBasicMaterial
          color="#1c9ed4"
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Horizontal paths */}

      <mesh
        position={[0, 0.33, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[45, 1.2]} />

        <meshBasicMaterial
          color="#2bb6ed"
          transparent
          opacity={0.08}
        />
      </mesh>

      <mesh
        position={[0, 0.34, -8]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[36, 0.8]} />

        <meshBasicMaterial
          color="#2bb6ed"
          transparent
          opacity={0.08}
        />
      </mesh>
    </group>
  );
}

/* =========================================================
   BACKGROUND MOUNTAINS
========================================================= */

function BackgroundMountains() {
  const mountains = useMemo(() => {
    return Array.from({ length: 24 }, (_, index) => ({
      id: index,
      x: -70 + index * 6,
      z: -42 - Math.random() * 10,
      radius: 4 + Math.random() * 5,
      height: 8 + Math.random() * 16,
      rotation: Math.random() * Math.PI,
    }));
  }, []);

  return (
    <group>
      {mountains.map((mountain) => (
        <group
          key={mountain.id}
          position={[
            mountain.x,
            mountain.height / 2,
            mountain.z,
          ]}
          rotation={[0, mountain.rotation, 0]}
        >
          {/* ROCK MOUNTAIN */}

          <mesh>
            <coneGeometry
              args={[
                mountain.radius,
                mountain.height,
                6,
              ]}
            />

            <meshStandardMaterial
              color="#344b5c"
              roughness={1}
              flatShading
            />
          </mesh>

          {/* SNOW CAP */}

          <mesh
            position={[0, mountain.height * 0.28, 0]}
          >
            <coneGeometry
              args={[
                mountain.radius * 0.62,
                mountain.height * 0.44,
                6,
              ]}
            />

            <meshStandardMaterial
              color="#b7ceda"
              roughness={1}
              flatShading
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* =========================================================
   MAIN BHARATI RESEARCH STATION
========================================================= */

function BharatiStation({ onSelect }) {
  const windows = Array.from(
    { length: 11 },
    (_, index) => -7.3 + index * 1.46
  );

  return (
    <group
      position={[0, 5.6, 0]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
    >
      {/* STEEL SUPPORT STRUCTURE */}

      {[
        [-7.5, -3.8],
        [-7.5, 3.8],
        [-3.7, -3.8],
        [-3.7, 3.8],
        [0, -3.8],
        [0, 3.8],
        [3.7, -3.8],
        [3.7, 3.8],
        [7.5, -3.8],
        [7.5, 3.8],
      ].map(([x, z], index) => (
        <mesh
          key={index}
          position={[x, -3.4, z]}
          castShadow
        >
          <boxGeometry args={[0.28, 6.2, 0.28]} />

          <meshStandardMaterial
            color="#2d3c48"
            metalness={0.9}
            roughness={0.35}
          />
        </mesh>
      ))}

      {/* MAIN BUILDING */}

      <mesh castShadow receiveShadow>
        <boxGeometry args={[18, 5.2, 9.5]} />

        <meshStandardMaterial
          color="#8fa1a9"
          metalness={0.7}
          roughness={0.48}
        />
      </mesh>

      {/* DARK LOWER FOUNDATION */}

      <mesh
        position={[0, -2.45, 0]}
        castShadow
      >
        <boxGeometry args={[18.3, 0.45, 9.8]} />

        <meshStandardMaterial
          color="#243640"
          metalness={0.8}
          roughness={0.4}
        />
      </mesh>

      {/* ROOF */}

      <mesh
        position={[0, 2.8, 0]}
        castShadow
      >
        <boxGeometry args={[18.6, 0.45, 10.2]} />

        <meshStandardMaterial
          color="#3f5665"
          metalness={0.8}
          roughness={0.38}
        />
      </mesh>

      {/* SNOW ON ROOF */}

      <mesh
        position={[0, 3.05, 0]}
      >
        <boxGeometry args={[18.1, 0.12, 9.7]} />

        <meshStandardMaterial
          color="#c8d9df"
          roughness={1}
        />
      </mesh>

      {/* ROOF EQUIPMENT */}

      {[-5.5, -1.8, 2.2, 5.8].map((x, index) => (
        <group
          key={index}
          position={[x, 3.6, -1]}
        >
          <mesh castShadow>
            <boxGeometry args={[2, 0.8, 1.2]} />

            <meshStandardMaterial
              color="#536773"
              metalness={0.7}
              roughness={0.45}
            />
          </mesh>

          <mesh
            position={[0, 0.5, 0]}
          >
            <boxGeometry args={[1.7, 0.08, 0.9]} />

            <meshStandardMaterial
              color="#b8d3dc"
              roughness={0.9}
            />
          </mesh>
        </group>
      ))}

      {/* FRONT WINDOWS */}

      {windows.map((x, index) => (
        <group key={index}>
          <mesh
            position={[x, 0.15, 4.78]}
          >
            <boxGeometry
              args={[1.05, 1.9, 0.08]}
            />

            <meshStandardMaterial
              color="#e3a54a"
              emissive="#d87924"
              emissiveIntensity={1.5}
              roughness={0.25}
            />
          </mesh>

          {/* WINDOW FRAME */}

          <mesh
            position={[x, 0.15, 4.84]}
          >
            <boxGeometry
              args={[1.18, 2.08, 0.04]}
            />

            <meshBasicMaterial
              color="#1d2d37"
              transparent
              opacity={0.55}
            />
          </mesh>
        </group>
      ))}

      {/* SIDE WINDOWS */}

      {[-2, 0, 2].map((y) => (
        <mesh
          key={y}
          position={[9.05, y * 0.5, 0]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <boxGeometry args={[2, 1.4, 0.08]} />

          <meshStandardMaterial
            color="#d8953f"
            emissive="#c96a20"
            emissiveIntensity={1}
          />
        </mesh>
      ))}

      {/* MAIN ENTRANCE */}

      <group position={[0, -0.4, 4.95]}>
        <mesh>
          <boxGeometry args={[2.6, 3.2, 0.25]} />

          <meshStandardMaterial
            color="#263946"
            metalness={0.7}
          />
        </mesh>

        <mesh
          position={[0, 0.4, 0.15]}
        >
          <boxGeometry args={[1.8, 1.8, 0.05]} />

          <meshStandardMaterial
            color="#24556a"
            emissive="#0e3444"
            emissiveIntensity={0.7}
          />
        </mesh>
      </group>

      {/* ENTRANCE PLATFORM */}

      <mesh
        position={[0, -2.75, 6.7]}
        castShadow
      >
        <boxGeometry args={[6.2, 0.3, 3.8]} />

        <meshStandardMaterial
          color="#354651"
          metalness={0.85}
          roughness={0.4}
        />
      </mesh>

      <Stairs position={[0, -2.9, 8.3]} />
    </group>
  );
}

/* =========================================================
   STAIRS
========================================================= */

function Stairs({ position }) {
  return (
    <group position={position}>
      {Array.from({ length: 5 }, (_, index) => (
        <mesh
          key={index}
          position={[
            0,
            -index * 0.38,
            index * 0.6,
          ]}
          castShadow
        >
          <boxGeometry args={[3.4, 0.35, 0.8]} />

          <meshStandardMaterial
            color="#465762"
            metalness={0.8}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

/* =========================================================
   SECONDARY STATION MODULES
========================================================= */

function StationModules({ onSelect }) {
  const modules = [
    {
      position: [-13, 2, 5],
      size: [5.8, 3.4, 3],
      name: "Living Quarters",
      status: "Normal",
      color: "#536c79",
      description:
        "Personnel accommodation and life-support systems are operating normally.",
    },
    {
      position: [-13, 1.8, -1],
      size: [5.2, 3, 2.8],
      name: "Storage",
      status: "Normal",
      color: "#405865",
      description:
        "Station supplies and equipment storage systems are operational.",
    },
    {
      position: [13, 1.8, 4],
      size: [5.4, 3, 2.8],
      name: "Research Support",
      status: "Normal",
      color: "#48616e",
      description:
        "Research support and equipment systems are connected.",
    },
    {
      position: [10, 1.7, -5],
      size: [5, 2.8, 3],
      name: "Emergency Module",
      status: "Normal",
      color: "#455a65",
      description:
        "Emergency response infrastructure is ready for deployment.",
    },
  ];

  return (
    <group>
      {modules.map((module, index) => (
        <StationModule
          key={index}
          {...module}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}

function StationModule({
  position,
  size,
  name,
  status,
  color,
  description,
  onSelect,
}) {
  const windowCount = 4;

  return (
    <group
      position={position}
      onClick={(event) => {
        event.stopPropagation();

        onSelect({
          name,
          status,
          description,
        });
      }}
    >
      {/* BUILDING */}

      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />

        <meshStandardMaterial
          color={color}
          metalness={0.65}
          roughness={0.5}
        />
      </mesh>

      {/* ROOF */}

      <mesh
        position={[0, size[1] / 2 + 0.15, 0]}
      >
        <boxGeometry
          args={[
            size[0] + 0.3,
            0.25,
            size[2] + 0.3,
          ]}
        />

        <meshStandardMaterial
          color="#2d414d"
          metalness={0.8}
          roughness={0.4}
        />
      </mesh>

      {/* WINDOWS */}

      {Array.from(
        { length: windowCount },
        (_, index) => {
          const x =
            -size[0] / 2 +
            0.8 +
            index *
              ((size[0] - 1.6) /
                (windowCount - 1));

          return (
            <mesh
              key={index}
              position={[
                x,
                0,
                size[2] / 2 + 0.03,
              ]}
            >
              <boxGeometry
                args={[0.55, 0.75, 0.05]}
              />

              <meshStandardMaterial
                color="#d79a43"
                emissive="#d27623"
                emissiveIntensity={1.25}
              />
            </mesh>
          );
        }
      )}

      {/* EXTERNAL RIBS */}

      {[-2, -1, 0, 1, 2].map((x, index) => (
        <mesh
          key={index}
          position={[
            x,
            0,
            size[2] / 2 + 0.05,
          ]}
        >
          <boxGeometry
            args={[0.06, size[1] * 0.9, 0.08]}
          />

          <meshStandardMaterial
            color="#24343d"
          />
        </mesh>
      ))}
    </group>
  );
}

/* =========================================================
   COMMUNICATION SYSTEM + GEODESIC RADOME
========================================================= */

function CommunicationSystem({ onSelect }) {
  const radarRef = useRef();

  useFrame((state) => {
    if (radarRef.current) {
      radarRef.current.rotation.y =
        state.clock.elapsedTime * 0.18;
    }
  });

  return (
    <group
      position={[15, 0, -10]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
    >
      {/* SUPPORT BASE */}

      <mesh
        position={[0, 1.2, 0]}
        castShadow
      >
        <cylinderGeometry args={[2.3, 2.8, 2.4, 8]} />

        <meshStandardMaterial
          color="#314650"
          metalness={0.75}
          roughness={0.4}
        />
      </mesh>

      {/* TOWER */}

      <mesh
        position={[0, 4, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.65, 1.1, 5, 12]} />

        <meshStandardMaterial
          color="#4e6570"
          metalness={0.85}
          roughness={0.35}
        />
      </mesh>

      {/* GEODESIC RADOME */}

      <mesh
        position={[0, 7.4, 0]}
        castShadow
      >
        <icosahedronGeometry args={[2.65, 2]} />

        <meshStandardMaterial
          color="#d4e1e5"
          roughness={0.5}
          flatShading
        />
      </mesh>

      {/* DARK BASE RING */}

      <mesh
        position={[0, 5.65, 0]}
      >
        <cylinderGeometry args={[2.3, 2.3, 0.35, 24]} />

        <meshStandardMaterial
          color="#263945"
          metalness={0.8}
        />
      </mesh>

      {/* ROTATING RADAR SIGNAL */}

      <group
        ref={radarRef}
        position={[0, 7.5, 0]}
      >
        <mesh>
          <boxGeometry args={[7, 0.05, 0.1]} />

          <meshBasicMaterial
            color="#2ee8c7"
            transparent
            opacity={0.55}
          />
        </mesh>
      </group>
    </group>
  );
}

/* =========================================================
   SOLAR PANEL FIELD
========================================================= */

function SolarField({ onSelect }) {
  const panels = [
    [-3, 0, 0],
    [0, 0, 0],
    [3, 0, 0],
    [-1.5, 0, 2.5],
    [1.5, 0, 2.5],
  ];

  return (
    <group
      position={[17, 0.5, 10]}
      rotation={[0, -0.45, 0]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
    >
      {panels.map(([x, y, z], index) => (
        <group
          key={index}
          position={[x, y, z]}
        >
          {/* PANEL SUPPORT */}

          <mesh
            position={[0, 0.8, 0]}
          >
            <boxGeometry args={[0.15, 1.6, 0.15]} />

            <meshStandardMaterial
              color="#33434d"
              metalness={0.9}
            />
          </mesh>

          {/* SOLAR PANEL */}

          <mesh
            position={[0, 1.7, 0]}
            rotation={[-0.42, 0, 0]}
            castShadow
          >
            <boxGeometry args={[2.4, 0.08, 1.5]} />

            <meshStandardMaterial
              color="#102b46"
              metalness={0.7}
              roughness={0.25}
              emissive="#061727"
              emissiveIntensity={0.4}
            />
          </mesh>

          {/* PANEL GRID */}

          {[-0.6, 0, 0.6].map((line) => (
            <mesh
              key={line}
              position={[line, 1.73, 0]}
              rotation={[-0.42, 0, 0]}
            >
              <boxGeometry
                args={[0.025, 0.03, 1.45]}
              />

              <meshBasicMaterial
                color="#2d7da8"
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/* =========================================================
   POWER / FUEL SYSTEM
========================================================= */

function FuelSystem({ onSelect }) {
  return (
    <group
      position={[-15, 0, -9]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
    >
      {[0, 2.6, 5.2].map((x, index) => (
        <group
          key={index}
          position={[x, 1.4, 0]}
        >
          <mesh
            rotation={[0, 0, Math.PI / 2]}
            castShadow
          >
            <cylinderGeometry
              args={[1, 1, 2.8, 20]}
            />

            <meshStandardMaterial
              color="#5a6871"
              metalness={0.8}
              roughness={0.4}
            />
          </mesh>

          {/* WARNING BAND */}

          <mesh
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry
              args={[1.02, 1.02, 0.28, 20]}
            />

            <meshStandardMaterial
              color="#b36a24"
              emissive="#7c3f12"
              emissiveIntensity={0.3}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* =========================================================
   INDIAN FLAG
========================================================= */

function IndianFlag() {
  const flagRef = useRef();

  useFrame((state) => {
    if (flagRef.current) {
      flagRef.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 2) * 0.025;

      flagRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 1.4) * 0.08;
    }
  });

  return (
    <group position={[-5, 0, 9]}>
      {/* FLAG POLE */}

      <mesh
        position={[0, 5, 0]}
      >
        <cylinderGeometry args={[0.06, 0.08, 10, 10]} />

        <meshStandardMaterial
          color="#aebcc5"
          metalness={0.95}
          roughness={0.25}
        />
      </mesh>

      {/* FLAG */}

      <group
        ref={flagRef}
        position={[1.2, 8, 0]}
      >
        {/* SAFFRON */}

        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[2.4, 0.55, 0.04]} />

          <meshStandardMaterial color="#ff9933" />
        </mesh>

        {/* WHITE */}

        <mesh>
          <boxGeometry args={[2.4, 0.55, 0.04]} />

          <meshStandardMaterial color="#f7f7f7" />
        </mesh>

        {/* GREEN */}

        <mesh position={[0, -0.55, 0]}>
          <boxGeometry args={[2.4, 0.55, 0.04]} />

          <meshStandardMaterial color="#138808" />
        </mesh>

        {/* ASHOKA CHAKRA */}

        <mesh
          position={[0, 0, 0.035]}
        >
          <circleGeometry args={[0.2, 24]} />

          <meshBasicMaterial color="#1f4b99" />
        </mesh>
      </group>
    </group>
  );
}

/* =========================================================
   WARM STATION LIGHTS
========================================================= */

function StationLights() {
  const lights = [
    [-9, 3, 7],
    [-5, 3, 7],
    [-1, 3, 7],
    [3, 3, 7],
    [7, 3, 7],
    [-13, 3, 4],
    [13, 3, 4],
    [15, 4, -8],
  ];

  return (
    <group>
      {lights.map((position, index) => (
        <pointLight
          key={index}
          position={position}
          intensity={1.3}
          color="#ffc35a"
          distance={7}
          decay={2}
        />
      ))}
    </group>
  );
}

/* =========================================================
   SNOW PARTICLES
========================================================= */

function SnowParticles() {
  const pointsRef = useRef();

  const positions = useMemo(() => {
    const array = new Float32Array(2200 * 3);

    for (let i = 0; i < 2200; i++) {
      array[i * 3] =
        (Math.random() - 0.5) * 100;

      array[i * 3 + 1] =
        Math.random() * 35;

      array[i * 3 + 2] =
        (Math.random() - 0.5) * 100;
    }

    return array;
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    pointsRef.current.rotation.y += delta * 0.008;

    pointsRef.current.position.x =
      Math.sin(state.clock.elapsedTime * 0.15) * 0.8;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={2200}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        color="#ffffff"
        size={0.065}
        transparent
        opacity={0.72}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* =========================================================
   DIGITAL LABELS
========================================================= */

function DigitalLabels({ onSelect }) {
  return (
    <>
      <TwinLabel
        position={[-15, 8, 5]}
        title="Living Quarters"
        status="Normal"
        onClick={() =>
          onSelect({
            name: "Living Quarters",
            status: "Normal",
            description:
              "Personnel accommodation and support systems are functioning normally.",
          })
        }
      />

      <TwinLabel
        position={[0, 12, 1]}
        title="Research Labs"
        status="Normal"
        onClick={() =>
          onSelect({
            name: "Research Labs",
            status: "Normal",
            description:
              "Scientific research and laboratory infrastructure is operational.",
          })
        }
      />

      <TwinLabel
        position={[-16, 5, -9]}
        title="Power System"
        status="Watch"
        watch
        onClick={() =>
          onSelect({
            name: "Power System",
            status: "Watch",
            description:
              "Power and fuel infrastructure is being actively monitored.",
          })
        }
      />

      <TwinLabel
        position={[16, 12, -10]}
        title="Communication"
        status="Normal"
        onClick={() =>
          onSelect({
            name: "Communication System",
            status: "Normal",
            description:
              "Radar and communication systems are operational.",
          })
        }
      />

      <TwinLabel
        position={[18, 6, 10]}
        title="Solar Array"
        status="Normal"
        onClick={() =>
          onSelect({
            name: "Solar Power Array",
            status: "Normal",
            description:
              "Solar energy infrastructure is operating normally.",
          })
        }
      />
    </>
  );
}

/* =========================================================
   INDIVIDUAL LABEL
========================================================= */

function TwinLabel({
  position,
  title,
  status,
  watch = false,
  onClick,
}) {
  return (
    <Html
      position={position}
      distanceFactor={18}
      center
      style={{
        pointerEvents: "none",
      }}
    >
      <div
        onClick={onClick}
        style={{
          pointerEvents: "auto",
          minWidth: "130px",
          padding: "9px 12px",
          borderRadius: "10px",
          background: "rgba(5, 20, 40, 0.92)",
          border: watch
            ? "1px solid rgba(245,158,11,0.55)"
            : "1px solid rgba(34,211,238,0.35)",
          boxShadow: watch
            ? "0 0 20px rgba(245,158,11,0.12)"
            : "0 0 20px rgba(34,211,238,0.1)",
          cursor: "pointer",
          fontFamily: "Arial, sans-serif",
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          style={{
            color: "#f1f5f9",
            fontSize: "12px",
            fontWeight: 600,
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop: "5px",
            color: watch
              ? "#fbbf24"
              : "#34d399",
            fontSize: "10px",
          }}
        >
          ● {status}
        </div>
      </div>
    </Html>
  );
}