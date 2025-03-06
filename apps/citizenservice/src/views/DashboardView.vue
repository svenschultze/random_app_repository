<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(true)
const activeTab = ref('applications')

// Mock user data for demonstration
const userData = ref({
  firstName: 'Max',
  lastName: 'Mustermann',
  email: 'max.mustermann@example.com',
  notifications: [
    {
      id: 1,
      title: 'Ihr Personalausweis ist bereit zur Abholung',
      date: '2025-03-01T10:30:00',
      read: false,
      type: 'success'
    },
    {
      id: 2,
      title: 'Weitere Dokumente erforderlich für Bürgergeld-Antrag',
      date: '2025-02-28T14:15:00',
      read: true,
      type: 'warning'
    },
    {
      id: 3,
      title: 'Ihr Antrag auf Ummeldung wurde genehmigt',
      date: '2025-02-25T09:00:00',
      read: true,
      type: 'success'
    }
  ],
  applications: [
    {
      id: 'app-1',
      serviceId: 'id-card',
      serviceName: 'Personalausweis',
      status: 'processing',
      submissionDate: '2025-02-20T11:45:00',
      lastUpdated: '2025-03-01T10:30:00',
      referenceNumber: 'AUS-2025-12345',
      dueDate: '2025-03-15T00:00:00',
      attachments: 2,
      steps: [
        { name: 'Antrag eingereicht', completed: true, date: '2025-02-20T11:45:00' },
        { name: 'Dokumente geprüft', completed: true, date: '2025-02-25T09:30:00' },
        { name: 'Bearbeitung', completed: false, date: null },
        { name: 'Bereit zur Abholung', completed: false, date: null }
      ]
    },
    {
      id: 'app-2',
      serviceId: 'buergergeld',
      serviceName: 'Bürgergeld',
      status: 'action-required',
      submissionDate: '2025-02-15T14:20:00',
      lastUpdated: '2025-02-28T14:15:00',
      referenceNumber: 'BG-2025-54321',
      dueDate: '2025-03-10T00:00:00',
      attachments: 4,
      steps: [
        { name: 'Antrag eingereicht', completed: true, date: '2025-02-15T14:20:00' },
        { name: 'Dokumente geprüft', completed: true, date: '2025-02-20T10:15:00' },
        { name: 'Weitere Unterlagen angefordert', completed: true, date: '2025-02-28T14:15:00' },
        { name: 'Entscheidung', completed: false, date: null }
      ]
    },
    {
      id: 'app-3',
      serviceId: 'address-change',
      serviceName: 'Ummeldung',
      status: 'completed',
      submissionDate: '2025-02-10T09:30:00',
      lastUpdated: '2025-02-25T09:00:00',
      referenceNumber: 'UM-2025-98765',
      dueDate: null,
      attachments: 1,
      steps: [
        { name: 'Antrag eingereicht', completed: true, date: '2025-02-10T09:30:00' },
        { name: 'Dokumente geprüft', completed: true, date: '2025-02-15T11:00:00' },
        { name: 'Bearbeitung', completed: true, date: '2025-02-20T14:30:00' },
        { name: 'Abgeschlossen', completed: true, date: '2025-02-25T09:00:00' }
      ]
    }
  ],
  documents: [
    {
      id: 'doc-1',
      name: 'Personalausweis',
      type: 'identification',
      issueDate: '2020-03-10',
      expiryDate: '2030-03-09',
      documentNumber: 'PA123456789',
      status: 'valid'
    },
    {
      id: 'doc-2',
      name: 'Meldebescheinigung',
      type: 'certificate',
      issueDate: '2025-02-25',
      expiryDate: null,
      documentNumber: 'MB-2025-98765',
      status: 'valid'
    }
  ]
})

const unreadNotificationsCount = ref(0)

