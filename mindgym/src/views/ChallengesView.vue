<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useChallengesStore } from '../stores/challenges'
import ChallengeCard from '../components/ChallengeCard.vue'

const router = useRouter()
const challengesStore = useChallengesStore()

// Filter state
const filterType = ref('')
const filterDifficulty = ref('')

// Available filter options
const challengeTypes = [
  { id: '', name: 'All Types' },
  { id: 'memory', name: 'Memory' },
  { id: 'logic', name: 'Logic' },
  { id: 'verbal', name: 'Verbal' },
  { id: 'spatial', name: 'Spatial' },
  { id: 'math', name: 'Math' }
]

const difficultyLevels = [
  { id: '', name: 'All Levels' },
  { id: 'beginner', name: 'Beginner' },
  { id: 'intermediate', name: 'Intermediate' },
  { id: 'advanced', name: 'Advanced' }
]

// Filtered challenges
const filteredChallenges = computed(() => {
  return challengesStore.filteredChallenges(filterType.value, filterDifficulty.value)
})

function navigateToChallenge(id) {
  router.push(`/challenge/${id}`)
}

function clearFilters() {
  filterType.value = ''
  filterDifficulty.value = ''
}
</script>

<template>
  <div class="challenges-container">
    <div class="challenges-header">
      <h1>Challenge Library</h1>
      <p>Explore a variety of mental exercises to boost your cognitive abilities.</p>
    </div>
    
    <div class="filter-section">
      <div class="filter-controls">
        <div class="filter-group">
          <label for="type-filter">Challenge Type</label>
          <select id="type-filter" v-model="filterType">
            <option 
              v-for="type in challengeTypes" 
              :key="type.id" 
              :value="type.id"
            >
              {{ type.name }}
            </option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="difficulty-filter">Difficulty</label>
          <select id="difficulty-filter" v-model="filterDifficulty">
            <option 
              v-for="level in difficultyLevels" 
              :key="level.id" 
              :value="level.id"
            >
              {{ level.name }}
            </option>
          </select>
        </div>
        
        <button class="clear-filters-btn" @click="clearFilters" 
                :disabled="!filterType && !filterDifficulty">
          Clear Filters
        </button>
      </div>
      
      <div class="results-count">
        {{ filteredChallenges.length }} challenges found
      </div>
    </div>
    
    <div class="challenges-grid">
      <div 
        v-for="challenge in filteredChallenges" 
        :key="challenge.id"
        class="challenge-item"
        @click="navigateToChallenge(challenge.id)"
      >
        <ChallengeCard :challenge="challenge" />
      </div>
    </div>
    
    <div v-if="filteredChallenges.length === 0" class="no-results">
      <div class="no-results-icon">🔍</div>
      <h3>No challenges found</h3>
      <p>Try adjusting your filters to see more results.</p>
      <button class="clear-filters-btn" @click="clearFilters">Clear All Filters</button>
    </div>
  </div>
</template>

<style scoped>
.challenges-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.challenges-header {
  margin-bottom: 2rem;
}

.challenges-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  color: #333;
}

.challenges-header p {
  margin: 0;
  color: #666;
}

.filter-section {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.filter-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  font-size: 0.9rem;
  color: #333;
}

.clear-filters-btn {
  background-color: #f0f0f0;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  align-self: flex-end;
  margin-top: auto;
}

.clear-filters-btn:hover {
  background-color: #e0e0e0;
}

.clear-filters-btn:disabled {
  background-color: #f8f8f8;
  color: #ccc;
  cursor: not-allowed;
}

.results-count {
  font-size: 0.9rem;
  color: #666;
}

.challenges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.challenge-item {
  cursor: pointer;
}

.no-results {
  padding: 3rem;
  text-align: center;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.no-results-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.no-results h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.no-results p {
  margin: 0 0 1.5rem 0;
  color: #666;
}

@media (max-width: 767px) {
  .filter-controls {
    flex-direction: column;
    gap: 1rem;
  }
  
  .challenges-grid {
    grid-template-columns: 1fr;
  }
}
</style>