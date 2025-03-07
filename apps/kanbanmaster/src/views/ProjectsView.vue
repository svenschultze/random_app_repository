<script setup>
import { ref, computed, onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import ProjectCard from '@/components/ProjectCard.vue'
import ProjectForm from '@/components/ProjectForm.vue'
import store from '@/store'

// Data
const projects = computed(() => store.getProjects())
const showProjectForm = ref(false)
const currentProject = ref(null)
const searchQuery = ref('')

// Search functionality
const filteredProjects = computed(() => {
  if (!searchQuery.value) return projects.value
  
  const query = searchQuery.value.toLowerCase()
  return projects.value.filter(project => 
    project.name.toLowerCase().includes(query) || 
    project.description.toLowerCase().includes(query)
  )
})

// Project form handling
function openNewProjectForm() {
  currentProject.value = null
  showProjectForm.value = true
}

function openEditProjectForm(project) {
  currentProject.value = project
  showProjectForm.value = true
}

function closeProjectForm() {
  showProjectForm.value = false
  currentProject.value = null
}

function handleProjectSaved() {
  // Just close the form, the store handles the update
  closeProjectForm()
}

// Initialize store when component mounts
onMounted(() => {
  if (!store.state.loaded) {
    store.init()
  }
})
</script>

<template>
  <div class="projects-view">
    <AppHeader />
    
    <main class="main-content">
      <div class="projects-header">
        <h2 class="projects-title">Projects</h2>
        
        <div class="projects-actions">
          <div class="search-container">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search projects..." 
              class="search-input"
              v-voix="'search-projects'"
              hint="Search for projects by name or description"
            />
          </div>
          
          <button 
            @click="openNewProjectForm" 
            class="new-project-button"
            v-voix="'create-new-project'"
            hint="Create a new project"
          >
            + New Project
          </button>
        </div>
      </div>
      
      <div class="projects-list" v-if="filteredProjects.length > 0">
        <ProjectCard 
          v-for="project in filteredProjects" 
          :key="project.id" 
          :project="project"
          @edit="openEditProjectForm"
        />
      </div>
      
      <div class="empty-state" v-else>
        <div class="empty-container">
          <h3>No Projects Found</h3>
          <p v-if="searchQuery">No projects match your search criteria. Try a different search or create a new project.</p>
          <p v-else>You don't have any projects yet. Click the "New Project" button to create your first project.</p>
          <button 
            @click="openNewProjectForm" 
            class="new-project-button"
            v-voix="'create-new-project-empty'"
            hint="Create your first project"
          >
            + Create Your First Project
          </button>
        </div>
      </div>
    </main>
    
    <!-- Project Form Modal -->
    <ProjectForm
      v-if="showProjectForm"
      :project="currentProject"
      @close="closeProjectForm"
      @saved="handleProjectSaved"
    />
  </div>
</template>

<style scoped>
.projects-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.projects-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.projects-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-color);
}

.projects-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-container {
  position: relative;
}

.search-input {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.9rem;
  min-width: 250px;
}

.new-project-button {
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 4px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.projects-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 1rem;
  flex: 1;
}

.empty-container {
  text-align: center;
  max-width: 500px;
  padding: 2rem;
  background-color: var(--light-bg-color);
  border-radius: 8px;
}

.empty-container h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.empty-container p {
  margin-bottom: 1.5rem;
  color: var(--text-color);
}

.empty-container .new-project-button {
  margin: 0 auto;
  display: inline-flex;
}

@media (max-width: 768px) {
  .projects-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .projects-actions {
    width: 100%;
    flex-direction: column;
  }
  
  .search-container, .search-input {
    width: 100%;
  }
  
  .new-project-button {
    width: 100%;
    justify-content: center;
  }
  
  .projects-list {
    grid-template-columns: 1fr;
  }
}
</style>