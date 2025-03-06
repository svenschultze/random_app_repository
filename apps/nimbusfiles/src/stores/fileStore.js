import { ref, computed } from 'vue'

// Generate random file sizes between 10KB and 100MB
const randomFileSize = () => {
  const sizes = [
    '10 KB', '25 KB', '64 KB', '128 KB', 
    '256 KB', '512 KB', '1 MB', '2.5 MB', 
    '5 MB', '10 MB', '25 MB', '50 MB', '100 MB'
  ]
  return sizes[Math.floor(Math.random() * sizes.length)]
}

// Generate random dates within the last 30 days
const randomDate = () => {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * 30))
  return date.toISOString()
}

// Generate a UUID for file IDs
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// Document file types with icons
const fileTypes = {
  'doc': { icon: '📄', label: 'Document', preview: true },
  'pdf': { icon: '📑', label: 'PDF', preview: true },
  'jpg': { icon: '🖼️', label: 'Image', preview: true },
  'png': { icon: '🖼️', label: 'Image', preview: true },
  'mp4': { icon: '🎬', label: 'Video', preview: false },
  'mp3': { icon: '🎵', label: 'Audio', preview: false },
  'zip': { icon: '📦', label: 'Archive', preview: false },
  'xls': { icon: '📊', label: 'Spreadsheet', preview: true },
  'ppt': { icon: '📽️', label: 'Presentation', preview: true },
  'txt': { icon: '📝', label: 'Text', preview: true },
  'folder': { icon: '📁', label: 'Folder', preview: false }
}

// Generate a random file type
const randomFileType = () => {
  const types = Object.keys(fileTypes).filter(type => type !== 'folder')
  return types[Math.floor(Math.random() * types.length)]
}

// Sample file names for each type
const sampleFileNames = {
  'doc': ['Project Plan', 'Meeting Notes', 'Report', 'Contract', 'Agreement', 'Proposal'],
  'pdf': ['User Manual', 'Invoice', 'Statement', 'Research Paper', 'Whitepaper', 'Resume'],
  'jpg': ['Photo', 'Screenshot', 'Image', 'Banner', 'Wallpaper', 'Profile Picture'],
  'png': ['Logo', 'Icon', 'Graphic', 'Diagram', 'Chart', 'Infographic'],
  'mp4': ['Presentation', 'Tutorial', 'Demo', 'Review', 'Webinar', 'Interview'],
  'mp3': ['Podcast', 'Song', 'Recording', 'Audio Note', 'Meeting Recording', 'Interview'],
  'zip': ['Backup', 'Archive', 'Resources', 'Assets', 'Project Files', 'Scripts'],
  'xls': ['Budget', 'Metrics', 'Data Analysis', 'Financial Report', 'Inventory', 'Schedule'],
  'ppt': ['Presentation', 'Pitch Deck', 'Sales Deck', 'Training', 'Workshop', 'Overview'],
  'txt': ['Notes', 'List', 'Changelog', 'Instructions', 'Log', 'README']
}

// Generate a random file name based on type
const randomFileName = (type) => {
  if (!sampleFileNames[type]) return 'Untitled'
  const names = sampleFileNames[type]
  const name = names[Math.floor(Math.random() * names.length)]
  const randomNum = Math.floor(Math.random() * 100)
  return `${name} ${randomNum}.${type}`
}

// Generate a folder name
const randomFolderName = () => {
  const folders = ['Projects', 'Personal', 'Work', 'Photos', 'Documents', 'Videos', 
                   'Music', 'Downloads', 'Archive', 'Temp', 'Backups', 'Clients']
  return folders[Math.floor(Math.random() * folders.length)]
}

// Generate random file data
const generateRandomFiles = (count, parent = null) => {
  const files = []
  for (let i = 0; i < count; i++) {
    const isFolder = Math.random() > 0.8
    const type = isFolder ? 'folder' : randomFileType()
    const name = isFolder ? randomFolderName() : randomFileName(type)
    
    const file = {
      id: generateUUID(),
      name,
      type,
      isFolder,
      size: isFolder ? '--' : randomFileSize(),
      dateModified: randomDate(),
      shared: Math.random() > 0.8,
      starred: Math.random() > 0.9,
      parentId: parent,
      path: parent ? `/${parent}/${name}` : `/${name}`
    }
    
    files.push(file)
  }
  return files
}

