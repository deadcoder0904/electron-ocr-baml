import log from 'electron-log/renderer'
import { useState } from 'react'

// Define the expected type for the extracted text response
interface ExtractedText {
  quote: string
  author: string
}

function App(): React.JSX.Element {
  const [extractedText, setExtractedText] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [screenshotData, setScreenshotData] = useState<string | null>(null)

  const handleScreenshot = async (): Promise<void> => {
    setIsLoading(true)
    setError(null)
    log.info('Starting screenshot process in renderer')
    try {
      // Request screenshot from main process
      log.info('Requesting screenshot from main process')
      const screenshot = await window.api.requestScreenshot()
      if (screenshot) {
        log.info('Screenshot received, updating UI')
        setScreenshotData(screenshot)
        // Request text extraction from main process via IPC
        try {
          log.info('Requesting text extraction from screenshot')
          const result = await window.api.extractTextFromImage(screenshot)
          log.info('Text extraction completed, updating UI')
          // Check if result matches the expected type
          if (result && typeof result === 'object' && 'quote' in result && 'author' in result) {
            const extracted = result as ExtractedText
            setExtractedText(`${extracted.quote} - ${extracted.author}`)
          } else {
            setExtractedText(JSON.stringify(result))
          }
        } catch (bamlError) {
          log.error(`Text extraction error: ${(bamlError as Error).message || String(bamlError)}`)
          setError(`Text extraction error: ${(bamlError as Error).message || String(bamlError)}`)
        }
      } else {
        log.error('Failed to capture screenshot')
        setError('Failed to capture screenshot')
      }
    } catch (err: unknown) {
      log.error(`Error capturing screenshot: ${(err as Error).message || String(err)}`)
      setError(`Error capturing screenshot: ${(err as Error).message || String(err)}`)
    } finally {
      log.info('Screenshot process completed, updating loading state')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 text-gray-100 font-sans antialiased">
      {/* Header */}
      <header className="p-3 border-b border-gray-700 shadow-sm">
        <h1 className="text-indigo-400 text-3xl font-extrabold tracking-wide text-center">
          Electron OCR with BAML
        </h1>
        <p className="text-gray-400 text-sm mt-1 text-center">
          Capture screenshots and extract text effortlessly.
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center p-3 overflow-y-auto">
        <button
          type="button"
          onClick={handleScreenshot}
          disabled={isLoading}
          className={`px-6 py-3 text-xl font-semibold bg-indigo-500 text-white border-none rounded-lg shadow-md ${isLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-indigo-600 hover:shadow-lg'} transition-all duration-300 mb-6`}
        >
          {isLoading ? 'Capturing...' : 'Take Screenshot & Extract Quote'}
        </button>

        {error && (
          <div className="w-full max-w-3xl mb-6 pt-4">
            <p className="text-red-400 text-base font-medium bg-red-900 bg-opacity-30 px-4 py-2 rounded-lg text-center">
              {error}
            </p>
          </div>
        )}

        <div className="w-full max-w-3xl flex flex-col gap-3 pt-4">
          {screenshotData && (
            <div className="w-full h-[400px] overflow-hidden border border-gray-700 rounded-2xl bg-gray-800 bg-opacity-80 shadow-lg">
              <h3 className="text-indigo-400 text-xl text-center font-black mb-3 p-3 pb-0">
                Screenshot Preview:
              </h3>
              <div className="w-full h-[340px] overflow-auto p-3 pt-0">
                <img
                  src={screenshotData}
                  alt="Screenshot Preview"
                  className="w-full h-auto block object-contain rounded-xl shadow-sm border border-gray-700 max-h-[320px]"
                />
              </div>
            </div>
          )}

          {extractedText && (
            <div className="max-h-[300px] overflow-y-auto w-full bg-gray-800 bg-opacity-80 p-3 rounded-2xl text-gray-200 border border-gray-700 shadow-lg">
              <h3 className="text-indigo-400 text-xl font-bold mb-2">Extracted Text:</h3>
              <p className="whitespace-pre-wrap leading-relaxed text-base text-gray-300">
                {extractedText}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-2 text-center text-gray-500 text-sm border-t border-gray-700">
        Powered by Electron & BAML
      </footer>
    </div>
  )
}

export default App
