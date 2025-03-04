<script setup>
import { ref, computed } from 'vue'

// Goals categories
const categories = [
  { id: 'short-term', label: 'Short-term (0-6 months)', color: '#42b983' },
  { id: 'mid-term', label: 'Mid-term (6-18 months)', color: '#3498db' },
  { id: 'long-term', label: 'Long-term (1.5-5 years)', color: '#9b59b6' },
]

// Sample goals data
const goals = ref([
  { 
    id: 1, 
    title: 'Complete UX certification',
    description: 'Finish the advanced UX design certification from Nielsen Norman Group',
    category: 'short-term',
    deadline: '2025-06-15',
    progress: 65,
    tasks: [
      { id: 1, title: 'Complete module 1-3', completed: true },
      { id: 2, title: 'Complete module 4-6', completed: true },
      { id: 3, title: 'Complete module 7-9', completed: false },
      { id: 4, title: 'Take final certification exam', completed: false },
    ]
  },
  { 
    id: 2, 
    title: 'Lead design for a major project',
    description: 'Take on leadership role for a significant product redesign initiative',
    category: 'mid-term',
    deadline: '2025-09-30',
    progress: 30,
    tasks: [
      { id: 1, title: 'Develop leadership skills through training', completed: true },
      { id: 2, title: 'Express interest to manager', completed: true },
      { id: 3, title: 'Shadow current design lead', completed: false },
      { id: 4, title: 'Create portfolio of leadership activities', completed: false },
    ]
  },
  { 
    id: 3, 
    title: 'Become a senior designer',
    description: 'Advance to a senior UX designer position within the company',
    category: 'long-term',
    deadline: '2027-03-01',
    progress: 20,
    tasks: [
      { id: 1, title: 'Create professional development plan', completed: true },
      { id: 2, title: 'Build portfolio of complex projects', completed: false },
      { id: 3, title: 'Develop mentoring skills', completed: false },
      { id: 4, title: 'Learn advanced research methodologies', completed: false },
      { id: 5, title: 'Present at industry conferences', completed: false },
    ]
  }
])

// New goal form
const newGoal = ref({
  title: '',
  description: '',
  category: '',
  deadline: '',
  tasks: []
})

// New task for form
const newTask = ref('')

// Filter and sort options
const filter = ref({
  category: 'all',
  sort: 'deadline'
})

// Active goal being edited
const activeGoal = ref(null)
const isAddingGoal = ref(false)

// Filtered goals based on selected category
const filteredGoals = computed(() => {
  let result = [...goals.value]
  
  // Apply category filter
  if (filter.value.category !== 'all') {
    result = result.filter(goal => goal.category === filter.value.category)
  }
  
  // Apply sorting
  if (filter.value.sort === 'deadline') {
    result.sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
  } else if (filter.value.sort === 'progress') {
    result.sort((a, b) => b.progress - a.progress)
  }
  
  return result
})

// Calculate goal completion
const calculateProgress = (goalId) => {
  const goal = goals.value.find(g => g.id === goalId)
  if (!goal || goal.tasks.length === 0) return 0
  
  const completedTasks = goal.tasks.filter(task => task.completed).length
  return Math.round((completedTasks / goal.tasks.length) * 100)
}

// Toggle task completion
const toggleTaskCompletion = (goalId, taskId) => {
  const goal = goals.value.find(g => g.id === goalId)
  if (!goal) return
  
  const task = goal.tasks.find(t => t.id === taskId)
  if (task) {
    task.completed = !task.completed
    
    // Update goal progress
    goal.progress = calculateProgress(goalId)
  }
}

// Open goal details for editing
const openGoalDetails = (goal) => {
  activeGoal.value = JSON.parse(JSON.stringify(goal)) // Clone to avoid direct mutation
}

// Close goal details
const closeGoalDetails = () => {
  activeGoal.value = null
}

// Save goal changes
const saveGoalChanges = () => {
  const index = goals.value.findIndex(g => g.id === activeGoal.value.id)
  if (index !== -1) {
    goals.value[index] = { ...activeGoal.value }
    closeGoalDetails()
  }
}

