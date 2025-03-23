import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ZoomIn, ZoomOut, RotateCw, RotateCcw } from 'lucide-react';
import { toast } from "sonner";

const CameraControls: React.FC = () => {
  // Functions to rotate the model around the X and Y axes
  const rotateXPositive = () => {
    if (window.setCameraAngle) {
      // Rotate upward (around X axis)
      window.setCameraAngle([0, 1, 0]);
    }
  };

  const rotateXNegative = () => {
    if (window.setCameraAngle) {
      // Rotate downward (around X axis)
      window.setCameraAngle([0, -1, 0]);
    }
  };

  const rotateYPositive = () => {
    if (window.setCameraAngle) {
      // Rotate right (around Y axis)
      window.setCameraAngle([1, 0, 0]);
    }
  };

  const rotateYNegative = () => {
    if (window.setCameraAngle) {
      // Rotate left (around Y axis)
      window.setCameraAngle([-1, 0, 0]);
    }
  };

  const resetView = () => {
    if (window.resetCameraView) {
      window.resetCameraView();
      toast.success("View reset to default position");
    } else {
      toast.error("Reset view function not available");
    }
  };

  return (
    <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 p-2 rounded-md shadow-md z-10 flex flex-col gap-2">
      {/* Top row - Up */}
      <div className="flex justify-center">
        <Button variant="outline" size="icon" className="w-9 h-9" onClick={rotateXPositive}>
          <ArrowUp className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Middle row - Left, Reset, Right */}
      <div className="flex justify-between gap-2">
        <Button variant="outline" size="icon" className="w-9 h-9" onClick={rotateYNegative}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <Button variant="outline" size="icon" className="w-9 h-9" onClick={resetView}>
          <RotateCcw className="h-4 w-4" />
        </Button>
        
        <Button variant="outline" size="icon" className="w-9 h-9" onClick={rotateYPositive}>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Bottom row - Down */}
      <div className="flex justify-center">
        <Button variant="outline" size="icon" className="w-9 h-9" onClick={rotateXNegative}>
          <ArrowDown className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Rotation and Zoom control row */}
      <div className="flex justify-center gap-2 mt-2">
        <Button variant="outline" size="icon" className="w-9 h-9" onClick={() => {
          // Front view
          if (window.setCameraAngle) window.setCameraAngle([0, 0, 1]);
        }}>
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="text-xs text-center mt-1 text-gray-500">Rotation Controls</div>
    </div>
  );
};

export default CameraControls;