const setActiveTab = (tab) => {
  activeTab.value = tab
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const getStatusClass = (status) => {
  switch (status) {
    case 'completed':
      return 'status-completed'
    case 'processing':
      return 'status-processing'
    case 'action-required':
      return 'status-action-required'
    default:
      return ''
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'completed':
      return 'Abgeschlossen'
    case 'processing':
      return 'In Bearbeitung'
    case 'action-required':
      return 'Handlung erforderlich'
    default:
      return status
  }
}

const markNotificationAsRead = (notification) => {
  notification.read = true
  updateUnreadCount()
}

const updateUnreadCount = () => {
  unreadNotificationsCount.value = userData.value.notifications.filter(n => !n.read).length
}

const navigateToApplication = (applicationId) => {
  // In a real app, this would navigate to a detailed view of the application
  console.log(`Navigate to application: ${applicationId}`)
}

const navigateToService = (serviceId) => {
  router.push(`/service/${serviceId}`)
}

onMounted(() => {
  // Simulate API loading
  setTimeout(() => {
    loading.value = false
    updateUnreadCount()
  }, 500)
})
</script>

<template>
  <div class="dashboard-view">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Lade Ihre Daten...</p>
    </div>
    
    <div v-else class="dashboard-container">
      <div class="dashboard-header">
        <h1>Mein Bereich</h1>
        <p>Willkommen zurück, {{ userData.firstName }} {{ userData.lastName }}</p>
      </div>
      
      <div class="dashboard-content">
        <div class="dashboard-sidebar">
          <div class="user-profile-card">
            <div class="profile-avatar">{{ userData.firstName.charAt(0) }}{{ userData.lastName.charAt(0) }}</div>
            <div class="profile-info">
              <h3>{{ userData.firstName }} {{ userData.lastName }}</h3>
              <p>{{ userData.email }}</p>
            </div>
          </div>
          
          <div class="dashboard-navigation">
            <button 
              v-voix="'applications-tab'" 
              hint="Zeigt Ihre aktuellen Anträge an"
              class="nav-button" 
              :class="{ active: activeTab === 'applications' }"
              @click="setActiveTab('applications')">
              <span class="nav-icon">📝</span>
              Meine Anträge
            </button>
            
            <button 
              v-voix="'documents-tab'" 
              hint="Zeigt Ihre Dokumente an"
              class="nav-button" 
              :class="{ active: activeTab === 'documents' }"
              @click="setActiveTab('documents')">
              <span class="nav-icon">📄</span>
              Meine Dokumente
            </button>
            
            <button 
              v-voix="'notifications-tab'" 
              hint="Zeigt Ihre Benachrichtigungen an"
              class="nav-button" 
              :class="{ active: activeTab === 'notifications' }"
              @click="setActiveTab('notifications')">
              <span class="nav-icon">🔔</span>
              Benachrichtigungen
              <span v-if="unreadNotificationsCount > 0" class="notification-badge">{{ unreadNotificationsCount }}</span>
            </button>
            
            <button 
              v-voix="'profile-tab'" 
              hint="Zeigt Ihre Profileinstellungen an"
              class="nav-button" 
              :class="{ active: activeTab === 'profile' }"
              @click="setActiveTab('profile')">
              <span class="nav-icon">👤</span>
              Profil
            </button>
          </div>
          
          <div class="quick-actions">
            <h3>Schnellzugriff</h3>
            <button 
              v-voix="'new-application'" 
              hint="Startet einen neuen Antrag"
              class="action-button" 
              @click="router.push('/services')">
              Neuen Antrag stellen
            </button>
            <button 
              v-voix="'help-center'" 
              hint="Öffnet das Hilfezentrum"
              class="action-button secondary" 
              @click="router.push('/help')">
              Hilfe bekommen
            </button>
          </div>
        </div>
        
        <div class="dashboard-main">
          <!-- Applications Tab -->
          <div v-if="activeTab === 'applications'" class="tab-content">
            <div class="tab-header">
              <h2>Meine Anträge</h2>
              <button 
                v-voix="'new-application-main'" 
                hint="Startet einen neuen Antrag"
                class="new-application-button" 
                @click="router.push('/services')">
                Neuer Antrag
              </button>
            </div>
            
            <div v-if="userData.applications.length === 0" class="empty-state">
              <p>Sie haben noch keine Anträge gestellt.</p>
              <button 
                v-voix="'start-first-application'" 
                hint="Startet Ihren ersten Antrag"
                class="start-application-button" 
                @click="router.push('/services')">
                Ersten Antrag stellen
              </button>
            </div>
            
            <div v-else class="applications-list">
              <div 
                v-for="application in userData.applications" 
                :key="application.id"
                class="application-card" 
                :class="getStatusClass(application.status)"
                v-voix="'application-' + application.id"
                :hint="`Zeigt Details zu Ihrem Antrag für ${application.serviceName}`"
                @click="navigateToApplication(application.id)">
                
                <div class="application-header">
                  <div class="application-title">
                    <h3>{{ application.serviceName }}</h3>
                    <span class="application-reference">{{ application.referenceNumber }}</span>
                  </div>
                  <div class="application-status">
                    <span :class="`status-badge ${getStatusClass(application.status)}`">
                      {{ getStatusLabel(application.status) }}
                    </span>
                  </div>
                </div>
                
                <div class="application-dates">
                  <div class="date-item">
                    <span class="date-label">Eingereicht:</span>
                    <span class="date-value">{{ formatDate(application.submissionDate) }}</span>
                  </div>
                  <div class="date-item">
                    <span class="date-label">Letzte Aktualisierung:</span>
                    <span class="date-value">{{ formatDate(application.lastUpdated) }}</span>
                  </div>
                  <div v-if="application.dueDate" class="date-item">
                    <span class="date-label">Fälligkeitsdatum:</span>
                    <span class="date-value">{{ formatDate(application.dueDate) }}</span>
                  </div>
                </div>
                
                <div class="application-progress">
                  <div class="progress-steps">
                    <div 
                      v-for="(step, index) in application.steps" 
                      :key="index"
                      class="progress-step" 
                      :class="{ 'completed': step.completed, 'current': step.completed && !application.steps[index+1]?.completed }">
                      <div class="step-marker"></div>
                      <div class="step-info">
                        <span class="step-name">{{ step.name }}</span>
                        <span v-if="step.date" class="step-date">{{ formatDate(step.date) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="application-actions">
                  <button 
                    v-voix="'view-details-' + application.id" 
                    hint="Zeigt Details zu diesem Antrag"
                    class="details-button">
                    Details anzeigen
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Documents Tab -->
          <div v-else-if="activeTab === 'documents'" class="tab-content">
            <div class="tab-header">
              <h2>Meine Dokumente</h2>
            </div>
            
            <div v-if="userData.documents.length === 0" class="empty-state">
              <p>Sie haben noch keine gespeicherten Dokumente.</p>
            </div>
            
            <div v-else class="documents-list">
              <div 
                v-for="document in userData.documents" 
                :key="document.id"
                class="document-card"
                v-voix="'document-' + document.id"
                :hint="`Dokument: ${document.name}`">
                
                <div class="document-icon">📄</div>
                
                <div class="document-info">
                  <h3>{{ document.name }}</h3>
                  <div class="document-meta">
                    <span class="document-type">{{ document.type }}</span>
                    <span class="document-number">{{ document.documentNumber }}</span>
                  </div>
                  <div class="document-dates">
                    <span class="date-info">Ausgestellt: {{ formatDate(document.issueDate) }}</span>
                    <span v-if="document.expiryDate" class="date-info">Gültig bis: {{ formatDate(document.expiryDate) }}</span>
                  </div>
                </div>
                
                <div class="document-status">
                  <span class="status-badge" :class="`status-${document.status}`">
                    {{ document.status === 'valid' ? 'Gültig' : 'Abgelaufen' }}
                  </span>
                </div>
                
                <div class="document-actions">
                  <button 
                    v-voix="'download-' + document.id" 
                    hint="Lädt dieses Dokument herunter"
                    class="action-icon">
                    ⬇️
                  </button>
                  <button 
                    v-voix="'print-' + document.id" 
                    hint="Druckt dieses Dokument"
                    class="action-icon">
                    🖨️
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Notifications Tab -->
          <div v-else-if="activeTab === 'notifications'" class="tab-content">
            <div class="tab-header">
              <h2>Benachrichtigungen</h2>
            </div>
            
            <div v-if="userData.notifications.length === 0" class="empty-state">
              <p>Sie haben keine Benachrichtigungen.</p>
            </div>
            
            <div v-else class="notifications-list">
              <div 
                v-for="notification in userData.notifications" 
                :key="notification.id"
                class="notification-card" 
                :class="{ 'unread': !notification.read, [notification.type]: true }"
                v-voix="'notification-' + notification.id"
                :hint="`Benachrichtigung: ${notification.title}`"
                @click="markNotificationAsRead(notification)">
                
                <div class="notification-icon">
                  <span v-if="notification.type === 'success'">✅</span>
                  <span v-else-if="notification.type === 'warning'">⚠️</span>
                  <span v-else-if="notification.type === 'error'">❌</span>
                  <span v-else>📩</span>
                </div>
                
                <div class="notification-content">
                  <h3>{{ notification.title }}</h3>
                  <span class="notification-date">{{ formatDateTime(notification.date) }}</span>
                </div>
                
                <div v-if="!notification.read" class="notification-status">
                  <span class="unread-indicator"></span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Profile Tab -->
          <div v-else-if="activeTab === 'profile'" class="tab-content">
            <div class="tab-header">
              <h2>Mein Profil</h2>
            </div>
            
            <div class="profile-content">
              <div class="profile-section">
                <h3>Persönliche Daten</h3>
                <div class="profile-form">
                  <div class="form-row">
                    <div class="form-group">
                      <label for="firstName">Vorname</label>
                      <input 
                        v-voix="'firstName-field'" 
                        hint="Bearbeiten Sie Ihren Vornamen"
                        type="text" 
                        id="firstName" 
                        v-model="userData.firstName">
                    </div>
                    
                    <div class="form-group">
                      <label for="lastName">Nachname</label>
                      <input 
                        v-voix="'lastName-field'" 
                        hint="Bearbeiten Sie Ihren Nachnamen"
                        type="text" 
                        id="lastName" 
                        v-model="userData.lastName">
                    </div>
                  </div>
                  
                  <div class="form-row">
                    <div class="form-group">
                      <label for="email">E-Mail</label>
                      <input 
                        v-voix="'email-field'" 
                        hint="Bearbeiten Sie Ihre E-Mail-Adresse"
                        type="email" 
                        id="email" 
                        v-model="userData.email">
                    </div>
                  </div>
                  
                  <div class="form-actions">
                    <button 
                      v-voix="'save-profile'" 
                      hint="Speichert Ihre Profileinstellungen"
                      class="save-button">
                      Speichern
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="profile-section">
                <h3>Sicherheit</h3>
                <div class="profile-form">
                  <div class="form-row">
                    <div class="form-group">
                      <label for="password">Passwort</label>
                      <input 
                        v-voix="'password-field'" 
                        hint="Ändern Sie Ihr Passwort"
                        type="password" 
                        id="password" 
                        placeholder="••••••••">
                    </div>
                  </div>
                  
                  <div class="form-row">
                    <div class="form-group">
                      <label for="newPassword">Neues Passwort</label>
                      <input 
                        v-voix="'newPassword-field'" 
                        hint="Geben Sie Ihr neues Passwort ein"
                        type="password" 
                        id="newPassword" 
                        placeholder="••••••••">
                    </div>
                    
                    <div class="form-group">
                      <label for="confirmPassword">Passwort bestätigen</label>
                      <input 
                        v-voix="'confirmPassword-field'" 
                        hint="Bestätigen Sie Ihr neues Passwort"
                        type="password" 
                        id="confirmPassword" 
                        placeholder="••••••••">
                    </div>
                  </div>
                  
                  <div class="form-actions">
                    <button 
                      v-voix="'change-password'" 
                      hint="Ändert Ihr Passwort"
                      class="save-button">
                      Passwort ändern
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="profile-section">
                <h3>Einstellungen</h3>
                <div class="profile-form">
                  <div class="checkbox-group">
                    <input 
                      v-voix="'notifications-checkbox'" 
                      hint="Aktiviert oder deaktiviert E-Mail-Benachrichtigungen"
                      type="checkbox" 
                      id="notifications" 
                      checked>
                    <label for="notifications">E-Mail-Benachrichtigungen erhalten</label>
                  </div>
                  
                  <div class="checkbox-group">
                    <input 
                      v-voix="'sms-checkbox'" 
                      hint="Aktiviert oder deaktiviert SMS-Benachrichtigungen"
                      type="checkbox" 
                      id="sms" 
                      checked>
                    <label for="sms">SMS-Benachrichtigungen erhalten</label>
                  </div>
                  
                  <div class="form-actions">
                    <button 
                      v-voix="'save-settings'" 
                      hint="Speichert Ihre Einstellungen"
                      class="save-button">
                      Einstellungen speichern
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-view {
  animation: fadeIn 0.5s ease-out;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.dashboard-content {
  display: flex;
  gap: 2rem;
}

.dashboard-sidebar {
  width: 300px;
  flex-shrink: 0;
}

.dashboard-main {
  flex: 1;
  min-width: 0; /* Prevent flex items from overflowing */
}

.user-profile-card {
  background-color: var(--card-background);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.profile-avatar {
  width: 50px;
  height: 50px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 1.2rem;
  margin-right: 1rem;
}

.profile-info h3 {
  margin: 0 0 0.5rem 0;
  color: var(--primary-color);
}

.profile-info p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-color);
  opacity: 0.8;
}

.dashboard-navigation {
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: var(--shadow);
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.nav-button {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-color);
  font-weight: bold;
  position: relative;
  transition: background-color var(--transition-speed);
}

.nav-button:last-child {
  border-bottom: none;
}

.nav-button:hover {
  background-color: rgba(59, 130, 246, 0.05);
}

.nav-button.active {
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--primary-color);
}

.nav-icon {
  margin-right: 0.75rem;
  font-size: 1.2rem;
}

.notification-badge {
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  background-color: var(--error-color);
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 0.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.quick-actions {
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 1.5rem;
}

.quick-actions h3 {
  margin: 0 0 1rem 0;
  color: var(--primary-color);
  font-size: 1.1rem;
}

.action-button {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 0.75rem;
  transition: background-color var(--transition-speed);
}

.action-button:last-child {
  margin-bottom: 0;
}

.action-button {
  background-color: var(--primary-color);
  color: white;
}

.action-button:hover {
  background-color: var(--secondary-color);
}

.action-button.secondary {
  background-color: var(--border-color);
  color: var(--text-color);
}

.action-button.secondary:hover {
  background-color: var(--text-color);
  color: white;
}

.tab-content {
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 1.5rem;
  min-height: 500px;
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.tab-header h2 {
  margin: 0;
  color: var(--primary-color);
}

.new-application-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color var(--transition-speed);
}

.new-application-button:hover {
  background-color: var(--secondary-color);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-color);
  opacity: 0.7;
}

.start-application-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color var(--transition-speed);
}

.start-application-button:hover {
  background-color: var(--secondary-color);
}

/* Applications List */
.applications-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.application-card {
  background-color: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: transform var(--transition-speed), box-shadow var(--transition-speed);
}

.application-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow);
}