// Add new task to form
const addTaskToForm = () => {
  if (newTask.value.trim()) {
    if (activeGoal.value) {
      // Add to existing goal
      const maxId = activeGoal.value.tasks.length > 0 
        ? Math.max(...activeGoal.value.tasks.map(t => t.id)) 
        : 0
      
      activeGoal.value.tasks.push({
        id: maxId + 1,
        title: newTask.value,
        completed: false
      })
    } else {
      // Add to new goal form
      newGoal.value.tasks.push({
        id: newGoal.value.tasks.length + 1,
        title: newTask.value,
        completed: false
      })
    }
    newTask.value = ''
  }
}

// Remove task from form
const removeTaskFromForm = (index) => {
  if (activeGoal.value) {
    activeGoal.value.tasks.splice(index, 1)
  } else {
    newGoal.value.tasks.splice(index, 1)
  }
}

// Open new goal form
const openNewGoalForm = () => {
  isAddingGoal.value = true
  newGoal.value = {
    title: '',
    description: '',
    category: 'short-term',
    deadline: '',
    tasks: []
  }
}

// Close new goal form
const closeNewGoalForm = () => {
  isAddingGoal.value = false
}

// Add new goal
const addNewGoal = () => {
  if (newGoal.value.title && newGoal.value.category && newGoal.value.deadline) {
    const maxId = goals.value.length > 0 ? Math.max(...goals.value.map(g => g.id)) : 0
    
    goals.value.push({
      id: maxId + 1,
      title: newGoal.value.title,
      description: newGoal.value.description,
      category: newGoal.value.category,
      deadline: newGoal.value.deadline,
      progress: 0,
      tasks: newGoal.value.tasks
    })
    
    closeNewGoalForm()
  }
}

// Delete goal
const deleteGoal = (goalId) => {
  const index = goals.value.findIndex(g => g.id === goalId)
  if (index !== -1) {
    goals.value.splice(index, 1)
    closeGoalDetails()
  }
}
</script>

