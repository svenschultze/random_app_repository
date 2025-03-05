<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import { generateExportHtml } from '@/utils/surveyExport'

// Question type components
const questionTypes = [
  { id: 'multiple_choice', name: 'Multiple Choice', icon: '◉', description: 'Radio buttons for selecting a single option' },
  { id: 'checkbox_group', name: 'Checkbox Group', icon: '☑', description: 'Multiple selectable options' },
  { id: 'likert_scale', name: 'Likert Scale', icon: '☰', description: 'Rating scale (e.g., 1-5) with optional labels' },
  { id: 'open_text', name: 'Open Text', icon: '✎', description: 'Single-line or multi-line text input field' },
  { id: 'matrix', name: 'Matrix', icon: '▦', description: 'Grid of options with rows and columns' },
  { id: 'dropdown', name: 'Dropdown', icon: '▼', description: 'Compact menu of options' },
  { id: 'ranking', name: 'Ranking', icon: '⇅', description: 'Drag-and-drop ordering of items' },
  { id: 'numeric', name: 'Numeric', icon: '🔢', description: 'Number input with optional range limits' },
  { id: 'date', name: 'Date', icon: '📅', description: 'Date picker with optional range limits' },
  { id: 'file_upload', name: 'File Upload', icon: '📎', description: 'Allow file attachments from respondents' },
  { id: 'section_break', name: 'Section Break', icon: '📑', description: 'Divider with optional title and description' }
]

// Define the survey state
const surveyState = reactive({
  title: 'My Survey',
  description: 'A sample survey created with Survey Architect',
  questions: [],
  settings: {
    // Display settings
    showProgressBar: true,
    questionNumbering: 'visible',
    navigationStyle: 'buttons',
    requiredIndicator: 'asterisk',
    
    // Randomization settings
    randomizeQuestions: false,
    respectSections: true,
    respectLogic: true,
    
    // Language settings
    languages: ['en'],
    defaultLanguage: 'en',
    
    // Completion settings
    completionMessage: {
      en: 'Thank you for completing this survey!'
    },
    showResponseSummary: false,
    
    // Theme settings
    primaryColor: '#1976d2',
    backgroundColor: '#ffffff',
    fontFamily: 'system-ui'
  }
})

// UI state management
const activeQuestionIndex = ref(null)
const activeTab = ref('questions') // questions, settings, logic, translations
const activeLogicQuestion = ref('') // Index of the question being edited for logic
const router = useRouter()

// Logic rule system
const newRule = reactive({
  condition: 'equals',
  value: '',
  action: 'show',
  targetQuestionId: ''
})

// Translation system
const newLanguage = ref('')
const translateLanguage = ref('')
const translateElement = ref('title')
const translateQuestionIndex = ref(0)

// Track translations separately and sync with main state
const surveyTranslations = reactive({
  title: {},
  description: {},
  completionMessage: {}
})

// Create a new question with default values based on the type
const createQuestion = (type) => {
  const newId = Date.now().toString()
  const question = {
    id: newId,
    type: type,
    required: false,
    text: {
      en: `New ${type.replace('_', ' ')} question`
    },
    description: {
      en: ''
    },
    options: ['multiple_choice', 'checkbox_group', 'dropdown', 'ranking'].includes(type) ? 
      [
        { id: '1', text: { en: 'Option 1' } },
        { id: '2', text: { en: 'Option 2' } },
        { id: '3', text: { en: 'Option 3' } }
      ] : [],
    properties: {
      randomize: false // Add randomization option for all questions
    },
    logic: [] // Add branching logic array for all questions
  }
  
  // Add specific properties based on question type
  switch(type) {
    case 'multiple_choice':
      question.properties.allowOther = false
      break
    case 'checkbox_group':
      question.properties.minSelections = 0
      question.properties.maxSelections = null
      question.properties.allowOther = false
      break
    case 'likert_scale':
      question.properties.scale = 5
      question.properties.labels = {
        start: { en: 'Strongly Disagree' },
        end: { en: 'Strongly Agree' }
      }
      question.properties.showValues = true
      break
    case 'open_text':
      question.properties.multiline = false
      question.properties.maxLength = 500
      question.properties.placeholder = { en: '' }
      break
    case 'matrix':
      question.rows = [
        { id: 'r1', text: { en: 'Row 1' } },
        { id: 'r2', text: { en: 'Row 2' } },
        { id: 'r3', text: { en: 'Row 3' } }
      ]
      question.columns = [
        { id: 'c1', text: { en: 'Column 1' } },
        { id: 'c2', text: { en: 'Column 2' } },
        { id: 'c3', text: { en: 'Column 3' } }
      ]
      question.properties.oneResponsePerRow = true
      break
    case 'dropdown':
      question.properties.placeholder = { en: '-- Select an option --' }
      break
    case 'ranking':
      question.properties.showNumbers = true
      break
    case 'numeric':
      question.properties.min = null
      question.properties.max = null
      question.properties.step = 1
      question.properties.unit = { en: '' }
      break
    case 'date':
      question.properties.minDate = null
      question.properties.maxDate = null
      question.properties.dateFormat = 'YYYY-MM-DD'
      break
    case 'file_upload':
      question.properties.maxFileSize = 5
      question.properties.allowedTypes = ['image/*', 'application/pdf']
      question.properties.maxFiles = 1
      break
    case 'section_break':
      question.properties.showTitle = true
      question.properties.titleLevel = 2
      break
  }
  
  return question
}

// Add a question to the survey
const addQuestion = (type) => {
  const newQuestion = createQuestion(type)
  surveyState.questions.push(newQuestion)
  activeQuestionIndex.value = surveyState.questions.length - 1
  activeTab.value = 'questions'
}

// Edit a question
const editQuestion = (index) => {
  activeQuestionIndex.value = index
  activeTab.value = 'questions'
}

// Delete a question
const deleteQuestion = (index) => {
  if (confirm('Are you sure you want to delete this question?')) {
    surveyState.questions.splice(index, 1)
    activeQuestionIndex.value = null
  }
}

// Search for question types
const questionSearch = ref('')

// Filtered question types based on search
const filteredQuestionTypes = computed(() => {
  if (!questionSearch.value) return questionTypes
  const search = questionSearch.value.toLowerCase()
  return questionTypes.filter(type => 
    type.name.toLowerCase().includes(search) || 
    type.description.toLowerCase().includes(search) ||
    type.id.toLowerCase().includes(search)
  )
})

// Update a question's text
const updateQuestionText = (index, text) => {
  if (index !== null && index >= 0 && index < surveyState.questions.length) {
    surveyState.questions[index].text.en = text
  }
}

// Add new option to a question
const addOption = (questionIndex) => {
  if (questionIndex !== null && questionIndex >= 0 && questionIndex < surveyState.questions.length) {
    const question = surveyState.questions[questionIndex]
    if (question.options) {
      const newId = Date.now().toString()
      const optionNumber = question.options.length + 1
      question.options.push({
        id: newId,
        text: { en: `Option ${optionNumber}` }
      })
    }
  }
}

// Remove option from a question
const removeOption = (questionIndex, optionIndex) => {
  if (questionIndex !== null && questionIndex >= 0 && questionIndex < surveyState.questions.length) {
    const question = surveyState.questions[questionIndex]
    if (question.options && optionIndex >= 0 && optionIndex < question.options.length) {
      if (question.options.length > 1) {
        question.options.splice(optionIndex, 1)
      }
    }
  }
}

// Add new row to a matrix question
const addMatrixRow = (questionIndex) => {
  if (questionIndex !== null && questionIndex >= 0 && questionIndex < surveyState.questions.length) {
    const question = surveyState.questions[questionIndex]
    if (question.rows) {
      const newId = 'r' + Date.now().toString()
      const rowNumber = question.rows.length + 1
      question.rows.push({
        id: newId,
        text: { en: `Row ${rowNumber}` }
      })
    }
  }
}

// Remove row from a matrix question
const removeMatrixRow = (questionIndex, rowIndex) => {
  if (questionIndex !== null && questionIndex >= 0 && questionIndex < surveyState.questions.length) {
    const question = surveyState.questions[questionIndex]
    if (question.rows && rowIndex >= 0 && rowIndex < question.rows.length) {
      if (question.rows.length > 1) {
        question.rows.splice(rowIndex, 1)
      }
    }
  }
}

// Add new column to a matrix question
const addMatrixColumn = (questionIndex) => {
  if (questionIndex !== null && questionIndex >= 0 && questionIndex < surveyState.questions.length) {
    const question = surveyState.questions[questionIndex]
    if (question.columns) {
      const newId = 'c' + Date.now().toString()
      const columnNumber = question.columns.length + 1
      question.columns.push({
        id: newId,
        text: { en: `Column ${columnNumber}` }
      })
    }
  }
}

// Remove column from a matrix question
const removeMatrixColumn = (questionIndex, columnIndex) => {
  if (questionIndex !== null && questionIndex >= 0 && questionIndex < surveyState.questions.length) {
    const question = surveyState.questions[questionIndex]
    if (question.columns && columnIndex >= 0 && columnIndex < question.columns.length) {
      if (question.columns.length > 1) {
        question.columns.splice(columnIndex, 1)
      }
    }
  }
}

// Logic rule handling
const canAddRule = computed(() => {
  return activeLogicQuestion.value !== '' &&
         newRule.value !== '' &&
         newRule.targetQuestionId !== ''
})

// Add a new logic rule to a question
const addLogicRule = () => {
  if (!canAddRule.value) return
  const questionIndex = parseInt(activeLogicQuestion.value)
  if (questionIndex >= 0 && questionIndex < surveyState.questions.length) {
    const rule = {
      condition: newRule.condition,
      value: newRule.value,
      action: newRule.action,
      targetQuestionId: newRule.targetQuestionId
    }
    surveyState.questions[questionIndex].logic.push(rule)
    newRule.value = ''
    newRule.targetQuestionId = ''
  }
}

