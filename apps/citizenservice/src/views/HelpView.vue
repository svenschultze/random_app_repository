<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeCategory = ref('general')
const searchTerm = ref('')
const showChatbot = ref(false)
const chatMessages = ref([
  {
    sender: 'bot',
    message: 'Hallo! Ich bin Ihr digitaler Assistent. Wie kann ich Ihnen heute helfen?',
    time: new Date().toISOString()
  }
])
const currentMessage = ref('')

// FAQ categories
const categories = [
  { id: 'general', name: 'Allgemein', icon: '❓' },
  { id: 'account', name: 'Konto & Anmeldung', icon: '👤' },
  { id: 'application', name: 'Antragsstellung', icon: '📝' },
  { id: 'documents', name: 'Dokumente', icon: '📄' },
  { id: 'technical', name: 'Technische Hilfe', icon: '💻' }
]

// FAQ items
const faqItems = [
  {
    id: 1,
    category: 'general',
    question: 'Was ist BehördenService Digital?',
    answer: 'BehördenService Digital ist eine Plattform zur vollständig digitalen Abwicklung von Behördengängen. Hier können Sie Anträge stellen, Dokumente einreichen und den Status Ihrer Anträge verfolgen - alles online von zu Hause aus.'
  },
  {
    id: 2,
    category: 'general',
    question: 'Welche Behördengänge kann ich digital erledigen?',
    answer: 'Auf unserer Plattform können Sie verschiedene Dienstleistungen in Anspruch nehmen, darunter Beantragung von Personalausweisen, Reisepässen, Ummeldungen, Bürgergeld und vieles mehr. Eine vollständige Liste finden Sie unter "Dienstleistungen".'
  },
  {
    id: 3,
    category: 'general',
    question: 'Ist die Nutzung kostenlos?',
    answer: 'Die Nutzung der BehördenService Digital Plattform ist kostenlos. Für die beantragten Dienstleistungen selbst können jedoch je nach Art des Antrags Gebühren anfallen, die den üblichen Verwaltungsgebühren entsprechen.'
  },
  {
    id: 4,
    category: 'account',
    question: 'Wie erstelle ich ein Konto?',
    answer: 'Um ein Konto zu erstellen, klicken Sie oben rechts auf "Registrieren" und folgen Sie den Anweisungen. Sie benötigen eine gültige E-Mail-Adresse und müssen ein sicheres Passwort wählen. Nach der Registrierung erhalten Sie eine Bestätigungs-E-Mail mit einem Aktivierungslink.'
  },
  {
    id: 5,
    category: 'account',
    question: 'Ich habe mein Passwort vergessen. Was kann ich tun?',
    answer: 'Auf der Anmeldeseite finden Sie den Link "Passwort vergessen". Geben Sie dort Ihre E-Mail-Adresse ein und Sie erhalten einen Link zum Zurücksetzen Ihres Passworts.'
  },
  {
    id: 6,
    category: 'application',
    question: 'Wie stelle ich einen Antrag?',
    answer: 'Um einen Antrag zu stellen, wählen Sie zunächst die gewünschte Dienstleistung aus dem Katalog. Folgen Sie dann dem Schritt-für-Schritt-Assistenten, der Sie durch den gesamten Prozess führt. Sie werden gebeten, persönliche Daten einzugeben und erforderliche Dokumente hochzuladen.'
  },
  {
    id: 7,
    category: 'application',
    question: 'Wie lange dauert die Bearbeitung meines Antrags?',
    answer: 'Die Bearbeitungszeit hängt von der Art des Antrags ab. Bei einigen Dienstleistungen erhalten Sie sofort eine Bestätigung, andere können mehrere Tage oder Wochen in Anspruch nehmen. Die voraussichtliche Bearbeitungszeit wird bei jeder Dienstleistung angegeben.'
  },
  {
    id: 8,
    category: 'application',
    question: 'Kann ich einen gespeicherten Antrag später fortsetzen?',
    answer: 'Ja, Ihre Anträge werden automatisch gespeichert. Sie können sich jederzeit wieder anmelden und Ihren Antrag unter "Mein Bereich" > "Meine Anträge" fortsetzen.'
  },
  {
    id: 9,
    category: 'documents',
    question: 'Welche Dateiformate werden für Dokumente akzeptiert?',
    answer: 'Wir akzeptieren Dokumente in den Formaten PDF, JPG, PNG und TIFF. Die maximale Dateigröße beträgt 10 MB pro Dokument.'
  },
  {
    id: 10,
    category: 'documents',
    question: 'Wie kann ich ein Dokument hochladen?',
    answer: 'Während des Antragsprozesses werden Sie aufgefordert, erforderliche Dokumente hochzuladen. Klicken Sie auf die Schaltfläche "Dokument hochladen", wählen Sie die entsprechende Datei auf Ihrem Gerät aus und bestätigen Sie den Upload.'
  },
  {
    id: 11,
    category: 'documents',
    question: 'Sind meine Dokumente sicher?',
    answer: 'Ja, wir nehmen den Schutz Ihrer Daten sehr ernst. Alle hochgeladenen Dokumente werden verschlüsselt und auf sicheren Servern gespeichert. Der Zugriff ist streng kontrolliert und nur autorisierte Personen können Ihre Daten einsehen.'
  },
  {
    id: 12,
    category: 'technical',
    question: 'Welche Browser werden unterstützt?',
    answer: 'BehördenService Digital funktioniert am besten mit den aktuellen Versionen von Chrome, Firefox, Safari und Edge. Bitte stellen Sie sicher, dass Ihr Browser auf dem neuesten Stand ist.'
  },
  {
    id: 13,
    category: 'technical',
    question: 'Kann ich die Plattform auf dem Smartphone nutzen?',
    answer: 'Ja, unsere Plattform ist für die Nutzung auf Smartphones und Tablets optimiert. Sie können alle Funktionen auch unterwegs nutzen.'
  },
  {
    id: 14,
    category: 'technical',
    question: 'Was tun bei technischen Problemen?',
    answer: 'Bei technischen Problemen können Sie unseren Support über das Kontaktformular oder den Live-Chat kontaktieren. Oft hilft es auch, den Browser neu zu laden oder einen anderen Browser zu verwenden.'
  }
]