.application-card.status-completed {
  border-left: 4px solid var(--success-color);
}

.application-card.status-processing {
  border-left: 4px solid var(--primary-color);
}

.application-card.status-action-required {
  border-left: 4px solid var(--warning-color);
}

.application-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.application-title h3 {
  margin: 0 0 0.5rem 0;
  color: var(--primary-color);
}

.application-reference {
  font-size: 0.9rem;
  color: var(--text-color);
  opacity: 0.7;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
}

.status-badge.status-completed {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
}

.status-badge.status-processing {
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--primary-color);
}

.status-badge.status-action-required {
  background-color: rgba(245, 158, 11, 0.1);
  color: var(--warning-color);
}

.application-dates {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.date-item {
  display: flex;
  flex-direction: column;
}

.date-label {
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
  color: var(--text-color);
  opacity: 0.7;
}

.date-value {
  font-weight: bold;
}

.application-progress {
  margin-bottom: 1.5rem;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  position: relative;
}

.progress-steps::before {
  content: '';
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  height: 2px;
  background-color: var(--border-color);
  z-index: 0;
}

.progress-step {
  flex: 1;
  position: relative;
  text-align: center;
}

.step-marker {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--border-color);
  margin: 0 auto 0.5rem;
  position: relative;
  z-index: 1;
}

