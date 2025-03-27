# 3D Model Showcase Studio User Guide

This guide will help you get the most out of 3D Model Showcase Studio, a web application designed for creating product visualizations from 3D STL files.

## Getting Started

### Loading Your 3D Model

1. **Drag & Drop**: Simply drag your STL file onto the main view area
2. **Upload Button**: Click the upload button in the control panel and select your STL file

Once loaded, your model will appear in the viewer and automatically be positioned and scaled appropriately.

### Basic Navigation

- **Rotate**: Click and drag anywhere in the 3D view
- **Zoom**: Use the scroll wheel or pinch gesture on trackpads
- **Pan**: Right-click and drag or hold the middle mouse button and drag

## Advanced Features

### Camera Controls

Access camera controls from the side panel:

- **View Presets**: Quickly switch between standard views (Front, Back, Top, etc.)
- **Reset View**: Return to the initial camera position
- **Advanced Controls**:
  - **Axis Rotation**: Use the X, Y, Z axis controls for precise rotation
  - **Custom Views**: Create and save custom camera positions

### Model Appearance

Adjust the following properties from the control panel:

- **Color**: Change the model color
- **Material Properties**:
  - **Metalness**: Adjust how metallic the material appears (0-1)
  - **Roughness**: Adjust surface roughness for more or less reflectivity (0-1)
  - **Smoothness**: Control the smoothness of the model surface (0-1)
- **Presentation**:
  - **Grid**: Toggle the grid/floor visibility
  - **Shadows**: Toggle shadow casting for more realistic presentation
  - **Background**: Add a custom background image (useful for watermarking)

### Capturing Content

#### Video Recording

1. Navigate to the "Export > Video" tab
2. Set the desired rotation speed
3. Toggle auto-rotation if needed
4. Click "Start Recording"
5. Click "Stop Recording" when finished
6. Preview the video and download

#### Screenshots

1. Navigate to the "Export > Screenshots" tab
2. Choose between:
   - **Capture Current View**: Takes a single screenshot of the current camera angle
   - **Capture All Views**: Automatically captures standard product views (Front, Back, Top, Bottom, Left, Right, Isometric)
3. Preview the screenshots
4. Download individual images or all as a zip file

## Tips & Tricks

- **Smooth Models**: Increase the smoothness slider for models with visible facets
- **Professional Look**: Enable shadows and disable the grid for a clean product presentation
- **Quick Navigation**: Use the camera gizmo (3D axis indicator) for quick orientation changes
- **Perfect Positioning**: Use the pan feature to center your model before capturing
- **Quality Control**: Preview all screenshots before downloading to ensure quality
- **Video Length**: Keep videos between 10-15 seconds for optimal engagement
- **Background Images**: Use a subtle, branded background for marketing materials

## Troubleshooting

### Common Issues

- **Model Too Large/Small**: The model is automatically scaled, but you can manually adjust using the scale slider
- **Poor Model Quality**: Increase the smoothness slider to improve appearance
- **Slow Performance**: Very large STL files may cause performance issues. Consider simplifying your model
- **Unexpected Colors**: The default material is applied to all models. Adjust the color and material properties as needed

### File Compatibility

The application supports both binary and ASCII STL files. If you encounter issues loading a file:

- Verify it's a valid STL file
- Try converting between binary and ASCII formats using external tools
- Ensure the file isn't corrupted

## Keyboard Shortcuts

- **R**: Reset camera view
- **G**: Toggle grid visibility
- **S**: Toggle shadows
- **1-6**: Standard views (Front, Back, Top, Bottom, Left, Right)
- **7**: Isometric view