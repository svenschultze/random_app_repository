import { faker } from '@faker-js/faker';

// Data models
const WORKOUT_TYPES = [
  'Running',
  'Cycling',
  'Swimming',
  'Walking', 
  'Yoga',
  'Weight Training',
  'HIIT',
  'Pilates',
  'Hiking',
  'Basketball'
];

// Local storage keys
const STORAGE_KEYS = {
  DAILY_LOGS: 'fittrack_dailyLogs',
  WORKOUTS: 'fittrack_workouts',
  USER_SETTINGS: 'fittrack_userSettings'
};

// Default user settings
const DEFAULT_SETTINGS = {
  stepGoal: 8000,
  calorieGoal: 2500,
  activeMinutesGoal: 30
};

// Get data from localStorage or generate if not exists
const getDailyLogs = () => {
  const storedLogs = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
  if (storedLogs) {
    return JSON.parse(storedLogs);
  }
  return [];
};

const getWorkouts = () => {
  const storedWorkouts = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
  if (storedWorkouts) {
    return JSON.parse(storedWorkouts);
  }
  return [];
};

const getUserSettings = () => {
  const storedSettings = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
  if (storedSettings) {
    return JSON.parse(storedSettings);
  }
  return DEFAULT_SETTINGS;
};

// Save data to localStorage
const saveDailyLogs = (logs) => {
  localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
};

const saveWorkouts = (workouts) => {
  localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
};

const saveUserSettings = (settings) => {
  localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(settings));
};

// Generate random data for the past n days
const generateRandomDailyLogs = (days = 30) => {
  const logs = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    logs.push({
      id: faker.string.uuid(),
      date: dateString,
      steps: faker.number.int({ min: 3000, max: 15000 }),
      calories: faker.number.int({ min: 1800, max: 3000 }),
      activeMinutes: faker.number.int({ min: 15, max: 120 })
    });
  }
  
  saveDailyLogs(logs);
  return logs;
};

// Generate random workouts for the past n days
const generateRandomWorkouts = (count = 10) => {
  const workouts = [];
  const today = new Date();
  
  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(today.getDate() - faker.number.int({ min: 0, max: 14 }));
    date.setHours(faker.number.int({ min: 6, max: 20 }));
    
    const workoutType = WORKOUT_TYPES[faker.number.int({ min: 0, max: WORKOUT_TYPES.length - 1 })];
    let distance = null;
    let caloriesBurned = 0;
    
    // Assign realistic values based on workout type
    if (['Running', 'Cycling', 'Swimming', 'Walking', 'Hiking'].includes(workoutType)) {
      distance = faker.number.float({ min: 1, max: 15, precision: 0.1 });
    }
    
    const duration = faker.number.int({ min: 15, max: 90 });
    
    // Calculate calories based on duration and workout type
    if (workoutType === 'Running') {
      caloriesBurned = Math.round(duration * 10); // ~10 calories per minute
    } else if (workoutType === 'Cycling') {
      caloriesBurned = Math.round(duration * 8); // ~8 calories per minute
    } else if (workoutType === 'Swimming') {
      caloriesBurned = Math.round(duration * 9); // ~9 calories per minute
    } else if (workoutType === 'Walking') {
      caloriesBurned = Math.round(duration * 5); // ~5 calories per minute
    } else if (workoutType === 'Weight Training' || workoutType === 'HIIT') {
      caloriesBurned = Math.round(duration * 7); // ~7 calories per minute
    } else {
      caloriesBurned = Math.round(duration * 6); // ~6 calories per minute
    }
    
    workouts.push({
      id: faker.string.uuid(),
      date: date.toISOString(),
      type: workoutType,
      duration: duration,
      distance: distance,
      caloriesBurned: caloriesBurned
    });
  }
  
  saveWorkouts(workouts);
  return workouts;
};

// Initialize data - returns true if data was generated
const initializeData = () => {
  let isGenerated = false;
  
  if (getDailyLogs().length === 0) {
    generateRandomDailyLogs();
    isGenerated = true;
  }
  
  if (getWorkouts().length === 0) {
    generateRandomWorkouts();
    isGenerated = true;
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.USER_SETTINGS)) {
    saveUserSettings(DEFAULT_SETTINGS);
  }
  
  return isGenerated;
};

// Add a new workout
const addWorkout = (workout) => {
  const workouts = getWorkouts();
  const newWorkout = {
    id: faker.string.uuid(),
    ...workout
  };
  
  workouts.push(newWorkout);
  saveWorkouts(workouts);
  
  // Update daily log with calories from workout if it's today
  const workoutDate = new Date(workout.date).toISOString().split('T')[0];
  const todayString = new Date().toISOString().split('T')[0];
  
  if (workoutDate === todayString) {
    const dailyLogs = getDailyLogs();
    const todayLog = dailyLogs.find(log => log.date === todayString);
    
    if (todayLog) {
      todayLog.calories += workout.caloriesBurned;
      todayLog.activeMinutes += workout.duration;
      saveDailyLogs(dailyLogs);
    }
  }
  
  return newWorkout;
};

