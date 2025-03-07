<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Enhanced mock data for swiping
const mockJobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'TechCorp',
    logo: 'https://via.placeholder.com/60?text=TC',
    location: 'San Francisco, CA',
    salary: '$100,000 - $130,000',
    description: 'We are looking for a skilled Frontend Developer with experience in Vue.js, React, or Angular to join our innovative team. You will work on cutting-edge web applications used by millions of users.',
    requiredSkills: ['JavaScript', 'Vue.js', 'CSS', 'HTML', 'Git'],
    benefits: ['Health Insurance', 'Remote Work Options', '401(k) Matching', 'Professional Development'],
    postedDate: '2025-02-15',
    companySize: '50-100 employees',
    workType: 'Hybrid'
  },
  {
    id: 2,
    title: 'Backend Engineer',
    company: 'DataSystems',
    logo: 'https://via.placeholder.com/60?text=DS',
    location: 'Remote',
    salary: '$110,000 - $140,000',
    description: 'Join our backend team to build scalable and efficient APIs using Node.js and Express. We are looking for someone passionate about creating high-performance systems that power our growing platform.',
    requiredSkills: ['JavaScript', 'Node.js', 'MongoDB', 'Express', 'REST APIs'],
    benefits: ['Full Remote', 'Flexible Schedule', 'Health & Dental', 'Unlimited PTO'],
    postedDate: '2025-02-10',
    companySize: '100-500 employees',
    workType: 'Remote'
  },
  {
    id: 3,
    title: 'Full Stack Developer',
    company: 'StartupInnovate',
    logo: 'https://via.placeholder.com/60?text=SI',
    location: 'New York, NY',
    salary: '$120,000 - $150,000',
    description: 'Looking for a versatile developer who can work on both frontend and backend technologies. You will be joining a fast-paced startup environment where you can make a significant impact from day one.',
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'AWS'],
    benefits: ['Stock Options', 'Catered Meals', 'Gym Membership', 'Learning Budget'],
    postedDate: '2025-02-20',
    companySize: '10-50 employees',
    workType: 'On-site'
  },
  {
    id: 4,
    title: 'UX/UI Designer',
    company: 'CreativeWorks',
    logo: 'https://via.placeholder.com/60?text=CW',
    location: 'Austin, TX',
    salary: '$90,000 - $120,000',
    description: 'Design beautiful and intuitive user interfaces for web and mobile applications. We are seeking a creative mind who can translate complex requirements into elegant, user-friendly designs.',
    requiredSkills: ['Figma', 'Adobe XD', 'UI Design', 'User Testing', 'Interaction Design'],
    benefits: ['Flexible Hours', 'Creative Workshops', 'Health Insurance', 'Remote Options'],
    postedDate: '2025-01-30',
    companySize: '50-100 employees',
    workType: 'Hybrid'
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    company: 'CloudTech',
    logo: 'https://via.placeholder.com/60?text=CT',
    location: 'Seattle, WA',
    salary: '$130,000 - $160,000',
    description: 'Manage our cloud infrastructure and CI/CD pipelines to ensure smooth deployments. You will be optimizing our systems for performance, reliability, and security while implementing best practices.',
    requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
    benefits: ['Competitive Salary', 'Stock Options', 'Health Benefits', '401(k)'],
    postedDate: '2025-02-05',
    companySize: '500+ employees',
    workType: 'Hybrid'
  },
  {
    id: 6,
    title: 'Machine Learning Engineer',
    company: 'AI Innovations',
    logo: 'https://via.placeholder.com/60?text=AI',
    location: 'Boston, MA',
    salary: '$140,000 - $180,000',
    description: 'Join our AI team to develop cutting-edge machine learning models that solve real-world problems. You will work with large datasets and state-of-the-art algorithms to create innovative solutions.',
    requiredSkills: ['Python', 'TensorFlow', 'PyTorch', 'Data Science', 'NLP'],
    benefits: ['Research Budget', 'Conference Allowance', 'Flexible Schedule', 'Health Insurance'],
    postedDate: '2025-02-18',
    companySize: '50-100 employees',
    workType: 'Hybrid'
  },
  {
    id: 7,
    title: 'Mobile Developer (iOS)',
    company: 'AppWorks',
    logo: 'https://via.placeholder.com/60?text=AW',
    location: 'Chicago, IL',
    salary: '$110,000 - $140,000',
    description: 'Create engaging and performant iOS applications for our growing user base. You will collaborate with designers and backend engineers to deliver seamless mobile experiences.',
    requiredSkills: ['Swift', 'iOS', 'UIKit', 'SwiftUI', 'Git'],
    benefits: ['Health & Dental', 'Flexible Hours', 'Work From Home Options', 'Professional Development'],
    postedDate: '2025-02-12',
    companySize: '10-50 employees',
    workType: 'Remote'
  }
]

