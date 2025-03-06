<script setup>
import { ref, inject, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const habits = inject('habits')
const diaryEntries = inject('diaryEntries')

// New habit form state
const newHabit = ref({
  name: '',
  description: '',
  frequency: 'daily',
  target: 1,
  category: '',
  color: '#42b883'
})

// Available categories
const categories = ref(['Gesundheit', 'Fitness', 'Lernen', 'Produktivität', 'Wohlbefinden'])

// Track selected habit for detail view
const selectedHabitId = ref(null)

// View mode (list, create, detail)
const viewMode = ref('list')

// Current date for habit tracking
const currentDate = ref(new Date().toISOString().split('T')[0])

// Mock data for demo purposes
onMounted(() => {
  if (habits.value.length === 0) {
    habits.value = [
      {
        id: '1',
        name: 'Meditation',
        description: '10 Minuten Achtsamkeitsmeditation',
        frequency: 'daily',
        target: 1,
        category: 'Wohlbefinden',
        color: '#42b883',
        history: {
          '2025-03-05': 1,
          '2025-03-04': 1,
          '2025-03-03': 0,
          '2025-03-02': 1,
          '2025-03-01': 1
        }
      },
      {
        id: '2',
        name: 'Lesen',
        description: '30 Minuten lesen',
        frequency: 'daily',
        target: 1,
        category: 'Lernen',
        color: '#ff7e67',
        history: {
          '2025-03-05': 0,
          '2025-03-04': 1,
          '2025-03-03': 1,
          '2025-03-02': 0,
          '2025-03-01': 1
        }
      },
      {
        id: '3',
        name: 'Joggen',
        description: '5km laufen',
        frequency: 'weekly',
        target: 3,
        category: 'Fitness',
        color: '#4299e1',
        history: {
          '2025-03-05': 0,
          '2025-03-04': 1,
          '2025-03-02': 1,
          '2025-02-28': 1
        }
      }
    ]
  }
})

// Computed properties
const selectedHabit = computed(() => {
  return habits.value.find(habit => habit.id === selectedHabitId.value)
})

// Get the current streak for a habit
const getStreak = (habit) => {
  const dates = Object.keys(habit.history).sort((a, b) => new Date(b) - new Date(a))
  let streak = 0
  
  for (const date of dates) {
    if (habit.history[date] >= habit.target) {
      streak++
    } else {
      break
    }
  }
  
  return streak
}

// Get completion rate percentage
const getCompletionRate = (habit) => {
  const entries = Object.entries(habit.history)
  if (entries.length === 0) return 0
  
  const completed = entries.filter(([_, value]) => value >= habit.target).length
  return Math.round((completed / entries.length) * 100)
}

// Check if habit is completed for today
const isCompletedToday = (habit) => {
  return habit.history[currentDate.value] && habit.history[currentDate.value] >= habit.target
}

// Methods
const saveHabit = () => {
  if (newHabit.value.name) {
    const habitToSave = {
      ...newHabit.value,
      id: Date.now().toString(),
      history: {}
    }
    
    habits.value.push(habitToSave)
    
    // Reset form
    newHabit.value = {
      name: '',
      description: '',
      frequency: 'daily',
      target: 1,
      category: '',
      color: '#42b883'
    }
    
    // Back to list view
    viewMode.value = 'list'
  }
}

const selectHabit = (id) => {
  selectedHabitId.value = id
  viewMode.value = 'detail'
}

const toggleHabitCompletion = (habit) => {
  if (!habit.history[currentDate.value]) {
    habit.history[currentDate.value] = 0
  }
  
  habit.history[currentDate.value] = habit.history[currentDate.value] + 1
  
  // Show contextual prompt if completed 
  if (habit.history[currentDate.value] === habit.target) {
    showDiaryPrompt.value = true
    completedHabit.value = habit
  }
}

const decrementHabitCompletion = (habit) => {
  if (habit.history[currentDate.value] && habit.history[currentDate.value] > 0) {
    habit.history[currentDate.value]--
  }
}

const getPreviousDates = (days) => {
  const dates = []
  const today = new Date()
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }
  
  return dates
}

const goBack = () => {
  if (viewMode.value !== 'list') {
    viewMode.value = 'list'
  } else {
    router.push('/')
  }
}

// Contextual prompts
const showDiaryPrompt = ref(false)
const completedHabit = ref(null)
const navigateToDiary = () => {
  router.push('/diary')
}
</script>

