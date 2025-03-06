<script setup>
import { ref } from 'vue'

// Mock data for demo purposes
const recentNotes = ref([
  { id: 1, title: 'Project Meeting Notes', preview: 'Discussed new features for Q4...', date: '2025-03-05', tags: ['Work', 'Meetings'], pinned: true },
  { id: 2, title: 'Grocery List', preview: 'Milk, eggs, bread, fruits...', date: '2025-03-04', tags: ['Personal', 'Shopping'], pinned: true },
  { id: 3, title: 'Book Recommendations', preview: 'Science fiction titles to read next...', date: '2025-03-02', tags: ['Books', 'Personal'], pinned: false },
  { id: 4, title: 'Fitness Plan', preview: 'Monday: upper body, Tuesday: cardio...', date: '2025-02-28', tags: ['Health', 'Personal'], pinned: false },
  { id: 5, title: 'Travel Ideas', preview: 'Potential destinations for summer vacation...', date: '2025-02-25', tags: ['Travel', 'Personal'], pinned: false }
])

const reminders = ref([
  { id: 1, title: 'Team Meeting', date: '2025-03-07 14:00', completed: false },
  { id: 2, title: 'Submit Proposal', date: '2025-03-10 09:00', completed: false }
])

const quickNote = ref('')

const createQuickNote = () => {
  if (quickNote.value.trim()) {
    // In a real app, this would save to a store or API
    recentNotes.value.unshift({
      id: new Date().getTime(),
      title: quickNote.value.length > 20 ? `${quickNote.value.substring(0, 20)}...` : quickNote.value,
      preview: quickNote.value,
      date: new Date().toISOString().split('T')[0],
      tags: ['Quick Notes'],
      pinned: false
    })
    quickNote.value = ''
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric' 
  }).format(date)
}
</script>