// Remove a logic rule
const removeLogicRule = (questionIndex, ruleIndex) => {
  if (questionIndex !== null && questionIndex >= 0 && questionIndex < surveyState.questions.length) {
    const question = surveyState.questions[questionIndex]
    if (question.logic && ruleIndex >= 0 && ruleIndex < question.logic.length) {
      question.logic.splice(ruleIndex, 1)
    }
  }
}

// Get human-readable text for a logic condition
const getLogicConditionText = (rule) => {
  if (!rule) return ''
  const sourceQuestion = surveyState.questions[activeLogicQuestion.value]
  let conditionText = ''
  switch (rule.condition) {
    case 'equals':
      conditionText = 'equals'
      break
    case 'not_equals':
      conditionText = 'does not equal'
      break
    case 'contains':
      conditionText = 'contains'
      break
    case 'not_contains':
      conditionText = 'does not contain'
      break
    case 'greater_than':
      conditionText = 'is greater than'
      break
    case 'less_than':
      conditionText = 'is less than'
      break
    default:
      conditionText = rule.condition
  }
  let valueText = rule.value
  if (['multiple_choice', 'checkbox_group', 'dropdown'].includes(sourceQuestion.type)) {
    const option = sourceQuestion.options.find(opt => opt.id === rule.value)
    if (option) {
      valueText = option.text.en
    }
  }
  return `${conditionText} "${valueText}"`
}

// Get the question number by its ID
const getQuestionNumberById = (questionId) => {
  const index = surveyState.questions.findIndex(q => q.id === questionId)
  return index !== -1 ? index + 1 : '?'
}

// Translation system methods
const canAddLanguage = computed(() => {
  return newLanguage.value &&
         newLanguage.value.length === 2 &&
         !surveyState.settings.languages.includes(newLanguage.value.toLowerCase())
})

const addLanguage = () => {
  if (!canAddLanguage.value) return
  const lang = newLanguage.value.toLowerCase()
  surveyState.settings.languages.push(lang)
  surveyTranslations.title[lang] = ''
  surveyTranslations.description[lang] = ''
  surveyTranslations.completionMessage[lang] = ''
  newLanguage.value = ''
  translateLanguage.value = lang
}

const removeLanguage = (lang) => {
  if (lang === 'en' || lang === surveyState.settings.defaultLanguage) return
  const index = surveyState.settings.languages.indexOf(lang)
  if (index !== -1) {
    surveyState.settings.languages.splice(index, 1)
    if (translateLanguage.value === lang) {
      translateLanguage.value = ''
    }
    if (surveyTranslations.title[lang]) delete surveyTranslations.title[lang]
    if (surveyTranslations.description[lang]) delete surveyTranslations.description[lang]
    if (surveyTranslations.completionMessage[lang]) delete surveyTranslations.completionMessage[lang]
    surveyState.questions.forEach(question => {
      if (question.text[lang]) delete question.text[lang]
      if (question.description[lang]) delete question.description[lang]
      if (question.options) {
        question.options.forEach(option => {
          if (option.text[lang]) delete option.text[lang]
        })
      }
      if (question.type === 'likert_scale' && question.properties.labels) {
        if (question.properties.labels.start[lang]) delete question.properties.labels.start[lang]
        if (question.properties.labels.end[lang]) delete question.properties.labels.end[lang]
      }
    })
  }
}

const getLanguageName = (code) => {
  const languageNames = {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'zh': 'Chinese',
    'ja': 'Japanese',
    'ko': 'Korean',
    'ar': 'Arabic',
    'hi': 'Hindi',
    'nl': 'Dutch',
    'sv': 'Swedish',
    'no': 'Norwegian',
    'da': 'Danish',
    'fi': 'Finnish',
    'pl': 'Polish',
    'tr': 'Turkish',
    'he': 'Hebrew'
  }
  return languageNames[code] || code.toUpperCase()
}

// Translation getters/setters
const getQuestionTranslation = (questionIndex, field, lang) => {
  if (questionIndex < 0 || questionIndex >= surveyState.questions.length) return ''
  const question = surveyState.questions[questionIndex]
  if (!question[field][lang]) {
    question[field][lang] = ''
  }
  return question[field][lang]
}

const getOptionTranslation = (questionIndex, optionIndex, lang) => {
  if (questionIndex < 0 || questionIndex >= surveyState.questions.length) return ''
  const question = surveyState.questions[questionIndex]
  if (!question.options || optionIndex < 0 || optionIndex >= question.options.length) return ''
  const option = question.options[optionIndex]
  if (!option.text[lang]) {
    option.text[lang] = ''
  }
  return option.text[lang]
}

const getLikertLabelTranslation = (questionIndex, labelType, lang) => {
  if (questionIndex < 0 || questionIndex >= surveyState.questions.length) return ''
  const question = surveyState.questions[questionIndex]
  if (question.type !== 'likert_scale' || !question.properties.labels || !question.properties.labels[labelType]) return ''
  if (!question.properties.labels[labelType][lang]) {
    question.properties.labels[labelType][lang] = ''
  }
  return question.properties.labels[labelType][lang]
}

// Synchronize translations with the main survey state
const syncTranslations = () => {
  // Create a deep copy of the survey state
  const surveyToExport = JSON.parse(JSON.stringify(surveyState))
  
  // Convert title from string to object with translations
  if (typeof surveyToExport.title === 'string') {
    surveyToExport.title = { 'en': surveyToExport.title }
  }
  
  // Convert description from string to object with translations
  if (typeof surveyToExport.description === 'string') {
    surveyToExport.description = { 'en': surveyToExport.description }
  }
  
  // Add translations from surveyTranslations
  Object.keys(surveyTranslations.title).forEach(lang => {
    if (surveyTranslations.title[lang]) {
      surveyToExport.title[lang] = surveyTranslations.title[lang]
    }
  })
  
  Object.keys(surveyTranslations.description).forEach(lang => {
    if (surveyTranslations.description[lang]) {
      surveyToExport.description[lang] = surveyTranslations.description[lang]
    }
  })
  
  // Add completion message translations
  Object.keys(surveyTranslations.completionMessage).forEach(lang => {
    if (surveyTranslations.completionMessage[lang]) {
      surveyToExport.settings.completionMessage[lang] = surveyTranslations.completionMessage[lang]
    }
  })
  
  // Check all questions and their translatable elements
  surveyToExport.questions.forEach(question => {
    // Ensure question text is an object with language keys
    if (typeof question.text === 'string') {
      question.text = { 'en': question.text }
    }
    
    // Ensure question description is an object with language keys
    if (typeof question.description === 'string') {
      question.description = { 'en': question.description }
    }
    
    // Handle question options for multiple choice, checkbox group, dropdown, etc.
    if (question.options && question.options.length > 0) {
      question.options.forEach(option => {
        // Ensure option text is an object with language keys
        if (typeof option.text === 'string') {
          option.text = { 'en': option.text }
        }
      })
    }
    
    // Handle matrix rows and columns
    if (question.type === 'matrix') {
      if (question.rows && question.rows.length > 0) {
        question.rows.forEach(row => {
          if (typeof row.text === 'string') {
            row.text = { 'en': row.text }
          }
        })
      }
      
      if (question.columns && question.columns.length > 0) {
        question.columns.forEach(col => {
          if (typeof col.text === 'string') {
            col.text = { 'en': col.text }
          }
        })
      }
    }
    
    // Handle likert scale labels
    if (question.type === 'likert_scale' && question.properties.labels) {
      if (typeof question.properties.labels.start === 'string') {
        question.properties.labels.start = { 'en': question.properties.labels.start }
      }
      
      if (typeof question.properties.labels.end === 'string') {
        question.properties.labels.end = { 'en': question.properties.labels.end }
      }
    }
    
    // Handle placeholder text for open text and dropdown questions
    if (['open_text', 'dropdown'].includes(question.type) && 
        question.properties.placeholder && 
        typeof question.properties.placeholder === 'string') {
      question.properties.placeholder = { 'en': question.properties.placeholder }
    }
    
    // Handle unit text for numeric questions
    if (question.type === 'numeric' && 
        question.properties.unit && 
        typeof question.properties.unit === 'string') {
      question.properties.unit = { 'en': question.properties.unit }
    }
  })
  
  return surveyToExport
}

// Preview and export functions
const previewSurvey = () => {
  const exportableSurvey = syncTranslations()
  sessionStorage.setItem('previewSurvey', JSON.stringify(exportableSurvey))
  router.push('/preview')
}

