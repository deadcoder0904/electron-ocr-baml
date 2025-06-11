# System Patterns: Electron OCR with BAML

## System Architecture

The application follows the Electron framework's architecture, which is based on a main process and one or more renderer processes:

- **Main Process**: Handles system-level operations, including file access, BAML script execution for OCR processing, and communication with the renderer process.
- **Renderer Process**: Manages the user interface, built with web technologies (HTML, CSS, JavaScript/TypeScript with React), and communicates with the main process for OCR tasks.

## Key Technical Decisions

- **Electron with Vite**: Using Vite for faster development and build times compared to traditional Electron setups. Configuration files like `electron.vite.config.ts` indicate this setup.
- **TypeScript**: The project uses TypeScript for type safety across both main and renderer processes, as seen in `tsconfig.json`, `tsconfig.node.json`, and `tsconfig.web.json`.
- **BAML Integration**: BAML scripts (e.g., `baml_src/ocr.baml`) are used to define OCR workflows, potentially executed in the main process to leverage Node.js capabilities.
- **React for UI**: The renderer process uses React for building the user interface, as evident from `src/renderer/src/App.tsx`.

## Design Patterns in Use

- **MVC Pattern**: Model-View-Controller pattern is implicitly followed, where BAML scripts can be seen as the model (business logic), React components as the view, and Electron's main process as the controller managing data flow.
- **Modular Scripts**: BAML scripts are modular to allow for easy updates or additions to OCR functionality without altering the core application code.
- **IPC Communication**: Inter-Process Communication between main and renderer processes ensures secure and efficient data exchange, especially for sending image data and receiving OCR results.

## Component Relationships

- **Main Process (`src/main/index.ts`)**: Entry point for the Electron app, responsible for creating the browser window and handling system events.
- **Renderer Process (`src/renderer/src/App.tsx`)**: The React-based UI that users interact with, sending requests to the main process for OCR processing.
- **Preload Script (`src/preload/index.ts`)**: Exposes safe APIs to the renderer process for communication with the main process, enhancing security by limiting direct access to Node.js APIs.
- **BAML Client (`baml_client/`)**: A set of TypeScript files that likely handle the parsing and execution of BAML scripts, integrated into the main process.

## Critical Implementation Paths

- **Image Upload to OCR Processing**: User uploads an image via the UI → Renderer sends the image path or data to Main via IPC → Main process uses BAML script to process the image with an OCR engine → Results are sent back to Renderer for display.
- **Configuration and Setup**: Ensuring Electron, Vite, and TypeScript configurations are aligned for both development and production builds, critical for app performance and deployment.