.progress-step.completed .step-marker {
  background-color: var(--success-color);
}

.progress-step.current .step-marker {
  background-color: var(--primary-color);
}

.step-info {
  display: flex;
  flex-direction: column;
  font-size: 0.85rem;
}

.step-name {
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.step-date {
  font-size: 0.8rem;
  opacity: 0.7;
}

.application-actions {
  text-align: right;
}

.details-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color var(--transition-speed);
}

.details-button:hover {
  background-color: var(--secondary-color);
}

/* Documents List */
.documents-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.document-card {
  background-color: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.document-icon {
  font-size: 2rem;
}

.document-info {
  flex: 1;
}

.document-info h3 {
  margin: 0 0 0.5rem 0;
  color: var(--primary-color);
}

.document-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.document-type,
.document-number {
  font-size: 0.85rem;
  color: var(--text-color);
  opacity: 0.7;
}

.document-dates {
  font-size: 0.85rem;
}

.date-info {
  display: inline-block;
  margin-right: 1rem;
}

.document-status .status-badge.status-valid {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
}

.document-actions {
  display: flex;
  gap: 0.5rem;
}

.action-icon {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color var(--transition-speed);
}

.action-icon:hover {
  background-color: var(--border-color);
}

/* Notifications List */
.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notification-card {
  background-color: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: background-color var(--transition-speed);
}

.notification-card:hover {
  background-color: rgba(59, 130, 246, 0.05);
}

.notification-card.unread {
  background-color: rgba(59, 130, 246, 0.05);
  border-left: 4px solid var(--primary-color);
}

.notification-card.success {
  border-left: 4px solid var(--success-color);
}

.notification-card.warning {
  border-left: 4px solid var(--warning-color);
}

.notification-card.error {
  border-left: 4px solid var(--error-color);
}

.notification-icon {
  font-size: 1.5rem;
}

.notification-content {
  flex: 1;
}

.notification-content h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
}