const exportSurvey = () => {
  const exportableSurvey = syncTranslations()
  
  // Debug the survey state before export (remove in production)
  console.log('Exporting survey with languages:', exportableSurvey.settings.languages)
  
  // Check if we have at least one question
  if (exportableSurvey.questions.length > 0) {
    // Debug the first question
    const firstQuestion = exportableSurvey.questions[0]
    console.log('First question text:', firstQuestion.text)
    
    // If it has options, debug the first option
    if (firstQuestion.options && firstQuestion.options.length > 0) {
      console.log('First option text:', firstQuestion.options[0].text)
    }
  }
  
  const htmlTemplate = generateExportHtml(exportableSurvey)
  const element = document.createElement('a')
  const file = new Blob([htmlTemplate], { type: 'text/html' })
  element.href = URL.createObjectURL(file)
  element.download = `${surveyState.title.replace(/\s+/g, '_')}_survey.html`
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

// Initialization
onMounted(() => {
  const savedSurvey = localStorage.getItem('savedSurvey')
  if (savedSurvey) {
    try {
      const parsed = JSON.parse(savedSurvey)
      Object.assign(surveyState, parsed)
    } catch (e) {
      console.error('Failed to load saved survey:', e)
    }
  }
})

// Auto-save survey periodically
setInterval(() => {
  localStorage.setItem('savedSurvey', JSON.stringify(surveyState))
}, 30000)

// Additional reactive state for survey UI
const currentLanguage = ref(surveyState.settings.defaultLanguage)
const currentQuestionIndex = ref(0)
const responses = reactive({})
const arrayResponses = reactive({})
const matrixResponses = reactive({})
const otherResponses = reactive({})
const otherSelected = reactive({})
const validationErrors = reactive({})
const surveyCompleted = ref(false)
const questionVisibility = reactive({})
const questionVisibilityMemo = reactive({})

// Utility: Shuffle array (for randomization)
function shuffleArray(array) {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

// Compute question order based on settings
const questionOrder = computed(() => {
  let questions = [...surveyState.questions]
  if (surveyState.settings.randomizeQuestions) {
    if (surveyState.settings.respectSections) {
      const sections = []
      let currentSection = []
      for (const q of questions) {
        if (q.type === 'section_break' && currentSection.length > 0) {
          sections.push([...currentSection])
          currentSection = [q]
        } else {
          currentSection.push(q)
        }
      }
      if (currentSection.length > 0) {
        sections.push(currentSection)
      }
      const shuffledSections = sections.map(section => shuffleArray(section))
      questions = shuffledSections.flat()
    } else {
      questions = shuffleArray(questions)
    }
  }
  return questions
})

// Visibility logic processing
function resetVisibility() {
  const questionIds = surveyState.questions.map(q => q.id)
  questionIds.forEach(id => {
    questionVisibility[id] = true
    questionVisibilityMemo[id] = null
  })
  reprocessVisibility()
}

function reprocessVisibility() {
  for (const question of surveyState.questions) {
    if (question.logic && question.logic.length > 0) {
      const showRules = question.logic.filter(rule => rule.action === 'show')
      for (const rule of showRules) {
        const targetQuestion = rule.targetQuestionId
        const isRuleMet = evaluateLogicRule(question, rule)
        const ruleKey = `${question.id}-${targetQuestion}-show`
        questionVisibilityMemo[ruleKey] = isRuleMet
      }
    }
  }
  for (const question of surveyState.questions) {
    if (question.logic && question.logic.length > 0) {
      const hideRules = question.logic.filter(rule => rule.action === 'hide')
      for (const rule of hideRules) {
        const targetQuestion = rule.targetQuestionId
        const isRuleMet = evaluateLogicRule(question, rule)
        const ruleKey = `${question.id}-${targetQuestion}-hide`
        questionVisibilityMemo[ruleKey] = isRuleMet
      }
    }
  }
  for (const targetQuestion of surveyState.questions) {
    const targetId = targetQuestion.id
    let isVisible = true
    const hideRules = Object.entries(questionVisibilityMemo)
      .filter(([key, value]) => key.endsWith(`-${targetId}-hide`) && value === true)
    if (hideRules.length > 0) {
      isVisible = false
    }
    const showRules = Object.entries(questionVisibilityMemo)
      .filter(([key]) => key.endsWith(`-${targetId}-show`))
    if (showRules.length > 0) {
      const anyShowRuleMet = showRules.some(([, value]) => value === true)
      if (!anyShowRuleMet) {
        isVisible = false
      }
    }
    questionVisibility[targetId] = isVisible
  }
}

function evaluateLogicRule(question, rule) {
  const responseValue = responses[question.id]
  const checkboxResponses = arrayResponses[question.id] || []
  if (question.type === 'checkbox_group') {
    switch (rule.condition) {
      case 'contains':
        return checkboxResponses.includes(rule.value)
      case 'not_contains':
        return !checkboxResponses.includes(rule.value)
      default:
        return false
    }
  }
  switch (rule.condition) {
    case 'equals':
      return responseValue === rule.value
    case 'not_equals':
      return responseValue !== rule.value
    case 'greater_than':
      return parseFloat(responseValue) > parseFloat(rule.value)
    case 'less_than':
      return parseFloat(responseValue) < parseFloat(rule.value)
    default:
      return false
  }
}

const visibleQuestions = computed(() => {
  return questionOrder.value.filter(q => questionVisibility[q.id])
})

const visibleQuestionIndex = computed(() => {
  const currentQuestion = visibleQuestions.value[currentQuestionIndex.value]
  return visibleQuestions.value.findIndex(q => q.id === currentQuestion?.id)
})

const progress = computed(() => {
  if (visibleQuestions.value.length === 0) return 0
  return Math.round(((currentQuestionIndex.value + 1) / visibleQuestions.value.length) * 100)
})

const currentQuestion = computed(() => {
  if (visibleQuestions.value.length === 0) return null
  return visibleQuestions.value[currentQuestionIndex.value]
})

function handleResponseChange(questionId) {
  if (validationErrors[questionId]) {
    validationErrors[questionId] = null
  }
  reprocessVisibility()
  if (surveyState.settings.navigationStyle === 'auto' && currentQuestion.value) {
    if (isCurrentResponseValid() && currentQuestionIndex.value < visibleQuestions.value.length - 1) {
      setTimeout(() => nextQuestion(), 300)
    }
  }
}

function handleOtherCheckboxChange(questionId) {
  if (otherSelected[questionId]) {
    if (!arrayResponses[questionId].includes('other')) {
      arrayResponses[questionId].push('other')
    }
  } else {
    const index = arrayResponses[questionId].indexOf('other')
    if (index !== -1) {
      arrayResponses[questionId].splice(index, 1)
    }
    otherResponses[questionId] = ''
  }
  handleResponseChange(questionId)
}

function handleMatrixResponseChange(questionId) {
  const matrixData = {}
  const question = surveyState.questions.find(q => q.id === questionId)
  if (question) {
    question.rows.forEach(row => {
      const responseKey = questionId + '-' + row.id
      matrixData[row.id] = matrixResponses[responseKey] || ''
    })
    responses[questionId] = matrixData
  }
  handleResponseChange(questionId)
}

function getQuestionOptions(question) {
  if (!question.options) return []
  if (question.properties.randomize) {
    const optionsCopy = [...question.options]
    return shuffleArray(optionsCopy)
  }
  return question.options
}

function getTranslatedText(textObj) {
  if (!textObj) return ''
  return textObj[currentLanguage.value] || textObj[surveyState.settings.defaultLanguage] || ''
}

function formatDate(dateString) {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  } catch (e) {
    return dateString
  }
}

function isCheckboxDisabled(question, optionId) {
  if (!question.properties.maxSelections) return false
  const res = arrayResponses[question.id] || []
  if (res.length >= question.properties.maxSelections && !res.includes(optionId)) {
    return true
  }
  return false
}

function nextQuestion() {
  if (!isCurrentResponseValid()) {
    return
  }
  if (currentQuestionIndex.value < visibleQuestions.value.length - 1) {
    currentQuestionIndex.value++
    window.scrollTo(0, 0)
  }
}

function prevQuestion() {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    window.scrollTo(0, 0)
  }
}

function isCurrentResponseValid() {
  const question = currentQuestion.value
  if (!question) return true
  if (question.type === 'section_break') return true
  validationErrors[question.id] = null
  if (question.required) {
    let hasResponse = false
    switch (question.type) {
      case 'multiple_choice':
      case 'dropdown':
      case 'date':
      case 'open_text':
      case 'numeric':
        hasResponse = !!responses[question.id]
        break
      case 'checkbox_group':
        hasResponse = arrayResponses[question.id] && arrayResponses[question.id].length > 0
        break
      case 'likert_scale':
        hasResponse = !!responses[question.id]
        break
      case 'matrix':
        const matrixData = responses[question.id] || {}
        hasResponse = question.rows.every(row => matrixData[row.id])
        break
    }
    if (!hasResponse) {
      validationErrors[question.id] = 'This question is required.'
      return false
    }
  }
  if (question.type === 'checkbox_group') {
    const selections = arrayResponses[question.id] || []
    if (question.properties.minSelections > 0 && selections.length < question.properties.minSelections) {
      validationErrors[question.id] = `Please select at least ${question.properties.minSelections} options.`
      return false
    }
    if (question.properties.maxSelections && selections.length > question.properties.maxSelections) {
      validationErrors[question.id] = `Please select at most ${question.properties.maxSelections} options.`
      return false
    }
  }
  if (question.type === 'matrix' && question.required) {
    const matrixData = responses[question.id] || {}
    if (!question.rows.every(row => matrixData[row.id])) {
      validationErrors[question.id] = 'Please provide a response for each row.'
      return false
    }
  }
  if (question.type === 'numeric') {
    const value = responses[question.id]
    if (value !== '' && value !== null && value !== undefined) {
      const numValue = parseFloat(value)
      if (isNaN(numValue)) {
        validationErrors[question.id] = 'Please enter a valid number.'
        return false
      }
      if (question.properties.min !== null && numValue < question.properties.min) {
        validationErrors[question.id] = `The value must be at least ${question.properties.min}.`
        return false
      }
      if (question.properties.max !== null && numValue > question.properties.max) {
        validationErrors[question.id] = `The value must be at most ${question.properties.max}.`
        return false
      }
    }
  }
  if (question.type === 'date') {
    const value = responses[question.id]
    if (value) {
      if (question.properties.minDate && value < question.properties.minDate) {
        validationErrors[question.id] = `The date must be on or after ${formatDate(question.properties.minDate)}.`
        return false
      }
      if (question.properties.maxDate && value > question.properties.maxDate) {
        validationErrors[question.id] = `The date must be on or before ${formatDate(question.properties.maxDate)}.`
        return false
      }
    }
  }
  return true
}

