import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCodeRunnerStore = defineStore('codeRunner', () => {
  // State
  const isRunning = ref(false)
  const output = ref([])
  const errors = ref([])
  const hasError = ref(false)
  const pythonLoaded = ref(false)
  let pyodideInstance = null

  // Clear output and errors
  const clearOutput = () => {
    output.value = []
    errors.value = []
    hasError.value = false
  }

  // Add output entry
  const addOutput = (text, type = 'log') => {
    output.value.push({
      id: Date.now().toString(),
      text,
      type,
      timestamp: new Date().toISOString()
    })
  }

  // Add error entry
  const addError = (text, line = null, col = null) => {
    hasError.value = true
    errors.value.push({
      id: Date.now().toString(),
      text,
      line,
      col,
      timestamp: new Date().toISOString()
    })
  }

  // Run JavaScript code
  const runJavaScript = async (code) => {
    clearOutput()
    isRunning.value = true
    
    try {
      // Create a sandbox for running the code
      const originalConsole = window.console
      
      // Override console methods
      window.console = {
        log: (...args) => {
          const text = args.map(arg => {
            if (typeof arg === 'object') {
              try {
                return JSON.stringify(arg)
              } catch (e) {
                return String(arg)
              }
            }
            return String(arg)
          }).join(' ')
          
          addOutput(text, 'log')
          originalConsole.log(...args)
        },
        error: (...args) => {
          const text = args.map(arg => String(arg)).join(' ')
          addOutput(text, 'error')
          originalConsole.error(...args)
        },
        warn: (...args) => {
          const text = args.map(arg => String(arg)).join(' ')
          addOutput(text, 'warn')
          originalConsole.warn(...args)
        },
        info: (...args) => {
          const text = args.map(arg => String(arg)).join(' ')
          addOutput(text, 'info')
          originalConsole.info(...args)
        }
      }
      
      // Execute the code
      const wrappedCode = `
        try {
          ${code}
        } catch (error) {
          console.error("Runtime error:", error.message);
          throw error;
        }
      `
      
      // Execute in async context to handle promises
      const asyncFunction = new Function(`return (async () => { ${wrappedCode} })()`)
      await asyncFunction()
      
      // Restore original console
      window.console = originalConsole
    } catch (error) {
      // Parse line/column information from error
      const lineMatch = error.stack?.match(/\\d+:\\d+/)
      let line = null
      let col = null
      
      if (lineMatch) {
        const [lineStr, colStr] = lineMatch[0].split(':')
        line = parseInt(lineStr, 10)
        col = parseInt(colStr, 10)
      }
      
      addError(`${error.name}: ${error.message}`, line, col)
      console.error('Error running JavaScript:', error)
    } finally {
      isRunning.value = false
    }
    
    return {
      success: !hasError.value,
      output: output.value,
      errors: errors.value
    }
  }

  // Lint JavaScript code
  const lintJavaScript = (code) => {
    clearOutput()
    
    try {
      // Simple syntax check using Function constructor
      new Function(code)
      return { valid: true, errors: [] }
    } catch (error) {
      // Parse line/column information
      const lineMatch = error.stack?.match(/\\d+:\\d+/)
      let line = null
      let col = null
      
      if (lineMatch) {
        const [lineStr, colStr] = lineMatch[0].split(':')
        line = parseInt(lineStr, 10)
        col = parseInt(colStr, 10)
      }
      
      return {
        valid: false,
        errors: [{
          message: error.message,
          line,
          col
        }]
      }
    }
  }

  // Initialize Python runtime
  const initPython = async () => {
    if (pythonLoaded.value && pyodideInstance) {
      return true
    }
    
    isRunning.value = true
    
    try {
      // Load Pyodide using a CDN path instead of the bundled module
      const { loadPyodide } = await import('https://cdn.jsdelivr.net/pyodide/v0.27.3/full/pyodide.mjs')
      pyodideInstance = await loadPyodide()
      
      // Setup console redirection in Python
      await pyodideInstance.runPythonAsync(`
        import sys
        from js import console

        class PyConsole:
            def write(self, text):
                console.log(text.strip())
            def flush(self):
                pass

        sys.stdout = PyConsole()
        sys.stderr = PyConsole()
      `)
      
      pythonLoaded.value = true
      return true
    } catch (error) {
      console.error('Error initializing Python:', error)
      addError(`Failed to initialize Python: ${error.message}`)
      return false
    } finally {
      isRunning.value = false
    }
  }

  // Run Python code
  const runPython = async (code) => {
    clearOutput()
    isRunning.value = true
    
    // Initialize Python if not already loaded
    if (!pythonLoaded.value) {
      const initialized = await initPython()
      if (!initialized) {
        isRunning.value = false
        return {
          success: false,
          output: output.value,
          errors: [{ message: 'Failed to initialize Python runtime' }]
        }
      }
    }
    
    try {
      // Create a sandbox for running the code
      const originalConsole = window.console
      
      // Override console methods to capture output
      window.console = {
        log: (...args) => {
          const text = args.map(arg => String(arg)).join(' ')
          addOutput(text, 'log')
          originalConsole.log(...args)
        },
        error: (...args) => {
          const text = args.map(arg => String(arg)).join(' ')
          addOutput(text, 'error')
          originalConsole.error(...args)
        }
      }
      
      // Run the Python code
      await pyodideInstance.runPythonAsync(code)
      
      // Restore original console
      window.console = originalConsole
    } catch (error) {
      // Parse Python error
      let errorMessage = error.message
      let line = null
      let col = null
      
      // Extract line number from Python traceback
      const lineMatch = errorMessage.match(/line (\\d+)/)
      if (lineMatch) {
        line = parseInt(lineMatch[1], 10)
      }
      
      addError(errorMessage, line, col)
      console.error('Error running Python:', error)
    } finally {
      isRunning.value = false
    }
    
    return {
      success: !hasError.value,
      output: output.value,
      errors: errors.value
    }
  }

  // Run code based on language
  const runCode = async (code, language) => {
    if (language === 'javascript') {
      return runJavaScript(code)
    } else if (language === 'python') {
      return runPython(code)
    } else {
      return {
        success: false,
        output: [],
        errors: [{ message: `Running ${language} code is not supported` }]
      }
    }
  }

  // Lint code based on language
  const lintCode = (code, language) => {
    if (language === 'javascript') {
      return lintJavaScript(code)
    } else {
      // For other languages, just return valid since we don't have linters for them
      return { valid: true, errors: [] }
    }
  }

  return {
    isRunning,
    output,
    errors,
    hasError,
    pythonLoaded,
    clearOutput,
    addOutput,
    addError,
    runJavaScript,
    lintJavaScript,
    initPython,
    runPython,
    runCode,
    lintCode
  }
})