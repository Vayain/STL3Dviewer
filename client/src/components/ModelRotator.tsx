import React from 'react';
import { Button } from "./ui/button";
import { RotateCw, RotateCcw } from 'lucide-react';
import { useSTLStore } from '../lib/stores/useSTLStore';

// Component to provide UI for precise 360-degree axis rotation
export default function ModelRotator() {
  const { modelPosition, setModelPosition } = useSTLStore();
  
  // Axis labels and colors
  const axes = [
    { name: 'X', color: '#ff3352' },
    { name: 'Y', color: '#4dff33' },
    { name: 'Z', color: '#334dff' }
  ];
  
  // Function to rotate the model around a specific axis
  const rotateModel = (axis: string, clockwise: boolean) => {
    // No need to query for the mesh element, we're using events to communicate with the Model component
    
    // Determine which axis to rotate around
    let axisIndex = 0;
    if (axis === 'Y') axisIndex = 1;
    if (axis === 'Z') axisIndex = 2;
    
    // Determine rotation direction
    const rotationAmount = clockwise ? Math.PI / 12 : -Math.PI / 12; // 15 degrees at a time
    
    // Update model rotation through a custom event
    window.dispatchEvent(new CustomEvent('rotate-model', {
      detail: {
        axis: axisIndex,
        amount: rotationAmount
      }
    }));
  };
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/10 backdrop-blur-sm p-3 rounded-lg z-10 flex flex-col gap-3">
      <h3 className="text-sm font-bold text-center mb-1">Axis Rotation</h3>
      
      {axes.map((axis) => (
        <div key={axis.name} className="flex items-center justify-between gap-2">
          <span className="font-bold" style={{ color: axis.color }}>{axis.name}</span>
          <div className="flex gap-1">
            <Button 
              size="sm" 
              variant="outline"
              className="p-1 h-8 w-8"
              onClick={() => rotateModel(axis.name, false)}
              title={`Rotate ${axis.name} axis counter-clockwise`}
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="p-1 h-8 w-8"
              onClick={() => rotateModel(axis.name, true)}
              title={`Rotate ${axis.name} axis clockwise`}
            >
              <RotateCw className="h-5 w-5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}