function submitSurvey() {
  if (!isCurrentResponseValid()) {
    return
  }
  const responseData = {
    survey_id: surveyState.id,
    timestamp: new Date().toISOString(),
    responses: {}
  }
  surveyState.questions.forEach(question => {
    if (question.type === 'section_break') return
    let responseValue = null
    switch (question.type) {
      case 'multiple_choice':
        responseValue = responses[question.id]
        if (responseValue === 'other' && otherResponses[question.id]) {
          responseValue = { other: otherResponses[question.id] }
        }
        break
      case 'checkbox_group':
        responseValue = arrayResponses[question.id] || []
        if (responseValue.includes('other') && otherResponses[question.id]) {
          responseValue = [...responseValue.filter(v => v !== 'other'), { other: otherResponses[question.id] }]
        }
        break
      case 'matrix':
        responseValue = responses[question.id] || {}
        break
      default:
        responseValue = responses[question.id]
    }
    responseData.responses[question.id] = {
      question_type: question.type,
      question_text: getTranslatedText(question.text),
      response: responseValue
    }
  })
  surveyCompleted.value = true
  console.log('Survey responses:', responseData)
  window.scrollTo(0, 0)
}

function formatResponseForSummary(question) {
  if (!question) return ''
  const questionId = question.id
  switch (question.type) {
    case 'multiple_choice':
      const choice = responses[questionId]
      if (!choice) return 'No answer'
      if (choice === 'other') {
        return otherResponses[questionId] || 'Other'
      } else {
        const option = question.options.find(o => o.id === choice)
        return option ? getTranslatedText(option.text) : choice
      }
    case 'checkbox_group': {
      const choices = arrayResponses[questionId] || []
      if (choices.length === 0) return 'No answer'
      const selectedOptions = choices.map(choiceId => {
        if (choiceId === 'other') {
          return otherResponses[questionId] || 'Other'
        } else {
          const option = question.options.find(o => o.id === choiceId)
          return option ? getTranslatedText(option.text) : choiceId
        }
      })
      return selectedOptions.join(', ')
    }
    case 'likert_scale': {
      const value = responses[questionId]
      if (!value) return 'No answer'
      return `${value} out of ${question.properties.scale}`
    }
    case 'matrix': {
      const matrixData = responses[questionId] || {}
      if (Object.keys(matrixData).length === 0) return 'No answer'
      const rows = []
      for (const row of question.rows) {
        const columnId = matrixData[row.id]
        if (!columnId) continue
        const column = question.columns.find(c => c.id === columnId)
        const rowText = getTranslatedText(row.text)
        const colText = column ? getTranslatedText(column.text) : columnId
        rows.push(`${rowText}: ${colText}`)
      }
      return rows.join('\n')
    }
    case 'dropdown': {
      const choiceId = responses[questionId]
      if (!choiceId) return 'No answer'
      const option = question.options.find(o => o.id === choiceId)
      return option ? getTranslatedText(option.text) : choiceId
    }
    case 'date': {
      const date = responses[questionId]
      if (!date) return 'No answer'
      return formatDate(date)
    }
    default:
      return responses[questionId] || 'No answer'
  }
}

function getAnsweredQuestions() {
  return surveyState.questions.filter(q => {
    if (q.type === 'section_break') return false
    const response = responses[q.id]
    if (q.type === 'checkbox_group') {
      return arrayResponses[q.id] && arrayResponses[q.id].length > 0
    } else if (q.type === 'matrix') {
      const matrixData = response || {}
      return Object.keys(matrixData).length > 0
    } else {
      return response !== undefined && response !== null && response !== ''
    }
  })
}

function handleLanguageChange() {
  // Reactive change handled automatically
}
</script>