// Filtered FAQ items based on category and search term
const filteredFaqs = ref([])

// Contact form data
const contactForm = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

// Contact form validation
const formSubmitted = ref(false)
const formSuccess = ref(false)

const selectCategory = (categoryId) => {
  activeCategory.value = categoryId
  filterFaqs()
}

const filterFaqs = () => {
  let result = faqItems

  // Filter by category
  if (activeCategory.value !== 'all') {
    result = result.filter(item => item.category === activeCategory.value)
  }

  // Filter by search term
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    result = result.filter(item => 
      item.question.toLowerCase().includes(term) || 
      item.answer.toLowerCase().includes(term)
    )
  }

  filteredFaqs.value = result
}

const toggleChatbot = () => {
  showChatbot.value = !showChatbot.value
}

const sendMessage = () => {
  if (!currentMessage.value.trim()) return

  // Add user message
  chatMessages.value.push({
    sender: 'user',
    message: currentMessage.value,
    time: new Date().toISOString()
  })

  // Simulate bot response
  setTimeout(() => {
    chatMessages.value.push({
      sender: 'bot',
      message: getBotResponse(currentMessage.value),
      time: new Date().toISOString()
    })
  }, 1000)

  // Clear input
  currentMessage.value = ''
}

const getBotResponse = (message) => {
  const lowerMessage = message.toLowerCase()
  
  // Simple keyword matching for demo
  if (lowerMessage.includes('passwort') || lowerMessage.includes('password')) {
    return 'Wenn Sie Ihr Passwort vergessen haben, können Sie es über die "Passwort vergessen" Funktion auf der Anmeldeseite zurücksetzen. Sie erhalten dann eine E-Mail mit einem Link zum Erstellen eines neuen Passworts.'
  } else if (lowerMessage.includes('antrag') || lowerMessage.includes('application')) {
    return 'Um einen Antrag zu stellen, wählen Sie die gewünschte Dienstleistung aus unserem Katalog aus und folgen Sie dem Antragsassistenten. Den aktuellen Status Ihrer Anträge können Sie im Dashboard einsehen.'
  } else if (lowerMessage.includes('dokument') || lowerMessage.includes('document') || lowerMessage.includes('upload')) {
    return 'Wir unterstützen Dokumente in den Formaten PDF, JPG und PNG. Die maximale Dateigröße beträgt 10 MB. Stellen Sie sicher, dass Ihre Dokumente gut lesbar sind.'
  } else if (lowerMessage.includes('dauer') || lowerMessage.includes('lange') || lowerMessage.includes('zeit')) {
    return 'Die Bearbeitungszeit variiert je nach Art des Antrags. Details zur Bearbeitungszeit finden Sie in der Beschreibung der jeweiligen Dienstleistung.'
  } else if (lowerMessage.includes('kontakt') || lowerMessage.includes('contact') || lowerMessage.includes('hilfe') || lowerMessage.includes('help')) {
    return 'Unser Support-Team ist unter support@behoerdenservice-digital.de erreichbar. Alternativ können Sie auch das Kontaktformular auf dieser Seite nutzen.'
  } else {
    return 'Ich verstehe Ihre Frage leider nicht genau. Können Sie sie umformulieren oder einen unserer FAQ-Bereiche durchsuchen? Für komplexere Anliegen empfehle ich Ihnen, unser Kontaktformular zu nutzen.'
  }
}

