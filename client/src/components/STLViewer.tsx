import { useRef, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Center, Environment, Grid } from "@react-three/drei";
import * as THREE from "three";
import { useSTLStore } from "../lib/stores/useSTLStore";

// Component for the 3D model from STL
function Model() {
  const { geometry, autoRotate, rotationSpeed, isRecording } = useSTLStore();
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Auto-rotate the model when enabled
  useFrame(() => {
    if (meshRef.current && (autoRotate || isRecording)) {
      meshRef.current.rotation.y += rotationSpeed * 0.01;
    }
  });

  // Initialize camera position and fit model to view
  const { camera } = useThree();
  
  useEffect(() => {
    if (geometry && meshRef.current) {
      // Calculate bounding box to center and fit model
      const box = new THREE.Box3().setFromObject(meshRef.current);
      const size = new THREE.Vector3();
      box.getSize(size);
      
      // Position camera to see the entire model
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      const distance = (maxDim / 2) / Math.tan(fov / 2) * 1.5; // 1.5 is a margin factor
      
      camera.position.set(0, 0, distance);
      camera.lookAt(0, 0, 0);
    }
  }, [geometry, camera]);

  if (!geometry) return null;

  return (
    <mesh ref={meshRef}>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial color="#8294c4" roughness={0.5} metalness={0.5} />
    </mesh>
  );
}

export default function STLViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setCanvasRef } = useSTLStore();
  
  // Pass canvas to store for video recording
  useEffect(() => {
    if (canvasRef.current) {
      setCanvasRef(canvasRef.current);
    }
  }, [canvasRef, setCanvasRef]);

  return (
    <Canvas ref={canvasRef}>
      <color attach="background" args={["#f8f9fa"]} />
      
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
      
      <ambientLight intensity={0.5} />
      <spotLight 
        position={[10, 10, 10]} 
        angle={0.3} 
        penumbra={1} 
        intensity={1} 
        castShadow 
      />
      <spotLight 
        position={[-10, 10, -10]} 
        angle={0.3} 
        penumbra={1} 
        intensity={0.5} 
        castShadow 
      />
      
      <Center>
        <Model />
      </Center>
      
      <Grid
        args={[10, 10]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#a0a0a0"
        position={[0, -1.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      
      <Environment preset="studio" />
      
      <OrbitControls 
        enableDamping 
        dampingFactor={0.1} 
        rotateSpeed={0.5}
        minDistance={1}
        maxDistance={20}
      />
    </Canvas>
  );
}