<template>
  <div class="goals-container">
    <div class="goals-header">
      <h1 v-voix="'Goals Management Title'">Professional Goals</h1>
      <button 
        class="btn-primary add-goal-btn" 
        @click="openNewGoalForm"
        v-voix="'Add New Goal Button'"
        hint="Create a new professional goal"
      >
        <span class="icon">+</span> Add Goal
      </button>
    </div>

    <!-- Filters and Sort Options -->
    <div class="goals-filters">
      <div class="filter-group">
        <label for="categoryFilter" v-voix="'Filter By Category Label'">Filter by category:</label>
        <select 
          id="categoryFilter" 
          v-model="filter.category"
          v-voix="'Category Filter Dropdown'"
          hint="Filter goals by their timeframe category"
        >
          <option value="all">All categories</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.label }}
          </option>
        </select>
      </div>
      
      <div class="filter-group">
        <label for="sortOption" v-voix="'Sort Goals Label'">Sort by:</label>
        <select 
          id="sortOption" 
          v-model="filter.sort"
          v-voix="'Sort Options Dropdown'"
          hint="Choose how to sort the displayed goals"
        >
          <option value="deadline">Deadline (closest first)</option>
          <option value="progress">Progress (highest first)</option>
        </select>
      </div>
    </div>

    <!-- Goals List -->
    <div class="goals-list" v-if="!activeGoal && !isAddingGoal">
      <div 
        v-for="goal in filteredGoals" 
        :key="goal.id"
        class="goal-card"
        :class="goal.category"
      >
        <div class="goal-header">
          <h3 class="goal-title">{{ goal.title }}</h3>
          <button 
            class="btn-icon" 
            @click="openGoalDetails(goal)"
            v-voix="`Edit Goal ${goal.id}`"
            :hint="`Edit details for goal: ${goal.title}`"
          >
            ✏️
          </button>
        </div>
        
        <p class="goal-description">{{ goal.description }}</p>
        
        <div class="goal-details">
          <div class="goal-category">
            <span class="category-dot" :style="{ backgroundColor: categories.find(c => c.id === goal.category)?.color }"></span>
            {{ categories.find(c => c.id === goal.category)?.label }}
          </div>
          
          <div class="goal-deadline">
            Deadline: {{ new Date(goal.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }}
          </div>
        </div>
        
        <div class="goal-progress">
          <div class="progress-label">
            <span>Progress</span>
            <span>{{ goal.progress }}%</span>
          </div>
          <div class="progress-bar">
            <div 
              class="progress-indicator" 
              :style="{ 
                width: `${goal.progress}%`,
                backgroundColor: categories.find(c => c.id === goal.category)?.color 
              }"
            ></div>
          </div>
        </div>
        
        <div class="goal-tasks">
          <div class="tasks-header" v-voix="`Goal ${goal.id} Tasks`">
            Tasks ({{ goal.tasks.filter(t => t.completed).length }}/{{ goal.tasks.length }})
          </div>
          <ul class="tasks-list">
            <li 
              v-for="task in goal.tasks.slice(0, 3)" 
              :key="task.id"
              class="task-item"
              :class="{ completed: task.completed }"
            >
              <label class="task-checkbox-label">
                <input 
                  type="checkbox" 
                  :checked="task.completed" 
                  @change="toggleTaskCompletion(goal.id, task.id)"
                  v-voix="`Toggle Task ${task.id} Completion For Goal ${goal.id}`"
                  :hint="`Mark task '${task.title}' as ${task.completed ? 'incomplete' : 'complete'}`"
                />
                <span class="task-checkbox"></span>
                <span class="task-title">{{ task.title }}</span>
              </label>
            </li>
          </ul>
          <div v-if="goal.tasks.length > 3" class="more-tasks">
            +{{ goal.tasks.length - 3 }} more tasks
          </div>
        </div>
      </div>
      
      <div v-if="filteredGoals.length === 0" class="no-goals-message" v-voix="'No Goals Message'">
        No goals found. Create your first professional goal!
      </div>
    </div>

    <!-- Goal Detail/Edit View -->
    <div class="goal-detail-view" v-if="activeGoal">
      <div class="goal-detail-header">
        <h2 v-voix="'Edit Goal Details Title'">Edit Goal</h2>
        <button 
          class="btn-icon close-btn"
          @click="closeGoalDetails"
          v-voix="'Close Goal Edit View'"
          hint="Close the goal editing view without saving changes"
        >
          ×
        </button>
      </div>
      
      <div class="form-group">
        <label for="editTitle" v-voix="'Edit Goal Title Label'">Goal title</label>
        <input 
          id="editTitle" 
          type="text" 
          v-model="activeGoal.title"
          v-voix="'Goal Title Input Field'"
          hint="Edit the title of this professional goal"
        />
      </div>
      
      <div class="form-group">
        <label for="editDescription" v-voix="'Edit Goal Description Label'">Description</label>
        <textarea 
          id="editDescription" 
          v-model="activeGoal.description" 
          rows="3"
          v-voix="'Goal Description Input Field'"
          hint="Edit the detailed description of this goal"
        ></textarea>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="editCategory" v-voix="'Edit Goal Category Label'">Category</label>
          <select 
            id="editCategory" 
            v-model="activeGoal.category"
            v-voix="'Goal Category Dropdown'"
            hint="Change the timeframe category for this goal"
          >
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.label }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="editDeadline" v-voix="'Edit Goal Deadline Label'">Deadline</label>
          <input 
            id="editDeadline" 
            type="date" 
            v-model="activeGoal.deadline"
            v-voix="'Goal Deadline Input Field'"
            hint="Change the target completion date for this goal"
          />
        </div>
      </div>
      
      <div class="form-group tasks-edit-section">
        <label v-voix="'Goal Tasks Section'">Tasks</label>
        
        <ul class="edit-tasks-list">
          <li v-for="(task, index) in activeGoal.tasks" :key="task.id" class="edit-task-item">
            <div class="task-content">
              <label class="task-checkbox-label">
                <input 
                  type="checkbox" 
                  v-model="task.completed"
                  v-voix="`Toggle Task ${task.id} Completion`"
                  :hint="`Mark task '${task.title}' as ${task.completed ? 'incomplete' : 'complete'}`"
                />
                <span class="task-checkbox"></span>
                <span class="task-title">{{ task.title }}</span>
              </label>
            </div>
            <button 
              class="btn-icon delete-task-btn"
              @click="removeTaskFromForm(index)"
              v-voix="`Delete Task ${task.id}`"
              :hint="`Remove task '${task.title}' from this goal`"
            >
              ×
            </button>
          </li>
        </ul>
        
        <div class="add-task-form">
          <input 
            type="text" 
            v-model="newTask" 
            placeholder="Add a new task"
            @keyup.enter="addTaskToForm"
            v-voix="'New Task Input Field'"
            hint="Type a new task and press Enter to add it"
          />
          <button 
            class="btn-secondary add-task-btn"
            @click="addTaskToForm"
            v-voix="'Add Task Button'"
            hint="Add the entered task to this goal"
          >
            Add
          </button>
        </div>
      </div>
      
      <div class="goal-actions">
        <button 
          class="btn-danger"
          @click="deleteGoal(activeGoal.id)"
          v-voix="'Delete Goal Button'"
          hint="Permanently delete this goal"
        >
          Delete
        </button>
        <button 
          class="btn-secondary"
          @click="closeGoalDetails"
          v-voix="'Cancel Edit Button'"
          hint="Cancel editing and discard changes"
        >
          Cancel
        </button>
        <button 
          class="btn-primary"
          @click="saveGoalChanges"
          v-voix="'Save Changes Button'"
          hint="Save all changes made to this goal"
        >
          Save Changes
        </button>
      </div>
    </div>

    <!-- New Goal Form -->
    <div class="goal-detail-view" v-if="isAddingGoal">
      <div class="goal-detail-header">
        <h2 v-voix="'Add New Goal Title'">Add New Goal</h2>
        <button 
          class="btn-icon close-btn"
          @click="closeNewGoalForm"
          v-voix="'Close New Goal Form'"
          hint="Close the new goal form without saving"
        >
          ×
        </button>
      </div>
      
      <div class="form-group">
        <label for="newTitle" v-voix="'New Goal Title Label'">Goal title</label>
        <input 
          id="newTitle" 
          type="text" 
          v-model="newGoal.title"
          v-voix="'New Goal Title Input Field'"
          hint="Enter a title for your new professional goal"
        />
      </div>
      
      <div class="form-group">
        <label for="newDescription" v-voix="'New Goal Description Label'">Description</label>
        <textarea 
          id="newDescription" 
          v-model="newGoal.description" 
          rows="3"
          v-voix="'New Goal Description Input Field'"
          hint="Enter a detailed description of your goal"
        ></textarea>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="newCategory" v-voix="'New Goal Category Label'">Category</label>
          <select 
            id="newCategory" 
            v-model="newGoal.category"
            v-voix="'New Goal Category Dropdown'"
            hint="Select a timeframe category for your goal"
          >
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.label }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="newDeadline" v-voix="'New Goal Deadline Label'">Deadline</label>
          <input 
            id="newDeadline" 
            type="date" 
            v-model="newGoal.deadline"
            v-voix="'New Goal Deadline Input Field'"
            hint="Set a target completion date for your goal"
          />
        </div>
      </div>
      
      <div class="form-group tasks-edit-section">
        <label v-voix="'New Goal Tasks Section'">Tasks</label>
        
        <ul class="edit-tasks-list">
          <li v-for="(task, index) in newGoal.tasks" :key="task.id" class="edit-task-item">
            <div class="task-content">
              <span class="task-title">{{ task.title }}</span>
            </div>
            <button 
              class="btn-icon delete-task-btn"
              @click="removeTaskFromForm(index)"
              v-voix="`Delete New Task ${index + 1}`"
              :hint="`Remove task '${task.title}' from this new goal`"
            >
              ×
            </button>
          </li>
        </ul>
        
        <div class="add-task-form">
          <input 
            type="text" 
            v-model="newTask" 
            placeholder="Add a new task"
            @keyup.enter="addTaskToForm"
            v-voix="'New Task For New Goal Input Field'"
            hint="Type a new task and press Enter to add it to this new goal"
          />
          <button 
            class="btn-secondary add-task-btn"
            @click="addTaskToForm"
            v-voix="'Add Task To New Goal Button'"
            hint="Add the entered task to this new goal"
          >
            Add
          </button>
        </div>
      </div>
      
      <div class="goal-actions">
        <button 
          class="btn-secondary"
          @click="closeNewGoalForm"
          v-voix="'Cancel New Goal Button'"
          hint="Cancel creating a new goal"
        >
          Cancel
        </button>
        <button 
          class="btn-primary"
          @click="addNewGoal"
          v-voix="'Create Goal Button'"
          hint="Create the new professional goal"
        >
          Create Goal
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.goals-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.goals-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.goals-header h1 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0;
}