const submitContactForm = () => {
  formSubmitted.value = true
  
  // Basic validation
  if (!contactForm.value.name || !contactForm.value.email || !contactForm.value.message) {
    return
  }
  
  // Simulate form submission
  setTimeout(() => {
    formSuccess.value = true
    // Reset form after success
    setTimeout(() => {
      contactForm.value = {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
      formSubmitted.value = false
      formSuccess.value = false
    }, 3000)
  }, 1000)
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  filterFaqs()
})
</script>

<template>
  <div class="help-view">
    <div class="help-header">
      <h1>Hilfe & Support</h1>
      <p>Hier finden Sie Antworten auf häufig gestellte Fragen und Unterstützung bei der Nutzung unserer Dienste.</p>
    </div>
    
    <div class="help-container">
      <div class="help-sidebar">
        <div class="search-container">
          <input 
            v-voix="'help-search'" 
            hint="Suchen Sie in den Hilfe-Artikeln nach Begriffen"
            type="search" 
            v-model="searchTerm" 
            @input="filterFaqs" 
            placeholder="Wonach suchen Sie?" 
            class="search-input" />
        </div>
        
        <div class="category-list">
          <button 
            v-voix="'category-all'" 
            hint="Zeigt alle Hilfe-Artikel an"
            class="category-button" 
            :class="{ active: activeCategory === 'all' }"
            @click="selectCategory('all')">
            <span class="category-icon">🔍</span>
            <span class="category-name">Alle Themen</span>
          </button>
          
          <button 
            v-for="category in categories" 
            :key="category.id"
            v-voix="'category-' + category.id" 
            :hint="'Zeigt Hilfe-Artikel zum Thema ' + category.name"
            class="category-button" 
            :class="{ active: activeCategory === category.id }"
            @click="selectCategory(category.id)">
            <span class="category-icon">{{ category.icon }}</span>
            <span class="category-name">{{ category.name }}</span>
          </button>
        </div>
        
        <div class="help-actions">
          <button 
            v-voix="'open-chatbot'" 
            hint="Öffnet den Chat-Assistenten für Hilfe"
            class="chatbot-button" 
            @click="toggleChatbot">
            <span class="action-icon">💬</span>
            Chat-Assistent
          </button>
          
          <button 
            v-voix="'contact-support'" 
            hint="Öffnet das Kontaktformular"
            class="contact-button" 
            @click="router.push('#contact-form')">
            <span class="action-icon">✉️</span>
            Support kontaktieren
          </button>
        </div>
      </div>
      
      <div class="help-content">
        <div class="faq-section">
          <h2>{{ activeCategory === 'all' ? 'Alle Themen' : categories.find(c => c.id === activeCategory)?.name || 'Hilfe' }}</h2>
          
          <div v-if="filteredFaqs.length === 0" class="no-results">
            <p>Keine Ergebnisse für "{{ searchTerm }}" gefunden.</p>
            <button 
              v-voix="'clear-search'" 
              hint="Setzt die Suche zurück"
              class="clear-search" 
              @click="searchTerm = ''; filterFaqs()">
              Suche zurücksetzen
            </button>
          </div>
          
          <div v-else class="faq-list">
            <details 
              v-for="faq in filteredFaqs" 
              :key="faq.id"
              class="faq-item"
              v-voix="'faq-' + faq.id"
              hint="Öffnet oder schließt diese FAQ">
              <summary class="faq-question">{{ faq.question }}</summary>
              <div class="faq-answer">
                <p>{{ faq.answer }}</p>
              </div>
            </details>
          </div>
        </div>
        
        <div id="contact-form" class="contact-section">
          <h2>Kontaktieren Sie uns</h2>
          <p>Sie haben eine Frage, die nicht in den FAQs beantwortet wird? Kontaktieren Sie unseren Support.</p>
          
          <form class="contact-form" @submit.prevent="submitContactForm">
            <div v-if="formSuccess" class="form-success">
              <div class="success-icon">✓</div>
              <p>Vielen Dank für Ihre Nachricht! Wir werden uns so schnell wie möglich bei Ihnen melden.</p>
            </div>
            
            <div v-else>
              <div class="form-row">
                <div class="form-group">
                  <label for="name">Name <span class="required">*</span></label>
                  <input 
                    v-voix="'contact-name'" 
                    hint="Geben Sie Ihren Namen ein"
                    type="text" 
                    id="name" 
                    v-model="contactForm.name"
                    :class="{ 'invalid': formSubmitted && !contactForm.name }">
                  <div v-if="formSubmitted && !contactForm.name" class="field-error">Bitte geben Sie Ihren Namen ein.</div>
                </div>
                
                <div class="form-group">
                  <label for="email">E-Mail <span class="required">*</span></label>
                  <input 
                    v-voix="'contact-email'" 
                    hint="Geben Sie Ihre E-Mail-Adresse ein"
                    type="email" 
                    id="email" 
                    v-model="contactForm.email"
                    :class="{ 'invalid': formSubmitted && !contactForm.email }">
                  <div v-if="formSubmitted && !contactForm.email" class="field-error">Bitte geben Sie Ihre E-Mail-Adresse ein.</div>
                </div>
              </div>
              
              <div class="form-group">
                <label for="subject">Betreff</label>
                <input 
                  v-voix="'contact-subject'" 
                  hint="Geben Sie einen Betreff für Ihre Anfrage ein"
                  type="text" 
                  id="subject" 
                  v-model="contactForm.subject">
              </div>
              
              <div class="form-group">
                <label for="message">Nachricht <span class="required">*</span></label>
                <textarea 
                  v-voix="'contact-message'" 
                  hint="Beschreiben Sie Ihr Anliegen"
                  id="message" 
                  v-model="contactForm.message" 
                  rows="6"
                  :class="{ 'invalid': formSubmitted && !contactForm.message }"></textarea>
                <div v-if="formSubmitted && !contactForm.message" class="field-error">Bitte geben Sie Ihre Nachricht ein.</div>
              </div>
              
              <div class="form-actions">
                <button 
                  v-voix="'submit-contact'" 
                  hint="Sendet Ihre Anfrage ab"
                  type="submit" 
                  class="submit-button">
                  Nachricht senden
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- Chatbot -->
    <div class="chatbot-container" :class="{ 'open': showChatbot }">
      <div class="chatbot-header">
        <h3>Chat-Assistent</h3>
        <button 
          v-voix="'close-chatbot'" 
          hint="Schließt den Chat-Assistenten"
          class="close-button" 
          @click="toggleChatbot">
          ✕
        </button>
      </div>
      
      <div class="chatbot-messages">
        <div 
          v-for="(message, index) in chatMessages" 
          :key="index" 
          class="chat-message" 
          :class="message.sender">
          <div class="message-content">{{ message.message }}</div>
          <div class="message-time">{{ formatTime(message.time) }}</div>
        </div>
      </div>
      
      <div class="chatbot-input">
        <input 
          v-voix="'chat-input'" 
          hint="Stellen Sie hier Ihre Frage an den Chat-Assistenten"
          type="text" 
          v-model="currentMessage" 
          @keyup.enter="sendMessage"
          placeholder="Stellen Sie Ihre Frage..." />
        <button 
          v-voix="'send-message'" 
          hint="Sendet Ihre Nachricht ab"
          class="send-button" 
          @click="sendMessage">
          Senden
        </button>
      </div>
    </div>
    
    <button 
      v-voix="'toggle-chatbot'" 
      hint="Öffnet oder schließt den Chat-Assistenten"
      class="chatbot-toggle" 
      :class="{ 'hidden': showChatbot }"
      @click="toggleChatbot">
      <span class="toggle-icon">💬</span>
      <span class="toggle-text">Hilfe?</span>
    </button>
  </div>
