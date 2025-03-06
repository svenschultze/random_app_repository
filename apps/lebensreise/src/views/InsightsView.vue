<script setup>
import { ref, inject, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const diaryEntries = inject('diaryEntries')
const habits = inject('habits')
const moodEntries = inject('moodEntries')

// Date range for insights
const insightRange = ref('month')
const isLoading = ref(true)

// Mock insights generation
onMounted(() => {
  // Simulate loading
  setTimeout(() => {
    isLoading.value = false
  }, 800)
})

// Computed properties
const dateRangeText = computed(() => {
  switch (insightRange.value) {
    case 'week':
      return 'der letzten Woche'
    case 'month':
      return 'des letzten Monats'
    case 'year':
      return 'des letzten Jahres'
    default:
      return ''
  }
})

const daysInRange = computed(() => {
  switch (insightRange.value) {
    case 'week':
      return 7
    case 'month':
      return 30
    case 'year':
      return 365
    default:
      return 30
  }
})

const filteredDiaryEntries = computed(() => {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysInRange.value)
  
  return diaryEntries.value.filter(entry => new Date(entry.date) >= cutoffDate)
})

const filteredMoodEntries = computed(() => {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysInRange.value)
  
  return moodEntries.value.filter(entry => new Date(entry.date) >= cutoffDate)
})

const topMoods = computed(() => {
  const moodCounts = {}
  
  filteredMoodEntries.value.forEach(entry => {
    moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1
  })
  
  return Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([mood, count]) => ({
      mood,
      count,
      percentage: Math.round((count / filteredMoodEntries.value.length) * 100)
    }))
})

const habitCompletionRates = computed(() => {
  return habits.value.map(habit => {
    const datesInRange = []
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysInRange.value)
    
    // Only count days in range that should have been completed based on frequency
    const historyDates = Object.keys(habit.history)
      .filter(date => new Date(date) >= cutoffDate)
    
    const completed = historyDates.filter(date => habit.history[date] >= habit.target).length
    const total = historyDates.length
    
    return {
      id: habit.id,
      name: habit.name,
      completed,
      total,
      rate: total ? Math.round((completed / total) * 100) : 0,
      color: habit.color
    }
  }).sort((a, b) => b.rate - a.rate)
})

const diaryTags = computed(() => {
  const tagCounts = {}
  
  filteredDiaryEntries.value.forEach(entry => {
    entry.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })
  
  return Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag, count]) => ({
      tag,
      count,
      percentage: Math.round((count / filteredDiaryEntries.value.length) * 100)
    }))
})

const moodFactorCorrelations = computed(() => {
  // This would be more sophisticated in real implementation
  // For now, return some mock correlations
  
  const factors = ['Schlaf', 'Bewegung', 'Soziale Kontakte', 'Arbeit']
  const correlations = [
    { factor: 'Schlaf', mood: 'happy', strength: 'stark positiv' },
    { factor: 'Bewegung', mood: 'excited', strength: 'positiv' },
    { factor: 'Arbeit', mood: 'stressed', strength: 'stark negativ' },
    { factor: 'Soziale Kontakte', mood: 'happy', strength: 'positiv' }
  ]
  
  return correlations
})

// Methods
const getMoodEmoji = (mood) => {
  switch(mood) {
    case 'happy': return '😊'
    case 'neutral': return '😐'
    case 'sad': return '😔'
    case 'excited': return '🤩'
    case 'stressed': return '😩'
    default: return '❓'
  }
}

const getMoodLabel = (mood) => {
  switch(mood) {
    case 'happy': return 'Glücklich'
    case 'neutral': return 'Neutral'
    case 'sad': return 'Traurig'
    case 'excited': return 'Begeistert'
    case 'stressed': return 'Gestresst'
    default: return 'Unbekannt'
  }
}

const getStrengthClass = (strength) => {
  if (strength.includes('stark positiv')) return 'strong-positive'
  if (strength.includes('positiv')) return 'positive'
  if (strength.includes('stark negativ')) return 'strong-negative'
  if (strength.includes('negativ')) return 'negative'
  return ''
}

