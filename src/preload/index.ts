import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  requestScreenshot: () => electronAPI.ipcRenderer.invoke('request-screenshot'),
  extractTextFromImage: (imageData: string) =>
    electronAPI.ipcRenderer.invoke('extract-text-from-image', imageData),
  log: (message: string, level: string = 'info') =>
    electronAPI.ipcRenderer.send('log-message', { message, level })
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