// User state
const userType = ref('candidate') // 'candidate' or 'company'
const currentIndex = ref(0)
const swipedCards = ref([])
const savedJobs = ref([])
const isDragging = ref(false)
const startX = ref(0)
const currentX = ref(0)
const cardWidth = ref(0)
const swipeThreshold = 100 // Minimum distance to trigger a swipe
const showDetails = ref(false)
const showFilters = ref(false)
const cardStack = ref([])
const swipeDirection = ref(null)
const swipeProgress = ref(0)
const swipeOutClass = ref('')
const isCardAnimating = ref(false)
const activeFilters = ref({
  location: [],
  workType: [],
  salary: null,
  skills: []
})

// Filter options
const filterOptions = {
  locations: ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Boston, MA', 'Chicago, IL', 'Remote'],
  workTypes: ['Remote', 'Hybrid', 'On-site'],
  salaryRanges: [
    { label: 'Any', value: null },
    { label: '$80k - $100k', value: [80000, 100000] },
    { label: '$100k - $130k', value: [100000, 130000] },
    { label: '$130k - $160k', value: [130000, 160000] },
    { label: '$160k+', value: [160000, null] }
  ]
}

// Generate a stack of visible cards
const generateCardStack = () => {
  cardStack.value = []
  // Show at most 3 cards in stack
  for (let i = 0; i < 3; i++) {
    const index = currentIndex.value + i
    if (index < mockJobs.length) {
      cardStack.value.push({
        ...mockJobs[index],
        stackPosition: i
      })
    }
  }
}

// Load the initial card stack
onMounted(() => {
  generateCardStack()
  
  // Get the card width for swipe calculations
  setTimeout(() => {
    const swipeCard = document.querySelector('.swipe-card')
    if (swipeCard) {
      cardWidth.value = swipeCard.offsetWidth
    }
  }, 100) // Small delay to ensure cards are rendered
})

// Update card stack when the current index changes
watch(currentIndex, () => {
  generateCardStack()
})

// Computed properties
const currentCard = computed(() => {
  return mockJobs[currentIndex.value] || null
})

const remainingCards = computed(() => {
  return mockJobs.length - currentIndex.value
})

const percentageMatched = computed(() => {
  if (swipedCards.value.length === 0) return 0
  return Math.round((swipedCards.value.filter(card => card.liked).length / swipedCards.value.length) * 100)
})

const cardStyle = computed(() => {
  if (!isDragging.value && !swipeDirection.value) return {}
  
  let translateX = 0
  let rotate = 0
  let scale = 1
  let opacity = 1
  
  if (isDragging.value) {
    translateX = currentX.value - startX.value
    rotate = translateX / 15
    opacity = Math.max(1 - Math.abs(translateX) / (cardWidth.value * 1.5), 0)
  } else if (swipeDirection.value) {
    const direction = swipeDirection.value === 'right' ? 1 : -1
    translateX = direction * cardWidth.value * 1.5 * swipeProgress.value
    rotate = direction * 30 * swipeProgress.value
    opacity = Math.max(1 - swipeProgress.value, 0)
  }
  
  return {
    transform: `translateX(${translateX}px) rotate(${rotate}deg) scale(${scale})`,
    opacity: opacity
  }
})

const stackCardStyles = computed(() => {
  return (card) => {
    const position = card.stackPosition
    
    if (position === 0) {
      return cardStyle.value
    }
    
    // Stagger and scale cards based on their position in the stack
    const translateY = position * 4
    const scale = 1 - (position * 0.05)
    const opacity = position === 0 ? 1 : 0.2 // Make background cards nearly transparent
    const zIndex = 10 - position
    
    return {
      transform: `translateY(${translateY}px) scale(${scale})`,
      opacity: opacity,
      zIndex: zIndex
    }
  }
})

