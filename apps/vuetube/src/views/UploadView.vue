<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { uploadVideo, currentUser } from '../stores/videoStore'

const router = useRouter()
const isUploading = ref(false)
const uploadProgress = ref(0)
const uploadSuccess = ref(false)
const uploadError = ref('')

const videoFile = ref(null)
const thumbnailFile = ref(null)
const thumbnailPreview = ref('')

const videoForm = reactive({
  title: '',
  description: '',
  tags: '',
  category: 'entertainment'
})

const categories = [
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'music', label: 'Music' },
  { value: 'education', label: 'Education' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'technology', label: 'Technology' },
  { value: 'sports', label: 'Sports' },
  { value: 'travel', label: 'Travel & Events' },
  { value: 'news', label: 'News & Politics' }
]

const handleVideoFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    videoFile.value = file
  }
}

const handleThumbnailFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    thumbnailFile.value = file
    
    // Create a preview of the thumbnail
    const reader = new FileReader()
    reader.onload = (e) => {
      thumbnailPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleSubmit = async () => {
  if (!videoFile.value) {
    uploadError.value = 'Please select a video file to upload'
    return
  }
  
  if (!videoForm.title.trim()) {
    uploadError.value = 'Please enter a title for your video'
    return
  }
  
  uploadError.value = ''
  isUploading.value = true
  uploadProgress.value = 0
  
  // Simulate upload progress
  const progressInterval = setInterval(() => {
    uploadProgress.value += Math.random() * 10
    if (uploadProgress.value >= 100) {
      uploadProgress.value = 100
      clearInterval(progressInterval)
      
      // Process the video data
      const tagsArray = videoForm.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
      
      // In a real app, we would upload the files to a server
      // For this demo, we'll just add the video to our mock data
      const videoData = {
        title: videoForm.title,
        description: videoForm.description,
        tags: tagsArray,
        category: videoForm.category,
        // In a real app, these URLs would be generated after upload
        thumbnailUrl: thumbnailPreview.value || `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/640/360`,
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        duration: '00:30' // Mock duration
      }
      
      try {
        const newVideo = uploadVideo(videoData, currentUser.id)
        uploadSuccess.value = true
        
        // Reset form after successful upload
        setTimeout(() => {
          // Navigate to the new video
          router.push(`/watch/${newVideo.id}`)
        }, 2000)
      } catch (error) {
        uploadError.value = 'An error occurred while processing your video'
        isUploading.value = false
      }
    }
  }, 200)
}
</script>

<template>
  <div class="upload-container">
    <h1 class="upload-header">Upload Video</h1>
    
    <div v-if="!isUploading && !uploadSuccess" class="upload-form-container">
      <form @submit.prevent="handleSubmit" class="upload-form">
        <div class="form-group file-upload-group">
          <div class="file-upload-section">
            <label for="video-file" class="file-label">
              <div class="file-drop-area" :class="{ 'has-file': videoFile }">
                <svg v-if="!videoFile" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 0 24 24" width="48" class="upload-icon">
                  <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/>
                </svg>
                <span v-if="!videoFile" class="file-instructions">
                  Drag and drop a video file or click to select
                </span>
                <span v-else class="file-name">
                  Selected: {{ videoFile.name }}
                </span>
              </div>
            </label>
            <input 
              type="file" 
              id="video-file" 
              accept="video/*" 
              @change="handleVideoFileChange" 
              class="file-input"
              v-voix="'VideoFileInput'"
              hint="Select a video file to upload"
            />
          </div>
          
          <div class="thumbnail-section">
            <label for="thumbnail-file" class="file-label">
              <div class="thumbnail-preview" :class="{ 'has-thumbnail': thumbnailPreview }">
                <img v-if="thumbnailPreview" :src="thumbnailPreview" alt="Thumbnail preview" class="thumbnail-img" />
                <div v-else class="thumbnail-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                  <span>Add thumbnail</span>
                </div>
              </div>
            </label>
            <input 
              type="file" 
              id="thumbnail-file" 
              accept="image/*" 
              @change="handleThumbnailFileChange" 
              class="file-input"
              v-voix="'ThumbnailFileInput'"
              hint="Select a thumbnail image for your video"
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="title" class="form-label">Title (required)</label>
          <input 
            type="text" 
            id="title" 
            v-model="videoForm.title" 
            placeholder="Add a title that describes your video" 
            class="form-input"
            required
            v-voix="'VideoTitleInput'"
            hint="Enter a title for your video"
          />
        </div>
        
        <div class="form-group">
          <label for="description" class="form-label">Description</label>
          <textarea 
            id="description" 
            v-model="videoForm.description" 
            placeholder="Tell viewers about your video" 
            class="form-textarea"
            rows="4"
            v-voix="'VideoDescriptionInput'"
            hint="Describe your video content"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label for="tags" class="form-label">Tags (comma separated)</label>
          <input 
            type="text" 
            id="tags" 
            v-model="videoForm.tags" 
            placeholder="gaming, tutorial, vlog" 
            class="form-input"
            v-voix="'VideoTagsInput'"
            hint="Add tags for your video separated by commas"
          />
        </div>
        
        <div class="form-group">
          <label for="category" class="form-label">Category</label>
          <select 
            id="category" 
            v-model="videoForm.category" 
            class="form-select"
            v-voix="'VideoCategorySelect'"
            hint="Select a category for your video"
          >
            <option 
              v-for="category in categories" 
              :key="category.value" 
              :value="category.value"
            >
              {{ category.label }}
            </option>
          </select>
        </div>
        
        <div v-if="uploadError" class="error-message">
          {{ uploadError }}
        </div>
        
        <div class="form-actions">
          <button 
            type="submit" 
            class="upload-button"
            v-voix="'UploadSubmitButton'"
            hint="Submit video for upload"
          >
            Upload Video
          </button>
        </div>
      </form>
    </div>
    
    <div v-else-if="isUploading" class="upload-progress-container">
      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: `${uploadProgress}%` }"></div>
      </div>
      <p class="progress-text">Uploading... {{ Math.floor(uploadProgress) }}%</p>
      <p class="progress-info">Please do not close this page while your video is uploading</p>
    </div>
    
    <div v-else-if="uploadSuccess" class="upload-success-container">
      <svg xmlns="http://www.w3.org/2000/svg" height="64" viewBox="0 0 24 24" width="64" class="success-icon">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#4CAF50"/>
      </svg>
      <h2>Upload Complete!</h2>
      <p>Your video has been uploaded successfully and is now being processed.</p>
      <p>You will be redirected to your video page shortly...</p>
    </div>
  </div>
