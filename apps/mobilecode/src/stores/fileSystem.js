import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useFileSystemStore = defineStore('fileSystem', () => {
  // State
  const files = ref([])
  const folders = ref([])
  const currentPath = ref('/')
  const selectedFileId = ref(null)

  // Initialize from localStorage
  const init = () => {
    try {
      const savedFiles = JSON.parse(localStorage.getItem('mobile-code-editor-files') || '[]')
      const savedFolders = JSON.parse(localStorage.getItem('mobile-code-editor-folders') || '[]')
      
      // Ensure root folder exists
      if (!savedFolders.find(f => f.path === '/')) {
        savedFolders.push({
          id: 'root',
          name: 'Root',
          path: '/',
          parentId: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }
      
      files.value = savedFiles
      folders.value = savedFolders
    } catch (e) {
      console.error('Error loading file system from storage', e)
      // Initialize with default root folder
      folders.value = [{
        id: 'root',
        name: 'Root',
        path: '/',
        parentId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]
      files.value = []
    }
  }

  // Save to localStorage
  const saveToStorage = () => {
    localStorage.setItem('mobile-code-editor-files', JSON.stringify(files.value))
    localStorage.setItem('mobile-code-editor-folders', JSON.stringify(folders.value))
  }

  // Get files in current path
  const currentFiles = computed(() => {
    return files.value.filter(file => file.path === currentPath.value)
  })

  // Get folders in current path
  const currentFolders = computed(() => {
    const parentPath = currentPath.value
    return folders.value.filter(folder => {
      // Don't show the root folder inside itself
      if (parentPath === '/' && folder.path === '/') return false
      
      // Get direct children of current path
      const folderParentPath = folder.path.substring(0, folder.path.lastIndexOf('/') + 1)
      return folderParentPath === parentPath && folder.path !== parentPath
    })
  })

  // Get selected file
  const selectedFile = computed(() => {
    if (!selectedFileId.value) return null
    return files.value.find(file => file.id === selectedFileId.value)
  })

  // Get parent folder path
  const parentPath = computed(() => {
    if (currentPath.value === '/') return null
    const parts = currentPath.value.split('/')
    parts.pop() // Remove last part
    return parts.join('/') || '/'
  })

  // Create a new file
  const createFile = (filename, content = '', language = 'javascript') => {
    const newFile = {
      id: Date.now().toString(),
      name: filename,
      path: currentPath.value,
      language,
      content,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    }
    
    // Check if file with same name exists
    const existingFileIndex = files.value.findIndex(
      f => f.name === filename && f.path === currentPath.value
    )
    
    if (existingFileIndex >= 0) {
      // Update existing file
      files.value[existingFileIndex] = {
        ...files.value[existingFileIndex],
        content,
        language,
        lastModified: new Date().toISOString()
      }
      selectedFileId.value = files.value[existingFileIndex].id
    } else {
      // Add new file
      files.value.push(newFile)
      selectedFileId.value = newFile.id
    }
    
    saveToStorage()
    return selectedFileId.value
  }

  // Delete a file
  const deleteFile = (fileId) => {
    const fileIndex = files.value.findIndex(f => f.id === fileId)
    if (fileIndex >= 0) {
      files.value.splice(fileIndex, 1)
      if (selectedFileId.value === fileId) {
        selectedFileId.value = null
      }
      saveToStorage()
      return true
    }
    return false
  }

  // Create a new folder
  const createFolder = (folderName) => {
    let path = currentPath.value
    if (path !== '/' && !path.endsWith('/')) {
      path += '/'
    }
    path += folderName + '/'
    
    // Check if folder already exists
    if (folders.value.some(f => f.path === path)) {
      return false
    }
    
    const newFolder = {
      id: Date.now().toString(),
      name: folderName,
      path,
      parentId: currentPath.value === '/' ? 'root' : folders.value.find(f => f.path === currentPath.value)?.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    folders.value.push(newFolder)
    saveToStorage()
    return true
  }

  // Delete a folder and its contents
  const deleteFolder = (folderId) => {
    const folderIndex = folders.value.findIndex(f => f.id === folderId)
    if (folderIndex >= 0) {
      const folderPath = folders.value[folderIndex].path
      
      // Can't delete root folder
      if (folderPath === '/') return false
      
      // Delete folder
      folders.value.splice(folderIndex, 1)
      
      // Delete all subfolders
      folders.value = folders.value.filter(f => !f.path.startsWith(folderPath))
      
      // Delete all files in folder and subfolders
      files.value = files.value.filter(f => !f.path.startsWith(folderPath))
      
      // If we're in the deleted folder, go to parent
      if (currentPath.value.startsWith(folderPath)) {
        navigateToPath(parentPath.value)
      }
      
      // Unselect file if it was in deleted folder
      if (selectedFile.value && selectedFile.value.path.startsWith(folderPath)) {
        selectedFileId.value = null
      }
      
      saveToStorage()
      return true
    }
    return false
  }

  // Navigate to a folder path
  const navigateToPath = (path) => {
    // Ensure path exists
    if (path === '/' || folders.value.some(f => f.path === path)) {
      currentPath.value = path
      return true
    }
    return false
  }

  // Navigate up to parent folder
  const navigateToParent = () => {
    if (parentPath.value) {
      currentPath.value = parentPath.value
      return true
    }
    return false
  }

  // Select a file
  const selectFile = (fileId) => {
    selectedFileId.value = fileId
  }

  // Update a file's content
  const updateFileContent = (fileId, content) => {
    const file = files.value.find(f => f.id === fileId)
    if (file) {
      file.content = content
      file.lastModified = new Date().toISOString()
      saveToStorage()
      return true
    }
    return false
  }

  // Rename a file
  const renameFile = (fileId, newName) => {
    const file = files.value.find(f => f.id === fileId)
    if (file) {
      // Check if a file with the same name exists in this path
      if (files.value.some(f => f.name === newName && f.path === file.path && f.id !== fileId)) {
        return false
      }
      
      file.name = newName
      file.lastModified = new Date().toISOString()
      
      // Update language based on extension
      const extension = newName.split('.').pop().toLowerCase()
      if (extension === 'js') file.language = 'javascript'
      else if (extension === 'html') file.language = 'html'
      else if (extension === 'css') file.language = 'css'
      else if (extension === 'py') file.language = 'python'
      
      saveToStorage()
      return true
    }
    return false
  }

  // Move a file to a new path
  const moveFile = (fileId, newPath) => {
    const file = files.value.find(f => f.id === fileId)
    if (file && folders.value.some(f => f.path === newPath)) {
      // Check if a file with the same name exists in the destination
      if (files.value.some(f => f.name === file.name && f.path === newPath)) {
        return false
      }
      
      file.path = newPath
      file.lastModified = new Date().toISOString()
      saveToStorage()
      return true
    }
    return false
  }

  // Rename a folder
  const renameFolder = (folderId, newName) => {
    const folder = folders.value.find(f => f.id === folderId)
    if (folder) {
      // Can't rename root
      if (folder.path === '/') return false
      
      const oldPath = folder.path
      const parentPath = oldPath.substring(0, oldPath.lastIndexOf('/', oldPath.length - 2) + 1)
      const newPath = parentPath + newName + '/'
      
      // Check if a folder with the same name exists at this level
      if (folders.value.some(f => f.path === newPath)) {
        return false
      }
      
      // Update folder path
      folder.path = newPath
      folder.name = newName
      folder.updatedAt = new Date().toISOString()
      
      // Update paths of all subfolders
      folders.value.forEach(f => {
        if (f.path !== oldPath && f.path.startsWith(oldPath)) {
          f.path = newPath + f.path.substring(oldPath.length)
          f.updatedAt = new Date().toISOString()
        }
      })
      
      // Update paths of all files in this folder and subfolders
      files.value.forEach(f => {
        if (f.path.startsWith(oldPath)) {
          f.path = newPath + f.path.substring(oldPath.length)
          f.lastModified = new Date().toISOString()
        }
      })
      
      // Update current path if we're in the renamed folder
      if (currentPath.value === oldPath) {
        currentPath.value = newPath
      } else if (currentPath.value.startsWith(oldPath)) {
        currentPath.value = newPath + currentPath.value.substring(oldPath.length)
      }
      
      saveToStorage()
      return true
    }
    return false
  }

  // Get breadcrumb navigation
  const breadcrumbs = computed(() => {
    if (currentPath.value === '/') {
      return [{ name: 'Root', path: '/' }]
    }
    
    const parts = currentPath.value.split('/').filter(Boolean)
    const crumbs = [{ name: 'Root', path: '/' }]
    
    let currentPathBuild = '/'
    parts.forEach(part => {
      currentPathBuild += part + '/'
      crumbs.push({
        name: part,
        path: currentPathBuild
      })
    })
    
    return crumbs
  })

  // Export all functions
  return {
    files,
    folders,
    currentPath,
    selectedFileId,
    currentFiles,
    currentFolders,
    selectedFile,
    parentPath,
    breadcrumbs,
    init,
    createFile,
    deleteFile,
    createFolder,
    deleteFolder,
    navigateToPath,
    navigateToParent,
    selectFile,
    updateFileContent,
    renameFile,
    moveFile,
    renameFolder
  }
})