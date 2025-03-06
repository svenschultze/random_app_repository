<script setup>
import { ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useFinanceStore } from '@/stores/finance'
import { useInvestmentStore } from '@/stores/investment'
import { useNotificationStore } from '@/stores/notification'
import CardComponent from '@/components/ui/CardComponent.vue'

const settingsStore = useSettingsStore()
const financeStore = useFinanceStore()
const investmentStore = useInvestmentStore()
const notificationStore = useNotificationStore()

const availableWidgets = settingsStore.availableWidgets
const selectedWidgets = ref([...settingsStore.dashboardLayout])
const refreshInterval = ref(settingsStore.dataRefreshInterval)

// Toggle dark mode
const toggleDarkMode = () => {
  settingsStore.toggleDarkMode()
}

// Save dashboard widgets
const saveDashboardLayout = () => {
  settingsStore.updateDashboardLayout([...selectedWidgets.value])
}

// Toggle widget selection
const toggleWidget = (widgetId) => {
  const index = selectedWidgets.value.indexOf(widgetId)
  if (index !== -1) {
    selectedWidgets.value.splice(index, 1)
  } else {
    selectedWidgets.value.push(widgetId)
  }
}

// Set refresh interval
const setRefreshInterval = () => {
  settingsStore.setDataRefreshInterval(refreshInterval.value)
}

// Reset all data
const resetAllData = () => {
  financeStore.refreshData()
  investmentStore.refreshData()
  notificationStore.refreshData()
}
</script>

<template>
  <div class="settings-view" v-voix="'Settings Page'">
    <div class="page-header">
      <h1 class="page-title">Settings</h1>
    </div>
    
    <!-- Theme Settings -->
    <CardComponent
      title="Theme"
      v-voix="'Theme Settings'"
    >
      <div class="settings-section">
        <div class="setting-item">
          <div class="setting-label">Dark Mode</div>
          <div class="setting-control">
            <button 
              @click="toggleDarkMode" 
              class="toggle-button"
              :class="{ 'active': settingsStore.darkMode }"
              v-voix="'Toggle Dark Mode'"
              :hint="settingsStore.darkMode ? 'Currently in dark mode' : 'Currently in light mode'"
            >
              <div class="toggle-slider"></div>
            </button>
          </div>
        </div>
      </div>
    </CardComponent>
    
    <!-- Dashboard Layout -->
    <CardComponent
      title="Dashboard Layout"
      subtitle="Select which widgets to display on your dashboard"
      v-voix="'Dashboard Layout Settings'"
    >
      <div class="settings-section">
        <div class="widgets-grid">
          <div 
            v-for="widget in availableWidgets" 
            :key="widget.id"
            class="widget-item"
            :class="{ 'selected': selectedWidgets.includes(widget.id) }"
            @click="toggleWidget(widget.id)"
            v-voix="widget.name + ' Widget'"
            :hint="widget.description + '. Click to ' + (selectedWidgets.includes(widget.id) ? 'remove from' : 'add to') + ' dashboard'"
          >
            <div class="widget-icon">{{ widget.icon }}</div>
            <div class="widget-info">
              <div class="widget-name">{{ widget.name }}</div>
              <div class="widget-description">{{ widget.description }}</div>
            </div>
            <div class="widget-checkbox">
              <span v-if="selectedWidgets.includes(widget.id)" class="check-icon">✓</span>
            </div>
          </div>
        </div>
        
        <div class="settings-actions">
          <button 
            @click="saveDashboardLayout" 
            class="primary-button"
            v-voix="'Save Dashboard Layout'"
          >
            Save Layout
          </button>
        </div>
      </div>
    </CardComponent>
    
    <!-- Data Refresh Settings -->
    <CardComponent
      title="Data Refresh"
      subtitle="Configure how often data should be refreshed automatically"
      v-voix="'Data Refresh Settings'"
    >
      <div class="settings-section">
        <div class="setting-item">
          <div class="setting-label">Refresh Interval</div>
          <div class="setting-control">
            <select 
              v-model="refreshInterval"
              v-voix="'Select Refresh Interval'"
            >
              <option 
                v-for="option in settingsStore.refreshIntervalOptions" 
                :key="option.value" 
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="setting-item">
          <div class="setting-label">Refresh All Data Now</div>
          <div class="setting-control">
            <button 
              @click="resetAllData" 
              class="secondary-button"
              v-voix="'Refresh All Data Now'"
            >
              Refresh Data
            </button>
          </div>
        </div>
        
        <div class="settings-actions">
          <button 
            @click="setRefreshInterval" 
            class="primary-button"
            v-voix="'Save Refresh Settings'"
          >
            Save Settings
          </button>
        </div>
      </div>
    </CardComponent>
    
    <!-- About Demo App -->
    <CardComponent
      title="About FinFusion"
      v-voix="'About FinFusion'"
    >
      <div class="settings-section">
        <div class="about-info">
          <p><strong>FinFusion Demo App</strong></p>
          <p>This is a demonstration application built with Vue 3.</p>
          <p>All data in this application is randomly generated for demonstration purposes. No real financial data is used or stored.</p>
          <p>Built with Vue 3, Pinia, Chart.js, and Vue Router.</p>
          <p>Accessible with vue-voix for screen reader support.</p>
        </div>
      </div>
    </CardComponent>
  </div>
</template>

<style scoped>
.settings-view {
  width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-color);
}

.settings-section {
  padding: 0.5rem 0;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  font-weight: 600;
}

.setting-control select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  background-color: var(--card-background);
  color: var(--text-color);
  min-width: 200px;
}

.toggle-button {
  position: relative;
  width: 50px;
  height: 24px;
  border-radius: 12px;
  background-color: #ccc;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: background-color 0.3s;
}

.toggle-button.active {
  background-color: var(--primary-color);
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: white;
  transition: transform 0.3s;
}

.toggle-button.active .toggle-slider {
  transform: translateX(26px);
}

.widgets-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.widget-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
}

.widget-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.widget-item.selected {
  border-color: var(--primary-color);
  background-color: rgba(52, 152, 219, 0.05);
}

.widget-icon {
  margin-right: 1rem;
  font-size: 1.5rem;
}

.widget-info {
  flex-grow: 1;
}

.widget-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.widget-description {
  font-size: 0.875rem;
  color: var(--text-color);
  opacity: 0.7;
}

.widget-checkbox {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 1rem;
}

.widget-item.selected .widget-checkbox {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.check-icon {
  font-size: 0.875rem;
}

.settings-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.primary-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.secondary-button {
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-color);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.secondary-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.about-info {
  line-height: 1.6;
}

@media (min-width: 768px) {
  .widgets-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>