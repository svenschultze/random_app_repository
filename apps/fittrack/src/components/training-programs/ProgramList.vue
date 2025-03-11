<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getPredefinedPrograms, getUserPrograms, activateProgram } from '@/services/trainingProgramService';

const router = useRouter();
const predefinedPrograms = ref([]);
const userPrograms = ref([]);
const activeTab = ref('predefined');

// Load data on mount
onMounted(() => {
  loadPrograms();
});

// Load available programs
const loadPrograms = () => {
  predefinedPrograms.value = getPredefinedPrograms();
  userPrograms.value = getUserPrograms();
};

// Start a training program
const startProgram = (programId) => {
  const program = activateProgram(programId);
  if (program) {
    router.push({ name: 'program-detail', params: { id: program.id } });
  }
};

// View program details
const viewProgram = (programId) => {
  router.push({ name: 'program-detail', params: { id: programId } });
};

// Filter active programs
const getActivePrograms = () => {
  return userPrograms.value.filter(program => program.active && !program.completed);
};

// Filter completed programs
const getCompletedPrograms = () => {
  return userPrograms.value.filter(program => program.completed);
};

// Calculate program duration in weeks
const getProgramDuration = (program) => {
  const totalDays = program.phases.reduce((sum, phase) => sum + phase.duration, 0);
  return Math.ceil(totalDays / 7);
};

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};
</script>

<template>
  <div class="program-list">
    <h2>Training Programs</h2>
    
    <div class="tabs">
      <button 
        :class="{ active: activeTab === 'predefined' }" 
        @click="activeTab = 'predefined'"
        v-voix="'tab-available-programs'"
        hint="Switch to available training program templates tab">
        Available Programs
      </button>
      <button 
        :class="{ active: activeTab === 'active' }" 
        @click="activeTab = 'active'"
        v-voix="'tab-active-programs'"
        hint="Switch to your active training programs tab">
        Active Programs
      </button>
      <button 
        :class="{ active: activeTab === 'completed' }" 
        @click="activeTab = 'completed'"
        v-voix="'tab-completed-programs'"
        hint="Switch to your completed training programs tab">
        Completed
      </button>
    </div>
    
    <!-- Predefined Programs -->
    <div v-if="activeTab === 'predefined'" class="program-grid">
      <div v-for="program in predefinedPrograms" :key="program.id" class="program-card">
        <h3>{{ program.name }}</h3>
        <p class="program-description">{{ program.description }}</p>
        <div class="program-meta">
          <span class="program-duration">
            {{ getProgramDuration(program) }} weeks
          </span>
          <span class="program-phases">
            {{ program.phases.length }} phases
          </span>
        </div>
        <div class="program-actions">
          <button 
            class="btn btn-primary" 
            @click="startProgram(program.id)"
            v-voix="'button-start-program-' + program.id"
            :hint="'Start the ' + program.name + ' training program'">
            Start Program
          </button>
          <button 
            class="btn btn-secondary" 
            @click="viewProgram(program.id)"
            v-voix="'button-view-program-details-' + program.id"
            :hint="'View details for the ' + program.name + ' program'">
            Details
          </button>
        </div>
      </div>
    </div>
    
    <!-- Active Programs -->
    <div v-if="activeTab === 'active'" class="program-grid">
      <div v-for="program in getActivePrograms()" :key="program.id" class="program-card">
        <h3>{{ program.name }}</h3>
        <div class="program-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: program.progress + '%' }"></div>
          </div>
          <span class="progress-text">{{ program.progress }}%</span>
        </div>
        <div class="program-meta">
          <span class="program-phase">
            Phase: {{ program.phases[program.currentPhase].name }}
          </span>
          <span class="program-dates">
            {{ formatDate(program.startDate) }} - {{ formatDate(program.endDate) }}
          </span>
        </div>
        <div class="program-actions">
          <button 
            class="btn btn-primary" 
            @click="viewProgram(program.id)"
            v-voix="'button-continue-program-' + program.id"
            :hint="'Continue your ' + program.name + ' training program'">
            Continue
          </button>
        </div>
      </div>
      <div v-if="getActivePrograms().length === 0" class="empty-state">
        <p>You don't have any active programs. Start one from the Available Programs tab.</p>
      </div>
    </div>
    
    <!-- Completed Programs -->
    <div v-if="activeTab === 'completed'" class="program-grid">
      <div v-for="program in getCompletedPrograms()" :key="program.id" class="program-card">
        <h3>{{ program.name }}</h3>
        <div class="program-meta">
          <span class="program-completed">
            Completed: {{ formatDate(program.endDate) }}
          </span>
          <span class="program-duration">
            {{ getProgramDuration(program) }} weeks
          </span>
        </div>
        <div class="program-actions">
          <button 
            class="btn btn-secondary" 
            @click="viewProgram(program.id)"
            v-voix="'button-view-program-history-' + program.id"
            :hint="'View history and statistics for your completed ' + program.name + ' program'">
            View History
          </button>
        </div>
      </div>
      <div v-if="getCompletedPrograms().length === 0" class="empty-state">
        <p>You haven't completed any programs yet.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.program-list {
  padding: 1rem;
}

.tabs {
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.tabs button {
  background: none;
  border: none;
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
  cursor: pointer;
  position: relative;
}

.tabs button.active {
  font-weight: bold;
  color: #4a90e2;
}

.tabs button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #4a90e2;
}

.program-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.program-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.program-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.program-card h3 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  color: #333;
}

.program-description {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.program-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #777;
}

.program-progress {
  margin-bottom: 1rem;
}

.progress-bar {
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.progress-fill {
  height: 100%;
  background-color: #4CAF50;
  border-radius: 4px;
}

.progress-text {
  font-size: 0.85rem;
  color: #666;
}

.program-actions {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
}

.btn {
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  flex: 1;
  text-align: center;
}

.btn-primary {
  background-color: #4a90e2;
  color: white;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem 1rem;
  background-color: #f9f9f9;
  border-radius: 10px;
  color: #666;
}
</style>