<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { 
  getVideoById, 
  getChannelById, 
  getUserById,
  formatViewCount, 
  formatUploadDate,
  currentUser,
  likeVideo,
  addComment
} from '../stores/videoStore'

const route = useRoute()
const video = ref(null)
const channel = ref(null)
const newComment = ref('')
const isDescriptionExpanded = ref(false)

// Video player refs
const videoElement = ref(null)
const isPlaying = ref(false)
const isFirstPlay = ref(true)
const duration = ref(0)
const currentTime = ref(0)
const progress = ref(0)
const bufferedProgress = ref(0)
const volume = ref(0.7)
const isMuted = ref(false)
const previousVolume = ref(0.7)
const playbackRate = ref(1)
const isFullscreen = ref(false)
const controlsVisible = ref(true)
const controlsTimeout = ref(null)

const isLiked = computed(() => {
  return currentUser.likedVideos.includes(video.value?.id)
})

const isSubscribed = computed(() => {
  return currentUser.subscriptions.includes(channel.value?.id)
})

// Video player methods
const togglePlay = () => {
  if (!videoElement.value) return
  
  if (isFirstPlay.value) {
    isFirstPlay.value = false
  }
  
  if (videoElement.value.paused) {
    videoElement.value.play()
  } else {
    videoElement.value.pause()
  }
  
  isPlaying.value = !videoElement.value.paused
}

const updateProgress = () => {
  if (!videoElement.value) return
  
  const { currentTime: time, duration: totalDuration } = videoElement.value
  
  currentTime.value = time
  
  if (totalDuration) {
    progress.value = (time / totalDuration) * 100
  }
  
  // Update buffered progress
  if (videoElement.value.buffered.length > 0) {
    const bufferedEnd = videoElement.value.buffered.end(videoElement.value.buffered.length - 1)
    bufferedProgress.value = (bufferedEnd / totalDuration) * 100
  }
}

const seek = (event) => {
  if (!videoElement.value) return
  
  const progressBar = event.currentTarget
  const rect = progressBar.getBoundingClientRect()
  const pos = (event.clientX - rect.left) / rect.width
  
  videoElement.value.currentTime = pos * videoElement.value.duration
}

const skip = (seconds) => {
  if (!videoElement.value) return
  
  videoElement.value.currentTime += seconds
}

const updateVolume = () => {
  if (!videoElement.value) return
  
  videoElement.value.volume = volume.value
  if (volume.value > 0) {
    isMuted.value = false
    videoElement.value.muted = false
  }
}

const toggleMute = () => {
  if (!videoElement.value) return
  
  if (isMuted.value) {
    isMuted.value = false
    volume.value = previousVolume.value
    videoElement.value.volume = volume.value
    videoElement.value.muted = false
  } else {
    isMuted.value = true
    previousVolume.value = volume.value
    volume.value = 0
    videoElement.value.volume = 0
    videoElement.value.muted = true
  }
}

const togglePlaybackRate = () => {
  if (!videoElement.value) return
  
  const rates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
  const currentIndex = rates.indexOf(playbackRate.value)
  const nextIndex = (currentIndex + 1) % rates.length
  
  playbackRate.value = rates[nextIndex]
  videoElement.value.playbackRate = playbackRate.value
}

const togglePictureInPicture = async () => {
  if (!videoElement.value) return
  
  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture()
    } else {
      await videoElement.value.requestPictureInPicture()
    }
  } catch (error) {
    console.error('PiP error:', error)
  }
}

