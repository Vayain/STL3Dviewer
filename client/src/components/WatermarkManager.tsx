import { useState } from "react";
import { useSTLStore } from "../lib/stores/useSTLStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { RotateCcw, Upload, X } from "lucide-react";
import { toast } from "sonner";

export default function WatermarkManager() {
  const { 
    backgroundImage, 
    setBackgroundImage, 
    watermarkOpacity, 
    setWatermarkOpacity,
    watermarkPosition,
    setWatermarkPosition,
    watermarkSize,
    setWatermarkSize,
    showWatermark,
    setShowWatermark
  } = useSTLStore();
  
  const [dragActive, setDragActive] = useState(false);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.includes("image")) {
        const url = URL.createObjectURL(file);
        setBackgroundImage(url);
        setShowWatermark(true);
        toast.success("Watermark image added");
      } else {
        toast.error("Please upload an image file");
      }
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBackgroundImage(url);
      setShowWatermark(true);
      toast.success("Watermark image added");
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label htmlFor="showWatermark">Enable Watermark</Label>
          <p className="text-xs text-muted-foreground">
            Display your brand logo or watermark
          </p>
        </div>
        <Switch
          id="showWatermark"
          checked={showWatermark}
          onCheckedChange={setShowWatermark}
          className="data-[state=checked]:bg-gray-700 data-[state=checked]:text-white"
        />
      </div>
      
      {showWatermark && (
        <>
          <div 
            className={`border-2 border-dashed rounded-md p-4 transition-colors ${
              dragActive ? "border-primary bg-muted/50" : "border-muted"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {backgroundImage ? (
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-full max-w-[120px] h-[120px] mx-auto">
                  <img 
                    src={backgroundImage} 
                    alt="Watermark" 
                    className="w-full h-full object-contain"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={() => {
                      setBackgroundImage(null);
                      toast.success("Watermark removed");
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  Watermark set. Drag and drop to replace.
                </p>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <div className="text-sm font-medium">
                  Drag and drop your logo or watermark
                </div>
                <p className="text-xs text-muted-foreground">
                  Or click to select a file
                </p>
                <Input
                  id="watermark"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileInput}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("watermark")?.click()}
                >
                  Select Image
                </Button>
              </div>
            )}
          </div>
          
          {backgroundImage && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="opacity">Opacity</Label>
                  <span className="text-xs text-muted-foreground">
                    {(watermarkOpacity * 100).toFixed(0)}%
                  </span>
                </div>
                <Slider
                  id="opacity"
                  min={0.05}
                  max={1}
                  step={0.05}
                  value={[watermarkOpacity]}
                  onValueChange={(value) => setWatermarkOpacity(value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="size">Size</Label>
                  <span className="text-xs text-muted-foreground">
                    {(watermarkSize * 100).toFixed(0)}%
                  </span>
                </div>
                <Slider
                  id="size"
                  min={0.1}
                  max={1}
                  step={0.05}
                  value={[watermarkSize]}
                  onValueChange={(value) => setWatermarkSize(value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {["topleft", "topcenter", "topright", "middleleft", "middlecenter", "middleright", "bottomleft", "bottomcenter", "bottomright"].map((pos) => (
                    <Button
                      key={pos}
                      variant={watermarkPosition === pos ? "default" : "outline"}
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => setWatermarkPosition(pos)}
                    >
                      {pos.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}