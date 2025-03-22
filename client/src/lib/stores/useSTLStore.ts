import { create } from "zustand";
import * as THREE from "three";

interface STLState {
  stlFile: File | null;
  stlFileName: string | null;
  geometry: THREE.BufferGeometry | null;
  isLoading: boolean;
  canvasRef: HTMLCanvasElement | null;
  autoRotate: boolean;
  rotationSpeed: number;
  isRecording: boolean;
  
  // Actions
  setSTLFile: (file: File, geometry: THREE.BufferGeometry) => void;
  setLoading: (loading: boolean) => void;
  setCanvasRef: (ref: HTMLCanvasElement) => void;
  setAutoRotate: (autoRotate: boolean) => void;
  setRotationSpeed: (speed: number) => void;
  setIsRecording: (isRecording: boolean) => void;
  resetSTL: () => void;
}

export const useSTLStore = create<STLState>((set) => ({
  stlFile: null,
  stlFileName: null,
  geometry: null,
  isLoading: false,
  canvasRef: null,
  autoRotate: true,
  rotationSpeed: 5,
  isRecording: false,
  
  setSTLFile: (file, geometry) => set({ 
    stlFile: file,
    stlFileName: file.name,
    geometry,
    isLoading: false
  }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setCanvasRef: (ref) => set({ canvasRef: ref }),
  
  setAutoRotate: (autoRotate) => set({ autoRotate }),
  
  setRotationSpeed: (speed) => set({ rotationSpeed: speed }),
  
  setIsRecording: (isRecording) => set({ isRecording }),
  
  resetSTL: () => set({
    stlFile: null,
    stlFileName: null,
    geometry: null,
    isLoading: false
  })
}));
