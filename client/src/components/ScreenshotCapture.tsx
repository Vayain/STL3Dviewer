import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSTLStore } from "../lib/stores/useSTLStore";
import { toast } from "sonner";
import { Camera, Loader2 } from "lucide-react";

// Predefined camera positions for taking screenshots
const CAMERA_POSITIONS = [
  { position: [0, 0, 5], name: "front" },    // Front view
  { position: [0, 0, -5], name: "back" },    // Back view
  { position: [5, 0, 0], name: "right" },    // Right view
  { position: [-5, 0, 0], name: "left" },    // Left view
  { position: [0, 5, 0], name: "top" },      // Top view
  { position: [0, -5, 0], name: "bottom" },  // Bottom view
  { position: [3.5, 3.5, 3.5], name: "corner" } // Corner view
];

export default function ScreenshotCapture() {
  const { 
    canvasRef, 
    isTakingScreenshots, 
    setIsTakingScreenshots,
    setAutoRotate
  } = useSTLStore();
  
  // Download a screenshot
  const downloadScreenshot = (dataUrl: string, name: string) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${name}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Capture screenshots from multiple angles
  const captureMultipleScreenshots = async () => {
    if (!canvasRef) {
      toast.error("Canvas not available");
      return;
    }
    
    setIsTakingScreenshots(true);
    setAutoRotate(false);
    
    try {
      // Simple approach: just capture the current canvas state
      // This doesn't control the camera, but captures what's currently showing
      const screenshot = canvasRef.toDataURL("image/png");
      
      // Just download the current view for now
      downloadScreenshot(screenshot, "model_current_view");
      
      toast.success(
        "Screenshot captured! For now, use the camera controls to position your model and take screenshots from different angles."
      );
    } catch (error) {
      console.error("Error capturing screenshots:", error);
      toast.error("Failed to capture screenshots");
    } finally {
      setIsTakingScreenshots(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">Screenshot Series</h3>
            <p className="text-xs text-muted-foreground">
              Capture views from different angles
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
            Capture Current View
          </>
        )}
      </Button>
      
      {isTakingScreenshots && (
        <div className="text-xs text-muted-foreground text-center animate-pulse">
          Please wait while screenshot is being captured...
        </div>
      )}
      
      <div className="bg-muted p-3 rounded-md text-sm">
        <p>Position your model using the camera controls, then click the button above to capture a screenshot of the current view.</p>
        <p className="mt-2">For a complete product showcase, take screenshots from different angles: front, back, sides, top, and bottom.</p>
      </div>
    </div>
  );
}