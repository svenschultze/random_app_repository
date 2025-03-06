import { defineStore } from 'pinia'

// Mock data for language options
const LANGUAGES = [
  { id: 'es', name: 'Spanish' },
  { id: 'fr', name: 'French' },
  { id: 'de', name: 'German' },
  { id: 'it', name: 'Italian' },
  { id: 'pt', name: 'Portuguese' },
  { id: 'zh', name: 'Chinese' },
  { id: 'ja', name: 'Japanese' },
];

// Mock data for learning goals
const LEARNING_GOALS = [
  { id: 'travel', name: 'Travel Fluency', description: 'Learn practical phrases for your next trip' },
  { id: 'business', name: 'Business Communication', description: 'Master professional vocabulary and expressions' },
  { id: 'academic', name: 'Academic Study', description: 'Prepare for exams and academic settings' },
  { id: 'casual', name: 'Casual Conversation', description: 'Chat comfortably with friends and acquaintances' },
];

// Exercise types
const EXERCISE_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  MATCHING: 'matching',
  FILL_BLANK: 'fill_blank',
  LISTENING: 'listening',
  SPEAKING: 'speaking',
  FLASHCARD: 'flashcard',
};

export const useLessonsStore = defineStore('lessons', {
  state: () => ({
    languages: LANGUAGES,
    learningGoals: LEARNING_GOALS,
    currentLessonId: null,
    completedLessons: [],
    progress: {}, // Maps lessonId to completion percentage
    
    // Mock lessons data - in a real app, this would come from an API
    lessons: [
      {
        id: 'basics-1',
        title: 'Basic Greetings',
        description: 'Learn how to say hello and introduce yourself',
        level: 1,
        xpReward: 10,
        exercises: [
          {
            id: 'ex1',
            type: EXERCISE_TYPES.MULTIPLE_CHOICE,
            question: 'How do you say "hello" in Spanish?',
            options: ['Hola', 'Adiós', 'Gracias', 'Por favor'],
            correctAnswer: 'Hola',
            explanation: '"Hola" means "hello" in Spanish.',
          },
          {
            id: 'ex2',
            type: EXERCISE_TYPES.FILL_BLANK,
            question: 'Complete the greeting: "_____ días" (Good morning)',
            correctAnswer: 'Buenos',
            explanation: '"Buenos días" means "Good morning" in Spanish.',
          },
          {
            id: 'ex3',
            type: EXERCISE_TYPES.MATCHING,
            pairs: [
              { text: 'Hello', match: 'Hola' },
              { text: 'Goodbye', match: 'Adiós' },
              { text: 'Thank you', match: 'Gracias' },
              { text: 'Please', match: 'Por favor' },
            ],
          },
        ],
      },
      {
        id: 'basics-2',
        title: 'Common Phrases',
        description: 'Essential phrases for everyday situations',
        level: 1,
        xpReward: 15,
        exercises: [
          {
            id: 'ex4',
            type: EXERCISE_TYPES.MULTIPLE_CHOICE,
            question: 'Which phrase asks "How are you?" in Spanish?',
            options: ['¿Cómo estás?', '¿Dónde está?', '¿Qué hora es?', '¿Cuánto cuesta?'],
            correctAnswer: '¿Cómo estás?',
            explanation: '"¿Cómo estás?" means "How are you?" in Spanish.',
          },
          {
            id: 'ex5',
            type: EXERCISE_TYPES.LISTENING,
            audioUrl: '/audio/como-estas.mp3', // Mock path, would be real in production
            question: 'What did you hear?',
            options: ['¿Cómo estás?', '¿Cómo te llamas?', '¿De dónde eres?', '¿Qué haces?'],
            correctAnswer: '¿Cómo estás?',
          },
        ],
      },
      {
        id: 'numbers-1',
        title: 'Numbers 1-10',
        description: 'Learn to count from one to ten',
        level: 1,
        xpReward: 12,
        exercises: [
          {
            id: 'ex6',
            type: EXERCISE_TYPES.MATCHING,
            pairs: [
              { text: '1', match: 'uno' },
              { text: '2', match: 'dos' },
              { text: '3', match: 'tres' },
              { text: '4', match: 'cuatro' },
              { text: '5', match: 'cinco' },
            ],
          },
          {
            id: 'ex7',
            type: EXERCISE_TYPES.FILL_BLANK,
            question: 'The number 7 in Spanish is "_____"',
            correctAnswer: 'siete',
            explanation: '"Siete" is the Spanish word for the number 7.',
          },
        ],
      },
      {
        id: 'travel-1',
        title: 'At the Airport',
        description: 'Vocabulary and phrases for air travel',
        level: 2,
        xpReward: 20,
        exercises: [
          {
            id: 'ex8',
            type: EXERCISE_TYPES.MULTIPLE_CHOICE,
            question: 'How do you ask "Where is the bathroom?" in Spanish?',
            options: [
              '¿Dónde está el baño?', 
              '¿Dónde está el restaurante?', 
              '¿Dónde está la salida?', 
              '¿Dónde está mi maleta?'
            ],
            correctAnswer: '¿Dónde está el baño?',
            explanation: '"¿Dónde está el baño?" means "Where is the bathroom?" in Spanish.',
          },
          {
            id: 'ex9',
            type: EXERCISE_TYPES.FILL_BLANK,
            question: 'Complete the phrase: "Necesito un _____ de ida y vuelta." (I need a round-trip _____)',
            correctAnswer: 'boleto',
            explanation: '"Boleto" means "ticket" in Spanish.',
          },
        ],
      },
    ],
    
    // Mock challenges (timed activities)
    challenges: [
      {
        id: 'daily-1',
        title: 'Daily Practice',
        description: 'Quick 5-minute refresher',
        xpReward: 15,
        available: true,
      },
      {
        id: 'weekly-1',
        title: 'Weekly Challenge',
        description: 'Test your knowledge against the clock',
        xpReward: 50,
        available: true,
      },
    ],
    
    // Mock leaderboard data
    leaderboard: [
      { id: 'user1', name: 'Maria', xp: 450, level: 5 },
      { id: 'user2', name: 'John', xp: 375, level: 4 },
      { id: 'user3', name: 'Sofia', xp: 320, level: 4 },
      { id: 'user4', name: 'Thomas', xp: 290, level: 3 },
      { id: 'user5', name: 'Yuki', xp: 275, level: 3 },
    ],
  }),
  
  getters: {
    // Get available lessons based on user level
    availableLessons: (state) => (userLevel) => {
      return state.lessons.filter(lesson => lesson.level <= userLevel);
    },
    
    // Get a specific lesson by ID
    lessonById: (state) => (lessonId) => {
      return state.lessons.find(lesson => lesson.id === lessonId);
    },
    
    // Get user's lesson completion status
    isLessonCompleted: (state) => (lessonId) => {
      return state.completedLessons.includes(lessonId);
    },
    
    // Get the user's progress in a specific lesson
    lessonProgress: (state) => (lessonId) => {
      return state.progress[lessonId] || 0;
    },
    
    // Get daily challenges
    dailyChallenges: (state) => {
      return state.challenges.filter(challenge => challenge.id.startsWith('daily') && challenge.available);
    },
    
    // Get leaderboard sorted by XP
    sortedLeaderboard: (state) => {
      return [...state.leaderboard].sort((a, b) => b.xp - a.xp);
    },
    
    // Get vocabulary for a specific lesson
    lessonVocabulary: (state) => (lessonId) => {
      const lesson = state.lessonById(lessonId);
      if (!lesson) return [];
      
      // Extract vocabulary from exercises
      const vocabulary = [];
      lesson.exercises.forEach(exercise => {
        if (exercise.type === EXERCISE_TYPES.MATCHING) {
          exercise.pairs.forEach(pair => {
            vocabulary.push({
              term: pair.text,
              definition: pair.match,
              lessonId,
            });
          });
        }
      });
      
      return vocabulary;
    }
  },
  
  actions: {
    // Start a lesson
    startLesson(lessonId) {
      this.currentLessonId = lessonId;
      if (!this.progress[lessonId]) {
        this.progress[lessonId] = 0;
      }
    },
    
    // Complete an exercise in a lesson
    completeExercise(lessonId, exerciseId, isCorrect) {
      const lesson = this.lessonById(lessonId);
      if (!lesson) return;
      
      // Calculate progress based on number of exercises
      const totalExercises = lesson.exercises.length;
      const progressIncrement = 100 / totalExercises;
      
      // Update progress
      if (!this.progress[lessonId]) {
        this.progress[lessonId] = 0;
      }
      this.progress[lessonId] += progressIncrement;
      
      // Ensure progress doesn't exceed 100%
      if (this.progress[lessonId] > 100) {
        this.progress[lessonId] = 100;
      }
      
      // Check if lesson is complete
      if (this.progress[lessonId] >= 100 && !this.completedLessons.includes(lessonId)) {
        this.completeLesson(lessonId);
      }
    },
    
    // Complete a lesson
    completeLesson(lessonId) {
      if (!this.completedLessons.includes(lessonId)) {
        this.completedLessons.push(lessonId);
        
        // Return the XP reward for the user store to add
        const lesson = this.lessonById(lessonId);
        return lesson ? lesson.xpReward : 0;
      }
      return 0;
    },
    
    // Get recommended lessons based on user progress
    getRecommendedLessons(userLevel, completedLessons) {
      // First, get all lessons the user can access
      const availableLessons = this.availableLessons(userLevel);
      
      // Filter out completed lessons
      const incompleteLessons = availableLessons.filter(
        lesson => !completedLessons.includes(lesson.id)
      );
      
      // Sort by level, with lower levels first
      return incompleteLessons.sort((a, b) => a.level - b.level);
    }
  }
});