// Create file store with simulated files
export function useFileStore() {
  // All files in the system
  const files = ref([
    // Root folders
    ...generateRandomFiles(5, null).filter(f => f.isFolder),
    // Files in root
    ...generateRandomFiles(15, null).filter(f => !f.isFolder)
  ])
  
  // Add files to each root folder
  files.value.forEach(folder => {
    if (folder.isFolder) {
      files.value.push(...generateRandomFiles(Math.floor(Math.random() * 10) + 5, folder.id))
    }
  })
  
  // Currently selected file
  const selectedFile = ref(null)
  
  // Files in current view
  const currentPath = ref(null)
  
  // Files in the trash
  const trashedFiles = ref([])
  
  // Get files based on the current path
  const currentFiles = computed(() => {
    if (!currentPath.value) {
      return files.value.filter(file => !file.parentId)
    }
    return files.value.filter(file => file.parentId === currentPath.value)
  })
  
  // Get shared files
  const sharedFiles = computed(() => {
    return files.value.filter(file => file.shared)
  })
  
  // Find file by ID
  const getFileById = (id) => {
    return files.value.find(file => file.id === id)
  }
  
  // Navigate to a folder
  const navigateToFolder = (folderId) => {
    currentPath.value = folderId
  }
  
  // Navigate up one level
  const navigateUp = () => {
    if (!currentPath.value) return
    
    const currentFolder = getFileById(currentPath.value)
    if (!currentFolder) {
      currentPath.value = null
      return
    }
    
    currentPath.value = currentFolder.parentId
  }
  
  // Get full path to a file or folder
  const getPath = (fileId) => {
    const paths = []
    let current = getFileById(fileId)
    
    while (current) {
      paths.unshift(current.name)
      if (!current.parentId) break
      current = getFileById(current.parentId)
    }
    
    return paths.join(' / ')
  }
  
  // Select a file
  const selectFile = (fileId) => {
    selectedFile.value = getFileById(fileId)
  }
  
  // Simulate file operations with delay
  const simulateOperation = (callback, delay = 1000) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const result = callback()
        resolve(result)
      }, delay)
    })
  }
  
  // Delete a file
  const deleteFile = (fileId) => {
    return simulateOperation(() => {
      const fileIndex = files.value.findIndex(file => file.id === fileId)
      if (fileIndex === -1) return false
      
      const file = files.value[fileIndex]
      trashedFiles.value.push(file)
      files.value.splice(fileIndex, 1)
      
      if (selectedFile.value && selectedFile.value.id === fileId) {
        selectedFile.value = null
      }
      
      return true
    })
  }
  
  // Rename a file
  const renameFile = (fileId, newName) => {
    return simulateOperation(() => {
      const file = getFileById(fileId)
      if (!file) return false
      
      file.name = newName
      return true
    })
  }
  
  // Share a file
  const shareFile = (fileId) => {
    return simulateOperation(() => {
      const file = getFileById(fileId)
      if (!file) return false
      
      file.shared = true
      return {
        link: `https://nimbus-files.example.com/share/${fileId}`,
        expiresIn: '7 days'
      }
    })
  }
  
  // Upload a new file
  const uploadFile = (fileName, fileType, folderPath = null) => {
    return simulateOperation(() => {
      const newFile = {
        id: generateUUID(),
        name: fileName,
        type: fileType,
        isFolder: false,
        size: randomFileSize(),
        dateModified: new Date().toISOString(),
        shared: false,
        starred: false,
        parentId: folderPath,
        path: folderPath ? `/${folderPath}/${fileName}` : `/${fileName}`
      }
      
      files.value.push(newFile)
      return newFile
    }, 2000) // Simulate longer upload time
  }
  
  // Create a new folder
  const createFolder = (folderName, parentId = null) => {
    return simulateOperation(() => {
      const newFolder = {
        id: generateUUID(),
        name: folderName,
        type: 'folder',
        isFolder: true,
        size: '--',
        dateModified: new Date().toISOString(),
        shared: false,
        starred: false,
        parentId: parentId,
        path: parentId ? `/${parentId}/${folderName}` : `/${folderName}`
      }
      
      files.value.push(newFolder)
      return newFolder
    })
  }
  
  // Restore a file from trash
  const restoreFile = (fileId) => {
    return simulateOperation(() => {
      const fileIndex = trashedFiles.value.findIndex(file => file.id === fileId)
      if (fileIndex === -1) return false
      
      const file = trashedFiles.value[fileIndex]
      files.value.push(file)
      trashedFiles.value.splice(fileIndex, 1)
      
      return true
    })
  }
  
  // Get file icon based on type
  const getFileIcon = (fileType) => {
    return fileTypes[fileType]?.icon || '📄'
  }
  
  // Check if file type supports preview
  const supportsPreviewing = (fileType) => {
    return fileTypes[fileType]?.preview || false
  }
  
  return {
    files,
    currentFiles,
    sharedFiles,
    trashedFiles,
    selectedFile,
    currentPath,
    selectFile,
    navigateToFolder,
    navigateUp,
    getPath,
    getFileById,
    deleteFile,
    renameFile,
    shareFile,
    uploadFile,
    createFolder,
    restoreFile,
    getFileIcon,
    supportsPreviewing
  }
}

// Create a singleton instance of the file store and unwrap the object's values
const storeInstance = useFileStore();

// Export an object with unwrapped values 
const fileStore = {
  // Properties
  get files() { return storeInstance.files.value; },
  get currentFiles() { return storeInstance.currentFiles.value; },
  get sharedFiles() { return storeInstance.sharedFiles.value; },
  get trashedFiles() { return storeInstance.trashedFiles.value; },
  get selectedFile() { return storeInstance.selectedFile.value; },
  get currentPath() { return storeInstance.currentPath; },

  // Methods
  selectFile: storeInstance.selectFile,
  navigateToFolder: storeInstance.navigateToFolder,
  navigateUp: storeInstance.navigateUp,
  getPath: storeInstance.getPath,
  getFileById: storeInstance.getFileById,
  deleteFile: storeInstance.deleteFile,
  renameFile: storeInstance.renameFile,
  shareFile: storeInstance.shareFile,
  uploadFile: storeInstance.uploadFile,
  createFolder: storeInstance.createFolder,
  restoreFile: storeInstance.restoreFile,
  getFileIcon: storeInstance.getFileIcon,
  supportsPreviewing: storeInstance.supportsPreviewing
};

export default fileStore;