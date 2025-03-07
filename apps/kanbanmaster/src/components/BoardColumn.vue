<script setup>
import { computed } from 'vue'
import TaskCard from './TaskCard.vue'
import draggable from 'vuedraggable'
import store from '@/store'

const props = defineProps({
  column: {
    type: Object,
    required: true
  },
  projectId: {
    type: String,
    required: true
  },
  tasks: {
    type: Array,
    required: true
  },
  allColumns: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['editTask', 'deleteTask', 'addTask', 'updateColumn', 'deleteColumn'])

// Sort tasks by creation date, newest first
const sortedTasks = computed(() => {
  return [...props.tasks].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt)
  })
})

function handleEditTask(task) {
  emit('editTask', task)
}

function handleDeleteTask(task) {
  if (confirm(`Are you sure you want to delete task "${task.title}"?`)) {
    store.deleteTask(props.projectId, task.id)
    emit('deleteTask', task.id)
  }
}

function handleAddTask() {
  emit('addTask', props.column.id)
}

function handleEditColumn() {
  emit('updateColumn', props.column)
}

function handleDeleteColumn() {
  if (confirm(`Are you sure you want to delete column "${props.column.name}"? All tasks in this column will also be deleted.`)) {
    store.deleteColumn(props.projectId, props.column.id)
    emit('deleteColumn', props.column.id)
  }
}

function onTaskMove(evt) {
  const taskId = evt.item.__draggable_context.element.id
  const newColumnId = props.column.id
  
  // Update the task's column ID in the store
  store.moveTask(props.projectId, taskId, newColumnId)
}
</script>

<template>
  <div class="board-column">
    <div class="column-header">
      <h3 class="column-title">{{ column.name }}</h3>
      <div class="column-actions">
        <button 
          @click="handleEditColumn" 
          class="column-action-button"
          v-voix="'edit-column-' + column.id"
          :hint="`Edit column ${column.name}`"
        >
          Edit
        </button>
        <button 
          @click="handleDeleteColumn" 
          class="column-action-button delete"
          v-voix="'delete-column-' + column.id"
          :hint="`Delete column ${column.name}`"
        >
          Delete
        </button>
      </div>
    </div>
    
    <div class="column-stats">
      <span class="task-count">{{ tasks.length }} tasks</span>
    </div>
    
    <!-- Simple accessibility description for screen readers -->
    <div v-voix:hidden="'column-description-' + column.id">
      <p>{{ column.name }} column. Each task has a dropdown menu to move it to a different column.</p>
    </div>
    
    <div class="column-body">
      <draggable
        :list="sortedTasks"
        group="tasks"
        item-key="id"
        ghost-class="ghost-card"
        @end="onTaskMove"
        v-bind="{ animation: 150 }"
      >
        <template #item="{ element }">
          <TaskCard 
            :task="element" 
            :columnName="column.name"
            :projectId="projectId"
            :allColumns="allColumns"
            @edit="handleEditTask" 
            @delete="handleDeleteTask" 
          />
        </template>
      </draggable>
      
      <div v-if="tasks.length === 0" class="empty-column">
        <p>No tasks in this column</p>
      </div>
    </div>
    
    <div class="column-footer">
      <button 
        @click="handleAddTask" 
        class="add-task-button"
        v-voix="'add-task-to-column-' + column.id"
        :hint="`Add new task to column ${column.name}`"
      >
        + Add Task
      </button>
    </div>
  </div>
</template>

<style scoped>
.board-column {
  background-color: var(--light-bg-color);
  border-radius: 8px;
  width: 300px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  max-height: 100%;
}

.column-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.column-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
}

.column-actions {
  display: flex;
  gap: 0.5rem;
}

.column-action-button {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-color);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.column-action-button:hover {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.column-action-button.delete:hover {
  background-color: var(--error-color);
  border-color: var(--error-color);
}

.column-stats {
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.8;
}


.column-body {
  padding: 0.5rem;
  flex: 1;
  overflow-y: auto;
  min-height: 100px;
}

.empty-column {
  padding: 1rem;
  text-align: center;
  color: var(--text-color);
  opacity: 0.6;
  font-size: 0.9rem;
}

.column-footer {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
}

.add-task-button {
  width: 100%;
  background-color: transparent;
  border: 1px dashed var(--border-color);
  color: var(--text-color);
  padding: 0.5rem;
  border-radius: 4px;
  opacity: 0.8;
  transition: all 0.2s;
}

.add-task-button:hover {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
  opacity: 1;
}

.ghost-card {
  opacity: 0.5;
  background: var(--hover-bg-color);
  border: 1px dashed var(--primary-color);
}
</style>