<template>
  <div class="habits-container">
    <div class="habits-header">
      <button 
        class="btn-back"
        @click="goBack"
        v-voix="'zurück-button'"
        hint="Zurück zur vorherigen Ansicht">
        ←
      </button>
      <h1>Meine Gewohnheiten</h1>
      
      <div class="habits-actions" v-if="viewMode === 'list'">
        <button 
          class="btn btn-primary"
          @click="viewMode = 'create'"
          v-voix="'neue-gewohnheit-button'"
          hint="Klicken Sie hier, um eine neue Gewohnheit zu erstellen">
          + Neue Gewohnheit
        </button>
      </div>
    </div>
    
    <div class="habits-content">
      <!-- List View -->
      <div v-if="viewMode === 'list'" class="habits-list-view">
        <div class="habits-today">
          <h2>Heute: {{ currentDate }}</h2>
          <div class="habits-grid">
            <div 
              v-for="habit in habits"
              :key="habit.id"
              class="habit-card"
              :style="{ borderTopColor: habit.color }"
              v-voix="'gewohnheit-' + habit.id"
              :hint="habit.name + ': ' + habit.description">
              <div class="habit-card-header">
                <h3>{{ habit.name }}</h3>
                <span class="habit-category">{{ habit.category }}</span>
              </div>
              
              <p class="habit-description">{{ habit.description }}</p>
              
              <div class="habit-progress">
                <div class="habit-counter">
                  <button 
                    class="counter-btn"
                    @click="decrementHabitCompletion(habit)"
                    v-voix="'habit-decrement-' + habit.id"
                    hint="Klicken, um die Anzahl zu verringern">
                    -
                  </button>
                  <span>
                    {{ habit.history[currentDate] || 0 }} / {{ habit.target }}
                  </span>
                  <button 
                    class="counter-btn"
                    @click="toggleHabitCompletion(habit)"
                    v-voix="'habit-increment-' + habit.id"
                    hint="Klicken, um die Anzahl zu erhöhen">
                    +
                  </button>
                </div>
                
                <div 
                  class="habit-status"
                  :class="{ completed: isCompletedToday(habit) }"
                  v-voix="'habit-status-' + habit.id"
                  :hint="isCompletedToday(habit) ? 'Abgeschlossen' : 'Offen'">
                  {{ isCompletedToday(habit) ? '✓' : '○' }}
                </div>
              </div>
              
              <div class="habit-footer">
                <div class="habit-streak">
                  <span>Streak: {{ getStreak(habit) }} Tage</span>
                </div>
                <button 
                  class="habit-details-btn"
                  @click="selectHabit(habit.id)"
                  v-voix="'details-button-' + habit.id"
                  hint="Klicken für Details zu dieser Gewohnheit">
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Weekly overview -->
        <div class="habits-weekly">
          <h2>Wochenüberblick</h2>
          <div class="weekly-table">
            <div class="weekly-headers">
              <div class="weekly-header-cell">Gewohnheit</div>
              <div 
                v-for="date in getPreviousDates(7)" 
                :key="date" 
                class="weekly-header-cell">
                {{ date.split('-').slice(2).join('-') }}
              </div>
            </div>
            
            <div 
              v-for="habit in habits" 
              :key="habit.id" 
              class="weekly-row">
              <div class="weekly-cell habit-name">{{ habit.name }}</div>
              <div 
                v-for="date in getPreviousDates(7)" 
                :key="date"
                class="weekly-cell"
                :class="{ 
                  'completed': habit.history[date] && habit.history[date] >= habit.target,
                  'partial': habit.history[date] && habit.history[date] < habit.target
                }"
                v-voix="'weekly-cell-' + habit.id + '-' + date"
                :hint="habit.name + ' am ' + date + ': ' + (habit.history[date] ? habit.history[date] : 0) + ' von ' + habit.target">
                {{ habit.history[date] || '' }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Create View -->
      <div v-if="viewMode === 'create'" class="habits-create-view">
        <div class="card habit-form">
          <h2>Neue Gewohnheit erstellen</h2>
          
          <div class="form-group">
            <label for="habit-name" v-voix="'name-label'">Name</label>
            <input 
              type="text"
              id="habit-name"
              v-model="newHabit.name"
              placeholder="Name der Gewohnheit"
              v-voix="'name-input'"
              hint="Geben Sie einen Namen für Ihre neue Gewohnheit ein">
          </div>
          
          <div class="form-group">
            <label for="habit-description" v-voix="'beschreibung-label'">Beschreibung</label>
            <textarea
              id="habit-description"
              v-model="newHabit.description"
              placeholder="Beschreibe die Gewohnheit genauer..."
              v-voix="'beschreibung-input'"
              hint="Beschreiben Sie die Gewohnheit genauer">
            </textarea>
          </div>
          
          <div class="form-group">
            <label for="habit-frequency" v-voix="'häufigkeit-label'">Häufigkeit</label>
            <select 
              id="habit-frequency"
              v-model="newHabit.frequency"
              v-voix="'häufigkeit-input'"
              hint="Wählen Sie, wie oft Sie die Gewohnheit ausführen möchten">
              <option value="daily">Täglich</option>
              <option value="weekly">Wöchentlich</option>
              <option value="monthly">Monatlich</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="habit-target" v-voix="'ziel-label'">Ziel (Wie oft pro Tag/Woche/Monat)</label>
            <input 
              type="number"
              id="habit-target"
              v-model="newHabit.target"
              min="1"
              v-voix="'ziel-input'"
              hint="Geben Sie an, wie oft Sie die Gewohnheit pro Zeitraum ausführen möchten">
          </div>
          
          <div class="form-group">
            <label for="habit-category" v-voix="'kategorie-label'">Kategorie</label>
            <select 
              id="habit-category"
              v-model="newHabit.category"
              v-voix="'kategorie-input'"
              hint="Wählen Sie eine Kategorie für Ihre Gewohnheit">
              <option value="">Kategorie wählen</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="habit-color" v-voix="'farbe-label'">Farbe</label>
            <input 
              type="color"
              id="habit-color"
              v-model="newHabit.color"
              v-voix="'farbe-input'"
              hint="Wählen Sie eine Farbe für Ihre Gewohnheit">
          </div>
          
          <div class="form-actions">
            <button 
              class="btn btn-secondary"
              @click="viewMode = 'list'"
              v-voix="'abbrechen-button'"
              hint="Abbrechen und zurück zur Übersicht">
              Abbrechen
            </button>
            <button 
              class="btn btn-primary"
              @click="saveHabit"
              v-voix="'speichern-button'"
              hint="Klicken Sie hier, um die neue Gewohnheit zu speichern">
              Speichern
            </button>
          </div>
        </div>
      </div>
      
      <!-- Detail View -->
      <div v-if="viewMode === 'detail' && selectedHabit" class="habits-detail-view">
        <div class="card habit-detail">
          <div class="habit-detail-header" :style="{ backgroundColor: selectedHabit.color + '20' }">
            <h2>{{ selectedHabit.name }}</h2>
            <div class="habit-meta">
              <span class="habit-category">{{ selectedHabit.category }}</span>
              <span class="habit-frequency">
                {{ selectedHabit.target }}x {{ selectedHabit.frequency === 'daily' ? 'täglich' : 
                   selectedHabit.frequency === 'weekly' ? 'wöchentlich' : 'monatlich' }}
              </span>
            </div>
          </div>
          
          <div class="habit-detail-content">
            <p class="habit-description">{{ selectedHabit.description }}</p>
            
            <div class="habit-stats">
              <div class="stat-item">
                <span class="stat-value">{{ getStreak(selectedHabit) }}</span>
                <span class="stat-label">Aktuelle Streak</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ getCompletionRate(selectedHabit) }}%</span>
                <span class="stat-label">Abschlussrate</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ Object.keys(selectedHabit.history).length }}</span>
                <span class="stat-label">Tage getrackt</span>
              </div>
            </div>
            
            <div class="habit-history">
              <h3>Verlauf</h3>
              <!-- Here we could add a calendar or chart visualization -->
              <div class="history-timeline">
                <div 
                  v-for="date in getPreviousDates(14).reverse()" 
                  :key="date"
                  class="history-day"
                  :class="{
                    'completed': selectedHabit.history[date] && selectedHabit.history[date] >= selectedHabit.target,
                    'partial': selectedHabit.history[date] && selectedHabit.history[date] < selectedHabit.target,
                    'today': date === currentDate.value
                  }"
                  v-voix="'history-day-' + date"
                  :hint="'Am ' + date + ': ' + (selectedHabit.history[date] ? selectedHabit.history[date] : 0) + ' von ' + selectedHabit.target">
                  <div class="day-date">{{ date.split('-').slice(2).join('-') }}</div>
                  <div class="day-value">{{ selectedHabit.history[date] || 0 }}</div>
                </div>
              </div>
            </div>
            
            <button 
              class="btn btn-secondary"
              @click="viewMode = 'list'"
              v-voix="'zurück-zur-übersicht-button'"
              hint="Zurück zur Übersicht der Gewohnheiten">
              Zurück zur Übersicht
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Contextual Prompt -->
    <div v-if="showDiaryPrompt && completedHabit" class="contextual-prompt">
      <div class="prompt-content">
        <p>Glückwunsch! Du hast deine Gewohnheit "{{ completedHabit.name }}" abgeschlossen. Möchtest du einen Tagebucheintrag dazu erstellen?</p>
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
.habits-container {
  min-height: 100vh;
  padding: 2rem;
  background-color: var(--light-bg);
}