const toggleFullscreen = () => {
  const container = document.querySelector('.custom-video-player')
  if (!container) return
  
  if (!document.fullscreenElement) {
    container.requestFullscreen().catch(err => {
      console.error('Failed to enter fullscreen mode:', err)
    })
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

const formatTime = (timeInSeconds) => {
  if (isNaN(timeInSeconds) || timeInSeconds === Infinity) return '00:00'
  
  const minutes = Math.floor(timeInSeconds / 60)
  const seconds = Math.floor(timeInSeconds % 60)
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

const onVideoCanPlay = () => {
  if (!videoElement.value) return
  
  duration.value = videoElement.value.duration
  
  // Set initial volume
  videoElement.value.volume = volume.value
}

const showControls = () => {
  controlsVisible.value = true
  
  // Clear any existing timeout
  if (controlsTimeout.value) {
    clearTimeout(controlsTimeout.value)
  }
  
  // Set a new timeout
  controlsTimeout.value = setTimeout(() => {
    if (isPlaying.value) {
      controlsVisible.value = false
    }
  }, 3000)
}

const hideControls = () => {
  if (isPlaying.value) {
    controlsTimeout.value = setTimeout(() => {
      controlsVisible.value = false
    }, 3000)
  }
}

// Handle fullscreen change events
const onFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

// Standard video controls
const toggleDescription = () => {
  isDescriptionExpanded.value = !isDescriptionExpanded.value
}

const handleLike = () => {
  // In a real app, this would send a request to the API
  likeVideo(video.value.id, currentUser.id)
}

const handleSubscribe = () => {
  // In a real app, this would send a request to the API
  if (isSubscribed.value) {
    // Logic for unsubscribe would go here
  } else {
    // Logic for subscribe would go here
  }
}

const postComment = () => {
  if (newComment.value.trim()) {
    const comment = addComment(video.value.id, currentUser.id, newComment.value)
    if (comment) {
      newComment.value = ''
    }
  }
}

const formatCommentName = (userId) => {
  const user = getUserById(userId)
  return user ? user.name : 'Unknown User'
}

const formatCommentPicture = (userId) => {
  const user = getUserById(userId)
  return user ? user.profilePicture : ''
}

// Keyboard shortcuts for video player
const handleKeydown = (event) => {
  // Only react to keydown events if the video player is visible
  if (!videoElement.value) return
  
  switch (event.key.toLowerCase()) {
    case ' ':
    case 'k':
      togglePlay()
      event.preventDefault()
      break
    case 'f':
      toggleFullscreen()
      event.preventDefault()
      break
    case 'm':
      toggleMute()
      event.preventDefault()
      break
    case 'arrowright':
      skip(5)
      event.preventDefault()
      break
    case 'arrowleft':
      skip(-5)
      event.preventDefault()
      break
    case 'j':
      skip(-10)
      event.preventDefault()
      break
    case 'l':
      skip(10)
      event.preventDefault()
      break
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
      if (videoElement.value) {
        const percent = parseInt(event.key) * 10
        videoElement.value.currentTime = (percent / 100) * videoElement.value.duration
        event.preventDefault()
      }
      break
  }
}

// Watch route changes to load new video
watch(() => route.params.videoId, (newVideoId) => {
  if (newVideoId) {
    video.value = getVideoById(newVideoId)
    if (video.value) {
      channel.value = getChannelById(video.value.channelId)
      
      // Reset video player state
      isPlaying.value = false
      isFirstPlay.value = true
      currentTime.value = 0
      progress.value = 0
      bufferedProgress.value = 0
      
      // Reset video element if it exists
      if (videoElement.value) {
        videoElement.value.currentTime = 0
      }
    }
  }
})

onMounted(() => {
  const videoId = route.params.videoId
  
  // In a real app, this would fetch video data from an API
  video.value = getVideoById(videoId)
  if (video.value) {
    channel.value = getChannelById(video.value.channelId)
  }
  
  // Add event listeners
  document.addEventListener('fullscreenchange', onFullscreenChange)
  document.addEventListener('keydown', handleKeydown)
  
  // Show controls initially
  showControls()
})

onBeforeUnmount(() => {
  // Remove event listeners
  document.removeEventListener('fullscreenchange', onFullscreenChange)
  document.removeEventListener('keydown', handleKeydown)
  
  // Clear timeout
  if (controlsTimeout.value) {
    clearTimeout(controlsTimeout.value)
  }
})
</script>

<template>
  <div v-if="video && channel" class="watch-container">
    <div class="video-section">
      <div class="video-player-container">
        <div class="custom-video-player" :class="{ 'playing': isPlaying, 'controls-visible': controlsVisible }">
          <video 
            ref="videoElement"
            class="video-player"
            @click="togglePlay"
            @timeupdate="updateProgress"
            @canplay="onVideoCanPlay"
            @play="isPlaying = true"
            @pause="isPlaying = false"
            @ended="isPlaying = false"
            @mousemove="showControls"
            v-voix="'VideoPlayer'"
            :hint="video ? `Video player: ${video.title}. ${video.description.substring(0, 50)}${video.description.length > 50 ? '...' : ''}. Use space to play/pause, arrow keys to seek, M to mute.` : 'Video player with playback controls'"
          >
            <source :src="video.videoUrl" type="video/mp4">
            Your browser does not support the video tag.
          </video>
          
          <div class="video-controls" @mouseleave="hideControls" @mousemove="showControls">
            <div class="progress-container" @click="seek">
              <div class="progress-bar">
                <div class="progress" :style="{ width: `${progress}%` }"></div>
                <div class="buffered" :style="{ width: `${bufferedProgress}%` }"></div>
              </div>
              <div class="progress-thumb" :style="{ left: `${progress}%` }"></div>
            </div>
            
            <div class="controls-bottom">
              <div class="controls-left">
                <button 
                  @click="togglePlay" 
                  class="control-button play-button"
                  v-voix="'PlayPauseButton'"
                  :hint="isPlaying ? 'Pause video' : 'Play video'"
                >
                  <svg v-if="!isPlaying" viewBox="0 0 24 24" height="24" width="24">
                    <path d="M8 5v14l11-7z" fill="currentColor"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" height="24" width="24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor"/>
                  </svg>
                </button>
                
                <button 
                  @click="skip(-10)" 
                  class="control-button"
                  v-voix="'RewindButton'"
                  hint="Rewind 10 seconds"
                >
                  <svg viewBox="0 0 24 24" height="24" width="24">
                    <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8zm-1.1 11h-.85v-3.26l-1.01.31v-.69l1.77-.63h.09V16z" fill="currentColor"/>
                  </svg>
                </button>
                
                <button 
                  @click="skip(10)" 
                  class="control-button"
                  v-voix="'ForwardButton'"
                  hint="Forward 10 seconds"
                >
                  <svg viewBox="0 0 24 24" height="24" width="24">
                    <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8zm1.1 11h.85v-3.26l1.01.31v-.69l-1.77-.63h-.09V16z" fill="currentColor"/>
                  </svg>
                </button>
                
                <div class="volume-container">
                  <button 
                    @click="toggleMute" 
                    class="control-button"
                    v-voix="'MuteButton'"
                    hint="Toggle mute"
                  >
                    <svg v-if="volume === 0 || isMuted" viewBox="0 0 24 24" height="24" width="24">
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" fill="currentColor"/>
                    </svg>
                    <svg v-else-if="volume < 0.5" viewBox="0 0 24 24" height="24" width="24">
                      <path d="M7 9v6h4l5 5V4l-5 5H7z" fill="currentColor"/>
                    </svg>
                    <svg v-else viewBox="0 0 24 24" height="24" width="24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="currentColor"/>
                    </svg>
                  </button>
                  
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    v-model="volume" 
                    class="volume-slider"
                    @input="updateVolume"
                    v-voix="'VolumeSlider'"
                    hint="Adjust volume"
                  />
                </div>
                
                <div class="time-display">
                  {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
                </div>
              </div>
              
              <div class="controls-right">
                <button 
                  @click="togglePlaybackRate" 
                  class="control-button text-button"
                  v-voix="'PlaybackSpeedButton'"
                  hint="Change playback speed"
                >
                  {{ playbackRate }}x
                </button>
                
                <button 
                  @click="togglePictureInPicture" 
                  class="control-button"
                  v-voix="'PIPButton'"
                  hint="Picture in picture mode"
                >
                  <svg viewBox="0 0 24 24" height="24" width="24">
                    <path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2zm0 16.01H3V4.98h18v14.03z" fill="currentColor"/>
                  </svg>
                </button>
                
                <button 
                  @click="toggleFullscreen" 
                  class="control-button"
                  v-voix="'FullscreenButton'"
                  hint="Toggle fullscreen"
                >
                  <svg v-if="!isFullscreen" viewBox="0 0 24 24" height="24" width="24">
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" fill="currentColor"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" height="24" width="24">
                    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div v-if="!isPlaying && !isFirstPlay" class="play-overlay" @click="togglePlay">
            <svg viewBox="0 0 24 24" class="play-overlay-icon">
              <path d="M8 5v14l11-7z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="video-details">
        <h1 class="video-title">{{ video.title }}</h1>
        
        <div class="video-meta-row">
          <div class="video-meta">
            <span>{{ formatViewCount(video.views) }} views</span>
            <span class="dot-separator">•</span>
            <span>{{ formatUploadDate(video.uploadDate) }}</span>
          </div>
          
          <div class="video-actions">
            <button 
              @click="handleLike" 
              class="action-button" 
              :class="{ 'active': isLiked }"
              v-voix="'LikeButton'"
              :hint="`${isLiked ? 'Unlike' : 'Like'} video: ${video.title}. Currently has ${formatViewCount(video.likes)} likes.`"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
              </svg>
              <span>{{ formatViewCount(video.likes) }}</span>
            </button>
          </div>
        </div>

        <div class="channel-section">
          <RouterLink 
            :to="`/channel/${channel.id}`" 
            class="channel-info"
            v-voix="`ChannelInfo-${channel.id}`"
            :hint="`Visit ${channel.name}'s channel`"
          >
            <img 
              :src="channel.profilePicture" 
              :alt="channel.name" 
              class="channel-img"
            />
            <div class="channel-details">
              <h3 class="channel-name">{{ channel.name }}</h3>
              <p class="channel-subscribers">{{ formatViewCount(channel.subscribers) }} subscribers</p>
            </div>
          </RouterLink>
          
          <button 
            @click="handleSubscribe" 
            class="subscribe-button" 
            :class="{ 'subscribed': isSubscribed }"
            v-voix="'SubscribeButton'"
            :hint="`${isSubscribed ? 'Unsubscribe from' : 'Subscribe to'} ${channel.name}'s channel. They have ${formatViewCount(channel.subscribers)} subscribers and create videos about ${video.tags.join(', ')}.`"
          >
            {{ isSubscribed ? 'Subscribed' : 'Subscribe' }}
          </button>
        </div>

        <div class="video-description-container">
          <div 
            class="video-description" 
            :class="{ 'expanded': isDescriptionExpanded }"
          >
            <p>{{ video.description }}</p>
            <div class="tags">
              <span v-for="(tag, index) in video.tags" :key="index" class="tag">#{{ tag }}</span>
            </div>
          </div>
          
          <button 
            v-if="video.description.length > 100" 
            @click="toggleDescription" 
            class="show-more-button"
            v-voix="'ShowMoreButton'"
            hint="Show more description text"
          >
            {{ isDescriptionExpanded ? 'Show less' : 'Show more' }}
          </button>
        </div>
      </div>

      <div class="comments-section">
        <h3 class="comments-header">{{ video.comments.length }} Comments</h3>
        
        <div class="add-comment">
          <img 
            :src="currentUser.profilePicture" 
            :alt="currentUser.name" 
            class="user-img"
          />
          <div class="comment-input-container">
            <input 
              type="text" 
              v-model="newComment" 
              placeholder="Add a comment..." 
              class="comment-input"
              v-voix="'CommentInput'"
              hint="Type your comment about this video. Share your thoughts on what you liked or questions you have."
            />
            <div class="comment-actions">
              <button 
                @click="postComment" 
                class="comment-button"
                v-voix="'PostCommentButton'"
                hint="Post your comment"
              >
                Comment
              </button>
            </div>
          </div>
        </div>
        
        <div class="comments-list">
          <div v-for="comment in video.comments" :key="comment.id" class="comment">
            <RouterLink 
              :to="`/channel/${comment.userId}`" 
              class="comment-user-img"
              v-voix="`CommentUserImg-${comment.id}`"
              :hint="`Profile picture of ${formatCommentName(comment.userId)} who commented: ${comment.text.substring(0, 30)}${comment.text.length > 30 ? '...' : ''}`"
            >
              <img 
                :src="formatCommentPicture(comment.userId)" 
                :alt="formatCommentName(comment.userId)" 
                class="user-img"
              />
            </RouterLink>
            
            <div class="comment-content">
              <div class="comment-header">
                <RouterLink 
                  :to="`/channel/${comment.userId}`" 
                  class="comment-username"
                  v-voix="`CommentUsername-${comment.id}`"
                  :hint="`${formatCommentName(comment.userId)} who commented: ${comment.text.substring(0, 30)}${comment.text.length > 30 ? '...' : ''}. Click to visit their channel.`"
                >
                  {{ formatCommentName(comment.userId) }}
                </RouterLink>
                <span class="comment-age">1 week ago</span>
              </div>
              
              <p class="comment-text">{{ comment.text }}</p>
              
              <div class="comment-actions">
                <button 
                  class="comment-like-button"
                  v-voix="`CommentLikeButton-${comment.id}`"
                  :hint="`Like comment by ${formatCommentName(comment.userId)}: ${comment.text.substring(0, 30)}${comment.text.length > 30 ? '...' : ''}. Currently has ${comment.likes} likes.`"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16">
                    <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                  </svg>
                  <span>{{ comment.likes }}</span>
                </button>
                
                <button 
                  class="comment-reply-button"
                  v-voix="`CommentReplyButton-${comment.id}`"
                  :hint="`Reply to ${formatCommentName(comment.userId)}'s comment: ${comment.text.substring(0, 30)}${comment.text.length > 30 ? '...' : ''}`"
                >
                  Reply
                </button>
              </div>
              
              <!-- Nested replies if any -->
              <div v-if="comment.replies && comment.replies.length > 0" class="comment-replies">
                <div v-for="reply in comment.replies" :key="reply.id" class="comment reply">
                  <RouterLink 
                    :to="`/channel/${reply.userId}`" 
                    class="comment-user-img"
                    v-voix="`ReplyUserImg-${reply.id}`"
                    :hint="`Profile picture of ${formatCommentName(reply.userId)} who replied: ${reply.text.substring(0, 30)}${reply.text.length > 30 ? '...' : ''}`"
                  >
                    <img 
                      :src="formatCommentPicture(reply.userId)" 
                      :alt="formatCommentName(reply.userId)" 
                      class="user-img"
                    />
                  </RouterLink>
                  
                  <div class="comment-content">
                    <div class="comment-header">
                      <RouterLink 
                        :to="`/channel/${reply.userId}`" 
                        class="comment-username"
                        v-voix="`ReplyUsername-${reply.id}`"
                        :hint="`${formatCommentName(reply.userId)} who replied: ${reply.text.substring(0, 30)}${reply.text.length > 30 ? '...' : ''}. Click to visit their channel.`"
                      >
                        {{ formatCommentName(reply.userId) }}
                      </RouterLink>
                      <span class="comment-age">1 week ago</span>
                    </div>
                    
                    <p class="comment-text">{{ reply.text }}</p>
                    
                    <div class="comment-actions">
                      <button 
                        class="comment-like-button"
                        v-voix="`ReplyLikeButton-${reply.id}`"
                        :hint="`Like reply by ${formatCommentName(reply.userId)}: ${reply.text.substring(0, 30)}${reply.text.length > 30 ? '...' : ''}. Currently has ${reply.likes} likes.`"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16">
                          <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                        </svg>
                        <span>{{ reply.likes }}</span>
                      </button>
                      
                      <button 
                        class="comment-reply-button"
                        v-voix="`ReplyToReplyButton-${reply.id}`"
                        :hint="`Reply to ${formatCommentName(reply.userId)}'s comment: ${reply.text.substring(0, 30)}${reply.text.length > 30 ? '...' : ''}`"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading">
    <p>Loading video...</p>
  </div>
</template>

<style scoped>
.watch-container {
  display: flex;
  flex-direction: column;
}

.video-section {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
}

.video-player-container {
  width: 100%;
  position: relative;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  background: #000;
  margin-bottom: 1rem;
}

.custom-video-player {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: #000;
  cursor: pointer;
}

.video-player {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.video-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  padding: 10px;
  transition: opacity 0.3s ease;
  z-index: 10;
  opacity: 0;
}

.custom-video-player.controls-visible .video-controls {
  opacity: 1;
}

.progress-container {
  width: 100%;
  height: 5px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  margin-bottom: 10px;
  cursor: pointer;
  position: relative;
}

.progress-bar {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 5px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #f00;
  position: absolute;
  top: 0;
  left: 0;
  transition: width 0.1s linear;
  z-index: 2;
}

.buffered {
  height: 100%;
  background-color: rgba(255, 255, 255, 0.4);
  position: absolute;
  top: 0;
  left: 0;
  transition: width 0.2s linear;
  z-index: 1;
}

.progress-thumb {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  background-color: #f00;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: left 0.1s linear;
  z-index: 3;
  opacity: 0;
}

.progress-container:hover .progress-thumb {
  opacity: 1;
}

.controls-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.controls-left, .controls-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-button {
  background: none;
  border: none;
  color: white;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 50%;
}

.control-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.play-button {
  width: 40px;
  height: 40px;
}

.volume-container {
  display: flex;
  align-items: center;
  gap: 5px;
}

.volume-slider {
  width: 80px;
  height: 5px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  outline: none;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
}

.time-display {
  font-size: 14px;
  color: white;
  margin-left: 10px;
}

.text-button {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 5px 8px;
  font-size: 14px;
  font-weight: bold;
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  transition: opacity 0.3s ease;
}

.play-overlay-icon {
  width: 70px;
  height: 70px;
  color: white;
  opacity: 0.8;
}

.play-overlay:hover .play-overlay-icon {
  opacity: 1;
  transform: scale(1.1);
  transition: all 0.2s ease;
}

.video-details {
  padding: 1rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.video-title {
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.video-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.video-meta {
  font-size: 0.9rem;
  color: #606060;
}

.dot-separator {
  margin: 0 4px;
}

.video-actions {
  display: flex;
  gap: 1rem;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #606060;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 18px;
}

.action-button:hover {
  background-color: #f0f0f0;
}

.action-button.active {
  color: #065fd4;
}

.channel-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.channel-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.channel-img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.channel-name {
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
}

.channel-subscribers {
  font-size: 0.9rem;
  color: #606060;
  margin: 0;
}

.subscribe-button {
  background-color: #cc0000;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 2px;
  cursor: pointer;
}

.subscribe-button.subscribed {
  background-color: #f0f0f0;
  color: #606060;
}

.video-description-container {
  padding: 1rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.video-description {
  font-size: 0.9rem;
  line-height: 1.4;
  max-height: 80px;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.video-description.expanded {
  max-height: 1000px;
}

.tags {
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  color: #065fd4;
  font-size: 0.9rem;
  cursor: pointer;
}

.show-more-button {
  background: none;
  border: none;
  color: #606060;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.5rem 0;
  cursor: pointer;
}

.comments-section {
  padding: 1rem 0;
}

.comments-header {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
}

.add-comment {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.user-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-input-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.comment-input {
  width: 100%;
  border: none;
  border-bottom: 1px solid #e0e0e0;
  padding: 0.5rem 0;
  font-size: 0.9rem;
  outline: none;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.comment-button {
  background-color: #065fd4;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  border-radius: 2px;
  cursor: pointer;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.comment {
  display: flex;
  gap: 1rem;
}

.comment-user-img {
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.comment-username {
  font-size: 0.9rem;
  font-weight: 500;
}

.comment-age {
  font-size: 0.8rem;
  color: #606060;
}

.comment-text {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.comment-actions {
  display: flex;
  gap: 1rem;
}

.comment-like-button,
.comment-reply-button {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  color: #606060;
  font-size: 0.8rem;
  cursor: pointer;
}

.comment-replies {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font-size: 1.2rem;
  color: #606060;
}

@media (max-width: 768px) {
  .video-meta-row {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .video-actions {
    margin-top: 1rem;
  }
  
  .channel-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .subscribe-button {
    margin-top: 1rem;
  }
}
</style>