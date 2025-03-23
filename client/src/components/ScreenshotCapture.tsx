import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useSTLStore } from "../lib/stores/useSTLStore";
import { toast } from "sonner";
import { Camera, Download, Loader2 } from "lucide-react";
import * as THREE from "three";

export default function ScreenshotCapture() {
  const { 
    canvasRef, 
    isTakingScreenshots, 
    setIsTakingScreenshots,
    setAutoRotate
  } = useSTLStore();
  
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const cameraPositionRef = useRef<THREE.Vector3 | null>(null);
  
  // Capture a single screenshot from the canvas
  const captureScreenshot = (): string => {
    if (!canvasRef) return "";
    
    return canvasRef.toDataURL("image/png");
  };
  
  // Download a single screenshot
  const downloadScreenshot = (dataUrl: string, name: string) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${name}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Generate screenshots from multiple angles
  const captureMultipleScreenshots = async () => {
    if (!canvasRef) {
      toast.error("Canvas not available");
      return;
    }
    
    setIsTakingScreenshots(true);
    setAutoRotate(false);
    
    // Store original camera position
    const threeCanvas = canvasRef.__r3f.fiber;
    if (threeCanvas && threeCanvas.camera) {
      const camera = threeCanvas.camera;
      cameraPositionRef.current = camera.position.clone();
      
      const screenshots: string[] = [];
      const positions = [
        { x: 0, y: 0, z: 5, name: "front" },    // Front view
        { x: 0, y: 0, z: -5, name: "back" },    // Back view
        { x: 5, y: 0, z: 0, name: "right" },    // Right view
        { x: -5, y: 0, z: 0, name: "left" },    // Left view
        { x: 0, y: 5, z: 0, name: "top" },      // Top view
        { x: 0, y: -5, z: 0, name: "bottom" },  // Bottom view
        { x: 3.5, y: 3.5, z: 3.5, name: "corner" } // Corner view
      ];
      
      // Capture each screenshot with a delay to allow rendering
      for (const pos of positions) {
        camera.position.set(pos.x, pos.y, pos.z);
        camera.lookAt(0, 0, 0);
        
        // Wait for render to complete
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Capture the screenshot
        const screenshot = captureScreenshot();
        screenshots.push(screenshot);
        
        // Create a download
        downloadScreenshot(screenshot, `model_${pos.name}_view`);
      }
      
      setScreenshots(screenshots);
      
      // Restore camera position
      if (cameraPositionRef.current) {
        camera.position.copy(cameraPositionRef.current);
        camera.lookAt(0, 0, 0);
      }
      
      toast.success("All screenshots captured and downloaded");
    }
    
    setIsTakingScreenshots(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">Screenshot Series</h3>
            <p className="text-xs text-muted-foreground">
              Capture views from multiple angles for product display
            </p>
          </div>
        </div>
      </div>
      
      <Button
        variant="secondary"
        onClick={captureMultipleScreenshots}
        disabled={isTakingScreenshots}
        className="w-full"
      >
        {isTakingScreenshots ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Capturing...
          </>
        ) : (
          <>
            <Camera className="mr-2 h-4 w-4" />
            Capture All Angles
          </>
        )}
      </Button>
      
      {isTakingScreenshots && (
        <div className="text-xs text-muted-foreground text-center animate-pulse">
          Please wait while screenshots are being captured...
        </div>
      )}
      
      <div className="bg-muted p-3 rounded-md text-sm">
        <p>This will generate 7 images showing your model from different angles: front, back, sides, top, bottom, and corner view.</p>
        <p className="mt-2">Images will be automatically downloaded.</p>
      </div>
    </div>
  );
}