.notification-date {
  font-size: 0.85rem;
  color: var(--text-color);
  opacity: 0.7;
}

.notification-status {
  display: flex;
  align-items: center;
}

.unread-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--primary-color);
}

/* Profile Tab */
.profile-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-section {
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.profile-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.profile-section h3 {
  margin: 0 0 1.5rem 0;
  color: var(--primary-color);
}

.profile-form {
  max-width: 700px;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  flex: 1;
  min-width: 250px;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--card-background);
  color: var(--text-color);
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.checkbox-group {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.checkbox-group input {
  margin-right: 0.75rem;
}

.form-actions {
  margin-top: 1.5rem;
}

.save-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color var(--transition-speed);
}

.save-button:hover {
  background-color: var(--secondary-color);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 992px) {
  .dashboard-content {
    flex-direction: column;
  }
  
  .dashboard-sidebar {
    width: 100%;
  }
  
  .dashboard-navigation {
    display: flex;
    overflow-x: auto;
  }
  
  .nav-button {
    flex: 1;
    border-bottom: none;
    border-right: 1px solid var(--border-color);
    white-space: nowrap;
    padding: 0.75rem 1rem;
  }
  
  .nav-button:last-child {
    border-right: none;
  }
  
  .nav-icon {
    margin-right: 0.5rem;
  }
  
  .notification-badge {
    position: static;
    transform: none;
    margin-left: 0.5rem;
  }
}

@media (max-width: 768px) {
  .application-progress {
    overflow-x: auto;
    padding-bottom: 1rem;
  }
  
  .progress-steps {
    min-width: 600px;
  }
  
  .document-card {
    flex-wrap: wrap;
  }
  
  .document-info {
    width: 100%;
    order: 2;
  }
  
  .document-icon {
    order: 1;
  }
  
  .document-status {
    order: 3;
  }
  
  .document-actions {
    width: 100%;
    order: 4;
    justify-content: flex-end;
    margin-top: 1rem;
  }
}
</style>