const likeIndicatorStyle = computed(() => {
  if (!isDragging.value) return { opacity: 0 }
  
  const dragDistance = currentX.value - startX.value
  let opacity = 0
  
  if (dragDistance > 0) {
    opacity = Math.min(dragDistance / swipeThreshold, 1)
  }
  
  return { opacity }
})

const dislikeIndicatorStyle = computed(() => {
  if (!isDragging.value) return { opacity: 0 }
  
  const dragDistance = currentX.value - startX.value
  let opacity = 0
  
  if (dragDistance < 0) {
    opacity = Math.min(Math.abs(dragDistance) / swipeThreshold, 1)
  }
  
  return { opacity }
})

const superlikeIndicatorStyle = computed(() => {
  if (!isDragging.value) return { opacity: 0 }
  
  return { opacity: 0 } // Only show on button press, not drag
})

// Methods
const handleTouchStart = (e) => {
  if (isCardAnimating.value) return
  startDrag(e.touches[0].clientX)
}

const handleMouseDown = (e) => {
  if (isCardAnimating.value) return
  startDrag(e.clientX)
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const startDrag = (clientX) => {
  if (!currentCard.value) return
  isDragging.value = true
  startX.value = clientX
  currentX.value = clientX
  swipeDirection.value = null
  swipeProgress.value = 0
}

const handleTouchMove = (e) => {
  if (!isDragging.value) return
  currentX.value = e.touches[0].clientX
}

const handleMouseMove = (e) => {
  if (!isDragging.value) return
  currentX.value = e.clientX
}

const handleTouchEnd = () => {
  endDrag()
}

const handleMouseUp = () => {
  endDrag()
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}

const endDrag = () => {
  if (!isDragging.value) return
  
  const deltaX = currentX.value - startX.value
  
  if (deltaX > swipeThreshold) {
    animateSwipe('right')
  } else if (deltaX < -swipeThreshold) {
    animateSwipe('left')
  } else {
    resetCard()
  }
  
  isDragging.value = false
}

const resetCard = () => {
  swipeDirection.value = null
  swipeProgress.value = 0
}

const animateSwipe = (direction) => {
  swipeDirection.value = direction
  isCardAnimating.value = true
  swipeOutClass.value = `swipe-out-${direction}`
  
  // Animate the swipe out
  const duration = 400 // ms
  const startTime = Date.now()
  
  const animate = () => {
    const elapsedTime = Date.now() - startTime
    const progress = Math.min(elapsedTime / duration, 1)
    swipeProgress.value = progress
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      // Animation complete
      if (direction === 'right') {
        like()
      } else if (direction === 'left') {
        dislike()
      } else if (direction === 'up') {
        superlike()
      }
      
      // Reset for next card
      setTimeout(() => {
        swipeDirection.value = null
        swipeProgress.value = 0
        isCardAnimating.value = false
        swipeOutClass.value = ''
      }, 100)
    }
  }
  
  animate()
}

const like = () => {
  if (!currentCard.value) return
  
  swipedCards.value.push({ ...currentCard.value, liked: true })
  showNextCard()
  
  // Simulate a match with 30% probability
  if (Math.random() < 0.3) {
    setTimeout(() => {
      router.push('/matches')
    }, 300)
  }
}

const dislike = () => {
  if (!currentCard.value) return
  swipedCards.value.push({ ...currentCard.value, liked: false })
  showNextCard()
}

const superlike = () => {
  if (!currentCard.value) return
  swipedCards.value.push({ ...currentCard.value, liked: true, superliked: true })
  showNextCard()
  
  // Higher chance of match with superlike
  if (Math.random() < 0.6) {
    setTimeout(() => {
      router.push('/matches')
    }, 300)
  }
}

const saveJob = () => {
  if (!currentCard.value) return
  
  // Check if already saved
  const alreadySaved = savedJobs.value.some(job => job.id === currentCard.value.id)
  
  if (!alreadySaved) {
    savedJobs.value.push({...currentCard.value})
  }
}

const showNextCard = () => {
  currentIndex.value++
}

