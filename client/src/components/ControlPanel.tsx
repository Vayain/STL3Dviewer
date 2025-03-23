import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { 
  PlayCircle, 
  PauseCircle, 
  RotateCcw, 
  Video, 
  Download,
  ZoomIn,
  ZoomOut,
  Loader2,
  Palette
} from "lucide-react";
import VideoRecorder from "./VideoRecorder";
import ScreenshotCapture from "./ScreenshotCapture";
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
    modelColor,
    setModelColor,
    modelMetalness,
    setModelMetalness,
    modelRoughness,
    setModelRoughness,
    showGrid,
    setShowGrid,
    showShadow,
    setShowShadow,
    backgroundImage,
    setBackgroundImage,
    isRecording,
    isTakingScreenshots,
    setIsTakingScreenshots,
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
              className="data-[state=checked]:bg-gray-700 data-[state=checked]:text-white"
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
              min={0}
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
          
          <Separator className="my-4" />
          
          {/* Grid Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="showgrid">Show Grid</Label>
              <p className="text-xs text-muted-foreground">
                Display ground grid beneath model
              </p>
            </div>
            <Switch
              id="showgrid"
              checked={showGrid}
              onCheckedChange={setShowGrid}
              className="data-[state=checked]:bg-gray-700 data-[state=checked]:text-white"
            />
          </div>
          
          {/* Shadow Toggle */}
          <div className="flex items-center justify-between mt-4">
            <div className="space-y-1">
              <Label htmlFor="showshadow">Show Shadow</Label>
              <p className="text-xs text-muted-foreground">
                Display shadows cast by model
              </p>
            </div>
            <Switch
              id="showshadow"
              checked={showShadow}
              onCheckedChange={setShowShadow}
              className="data-[state=checked]:bg-gray-700 data-[state=checked]:text-white"
            />
          </div>
          
          {/* Background Image Upload */}
          <div className="space-y-2 mt-4">
            <Label htmlFor="background">Background Image</Label>
            <div className="flex gap-2">
              <Input
                id="background"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setBackgroundImage(url);
                    toast.success("Background image set");
                  }
                }}
                className="text-xs"
              />
              {backgroundImage && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setBackgroundImage(null);
                    toast.success("Background image removed");
                  }}
                  className="h-10 w-10 flex-shrink-0"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Add a watermark or background image
            </p>
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
              setShowGrid(true);
              setShowShadow(true);
              setBackgroundImage(null);
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
        
        <TabsContent value="material" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="color">Material Color</Label>
            <div className="flex gap-2">
              <Input
                id="color"
                type="color"
                value={modelColor}
                onChange={(e) => setModelColor(e.target.value)}
                className="w-12 h-10 p-1"
              />
              <Input
                type="text"
                value={modelColor}
                onChange={(e) => setModelColor(e.target.value)}
                className="flex-1"
                maxLength={7}
                placeholder="#8294c4"
              />
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="metalness">Metalness</Label>
              <span className="text-xs text-muted-foreground">
                {modelMetalness.toFixed(2)}
              </span>
            </div>
            <Slider
              id="metalness"
              min={0}
              max={1}
              step={0.05}
              value={[modelMetalness]}
              onValueChange={(value) => setModelMetalness(value[0])}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Matte</span>
              <span>Metallic</span>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="roughness">Roughness</Label>
              <span className="text-xs text-muted-foreground">
                {modelRoughness.toFixed(2)}
              </span>
            </div>
            <Slider
              id="roughness"
              min={0}
              max={1}
              step={0.05}
              value={[modelRoughness]}
              onValueChange={(value) => setModelRoughness(value[0])}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Glossy</span>
              <span>Rough</span>
            </div>
          </div>

          <div className="bg-muted p-3 rounded-md mt-4">
            <p className="text-sm">
              Adjust material properties to change how light interacts with your model. 
              Metalness affects reflectivity, while roughness controls surface texture.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2"
            onClick={() => {
              setModelColor("#8294c4");
              setModelMetalness(0.5);
              setModelRoughness(0.5);
              toast.success("Material reset to default");
            }}
          >
            <RotateCcw className="mr-1 h-4 w-4" /> Reset Material
          </Button>
        </TabsContent>
        
        <TabsContent value="export" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Export Options</Label>
            <p className="text-xs text-muted-foreground">
              Create videos and screenshots of your 3D model
            </p>
          </div>
          
          <Tabs defaultValue="video">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="video">Video</TabsTrigger>
              <TabsTrigger value="screenshot">Screenshots</TabsTrigger>
            </TabsList>
            
            <TabsContent value="video" className="pt-4">
              <VideoRecorder />
              
              {isRecording && (
                <div className="flex items-center justify-center space-x-2 p-4 bg-muted rounded-md animate-pulse mt-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p className="text-sm font-medium">Recording...</p>
                </div>
              )}
              
              <div className="bg-muted p-3 rounded-md mt-4">
                <p className="text-sm">
                  Click the Record button to capture your model's rotation. The model will automatically
                  rotate while recording.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="screenshot" className="pt-4">
              <ScreenshotCapture />
            </TabsContent>
          </Tabs>
          
          <div className="flex flex-col gap-2 mt-2">
            <Button
              disabled={isRecording || isTakingScreenshots}
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
