import { useRef, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Center, Environment, Grid } from "@react-three/drei";
import * as THREE from "three";
import { PerspectiveCamera as ThreePerspectiveCamera } from "three";
import { useSTLStore } from "../lib/stores/useSTLStore";

// Component for the 3D model from STL
function Model() {
  const { 
    geometry, 
    autoRotate, 
    rotationSpeed, 
    isRecording, 
    modelScale,
    modelColor,
    modelMetalness,
    modelRoughness,
    showShadow
  } = useSTLStore();
  
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
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
      
      // Check if camera is perspective (has fov property)
      if (camera instanceof THREE.PerspectiveCamera) {
        const fov = camera.fov * (Math.PI / 180);
        const distance = (maxDim / 2) / Math.tan(fov / 2) * 3; // Increased margin factor to 3 for initial zoom out
        camera.position.set(0, 0, distance);
      } else {
        // For orthographic cameras
        camera.position.set(0, 0, maxDim * 3);
      }
      
      camera.lookAt(0, 0, 0);
    }
  }, [geometry, camera]);

  if (!geometry) return null;

  return (
    <group ref={groupRef} scale={[modelScale, modelScale, modelScale]}>
      <mesh 
        ref={meshRef} 
        castShadow={showShadow} 
        receiveShadow={showShadow}
      >
        <primitive object={geometry} attach="geometry" />
        <meshStandardMaterial 
          color={modelColor} 
          roughness={modelRoughness} 
          metalness={modelMetalness} 
        />
      </mesh>
    </group>
  );
}



export default function STLViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { 
    setCanvasRef, 
    showGrid, 
    showShadow, 
    backgroundImage
  } = useSTLStore();
  
  // Pass canvas to store for video recording
  useEffect(() => {
    if (canvasRef.current) {
      setCanvasRef(canvasRef.current);
    }
  }, [canvasRef, setCanvasRef]);

  // Create background texture if there is a background image
  const backgroundTexture = backgroundImage ? 
    new THREE.TextureLoader().load(backgroundImage) : null;

  return (
    <Canvas ref={canvasRef} shadows={showShadow}>
      {backgroundImage ? (
        <mesh position={[0, 0, -10]}>
          <planeGeometry args={[50, 50]} />
          <meshBasicMaterial map={backgroundTexture} transparent opacity={0.2} />
        </mesh>
      ) : (
        <color attach="background" args={["#f8f9fa"]} />
      )}
      
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={40} />
      
      <ambientLight intensity={0.5} />
      <spotLight 
        position={[10, 10, 10]} 
        angle={0.3} 
        penumbra={1} 
        intensity={1} 
        castShadow={showShadow}
      />
      <spotLight 
        position={[-10, 10, -10]} 
        angle={0.3} 
        penumbra={1} 
        intensity={0.5} 
        castShadow={showShadow}
      />
      
      <Center>
        <Model />
      </Center>
      
      {showGrid && (
        <Grid
          args={[10, 10]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#a0a0a0"
          position={[0, -1.5, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow={showShadow}
        />
      )}
      
      {/* Add a shadow-receiving plane when grid is off but shadows are on */}
      {!showGrid && showShadow && (
        <mesh 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, -1.5, 0]} 
          receiveShadow
        >
          <planeGeometry args={[30, 30]} />
          <shadowMaterial transparent opacity={0.2} />
        </mesh>
      )}
      
      <Environment preset="studio" />
      
      <OrbitControls 
        enableDamping 
        dampingFactor={0.1} 
        rotateSpeed={0.5}
        minDistance={0.5}
        maxDistance={100}
        zoomSpeed={1.5}
      />
    </Canvas>
  );
}
