# 3D Model Showcase Studio Architecture

This document describes the high-level architecture of the 3D Model Showcase Studio application.

## Overview

The application is built as a modern single-page application (SPA) with a React frontend and a lightweight Express backend. The main functionality revolves around 3D visualization, manipulation, and capturing of STL model files.

## Component Architecture

### Frontend (Client)

The frontend is organized into the following key areas:

1. **Core Components**
   - `STLViewer.tsx`: The main 3D viewer component that handles rendering and camera management
   - `ControlPanel.tsx`: UI controls for manipulating the 3D model and scene
   - `Dropzone.tsx`: Handles file upload functionality
   - `CameraControls.tsx`: Advanced camera manipulation UI
   - `CameraGizmo.tsx`: Interactive 3D axis controls for camera orientation
   - `ModelRotator.tsx`: Controls for precise model rotation
   - `ScreenshotCapture.tsx`: UI for capturing and managing screenshots
   - `VideoRecorder.tsx`: UI for recording and exporting videos

2. **State Management**
   - `useSTLStore.ts`: Zustand store that maintains the application state
   - `useGame.tsx`: Manages application phase states
   - `useAudio.tsx`: Handles sound effects and audio management

3. **Utilities**
   - `stlLoader.ts`: Custom functionality for parsing STL files
   - `videoExport.ts`: Utilities for recording and exporting video
   - `utils.ts`: General utility functions

### Backend (Server)

The backend is minimal and primarily serves the following purposes:

- Serving static assets
- API routes for file operations
- Session management

## Data Flow

1. User uploads an STL file via `Dropzone`
2. File is parsed by `stlLoader` and converted to a Three.js geometry
3. The geometry is stored in `useSTLStore` and rendered by `STLViewer`
4. User manipulates the model via `ControlPanel`, `CameraControls`, and direct interaction
5. User can capture screenshots or record videos of the model

## State Management

The application uses Zustand for state management. The primary store (`useSTLStore`) maintains:

- The loaded STL file and its metadata
- Rendering properties (color, metalness, roughness, smoothness)
- Scene properties (grid, shadows, background)
- Animation and recording states
- User preferences

## Technical Implementation Details

### 3D Rendering

- Uses Three.js via React Three Fiber
- Implements custom camera controls with OrbitControls
- Uses environment maps for realistic lighting
- Supports mesh manipulation with THREE.Matrix4 for precise rotations

### File Processing

- Parses binary and ASCII STL files
- Computes normals for improved rendering quality
- Scales and centers models automatically

### Video and Screenshot Capture

- Captures frames directly from the WebGL canvas
- Uses MediaRecorder API for video recording
- Provides standard views for product photography (front, back, top, etc.)

### User Interface

- Uses a combination of custom UI components and shadcn/ui library
- Implements responsive design for different screen sizes
- Supports light and dark mode

## Future Architecture Considerations

- Database integration for saving and sharing models
- User authentication and project management
- Cloud storage for larger files
- Server-side rendering for improved SEO and initial load performance