<template>
    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Survey header with improved layout -->
      <div class="canvas-header">
        <div class="header-left">
          <input 
            type="text" 
            v-model="surveyState.title" 
            class="title-input" 
            v-voix="'Edit Survey Title'" 
            hint="Click to edit your survey title"
          >
        </div>
        
        <div class="header-tabs">
          <button @click="activeTab = 'questions'" :class="{ active: activeTab === 'questions' }" v-voix="'Questions Tab'">Questions</button>
          <button @click="activeTab = 'settings'" :class="{ active: activeTab === 'settings' }" v-voix="'Settings Tab'">Settings</button>
          <button @click="activeTab = 'translations'" :class="{ active: activeTab === 'translations' }" v-voix="'Translations Tab'">Translations</button>
        </div>
        
        <div class="canvas-actions">
          <button @click="previewSurvey" class="secondary-button" v-voix="'Preview Survey'" hint="See how your survey will appear to respondents">Preview</button>
          <button @click="exportSurvey" class="primary-button" v-voix="'Export Survey'" hint="Save your survey as an HTML file">Export</button>
        </div>
      </div>

      <!-- Content based on active tab -->
      <div v-if="activeTab === 'questions'" class="content-area with-sidebar">
        <!-- Question Sidebar -->
        <div class="question-sidebar">
          <h3>Add New Question</h3>
          <div class="search-box">
            <input type="text" placeholder="Search question types..." v-model="questionSearch" v-voix="'Search Question Types'" hint="Type to filter available question types" />
          </div>
          <div class="question-types-list">
            <div 
              v-for="type in filteredQuestionTypes" 
              :key="type.id" 
              class="question-type-item" 
              @click="addQuestion(type.id)"
              :title="type.description"
              v-voix="'Add ' + type.name + ' Question'"
            >
              <div class="question-type-icon">{{ type.icon }}</div>
              <div class="question-type-info">
                <div class="question-type-name">{{ type.name }}</div>
                <div class="question-type-desc">{{ type.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Questions Main Area -->
        <div class="questions-main-area">
          <div class="questions-container">
            <div v-if="surveyState.questions.length === 0" class="empty-state">
              <p>No questions yet. Use the question types in the sidebar to add questions to your survey.</p>
            </div>
            <draggable 
              v-model="surveyState.questions"
              group="questions"
              item-key="id"
              class="questions-list"
              handle=".drag-handle"
            >
              <template #item="{ element, index }">
                <div class="question-card" :class="{ active: index === activeQuestionIndex }">
                  <div class="question-card-header">
                    <div class="drag-handle">⋮⋮</div>
                    <div class="question-number">Q{{ index + 1 }}</div>
                    <div class="question-type-badge">{{ questionTypes.find(t => t.id === element.type)?.name || element.type }}</div>
                    <div class="question-actions">
                      <button @click="editQuestion(index)" class="icon-button" v-voix="'Edit Question ' + (index + 1)">✎</button>
                      <button @click="deleteQuestion(index)" class="icon-button" v-voix="'Delete Question ' + (index + 1)">✕</button>
                    </div>
                  </div>
                  <div class="question-card-body">
                    <input 
                      v-if="index === activeQuestionIndex"
                      v-model="element.text.en" 
                      class="question-text-input"
                      @input="updateQuestionText(index, $event.target.value)"
                      v-voix="'Question ' + (index + 1) + ' Text'"
                      hint="Enter the text for this question"
                    >
                    <div v-else class="question-text">{{ element.text.en }}</div>
                    <div class="question-preview">
                      <div v-if="element.type === 'multiple_choice'" class="preview-options">
                        <div v-for="option in element.options" :key="option.id" class="preview-option">
                          <span class="option-indicator">◯</span>
                          <span class="option-text">{{ option.text.en }}</span>
                        </div>
                      </div>
                      <div v-else-if="element.type === 'likert_scale'" class="preview-likert">
                        <div class="likert-scale">
                          <div v-for="n in (element.properties?.scale || 5)" :key="n" class="likert-point">
                            <span class="option-indicator">◯</span>
                            <span class="option-text">{{ n }}</span>
                          </div>
                        </div>
                        <div class="likert-labels">
                          <span class="likert-start">{{ element.properties?.labels?.start?.en || 'Strongly Disagree' }}</span>
                          <span class="likert-end">{{ element.properties?.labels?.end?.en || 'Strongly Agree' }}</span>
                        </div>
                      </div>
                      <div v-else-if="element.type === 'open_text'" class="preview-text">
                        <div class="text-input-placeholder">Text input field</div>
                      </div>
                      <div v-else class="preview-placeholder">
                        {{ element.type.replace('_', ' ') }} preview
                      </div>
                    </div>
                  </div>
                  
                  <!-- Inline editor for selected question -->
                  <div v-if="index === activeQuestionIndex" class="inline-editor">
                    <div class="settings-group">
                      <label for="question-description">Description (Optional)</label>
                      <textarea id="question-description" v-model="element.description.en" rows="2" v-voix="'Question ' + (index + 1) + ' Description'" hint="Enter optional additional information about this question"></textarea>
                    </div>
                    <div class="settings-group checkbox-group">
                      <label class="checkbox-label">
                        <input type="checkbox" v-model="element.required" v-voix="'Required Question Checkbox'" hint="Make this question mandatory for respondents to answer" />
                        Required Question
                      </label>
                      <label class="checkbox-label">
                        <input type="checkbox" v-model="element.properties.randomize" v-voix="'Randomize Options Checkbox'" hint="Shuffle the order of answer options for each respondent" />
                        Randomize Options
                      </label>
                    </div>

                    <!-- Question type-specific editors -->
                    <!-- Multiple choice, checkbox, dropdown, ranking options editor -->
                    <div v-if="['multiple_choice', 'checkbox_group', 'dropdown', 'ranking'].includes(element.type)" class="options-editor">
                      <h4>Answer Options</h4>
                      <div class="options-list">
                        <div 
                          v-for="(option, optIndex) in element.options" 
                          :key="option.id" 
                          class="option-edit-row"
                        >
                          <input type="text" v-model="option.text.en" v-voix="'Question ' + (index + 1) + ' Option ' + (optIndex + 1)" hint="Edit this answer option text" />
                          <button @click="removeOption(index, optIndex)" class="icon-button small" v-voix="'Remove Option ' + (optIndex + 1)">✕</button>
                        </div>
                        <button @click="addOption(index)" class="small-button add-option" v-voix="'Add New Option'" hint="Add a new answer option to this question">+ Add Option</button>
                      </div>
                      <!-- Checkbox specific settings -->
                      <div v-if="element.type === 'checkbox_group'" class="checkbox-settings">
                        <div class="settings-row">
                          <div class="settings-group small">
                            <label for="min-selections">Minimum Selections</label>
                            <input type="number" id="min-selections" v-model.number="element.properties.minSelections" min="0" v-voix="'Minimum Selections Required'" hint="Set the minimum number of options respondents must select" />
                          </div>
                          <div class="settings-group small">
                            <label for="max-selections">Maximum Selections</label>
                            <input type="number" id="max-selections" v-model.number="element.properties.maxSelections" min="0" v-voix="'Maximum Selections Allowed'" hint="Set the maximum number of options respondents can select" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Likert Scale Settings -->
                    <div v-if="element.type === 'likert_scale'" class="likert-settings">
                      <h4>Scale Settings</h4>
                      <div class="settings-group">
                        <label for="likert-scale">Scale Points</label>
                        <select id="likert-scale" v-model.number="element.properties.scale" v-voix="'Likert Scale Points'" hint="Select how many points the rating scale should have">
                          <option value="3">3-point scale</option>
                          <option value="5">5-point scale</option>
                          <option value="7">7-point scale</option>
                          <option value="10">10-point scale</option>
                        </select>
                      </div>
                      <div class="settings-group">
                        <label for="likert-start">Start Label</label>
                        <input type="text" id="likert-start" v-model="element.properties.labels.start.en" v-voix="'Likert Scale Start Label'" hint="Label for the lowest value on the scale" />
                      </div>
                      <div class="settings-group">
                        <label for="likert-end">End Label</label>
                        <input type="text" id="likert-end" v-model="element.properties.labels.end.en" v-voix="'Likert Scale End Label'" hint="Label for the highest value on the scale" />
                      </div>
                      <div class="settings-group checkbox-group">
                        <label class="checkbox-label">
                          <input type="checkbox" v-model="element.properties.showValues" v-voix="'Show Scale Values Checkbox'" hint="Display numerical values alongside the scale points" />
                          Show Scale Values
                        </label>
                      </div>
                    </div>

                    <!-- Open Text Settings -->
                    <div v-if="element.type === 'open_text'" class="text-settings">
                      <h4>Text Field Settings</h4>
                      <div class="settings-group checkbox-group">
                        <label class="checkbox-label">
                          <input type="checkbox" v-model="element.properties.multiline" v-voix="'Multi-line Text Area Checkbox'" hint="Use a larger text area for longer responses" />
                          Multi-line Text Area
                        </label>
                      </div>
                      <div class="settings-group">
                        <label for="text-limit">Character Limit</label>
                        <input type="number" id="text-limit" v-model.number="element.properties.maxLength" min="1" v-voix="'Text Character Limit'" hint="Maximum number of characters respondents can enter" />
                      </div>
                      <div class="settings-group">
                        <label for="placeholder-text">Placeholder Text</label>
                        <input type="text" id="placeholder-text" v-model="element.properties.placeholder.en" v-voix="'Text Field Placeholder'" hint="Example or hint text shown in the field before the user types" />
                      </div>
                    </div>

                    <!-- Matrix Settings -->
                    <div v-if="element.type === 'matrix'" class="matrix-settings">
                      <h4>Matrix Rows</h4>
                      <div class="matrix-list">
                        <div 
                          v-for="(row, rowIndex) in element.rows" 
                          :key="row.id" 
                          class="option-edit-row"
                        >
                          <input type="text" v-model="row.text.en" v-voix="'Matrix Row ' + (rowIndex + 1) + ' Text'" hint="Edit this row label"/>
                          <button @click="removeMatrixRow(index, rowIndex)" class="icon-button small" v-voix="'Remove Matrix Row ' + (rowIndex + 1)">✕</button>
                        </div>
                        <button @click="addMatrixRow(index)" class="small-button add-option" v-voix="'Add New Matrix Row'" hint="Add a new row to this matrix question">+ Add Row</button>
                      </div>
                      <h4>Matrix Columns</h4>
                      <div class="matrix-list">
                        <div 
                          v-for="(column, colIndex) in element.columns" 
                          :key="column.id" 
                          class="option-edit-row"
                        >
                          <input type="text" v-model="column.text.en" v-voix="'Matrix Column ' + (colIndex + 1) + ' Text'" hint="Edit this column label" />
                          <button @click="removeMatrixColumn(index, colIndex)" class="icon-button small" v-voix="'Remove Matrix Column ' + (colIndex + 1)">✕</button>
                        </div>
                        <button @click="addMatrixColumn(index)" class="small-button add-option" v-voix="'Add New Matrix Column'" hint="Add a new column to this matrix question">+ Add Column</button>
                      </div>
                      <div class="settings-group checkbox-group">
                        <label class="checkbox-label">
                          <input type="checkbox" v-model="element.properties.oneResponsePerRow" v-voix="'One Response Per Row Checkbox'" hint="Restrict respondents to selecting only one option per row" />
                          One Response Per Row
                        </label>
                      </div>
                    </div>

                    <!-- Logic Rules for this question (integrated) -->
                    <div class="question-logic-section">
                      <h4>Logic Rules</h4>
                      <div v-if="element.logic.length === 0" class="no-rules">
                        <p>No logic rules defined yet.</p>
                      </div>
                      <div v-else class="logic-rules-list">
                        <div v-for="(rule, ruleIndex) in element.logic" :key="ruleIndex" class="logic-rule-card">
                          <div class="rule-header">
                            <h5>Rule {{ ruleIndex + 1 }}</h5>
                            <button @click="removeLogicRule(index, ruleIndex)" class="icon-button small" v-voix="'Remove Logic Rule ' + (ruleIndex + 1)">✕</button>
                          </div>
                          <div class="rule-content">
                            <p class="rule-text">
                              <strong>If</strong> answer <span class="rule-condition">{{ getLogicConditionText(rule) }}</span>
                              <strong>then</strong> <span class="rule-action">{{ rule.action === 'show' ? 'Show' : 'Hide' }} Q{{ getQuestionNumberById(rule.targetQuestionId) }}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Add logic rule UI (integrated) -->
                      <div class="add-rule-section">
                        <h4>Add New Rule</h4>
                        <div class="rule-builder">
                          <div class="rule-part">
                            <label>If answer:</label>
                            <div v-if="['multiple_choice', 'checkbox_group', 'dropdown'].includes(element.type)" class="condition-builder">
                              <select v-model="newRule.condition" class="condition-type" v-voix="'Logic Rule Condition'" hint="Choose the condition for triggering this rule">
                                <option value="equals">Equals</option>
                                <option value="not_equals">Does not equal</option>
                                <option value="contains">Contains</option>
                                <option value="not_contains">Does not contain</option>
                              </select>
                              <select v-model="newRule.value" class="condition-value" v-voix="'Logic Rule Answer Value'" hint="Select which answer option triggers this rule">
                                <option value="">-- Select an option --</option>
                                <option v-for="option in element.options" :key="option.id" :value="option.id">
                                  {{ option.text.en }}
                                </option>
                              </select>
                            </div>
                            <div v-else-if="element.type === 'likert_scale'" class="condition-builder">
                              <select v-model="newRule.condition" class="condition-type">
                                <option value="equals">Equals</option>
                                <option value="not_equals">Does not equal</option>
                                <option value="greater_than">Greater than</option>
                                <option value="less_than">Less than</option>
                              </select>
                              <select v-model="newRule.value" class="condition-value">
                                <option value="">-- Select a value --</option>
                                <option v-for="n in element.properties.scale" :key="n" :value="n.toString()">
                                  {{ n }}
                                </option>
                              </select>
                            </div>
                            <div v-else class="unsupported-logic">
                              <p>Logic rules for this question type are not yet supported.</p>
                            </div>
                          </div>
                          <div class="rule-part">
                            <label>Then:</label>
                            <div class="action-builder">
                              <select v-model="newRule.action" class="action-type" v-voix="'Logic Rule Action'" hint="Choose whether to show or hide another question based on this rule">
                                <option value="show">Show</option>
                                <option value="hide">Hide</option>
                              </select>
                              <select v-model="newRule.targetQuestionId" class="action-target" v-voix="'Logic Rule Target Question'" hint="Select which question to show or hide based on this rule">
                                <option value="">-- Select a question --</option>
                                <option v-for="(question, qIdx) in surveyState.questions.filter((q, i) => i !== index)" :key="question.id" :value="question.id">
                                  Q{{ qIdx + 1 }}: {{ question.text.en.substring(0, 30) }}{{ question.text.en.length > 30 ? '...' : '' }}
                                </option>
                              </select>
                            </div>
                          </div>
                          <button @click="addLogicRule()" class="small-button add-rule-button" :disabled="!canAddRule" v-voix="'Add Logic Rule'" hint="Create a new logic rule for this question">Add Rule</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </div>
      
      <!-- Settings Tab Content -->
      <div v-else-if="activeTab === 'settings'" class="content-area">
        <div class="settings-panel">
          <h3>Survey Settings</h3>
          <div class="settings-grid">
            <div class="settings-section">
              <h4>General Settings</h4>
              <div class="settings-group">
                <label for="survey-title">Survey Title</label>
                <input id="survey-title" v-model="surveyState.title" type="text" v-voix="'Survey Title'" hint="Enter the main title of your survey">
              </div>
              <div class="settings-group">
                <label for="survey-description">Survey Description</label>
                <textarea id="survey-description" v-model="surveyState.description" rows="3" v-voix="'Survey Description'" hint="Provide a brief description or introduction for respondents"></textarea>
              </div>
            </div>
            <div class="settings-section">
              <h4>Navigation & Display</h4>
              <div class="settings-group checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="surveyState.settings.showProgressBar" v-voix="'Show Progress Bar Checkbox'" hint="Display a progress indicator for respondents">
                  Show Progress Bar
                </label>
              </div>
              <div class="settings-group">
                <label for="question-numbering">Question Numbering</label>
                <select id="question-numbering" v-model="surveyState.settings.questionNumbering" v-voix="'Question Numbering Setting'" hint="Choose whether to show or hide question numbers">
                  <option value="visible">Show Numbers (Q1, Q2, Q3)</option>
                  <option value="hidden">Hide Numbers</option>
                </select>
              </div>
              <div class="settings-group">
                <label for="survey-navigation">Navigation Style</label>
                <select id="survey-navigation" v-model="surveyState.settings.navigationStyle" v-voix="'Navigation Style Setting'" hint="Choose how respondents move through your survey">
                  <option value="buttons">Next/Previous Buttons</option>
                  <option value="auto">Auto-Advance After Answer</option>
                  <option value="all">Show All Questions</option>
                </select>
              </div>
            </div>
            <div class="settings-section">
              <h4>Question Settings</h4>
              <div class="settings-group checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="surveyState.settings.randomizeQuestions" v-voix="'Randomize Questions Checkbox'" hint="Shuffle the order of questions for each respondent">
                  Randomize Questions
                </label>
              </div>
              <div v-if="surveyState.settings.randomizeQuestions" class="randomize-options">
                <div class="settings-group checkbox-group">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="surveyState.settings.respectSections" v-voix="'Respect Section Breaks Checkbox'" hint="Keep section breaks in place when randomizing questions">
                    Respect Section Breaks
                  </label>
                </div>
                <div class="settings-group checkbox-group">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="surveyState.settings.respectLogic" v-voix="'Respect Branching Logic Checkbox'" hint="Maintain logic rules when randomizing questions">
                    Respect Branching Logic
                  </label>
                </div>
              </div>
              <div class="settings-group">
                <label for="required-indicator">Required Question Indicator</label>
                <select id="required-indicator" v-model="surveyState.settings.requiredIndicator" v-voix="'Required Question Indicator Setting'" hint="Choose how to mark required questions">
                  <option value="asterisk">Asterisk (*)</option>
                  <option value="text">(Required)</option>
                  <option value="none">None</option>
                </select>
              </div>
            </div>
            <div class="settings-section">
              <h4>Completion Settings</h4>
              <div class="settings-group">
                <label for="completion-text">Completion Message</label>
                <textarea id="completion-text" v-model="surveyState.settings.completionMessage.en" rows="3" v-voix="'Completion Message'" hint="Message shown to respondents after completing the survey"></textarea>
              </div>
              <div class="settings-group checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="surveyState.settings.showResponseSummary" v-voix="'Show Response Summary Checkbox'" hint="Display respondents' answers at the end of the survey">
                  Show Response Summary
                </label>
              </div>
            </div>
            <div class="settings-section">
              <h4>Theme Settings</h4>
              <div class="settings-group">
                <label for="primary-color">Primary Color</label>
                <div class="color-picker-row">
                  <input id="primary-color" v-model="surveyState.settings.primaryColor" type="color" v-voix="'Primary Color Picker'" hint="Choose the main color for buttons and accents">
                  <span class="color-value">{{ surveyState.settings.primaryColor }}</span>
                </div>
              </div>
              <div class="settings-group">
                <label for="background-color">Background Color</label>
                <div class="color-picker-row">
                  <input id="background-color" v-model="surveyState.settings.backgroundColor" type="color" v-voix="'Background Color Picker'" hint="Choose the survey background color">
                  <span class="color-value">{{ surveyState.settings.backgroundColor }}</span>
                </div>
              </div>
              <div class="settings-group">
                <label for="font-family">Font</label>
                <select id="font-family" v-model="surveyState.settings.fontFamily" v-voix="'Font Family Selector'" hint="Choose the typeface for your survey">
                  <option value="system-ui">System UI</option>
                  <option value="'Roboto', sans-serif">Roboto</option>
                  <option value="'Open Sans', sans-serif">Open Sans</option>
                  <option value="'Lato', sans-serif">Lato</option>
                  <option value="'Georgia', serif">Georgia</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Translations Tab Content -->
      <div v-else-if="activeTab === 'translations'" class="content-area">
        <div class="translations-panel">
          <h3>Language Translations</h3>
          <p class="panel-description">Add and manage translations for multilingual surveys.</p>
          
          <div class="translations-layout">
            <div class="settings-section languages-section">
              <h4>Supported Languages</h4>
              
              <div class="settings-group">
                <label for="default-language">Default Language</label>
                <select 
                  id="default-language"
                  v-model="surveyState.settings.defaultLanguage"
                >
                  <option v-for="lang in surveyState.settings.languages" :key="lang" :value="lang">
                    {{ getLanguageName(lang) }}
                  </option>
                </select>
              </div>
              
              <div class="languages-list">
                <div 
                  v-for="lang in surveyState.settings.languages" 
                  :key="lang" 
                  class="language-item"
                  :class="{ default: lang === surveyState.settings.defaultLanguage }"
                >
                  <span class="language-code">{{ lang }}</span>
                  <span class="language-name">{{ getLanguageName(lang) }}</span>
                  <button 
                    v-if="lang !== 'en' && lang !== surveyState.settings.defaultLanguage" 
                    @click="removeLanguage(lang)" 
                    class="icon-button small"
                  >✕</button>
                </div>
              </div>
              
              <div class="settings-group">
                <label for="new-language">Add Language</label>
                <div class="add-language-row">
                  <input 
                    id="new-language"
                    v-model="newLanguage" 
                    type="text" 
                    placeholder="Language code (e.g., es, fr)"
                    v-voix="'New Language Code Input'" 
                    hint="Enter a two-letter language code like es for Spanish"
                  >
                  <button 
                    @click="addLanguage()" 
                    class="small-button"
                    :disabled="!canAddLanguage"
                    v-voix="'Add New Language'"
                    hint="Add this language to your survey for translation"
                  >
                    Add
                  </button>
                </div>
                <p class="help-text">Use standard two-letter language codes (e.g., en, es, fr, de, zh).</p>
              </div>
            </div>
            
            <div v-if="surveyState.settings.languages.length > 1" class="settings-section translation-content-section">
              <h4>Translate Content</h4>
              
              <div class="translations-selector">
                <div class="settings-group">
                  <label for="translate-language">Target Language</label>
                  <select 
                    id="translate-language"
                    v-model="translateLanguage"
                    v-voix="'Select Language to Translate'"
                    hint="Choose which language to translate content into"
                  >
                    <option value="">-- Select language --</option>
                    <option 
                      v-for="lang in surveyState.settings.languages.filter(l => l !== 'en')" 
                      :key="lang" 
                      :value="lang"
                    >
                      {{ getLanguageName(lang) }}
                    </option>
                  </select>
                </div>
                
                <div class="settings-group">
                  <label for="translate-element">Content to Translate</label>
                  <select 
                    id="translate-element"
                    v-model="translateElement"
                    v-voix="'Select Content To Translate'"
                    hint="Choose which type of content to translate"
                  >
                    <option value="title">Survey Title & Description</option>
                    <option value="completion">Completion Message</option>
                    <option value="questions">Questions & Options</option>
                  </select>
                </div>
              </div>
              
              <!-- Translation editor area -->
              <div class="translation-content-area">
                <!-- Title & Description Translation -->
                <div v-if="translateLanguage && translateElement === 'title'" class="translation-editor">
                  <div class="translation-item">
                    <div class="translation-source">
                      <label>Survey Title (English)</label>
                      <div class="source-text">{{ surveyState.title }}</div>
                    </div>
                    
                    <div class="translation-target">
                      <label :for="'title-' + translateLanguage">
                        Survey Title ({{ getLanguageName(translateLanguage) }})
                      </label>
                      <input 
                        :id="'title-' + translateLanguage"
                        v-model="surveyTranslations.title[translateLanguage]" 
                        type="text"
                      >
                    </div>
                  </div>
                  
                  <div class="translation-item">
                    <div class="translation-source">
                      <label>Survey Description (English)</label>
                      <div class="source-text">{{ surveyState.description }}</div>
                    </div>
                    
                    <div class="translation-target">
                      <label :for="'description-' + translateLanguage">
                        Survey Description ({{ getLanguageName(translateLanguage) }})
                      </label>
                      <textarea 
                        :id="'description-' + translateLanguage"
                        v-model="surveyTranslations.description[translateLanguage]" 
                        rows="3"
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                <!-- Completion Message Translation -->
                <div v-else-if="translateLanguage && translateElement === 'completion'" class="translation-editor">
                  <div class="translation-item">
                    <div class="translation-source">
                      <label>Completion Message (English)</label>
                      <div class="source-text">{{ surveyState.settings.completionMessage.en }}</div>
                    </div>
                    
                    <div class="translation-target">
                      <label :for="'completion-' + translateLanguage">
                        Completion Message ({{ getLanguageName(translateLanguage) }})
                      </label>
                      <textarea 
                        :id="'completion-' + translateLanguage"
                        v-model="surveyTranslations.completionMessage[translateLanguage]" 
                        rows="3"
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                <!-- Questions & Options Translation - Redesigned -->
                <div v-else-if="translateLanguage && translateElement === 'questions'" class="translation-editor questions-translation">
                  <div v-if="surveyState.questions.length === 0" class="no-questions-message">
                    <p>No questions to translate yet. Add questions in the Questions tab first.</p>
                  </div>
                  
                  <template v-else>
                    <!-- Table-like view of all questions for bulk translation -->
                    <div class="all-questions-translation">
                      <div class="translation-table-header">
                        <div class="question-number-col">Q#</div>
                        <div class="question-english-col">English Text</div>
                        <div class="question-translation-col">{{ getLanguageName(translateLanguage) }} Translation</div>
                      </div>
                      
                      <div class="translation-table-body">
                        <div 
                          v-for="(question, qIndex) in surveyState.questions" 
                          :key="question.id"
                          class="translation-table-row"
                        >
                          <div class="question-number-col">Q{{ qIndex + 1 }}</div>
                          <div class="question-english-col">{{ question.text.en }}</div>
                          <div class="question-translation-col">
                            <input 
                              :value="getQuestionTranslation(qIndex, 'text', translateLanguage)"
                              @input="e => { question.text[translateLanguage] = e.target.value }"
                              type="text"
                              :placeholder="`Translate Q${qIndex + 1} to ${getLanguageName(translateLanguage)}`"
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Options translation section -->
                    <div class="options-translation-section">
                      <h4>Options Translation</h4>
                      <p class="helper-text">Select a question to translate its options:</p>
                      
                      <div class="question-selector">
                        <select v-model="translateQuestionIndex">
                          <option v-for="(question, qIndex) in surveyState.questions.filter(q => 
                            ['multiple_choice', 'checkbox_group', 'dropdown', 'ranking', 'likert_scale'].includes(q.type))" 
                            :key="qIndex" 
                            :value="qIndex"
                          >
                            Q{{ qIndex + 1 }}: {{ question.text.en.substring(0, 40) }}{{ question.text.en.length > 40 ? '...' : '' }}
                          </option>
                        </select>
                      </div>
                      
                      <div v-if="translateQuestionIndex !== null && 
                        ['multiple_choice', 'checkbox_group', 'dropdown', 'ranking'].includes(surveyState.questions[translateQuestionIndex].type)" 
                        class="options-translation"
                      >
                        <div class="translation-table-header">
                          <div class="option-english-col">English Option</div>
                          <div class="option-translation-col">{{ getLanguageName(translateLanguage) }} Translation</div>
                        </div>
                        
                        <div class="translation-table-body">
                          <div 
                            v-for="(option, optIndex) in surveyState.questions[translateQuestionIndex].options" 
                            :key="option.id"
                            class="translation-table-row"
                          >
                            <div class="option-english-col">{{ option.text.en }}</div>
                            <div class="option-translation-col">
                              <input 
                                :value="getOptionTranslation(translateQuestionIndex, optIndex, translateLanguage)"
                                @input="e => { 
                                  // Ensure option text is an object
                                  if (typeof surveyState.questions[translateQuestionIndex].options[optIndex].text === 'string') {
                                    const currentText = surveyState.questions[translateQuestionIndex].options[optIndex].text;
                                    surveyState.questions[translateQuestionIndex].options[optIndex].text = { 'en': currentText };
                                  }
                                  // Set the translation value
                                  surveyState.questions[translateQuestionIndex].options[optIndex].text[translateLanguage] = e.target.value;
                                  console.log('Updated translation for option:', surveyState.questions[translateQuestionIndex].options[optIndex].text);
                                }"
                                type="text"
                                :placeholder="`Translate to ${getLanguageName(translateLanguage)}`"
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div v-else-if="translateQuestionIndex !== null && 
                        surveyState.questions[translateQuestionIndex].type === 'likert_scale'" 
                        class="likert-translation"
                      >
                        <div class="translation-table-header">
                          <div class="option-english-col">English Label</div>
                          <div class="option-translation-col">{{ getLanguageName(translateLanguage) }} Translation</div>
                        </div>
                        
                        <div class="translation-table-body">
                          <div class="translation-table-row">
                            <div class="option-english-col">{{ surveyState.questions[translateQuestionIndex].properties.labels.start.en }}</div>
                            <div class="option-translation-col">
                              <input 
                                :value="getLikertLabelTranslation(translateQuestionIndex, 'start', translateLanguage)"
                                @input="e => { surveyState.questions[translateQuestionIndex].properties.labels.start[translateLanguage] = e.target.value }"
                                type="text"
                                :placeholder="`Translate start label to ${getLanguageName(translateLanguage)}`"
                              >
                            </div>
                          </div>
                          <div class="translation-table-row">
                            <div class="option-english-col">{{ surveyState.questions[translateQuestionIndex].properties.labels.end.en }}</div>
                            <div class="option-translation-col">
                              <input 
                                :value="getLikertLabelTranslation(translateQuestionIndex, 'end', translateLanguage)"
                                @input="e => { surveyState.questions[translateQuestionIndex].properties.labels.end[translateLanguage] = e.target.value }"
                                type="text"
                                :placeholder="`Translate end label to ${getLanguageName(translateLanguage)}`"
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
                
                <div v-else class="translation-prompt">
                  <p>Select a language and content type to begin translating.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<style scoped>