</template>

<style scoped>
.help-view {
  animation: fadeIn 0.5s ease-out;
  position: relative;
}

.help-header {
  margin-bottom: 2rem;
}

.help-header h1 {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.help-header p {
  color: var(--text-color);
  opacity: 0.8;
}

.help-container {
  display: flex;
  gap: 2rem;
}

.help-sidebar {
  width: 300px;
  flex-shrink: 0;
}

.help-content {
  flex: 1;
  min-width: 0; /* Prevent flex items from overflowing */
}

.search-container {
  margin-bottom: 1.5rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--card-background);
  color: var(--text-color);
  transition: border-color var(--transition-speed), box-shadow var(--transition-speed);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.category-list {
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: var(--shadow);
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.category-button {
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
  transition: background-color var(--transition-speed);
}

.category-button:last-child {
  border-bottom: none;
}

.category-button:hover {
  background-color: rgba(59, 130, 246, 0.05);
}

.category-button.active {
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--primary-color);
  font-weight: bold;
}

.category-icon {
  margin-right: 0.75rem;
}

.help-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chatbot-button, .contact-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color var(--transition-speed);
}

.chatbot-button {
  background-color: var(--primary-color);
  color: white;
}

.chatbot-button:hover {
  background-color: var(--secondary-color);
}

