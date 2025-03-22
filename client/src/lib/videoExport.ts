/**
 * Utility for recording canvas animations and exporting as video
 */

// Start recording a canvas
export async function startRecording(canvas: HTMLCanvasElement): Promise<MediaRecorder> {
  try {
    // Get the canvas stream
    const stream = canvas.captureStream(30); // 30 FPS
    
    // Create media recorder with WebM format
    const options = { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 5000000 };
    const mediaRecorder = new MediaRecorder(stream, options);
    
    // Start recording
    mediaRecorder.start();
    
    return mediaRecorder;
  } catch (error) {
    console.error("Error starting recording:", error);
    throw new Error("Failed to start recording. Your browser may not support this feature.");
  }
}

// Stop recording and get the video blob
export async function stopRecording(mediaRecorder: MediaRecorder): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // Array to store chunks of video data
    const chunks: BlobPart[] = [];
    
    // Add existing chunks if any
    if (mediaRecorder.state === "recording") {
      mediaRecorder.addEventListener("dataavailable", (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      });
      
      // When recording stops, create and return the video blob
      mediaRecorder.addEventListener("stop", () => {
        try {
          const blob = new Blob(chunks, { type: "video/webm" });
          resolve(blob);
        } catch (error) {
          reject(error);
        }
      });
      
      // Stop the recording
      mediaRecorder.stop();
    } else {
      reject(new Error("MediaRecorder is not recording"));
    }
  });
}