.habits-header {
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

.habits-header h1 {
  flex: 1;
}

.habits-actions {
  display: flex;
  gap: 1rem;
}

.habits-content {
  margin-bottom: 2rem;
}

/* List view styles */
.habits-today h2,
.habits-weekly h2 {
  margin-bottom: 1.5rem;
  color: var(--secondary-color);
}

.habits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.habit-card {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 1.5rem;
  border-top: 4px solid;
  display: flex;
  flex-direction: column;
}

.habit-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.habit-category {
  font-size: 0.8rem;
  background-color: #f0f0f0;
  padding: 0.3rem 0.8rem;
  border-radius: 1rem;
}

.habit-description {
  margin-bottom: 1.5rem;
  color: #555;
  flex-grow: 1;
}

.habit-progress {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.habit-counter {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.counter-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background-color: #f0f0f0;
  font-weight: bold;
  cursor: pointer;
}

.habit-status {
  font-size: 1.5rem;
}

.habit-status.completed {
  color: var(--primary-color);
}

.habit-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

.habit-streak {
  font-size: 0.9rem;
  color: #666;
}

.habit-details-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
}

/* Weekly table styles */
.weekly-table {
  background-color: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--box-shadow);
}

.weekly-headers {
  display: grid;
  grid-template-columns: 2fr repeat(7, 1fr);
  background-color: var(--secondary-color);
  color: white;
}