// Update a workout
const updateWorkout = (id, updatedWorkout) => {
  const workouts = getWorkouts();
  const index = workouts.findIndex(w => w.id === id);
  
  if (index !== -1) {
    workouts[index] = {
      ...workouts[index],
      ...updatedWorkout
    };
    saveWorkouts(workouts);
    return workouts[index];
  }
  
  return null;
};

// Delete a workout
const deleteWorkout = (id) => {
  const workouts = getWorkouts();
  const filteredWorkouts = workouts.filter(w => w.id !== id);
  saveWorkouts(filteredWorkouts);
  return filteredWorkouts;
};

// Update user settings
const updateUserSettings = (settings) => {
  const currentSettings = getUserSettings();
  const updatedSettings = { ...currentSettings, ...settings };
  saveUserSettings(updatedSettings);
  return updatedSettings;
};

// Get daily logs for a date range
const getDailyLogsForRange = (startDate, endDate) => {
  const logs = getDailyLogs();
  
  return logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= startDate && logDate <= endDate;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Get today's log
const getTodayLog = () => {
  const logs = getDailyLogs();
  const todayString = new Date().toISOString().split('T')[0];
  
  let todayLog = logs.find(log => log.date === todayString);
  
  if (!todayLog) {
    // Create today's log if it doesn't exist
    todayLog = {
      id: faker.string.uuid(),
      date: todayString,
      steps: 0,
      calories: 0,
      activeMinutes: 0
    };
    
    logs.push(todayLog);
    saveDailyLogs(logs);
  }
  
  return todayLog;
};

// Update today's log
const updateTodayLog = (updates) => {
  const logs = getDailyLogs();
  const todayString = new Date().toISOString().split('T')[0];
  
  const index = logs.findIndex(log => log.date === todayString);
  
  if (index !== -1) {
    logs[index] = {
      ...logs[index],
      ...updates
    };
  } else {
    logs.push({
      id: faker.string.uuid(),
      date: todayString,
      steps: updates.steps || 0,
      calories: updates.calories || 0,
      activeMinutes: updates.activeMinutes || 0
    });
  }
  
  saveDailyLogs(logs);
  return logs.find(log => log.date === todayString);
};

// Calculate user stats
const calculateStats = (days = 7) => {
  const logs = getDailyLogs();
  const workouts = getWorkouts();
  const settings = getUserSettings();
  
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - days);
  
  // Filter logs within date range
  const filteredLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= pastDate && logDate <= today;
  });
  
  // Filter workouts within date range
  const filteredWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    return workoutDate >= pastDate && workoutDate <= today;
  });
  
  // Calculate stats
  const totalSteps = filteredLogs.reduce((sum, log) => sum + log.steps, 0);
  const totalCalories = filteredLogs.reduce((sum, log) => sum + log.calories, 0);
  const totalActiveMinutes = filteredLogs.reduce((sum, log) => sum + log.activeMinutes, 0);
  const totalWorkouts = filteredWorkouts.length;
  
  // Calculate averages
  const avgSteps = Math.round(totalSteps / Math.min(days, filteredLogs.length));
  const avgCalories = Math.round(totalCalories / Math.min(days, filteredLogs.length));
  const avgActiveMinutes = Math.round(totalActiveMinutes / Math.min(days, filteredLogs.length));
  
  // Calculate goal progress
  const stepGoalProgress = Math.round((avgSteps / settings.stepGoal) * 100);
  const calorieGoalProgress = Math.round((avgCalories / settings.calorieGoal) * 100);
  const activeMinutesGoalProgress = Math.round((avgActiveMinutes / settings.activeMinutesGoal) * 100);
  
  return {
    totalSteps,
    totalCalories,
    totalActiveMinutes,
    totalWorkouts,
    avgSteps,
    avgCalories,
    avgActiveMinutes,
    stepGoalProgress,
    calorieGoalProgress,
    activeMinutesGoalProgress,
    days
  };
};

// Calculate streaks (consecutive days meeting step goal)
const calculateStreak = () => {
  const logs = getDailyLogs();
  const settings = getUserSettings();
  
  logs.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  let currentStreak = 0;
  let bestStreak = 0;
  
  // Find the current streak
  for (const log of logs) {
    if (log.steps >= settings.stepGoal) {
      currentStreak++;
    } else {
      break;
    }
  }
  
  // Find the best streak
  let tempStreak = 0;
  for (const log of logs) {
    if (log.steps >= settings.stepGoal) {
      tempStreak++;
      if (tempStreak > bestStreak) {
        bestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }
  
  return {
    currentStreak,
    bestStreak
  };
};

export {
  WORKOUT_TYPES,
  getDailyLogs,
  getWorkouts,
  getUserSettings,
  generateRandomDailyLogs,
  generateRandomWorkouts,
  initializeData,
  addWorkout,
  updateWorkout,
  deleteWorkout,
  updateUserSettings,
  getDailyLogsForRange,
  getTodayLog,
  updateTodayLog,
  calculateStats,
  calculateStreak
};