.add-goal-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.goals-filters {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  color: #2c3e50;
}

.filter-group select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.goals-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.goal-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  border-top: 4px solid transparent;
}

.goal-card.short-term {
  border-top-color: #42b983;
}

.goal-card.mid-term {
  border-top-color: #3498db;
}

.goal-card.long-term {
  border-top-color: #9b59b6;
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.goal-title {
  font-size: 1.2rem;
  margin: 0;
  color: #2c3e50;
}

.goal-description {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.goal-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.85rem;
}

.goal-category {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.goal-deadline {
  color: #666;
}

.goal-progress {
  margin-bottom: 1.5rem;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-indicator {
  height: 100%;
  transition: width 0.3s ease;
}

.goal-tasks {
  background-color: #f5f7fa;
  border-radius: 6px;
  padding: 1rem;
}

.tasks-header {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #2c3e50;
}

.tasks-list {
  padding: 0;
  margin: 0;
  list-style-type: none;
}

.task-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.task-item:last-child {
  border-bottom: none;
}

.task-item.completed .task-title {
  text-decoration: line-through;
  color: #999;
}

.task-checkbox-label {
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  user-select: none;
}

.task-checkbox {
  width: 16px;
  height: 16px;
  background-color: #eee;
  border-radius: 4px;
  margin-right: 10px;
  display: inline-block;
  position: relative;
}

.task-checkbox-label input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.task-checkbox-label input:checked ~ .task-checkbox {
  background-color: #42b983;
}

.task-checkbox:after {
  content: "";
  position: absolute;
  display: none;
}

.task-checkbox-label input:checked ~ .task-checkbox:after {
  display: block;
}

.task-checkbox-label .task-checkbox:after {
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.task-title {
  font-size: 0.9rem;
}

.more-tasks {
  text-align: center;
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.5rem;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.btn-icon:hover {
  background-color: #f5f5f5;
}

.no-goals-message {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: #666;
}

.goal-detail-view {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.goal-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.goal-detail-header h2 {
  font-size: 1.5rem;
  margin: 0;
  color: #2c3e50;
}

.close-btn {
  font-size: 1.8rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.tasks-edit-section {
  background-color: #f5f7fa;
  padding: 1.5rem;
  border-radius: 6px;
}

.edit-tasks-list {
  padding: 0;
  margin: 0 0 1.5rem 0;
  list-style-type: none;
}

.edit-task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
  background-color: white;
  margin-bottom: 0.5rem;
  border-radius: 4px;
}

.add-task-form {
  display: flex;
  gap: 0.5rem;
}

.add-task-form input {
  flex: 1;
}

.add-task-btn {
  white-space: nowrap;
}

.delete-task-btn {
  color: #e74c3c;
}

.goal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-primary {
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #3aa876;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-danger:hover {
  background-color: #c0392b;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .goals-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .goal-actions {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary,
  .btn-danger {
    width: 100%;
    text-align: center;
  }
}
</style>