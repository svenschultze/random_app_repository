/**
 * Utility functions for survey export functionality
 */

/**
 * Adjusts a hex color's brightness
 * @param {string} color - Hex color code
 * @param {number} amount - Amount to adjust brightness by
 * @returns {string} - Adjusted hex color code
 */
export const adjustColor = (color, amount) => {
  // Remove the leading # if present
  color = color.replace(/^#/, '');
  
  // Parse the color components
  let r = parseInt(color.slice(0, 2), 16);
  let g = parseInt(color.slice(2, 4), 16);
  let b = parseInt(color.slice(4, 6), 16);
  
  // Adjust the brightness
  r = Math.max(0, Math.min(255, r + amount));
  g = Math.max(0, Math.min(255, g + amount));
  b = Math.max(0, Math.min(255, b + amount));
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Generate CSS styles for the survey
 * @param {Object} survey - Survey configuration
 * @returns {string} - CSS styles as a string
 */
const generateStyles = (survey) => {
  return `
    /* Base styles with customizable variables */
    :root {
      --primary-color: ${survey.settings.primaryColor || '#228be6'};
      --primary-hover: ${adjustColor(survey.settings.primaryColor || '#228be6', -10)};
      --background-color: ${survey.settings.backgroundColor || '#ffffff'};
      --text-color: #333333;
      --text-secondary: #666666;
      --border-color: #dddddd;
      --success-color: #4caf50;
      --error-color: #f44336;
      --radius: 8px;
      --shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      --font-family: ${survey.settings.fontFamily || 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif'};
    }
    
    /* Reset and base styles */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: var(--font-family);
      line-height: 1.6;
      color: var(--text-color);
      background-color: var(--background-color);
      padding: 20px;
    }
    
    .survey-container {
      max-width: 800px;
      margin: 0 auto;
      background-color: white;
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      padding: 30px;
    }
    
    /* Survey header */
    .survey-header {
      margin-bottom: 30px;
      text-align: center;
    }
    
    .survey-title {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 10px;
      color: var(--primary-color);
    }
    
    .survey-description {
      color: var(--text-secondary);
    }
    
    /* Language selector */
    .language-selector {
      margin-bottom: 20px;
      text-align: right;
    }
    
    .language-selector select {
      padding: 5px 10px;
      border-radius: 4px;
      border: 1px solid var(--border-color);
      font-family: var(--font-family);
      cursor: pointer;
    }
    
    /* Progress bar */
    .progress-container {
      margin-bottom: 30px;
    }
    
    .progress-bar {
      height: 8px;
      background-color: #f0f0f0;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 5px;
    }
    
    .progress-fill {
      height: 100%;
      background-color: var(--primary-color);
      transition: width 0.3s ease;
    }
    
    .progress-text {
      text-align: right;
      font-size: 12px;
      color: var(--text-secondary);
    }
    
    /* Question container */
    .question-container {
      margin-bottom: 30px;
      padding: 20px;
      border: 1px solid var(--border-color);
      border-radius: var(--radius);
      animation: fadeIn 0.3s ease;
    }
    
    .question-number {
      font-size: 14px;
      font-weight: bold;
      color: var(--primary-color);
      margin-bottom: 5px;
    }
    
    .question-text {
      font-size: 18px;
      font-weight: 500;
      margin-bottom: 10px;
    }
    
    .required-indicator {
      color: var(--error-color);
      margin-left: 5px;
    }
    
    .question-description {
      color: var(--text-secondary);
      margin-bottom: 15px;
      font-size: 14px;
    }
    
    /* Question types styling */
    /* Multiple Choice & Checkbox Group */
    .options-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .option-item {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .option-item input[type="radio"],
    .option-item input[type="checkbox"] {
      accent-color: var(--primary-color);
    }
    
    .option-item label {
      cursor: pointer;
    }
    
    /* Likert Scale */
    .likert-container {
      margin: 20px 0;
    }
    
    .likert-labels {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 14px;
      color: var(--text-secondary);
    }
    
    .likert-scale {
      display: flex;
      justify-content: space-between;
    }
    
    .likert-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
    }
    
    .likert-option input {
      margin: 0;
      accent-color: var(--primary-color);
    }
    
    /* Open Text */
    .text-input, .text-area {
      width: 100%;
      padding: 10px;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      font-family: var(--font-family);
      font-size: 16px;
    }
    
    .text-input:focus, .text-area:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(34, 139, 230, 0.1);
    }
    
    .text-area {
      min-height: 100px;
      resize: vertical;
    }
    
    /* Matrix questions */
    .matrix-container {
      overflow-x: auto;
    }
    
    .matrix-table {
      border-collapse: collapse;
      width: 100%;
    }
    
    .matrix-table th, .matrix-table td {
      padding: 10px;
      text-align: center;
      border-bottom: 1px solid var(--border-color);
    }
    
    .matrix-table th {
      font-weight: 500;
      color: var(--text-secondary);
    }
    
    .matrix-table tr:first-child th {
      border-bottom: 2px solid var(--border-color);
    }
    
    .matrix-table td:first-child {
      text-align: left;
      font-weight: 500;
    }
    
    /* Dropdown */
    .dropdown-select {
      width: 100%;
      padding: 10px;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      font-family: var(--font-family);
      font-size: 16px;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'%3E%3C/path%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 10px center;
      background-size: 16px;
    }
    
    /* Ranking question type */
    .ranking-container {
      margin: 10px 0;
    }

    .ranking-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .ranking-item {
      display: flex;
      align-items: center;
      padding: 12px;
      background-color: white;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      cursor: grab;
    }

    .ranking-item:hover {
      background-color: #f9f9f9;
    }
    
    .ranking-item-ghost {
      opacity: 0.5;
      background-color: #f0f0f0;
    }

    .ranking-item .drag-handle {
      margin-right: 10px;
      color: var(--text-secondary);
      cursor: grab;
    }

    .ranking-number {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background-color: var(--primary-color);
      color: white;
      border-radius: 50%;
      font-size: 12px;
      font-weight: bold;
      margin-right: 12px;
    }

    .ranking-text {
      flex-grow: 1;
    }

    /* File upload question type */
    .file-upload-container {
      margin: 10px 0;
    }

    .file-input-wrapper {
      position: relative;
      margin-bottom: 10px;
    }

    .file-input-wrapper input[type="file"] {
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }

    .file-input-label {
      display: inline-block;
      padding: 10px 20px;
      background-color: var(--primary-color);
      color: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s;
    }

    .file-input-label:hover {
      background-color: var(--primary-hover);
    }

    .upload-limits {
      font-size: 12px;
      color: var(--text-secondary);
      margin-bottom: 10px;
      display: flex;
      gap: 15px;
    }

    .selected-files {
      border: 1px solid var(--border-color);
      border-radius: 4px;
      padding: 10px;
      margin-top: 10px;
    }

    .selected-file {
      display: flex;
      align-items: center;
      padding: 5px 0;
      border-bottom: 1px solid var(--border-color);
    }

    .selected-file:last-child {
      border-bottom: none;
    }

    .file-name {
      font-weight: 500;
      margin-right: 5px;
    }

    .file-size {
      font-size: 12px;
      color: var(--text-secondary);
      flex-grow: 1;
    }

    .remove-file {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      font-size: 16px;
      padding: 3px 6px;
      border-radius: 50%;
    }

    .remove-file:hover {
      background-color: var(--neutral-100);
      color: var(--error-color);
    }
    
    /* Navigation buttons */
    .nav-buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }
    
    button {
      background-color: var(--primary-color);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.2s, transform 0.1s;
    }
    
    button:hover {
      background-color: var(--primary-hover);
    }
    
    button:active {
      transform: translateY(1px);
    }
    
    button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
    
    button.secondary {
      background-color: #f8f9fa;
      color: #333;
      border: 1px solid #ddd;
    }
    
    button.secondary:hover {
      background-color: #e9ecef;
    }
    
    /* Completion screen */
    .completion-container {
      text-align: center;
      padding: 30px 0;
    }
    
    .completion-icon {
      font-size: 48px;
      color: var(--success-color);
      margin-bottom: 20px;
    }
    
    .completion-message {
      font-size: 20px;
      margin-bottom: 20px;
    }
    
    /* Response summary */
    .response-summary {
      margin-top: 30px;
      border-top: 1px solid var(--border-color);
      padding-top: 30px;
    }
    
    .summary-item {
      margin-bottom: 20px;
    }
    
    .summary-question {
      font-weight: 600;
      margin-bottom: 5px;
    }
    
    .summary-answer {
      padding-left: 20px;
    }
    
    /* Animations */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    /* Responsive adjustments */
    @media (max-width: 600px) {
      .survey-container {
        padding: 15px;
      }
      
      .question-container {
        padding: 15px;
      }
      
      .likert-scale {
        gap: 5px;
      }
      
      .nav-buttons {
        flex-direction: column;
        gap: 10px;
      }
      
      .nav-buttons button {
        width: 100%;
      }
    }
  `;
};

/**
 * Generate the main Vue app for the survey
 * @param {Object} survey - Survey configuration 
 * @returns {string} - App script as a string
 */
const generateAppScript = (survey) => {
  return `
    // Survey configuration from the editor
    const surveyConfig = ${JSON.stringify(survey, null, 2)};
    
    // Language display names
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
    };
    
    // Function to shuffle array (for randomized questions/options)
    function shuffleArray(array) {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    }
    
    // Vue Application
    const { createApp, ref, reactive, computed, watch, onMounted } = Vue;
    
    createApp({
      components: {
        draggable: window.vuedraggable
      },
      setup() {
        // Reactive state
        const survey = reactive(surveyConfig);
        const currentLanguage = ref(survey.settings.defaultLanguage);
        const currentQuestionIndex = ref(0);
        const responses = reactive({});
        const arrayResponses = reactive({});
        const matrixResponses = reactive({});
        const otherResponses = reactive({});
        const otherSelected = reactive({});
        const validationErrors = reactive({});
        const surveyCompleted = ref(false);
        
        // Question visibility tracking
        const questionVisibility = reactive({});
        const questionVisibilityMemo = reactive({});
        
        // Build language options list
        const languageOptions = computed(() => {
          return survey.settings.languages.map(code => ({
            code,
            name: languageNames[code] || code.toUpperCase()
          }));
        });
        
        // Initialize responses and visibility
        onMounted(() => {
          // Set initial visibility for all questions
          resetVisibility();
          
          // Initialize response objects
          for (const question of survey.questions) {
            // Initialize normal responses
            responses[question.id] = '';
            
            // Initialize special response types
            if (question.type === 'checkbox_group') {
              arrayResponses[question.id] = [];
              if (question.properties.allowOther) {
                otherSelected[question.id] = false;
              }
            } else if (question.type === 'matrix') {
              for (const row of question.rows) {
                matrixResponses[question.id + '-' + row.id] = '';
              }
            } else if (question.type === 'ranking' && question.options) {
              // Initialize ranking with a copy of the options array, making sure each item has an id
              responses[question.id] = question.options.map((option, index) => {
                return {...option, _id: index};
              });
            } else if (question.type === 'file_upload') {
              responses[question.id] = [];
            }
            
            // Initialize other responses where needed
            if ((question.type === 'multiple_choice' || question.type === 'checkbox_group') 
                && question.properties.allowOther) {
              otherResponses[question.id] = '';
            }
          }
        });
        
        // Get randomized question order if enabled
        const questionOrder = computed(() => {
          let questions = [...survey.questions];
          
          // If randomization is enabled, shuffle the questions
          if (survey.settings.randomizeQuestions) {
            // If we need to respect sections, split by sections first
            if (survey.settings.respectSections) {
              const sections = [];
              let currentSection = [];
              
              // Group questions by sections
              for (const q of questions) {
                if (q.type === 'section_break' && currentSection.length > 0) {
                  sections.push([...currentSection]);
                  currentSection = [q];
                } else {
                  currentSection.push(q);
                }
              }
              
              // Add the last section
              if (currentSection.length > 0) {
                sections.push(currentSection);
              }
              
              // Shuffle each section separately
              const shuffledSections = sections.map(section => shuffleArray(section));
              
              // Flatten back to a single array
              questions = shuffledSections.flat();
            } else {
              // Simple randomization
              questions = shuffleArray(questions);
            }
          }
          
          return questions;
        });
        
        // Reset all question visibility based on logic rules
        function resetVisibility() {
          const questionIds = survey.questions.map(q => q.id);
          questionIds.forEach(id => {
            questionVisibility[id] = true;
            questionVisibilityMemo[id] = null;
          });
          
          // Process logic rules
          reprocessVisibility();
        }
        
        // Apply all logic rules based on current responses
        function reprocessVisibility() {
          // First pass - apply all "show" rules
          for (const question of survey.questions) {
            if (question.logic && question.logic.length > 0) {
              const showRules = question.logic.filter(rule => rule.action === 'show');
              
              for (const rule of showRules) {
                const targetQuestion = rule.targetQuestionId;
                const isRuleMet = evaluateLogicRule(question, rule);
                
                // Store the rule result for this specific rule
                const ruleKey = question.id + '-' + targetQuestion + '-show';
                questionVisibilityMemo[ruleKey] = isRuleMet;
              }
            }
          }
          
          // ... rest of the function
          // Second pass - apply all "hide" rules
          for (const question of survey.questions) {
            if (question.logic && question.logic.length > 0) {
              const hideRules = question.logic.filter(rule => rule.action === 'hide');
              
              for (const rule of hideRules) {
                const targetQuestion = rule.targetQuestionId;
                const isRuleMet = evaluateLogicRule(question, rule);
                
                // Store the rule result for this specific rule
                const ruleKey = question.id + '-' + targetQuestion + '-hide';
                questionVisibilityMemo[ruleKey] = isRuleMet;
              }
            }
          }
          
          // Final visibility determination for each question
          for (const targetQuestion of survey.questions) {
            const targetId = targetQuestion.id;
            let isVisible = true;
            
            // If any hide rule is true, the question is hidden
            const hideRules = Object.entries(questionVisibilityMemo)
              .filter(function([key, value]) { return key.endsWith('-' + targetId + '-hide') && value === true; });
            
            if (hideRules.length > 0) {
              isVisible = false;
            }
            
            // If there are show rules targeting this question, at least one must be true
            const showRules = Object.entries(questionVisibilityMemo)
              .filter(function([key]) { return key.endsWith('-' + targetId + '-show'); });
            
            if (showRules.length > 0) {
              const anyShowRuleMet = showRules.some(function([key, value]) { return value === true; });
              if (!anyShowRuleMet) {
                isVisible = false;
              }
            }
            
            // Set the question's visibility
            questionVisibility[targetId] = isVisible;
          }
        }
        
        // Evaluate a single logic rule
        function evaluateLogicRule(question, rule) {
          const responseValue = responses[question.id];
          const checkboxResponses = arrayResponses[question.id] || [];
          
          if (question.type === 'checkbox_group') {
            switch (rule.condition) {
              case 'contains':
                return checkboxResponses.includes(rule.value);
              case 'not_contains':
                return !checkboxResponses.includes(rule.value);
              default:
                return false;
            }
          }
          
          switch (rule.condition) {
            case 'equals':
              return responseValue === rule.value;
            case 'not_equals':
              return responseValue !== rule.value;
            case 'greater_than':
              return parseFloat(responseValue) > parseFloat(rule.value);
            case 'less_than':
              return parseFloat(responseValue) < parseFloat(rule.value);
            default:
              return false;
          }
        }
        
        // Filter questions based on visibility rules
        const visibleQuestions = computed(() => {
          return questionOrder.value.filter(q => questionVisibility[q.id]);
        });
        
        // Get the current visible question index
        const visibleQuestionIndex = computed(() => {
          const currentQuestion = visibleQuestions.value[currentQuestionIndex.value];
          return visibleQuestions.value.findIndex(q => q.id === currentQuestion?.id);
        });
        
        // Track progress through the survey
        const progress = computed(() => {
          if (visibleQuestions.value.length === 0) return 0;
          return Math.round(((currentQuestionIndex.value + 1) / visibleQuestions.value.length) * 100);
        });
        
        // Get the current question object
        const currentQuestion = computed(() => {
          if (visibleQuestions.value.length === 0) return null;
          return visibleQuestions.value[currentQuestionIndex.value];
        });
        
        // Handle response changes
        function handleResponseChange(questionId) {
          if (validationErrors[questionId]) {
            validationErrors[questionId] = null;
          }
          reprocessVisibility();
          
          if (survey.settings.navigationStyle === 'auto' && currentQuestion.value) {
            if (isCurrentResponseValid() && currentQuestionIndex.value < visibleQuestions.value.length - 1) {
              setTimeout(function() { nextQuestion(); }, 300);
            }
          }
        }
        
        // Handle checkbox selection for "other" option
        function handleOtherCheckboxChange(questionId) {
          if (otherSelected[questionId]) {
            if (!arrayResponses[questionId].includes('other')) {
              arrayResponses[questionId].push('other');
            }
          } else {
            const index = arrayResponses[questionId].indexOf('other');
            if (index !== -1) {
              arrayResponses[questionId].splice(index, 1);
            }
            otherResponses[questionId] = '';
          }
          handleResponseChange(questionId);
        }
        
        // Handle matrix question responses
        function handleMatrixResponseChange(questionId) {
          const matrixData = {};
          const question = survey.questions.find(q => q.id === questionId);
          
          if (question) {
            question.rows.forEach(row => {
              const responseKey = questionId + '-' + row.id;
              matrixData[row.id] = matrixResponses[responseKey] || '';
            });
            responses[questionId] = matrixData;
          }
          
          handleResponseChange(questionId);
        }
        
        // File upload handler
        function handleFileUpload(event, questionId) {
          const question = survey.questions.find(q => q.id === questionId);
          if (!question) return;
          
          const files = Array.from(event.target.files);
          const maxFileSize = question.properties.maxFileSize * 1024 * 1024; // Convert MB to bytes
          const maxFiles = question.properties.maxFiles;
          
          // Validate file size
          const validFiles = files.filter(file => file.size <= maxFileSize);
          if (validFiles.length < files.length) {
            validationErrors[questionId] = 'One or more files exceed the size limit.';
            return;
          }
          
          // Validate max number of files
          if (!responses[questionId]) {
            responses[questionId] = [];
          }
          
          const totalFiles = responses[questionId].length + validFiles.length;
          if (totalFiles > maxFiles) {
            validationErrors[questionId] = 'Maximum file limit reached.';
            return;
          }
          
          // Add files to responses
          responses[questionId] = [...responses[questionId], ...validFiles];
          handleResponseChange(questionId);
          
          // Reset the input to allow selecting the same file again
          event.target.value = '';
        }
        
        // Remove a file from the response
        function removeFile(questionId, fileIndex) {
          if (responses[questionId] && responses[questionId][fileIndex]) {
            responses[questionId].splice(fileIndex, 1);
            handleResponseChange(questionId);
          }
        }
        
        // Format file size for display
        function formatFileSize(bytes) {
          if (bytes < 1024) return bytes + ' bytes';
          else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
          else return (bytes / 1048576).toFixed(1) + ' MB';
        }
        
        // Get randomized options if needed
        function getQuestionOptions(question) {
          if (!question.options) return [];
          
          if (question.properties.randomize) {
            const optionsCopy = [...question.options];
            return shuffleArray(optionsCopy);
          }
          return question.options;
        }
        
        // Get translated text for the current language
        function getTranslatedText(textObj) {
          // If it's not provided, return empty string
          if (!textObj) return '';
          
          // If it's a string, return it directly
          if (typeof textObj === 'string') return textObj;
          
          // If it's an object with language keys, handle translations
          if (typeof textObj === 'object') {
            // Try current language first
            if (textObj[currentLanguage.value] && textObj[currentLanguage.value] !== '') {
              return textObj[currentLanguage.value];
            }
            
            // Fall back to default language
            if (textObj[survey.settings.defaultLanguage] && textObj[survey.settings.defaultLanguage] !== '') {
              return textObj[survey.settings.defaultLanguage];
            }
            
            // If we have any language key with content, use that
            for (const lang in textObj) {
              if (textObj[lang] && textObj[lang] !== '') {
                return textObj[lang];
              }
            }
          }
          
          // If all else fails, return empty string
          return '';
        }
        
        // Format date for display
        function formatDate(dateString) {
          if (!dateString) return '';
          try {
            const date = new Date(dateString);
            return date.toLocaleDateString();
          } catch (e) {
            return dateString;
          }
        }
        
        // Check if a checkbox should be disabled (max selections)
        function isCheckboxDisabled(question, optionId) {
          if (!question.properties.maxSelections) return false;
          const res = arrayResponses[question.id] || [];
          if (res.length >= question.properties.maxSelections && !res.includes(optionId)) {
            return true;
          }
          return false;
        }
        
        // Move to next question
        function nextQuestion() {
          if (!isCurrentResponseValid()) {
            return;
          }
          
          if (currentQuestionIndex.value < visibleQuestions.value.length - 1) {
            currentQuestionIndex.value++;
            window.scrollTo(0, 0);
          }
        }
        
        // Move to previous question
        function prevQuestion() {
          if (currentQuestionIndex.value > 0) {
            currentQuestionIndex.value--;
            window.scrollTo(0, 0);
          }
        }
        
        // Validate the current response
        function isCurrentResponseValid() {
          const question = currentQuestion.value;
          if (!question) return true;
          if (question.type === 'section_break') return true;
          
          validationErrors[question.id] = null;
          
          if (question.required) {
            let hasResponse = false;
            
            switch (question.type) {
              case 'multiple_choice':
              case 'dropdown':
              case 'date':
              case 'open_text':
              case 'numeric':
                hasResponse = !!responses[question.id];
                break;
              case 'checkbox_group':
                hasResponse = arrayResponses[question.id] && arrayResponses[question.id].length > 0;
                break;
              case 'likert_scale':
                hasResponse = !!responses[question.id];
                break;
              case 'matrix':
                const matrixData = responses[question.id] || {};
                hasResponse = question.rows.every(row => matrixData[row.id]);
                break;
              case 'ranking':
                hasResponse = !!responses[question.id] && responses[question.id].length > 0;
                break;
              case 'file_upload':
                hasResponse = !!responses[question.id] && responses[question.id].length > 0;
                break;
            }
            
            if (!hasResponse) {
              validationErrors[question.id] = 'This question is required.';
              return false;
            }
          }
          
          // Type-specific validation
          if (question.type === 'file_upload' && responses[question.id] && responses[question.id].length > 0) {
            const maxFiles = question.properties.maxFiles;
            if (responses[question.id].length > maxFiles) {
              validationErrors[question.id] = 'Maximum file limit reached.';
              return false;
            }
            
            const maxFileSize = question.properties.maxFileSize * 1024 * 1024; // Convert MB to bytes
            const oversizedFiles = responses[question.id].filter(file => file.size > maxFileSize);
            if (oversizedFiles.length > 0) {
              validationErrors[question.id] = 'One or more files exceed the size limit.';
              return false;
            }
          }
          
          return true;
        }
        
        // Submit the survey
        function submitSurvey() {
          if (!isCurrentResponseValid()) {
            return;
          }
          
          const responseData = {
            survey_id: survey.id,
            timestamp: new Date().toISOString(),
            responses: {}
          };
          
          survey.questions.forEach(question => {
            if (question.type === 'section_break') return;
            
            let responseValue = null;
            
            switch (question.type) {
              case 'multiple_choice':
                responseValue = responses[question.id];
                if (responseValue === 'other' && otherResponses[question.id]) {
                  responseValue = { other: otherResponses[question.id] };
                }
                break;
              case 'checkbox_group':
                responseValue = arrayResponses[question.id] || [];
                if (responseValue.includes('other') && otherResponses[question.id]) {
                  responseValue = [...responseValue.filter(v => v !== 'other'), { other: otherResponses[question.id] }];
                }
                break;
              case 'matrix':
                responseValue = responses[question.id] || {};
                break;
              default:
                responseValue = responses[question.id];
            }
            
            responseData.responses[question.id] = {
              question_type: question.type,
              question_text: getTranslatedText(question.text),
              response: responseValue
            };
          });
          
          surveyCompleted.value = true;
          console.log('Survey responses:', responseData);
          window.scrollTo(0, 0);
        }
        
        // Format responses for the summary view
        function formatResponseForSummary(question) {
          if (!question) return '';
          const questionId = question.id;
          
          switch (question.type) {
            case 'multiple_choice':
              const choice = responses[questionId];
              if (!choice) return 'No answer';
              if (choice === 'other') {
                return otherResponses[questionId] || 'Other';
              } else {
                const option = question.options.find(o => o.id === choice);
                return option ? getTranslatedText(option.text) : choice;
              }
            case 'checkbox_group': {
              const choices = arrayResponses[questionId] || [];
              if (choices.length === 0) return 'No answer';
              
              const selectedOptions = choices.map(choiceId => {
                if (choiceId === 'other') {
                  return otherResponses[questionId] || 'Other';
                } else {
                  const option = question.options.find(o => o.id === choiceId);
                  return option ? getTranslatedText(option.text) : choiceId;
                }
              });
              
              return selectedOptions.join(', ');
            }
            case 'ranking': {
              const rankingItems = responses[questionId];
              if (!rankingItems || rankingItems.length === 0) return 'No answer';
              
              const rankedOptions = [];
              for (let i = 0; i < rankingItems.length; i++) {
                rankedOptions.push((i + 1) + '. ' + getTranslatedText(rankingItems[i].text));
              }
              return rankedOptions.join('\\n');
            }
            case 'file_upload': {
              const files = responses[questionId];
              if (!files || files.length === 0) return 'No files uploaded';
              
              if (files.length === 1) {
                return '1 file uploaded';
              } else {
                return files.length + ' files uploaded';
              }
            }
            case 'likert_scale': {
              const value = responses[questionId];
              if (!value) return 'No answer';
              return value + ' out of ' + question.properties.scale;
            }
            case 'matrix': {
              const matrixData = responses[questionId] || {};
              if (Object.keys(matrixData).length === 0) return 'No answer';
              const rows = [];
              for (const row of question.rows) {
                const columnId = matrixData[row.id];
                if (!columnId) continue;
                const column = question.columns.find(c => c.id === columnId);
                const rowText = getTranslatedText(row.text);
                const colText = column ? getTranslatedText(column.text) : columnId;
                rows.push(rowText + ': ' + colText);
              }
              return rows.join('\\n');
            }
            case 'dropdown': {
              const choiceId = responses[questionId];
              if (!choiceId) return 'No answer';
              const option = question.options.find(o => o.id === choiceId);
              return option ? getTranslatedText(option.text) : choiceId;
            }
            case 'date': {
              const date = responses[questionId];
              if (!date) return 'No answer';
              return formatDate(date);
            }
            default:
              return responses[questionId] || 'No answer';
          }
        }
        
        // Get all questions that have been answered
        function getAnsweredQuestions() {
          return survey.questions.filter(q => {
            if (q.type === 'section_break') return false;
            
            const response = responses[q.id];
            
            if (q.type === 'checkbox_group') {
              return arrayResponses[q.id] && arrayResponses[q.id].length > 0;
            } else if (q.type === 'matrix') {
              const matrixData = response || {};
              return Object.keys(matrixData).length > 0;
            } else if (q.type === 'ranking') {
              return response && Array.isArray(response) && response.length > 0;
            } else if (q.type === 'file_upload') {
              return response && Array.isArray(response) && response.length > 0;
            } else {
              return response !== undefined && response !== null && response !== '';
            }
          });
        }
        
        // Handle language change
        function handleLanguageChange() {
          // The change is reactive and handled automatically
        }
        
        // Return data and methods for template
        return {
          survey,
          currentLanguage,
          currentQuestionIndex,
          responses,
          arrayResponses,
          matrixResponses,
          otherResponses,
          otherSelected,
          validationErrors,
          surveyCompleted,
          languageOptions,
          visibleQuestions,
          visibleQuestionIndex,
          currentQuestion,
          progress,
          nextQuestion,
          prevQuestion,
          submitSurvey,
          handleResponseChange,
          handleOtherCheckboxChange,
          handleMatrixResponseChange,
          handleFileUpload,
          removeFile,
          formatFileSize,
          getQuestionOptions,
          getTranslatedText,
          formatDate,
          isCheckboxDisabled,
          formatResponseForSummary,
          getAnsweredQuestions,
          handleLanguageChange
        };
      }
    }).mount('#app');
  `;
};

/**
 * Generates HTML template for survey export
 * @param {Object} survey - Survey configuration
 * @returns {string} - HTML template
 */
export const generateExportHtml = (survey) => {
  return `<!DOCTYPE html>
<html lang="${survey.settings.defaultLanguage}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${survey.title}</title>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"><\/script>
  <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.14.0/Sortable.min.js"><\/script>
  <script src="https://unpkg.com/vuedraggable@4.0.1/dist/vuedraggable.umd.min.js"><\/script>
  <style>
    ${generateStyles(survey)}
  </style>
</head>
<body>
  <div id="app">
    <!-- Survey Container -->
    <div v-if="!surveyCompleted" class="survey-container">
      <!-- Language Selector (if multiple languages available) -->
      <div v-if="languageOptions.length > 1" class="language-selector">
        <select v-model="currentLanguage" @change="handleLanguageChange">
          <option v-for="lang in languageOptions" :key="lang.code" :value="lang.code">
            {{ lang.name }}
          </option>
        </select>
      </div>
      
      <!-- Survey Header -->
      <div class="survey-header">
        <h1 class="survey-title">{{ getTranslatedText(survey.title) }}</h1>
        <p class="survey-description">{{ getTranslatedText(survey.description) }}</p>
      </div>
      
      <!-- Progress Bar (if enabled) -->
      <div v-if="survey.settings.showProgressBar" class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="progress-text">{{ progress }}% complete</div>
      </div>
      
      <!-- Question Display -->
      <div v-if="currentQuestion" class="question-container">
        <!-- Question Number -->
        <div v-if="survey.settings.questionNumbering === 'visible'" class="question-number">
          Question {{ visibleQuestionIndex + 1 }} of {{ visibleQuestions.length }}
        </div>
        
        <!-- Question Text & Required Indicator -->
        <h2 class="question-text">
          {{ getTranslatedText(currentQuestion.text) }}
          <span v-if="currentQuestion.required && survey.settings.requiredIndicator !== 'none'" class="required-indicator">
            {{ survey.settings.requiredIndicator === 'asterisk' ? '*' : '(Required)' }}
          </span>
        </h2>
        
        <!-- Question Description -->
        <p v-if="getTranslatedText(currentQuestion.description)" class="question-description">
          {{ getTranslatedText(currentQuestion.description) }}
        </p>
        
        <!-- Question Content - Different for each question type -->
        <!-- Multiple Choice -->
        <div v-if="currentQuestion.type === 'multiple_choice'" class="options-container">
          <div v-for="option in getQuestionOptions(currentQuestion)" :key="option.id" class="option-item">
            <input 
              type="radio" 
              :id="'option-' + option.id" 
              :name="'question-' + currentQuestion.id" 
              :value="option.id" 
              v-model="responses[currentQuestion.id]"
              @change="handleResponseChange(currentQuestion.id)"
            >
            <label :for="'option-' + option.id">{{ getTranslatedText(option.text) }}</label>
          </div>
          <div v-if="currentQuestion.properties.allowOther" class="option-item">
            <input 
              type="radio" 
              :id="'option-other-' + currentQuestion.id" 
              :name="'question-' + currentQuestion.id" 
              value="other" 
              v-model="responses[currentQuestion.id]"
              @change="handleResponseChange(currentQuestion.id)"
            >
            <label :for="'option-other-' + currentQuestion.id">Other:</label>
            <input 
              type="text" 
              v-model="otherResponses[currentQuestion.id]"
              :disabled="responses[currentQuestion.id] !== 'other'"
              @input="handleResponseChange(currentQuestion.id)"
              placeholder="Please specify"
            >
          </div>
        </div>

        <!-- Checkbox Group -->
        <div v-else-if="currentQuestion.type === 'checkbox_group'" class="options-container">
          <div v-for="option in getQuestionOptions(currentQuestion)" :key="option.id" class="option-item">
            <input 
              type="checkbox" 
              :id="'option-' + option.id" 
              :value="option.id" 
              v-model="arrayResponses[currentQuestion.id]"
              @change="handleResponseChange(currentQuestion.id)"
              :disabled="isCheckboxDisabled(currentQuestion, option.id)"
            >
            <label :for="'option-' + option.id">{{ getTranslatedText(option.text) }}</label>
          </div>
          <div v-if="currentQuestion.properties.allowOther" class="option-item">
            <input 
              type="checkbox" 
              :id="'option-other-' + currentQuestion.id" 
              v-model="otherSelected[currentQuestion.id]"
              @change="handleOtherCheckboxChange(currentQuestion.id)"
            >
            <label :for="'option-other-' + currentQuestion.id">Other:</label>
            <input 
              type="text" 
              v-model="otherResponses[currentQuestion.id]"
              :disabled="!otherSelected[currentQuestion.id]"
              @input="handleResponseChange(currentQuestion.id)"
              placeholder="Please specify"
            >
          </div>
        </div>

        <!-- Likert Scale -->
        <div v-else-if="currentQuestion.type === 'likert_scale'" class="likert-container">
          <div class="likert-labels">
            <span>{{ getTranslatedText(currentQuestion.properties.labels.start) }}</span>
            <span>{{ getTranslatedText(currentQuestion.properties.labels.end) }}</span>
          </div>
          <div class="likert-scale">
            <div 
              v-for="n in currentQuestion.properties.scale" 
              :key="n" 
              class="likert-option"
            >
              <input 
                type="radio" 
                :id="'likert-' + currentQuestion.id + '-' + n" 
                :name="'question-' + currentQuestion.id" 
                :value="n.toString()" 
                v-model="responses[currentQuestion.id]"
                @change="handleResponseChange(currentQuestion.id)"
              >
              <label v-if="currentQuestion.properties.showValues" :for="'likert-' + currentQuestion.id + '-' + n">{{ n }}</label>
            </div>
          </div>
        </div>

        <!-- Open Text -->
        <div v-else-if="currentQuestion.type === 'open_text'">
          <textarea 
            v-if="currentQuestion.properties.multiline" 
            v-model="responses[currentQuestion.id]"
            @input="handleResponseChange(currentQuestion.id)"
            :placeholder="getTranslatedText(currentQuestion.properties.placeholder)"
            class="text-area"
            :maxlength="currentQuestion.properties.maxLength"
          ></textarea>
          <input 
            v-else 
            type="text" 
            v-model="responses[currentQuestion.id]"
            @input="handleResponseChange(currentQuestion.id)"
            :placeholder="getTranslatedText(currentQuestion.properties.placeholder)"
            class="text-input"
            :maxlength="currentQuestion.properties.maxLength"
          >
        </div>

        <!-- Dropdown -->
        <div v-else-if="currentQuestion.type === 'dropdown'">
          <select 
            v-model="responses[currentQuestion.id]"
            @change="handleResponseChange(currentQuestion.id)"
            class="dropdown-select"
          >
            <option value="">{{ getTranslatedText(currentQuestion.properties.placeholder) }}</option>
            <option 
              v-for="option in getQuestionOptions(currentQuestion)" 
              :key="option.id"
              :value="option.id"
            >
              {{ getTranslatedText(option.text) }}
            </option>
          </select>
        </div>

        <!-- Matrix -->
        <div v-else-if="currentQuestion.type === 'matrix'" class="matrix-container">
          <table class="matrix-table">
            <thead>
              <tr>
                <th></th>
                <th v-for="col in currentQuestion.columns" :key="col.id">
                  {{ getTranslatedText(col.text) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in currentQuestion.rows" :key="row.id">
                <td>{{ getTranslatedText(row.text) }}</td>
                <td v-for="col in currentQuestion.columns" :key="col.id" class="matrix-cell">
                  <input 
                    type="radio" 
                    :id="'matrix-' + currentQuestion.id + '-' + row.id + '-' + col.id" 
                    :name="'matrix-' + currentQuestion.id + '-' + row.id" 
                    :value="col.id"
                    v-model="matrixResponses[currentQuestion.id + '-' + row.id]"
                    @change="handleMatrixResponseChange(currentQuestion.id)"
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Numeric Input -->
        <div v-else-if="currentQuestion.type === 'numeric'">
          <div class="numeric-input-container">
            <input 
              type="number" 
              v-model="responses[currentQuestion.id]"
              @input="handleResponseChange(currentQuestion.id)"
              :min="currentQuestion.properties.min"
              :max="currentQuestion.properties.max"
              :step="currentQuestion.properties.step"
              class="text-input"
            >
            <span v-if="getTranslatedText(currentQuestion.properties.unit)" class="unit-label">
              {{ getTranslatedText(currentQuestion.properties.unit) }}
            </span>
          </div>
        </div>

        <!-- Date Input -->
        <div v-else-if="currentQuestion.type === 'date'">
          <input 
            type="date" 
            v-model="responses[currentQuestion.id]"
            @input="handleResponseChange(currentQuestion.id)"
            :min="currentQuestion.properties.minDate"
            :max="currentQuestion.properties.maxDate"
            class="text-input"
          >
        </div>

        <!-- Ranking Input -->
        <div v-else-if="currentQuestion.type === 'ranking'" class="ranking-container">
          <draggable 
            v-model="responses[currentQuestion.id]" 
            item-key="_id"
            handle=".ranking-item"
            class="ranking-list"
            animation="150"
            ghost-class="ranking-item-ghost"
            @change="handleResponseChange(currentQuestion.id)"
          >
            <template #item="{ element, index }">
              <div class="ranking-item">
                <div class="drag-handle">⋮⋮</div>
                <div v-if="currentQuestion.properties && currentQuestion.properties.showNumbers" class="ranking-number">{{ index + 1 }}</div>
                <div class="ranking-text">{{ getTranslatedText(element.text) }}</div>
              </div>
            </template>
          </draggable>
        </div>

        <!-- File Upload -->
        <div v-else-if="currentQuestion.type === 'file_upload'" class="file-upload-container">
          <div class="file-input-wrapper">
            <input 
              type="file" 
              :id="'file-' + currentQuestion.id" 
              @change="handleFileUpload($event, currentQuestion.id)"
              :accept="currentQuestion.properties.allowedTypes.join(',')"
              :multiple="currentQuestion.properties.maxFiles > 1"
            >
            <label :for="'file-' + currentQuestion.id" class="file-input-label">
              <span v-if="currentQuestion.properties.maxFiles > 1">Choose files</span>
              <span v-else>Choose file</span>
            </label>
          </div>
          <div class="upload-limits">
            <span>Max size: {{ currentQuestion.properties.maxFileSize }}MB</span>
            <span v-if="currentQuestion.properties.maxFiles > 1">Max files: {{ currentQuestion.properties.maxFiles }}</span>
          </div>
          <div v-if="responses[currentQuestion.id] && responses[currentQuestion.id].length > 0" class="selected-files">
            <div v-for="(file, idx) in responses[currentQuestion.id]" :key="idx" class="selected-file">
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">({{ formatFileSize(file.size) }})</span>
              <button @click="removeFile(currentQuestion.id, idx)" class="remove-file">✕</button>
            </div>
          </div>
        </div>

        <!-- Section Break -->
        <div v-else-if="currentQuestion.type === 'section_break'" class="section-break">
          <!-- No response needed for section breaks -->
        </div>
        
        <!-- Validation error message if needed -->
        <div v-if="validationErrors[currentQuestion.id]" class="validation-error">
          <p>{{ validationErrors[currentQuestion.id] }}</p>
        </div>
      </div>
      
      <!-- Navigation Buttons -->
      <div class="nav-buttons">
        <button 
          @click="prevQuestion" 
          :disabled="currentQuestionIndex === 0"
          class="secondary"
        >
          Previous
        </button>
        
        <div style="flex-grow: 1;"></div>
        
        <button 
          v-if="currentQuestionIndex < visibleQuestions.length - 1" 
          @click="nextQuestion"
        >
          Next
        </button>
        <button 
          v-else 
          @click="submitSurvey"
        >
          Submit
        </button>
      </div>
    </div>
    
    <!-- Completion Screen -->
    <div v-else class="survey-container completion-container">
      <div class="completion-icon">✓</div>
      <h2 class="completion-message">{{ getTranslatedText(survey.settings.completionMessage) }}</h2>
      
      <!-- Response Summary (if enabled) -->
      <div v-if="survey.settings.showResponseSummary" class="response-summary">
        <h3>Your Responses</h3>
        
        <div v-for="question in getAnsweredQuestions()" :key="question.id" class="summary-item">
          <div class="summary-question">{{ getTranslatedText(question.text) }}</div>
          <div class="summary-answer">{{ formatResponseForSummary(question) }}</div>
        </div>
      </div>
    </div>
  </div>
  
  <script>
    ${generateAppScript(survey)}
  <\/script>
</body>
</html>`;
};