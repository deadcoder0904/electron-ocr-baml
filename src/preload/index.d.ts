import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      requestScreenshot: () => Promise<string>
      extractTextFromImage: (imageData: string) => Promise<string>
    }
  }
}