const goBack = () => {
  router.push('/')
}

const navigateTo = (route) => {
  router.push(route)
}
</script>

<template>
  <div class="insights-container">
    <div class="insights-header">
      <button 
        class="btn-back"
        @click="goBack"
        v-voix="'zurück-button'"
        hint="Zurück zur vorherigen Ansicht">
        ←
      </button>
      <h1>Meine Einsichten</h1>
      
      <div class="range-selector">
        <button 
          class="range-btn"
          :class="{ active: insightRange === 'week' }"
          @click="insightRange = 'week'"
          v-voix="'woche-button'"
          hint="Zeigt Einsichten der letzten Woche an">
          Woche
        </button>
        <button 
          class="range-btn"
          :class="{ active: insightRange === 'month' }"
          @click="insightRange = 'month'"
          v-voix="'monat-button'"
          hint="Zeigt Einsichten des letzten Monats an">
          Monat
        </button>
        <button 
          class="range-btn"
          :class="{ active: insightRange === 'year' }"
          @click="insightRange = 'year'"
          v-voix="'jahr-button'"
          hint="Zeigt Einsichten des letzten Jahres an">
          Jahr
        </button>
      </div>
    </div>
    
    <div class="insights-content">
      <!-- Loading state -->
      <div v-if="isLoading" class="insights-loading">
        <div class="loading-spinner"></div>
        <p>Deine Einsichten werden generiert...</p>
      </div>
      
      <!-- Insights content -->
      <div v-else class="insights-grid">
        <!-- Summary Headline -->
        <div class="card insights-summary" v-voix="'zusammenfassung-card'">
          <h2>Zusammenfassung {{ dateRangeText }}</h2>
          <div class="summary-stats">
            <div class="summary-stat" v-voix="'tagebuch-einträge'">
              <div class="stat-value">{{ filteredDiaryEntries.length }}</div>
              <div class="stat-label">Tagebucheinträge</div>
            </div>
            <div class="summary-stat" v-voix="'stimmungs-einträge'">
              <div class="stat-value">{{ filteredMoodEntries.length }}</div>
              <div class="stat-label">Stimmungseinträge</div>
            </div>
            <div class="summary-stat" v-voix="'gewohnheiten-einträge'">
              <div class="stat-value">{{ habitCompletionRates.reduce((sum, h) => sum + h.completed, 0) }}</div>
              <div class="stat-label">Abgeschlossene Gewohnheiten</div>
            </div>
          </div>
          
          <div class="summary-buttons">
            <button 
              class="btn btn-primary summary-btn"
              @click="navigateTo('/diary')"
              v-voix="'zum-tagebuch-button'"
              hint="Klicken Sie hier, um zum Tagebuch zu gelangen">
              Zum Tagebuch
            </button>
            <button 
              class="btn btn-primary summary-btn"
              @click="navigateTo('/habits')"
              v-voix="'zu-gewohnheiten-button'"
              hint="Klicken Sie hier, um zu den Gewohnheiten zu gelangen">
              Zu Gewohnheiten
            </button>
            <button 
              class="btn btn-primary summary-btn"
              @click="navigateTo('/mood')"
              v-voix="'zur-stimmung-button'"
              hint="Klicken Sie hier, um zur Stimmungserfassung zu gelangen">
              Zur Stimmung
            </button>
          </div>
        </div>
        
        <!-- Top Moods -->
        <div class="card top-moods" v-voix="'häufigste-stimmungen-card'">
          <h3>Häufigste Stimmungen</h3>
          <div v-if="topMoods.length > 0" class="top-moods-content">
            <div 
              v-for="item in topMoods" 
              :key="item.mood"
              class="top-mood-item"
              v-voix="'stimmung-' + item.mood"
              :hint="getMoodLabel(item.mood) + ': ' + item.percentage + '%'">
              <div class="mood-emoji">{{ getMoodEmoji(item.mood) }}</div>
              <div class="mood-details">
                <div class="mood-label">{{ getMoodLabel(item.mood) }}</div>
                <div class="mood-percentage">{{ item.percentage }}%</div>
              </div>
            </div>
          </div>
          <div v-else class="no-data">
            Noch nicht genug Daten vorhanden
          </div>
        </div>
        
        <!-- Habit Completion -->
        <div class="card habit-completion" v-voix="'gewohnheiten-completion-card'">
          <h3>Gewohnheiten Abschlussrate</h3>
          <div v-if="habitCompletionRates.length > 0" class="habit-completion-content">
            <div 
              v-for="habit in habitCompletionRates.slice(0, 3)" 
              :key="habit.id"
              class="habit-completion-item"
              v-voix="'gewohnheit-' + habit.id"
              :hint="habit.name + ': ' + habit.rate + '%'">
              <div class="habit-name">{{ habit.name }}</div>
              <div class="habit-progress-bar">
                <div 
                  class="habit-progress"
                  :style="{ width: habit.rate + '%', backgroundColor: habit.color }">
                </div>
                <span class="habit-percentage">{{ habit.rate }}%</span>
              </div>
            </div>
          </div>
          <div v-else class="no-data">
            Noch keine Gewohnheiten vorhanden
          </div>
        </div>
        
        <!-- Diary Tags -->
        <div class="card diary-tags" v-voix="'tagebuch-tags-card'">
          <h3>Häufigste Tagebuch-Tags</h3>
          <div v-if="diaryTags.length > 0" class="diary-tags-content">
            <div 
              v-for="tag in diaryTags" 
              :key="tag.tag"
              class="diary-tag-item"
              v-voix="'tag-' + tag.tag"
              :hint="tag.tag + ': ' + tag.count + ' Einträge'">
              <div class="tag-name">{{ tag.tag }}</div>
              <div class="tag-count">{{ tag.count }} Einträge</div>
            </div>
          </div>
          <div v-else class="no-data">
            Noch keine Tags in Tagebucheinträgen vorhanden
          </div>
        </div>
        
        <!-- Mood-Factor Correlations -->
        <div class="card mood-correlations" v-voix="'stimmungs-korrelationen-card'">
          <h3>Stimmungs-Faktoren Korrelationen</h3>
          <div class="correlations-content">
            <div 
              v-for="corr in moodFactorCorrelations" 
              :key="corr.factor + corr.mood"
              class="correlation-item"
              v-voix="'korrelation-' + corr.factor"
              :hint="corr.factor + ' hat eine ' + corr.strength + 'e Korrelation mit ' + getMoodLabel(corr.mood)">
              <div class="correlation-factor">{{ corr.factor }}</div>
              <div class="correlation-arrow">
                <span :class="getStrengthClass(corr.strength)">
                  {{ corr.strength.includes('positiv') ? '↗' : '↘' }}
                </span>
              </div>
              <div class="correlation-mood">
                {{ getMoodEmoji(corr.mood) }} {{ getMoodLabel(corr.mood) }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Recommendations -->
        <div class="card recommendations" v-voix="'empfehlungen-card'">
          <h3>Persönliche Empfehlungen</h3>
          <div class="recommendations-list">
            <div 
              class="recommendation-item"
              v-voix="'empfehlung-bewegung'"
              hint="Empfehlung zur Bewegung">
              <div class="recommendation-icon">🏃‍♂️</div>
              <div class="recommendation-text">
                <strong>Mehr Bewegung einplanen</strong>
                <p>Bewegung scheint einen positiven Einfluss auf deine Stimmung zu haben.</p>
              </div>
            </div>
            
            <div 
              class="recommendation-item"
              v-voix="'empfehlung-schlaf'"
              hint="Empfehlung zum Schlaf">
              <div class="recommendation-icon">😴</div>
              <div class="recommendation-text">
                <strong>Auf regelmäßigen Schlaf achten</strong>
                <p>Guter Schlaf korreliert stark mit deiner positiven Stimmung.</p>
              </div>
            </div>
            
            <div 
              class="recommendation-item"
              v-voix="'empfehlung-sozial'"
              hint="Empfehlung zu sozialen Kontakten">
              <div class="recommendation-icon">👥</div>
              <div class="recommendation-text">
                <strong>Soziale Kontakte pflegen</strong>
                <p>Zeit mit anderen zu verbringen wirkt sich positiv auf dein Wohlbefinden aus.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.insights-container {
  min-height: 100vh;
  padding: 2rem;
  background-color: var(--light-bg);
}

.insights-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.btn-back {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  margin-right: 1rem;
  color: var(--secondary-color);
}

.insights-header h1 {
  flex: 1;
}

.range-selector {
  display: flex;
  background-color: #f0f0f0;
  border-radius: 2rem;
  overflow: hidden;
}

.range-btn {
  background: none;
  border: none;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.range-btn.active {
  background-color: var(--primary-color);
  color: white;
}

.insights-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.card {
  padding: 1.5rem;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

.card h3 {
  margin-bottom: 1.5rem;
  color: var(--secondary-color);
}

/* Summary card styles */
.insights-summary {
  grid-column: 1 / -1;
  text-align: center;
}

.insights-summary h2 {
  margin-bottom: 1.5rem;
  color: var(--secondary-color);
}

.summary-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 2rem;
}

.summary-stat {
  text-align: center;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #666;
}

.summary-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.summary-btn {
  min-width: 150px;
}

/* Top moods styles */
.top-moods-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.top-mood-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mood-emoji {
  font-size: 2rem;
}

.mood-label {
  font-weight: 500;
}

.mood-percentage {
  font-size: 0.9rem;
  color: #666;
}

/* Habit completion styles */
.habit-completion-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.habit-completion-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.habit-name {
  font-weight: 500;
}

.habit-progress-bar {
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 1rem;
  position: relative;
  overflow: hidden;
}

.habit-progress {
  height: 100%;
  border-radius: 1rem;
}

.habit-percentage {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
  color: white;
  font-weight: 600;
}

/* Diary tags styles */
.diary-tags-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.diary-tag-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background-color: #f9f9f9;
  border-radius: var(--border-radius);
}

.tag-name {
  font-weight: 500;
}

.tag-count {
  font-size: 0.9rem;
  color: #666;
}

/* Correlations styles */
.correlations-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.correlation-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem;
  background-color: #f9f9f9;
  border-radius: var(--border-radius);
}

