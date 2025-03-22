import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

/**
 * Loads an STL file and returns a Three.js BufferGeometry
 */
export async function loadSTLFile(file: File): Promise<THREE.BufferGeometry> {
  return new Promise((resolve, reject) => {
    const loader = new STLLoader();
    
    // Convert file to array buffer
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
          throw new Error("Failed to read file");
        }
        
        // Parse the STL file
        const geometry = loader.parse(event.target.result as ArrayBuffer);
        
        // Center the geometry
        geometry.center();
        
        // Compute vertex normals if they don't exist
        if (!geometry.attributes.normal) {
          geometry.computeVertexNormals();
        }
        
        resolve(geometry);
      } catch (error) {
        console.error("Error parsing STL:", error);
        reject(new Error("Failed to parse STL file. The file may be corrupted or in an unsupported format."));
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Failed to read the file"));
    };
    
    reader.readAsArrayBuffer(file);
  });
}
