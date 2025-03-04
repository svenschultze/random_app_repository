<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  challenge: {
    type: Object,
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  }
})

function getDifficultyColor(difficulty) {
  switch (difficulty) {
    case 'beginner':
      return '#4CAF50'
    case 'intermediate':
      return '#FFC107'
    case 'advanced':
      return '#F44336'
    default:
      return '#3a86ff'
  }
}
</script>

<template>
  <div 
    class="challenge-card" 
    :class="{ 'featured': featured, 'completed': challenge.completed }"
    v-voix="'Challenge Card: ' + challenge.title"
    hint="Click to view details and start this challenge"
  >
    <div class="card-header">
      <div class="challenge-thumbnail">{{ challenge.thumbnail }}</div>
      <div class="challenge-info">
        <div 
          class="challenge-difficulty" 
          :style="{ backgroundColor: getDifficultyColor(challenge.difficulty) }"
        >
          {{ challenge.difficulty }}
        </div>
        <div class="challenge-type">{{ challenge.type }}</div>
      </div>
    </div>
    
    <div class="card-content">
      <h3 class="challenge-title">{{ challenge.title }}</h3>
      <p class="challenge-description">{{ challenge.description }}</p>
    </div>
    
    <div class="card-footer">
      <div class="challenge-duration">
        <span class="icon">⏱️</span> 
        {{ challenge.duration }} min
      </div>
      <div class="challenge-points">
        <span class="icon">⭐</span> 
        {{ challenge.points }} points
      </div>
    </div>
    
    <div v-if="challenge.completed" class="completed-badge">
      ✓
    </div>
  </div>
</template>

<style scoped>
.challenge-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.25rem;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.challenge-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.challenge-card.featured {
  border: 2px solid #3a86ff;
}

.challenge-card.completed {
  opacity: 0.8;
}

.card-header {
  display: flex;
  margin-bottom: 1rem;
}

.challenge-thumbnail {
  font-size: 2rem;
  margin-right: 1rem;
}

.challenge-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.challenge-difficulty {
  font-size: 0.7rem;
  font-weight: 600;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  text-transform: capitalize;
  display: inline-block;
}

.challenge-type {
  font-size: 0.8rem;
  color: #666;
  text-transform: capitalize;
}

.card-content {
  flex: 1;
}

.challenge-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: #333;
}

.challenge-description {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: #777;
}

.challenge-duration, .challenge-points {
  display: flex;
  align-items: center;
}

.icon {
  margin-right: 0.25rem;
}

.completed-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #4CAF50;
  color: white;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
}
</style>