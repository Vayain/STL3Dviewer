import { useRef, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Center, Environment, Grid } from "@react-three/drei";
import * as THREE from "three";
import { PerspectiveCamera as ThreePerspectiveCamera } from "three";
import { useSTLStore } from "../lib/stores/useSTLStore";
import CameraControls from "./CameraControls";
import CameraGizmo from "./CameraGizmo";
import ModelRotator from "./ModelRotator";

// Erweitern der Window-Schnittstelle um resetCameraView und setCameraAngle
declare global {
  interface Window {
    resetCameraView?: () => void;
    setCameraAngle?: (position: number[]) => void;
  }
}

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
    modelSmoothness,
    modelPosition,
    showShadow
  } = useSTLStore();
  
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // Set up model rotation listeners for X, Y, Z axis rotation
  useEffect(() => {
    const handleRotation = (event: CustomEvent) => {
      if (meshRef.current) {
        const { axis, amount } = event.detail;
        
        // Create rotation matrix for more precise control
        const rotationMatrix = new THREE.Matrix4();
        
        // Apply rotation based on the axis
        if (axis === 0) {
          meshRef.current.rotation.x += amount;
          rotationMatrix.makeRotationX(amount);
        } else if (axis === 1) {
          meshRef.current.rotation.y += amount;
          rotationMatrix.makeRotationY(amount);
        } else if (axis === 2) {
          meshRef.current.rotation.z += amount;
          rotationMatrix.makeRotationZ(amount);
        }
        
        // Apply the rotation matrix
        meshRef.current.updateMatrix();
        
        // Log the rotation for debugging
        console.log(`Rotated ${axis} axis by ${amount} radians`);
      }
    };
    
    // Add event listener
    window.addEventListener('rotate-model', handleRotation as EventListener);
    
    // Clean up
    return () => {
      window.removeEventListener('rotate-model', handleRotation as EventListener);
    };
  }, []);
  
  // Model animation and auto-rotation
  useFrame(() => {
    if (meshRef.current) {
      // Auto-rotate when enabled (only Y-axis)
      if (autoRotate || isRecording) {
        meshRef.current.rotation.y += rotationSpeed * 0.01;
      }
      
      // Apply any damping or animation effects here if needed
      meshRef.current.updateMatrix();
    }
  });
  
  // Handle smoothness changes
  useEffect(() => {
    if (meshRef.current && meshRef.current.material) {
      // Log the change for debugging
      console.log(`Applied smoothness: ${modelSmoothness}, flatShading: ${modelSmoothness < 0.5}`);
      
      // Force material update
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.flatShading = modelSmoothness < 0.5;
      material.needsUpdate = true;
      
      // For very smooth models, we can recompute normals
      if (geometry && modelSmoothness > 0.8) {
        const geom = meshRef.current.geometry.clone();
        geom.computeVertexNormals();
        meshRef.current.geometry = geom;
      }
    }
  }, [geometry, modelSmoothness]);

  // Initialize camera position and fit model to view
  const { camera, scene } = useThree();
  const initialCameraPosition = useRef<{ position: THREE.Vector3, target: THREE.Vector3 } | null>(null);
  
  // Store the reset view function in a ref that we can call from outside
  const resetCameraRef = useRef((resetTarget = true) => {
    if (!initialCameraPosition.current) return;
    
    const { position, target } = initialCameraPosition.current;
    camera.position.copy(position);
    
    if (resetTarget && camera instanceof THREE.PerspectiveCamera) {
      camera.lookAt(target);
    }
  });
  
  // Make the reset and setCameraAngle functions available globally
  useEffect(() => {
    // Register the reset view function
    const resetView = () => {
      resetCameraRef.current();
    };
    
    // Function to set camera to a specific angle
    const setCameraAngle = (position: number[]) => {
      if (!initialCameraPosition.current) return;
      
      const [x, y, z] = position;
      const { target } = initialCameraPosition.current;
      
      // Normalize input position vector if not already normalized
      const length = Math.sqrt(x*x + y*y + z*z);
      const normalizedDirection = new THREE.Vector3(
        length !== 0 ? x / length : 0,
        length !== 0 ? y / length : 0,
        length !== 0 ? z / length : 0
      );
      
      // Calculate distance based on initial camera position
      const distance = initialCameraPosition.current.position.distanceTo(target);
      
      // Set new camera position based on the normalized direction and the original distance
      const newPosition = normalizedDirection.clone().multiplyScalar(distance);
      camera.position.copy(newPosition);
      camera.lookAt(target);
      
      console.log("Camera angle set to:", normalizedDirection.toArray(), "at distance:", distance);
    };
    
    // Add to the global window object so we can call from UI
    window.resetCameraView = resetView;
    window.setCameraAngle = setCameraAngle;
    
    return () => {
      delete window.resetCameraView;
      delete window.setCameraAngle;
    };
  }, [camera]);
  
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
      
      // Target the center of the model
      const center = new THREE.Vector3();
      box.getCenter(center);
      camera.lookAt(center);
      
      // Store initial camera state for reset
      initialCameraPosition.current = {
        position: camera.position.clone(),
        target: center.clone()
      };
      
      console.log("Initial camera position set:", camera.position.toArray());
    }
  }, [geometry, camera, scene]);

  if (!geometry) return null;

  return (
    <group ref={groupRef} scale={[modelScale, modelScale, modelScale]}>
      <mesh 
        ref={meshRef} 
        // We can't use className in mesh, but we'll identify it through the ref
        castShadow={showShadow} 
        receiveShadow={showShadow}
      >
        <primitive object={geometry} attach="geometry" />
        <meshStandardMaterial 
          color={modelColor} 
          roughness={modelRoughness} 
          metalness={modelMetalness}
          flatShading={modelSmoothness < 0.5}
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
    
  // Get watermark properties from store
  const { 
    showWatermark, 
    watermarkOpacity, 
    watermarkPosition, 
    watermarkSize 
  } = useSTLStore();
  
  // Calculate watermark position based on setting
  const getWatermarkPosition = () => {
    const positions: Record<string, [number, number, number]> = {
      topleft: [-5, 5, -5],
      topcenter: [0, 5, -5],
      topright: [5, 5, -5],
      middleleft: [-5, 0, -5],
      middlecenter: [0, 0, -5],
      middleright: [5, 0, -5],
      bottomleft: [-5, -5, -5],
      bottomcenter: [0, -5, -5],
      bottomright: [5, -5, -5]
    };
    
    return positions[watermarkPosition] || [5, -5, -5]; // Default to bottom right
  };

  return (
    <div className="relative w-full h-full">
      <CameraControls />
      <Canvas 
        ref={canvasRef} 
        shadows={showShadow}
        gl={{ preserveDrawingBuffer: true }}
      >
        {/* Background color */}
        <color attach="background" args={["#f8f9fa"]} />
        
        {/* Watermark */}
        {backgroundImage && showWatermark && (
          <mesh position={getWatermarkPosition()} scale={[watermarkSize * 5, watermarkSize * 5, 1]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial map={backgroundTexture} transparent opacity={watermarkOpacity} depthTest={false} />
          </mesh>
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
          rotateSpeed={1.0}
          minDistance={0.5}
          maxDistance={100}
          zoomSpeed={1.5}
          enableRotate={true}
          enablePan={true}
          panSpeed={1.2}
          maxPolarAngle={Math.PI} // Allow full rotation
          screenSpacePanning={true} // Improves panning experience
        />
        
        {/* Add Blender-like camera controls */}
        <CameraGizmo />
      </Canvas>
    </div>
  );
}
