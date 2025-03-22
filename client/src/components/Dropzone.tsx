import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileUp, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSTLStore } from "../lib/stores/useSTLStore";
import { loadSTLFile } from "../lib/stlLoader";
import { toast } from "sonner";

interface DropzoneProps {
  onClose: () => void;
}

export default function Dropzone({ onClose }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { setSTLFile, setLoading } = useSTLStore();
  
  const handleFile = useCallback(async (file: File) => {
    // Check if file is an STL
    if (!file.name.toLowerCase().endsWith('.stl')) {
      toast.error("Please upload an STL file");
      return;
    }
    
    setLoading(true);
    
    try {
      // Load the STL file
      const geometry = await loadSTLFile(file);
      
      // Store the file and geometry
      setSTLFile(file, geometry);
      
      toast.success(`Successfully loaded ${file.name}`);
      onClose();
    } catch (error) {
      console.error("Error loading STL file:", error);
      toast.error("Failed to load STL file. Please try another file.");
    } finally {
      setLoading(false);
    }
  }, [setSTLFile, setLoading, onClose]);
  
  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);
  
  // Handle file input change
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div
          className={cn(
            "border-2 border-dashed border-border rounded-lg p-8 text-center transition-colors",
            isDragging && "border-primary bg-primary/5",
            isHovering && "border-primary/70 bg-primary/5"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="mx-auto flex flex-col items-center justify-center gap-2">
            <div className="rounded-full bg-muted p-4">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            
            <h3 className="text-lg font-semibold mt-2">Upload STL File</h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop your STL file here or click to browse
            </p>
            
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".stl"
              onChange={handleFileInputChange}
            />
            
            <label
              htmlFor="file-upload"
              className={cn(
                "mt-4 flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <FileUp className="h-4 w-4" />
              Browse Files
            </label>
          </div>
        </div>
        
        <div className="mt-6 space-y-2">
          <div className="flex items-start gap-2">
            <Check className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Upload and view 3D models</p>
              <p className="text-xs text-muted-foreground">
                Supported format: STL
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Check className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Create rotation animations</p>
              <p className="text-xs text-muted-foreground">
                Perfect for product showcases
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Check className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Export as video</p>
              <p className="text-xs text-muted-foreground">
                Download videos for your e-commerce store
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-2 pt-2">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">
                Large files may take a moment to process
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