<template>
  <div class="dashboard">
    <h1 class="dashboard-title">Dashboard</h1>
    
    <div class="dashboard-grid">
      <!-- Quick Note Widget -->
      <section class="dashboard-widget quick-note-widget">
        <h2 class="widget-title">Quick Note</h2>
        <div class="quick-note-input">
          <textarea 
            v-model="quickNote" 
            placeholder="Type a quick note here..." 
            v-voix="'Quick Note Input'"
            hint="Type here to create a new note quickly"></textarea>
          <button 
            @click="createQuickNote" 
            :disabled="!quickNote.trim()" 
            v-voix="'Save Quick Note'"
            hint="Click to save your quick note">
            Save
          </button>
        </div>
      </section>
      
      <!-- Pinned Notes Widget -->
      <section class="dashboard-widget pinned-notes-widget">
        <h2 class="widget-title">Pinned Notes</h2>
        <div class="notes-list">
          <div 
            v-for="note in recentNotes.filter(n => n.pinned)" 
            :key="note.id"
            class="note-card pinned"
            @click="$router.push(`/notes/${note.id}`)"
            v-voix="'Pinned Note: ' + note.title"
            hint="Click to open this note">
            <div class="note-header">
              <h3 class="note-title">{{ note.title }}</h3>
              <span class="note-date">{{ formatDate(note.date) }}</span>
            </div>
            <p class="note-preview">{{ note.preview }}</p>
            <div class="note-tags">
              <span 
                v-for="tag in note.tags" 
                :key="tag" 
                class="tag"
                v-voix="'Tag: ' + tag">
                {{ tag }}
              </span>
            </div>
          </div>
          <div v-if="!recentNotes.some(n => n.pinned)" class="empty-state">
            No pinned notes yet. Pin your important notes for quick access.
          </div>
        </div>
      </section>
      
      <!-- Reminders Widget -->
      <section class="dashboard-widget reminders-widget">
        <h2 class="widget-title">Upcoming Reminders</h2>
        <div class="reminders-list">
          <div 
            v-for="reminder in reminders" 
            :key="reminder.id"
            class="reminder-item"
            v-voix="'Reminder: ' + reminder.title + ' due on ' + reminder.date">
            <input 
              type="checkbox" 
              :id="'reminder-' + reminder.id" 
              v-model="reminder.completed"
              v-voix="'Complete Reminder ' + reminder.title"
              hint="Check to mark this reminder as completed">
            <label :for="'reminder-' + reminder.id">
              <span class="reminder-title">{{ reminder.title }}</span>
              <span class="reminder-date">{{ reminder.date }}</span>
            </label>
          </div>
          <div v-if="reminders.length === 0" class="empty-state">
            No upcoming reminders. Add reminders to your notes to see them here.
          </div>
        </div>
      </section>
      
      <!-- Recent Notes Widget -->
      <section class="dashboard-widget recent-notes-widget">
        <h2 class="widget-title">Recent Notes</h2>
        <div class="notes-list">
          <div 
            v-for="note in recentNotes.filter(n => !n.pinned).slice(0, 3)" 
            :key="note.id"
            class="note-card"
            @click="$router.push(`/notes/${note.id}`)"
            v-voix="'Recent Note: ' + note.title"
            hint="Click to open this note">
            <div class="note-header">
              <h3 class="note-title">{{ note.title }}</h3>
              <span class="note-date">{{ formatDate(note.date) }}</span>
            </div>
            <p class="note-preview">{{ note.preview }}</p>
            <div class="note-tags">
              <span 
                v-for="tag in note.tags" 
                :key="tag" 
                class="tag"
                v-voix="'Tag: ' + tag">
                {{ tag }}
              </span>
            </div>
          </div>
          <button 
            class="view-all-button" 
            @click="$router.push('/notes')"
            v-voix="'View All Notes'"
            hint="Click to see all your notes">
            View All Notes
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--color-heading);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.dashboard-widget {
  background-color: var(--color-background-soft);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.widget-title {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: var(--color-heading);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

/* Quick Note Widget */
.quick-note-widget {
  grid-column: span 1;
}

.quick-note-input {
  display: flex;
  flex-direction: column;
}

.quick-note-input textarea {
  height: 120px;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background);
  resize: none;
  margin-bottom: 0.75rem;
  font-family: inherit;
}

.quick-note-input button {
  align-self: flex-end;
  padding: 0.5rem 1rem;
  background-color: #4169E1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.quick-note-input button:hover:not(:disabled) {
  background-color: #3451B2;
}

.quick-note-input button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* Pinned Notes Widget */
.pinned-notes-widget {
  grid-column: span 1;
}

/* Reminders Widget */
.reminders-widget {
  grid-column: span 1;
}

/* Recent Notes Widget */
.recent-notes-widget {
  grid-column: span 2;
}

/* Note Cards */
.notes-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.note-card {
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.note-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.note-card.pinned {
  border-left: 4px solid #4169E1;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.note-title {
  font-size: 1rem;
  margin: 0;
  color: var(--color-heading);
  font-weight: 600;
}

.note-date {
  font-size: 0.8rem;
  color: var(--color-text-light);
}

.note-preview {
  font-size: 0.9rem;
  color: var(--color-text);
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  font-size: 0.75rem;
  background-color: var(--color-background-mute);
  color: var(--color-text);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
}

/* Reminders List */
.reminders-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.reminder-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: var(--color-background);
}

.reminder-item label {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  flex-grow: 1;
}

.reminder-title {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.reminder-date {
  font-size: 0.8rem;
  color: var(--color-text-light);
}

.reminder-item input[type="checkbox"]:checked + label .reminder-title {
  text-decoration: line-through;
  color: var(--color-text-light);
}

/* View All Button */
.view-all-button {
  margin-top: 1rem;
  padding: 0.5rem;
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text);
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 0.9rem;
}

.view-all-button:hover {
  background-color: var(--color-background-mute);
}

/* Empty State */
.empty-state {
  padding: 1.5rem;
  text-align: center;
  color: var(--color-text-light);
  font-style: italic;
  border: 1px dashed var(--color-border);
  border-radius: 4px;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .recent-notes-widget {
    grid-column: span 1;
  }
}
</style>
