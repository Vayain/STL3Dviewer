import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, 
  RotateCw, RotateCcw, 
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  AlertCircle, PlusCircle, MinusCircle
} from 'lucide-react';
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CameraControls: React.FC = () => {
  // X-axis rotation (pitch)
  const rotateXPositive = () => {
    if (window.setCameraAngle) {
      window.setCameraAngle([0, 1, 0]);
    }
  };

  const rotateXNegative = () => {
    if (window.setCameraAngle) {
      window.setCameraAngle([0, -1, 0]);
    }
  };

  // Y-axis rotation (yaw)
  const rotateYPositive = () => {
    if (window.setCameraAngle) {
      window.setCameraAngle([1, 0, 0]);
    }
  };

  const rotateYNegative = () => {
    if (window.setCameraAngle) {
      window.setCameraAngle([-1, 0, 0]);
    }
  };

  // Z-axis rotation (roll)
  const rotateZPositive = () => {
    if (window.setCameraAngle) {
      window.setCameraAngle([0, 0, 1]);
    }
  };

  const rotateZNegative = () => {
    if (window.setCameraAngle) {
      window.setCameraAngle([0, 0, -1]);
    }
  };

  // Diagonal rotations
  const rotateXYPositive = () => {
    if (window.setCameraAngle) {
      window.setCameraAngle([1, 1, 0]);
    }
  };

  const rotateXYNegative = () => {
    if (window.setCameraAngle) {
      window.setCameraAngle([-1, -1, 0]);
    }
  };

  const rotateXZPositive = () => {
    if (window.setCameraAngle) {
      window.setCameraAngle([1, 0, 1]);
    }
  };

  const rotateXZNegative = () => {
    if (window.setCameraAngle) {
      window.setCameraAngle([-1, 0, -1]);
    }
  };

  const rotateYZPositive = () => {
    if (window.setCameraAngle) {
      window.setCameraAngle([0, 1, 1]);
    }
  };

  const rotateYZNegative = () => {
    if (window.setCameraAngle) {
      window.setCameraAngle([0, -1, -1]);
    }
  };

  // Reset view
  const resetView = () => {
    if (window.resetCameraView) {
      window.resetCameraView();
      toast.success("View reset to default position");
    } else {
      toast.error("Reset view function not available");
    }
  };

  // Standard views
  const frontView = () => {
    if (window.setCameraAngle) window.setCameraAngle([0, 0, 1]);
  };

  const backView = () => {
    if (window.setCameraAngle) window.setCameraAngle([0, 0, -1]);
  };

  const topView = () => {
    if (window.setCameraAngle) window.setCameraAngle([0, 1, 0]);
  };

  const bottomView = () => {
    if (window.setCameraAngle) window.setCameraAngle([0, -1, 0]);
  };

  const leftView = () => {
    if (window.setCameraAngle) window.setCameraAngle([-1, 0, 0]);
  };

  const rightView = () => {
    if (window.setCameraAngle) window.setCameraAngle([1, 0, 0]);
  };

  const isometricView = () => {
    if (window.setCameraAngle) window.setCameraAngle([0.577, 0.577, 0.577]); // Equal angles to all axes (1/√3)
  };

  return (
    <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 p-2 rounded-md shadow-md z-10 flex flex-col gap-2">
      <h3 className="text-sm font-medium text-center">Camera Controls</h3>
      
      <Tabs defaultValue="standard" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="standard">Standard</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="standard" className="space-y-2 mt-2">
          {/* Standard Views Grid */}
          <div className="grid grid-cols-3 gap-1">
            <Button variant="outline" size="sm" onClick={topView} title="Top View">Top</Button>
            <Button variant="outline" size="sm" onClick={frontView} title="Front View">Front</Button>
            <Button variant="outline" size="sm" onClick={rightView} title="Right View">Right</Button>
            
            <Button variant="outline" size="sm" onClick={leftView} title="Left View">Left</Button>
            <Button variant="outline" size="sm" onClick={backView} title="Back View">Back</Button>
            <Button variant="outline" size="sm" onClick={bottomView} title="Bottom View">Bottom</Button>
          </div>
          
          <Button variant="outline" size="sm" className="w-full" onClick={isometricView} title="Isometric View">
            Isometric
          </Button>
          
          <Button variant="secondary" size="sm" className="w-full" onClick={resetView} title="Reset View">
            <RotateCcw className="mr-2 h-4 w-4" /> Reset View
          </Button>
        </TabsContent>
        
        <TabsContent value="advanced" className="mt-2">
          {/* XY Plane Controls */}
          <div className="bg-muted/50 p-1 rounded-md mb-2">
            <div className="text-xs font-medium text-center mb-1">XY Plane</div>
            <div className="flex items-center justify-center">
              <Button variant="outline" size="icon" className="w-8 h-8" onClick={rotateXYPositive}>
                <ChevronUp className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <Button variant="outline" size="icon" className="w-8 h-8" onClick={rotateXNegative}>
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="icon" className="w-8 h-8" onClick={rotateYPositive}>
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex items-center justify-center">
              <Button variant="outline" size="icon" className="w-8 h-8" onClick={rotateXYNegative}>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          {/* XZ Plane Controls */}
          <div className="bg-muted/50 p-1 rounded-md mb-2">
            <div className="text-xs font-medium text-center mb-1">XZ Plane</div>
            <div className="flex items-center justify-center">
              <Button variant="outline" size="icon" className="w-8 h-8" onClick={rotateXZPositive}>
                <ChevronUp className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <Button variant="outline" size="icon" className="w-8 h-8" onClick={rotateXNegative}>
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="icon" className="w-8 h-8" onClick={rotateZPositive}>
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex items-center justify-center">
              <Button variant="outline" size="icon" className="w-8 h-8" onClick={rotateXZNegative}>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          {/* YZ Plane Controls */}
          <div className="bg-muted/50 p-1 rounded-md mb-2">
            <div className="text-xs font-medium text-center mb-1">YZ Plane</div>
            <div className="flex items-center justify-center">
              <Button variant="outline" size="icon" className="w-8 h-8" onClick={rotateYZPositive}>
                <ChevronUp className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <Button variant="outline" size="icon" className="w-8 h-8" onClick={rotateYNegative}>
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="icon" className="w-8 h-8" onClick={rotateZPositive}>
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex items-center justify-center">
              <Button variant="outline" size="icon" className="w-8 h-8" onClick={rotateYZNegative}>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <Button variant="secondary" size="sm" className="w-full" onClick={resetView}>
            <RotateCcw className="mr-2 h-4 w-4" /> Reset View
          </Button>
        </TabsContent>
      </Tabs>
      
      <div className="text-xs text-center mt-1 text-gray-500">
        Click and drag for free rotation
      </div>
    </div>
  );
};

export default CameraControls;