const toggleJobDetails = () => {
  showDetails.value = !showDetails.value
}

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const applyFilters = () => {
  // This would filter the jobs in a real app
  showFilters.value = false
}

const resetFilters = () => {
  activeFilters.value = {
    location: [],
    workType: [],
    salary: null,
    skills: []
  }
}

const toggleFilterOption = (category, value) => {
  if (category === 'salary') {
    activeFilters.value.salary = value
  } else {
    const index = activeFilters.value[category].indexOf(value)
    if (index === -1) {
      activeFilters.value[category].push(value)
    } else {
      activeFilters.value[category].splice(index, 1)
    }
  }
}

// Extract salary number from string for display
const extractSalary = (salaryString) => {
  const matches = salaryString.match(/\$(\d+),000/g)
  if (matches && matches.length >= 2) {
    const min = matches[0].replace('$', '').replace(',000', '')
    const max = matches[1].replace('$', '').replace(',000', '')
    return [parseInt(min) * 1000, parseInt(max) * 1000]
  }
  return [0, 0]
}

// Format date to relative time (e.g., "2 days ago")
const formatRelativeDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return 'Today'
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
  } else {
    const months = Math.floor(diffDays / 30)
    return `${months} ${months === 1 ? 'month' : 'months'} ago`
  }
}
</script>

