import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  PlayCircle, 
  PauseCircle, 
  RotateCcw, 
  Video, 
  Download,
  ZoomIn,
  ZoomOut,
  Loader2
} from "lucide-react";
import VideoRecorder from "./VideoRecorder";
import { useSTLStore } from "../lib/stores/useSTLStore";
import { toast } from "sonner";

export default function ControlPanel() {
  const { 
    autoRotate, 
    setAutoRotate,
    rotationSpeed, 
    setRotationSpeed,
    modelScale,
    setModelScale,
    isRecording,
    stlFileName
  } = useSTLStore();
  
  const [activeTab, setActiveTab] = useState("animation");
  
  return (
    <div className="w-full md:w-80 bg-card rounded-lg shadow p-4 flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-medium">{stlFileName || "Model Controls"}</h2>
        <p className="text-sm text-muted-foreground">Customize and export your 3D showcase</p>
      </div>
      
      <Tabs defaultValue="animation" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="animation">Animation</TabsTrigger>
          <TabsTrigger value="camera">View</TabsTrigger>
          <TabsTrigger value="material">Material</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>
        
        <TabsContent value="animation" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="autorotate">Auto Rotation</Label>
              <p className="text-xs text-muted-foreground">
                Automatically rotate the model
              </p>
            </div>
            <Switch
              id="autorotate"
              checked={autoRotate}
              onCheckedChange={setAutoRotate}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="speed">Rotation Speed</Label>
              <span className="text-xs text-muted-foreground">
                {rotationSpeed}
              </span>
            </div>
            <Slider
              id="speed"
              min={1}
              max={10}
              step={1}
              value={[rotationSpeed]}
              onValueChange={(value) => setRotationSpeed(value[0])}
              className="mt-2"
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center gap-2">
            <Button
              variant={autoRotate ? "outline" : "default"}
              size="sm"
              className="flex-1"
              onClick={() => setAutoRotate(!autoRotate)}
            >
              {autoRotate ? (
                <>
                  <PauseCircle className="mr-1 h-4 w-4" /> Pause
                </>
              ) : (
                <>
                  <PlayCircle className="mr-1 h-4 w-4" /> Play
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                const element = document.querySelector('canvas');
                if (element) {
                  const event = new KeyboardEvent('keydown', { key: 'r' });
                  element.dispatchEvent(event);
                  toast.success("Camera reset");
                }
              }}
            >
              <RotateCcw className="mr-1 h-4 w-4" /> Reset View
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="camera" className="space-y-4 mt-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="scale">Model Size</Label>
              <span className="text-xs text-muted-foreground">
                {modelScale.toFixed(2)}x
              </span>
            </div>
            <Slider
              id="scale"
              min={0.1}
              max={2}
              step={0.05}
              value={[modelScale]}
              onValueChange={(value) => setModelScale(value[0])}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Smaller</span>
              <span>Larger</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                setModelScale(Math.max(0.1, modelScale - 0.1));
              }}
            >
              <ZoomOut className="mr-1 h-4 w-4" /> Smaller
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                setModelScale(Math.min(2, modelScale + 0.1));
              }}
            >
              <ZoomIn className="mr-1 h-4 w-4" /> Larger
            </Button>
          </div>

          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-2">
              Camera Navigation Tips:
            </p>
            <ul className="text-xs text-muted-foreground space-y-1 pl-4 list-disc">
              <li>Rotate: Click and drag</li>
              <li>Zoom: Mouse wheel or pinch</li>
              <li>Pan: Right-click and drag or three-finger drag</li>
            </ul>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2"
            onClick={() => {
              setModelScale(1.0);
              const element = document.querySelector('canvas');
              if (element) {
                const event = new KeyboardEvent('keydown', { key: 'r' });
                element.dispatchEvent(event);
                toast.success("View reset");
              }
            }}
          >
            <RotateCcw className="mr-1 h-4 w-4" /> Reset All View Settings
          </Button>
        </TabsContent>
        
        <TabsContent value="export" className="space-y-4 mt-4">
          <VideoRecorder />
          
          {isRecording && (
            <div className="flex items-center justify-center space-x-2 p-4 bg-muted rounded-md animate-pulse">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p className="text-sm font-medium">Recording...</p>
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Export Options</Label>
            <p className="text-xs text-muted-foreground">
              Create a video showcase of your 3D model rotating
            </p>
          </div>
          
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm">
              Click the Record button to capture your model's rotation. The model will automatically
              rotate while recording.
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button
              disabled={isRecording}
              onClick={() => {
                if (activeTab === "export") {
                  setActiveTab("animation");
                  setTimeout(() => setActiveTab("export"), 100);
                }
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Refresh Preview
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