/* Header Tabs */
.header-tabs {
  display: flex;
  flex: 1;
  justify-content: center;
  margin: 0 var(--spacing-xl);
}
.header-tabs button {
  background: none;
  border: none;
  padding: var(--spacing-md) var(--spacing-lg);
  margin: 0 var(--spacing-md);
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
  position: relative;
}
.header-tabs button:hover {
  color: var(--text-primary);
}
.header-tabs button.active {
  color: var(--accent-color);
  border-bottom: 3px solid var(--accent-color);
  font-weight: 600;
}

/* Main Content Area */
.main-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: var(--neutral-50);
}

/* Content Areas */
.content-area {
  flex-grow: 1;
  overflow-y: auto;
  padding: var(--spacing-lg);
  height: 100%;
}

/* Content Area with Sidebar */
.content-area.with-sidebar {
  display: flex;
  padding: 0;
  flex-direction: row;
}

/* Question Sidebar */
.question-sidebar {
  width: 300px;
  flex-shrink: 0;
  background-color: var(--surface-color);
  border-right: 1px solid var(--border-color);
  padding: var(--spacing-lg);
  overflow-y: auto;
  position: sticky;
  top: 0;
  align-self: flex-start;
}

.question-sidebar h3 {
  margin-top: 0;
  margin-bottom: var(--spacing-md);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.question-types-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.question-type-item {
  display: flex;
  align-items: center;
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: all 0.2s;
}

.question-type-item:hover {
  border-color: var(--accent-color);
  box-shadow: var(--shadow-sm);
  transform: translateX(2px);
}

.question-type-icon {
  font-size: 1.5rem;
  margin-right: var(--spacing-md);
  color: var(--accent-color);
  flex-shrink: 0;
}

.question-type-info {
  flex-grow: 1;
}

.question-type-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.question-type-desc {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  line-height: 1.4;
}

/* Questions Main Area */
.questions-main-area {
  flex-grow: 1;
  padding: var(--spacing-lg);
  overflow-y: auto;
}

/* Canvas Header */
.canvas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--spacing-xl);
  background-color: var(--surface-color);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 20;
}
.header-left {
  display: flex;
  align-items: center;
  min-width: 180px;
}
.title-input {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  border: none;
  background: transparent;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  width: 100%;
  transition: all 0.2s;
}