<template>
  <div class="swipe-container">
    <div class="swipe-header">
      <div class="swipe-actions">
        <button 
          class="icon-button filter-button" 
          @click="toggleFilters"
          v-voix="'filter-button'"
          hint="Open job filters"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          <span>Filters</span>
        </button>
        
        <h2 v-voix="'swipe-heading'">Find Your Match</h2>
        
        <button 
          class="icon-button saved-button" 
          v-voix="'saved-jobs-button'"
          hint="View saved jobs"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
          <span class="badge" v-if="savedJobs.length">{{ savedJobs.length }}</span>
        </button>
      </div>
      
      <div class="swipe-stats">
        <div class="stat-item">
          <span class="stat-label">Viewed</span>
          <span class="stat-value">{{ swipedCards.length }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Liked</span>
          <span class="stat-value">{{ swipedCards.filter(card => card.liked).length }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Match Rate</span>
          <span class="stat-value">{{ percentageMatched }}%</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Remaining</span>
          <span class="stat-value">{{ remainingCards }}</span>
        </div>
      </div>
    </div>
    
    <!-- Filter Panel -->
    <div class="filter-panel" :class="{ active: showFilters }">
      <div class="filter-panel-header">
        <h3>Filter Jobs</h3>
        <button 
          class="close-button" 
          @click="toggleFilters"
          v-voix="'close-filters-button'"
          hint="Close filters panel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div class="filter-section">
        <h4>Location</h4>
        <div class="filter-options">
          <label 
            v-for="location in filterOptions.locations" 
            :key="location" 
            class="filter-option"
            v-voix="`filter-location-${location.toLowerCase().replace(' ', '-')}`"
            :hint="`Toggle ${location} filter`"
          >
            <input 
              type="checkbox" 
              :checked="activeFilters.location.includes(location)" 
              @change="toggleFilterOption('location', location)" 
            />
            <span>{{ location }}</span>
          </label>
        </div>
      </div>
      
      <div class="filter-section">
        <h4>Work Type</h4>
        <div class="filter-options">
          <label 
            v-for="type in filterOptions.workTypes" 
            :key="type" 
            class="filter-option"
            v-voix="`filter-worktype-${type.toLowerCase()}`"
            :hint="`Toggle ${type} work type filter`"
          >
            <input 
              type="checkbox" 
              :checked="activeFilters.workType.includes(type)" 
              @change="toggleFilterOption('workType', type)" 
            />
            <span>{{ type }}</span>
          </label>
        </div>
      </div>
      
      <div class="filter-section">
        <h4>Salary Range</h4>
        <div class="filter-options salary-options">
          <label 
            v-for="range in filterOptions.salaryRanges" 
            :key="range.label" 
            class="filter-option"
            v-voix="`filter-salary-${range.label.toLowerCase().replace(' ', '-')}`"
            :hint="`Set salary filter to ${range.label}`"
          >
            <input 
              type="radio" 
              name="salary" 
              :checked="activeFilters.salary === range.value" 
              @change="toggleFilterOption('salary', range.value)" 
            />
            <span>{{ range.label }}</span>
          </label>
        </div>
      </div>
      
      <div class="filter-actions">
        <button 
          class="reset-button" 
          @click="resetFilters"
          v-voix="'reset-filters-button'"
          hint="Clear all filters"
        >
          Reset
        </button>
        <button 
          class="apply-button" 
          @click="applyFilters"
          v-voix="'apply-filters-button'"
          hint="Apply selected filters"
        >
          Apply Filters
        </button>
      </div>
    </div>
    
    <div class="swipe-area">
      <!-- Card Stack -->
      <div v-if="cardStack.length > 0" class="card-stack">
        <div 
          v-for="card in cardStack"
          :key="card.id"
          class="swipe-card-wrapper"
          :class="{ 'top-card': card.stackPosition === 0, [swipeOutClass]: card.stackPosition === 0 && swipeDirection }"
        >
          <div 
            class="swipe-card" 
            :class="{ 'show-details': showDetails }"
            :style="stackCardStyles(card)"
            @mousedown="card.stackPosition === 0 ? handleMouseDown($event) : null"
            @touchstart="card.stackPosition === 0 ? handleTouchStart($event) : null"
            @touchmove="card.stackPosition === 0 ? handleTouchMove($event) : null"
            @touchend="card.stackPosition === 0 ? handleTouchEnd() : null"
            v-voix="`card-${card.id}`"
            :hint="`Job card for ${card.title} at ${card.company}`"
          >
            <!-- Card Indicators -->
            <div class="card-indicators">
              <div class="card-indicator like" :style="likeIndicatorStyle">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span>LIKE</span>
              </div>
              
              <div class="card-indicator dislike" :style="dislikeIndicatorStyle">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                <span>PASS</span>
              </div>
              
              <div class="card-indicator superlike" :style="superlikeIndicatorStyle">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span>SUPER</span>
              </div>
            </div>
            
            <!-- Card Header -->
            <div class="card-header">
              <div class="company-logo">
                <img :src="card.logo" :alt="card.company + ' logo'" />
              </div>
              
              <div class="job-info">
                <h3 class="job-title">{{ card.title }}</h3>
                <div class="company-info">
                  <span class="company-name">{{ card.company }}</span>
                  <span class="dot-separator">•</span>
                  <span class="job-location">{{ card.location }}</span>
                </div>
                <div class="job-meta">
                  <span class="posted-date">Posted {{ formatRelativeDate(card.postedDate) }}</span>
                  <span class="dot-separator">•</span>
                  <span class="work-type">{{ card.workType }}</span>
                </div>
              </div>
            </div>
            
            <!-- Card Content -->
            <div class="card-content">
              <div class="card-section">
                <h4 class="section-title">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                  </svg>
                  Overview
                </h4>
                <div class="salary-range">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
                    <path d="M12 6v2"></path>
                    <path d="M12 16v2"></path>
                  </svg>
                  {{ card.salary }}
                </div>
                <div class="company-size">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  {{ card.companySize }}
                </div>
                <p class="job-description">{{ card.description }}</p>
              </div>
              
              <div class="card-section">
                <h4 class="section-title">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                  </svg>
                  Required Skills
                </h4>
                <div class="skill-tags">
                  <span v-for="(skill, index) in card.requiredSkills" :key="index" class="skill-tag">
                    {{ skill }}
                  </span>
                </div>
              </div>
              
              <div class="card-section" v-if="showDetails">
                <h4 class="section-title">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  Benefits
                </h4>
                <ul class="benefits-list">
                  <li v-for="(benefit, index) in card.benefits" :key="index">
                    {{ benefit }}
                  </li>
                </ul>
              </div>
            </div>
            
            <!-- Card Footer (details toggle) -->
            <div class="card-footer">
              <button 
                class="details-toggle" 
                @click.stop="toggleJobDetails"
                v-voix="'toggle-details-button'"
                :hint="showDetails ? 'Show less details' : 'Show more details'"
              >
                {{ showDetails ? 'Show Less' : 'Show More' }}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :style="{ transform: showDetails ? 'rotate(180deg)' : 'rotate(0deg)' }">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- No more cards state -->
      <div v-else class="no-more-cards">
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
          <h3>No more jobs available</h3>
          <p>We're working on finding more opportunities that match your profile.</p>
          <button 
            class="reload-button"
            v-voix="'reload-jobs-button'"
            hint="Check for new job listings"
          >
            Check for New Jobs
          </button>
        </div>
      </div>
      
      <!-- Control buttons -->
      <div class="swipe-controls">
        <button 
          class="control-button dislike-button" 
          @click="animateSwipe('left')" 
          :disabled="!currentCard || isCardAnimating"
          v-voix="'dislike-button'"
          hint="Pass on this job"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <button 
          class="control-button save-button" 
          @click="saveJob" 
          :disabled="!currentCard || isCardAnimating"
          v-voix="'save-button'"
          hint="Save this job for later"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
        
        <button 
          class="control-button superlike-button" 
          @click="animateSwipe('up')" 
          :disabled="!currentCard || isCardAnimating"
          v-voix="'superlike-button'"
          hint="Super like this job to increase match chance"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </button>
        
        <button 
          class="control-button like-button" 
          @click="animateSwipe('right')" 
          :disabled="!currentCard || isCardAnimating"
          v-voix="'like-button'"
          hint="Like this job"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Main container */
.swipe-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
}

/* Header styles */
.swipe-header {
  margin-bottom: 1.5rem;
}

.swipe-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.swipe-actions h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.icon-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #555;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 0.9rem;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.icon-button:hover {
  background-color: #f0f2f8;
  color: #ff5757;
}

