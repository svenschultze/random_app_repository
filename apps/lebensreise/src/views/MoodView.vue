<script setup>
import { ref, inject, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const moodEntries = inject('moodEntries')
const diaryEntries = inject('diaryEntries')

// Current date for mood tracking
const currentDate = ref(new Date().toISOString().split('T')[0])

// New mood entry state
const newMood = ref({
  date: currentDate.value,
  mood: '',
  note: '',
  factors: []
})

// Available factors
const availableFactors = ref([
  'Schlaf', 'Ernährung', 'Bewegung', 'Soziale Kontakte', 
  'Arbeit', 'Freizeit', 'Stress', 'Wetter'
])

// View mode (add or history)
const viewMode = ref('add')

// Date range for history view
const historyRange = ref('week')

// Mock data for demo purposes
onMounted(() => {
  if (moodEntries.value.length === 0) {
    moodEntries.value = [
      {
        id: '1',
        date: '2025-03-05',
        mood: 'happy',
        note: 'Ein produktiver Tag mit gutem Wetter',
        factors: ['Bewegung', 'Wetter']
      },
      {
        id: '2',
        date: '2025-03-04',
        mood: 'neutral',
        note: 'Normaler Arbeitstag, etwas müde',
        factors: ['Arbeit', 'Schlaf']
      },
      {
        id: '3',
        date: '2025-03-03',
        mood: 'sad',
        note: 'Stressiger Tag mit vielen Meetings',
        factors: ['Arbeit', 'Stress']
      },
      {
        id: '4',
        date: '2025-03-02',
        mood: 'excited',
        note: 'Toller Ausflug mit Freunden',
        factors: ['Soziale Kontakte', 'Freizeit']
      },
      {
        id: '5',
        date: '2025-03-01',
        mood: 'stressed',
        note: 'Deadline-Stress und schlechtes Wetter',
        factors: ['Arbeit', 'Stress', 'Wetter']
      }
    ]
  }
})

// Computed properties
const sortedEntries = computed(() => {
  return [...moodEntries.value].sort((a, b) => new Date(b.date) - new Date(a.date))
})

const historyEntries = computed(() => {
  let daysToShow = 7
  if (historyRange.value === 'month') {
    daysToShow = 30
  } else if (historyRange.value === 'year') {
    daysToShow = 365
  }
  
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysToShow)
  
  return sortedEntries.value.filter(entry => new Date(entry.date) >= cutoffDate)
})

const moodCounts = computed(() => {
  const counts = {
    happy: 0,
    neutral: 0,
    sad: 0,
    excited: 0,
    stressed: 0
  }
  
  historyEntries.value.forEach(entry => {
    if (counts[entry.mood] !== undefined) {
      counts[entry.mood]++
    }
  })
  
  return counts
})

const topFactors = computed(() => {
  const factorCount = {}
  
  historyEntries.value.forEach(entry => {
    entry.factors.forEach(factor => {
      factorCount[factor] = (factorCount[factor] || 0) + 1
    })
  })
  
  return Object.entries(factorCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([factor, count]) => ({
      factor,
      count,
      percentage: Math.round((count / historyEntries.value.length) * 100)
    }))
})

// Methods
const toggleFactor = (factor) => {
  const index = newMood.value.factors.indexOf(factor)
  if (index === -1) {
    newMood.value.factors.push(factor)
  } else {
    newMood.value.factors.splice(index, 1)
  }
}

const setMood = (mood) => {
  newMood.value.mood = mood
}

const saveMood = () => {
  if (newMood.value.mood) {
    const moodToSave = {
      ...newMood.value,
      id: Date.now().toString(),
      date: newMood.value.date || currentDate.value
    }
    
    moodEntries.value.push(moodToSave)
    
    // Reset form
    newMood.value = {
      date: currentDate.value,
      mood: '',
      note: '',
      factors: []
    }
    
    // Show contextual prompt
    showDiaryPrompt.value = true
  }
}

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

const goBack = () => {
  router.push('/')
}

// Contextual prompts
const showDiaryPrompt = ref(false)
const navigateToDiary = () => {
  router.push('/diary')
}

const getDatesForRange = () => {
  const dates = []
  const today = new Date()
  let days = 7
  
  if (historyRange.value === 'month') {
    days = 30
  } else if (historyRange.value === 'year') {
    days = 365
  }
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }
  
  return dates.sort()
}

