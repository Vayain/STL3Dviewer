# Developer Guide for 3D Model Showcase Studio

This guide provides information for developers who want to contribute to or modify the 3D Model Showcase Studio application.

## Development Environment Setup

### Prerequisites

- Node.js (v18+)
- npm (v8+)

### Setup Steps

1. Clone the repository
```bash
git clone https://github.com/yourusername/3d-model-showcase-studio.git
cd 3d-model-showcase-studio
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. The application should now be running at `http://localhost:5000`

## Project Structure

The project follows a standard React application structure with a few specific folders:

```
/
├── client/               # Frontend application
│   ├── public/           # Static assets
│   │   ├── models/       # Sample 3D models
│   │   ├── textures/     # Textures for 3D rendering
│   └── src/              # Source code
│       ├── components/   # React components
│       │   ├── ui/       # UI components
│       ├── hooks/        # Custom React hooks
│       ├── lib/          # Utility functions
│       │   ├── stores/   # Zustand state stores
│       ├── pages/        # Page components
├── server/               # Backend code
├── shared/               # Shared types and utilities
├── docs/                 # Documentation
```

## Key Technologies

- **React**: UI framework
- **Three.js** and **React Three Fiber**: 3D rendering
- **Zustand**: State management
- **TypeScript**: Type safety
- **tailwindcss**: Styling
- **shadcn/ui**: UI component library
- **Express**: Backend server

## Important Files

### Core Components

- `client/src/components/STLViewer.tsx`: The main 3D viewer
- `client/src/components/ControlPanel.tsx`: Control panel for adjusting model parameters
- `client/src/components/CameraControls.tsx`: Advanced camera control UI
- `client/src/components/ModelRotator.tsx`: UI for precise model rotation
- `client/src/components/VideoRecorder.tsx`: Video recording functionality
- `client/src/components/ScreenshotCapture.tsx`: Screenshot capturing

### State Management

- `client/src/lib/stores/useSTLStore.ts`: Main application state store
- `client/src/lib/stores/useGame.tsx`: Application phase state
- `client/src/lib/stores/useAudio.tsx`: Audio management

### Utilities

- `client/src/lib/stlLoader.ts`: STL file parsing and geometry creation
- `client/src/lib/videoExport.ts`: Video recording and export functionality

## Development Workflows

### Adding a New Feature

1. Create a new branch for your feature
2. Implement the feature, following the existing code style
3. Test thoroughly
4. Create a pull request with a detailed description of your changes

### Modifying 3D Functionality

When working with the 3D rendering functionality:

1. Understand the Three.js and React Three Fiber concepts
2. Always clean up event listeners and resources in useEffect cleanup functions
3. Be careful with performance, especially for large models
4. Test with various STL files to ensure compatibility

### UI Changes

1. Follow the existing UI design patterns
2. Use the shadcn/ui components when possible
3. Ensure responsive design works on different screen sizes

## Code Style and Conventions

- Use TypeScript for all new code
- Follow the eslint and prettier configurations
- Use meaningful variable and function names
- Add comments for complex logic
- Properly type all functions and components

## Testing

- Test your changes with different STL files
- Test on different browsers (Chrome, Firefox, Safari)
- Test on different devices if possible (desktop, tablet, mobile)

## Deployment

The application is deployed on Replit, which automatically handles the build process.

For custom deployments:

1. Build the application
```bash
npm run build
```

2. The built files will be in the `dist` directory

## Common Issues and Solutions

### Performance Issues

- Use React.memo for components that don't need frequent re-renders
- Optimize 3D models by reducing polygon count when possible
- Use useFrame from React Three Fiber judiciously

### Three.js Integration

- Always dispose of Three.js resources when components unmount
- Handle window resize events for proper canvas sizing
- Use PerspectiveCamera for most 3D viewing needs
- Implement OrbitControls for camera manipulation

## Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- [Three.js Documentation](https://threejs.org/docs/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)