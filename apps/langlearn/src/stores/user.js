import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    profile: {
      id: null,
      name: '',
      email: '',
      level: 1,
      xp: 0,
      streak: 0,
      streakLastUpdated: null,
      badges: [],
      goalType: '', // e.g., "Travel Fluency", "Exam Preparation"
      language: '', // The language being learned
      nativeLanguage: '',
      createdAt: null,
    },
    xpThresholds: [0, 100, 200, 350, 500, 700, 1000, 1400, 1900, 2500], // XP needed for each level
  }),
  
  getters: {
    // Calculate how much XP is needed for the next level
    xpForNextLevel: (state) => {
      const currentLevel = state.profile.level;
      if (currentLevel >= state.xpThresholds.length) {
        // If we're at max defined level, use a formula
        return Math.floor(state.xpThresholds[state.xpThresholds.length - 1] * 1.5);
      }
      return state.xpThresholds[currentLevel];
    },
    
    // Calculate progress percentage to next level
    levelProgress: (state) => {
      const currentLevelXP = state.xpThresholds[state.profile.level - 1] || 0;
      const nextLevelXP = state.xpThresholds[state.profile.level] || currentLevelXP * 1.5;
      const xpInCurrentLevel = state.profile.xp - currentLevelXP;
      const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
      
      return Math.min(100, Math.floor((xpInCurrentLevel / xpNeededForNextLevel) * 100));
    },
    
    // Check if a badge is earned
    hasBadge: (state) => (badgeId) => {
      return state.profile.badges.some(badge => badge.id === badgeId);
    }
  },
  
  actions: {
    // Log in the user
    login(userData) {
      // In a real app, this would be an API call
      this.profile = {
        ...this.profile,
        ...userData,
        createdAt: new Date(),
      };
      this.isLoggedIn = true;
    },
    
    // Log out the user
    logout() {
      this.isLoggedIn = false;
      this.profile = {
        id: null,
        name: '',
        email: '',
        level: 1,
        xp: 0,
        streak: 0,
        streakLastUpdated: null,
        badges: [],
        goalType: '',
        language: '',
        nativeLanguage: '',
        createdAt: null,
      };
    },
    
    // Add XP to the user's profile and check for level-ups
    addXP(amount) {
      this.profile.xp += amount;
      
      // Check if user has leveled up
      while (this.profile.xp >= this.xpThresholds[this.profile.level]) {
        if (this.profile.level < this.xpThresholds.length) {
          this.profile.level++;
        } else {
          break; // Don't increase level past our defined thresholds
        }
      }
      
      // Update streak if needed
      this.updateStreak();
    },
    
    // Update the user's daily streak
    updateStreak() {
      const today = new Date().setHours(0, 0, 0, 0);
      const lastUpdated = this.profile.streakLastUpdated 
        ? new Date(this.profile.streakLastUpdated).setHours(0, 0, 0, 0)
        : null;
      
      // First activity or same day activity
      if (!lastUpdated || lastUpdated === today) {
        this.profile.streakLastUpdated = new Date();
        return;
      }
      
      // If it's the next day, increment streak
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastUpdated === yesterday.setHours(0, 0, 0, 0)) {
        this.profile.streak++;
        this.profile.streakLastUpdated = new Date();
        this.checkForStreakBadges();
        return;
      }
      
      // If it's been more than a day, reset streak
      this.profile.streak = 1; // Reset to 1 since they're active today
      this.profile.streakLastUpdated = new Date();
    },
    
    // Check if user has earned any streak-related badges
    checkForStreakBadges() {
      const streakBadges = [
        { days: 3, id: 'streak-3', name: '3-Day Streak', description: 'Completed lessons 3 days in a row!' },
        { days: 7, id: 'streak-7', name: '7-Day Streak', description: 'A whole week of learning!' },
        { days: 30, id: 'streak-30', name: '30-Day Streak', description: 'An entire month of dedication!' }
      ];
      
      streakBadges.forEach(badge => {
        if (this.profile.streak >= badge.days && !this.hasBadge(badge.id)) {
          this.awardBadge(badge);
        }
      });
    },
    
    // Award a badge to the user
    awardBadge(badge) {
      if (!this.hasBadge(badge.id)) {
        this.profile.badges.push({
          ...badge,
          awardedAt: new Date()
        });
      }
    },
    
    // Set user's language learning goal
    setGoal(goalType) {
      this.profile.goalType = goalType;
    },
    
    // Set user's target language and native language
    setLanguages(targetLanguage, nativeLanguage) {
      this.profile.language = targetLanguage;
      this.profile.nativeLanguage = nativeLanguage;
    }
  }
})