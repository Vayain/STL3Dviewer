import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import STLViewer from "./components/STLViewer";
import ControlPanel from "./components/ControlPanel";
import Dropzone from "./components/Dropzone";
import { useSTLStore } from "./lib/stores/useSTLStore";
import { Toaster } from "sonner";
import "@fontsource/inter";

function App() {
  const { stlFile, isLoading } = useSTLStore();
  const [showDropzone, setShowDropzone] = useState(true);

  // Hide dropzone when a file is loaded
  useEffect(() => {
    if (stlFile) {
      setShowDropzone(false);
    }
  }, [stlFile]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <header className="border-b border-border p-4">
          <div className="container mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-bold">3D Model Showcase Creator</h1>
            {stlFile && (
              <button 
                className="text-primary hover:text-primary/80 text-sm font-medium"
                onClick={() => setShowDropzone(true)}
              >
                Change Model
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 container mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6">
          {showDropzone ? (
            <div className="flex-1 flex items-center justify-center">
              <Dropzone onClose={() => setShowDropzone(false)} />
            </div>
          ) : (
            <>
              <div className="flex-1 min-h-[400px] md:min-h-[600px] bg-card rounded-lg shadow overflow-hidden">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <STLViewer />
                )}
              </div>
              <ControlPanel />
            </>
          )}
        </main>

        <footer className="border-t border-border p-4 text-center text-sm text-muted-foreground">
          <p>3D Model Showcase Creator &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}

export default App;
