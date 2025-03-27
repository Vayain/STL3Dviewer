import { create } from "zustand";
import * as THREE from "three";

type ScreenshotFunction = (() => string) | null;

interface STLState {
  stlFile: File | null;
  stlFileName: string | null;
  geometry: THREE.BufferGeometry | null;
  isLoading: boolean;
  canvasRef: HTMLCanvasElement | null;
  autoRotate: boolean;
  rotationSpeed: number;
  isRecording: boolean;
  modelScale: number;
  modelColor: string;
  modelMetalness: number;
  modelRoughness: number;
  modelSmoothness: number;
  modelPosition: [number, number, number];
  showGrid: boolean;
  showShadow: boolean;
  backgroundImage: string | null;
  isTakingScreenshots: boolean;
  screenshotFunc: ScreenshotFunction;
  
  // Watermark properties
  showWatermark: boolean;
  watermarkOpacity: number;
  watermarkPosition: string;
  watermarkSize: number;
  
  // Actions
  setSTLFile: (file: File, geometry: THREE.BufferGeometry) => void;
  setLoading: (loading: boolean) => void;
  setCanvasRef: (ref: HTMLCanvasElement) => void;
  setAutoRotate: (autoRotate: boolean) => void;
  setRotationSpeed: (speed: number) => void;
  setModelScale: (scale: number) => void;
  setModelColor: (color: string) => void;
  setModelMetalness: (metalness: number) => void;
  setModelRoughness: (roughness: number) => void;
  setModelSmoothness: (smoothness: number) => void;
  setModelPosition: (position: [number, number, number]) => void;
  setShowGrid: (show: boolean) => void;
  setShowShadow: (show: boolean) => void;
  setBackgroundImage: (imageUrl: string | null) => void;
  setIsRecording: (isRecording: boolean) => void;
  setIsTakingScreenshots: (isTaking: boolean) => void;
  setScreenshotFunc: (func: ScreenshotFunction) => void;
  setShowWatermark: (show: boolean) => void;
  setWatermarkOpacity: (opacity: number) => void;
  setWatermarkPosition: (position: string) => void;
  setWatermarkSize: (size: number) => void;
  takeScreenshot: () => string | null;
  resetSTL: () => void;
}

export const useSTLStore = create<STLState>((set, get) => ({
  stlFile: null,
  stlFileName: null,
  geometry: null,
  isLoading: false,
  canvasRef: null,
  autoRotate: true,
  rotationSpeed: 0,
  isRecording: false,
  modelScale: 0.5,
  modelColor: "#8294c4",
  modelMetalness: 0.2,
  modelRoughness: 0.8,
  modelSmoothness: 0.5,
  modelPosition: [0, 0, 0],
  showGrid: false,
  showShadow: false,
  backgroundImage: null,
  isTakingScreenshots: false,
  screenshotFunc: null,
  
  // Watermark properties
  showWatermark: false,
  watermarkOpacity: 0.3,
  watermarkPosition: "bottomright",
  watermarkSize: 0.3,
  
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
  
  setModelScale: (scale) => set({ modelScale: scale }),
  
  setModelColor: (color) => set({ modelColor: color }),
  
  setModelMetalness: (metalness) => set({ modelMetalness: metalness }),
  
  setModelRoughness: (roughness) => set({ modelRoughness: roughness }),
  
  setModelSmoothness: (smoothness) => set({ modelSmoothness: smoothness }),
  
  setModelPosition: (position) => set({ modelPosition: position }),
  
  setShowGrid: (show) => set({ showGrid: show }),
  
  setShowShadow: (show) => set({ showShadow: show }),
  
  setBackgroundImage: (imageUrl) => set({ backgroundImage: imageUrl }),
  
  setIsRecording: (isRecording) => set({ isRecording }),
  
  setIsTakingScreenshots: (isTaking) => set({ isTakingScreenshots: isTaking }),
  
  setScreenshotFunc: (func) => set({ screenshotFunc: func }),
  
  // Watermark actions
  setShowWatermark: (show) => set({ showWatermark: show }),
  
  setWatermarkOpacity: (opacity) => set({ watermarkOpacity: opacity }),
  
  setWatermarkPosition: (position) => set({ watermarkPosition: position }),
  
  setWatermarkSize: (size) => set({ watermarkSize: size }),
  
  takeScreenshot: () => {
    const { screenshotFunc } = get();
    if (screenshotFunc) {
      return screenshotFunc();
    }
    return null;
  },
  
  resetSTL: () => set({
    stlFile: null,
    stlFileName: null,
    geometry: null,
    isLoading: false
  })
}));
