import React, { useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

// Colors for the different axes
const X_COLOR = "#ff3352";
const Y_COLOR = "#4dff33";
const Z_COLOR = "#334dff";

interface ViewButtonProps {
  position: [number, number];
  onClick: () => void;
  label: string;
  color: string;
}

// Create HTML buttons for axis navigation
function ViewButton({ position, onClick, label, color }: ViewButtonProps) {
  return (
    <Html position={[position[0], position[1], 0]} transform sprite>
      <button
        onClick={onClick}
        style={{
          backgroundColor: color,
          color: "#ffffff",
          border: "none",
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          fontWeight: "bold",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          padding: 0,
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
        }}
      >
        {label}
      </button>
    </Html>
  );
}

export default function CameraGizmo() {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  
  // Camera view presets
  const viewDirections = {
    // Main axes
    right: [1, 0, 0],
    left: [-1, 0, 0],
    top: [0, 1, 0],
    bottom: [0, -1, 0],
    front: [0, 0, 1],
    back: [0, 0, -1],
    
    // Isometric views
    frontTopRight: [0.577, 0.577, 0.577],
    frontTopLeft: [-0.577, 0.577, 0.577],
    frontBottomRight: [0.577, -0.577, 0.577],
    frontBottomLeft: [-0.577, -0.577, 0.577],
    backTopRight: [0.577, 0.577, -0.577],
    backTopLeft: [-0.577, 0.577, -0.577],
    backBottomRight: [0.577, -0.577, -0.577],
    backBottomLeft: [-0.577, -0.577, -0.577]
  };
  
  // Set camera to specific view
  const setView = (direction: number[]) => {
    if (window.setCameraAngle) {
      window.setCameraAngle(direction);
    }
  };
  
  return (
    <group ref={groupRef} position={[0, 0, -10]}>
      {/* X Axis (Right - Left) */}
      <ViewButton 
        position={[60, 0]} 
        onClick={() => setView(viewDirections.right)} 
        label="X" 
        color={X_COLOR} 
      />
      <ViewButton 
        position={[-60, 0]} 
        onClick={() => setView(viewDirections.left)} 
        label="-X" 
        color={X_COLOR} 
      />
      
      {/* Y Axis (Up - Down) */}
      <ViewButton 
        position={[0, 60]} 
        onClick={() => setView(viewDirections.top)} 
        label="Y" 
        color={Y_COLOR} 
      />
      <ViewButton 
        position={[0, -60]} 
        onClick={() => setView(viewDirections.bottom)} 
        label="-Y" 
        color={Y_COLOR} 
      />
      
      {/* Z Axis (Front - Back) */}
      <ViewButton 
        position={[30, 30]} 
        onClick={() => setView(viewDirections.front)} 
        label="Z" 
        color={Z_COLOR} 
      />
      <ViewButton 
        position={[-30, -30]} 
        onClick={() => setView(viewDirections.back)} 
        label="-Z" 
        color={Z_COLOR} 
      />
      
      {/* Isometric view (all positive) */}
      <ViewButton 
        position={[45, 45]} 
        onClick={() => setView(viewDirections.frontTopRight)} 
        label="ISO" 
        color="#8855ff" 
      />
    </group>
  );
}