const getMoodForDate = (date) => {
  const entry = moodEntries.value.find(e => e.date === date)
  return entry ? entry.mood : null
}
</script>

<template>
  <div class="mood-container">
    <div class="mood-header">
      <button 
        class="btn-back"
        @click="goBack"
        v-voix="'zurück-button'"
        hint="Zurück zur vorherigen Ansicht">
        ←
      </button>
      <h1>Meine Stimmung</h1>
      
      <div class="mood-tabs">
        <button 
          class="mood-tab"
          :class="{ active: viewMode === 'add' }"
          @click="viewMode = 'add'"
          v-voix="'eintragen-tab'"
          hint="Tab zur Eintragung der aktuellen Stimmung">
          Eintragen
        </button>
        <button 
          class="mood-tab"
          :class="{ active: viewMode === 'history' }"
          @click="viewMode = 'history'"
          v-voix="'verlauf-tab'"
          hint="Tab zur Anzeige des Stimmungsverlaufs">
          Verlauf
        </button>
      </div>
    </div>
    
    <div class="mood-content">
      <!-- Add Mood View -->
      <div v-if="viewMode === 'add'" class="mood-add-view">
        <div class="card mood-form">
          <div class="form-group">
            <label for="mood-date" v-voix="'datum-label'">Datum</label>
            <input 
              type="date"
              id="mood-date"
              v-model="newMood.date"
              v-voix="'datum-input'"
              hint="Wählen Sie das Datum für Ihren Stimmungseintrag">
          </div>
          
          <div class="form-group mood-selection">
            <label v-voix="'stimmung-label'">Wie fühlst du dich heute?</label>
            <div class="mood-options">
              <button 
                class="mood-option"
                :class="{ active: newMood.mood === 'happy' }"
                @click="setMood('happy')"
                v-voix="'stimmung-glücklich'"
                hint="Wählen Sie glücklich als Stimmung">
                <div class="mood-emoji">😊</div>
                <div class="mood-label">Glücklich</div>
              </button>
              <button 
                class="mood-option"
                :class="{ active: newMood.mood === 'neutral' }"
                @click="setMood('neutral')"
                v-voix="'stimmung-neutral'"
                hint="Wählen Sie neutral als Stimmung">
                <div class="mood-emoji">😐</div>
                <div class="mood-label">Neutral</div>
              </button>
              <button 
                class="mood-option"
                :class="{ active: newMood.mood === 'sad' }"
                @click="setMood('sad')"
                v-voix="'stimmung-traurig'"
                hint="Wählen Sie traurig als Stimmung">
                <div class="mood-emoji">😔</div>
                <div class="mood-label">Traurig</div>
              </button>
              <button 
                class="mood-option"
                :class="{ active: newMood.mood === 'excited' }"
                @click="setMood('excited')"
                v-voix="'stimmung-begeistert'"
                hint="Wählen Sie begeistert als Stimmung">
                <div class="mood-emoji">🤩</div>
                <div class="mood-label">Begeistert</div>
              </button>
              <button 
                class="mood-option"
                :class="{ active: newMood.mood === 'stressed' }"
                @click="setMood('stressed')"
                v-voix="'stimmung-gestresst'"
                hint="Wählen Sie gestresst als Stimmung">
                <div class="mood-emoji">😩</div>
                <div class="mood-label">Gestresst</div>
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label for="mood-note" v-voix="'notiz-label'">Notiz</label>
            <textarea
              id="mood-note"
              v-model="newMood.note"
              placeholder="Was hat deine Stimmung heute beeinflusst?"
              v-voix="'notiz-input'"
              hint="Beschreiben Sie, was Ihre Stimmung heute beeinflusst hat">
            </textarea>
          </div>
          
          <div class="form-group">
            <label v-voix="'faktoren-label'">Einflussfaktoren</label>
            <div class="factors-grid">
              <button 
                v-for="factor in availableFactors"
                :key="factor"
                class="factor-btn"
                :class="{ active: newMood.factors.includes(factor) }"
                @click="toggleFactor(factor)"
                v-voix="'faktor-' + factor"
                :hint="'Faktor ' + factor + ' auswählen oder abwählen'">
                {{ factor }}
              </button>
            </div>
          </div>
          
          <button 
            class="btn btn-primary save-btn"
            @click="saveMood"
            v-voix="'stimmung-speichern-button'"
            hint="Klicken Sie hier, um Ihre Stimmung zu speichern">
            Stimmung speichern
          </button>
        </div>
      </div>
      
      <!-- Mood History View -->
      <div v-if="viewMode === 'history'" class="mood-history-view">
        <div class="history-controls">
          <div class="range-selector">
            <button 
              class="range-btn"
              :class="{ active: historyRange === 'week' }"
              @click="historyRange = 'week'"
              v-voix="'woche-button'"
              hint="Zeigt die Stimmung der letzten Woche an">
              Woche
            </button>
            <button 
              class="range-btn"
              :class="{ active: historyRange === 'month' }"
              @click="historyRange = 'month'"
              v-voix="'monat-button'"
              hint="Zeigt die Stimmung des letzten Monats an">
              Monat
            </button>
            <button 
              class="range-btn"
              :class="{ active: historyRange === 'year' }"
              @click="historyRange = 'year'"
              v-voix="'jahr-button'"
              hint="Zeigt die Stimmung des letzten Jahres an">
              Jahr
            </button>
          </div>
        </div>
        
        <div class="mood-history-grid">
          <!-- Mood distribution chart -->
          <div class="card mood-distribution">
            <h3>Stimmungsverteilung</h3>
            <div class="distribution-chart">
              <div 
                v-for="(count, mood) in moodCounts" 
                :key="mood"
                class="distribution-item"
                v-voix="'verteilung-' + mood"
                :hint="getMoodLabel(mood) + ': ' + count + ' Einträge'">
                <div class="distribution-emoji">{{ getMoodEmoji(mood) }}</div>
                <div class="distribution-count">{{ count }}</div>
                <div class="distribution-label">{{ getMoodLabel(mood) }}</div>
              </div>
            </div>
          </div>
          
          <!-- Mood timeline -->
          <div class="card mood-timeline">
            <h3>Stimmungsverlauf</h3>
            <div class="timeline-container">
              <div 
                v-for="date in getDatesForRange()" 
                :key="date"
                class="timeline-day"
                v-voix="'timeline-' + date"
                :hint="'Stimmung am ' + date + ': ' + (getMoodForDate(date) ? getMoodLabel(getMoodForDate(date)) : 'Keine Eintragung')">
                <div 
                  class="timeline-mood" 
                  :class="{ empty: !getMoodForDate(date) }">
                  {{ getMoodForDate(date) ? getMoodEmoji(getMoodForDate(date)) : '' }}
                </div>
                <div class="timeline-date">
                  {{ date.split('-').slice(2).join('-') }}
                </div>
              </div>
            </div>
          </div>
          
          <!-- Top influence factors -->
          <div class="card mood-factors">
            <h3>Top Einflussfaktoren</h3>
            <div class="factors-list">
              <div 
                v-for="factor in topFactors" 
                :key="factor.factor"
                class="factor-item"
                v-voix="'top-faktor-' + factor.factor"
                :hint="factor.factor + ': ' + factor.count + ' Einträge, ' + factor.percentage + '%'">
                <div class="factor-name">{{ factor.factor }}</div>
                <div class="factor-bar-container">
                  <div 
                    class="factor-bar" 
                    :style="{ width: factor.percentage + '%' }">
                  </div>
                  <span class="factor-percentage">{{ factor.percentage }}%</span>
                </div>
              </div>
              
              <div v-if="topFactors.length === 0" class="no-data">
                Noch nicht genug Daten für Faktoren-Analyse
              </div>
            </div>
          </div>
          
          <!-- Recent entries -->
          <div class="card recent-entries">
            <h3>Letzte Einträge</h3>
            <div class="entries-list">
              <div 
                v-for="entry in historyEntries.slice(0, 5)" 
                :key="entry.id"
                class="entry-item"
                v-voix="'eintrag-' + entry.id"
                :hint="'Eintrag vom ' + entry.date + ': ' + getMoodLabel(entry.mood)">
                <div class="entry-date">{{ entry.date }}</div>
                <div class="entry-mood">{{ getMoodEmoji(entry.mood) }}</div>
                <div class="entry-note">{{ entry.note }}</div>
                <div class="entry-factors">
                  <span 
                    v-for="factor in entry.factors" 
                    :key="factor"
                    class="entry-factor">
                    {{ factor }}
                  </span>
                </div>
              </div>
              
              <div v-if="historyEntries.length === 0" class="no-data">
                Noch keine Einträge für diesen Zeitraum
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Contextual Prompt -->
    <div v-if="showDiaryPrompt" class="contextual-prompt">
      <div class="prompt-content">
        <p>Möchtest du heute auch einen Tagebucheintrag schreiben, um deine Gedanken festzuhalten?</p>
        <div class="prompt-actions">
          <button 
            class="btn btn-primary"
            @click="navigateToDiary"
            v-voix="'ja-zum-tagebuch-button'"
            hint="Klicken Sie hier, um zum Tagebuch zu gehen">
            Ja, zum Tagebuch
          </button>
          <button 
            class="btn btn-secondary"
            @click="showDiaryPrompt = false"
            v-voix="'später-button'"
            hint="Klicken Sie hier, um die Erinnerung zu schließen">
            Später
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mood-container {
  min-height: 100vh;
  padding: 2rem;
  background-color: var(--light-bg);
}

