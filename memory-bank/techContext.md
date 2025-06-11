# Tech Context: Electron OCR with BAML

## Technologies Used

- **Electron**: Framework for building cross-platform desktop applications using web technologies.
- **Vite**: Build tool and development server for faster Electron app development and bundling.
- **TypeScript**: Programming language for type-safe JavaScript development, used across both main and renderer processes.
- **React**: JavaScript library for building user interfaces, used in the renderer process.
- **BAML**: Business Application Markup Language, used for defining OCR workflows and business logic.
- **Node.js**: Runtime environment for executing JavaScript on the server side, integral to Electron's main process.

## Development Setup

- **Project Structure**: The codebase is organized with separate directories for main process (`src/main`), renderer process (`src/renderer`), preload scripts (`src/preload`), and BAML scripts (`baml_src`).
- **Configuration Files**: Multiple configuration files for TypeScript (`tsconfig.json`, `tsconfig.node.json`, `tsconfig.web.json`), Electron with Vite (`electron.vite.config.ts`), and linting/formatting (`.editorconfig`, `.prettierrc.yaml`, `eslint.config.mjs`).
- **Package Management**: Using Bun for package management as indicated by `bun.lock`, alongside traditional `package.json`.
- **Environment Variables**: Managed via `.env` file for configuration settings.

## Technical Constraints

- **Electron Limitations**: Certain web APIs may not be fully supported or may behave differently in Electron compared to standard browsers, requiring specific workarounds or polyfills.
- **Performance**: OCR processing can be resource-intensive; the application must manage CPU and memory usage effectively, especially during image processing.
- **BAML Integration**: Ensuring BAML scripts are efficiently parsed and executed within the Electron environment, potentially requiring custom client code as seen in `baml_client/`.

## Dependencies

- **Electron and Related**: Core dependency for desktop app functionality, likely including plugins or modules for specific features like file handling.
- **React and React DOM**: For UI rendering in the renderer process.
- **TypeScript and Related Tools**: For type checking and compilation.
- **Vite Plugins**: For bundling and optimizing both main and renderer code.
- **OCR Engine**: Likely Tesseract.js or similar for actual OCR processing, to be confirmed and integrated with BAML scripts.

## Tool Usage Patterns

- **Bun**: Used for dependency installation and script execution, given the presence of `bun.lock`. Always use `bun` instead of `npm` for package management, `bunx` instead of `npx` for executing binaries, and `bun run` instead of `npm run` for running scripts to ensure consistency across the project.
- **Vite**: Leveraged for hot module replacement during development and efficient builds for production.
- **ESLint and Prettier**: For code linting and formatting to maintain consistency across the codebase.
- **TypeScript Compiler**: Ensures type safety, with separate configurations for Node.js and web environments to handle Electron's dual nature.
- **Git**: Version control system, with `.gitignore` managing which files are excluded from tracking.