</template>

<style scoped>
.upload-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;
}

.upload-header {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 2rem;
  color: #0f0f0f;
}

.upload-form-container {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #0f0f0f;
}

.form-input, .form-textarea, .form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #0f0f0f;
  transition: border-color 0.3s;
}

.form-input:focus, .form-textarea:focus, .form-select:focus {
  border-color: #065fd4;
  outline: none;
}

.file-upload-group {
  display: flex;
  gap: 1.5rem;
}

.file-upload-section {
  flex: 2;
}

.thumbnail-section {
  flex: 1;
}

.file-label {
  display: block;
  cursor: pointer;
}

.file-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.file-drop-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  transition: background-color 0.3s, border-color 0.3s;
}

.file-drop-area:hover {
  background-color: #f8f8f8;
  border-color: #d0d0d0;
}

.file-drop-area.has-file {
  border-color: #065fd4;
  background-color: rgba(6, 95, 212, 0.05);
}

.upload-icon {
  color: #606060;
  margin-bottom: 1rem;
}

.file-instructions {
  font-size: 0.9rem;
  color: #606060;
  text-align: center;
}

.file-name {
  font-size: 0.9rem;
  color: #065fd4;
  text-align: center;
  word-break: break-word;
}

.thumbnail-preview {
  width: 100%;
  height: 200px;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.3s;
}

.thumbnail-preview:hover {
  border-color: #d0d0d0;
}

.thumbnail-preview.has-thumbnail {
  border-style: solid;
  border-color: #065fd4;
}

.thumbnail-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #606060;
  font-size: 0.9rem;
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.error-message {
  color: #cc0000;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.upload-button {
  background-color: #065fd4;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 2px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.upload-button:hover {
  background-color: #0356c3;
}

.upload-progress-container, .upload-success-container {
  text-align: center;
  padding: 3rem 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.progress-bar-container {
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress-bar {
  height: 100%;
  background-color: #065fd4;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.progress-info {
  font-size: 0.9rem;
  color: #606060;
}

.success-icon {
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .upload-form-container {
    padding: 1.5rem;
  }
  
  .file-upload-group {
    flex-direction: column;
  }
  
  .file-drop-area, .thumbnail-preview {
    height: 150px;
  }
}
</style>