.title-input:hover {
  background-color: var(--neutral-100);
}

.title-input:focus {
  background-color: var(--neutral-100);
  outline: none;
  box-shadow: 0 0 0 2px var(--accent-light);
}
.canvas-actions {
  display: flex;
  gap: var(--spacing-md);
  min-width: 180px;
  justify-content: flex-end;
}

/* Buttons */
.primary-button, .secondary-button {
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
}
.primary-button {
  background-color: var(--accent-color);
  color: white;
  border: none;
}
.primary-button:hover {
  background-color: var(--accent-hover);
}
.secondary-button {
  background-color: var(--surface-color);
  color: var(--accent-color);
  border: 1px solid var(--accent-color);
}
.secondary-button:hover {
  background-color: var(--accent-light);
}
.small-button {
  background-color: var(--accent-color);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;
}
.small-button:hover {
  background-color: var(--accent-hover);
}
.small-button:disabled {
  background-color: var(--neutral-300);
  cursor: not-allowed;
}
.icon-button {
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  font-size: 1rem;
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.icon-button:hover {
  background-color: var(--neutral-200);
  color: var(--text-secondary);
}
.icon-button.small {
  font-size: 0.875rem;
  width: 1.5rem;
  height: 1.5rem;
}

/* Forms and Inputs */
.settings-group {
  margin-bottom: var(--spacing-lg);
}
.settings-group label {
  display: block;
  margin-bottom: var(--spacing-sm);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}
.settings-group input[type="text"],
.settings-group textarea,
.settings-group select,
.settings-group input[type="number"] {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  background-color: var(--surface-color);
  color: var(--text-primary);
  transition: all 0.2s;
}
.settings-group input[type="text"]:focus,
.settings-group textarea:focus,
.settings-group select:focus,
.settings-group input[type="number"]:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px var(--accent-light);
  outline: none;
}
.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  color: var(--text-primary);
}
.checkbox-label input[type="checkbox"] {
  accent-color: var(--accent-color);
}
.settings-section {
  margin-bottom: var(--spacing-xl);
  border-bottom: 1px solid var(--neutral-200);
  padding-bottom: var(--spacing-lg);
}
.settings-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}
.settings-section h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--accent-color);
}
.settings-row {
  display: flex;
  gap: var(--spacing-md);
}
.settings-group.small {
  flex: 1;
}