.contact-button {
  background-color: var(--border-color);
  color: var(--text-color);
}

.contact-button:hover {
  background-color: var(--text-color);
  color: white;
}

.action-icon {
  margin-right: 0.5rem;
}

.faq-section, .contact-section {
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.faq-section h2, .contact-section h2 {
  margin: 0 0 1.5rem 0;
  color: var(--primary-color);
  font-size: 1.5rem;
}

.no-results {
  text-align: center;
  padding: 2rem;
}

.clear-search {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.faq-question {
  padding: 1.25rem;
  font-weight: bold;
  cursor: pointer;
  position: relative;
  transition: background-color var(--transition-speed);
}

.faq-question:hover {
  background-color: rgba(59, 130, 246, 0.05);
}

.faq-question::-webkit-details-marker {
  display: none;
}

.faq-question::after {
  content: '+';
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.5rem;
}

details[open] .faq-question::after {
  content: '−';
}

.faq-answer {
  padding: 0 1.25rem 1.25rem;
  line-height: 1.6;
}

.contact-section p {
  margin-bottom: 1.5rem;
}

.contact-form {
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
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input, .form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--card-background);
  color: var(--text-color);
  transition: border-color var(--transition-speed), box-shadow var(--transition-speed);
}

.form-group input:focus, .form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group input.invalid, .form-group textarea.invalid {
  border-color: var(--error-color);
}

.field-error {
  color: var(--error-color);
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.required {
  color: var(--error-color);
}

.form-actions {
  text-align: right;
}

.submit-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color var(--transition-speed);
}

.submit-button:hover {
  background-color: var(--secondary-color);
}

.form-success {
  text-align: center;
  padding: 2rem;
}

.success-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  background-color: var(--success-color);
  border-radius: 50%;
  color: white;
  font-size: 2rem;
  margin: 0 auto 1.5rem;
}

/* Chatbot Styles */
.chatbot-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 350px;
  height: 450px;
  background-color: var(--card-background);
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  transform: translateY(100%);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
  z-index: 50;
  visibility: hidden;
}

.chatbot-container.open {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

.chatbot-header {
  padding: 1rem;
  background-color: var(--primary-color);
  color: white;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chatbot-header h3 {
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
}

.chatbot-messages {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chat-message {
  max-width: 80%;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  position: relative;
}

.chat-message.bot {
  align-self: flex-start;
  background-color: var(--border-color);
  color: var(--text-color);
}

.chat-message.user {
  align-self: flex-end;
  background-color: var(--primary-color);
  color: white;
}

.message-content {
  margin-bottom: 0.5rem;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
  text-align: right;
}

.chatbot-input {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 0.5rem;
}

.chatbot-input input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  background-color: var(--card-background);
  color: var(--text-color);
}

.chatbot-input input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.send-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color var(--transition-speed);
}

.send-button:hover {
  background-color: var(--secondary-color);
}

.chatbot-toggle {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: auto;
  padding: 0.75rem 1.25rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50px;
  display: flex;
  align-items: center;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  z-index: 40;
}

.chatbot-toggle:hover {
  transform: translateY(-3px);
}

.chatbot-toggle.hidden {
  display: none;
}

.toggle-icon {
  margin-right: 0.5rem;
  font-size: 1.2rem;
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
  .help-container {
    flex-direction: column;
  }
  
  .help-sidebar {
    width: 100%;
  }
  
  .category-list {
    display: flex;
    overflow-x: auto;
  }
  
  .category-button {
    flex: 1;
    white-space: nowrap;
    padding: 0.75rem 1rem;
    border-bottom: none;
    border-right: 1px solid var(--border-color);
  }
  
  .category-button:last-child {
    border-right: none;
  }
  
  .help-actions {
    flex-direction: row;
  }
  
  .chatbot-button, .contact-button {
    flex: 1;
  }
  
  .chatbot-container {
    width: 100%;
    height: 50vh;
    bottom: 0;
    right: 0;
    border-radius: 10px 10px 0 0;
  }
  
  .chatbot-toggle {
    bottom: 20px;
    right: 20px;
  }
}
</style>