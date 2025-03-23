import React from 'react';
import { Button } from "./ui/button";
import { RotateCw, RotateCcw } from 'lucide-react';
import { useSTLStore } from '../lib/stores/useSTLStore';

// Component to provide UI for precise 360-degree axis rotation
export default function ModelRotator({ className = "" }: { className?: string }) {
  // Axis labels and colors
  const axes = [
    { name: 'X', color: '#ff3352' },
    { name: 'Y', color: '#4dff33' },
    { name: 'Z', color: '#334dff' }
  ];
  
  // Function to rotate the model around a specific axis
  const rotateModel = (axis: string, clockwise: boolean) => {
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
    <div className={`p-2 ${className}`}>
      <div className="text-xs font-medium text-center mb-2">Model Rotation</div>
      
      {axes.map((axis) => (
        <div key={axis.name} className="flex items-center justify-between gap-1 mb-1">
          <span className="font-medium text-xs" style={{ color: axis.color }}>{axis.name}</span>
          <div className="flex gap-1">
            <Button 
              size="sm" 
              variant="outline"
              className="p-0 h-7 w-7"
              onClick={() => rotateModel(axis.name, false)}
              title={`Rotate ${axis.name} axis counter-clockwise`}
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="p-0 h-7 w-7"
              onClick={() => rotateModel(axis.name, true)}
              title={`Rotate ${axis.name} axis clockwise`}
            >
              <RotateCw className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}