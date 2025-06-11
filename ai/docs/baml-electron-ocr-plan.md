# BAML Integration Plan for Electron OCR Application

This document outlines the step-by-step plan to integrate BAML (BoundaryML) with an Electron application for OCR (Optical Character Recognition) functionality. The goal is to create a minimal Electron app that uses BAML to process screenshots taken from behind the app window and display the extracted text.

## Objective

- Develop a minimal Electron application focused on OCR using BAML.
- Implement a "Screenshot an Image" button to capture the screen behind the app.
- Use BAML to process the captured image for text extraction.
- Ensure proper communication between Electron's main and renderer processes via IPC.
- Document the setup and usage for future reference.

## Prerequisites

- Electron application with React and TypeScript already set up.
- Node.js environment with `bun` as the preferred package manager (as per user feedback).

## Step-by-Step Plan

### 1. Install BAML Dependency

- **Action**: Install the BAML package using `bun add @boundaryml/baml`.
- **Purpose**: Add BAML as a dependency to the project for AI-based OCR processing.
- **Approval**: Requires user approval due to package installation.

### 2. Create BAML Configuration File

- **Action**: Create a directory `baml_src` in the project root and add a file `baml_src/ocr.baml` to define an OCR function.
- **Content**: Define a simple BAML function for image-to-text extraction, e.g., `ExtractTextFromImage`, accepting image input as base64.
- **Purpose**: Configure BAML to process screenshots for OCR.

### 3. Generate BAML Client

- **Action**: Run `bun baml-cli generate` to generate the TypeScript client code (`baml_client`) based on the `.baml` file.
- **Purpose**: Create the necessary TypeScript bindings to call BAML functions from the Electron app.
- **Approval**: Requires user approval as it involves executing a CLI command.

### 4. Set Up IPC for Screenshot Functionality

- **Action**: Modify `src/main/index.ts` to include Electron's `desktopCapturer` API for capturing the screen.
- **Details**:
  - Use `desktopCapturer.getSources` to capture the screen.
  - Set up an IPC handler to send the captured image (as base64) to the renderer process.
- **Purpose**: Enable the main process to capture screenshots and communicate the image data to the renderer for processing.

### 5. Expose IPC to Renderer

- **Action**: Update `src/preload/index.ts` to expose a safe API to the renderer for requesting screenshots.
- **Details**: Use `contextBridge` to expose a function like `requestScreenshot` that triggers the IPC call to the main process.
- **Purpose**: Allow the renderer to request screenshot data securely without direct access to Electron APIs.

### 6. Implement UI for Screenshot and OCR

- **Action**: Simplify `src/renderer/src/App.tsx` to create a minimal UI with a "Screenshot an Image" button and a display area for OCR results.
- **Details**:
  - Remove unnecessary components and styling.
  - Add a button to trigger the screenshot request.
  - Call the BAML `ExtractTextFromImage` function with the received base64 image data.
  - Display the extracted text in the UI.
- **Purpose**: Focus the app on OCR functionality with a minimal interface.

### 7. Process Screenshot with BAML

- **Action**: In the renderer, use the generated BAML client to process the screenshot image for OCR.
- **Details**:
  - Import the BAML client (`baml_client`).
  - Use `Image.fromBase64` to create an image object from the screenshot data.
  - Call the OCR function asynchronously and handle the response.
- **Purpose**: Extract text from the captured screenshot using BAML's AI capabilities.

### 8. Clean Up Project Structure

- **Action**: Remove unused files and assets from `src/renderer/src/assets` and other directories to keep the app minimal.
- **Purpose**: Streamline the project to focus solely on OCR functionality, adhering to the user's request for a minimal app.

### 9. Test the Application

- **Action**: Run the app using `bun run dev` to test the screenshot and OCR functionality.
- **Purpose**: Ensure that the integration works as expected, capturing screenshots and extracting text via BAML.

### 10. Document the Implementation

- **Action**: Create a markdown file `ai/docs/baml-electron-ocr-guide.md` with detailed instructions on setup, usage, and troubleshooting.
- **Content**: Include steps for installation, configuration, running the app, and how IPC and BAML work together for OCR.
- **Purpose**: Provide a user-friendly guide for future reference or for other developers.

## Integration Details

- **BAML OCR Function**: The BAML function will be designed to accept image data as base64, which aligns with Electron's screenshot output format.
- **Electron IPC**: Communication between main and renderer processes will use Electron's IPC mechanism to securely pass screenshot data.
- **Minimal UI**: The React frontend will be stripped to essentials—a button for screenshot capture and a text area for displaying OCR results.

## Potential Challenges

- **BAML Configuration**: Ensuring the `.baml` file correctly defines the OCR function for image processing.
- **Screenshot Permissions**: Electron's `desktopCapturer` may require user permissions or specific configurations on some operating systems (e.g., macOS).
- **Performance**: Processing large screenshots with BAML might introduce latency; consider optimizing image size if needed.

## Approval Request

Before proceeding with the implementation, I request user approval for this plan. Once approved, I will execute the steps starting with the installation of BAML using `bun add @boundaryml/baml`, followed by creating necessary files and configurations as outlined.

If there are any modifications or additional requirements, please provide feedback on this plan.
