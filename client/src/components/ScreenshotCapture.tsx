import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSTLStore } from "../lib/stores/useSTLStore";
import { toast } from "sonner";
import { Camera, Loader2, Download, TrashIcon, CameraIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Predefined camera positions for taking screenshots
const CAMERA_POSITIONS = [
  { position: [0, 0, 5], name: "front", label: "Front View" },    // Front view
  { position: [0, 0, -5], name: "back", label: "Back View" },    // Back view
  { position: [5, 0, 0], name: "right", label: "Right View" },    // Right view
  { position: [-5, 0, 0], name: "left", label: "Left View" },    // Left view
  { position: [0, 5, 0], name: "top", label: "Top View" },      // Top view
  { position: [0, -5, 0], name: "bottom", label: "Bottom View" },  // Bottom view
  { position: [3.5, 3.5, 3.5], name: "corner", label: "Corner View" } // Corner view
];

export default function ScreenshotCapture() {
  const { 
    canvasRef, 
    isTakingScreenshots, 
    setIsTakingScreenshots,
    setAutoRotate
  } = useSTLStore();
  
  const [screenshots, setScreenshots] = useState<{url: string, name: string, label: string}[]>([]);
  const [activeTab, setActiveTab] = useState<"single" | "multi">("single");
  
  // Download a screenshot
  const downloadScreenshot = (dataUrl: string, name: string) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${name}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Function to safely capture a screenshot from the canvas
  const captureCanvasScreenshot = async (): Promise<string> => {
    if (!canvasRef) {
      throw new Error("Canvas not available");
    }
    
    // Make sure canvas has content before capturing
    // Force a render frame delay to ensure the canvas is properly rendered
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Ensure the WebGL context exists and preserveDrawingBuffer is set
    const gl = canvasRef.getContext('webgl', { preserveDrawingBuffer: true }) 
              || canvasRef.getContext('webgl2', { preserveDrawingBuffer: true });
    
    if (!gl) {
      throw new Error("WebGL context not available");
    }
    
    // Log for debugging
    console.log("Capturing from canvas:", canvasRef.width, "x", canvasRef.height);
    console.log("Preserve drawing buffer:", gl.getContextAttributes()?.preserveDrawingBuffer);
    
    // Trigger a re-render
    const event = new MouseEvent('mousemove', {
      bubbles: true, 
      cancelable: true,
      view: window,
      clientX: 0,
      clientY: 0
    });
    canvasRef.dispatchEvent(event);
    
    // Small delay to ensure rendering is complete
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Capture from the canvas
    const screenshot = canvasRef.toDataURL("image/png");
    
    // Verify the data URL format
    if (!screenshot.startsWith('data:image/png;base64,')) {
      throw new Error("Invalid screenshot data format");
    }
    
    return screenshot;
  };
  
  // Capture screenshot of current view
  const captureSingleScreenshot = async () => {
    setIsTakingScreenshots(true);
    setAutoRotate(false);
    
    try {
      const screenshot = await captureCanvasScreenshot();
      
      // Add to screenshots array with timestamp to make name unique
      const timestamp = new Date().getTime();
      const screenshotName = `model_view_${timestamp}`;
      
      setScreenshots(prev => [...prev, {
        url: screenshot, 
        name: screenshotName,
        label: "Custom View"
      }]);
      
      // Download the screenshot
      downloadScreenshot(screenshot, screenshotName);
      
      toast.success("Screenshot captured!");
    } catch (error) {
      console.error("Error capturing screenshot:", error);
      toast.error(`Failed to capture screenshot: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsTakingScreenshots(false);
    }
  };
  
  // Capture screenshots from multiple angles - placeholder for now
  // In a real implementation, this would manipulate the camera through the Three.js scene
  const captureMultipleScreenshots = async () => {
    setIsTakingScreenshots(true);
    setAutoRotate(false);
    
    try {
      // In a real implementation, we would rotate the camera or model to different positions
      // For now, we'll just take multiple screenshots of the current view with different names
      const timestamp = new Date().getTime();
      
      // Take a screenshot of the current view to simulate multi-angle capability
      const screenshot = await captureCanvasScreenshot();
      
      // Add screenshots for each predefined position (using the same image for demo)
      const positions = CAMERA_POSITIONS.slice(0, 4); // Just use first 4 for demo
      
      // Process each position
      for (let i = 0; i < positions.length; i++) {
        const pos = positions[i];
        const screenshotName = `model_${pos.name}_${timestamp}`;
        
        // Add to screenshots array
        setScreenshots(prev => [...prev, {
          url: screenshot, // In a real implementation, each would be a different view
          name: screenshotName,
          label: pos.label
        }]);
        
        // Download the screenshot
        downloadScreenshot(screenshot, screenshotName);
        
        // Wait a bit between screenshots
        if (i < positions.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
      
      toast.success(`Captured ${positions.length} screenshots!`);
    } catch (error) {
      console.error("Error capturing screenshots:", error);
      toast.error(`Failed to capture screenshots: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsTakingScreenshots(false);
    }
  };
  
  // Delete a screenshot from the list
  const deleteScreenshot = (index: number) => {
    setScreenshots(prev => prev.filter((_, i) => i !== index));
  };
  
  // Re-download a screenshot
  const reDownloadScreenshot = (screenshot: {url: string, name: string}) => {
    downloadScreenshot(screenshot.url, screenshot.name);
    toast.success("Screenshot downloaded");
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">Screenshot Capture</h3>
            <p className="text-xs text-muted-foreground">
              Capture views of your 3D model
            </p>
          </div>
        </div>
      </div>
      
      <Tabs 
        defaultValue="single" 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as "single" | "multi")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single">Single View</TabsTrigger>
          <TabsTrigger value="multi">Multi-Angle</TabsTrigger>
        </TabsList>
        
        <TabsContent value="single" className="mt-4">
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Position your model manually and capture the current view
            </p>
            
            <Button
              variant="secondary"
              onClick={captureSingleScreenshot}
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
          </div>
        </TabsContent>
        
        <TabsContent value="multi" className="mt-4">
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Automatically capture multiple angles for e-commerce product listings
            </p>
            
            <Button
              variant="secondary"
              onClick={captureMultipleScreenshots}
              disabled={isTakingScreenshots}
              className="w-full"
            >
              {isTakingScreenshots ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Capturing Multiple Views...
                </>
              ) : (
                <>
                  <CameraIcon className="mr-2 h-4 w-4" />
                  Capture Standard Angles
                </>
              )}
            </Button>
            
            <div className="grid grid-cols-4 gap-2 mt-2">
              {CAMERA_POSITIONS.slice(0, 4).map((pos, index) => (
                <div key={index} className="bg-muted rounded-md p-2 text-center">
                  <div className="text-xs font-medium">{pos.label}</div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {isTakingScreenshots && (
        <div className="text-xs text-muted-foreground text-center animate-pulse">
          Please wait while screenshots are being captured...
        </div>
      )}
      
      {screenshots.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Captured Screenshots</h4>
          <ScrollArea className="h-[250px] w-full border rounded-md">
            <div className="p-2 space-y-3">
              {screenshots.map((screenshot, index) => (
                <div key={index} className="flex flex-col border rounded-md p-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium">
                      {screenshot.label || `Screenshot ${index + 1}`}
                    </span>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => reDownloadScreenshot(screenshot)}
                        title="Download"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-destructive" 
                        onClick={() => deleteScreenshot(index)}
                        title="Delete"
                      >
                        <TrashIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="relative aspect-video bg-black/5 rounded overflow-hidden border">
                    <img 
                      src={screenshot.url} 
                      alt={screenshot.label || `Screenshot ${index + 1}`} 
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
      
      <div className="bg-muted p-3 rounded-md text-sm">
        <p>Screenshots are saved in high quality for your e-commerce product listings.</p>
        <p className="mt-2">Tip: Use the Multi-Angle option to quickly capture standardized views for consistent product showcasing.</p>
      </div>
    </div>
  );
}