.saved-button {
  position: relative;
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff5757;
  color: white;
  font-size: 0.7rem;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.swipe-stats {
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 1rem;
  background-color: #f7f9fc;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.2rem;
}

.stat-value {
  font-weight: 600;
  color: #333;
  font-size: 1.1rem;
}

/* Filter panel */
.filter-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 360px;
  height: 100vh;
  background-color: white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  transform: translateX(-100%);
  transition: transform 0.3s ease-out;
  overflow-y: auto;
  padding: 1.5rem;
}

.filter-panel.active {
  transform: translateX(0);
}

.filter-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filter-panel-header h3 {
  margin: 0;
  font-size: 1.3rem;
}

.close-button {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-button:hover {
  background-color: #f0f2f8;
}

.filter-section {
  margin-bottom: 1.5rem;
}

.filter-section h4 {
  margin: 0 0 0.8rem 0;
  font-size: 1rem;
  color: #333;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.salary-options {
  flex-direction: column;
  gap: 0.5rem;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;
}

.filter-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.reset-button, .apply-button {
  flex: 1;
  padding: 0.8rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-button {
  background-color: #f0f2f8;
  color: #555;
  border: none;
}

.reset-button:hover {
  background-color: #e4e8f0;
}

.apply-button {
  background-color: #ff5757;
  color: white;
  border: none;
}

.apply-button:hover {
  background-color: #ff4343;
}

/* Card area */
.swipe-area {
  position: relative;
  height: 70vh;
  max-height: 700px;
  min-height: 500px;
  margin-bottom: 1rem;
}

/* Card stack */
.card-stack {
  position: relative;
  height: 100%;
  width: 100%;
  perspective: 1000px;
}

.swipe-card-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease-out;
  pointer-events: none; /* Disable interaction with background cards */
}

.swipe-card-wrapper.top-card {
  pointer-events: auto; /* Only the top card can be interacted with */
  z-index: 10;
}

.swipe-card {
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease-out;
  transform-origin: center center;
  backface-visibility: hidden;
  will-change: transform, opacity;
  cursor: grab; /* Show grab cursor to indicate draggable */
}

.swipe-card.show-details {
  overflow-y: auto;
}

/* Card indicators */
.card-indicators {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

.card-indicator {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: opacity 0.2s, transform 0.2s;
  opacity: 0;
}

.card-indicator span {
  font-size: 0.8rem;
  font-weight: bold;
  margin-top: 0.2rem;
}

.card-indicator.like {
  top: 40px;
  right: 40px;
  color: #4caf50;
  transform: rotate(20deg);
}

.card-indicator.dislike {
  top: 40px;
  left: 40px;
  color: #f44336;
  transform: rotate(-20deg);
}

.card-indicator.superlike {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #2196f3;
}

/* Card content sections */
.card-header {
  display: flex;
  align-items: center;
  padding: 1.2rem;
  border-bottom: 1px solid #f0f2f8;
}

.company-logo {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  overflow: hidden;
  margin-right: 1rem;
  flex-shrink: 0;
  border: 1px solid #f0f2f8;
}

.company-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.job-info {
  flex: 1;
  min-width: 0; /* For text truncation */
}

.job-title {
  margin: 0 0 0.3rem 0;
  font-size: 1.3rem;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.company-info, .job-meta {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.2rem;
}

.company-name {
  font-weight: 600;
}

.dot-separator {
  margin: 0 0.4rem;
}

.card-content {
  flex: 1;
  padding: 0 1.2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card-section {
  padding: 1.2rem 0;
  border-bottom: 1px solid #f0f2f8;
}

.card-section:last-child {
  border-bottom: none;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #333;
}

.salary-range, .company-size {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
  color: #666;
  font-size: 0.95rem;
}

.job-description {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #444;
  margin: 1rem 0 0 0;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.skill-tag {
  background-color: #f0f2f8;
  padding: 0.4rem 0.8rem;
  border-radius: 50px;
  font-size: 0.85rem;
  color: #555;
  transition: background-color 0.2s;
}

.skill-tag:hover {
  background-color: #e4e8f0;
}

.benefits-list {
  margin: 0;
  padding-left: 1.5rem;
}

.benefits-list li {
  margin-bottom: 0.5rem;
  color: #555;
}

.card-footer {
  padding: 1rem 1.2rem;
  border-top: 1px solid #f0f2f8;
  text-align: center;
}

.details-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #ff5757;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  padding: 0.5rem;
}

.details-toggle svg {
  transition: transform 0.3s;
}

/* No more cards state */
.no-more-cards {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 16px;
  padding: 2rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 300px;
}

.empty-state svg {
  color: #ddd;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin: 0 0 0.8rem 0;
  color: #555;
}

.empty-state p {
  color: #777;
  margin-bottom: 1.5rem;
}

.reload-button {
  background-color: #ff5757;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.reload-button:hover {
  background-color: #ff4343;
}

/* Control buttons */
.swipe-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.control-button {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.control-button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.control-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dislike-button {
  background-color: white;
  color: #f44336;
  border: 1px solid #f44336;
}

.dislike-button:hover:not(:disabled) {
  background-color: #ffebee;
}

.save-button {
  background-color: white;
  color: #ff9800;
  border: 1px solid #ff9800;
}

.save-button:hover:not(:disabled) {
  background-color: #fff8e1;
}

.superlike-button {
  background-color: white;
  color: #2196f3;
  border: 1px solid #2196f3;
}

.superlike-button:hover:not(:disabled) {
  background-color: #e3f2fd;
}

.like-button {
  background-color: white;
  color: #4caf50;
  border: 1px solid #4caf50;
}

.like-button:hover:not(:disabled) {
  background-color: #e8f5e9;
}

/* Swipe animations */
.swipe-out-right {
  animation: swipe-right 0.4s forwards;
}

.swipe-out-left {
  animation: swipe-left 0.4s forwards;
}

.swipe-out-up {
  animation: swipe-up 0.4s forwards;
}

@keyframes swipe-right {
  to {
    transform: translateX(150%) rotate(20deg);
    opacity: 0;
  }
}

@keyframes swipe-left {
  to {
    transform: translateX(-150%) rotate(-20deg);
    opacity: 0;
  }
}

@keyframes swipe-up {
  to {
    transform: translateY(-150%);
    opacity: 0;
  }
}

/* Cursor styles */
.swipe-card:active {
  cursor: grabbing;
}

/* Responsive styles */
@media (max-width: 768px) {
  .swipe-container {
    padding: 0.8rem;
  }
  
  .swipe-area {
    height: 65vh;
  }
  
  .card-header {
    padding: 1rem;
  }
  
  .company-logo {
    width: 48px;
    height: 48px;
  }
  
  .job-title {
    font-size: 1.2rem;
  }
  
  .swipe-controls {
    gap: 0.8rem;
  }
  
  .control-button {
    width: 48px;
    height: 48px;
  }
  
  .filter-panel {
    max-width: 280px;
  }
}
</style>