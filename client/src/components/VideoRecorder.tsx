import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Video, Download, Square, Loader2 } from "lucide-react";
import { useSTLStore } from "../lib/stores/useSTLStore";
import { startRecording, stopRecording } from "../lib/videoExport";
import { toast } from "sonner";

export default function VideoRecorder() {
  const { 
    canvasRef, 
    isRecording, 
    setIsRecording, 
    stlFileName,
    autoRotate: wasAutoRotating,
    setAutoRotate
  } = useSTLStore();
  
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const autoRotateRef = useRef(wasAutoRotating);
  
  // Cleanup URLs when component unmounts
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);
  
  // Start recording the canvas
  const handleStartRecording = async () => {
    if (!canvasRef) {
      toast.error("Canvas not ready. Please try again.");
      return;
    }
    
    try {
      // Remember autoRotate state and ensure it's on during recording
      autoRotateRef.current = wasAutoRotating;
      setAutoRotate(true);
      
      // Start recording
      setIsRecording(true);
      
      // Reset any previous recordings
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
        setVideoUrl(null);
        setVideoBlob(null);
      }
      
      mediaRecorderRef.current = await startRecording(canvasRef);
      
      // Show recording toast
      toast("Recording started", {
        description: "Your model is being recorded while rotating",
        duration: 3000
      });
      
      // Automatically stop after 5 seconds
      setTimeout(() => {
        if (isRecording) {
          handleStopRecording();
        }
      }, 5000);
    } catch (error) {
      console.error("Failed to start recording:", error);
      setIsRecording(false);
      setAutoRotate(autoRotateRef.current);
      toast.error("Failed to start recording. Please try again.");
    }
  };
  
  // Stop recording
  const handleStopRecording = async () => {
    if (!mediaRecorderRef.current) {
      setIsRecording(false);
      setAutoRotate(autoRotateRef.current);
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const blob = await stopRecording(mediaRecorderRef.current);
      setVideoBlob(blob);
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      
      setIsRecording(false);
      setAutoRotate(autoRotateRef.current);
      
      toast.success("Recording completed", {
        description: "Your video is ready to download",
      });
    } catch (error) {
      console.error("Failed to stop recording:", error);
      toast.error("Failed to process video. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Download the recorded video
  const handleDownload = () => {
    if (!videoUrl || !videoBlob) return;
    
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = `${stlFileName || "model"}_rotation.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success("Download started", {
      description: "Your video is being downloaded",
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="aspect-video bg-muted rounded-md overflow-hidden relative">
        {videoUrl ? (
          <video 
            src={videoUrl} 
            controls 
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Video className="h-10 w-10 text-muted-foreground/50" />
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        {isRecording ? (
          <Button
            variant="destructive"
            className="flex-1"
            onClick={handleStopRecording}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Square className="mr-2 h-4 w-4" />
                Stop Recording
              </>
            )}
          </Button>
        ) : (
          <Button
            className="flex-1"
            onClick={handleStartRecording}
            disabled={isProcessing}
          >
            <Video className="mr-2 h-4 w-4" />
            Record (5s)
          </Button>
        )}
        
        {videoUrl && (
          <Button
            variant="outline"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