.weekly-header-cell {
  padding: 0.8rem;
  text-align: center;
  font-weight: 500;
}

.weekly-row {
  display: grid;
  grid-template-columns: 2fr repeat(7, 1fr);
  border-bottom: 1px solid #eee;
}

.weekly-cell {
  padding: 1rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.weekly-cell.habit-name {
  justify-content: flex-start;
  font-weight: 500;
}

.weekly-cell.completed {
  background-color: rgba(66, 184, 131, 0.2);
}

.weekly-cell.partial {
  background-color: rgba(255, 126, 103, 0.2);
}

/* Create view styles */
.habits-create-view {
  max-width: 800px;
  margin: 0 auto;
}

.habit-form {
  padding: 2rem;
}

.habit-form h2 {
  margin-bottom: 2rem;
  color: var(--secondary-color);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

/* Detail view styles */
.habits-detail-view {
  max-width: 800px;
  margin: 0 auto;
}

.habit-detail {
  padding: 0;
  overflow: hidden;
}

.habit-detail-header {
  padding: 2rem;
  margin-bottom: 1rem;
}

.habit-meta {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.habit-detail-content {
  padding: 2rem;
}

.habit-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 2rem 0;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: var(--border-radius);
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 600;
  color: var(--primary-color);
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.habit-history h3 {
  margin-bottom: 1.5rem;
  color: var(--secondary-color);
}

.history-timeline {
  display: flex;
  overflow-x: auto;
  gap: 0.5rem;
  padding-bottom: 1rem;
}

.history-day {
  min-width: 60px;
  height: 80px;
  border-radius: var(--border-radius);
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
}

.history-day.completed {
  background-color: rgba(66, 184, 131, 0.2);
}

.history-day.partial {
  background-color: rgba(255, 126, 103, 0.2);
}

.history-day.today {
  border: 2px solid var(--primary-color);
}

.day-date {
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}

.day-value {
  font-size: 1.5rem;
  font-weight: 600;
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
  .habits-grid {
    grid-template-columns: 1fr;
  }
  
  .weekly-table {
    overflow-x: auto;
  }
  
  .weekly-headers, .weekly-row {
    min-width: 800px;
  }
  
  .habit-stats {
    grid-template-columns: 1fr;
  }
  
  .contextual-prompt {
    width: calc(100% - 2rem);
    left: 1rem;
    right: 1rem;
  }
}
</style>