import { app, shell, BrowserWindow, ipcMain, desktopCapturer } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { b } from '../../baml_client/async_client.js'
import { Image } from '@boundaryml/baml'
import dotenv from 'dotenv'
import log from 'electron-log'

// Initialize the logger for renderer processes
log.initialize()

// Load environment variables from .env file
dotenv.config()

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  global.mainWindow = mainWindow // Store reference globally for use in IPC handlers

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC for screenshot
  ipcMain.handle('request-screenshot', async () => {
    try {
      log.info('Starting screenshot capture process')
      // Hide only the main app window before taking the screenshot
      if (global.mainWindow) {
        global.mainWindow.hide()
        log.info('Main window hidden')
        // Add a small delay to ensure the window is hidden before capturing
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      log.info('Capturing screenshot')
      const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: { width: 3840, height: 2160 }
      })
      if (sources.length > 0) {
        const screenshot = sources[0].thumbnail.toDataURL()
        log.info('Screenshot captured successfully')
        // Show the main app window after taking the screenshot
        if (global.mainWindow) {
          global.mainWindow.show()
          log.info('Main window shown')
          // Add a small delay to ensure the window is shown and rendered
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
        return screenshot
      } else {
        // Show the main app window even if no sources are available
        if (global.mainWindow) {
          global.mainWindow.show()
          log.info('Main window shown (no sources available)')
        }
        throw new Error('No screen sources available')
      }
    } catch (error) {
      // Ensure the main app window is shown even if an error occurs
      if (global.mainWindow) {
        global.mainWindow.show()
        log.info('Main window shown (error occurred)')
      }
      log.error('Error capturing screenshot:', error)
      console.error('Error capturing screenshot:', error)
      throw error
    }
  })

  // IPC for text extraction using BAML
  ipcMain.handle('extract-text-from-image', async (_, imageData: string) => {
    try {
      // Extract only the base64 part from data URL if it exists
      const base64Data = imageData.split(',')[1] || imageData
      const image = Image.fromBase64('image/png', base64Data)
      const result = await b.ExtractTextFromImage(image)
      return result
    } catch (error) {
      console.error('Error extracting text with BAML:', error)
      throw error
    }
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
