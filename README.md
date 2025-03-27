# 3D Model Showcase Studio

A professional web application for creating dynamic 3D product showcases and marketing materials from STL files. Perfect for e-commerce, product marketing, and 3D visualization needs.

## Features

- **Interactive 3D Viewer**: Drag and drop STL files for instant visualization
- **Video Recording**: Generate professional product showcase videos with customizable rotation
- **Screenshot Capture**: Automatically capture product images from standard angles (front, back, top, bottom, left, right, isometric)
- **Advanced Camera Controls**: Professional Blender-like 3D navigation with full 360-degree freedom
- **Material Controls**: Adjust color, metalness, roughness, and smoothness
- **Presentation Controls**: Toggle grid/floor and shadows for better product presentation
- **Background Customization**: Add watermarks or branded backgrounds

## Technical Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **3D Rendering**: Three.js, React Three Fiber
- **State Management**: Zustand
- **File Processing**: Custom STL loader
- **Video & Image Capture**: Custom recording utilities

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/3d-model-showcase-studio.git
cd 3d-model-showcase-studio
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5000`

## Usage Guide

### Loading Models
- Drag and drop an STL file onto the viewer or use the upload button
- The model will automatically be positioned and scaled appropriately

### Adjusting Camera
- **Basic Controls**: Use mouse to orbit, zoom, and pan
- **Advanced Controls**: Use the camera controls panel for precise navigation
  - **Orbit**: Click and drag to rotate around the model
  - **Pan**: Right-click and drag or use middle mouse button
  - **Zoom**: Use scroll wheel or pinch gesture
  - **View Presets**: Quick access to standard views (top, front, etc.)
  - **Axis Rotation**: Precise rotation around X, Y, Z axes

### Material Adjustments
- Change color, metalness, roughness, and smoothness from the control panel
- Toggle grid/floor and shadows to enhance product presentation

### Creating Videos
- Set rotation speed and toggle auto-rotation
- Click "Record" to start capturing
- Preview and download the video in the export tab

### Capturing Screenshots
- Navigate to the screenshots tab
- Click "Capture All Views" to automatically take screenshots from all standard angles
- Preview and download images individually or as a zip file

## Project Structure

- `/client`: Frontend React application
  - `/components`: React components
  - `/hooks`: Custom React hooks
  - `/lib`: Utility functions and store definitions
- `/server`: Express backend for file handling
- `/shared`: Shared types and schemas

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.