/* Questions container */
.questions-container {
  width: 100%;
}
.empty-state {
  text-align: center;
  color: var(--text-tertiary);
  padding: var(--spacing-xxl);
  background-color: var(--surface-color);
  border-radius: var(--radius-lg);
  border: 2px dashed var(--border-color);
  margin: 0 auto;
  max-width: 700px;
}
.questions-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  max-width: 900px;
  margin: 0 auto;
}

/* Question card */
.question-card {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: all 0.2s;
}
.question-card.active {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px var(--accent-light), var(--shadow-md);
}
.question-card-header {
  display: flex;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--neutral-50);
  border-bottom: 1px solid var(--border-color);
}
.drag-handle {
  cursor: grab;
  margin-right: var(--spacing-md);
  color: var(--text-tertiary);
  font-size: 1.125rem;
}
.question-number {
  font-weight: 600;
  font-size: 0.875rem;
  margin-right: var(--spacing-md);
  color: var(--text-secondary);
}
.question-type-badge {
  background-color: var(--neutral-100);
  color: var(--text-secondary);
  font-size: 0.75rem;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-weight: 500;
}
.question-actions {
  margin-left: auto;
  display: flex;
  gap: var(--spacing-sm);
}
.question-card-body {
  padding: var(--spacing-lg);
}
.question-text-input {
  width: 100%;
  padding: var(--spacing-sm);
  font-size: 1rem;
  font-weight: 500;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
  transition: all 0.2s;
}
.question-text-input:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px var(--accent-light);
  outline: none;
}
.question-text {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
}
.question-preview {
  background-color: var(--neutral-50);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
}
.preview-options, .preview-likert {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
.preview-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}
.option-indicator {
  color: var(--text-tertiary);
}
.likert-scale {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}
.likert-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-tertiary);
}
.text-input-placeholder {
  background-color: var(--neutral-100);
  border: 1px dashed var(--neutral-300);
  border-radius: var(--radius-sm);
  padding: var(--spacing-md);
  color: var(--text-tertiary);
  text-align: center;
  font-size: 0.875rem;
}
.preview-placeholder {
  text-align: center;
  color: var(--text-tertiary);
  padding: var(--spacing-md);
  font-size: 0.875rem;
}

/* Inline editor */
.inline-editor {
  padding: var(--spacing-md);
  background-color: var(--neutral-50);
  border-top: 1px solid var(--border-color);
  margin-top: var(--spacing-md);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
}
.inline-editor h4 {
  font-size: 0.875rem;
  font-weight: 600;
  margin: var(--spacing-md) 0 var(--spacing-sm);
  color: var(--text-primary);
}
.options-editor, .likert-settings, .text-settings, .matrix-settings {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: white;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}
.option-edit-row {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}
.option-edit-row input {
  flex-grow: 1;
}
.option-edit-row:last-child {
  margin-bottom: var(--spacing-md);
}
.options-list {
  margin-bottom: var(--spacing-md);
}
.add-option {
  margin-top: var(--spacing-xs);
}
.checkbox-settings {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px dashed var(--border-color);
}
.matrix-list {
  margin-bottom: var(--spacing-md);
}
.question-logic-section {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: white;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

/* Search box */
.search-box {
  margin-bottom: var(--spacing-md);
}
.search-box input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  font-size: 0.875rem;
}

/* Logic rules styling */
.no-rules {
  background-color: var(--neutral-100);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  text-align: center;
  color: var(--text-tertiary);
  margin-bottom: var(--spacing-lg);
}
.logic-rules-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}
.logic-rule-card {
  background-color: var(--surface-color);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  overflow: hidden;
}
.rule-header {
  background-color: var(--neutral-100);
  padding: var(--spacing-sm) var(--spacing-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
}
.rule-header h5 {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
}
.rule-content {
  padding: var(--spacing-md);
}
.rule-text {
  margin: 0;
  line-height: 1.4;
  font-size: 0.875rem;
}
.rule-condition, .rule-action {
  color: var(--accent-color);
  font-weight: 500;
}
.add-rule-section {
  margin-top: var(--spacing-xl);
  border-top: 1px solid var(--neutral-200);
  padding-top: var(--spacing-md);
}
.rule-builder {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: var(--surface-color);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}
.rule-part label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
  color: var(--text-secondary);
}
.condition-builder, .action-builder {
  display: flex;
  gap: var(--spacing-sm);
}
.condition-type, .action-type {
  width: 140px;
  flex-shrink: 0;
}
.condition-value, .action-target {
  flex-grow: 1;
}
.unsupported-logic {
  background-color: var(--neutral-100);
  padding: var(--spacing-md);
  border-radius: var(--radius-sm);
  color: var(--text-tertiary);
  font-size: 0.875rem;
}
.add-rule-button {
  align-self: flex-end;
}

/* Settings panel */
.settings-panel {
  max-width: 1000px;
  margin: 0 auto;
  background-color: var(--surface-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  border: 1px solid var(--border-color);
  height: calc(100% - 40px);
  overflow-y: auto;
}
.settings-panel h3 {
  margin-top: 0;
  margin-bottom: var(--spacing-lg);
  position: sticky;
  top: 0;
  background-color: var(--surface-color);
  padding: var(--spacing-md) 0;
  z-index: 1;
}
.settings-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-xl);
}
.help-text {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  margin-top: var(--spacing-xs);
  margin-bottom: 0;
}
.color-picker-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}
.color-value {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-family: monospace;
}
.randomize-options {
  margin-left: var(--spacing-md);
  padding-top: var(--spacing-xs);
  border-left: 2px solid var(--neutral-200);
  padding-left: var(--spacing-md);
}

/* Translations Panel */
.translations-panel {
  max-width: 1000px;
  margin: 0 auto;
  background-color: var(--surface-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  border: 1px solid var(--border-color);
  height: calc(100% - 40px);
  overflow-y: auto;
}
.translations-panel h3 {
  margin-top: 0;
  margin-bottom: var(--spacing-sm);
  position: sticky;
  top: 0;
  background-color: var(--surface-color);
  padding: var(--spacing-md) 0;
  z-index: 1;
}
.panel-description {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: var(--spacing-lg);
  position: sticky;
  top: 40px;
  background-color: var(--surface-color);
  padding-bottom: var(--spacing-md);
  z-index: 1;
}
.translations-layout {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--spacing-xl);
}
.languages-section {
  padding-right: var(--spacing-md);
}
.languages-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
}
.language-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--neutral-50);
  border-radius: var(--radius-md);
}
.language-item.default {
  background-color: var(--accent-light);
  border-left: 3px solid var(--accent-color);
}
.language-code {
  font-weight: 600;
  font-size: 0.875rem;
  margin-right: var(--spacing-sm);
  color: var(--text-primary);
  text-transform: uppercase;
  display: inline-block;
  width: 30px;
}
.language-name {
  color: var(--text-secondary);
  font-size: 0.875rem;
  flex-grow: 1;
}
.add-language-row {
  display: flex;
  gap: var(--spacing-sm);
}
.translations-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}
.translation-prompt {
  background-color: var(--neutral-100);
  padding: var(--spacing-md);
  text-align: center;
  border-radius: var(--radius-md);
  color: var(--text-tertiary);
}
.translation-editor {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--surface-color);
  padding: var(--spacing-md);
}
.translation-item {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--neutral-100);
}
.translation-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}
.translation-source label, .translation-target label {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
  color: var(--text-secondary);
}
.source-text {
  background-color: var(--neutral-50);
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-sm);
  padding: var(--spacing-sm);
  color: var(--text-secondary);
  font-size: 0.875rem;
  min-height: 38px;
}

/* Redesigned Translation UI */
.questions-translation {
  padding: var(--spacing-md) 0;
}
.all-questions-translation {
  margin-bottom: var(--spacing-xl);
}
.translation-table-header {
  display: flex;
  background-color: var(--neutral-100);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  padding: var(--spacing-sm) var(--spacing-md);
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-secondary);
}
.translation-table-body {
  border: 1px solid var(--border-color);
  border-top: none;
  border-radius: 0 0 var(--radius-md) var(--radius-md);
  overflow: hidden;
}
.translation-table-row {
  display: flex;
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--neutral-100);
}
.translation-table-row:last-child {
  border-bottom: none;
}
.translation-table-row:nth-child(even) {
  background-color: var(--neutral-50);
}
.question-number-col {
  width: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  font-weight: 500;
  color: var(--text-secondary);
}
.question-english-col {
  flex: 1;
  padding-right: var(--spacing-md);
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: var(--text-primary);
}
.question-translation-col {
  flex: 1;
}
.option-english-col {
  flex: 1;
  padding-right: var(--spacing-md);
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: var(--text-primary);
}
.option-translation-col {
  flex: 1;
}
.options-translation-section {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--neutral-200);
}
.options-translation-section h4 {
  margin-top: 0;
  margin-bottom: var(--spacing-sm);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}
.helper-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
}
.question-selector {
  margin-bottom: var(--spacing-md);
}
.question-selector select {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  background-color: var(--surface-color);
}
.options-translation, .likert-translation {
  margin-top: var(--spacing-sm);
}
.no-questions-message {
  text-align: center;
  padding: var(--spacing-lg);
  color: var(--text-tertiary);
}
</style>