.mood-header {
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

.mood-header h1 {
  flex: 1;
}

.mood-tabs {
  display: flex;
  gap: 1rem;
}

.mood-tab {
  padding: 0.5rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.mood-tab.active {
  border-bottom: 2px solid var(--primary-color);
  color: var(--primary-color);
}

.mood-content {
  margin-bottom: 2rem;
}

/* Add mood view styles */
.mood-add-view {
  max-width: 800px;
  margin: 0 auto;
}

.mood-form {
  padding: 2rem;
}

.mood-selection {
  margin-bottom: 2rem;
}

.mood-options {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.mood-option {
  background: none;
  border: 2px solid #ddd;
  border-radius: var(--border-radius);
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-width: 100px;
}

.mood-option.active {
  border-color: var(--primary-color);
  transform: translateY(-5px);
  box-shadow: var(--box-shadow);
}

.mood-emoji {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.factors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.factor-btn {
  background-color: #f0f0f0;
  border: none;
  border-radius: var(--border-radius);
  padding: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.factor-btn.active {
  background-color: var(--primary-color);
  color: white;
}

.save-btn {
  width: 100%;
  margin-top: 1rem;
}

/* History view styles */
.history-controls {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
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

.mood-history-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.card {
  padding: 1.5rem;
}

.card h3 {
  margin-bottom: 1.5rem;
  color: var(--secondary-color);
}

/* Distribution chart styles */
.distribution-chart {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
}

.distribution-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.distribution-emoji {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.distribution-count {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
}

.distribution-label {
  font-size: 0.9rem;
  color: #666;
}

/* Timeline styles */
.timeline-container {
  display: flex;
  overflow-x: auto;
  gap: 0.5rem;
  padding-bottom: 1rem;
}

.timeline-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 50px;
}

.timeline-mood {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.timeline-mood.empty {
  background-color: transparent;
  border: 2px dashed #ddd;
}

.timeline-date {
  font-size: 0.8rem;
  color: #666;
}

/* Factors styles */
.factors-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.factor-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.factor-name {
  font-weight: 500;
}

.factor-bar-container {
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 1rem;
  position: relative;
  overflow: hidden;
}

.factor-bar {
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 1rem;
}

.factor-percentage {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
  color: white;
  font-weight: 600;
}

/* Recent entries styles */
.entries-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.entry-item {
  padding: 1rem;
  border-left: 3px solid var(--primary-color);
  background-color: #f9f9f9;
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
}

.entry-date {
  font-size: 0.8rem;
  color: #777;
  margin-bottom: 0.3rem;
}

.entry-mood {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.entry-note {
  margin-bottom: 0.5rem;
}

.entry-factors {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.entry-factor {
  font-size: 0.8rem;
  background-color: #eee;
  padding: 0.2rem 0.5rem;
  border-radius: 0.5rem;
}

.no-data {
  padding: 2rem;
  text-align: center;
  color: #666;
  background-color: #f9f9f9;
  border-radius: var(--border-radius);
}

/* Contextual prompt styles */
.contextual-prompt {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 350px;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  animation: slideIn 0.3s ease;
  z-index: 1000;
}

.prompt-content p {
  margin-bottom: 1rem;
}

.prompt-actions {
  display: flex;
  gap: 1rem;
}

@keyframes slideIn {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .mood-history-grid {
    grid-template-columns: 1fr;
  }
  
  .distribution-chart {
    flex-wrap: wrap;
  }
  
  .contextual-prompt {
    width: calc(100% - 2rem);
    left: 1rem;
    right: 1rem;
  }
}
</style>