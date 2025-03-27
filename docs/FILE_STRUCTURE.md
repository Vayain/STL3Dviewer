# Project File Structure

This document provides an overview of the key files in the 3D Model Showcase Studio project.

## Root Directory

- `package.json`: Project dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `vite.config.ts`: Vite build configuration
- `tailwind.config.ts`: Tailwind CSS configuration
- `postcss.config.js`: PostCSS configuration
- `drizzle.config.ts`: Database configuration
- `README.md`: Project overview and documentation
- `LICENSE`: MIT license
- `CONTRIBUTING.md`: Contribution guidelines

## Client Directory (`/client`)

### Public Assets (`/client/public`)

- `/models`: Sample 3D models
- `/textures`: Textures for 3D rendering

### Source Code (`/client/src`)

#### Main Files

- `main.tsx`: Application entry point
- `App.tsx`: Main application component
- `index.css`: Global styles

#### Components (`/client/src/components`)

##### Core Components

- `STLViewer.tsx`: Main 3D viewer component
- `ControlPanel.tsx`: UI controls for the 3D viewer
- `Dropzone.tsx`: File upload component
- `CameraControls.tsx`: Camera manipulation UI
- `CameraGizmo.tsx`: 3D axis indicator for camera control
- `ModelRotator.tsx`: UI for model rotation
- `ScreenshotCapture.tsx`: Screenshot functionality
- `VideoRecorder.tsx`: Video recording functionality

##### UI Components (`/client/src/components/ui`)

Various UI components using the shadcn/ui library

#### Hooks (`/client/src/hooks`)

- `use-is-mobile.tsx`: Hook to detect mobile devices

#### Libraries (`/client/src/lib`)

- `utils.ts`: Utility functions
- `queryClient.ts`: API client setup
- `stlLoader.ts`: STL file parsing utility
- `videoExport.ts`: Video export functionality

##### State Stores (`/client/src/lib/stores`)

- `useSTLStore.ts`: Main application state
- `useGame.tsx`: Application phase management
- `useAudio.tsx`: Audio management

#### Pages (`/client/src/pages`)

- `not-found.tsx`: 404 page

## Server Directory (`/server`)

- `index.ts`: Server entry point
- `routes.ts`: API routes
- `storage.ts`: Data storage and persistence
- `vite.ts`: Vite server configuration

## Shared Directory (`/shared`)

- `schema.ts`: Shared types and database schema

## Documentation (`/docs`)

- `ARCHITECTURE.md`: High-level architecture overview
- `USER_GUIDE.md`: End-user documentation
- `DEVELOPER_GUIDE.md`: Developer documentation
- `FILE_STRUCTURE.md`: This file

## GitHub Configuration (`/.github`)

- `/ISSUE_TEMPLATE`: Issue templates
  - `bug_report.md`: Bug report template
  - `feature_request.md`: Feature request template
- `PULL_REQUEST_TEMPLATE.md`: Pull request template
- `/workflows`: GitHub Actions workflows
  - `ci.yml`: Continuous integration workflow