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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="animation">Animation</TabsTrigger>
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
