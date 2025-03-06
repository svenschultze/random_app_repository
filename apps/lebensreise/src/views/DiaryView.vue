<script setup>
import { ref, inject, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const diaryEntries = inject('diaryEntries')
const moodEntries = inject('moodEntries')

// New diary entry state
const newEntry = ref({
  id: '',
  date: new Date().toISOString().split('T')[0],
  title: '',
  content: '',
  tags: [],
  mood: null
})

// State for tags input
const tagInput = ref('')
const availableTags = ref(['Familie', 'Arbeit', 'Freizeit', 'Gesundheit', 'Lernen', 'Reisen'])

// View mode state (write or view)
const viewMode = ref('write')
const selectedEntryId = ref(null)

// Mock data for demo purposes
onMounted(() => {
  if (diaryEntries.value.length === 0) {
    diaryEntries.value = [
      {
        id: '1',
        date: '2025-03-05',
        title: 'Ein wunderbarer Tag',
        content: 'Heute habe ich einen langen Spaziergang im Park gemacht. Das Wetter war perfekt und ich habe viele Vögel gesehen.',
        tags: ['Freizeit', 'Gesundheit'],
        mood: 'happy'
      },
      {
        id: '2',
        date: '2025-03-04',
        title: 'Projektmeeting',
        content: 'Heute hatten wir ein langes Meeting zum neuen Projekt. Es war anstrengend, aber produktiv.',
        tags: ['Arbeit'],
        mood: 'neutral'
      }
    ]
  }
})

// Computed properties
const sortedEntries = computed(() => {
  return [...diaryEntries.value].sort((a, b) => new Date(b.date) - new Date(a.date))
})

const selectedEntry = computed(() => {
  return diaryEntries.value.find(entry => entry.id === selectedEntryId.value)
})

// Methods
const addTag = () => {
  if (tagInput.value && !newEntry.value.tags.includes(tagInput.value)) {
    newEntry.value.tags.push(tagInput.value)
    tagInput.value = ''
  }
}

const removeTag = (tag) => {
  newEntry.value.tags = newEntry.value.tags.filter(t => t !== tag)
}

const saveEntry = () => {
  if (newEntry.value.title && newEntry.value.content) {
    const entryToSave = {
      ...newEntry.value,
      id: Date.now().toString(),
      date: newEntry.value.date || new Date().toISOString().split('T')[0]
    }
    
    diaryEntries.value.push(entryToSave)
    
    // Also add mood data if provided
    if (newEntry.value.mood) {
      moodEntries.value.push({
        id: Date.now().toString(),
        date: newEntry.value.date,
        mood: newEntry.value.mood,
        note: `Aus Tagebucheintrag: ${newEntry.value.title}`
      })
    }
    
    // Reset form
    newEntry.value = {
      id: '',
      date: new Date().toISOString().split('T')[0],
      title: '',
      content: '',
      tags: [],
      mood: null
    }
    
    // Show contextual prompt
    showMoodPrompt.value = true
  }
}

const selectEntry = (id) => {
  selectedEntryId.value = id
  viewMode.value = 'read'
}

const goBack = () => {
  if (viewMode.value === 'read') {
    viewMode.value = 'write'
  } else {
    router.push('/')
  }
}

// Contextual prompts
const showMoodPrompt = ref(false)
const navigateToMood = () => {
  router.push('/mood')
}
</script>

<template>
  <div class="diary-container">
    <div class="diary-header">
      <button 
        class="btn-back"
        @click="goBack"
        v-voix="'zurück-button'"
        hint="Zurück zur vorherigen Ansicht">
        ←
      </button>
      <h1>Mein Tagebuch</h1>
    </div>
    
    <div class="diary-content">
      <!-- Write Mode -->
      <div v-if="viewMode === 'write'" class="diary-write">
        <div class="card diary-form">
          <div class="form-group">
            <label for="entry-date" v-voix="'datum-label'">Datum</label>
            <input 
              type="date"
              id="entry-date"
              v-model="newEntry.date"
              v-voix="'datum-input'"
              hint="Wählen Sie das Datum für Ihren Eintrag">
          </div>
          
          <div class="form-group">
            <label for="entry-title" v-voix="'titel-label'">Titel</label>
            <input 
              type="text"
              id="entry-title"
              v-model="newEntry.title"
              placeholder="Gib deinem Tag einen Titel"
              v-voix="'titel-input'"
              hint="Geben Sie einen Titel für Ihren Tagebucheintrag ein">
          </div>
          
          <div class="form-group">
            <label for="entry-content" v-voix="'inhalt-label'">Eintrag</label>
            <textarea
              id="entry-content"
              v-model="newEntry.content"
              placeholder="Wie war dein Tag? Was hast du erlebt?"
              v-voix="'inhalt-input'"
              hint="Beschreiben Sie Ihren Tag und Ihre Erlebnisse">
            </textarea>
          </div>
          
          <div class="form-group">
            <label v-voix="'stimmung-label'">Stimmung</label>
            <div class="mood-selector">
              <button 
                class="mood-btn"
                :class="{ active: newEntry.mood === 'happy' }"
                @click="newEntry.mood = 'happy'"
                v-voix="'stimmung-glücklich'"
                hint="Wählen Sie eine glückliche Stimmung">
                😊
              </button>
              <button 
                class="mood-btn"
                :class="{ active: newEntry.mood === 'neutral' }"
                @click="newEntry.mood = 'neutral'"
                v-voix="'stimmung-neutral'"
                hint="Wählen Sie eine neutrale Stimmung">
                😐
              </button>
              <button 
                class="mood-btn"
                :class="{ active: newEntry.mood === 'sad' }"
                @click="newEntry.mood = 'sad'"
                v-voix="'stimmung-traurig'"
                hint="Wählen Sie eine traurige Stimmung">
                😔
              </button>
              <button 
                class="mood-btn"
                :class="{ active: newEntry.mood === 'excited' }"
                @click="newEntry.mood = 'excited'"
                v-voix="'stimmung-aufgeregt'"
                hint="Wählen Sie eine aufgeregte Stimmung">
                🤩
              </button>
              <button 
                class="mood-btn"
                :class="{ active: newEntry.mood === 'stressed' }"
                @click="newEntry.mood = 'stressed'"
                v-voix="'stimmung-gestresst'"
                hint="Wählen Sie eine gestresste Stimmung">
                😩
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label for="entry-tags" v-voix="'tags-label'">Tags</label>
            <div class="tags-input">
              <input 
                type="text"
                id="entry-tags"
                v-model="tagInput"
                placeholder="Tag hinzufügen (Enter drücken)"
                @keyup.enter="addTag"
                v-voix="'tags-input'"
                hint="Geben Sie Tags ein, um Ihren Eintrag zu kategorisieren">
              <button 
                class="btn btn-small"
                @click="addTag"
                v-voix="'tag-hinzufügen-button'"
                hint="Klicken, um den eingegebenen Tag hinzuzufügen">
                +
              </button>
            </div>
            
            <div class="tags-suggestions">
              <span v-for="tag in availableTags" :key="tag" @click="tagInput = tag" class="tag-suggestion" v-voix="'tag-vorschlag-' + tag">{{ tag }}</span>
            </div>
            
            <div class="selected-tags">
              <span v-for="tag in newEntry.tags" :key="tag" class="tag">
                {{ tag }}
                <button 
                  class="tag-remove"
                  @click="removeTag(tag)"
                  v-voix="'tag-entfernen-' + tag"
                  hint="Tag entfernen">
                  ×
                </button>
              </span>
            </div>
          </div>
          
          <button 
            class="btn btn-primary save-btn"
            @click="saveEntry"
            v-voix="'eintrag-speichern-button'"
            hint="Klicken Sie hier, um Ihren Tagebucheintrag zu speichern">
            Eintrag speichern
          </button>
        </div>
        
        <!-- Recent entries sidebar -->
        <div class="diary-recent">
          <h3>Letzte Einträge</h3>
          <div class="entry-list">
            <div 
              v-for="entry in sortedEntries"
              :key="entry.id"
              class="entry-item"
              @click="selectEntry(entry.id)"
              v-voix="'eintrag-' + entry.id"
              :hint="'Eintrag vom ' + entry.date + ': ' + entry.title">
              <div class="entry-date">{{ entry.date }}</div>
              <div class="entry-title">{{ entry.title }}</div>
              <div class="entry-tags">
                <span v-for="tag in entry.tags" :key="tag" class="entry-tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Read Mode -->
      <div v-if="viewMode === 'read' && selectedEntry" class="diary-read">
        <div class="entry-detail card">
          <div class="entry-header">
            <div class="entry-date">{{ selectedEntry.date }}</div>
            <h2 class="entry-title">{{ selectedEntry.title }}</h2>
            <div class="entry-mood">
              <span v-if="selectedEntry.mood === 'happy'">😊</span>
              <span v-if="selectedEntry.mood === 'neutral'">😐</span>
              <span v-if="selectedEntry.mood === 'sad'">😔</span>
              <span v-if="selectedEntry.mood === 'excited'">🤩</span>
              <span v-if="selectedEntry.mood === 'stressed'">😩</span>
            </div>
          </div>
          
          <div class="entry-content">
            {{ selectedEntry.content }}
          </div>
          
          <div class="entry-footer">
            <div class="entry-tags">
              <span v-for="tag in selectedEntry.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
          
          <button 
            class="btn btn-secondary"
            @click="viewMode = 'write'"
            v-voix="'zurück-zur-übersicht-button'"
            hint="Zurück zur Übersicht Ihrer Einträge">
            Zurück zur Übersicht
          </button>
        </div>
      </div>
    </div>
    
    <!-- Contextual Prompt -->
    <div v-if="showMoodPrompt" class="contextual-prompt">
      <div class="prompt-content">
        <p>Möchtest du auch deine Stimmung für heute festhalten?</p>
        <div class="prompt-actions">
          <button 
            class="btn btn-primary"
            @click="navigateToMood"
            v-voix="'ja-zur-stimmung-button'"
            hint="Klicken Sie hier, um zur Stimmungserfassung zu gehen">
            Ja, zur Stimmungserfassung
          </button>
          <button 
            class="btn btn-secondary"
            @click="showMoodPrompt = false"
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
.diary-container {
  min-height: 100vh;
  padding: 2rem;
  background-color: var(--light-bg);
}

.diary-header {
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

.diary-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.diary-write {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

.diary-form {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.mood-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.mood-btn {
  font-size: 2rem;
  background: none;
  border: 2px solid #ddd;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mood-btn.active {
  border-color: var(--primary-color);
  transform: scale(1.1);
}

.tags-input {
  display: flex;
  gap: 0.5rem;
}

.btn-small {
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
}

.tags-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
}

.tag-suggestion {
  padding: 0.3rem 0.8rem;
  background-color: #f0f0f0;
  border-radius: 1rem;
  font-size: 0.8rem;
  cursor: pointer;
}

.tag-suggestion:hover {
  background-color: #e0e0e0;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.tag {
  display: flex;
  align-items: center;
  padding: 0.3rem 0.8rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 1rem;
  font-size: 0.8rem;
}

.tag-remove {
  background: none;
  border: none;
  color: white;
  margin-left: 0.3rem;
  cursor: pointer;
  font-size: 1rem;
}

.save-btn {
  width: 100%;
}

.diary-recent {
  padding: 1.5rem;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

.diary-recent h3 {
  margin-bottom: 1.5rem;
  color: var(--secondary-color);
}

.entry-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.entry-item {
  padding: 1rem;
  border-left: 3px solid var(--primary-color);
  background-color: #f9f9f9;
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.entry-item:hover {
  background-color: #f0f0f0;
  transform: translateX(5px);
}

.entry-date {
  font-size: 0.8rem;
  color: #777;
}

.entry-title {
  font-weight: 600;
  margin: 0.3rem 0;
}

.entry-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.entry-tag {
  padding: 0.2rem 0.5rem;
  background-color: #eee;
  border-radius: 0.5rem;
  font-size: 0.7rem;
}

/* Read mode styles */
.diary-read {
  max-width: 800px;
  margin: 0 auto;
}

.entry-detail {
  padding: 2.5rem;
}

.entry-header {
  margin-bottom: 2rem;
  position: relative;
}

.entry-mood {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 2rem;
}

.entry-content {
  margin-bottom: 2rem;
  line-height: 1.8;
  white-space: pre-line;
}

.entry-footer {
  margin-bottom: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
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
  .diary-write {
    grid-template-columns: 1fr;
  }
  
  .contextual-prompt {
    width: calc(100% - 2rem);
    left: 1rem;
    right: 1rem;
  }
}
</style>