.correlation-factor {
  font-weight: 500;
  flex: 1;
}

.correlation-arrow {
  font-size: 1.5rem;
  padding: 0 0.5rem;
}

.strong-positive {
  color: #10b981;
  font-weight: bold;
}

.positive {
  color: #10b981;
}

.strong-negative {
  color: #ef4444;
  font-weight: bold;
}

.negative {
  color: #ef4444;
}

.correlation-mood {
  flex: 1;
}

/* Recommendations styles */
.recommendations {
  grid-column: 1 / -1;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.recommendation-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: var(--border-radius);
  transition: transform 0.2s ease;
}

.recommendation-item:hover {
  transform: translateY(-3px);
  box-shadow: var(--box-shadow);
}

.recommendation-icon {
  font-size: 2rem;
  padding: 0.5rem;
  background-color: #e6f7ff;
  border-radius: 50%;
  height: 60px;
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.recommendation-text {
  flex: 1;
}

.recommendation-text strong {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--secondary-color);
}

.recommendation-text p {
  color: #666;
  margin: 0;
}

.no-data {
  padding: 2rem;
  text-align: center;
  color: #666;
  background-color: #f9f9f9;
  border-radius: var(--border-radius);
}

@media (max-width: 768px) {
  .insights-grid {
    grid-template-columns: 1fr;
  }
  
  .summary-stats {
    flex-direction: column;
    gap: 1.5rem;
  }
}
</style>