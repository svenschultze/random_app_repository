// Interval Workout Service
// Handles all operations related to interval workouts

/**
 * Structure of interval workouts:
 * {
 *   id: string,
 *   name: string,
 *   description: string,
 *   type: string,
 *   intervals: [
 *     {
 *       id: string,
 *       name: string,
 *       duration: number (seconds),
 *       intensity: string (low, medium, high),
 *       description: string
 *     }
 *   ],
 *   estimatedCalories: number,
 *   totalDuration: number (seconds),
 *   favorite: boolean
 * }
 */

// Local storage key for interval workouts
const INTERVAL_WORKOUTS_STORAGE_KEY = 'fittrack_intervalWorkouts';
const USER_INTERVAL_WORKOUTS_STORAGE_KEY = 'fittrack_userIntervalWorkouts';

// Predefined interval workouts
const defaultIntervalWorkouts = [
  {
    id: 'tabata-basic',
    name: 'Basic Tabata',
    description: '20 seconds work, 10 seconds rest - classic Tabata protocol',
    type: 'HIIT',
    intervals: Array(8).fill().map((_, i) => [
      {
        id: `tabata-work-${i+1}`,
        name: 'Work',
        duration: 20,
        intensity: 'high',
        description: 'High intensity work interval'
      },
      {
        id: `tabata-rest-${i+1}`,
        name: 'Rest',
        duration: 10,
        intensity: 'low',
        description: 'Brief rest interval'
      }
    ]).flat(),
    estimatedCalories: 120,
    totalDuration: 240, // 4 minutes
    favorite: false
  },
  {
    id: 'hiit-pyramid',
    name: 'HIIT Pyramid',
    description: 'Increasing then decreasing work intervals with fixed rest',
    type: 'HIIT',
    intervals: [
      {
        id: 'pyramid-work-1',
        name: 'Work',
        duration: 20,
        intensity: 'high',
        description: 'High intensity interval'
      },
      {
        id: 'pyramid-rest-1',
        name: 'Rest',
        duration: 20,
        intensity: 'low',
        description: 'Recovery'
      },
      {
        id: 'pyramid-work-2',
        name: 'Work',
        duration: 30,
        intensity: 'high',
        description: 'High intensity interval'
      },
      {
        id: 'pyramid-rest-2',
        name: 'Rest',
        duration: 20,
        intensity: 'low',
        description: 'Recovery'
      },
      {
        id: 'pyramid-work-3',
        name: 'Work',
        duration: 40,
        intensity: 'high',
        description: 'High intensity interval'
      },
      {
        id: 'pyramid-rest-3',
        name: 'Rest',
        duration: 20,
        intensity: 'low',
        description: 'Recovery'
      },
      {
        id: 'pyramid-work-4',
        name: 'Work',
        duration: 50,
        intensity: 'high',
        description: 'High intensity interval'
      },
      {
        id: 'pyramid-rest-4',
        name: 'Rest',
        duration: 20,
        intensity: 'low',
        description: 'Recovery'
      },
      {
        id: 'pyramid-work-5',
        name: 'Work',
        duration: 60,
        intensity: 'high',
        description: 'High intensity interval'
      },
      {
        id: 'pyramid-rest-5',
        name: 'Rest',
        duration: 20,
        intensity: 'low',
        description: 'Recovery'
      },
      {
        id: 'pyramid-work-6',
        name: 'Work',
        duration: 50,
        intensity: 'high',
        description: 'High intensity interval'
      },
      {
        id: 'pyramid-rest-6',
        name: 'Rest',
        duration: 20,
        intensity: 'low',
        description: 'Recovery'
      },
      {
        id: 'pyramid-work-7',
        name: 'Work',
        duration: 40,
        intensity: 'high',
        description: 'High intensity interval'
      },
      {
        id: 'pyramid-rest-7',
        name: 'Rest',
        duration: 20,
        intensity: 'low',
        description: 'Recovery'
      },
      {
        id: 'pyramid-work-8',
        name: 'Work',
        duration: 30,
        intensity: 'high',
        description: 'High intensity interval'
      },
      {
        id: 'pyramid-rest-8',
        name: 'Rest',
        duration: 20,
        intensity: 'low',
        description: 'Recovery'
      },
      {
        id: 'pyramid-work-9',
        name: 'Work',
        duration: 20,
        intensity: 'high',
        description: 'High intensity interval'
      }
    ],
    estimatedCalories: 200,
    totalDuration: 530, // 8:50 minutes
    favorite: false
  },
  {
    id: 'run-walk-beginner',
    name: 'Beginner Run/Walk',
    description: 'Alternating running and walking intervals for beginners',
    type: 'Running',
    intervals: [
      {
        id: 'rw-warmup',
        name: 'Warm Up',
        duration: 300, // 5 minutes
        intensity: 'low',
        description: 'Brisk walk to warm up'
      },
      // Repeat these 6 times
      ...Array(6).fill().map((_, i) => [
        {
          id: `rw-run-${i+1}`,
          name: 'Run',
          duration: 60, // 1 minute
          intensity: 'medium',
          description: 'Light jog at sustainable pace'
        },
        {
          id: `rw-walk-${i+1}`,
          name: 'Walk',
          duration: 120, // 2 minutes
          intensity: 'low',
          description: 'Brisk walk to recover'
        }
      ]).flat(),
      {
        id: 'rw-cooldown',
        name: 'Cool Down',
        duration: 300, // 5 minutes
        intensity: 'low',
        description: 'Easy walk to cool down'
      }
    ],
    estimatedCalories: 180,
    totalDuration: 1380, // 23 minutes
    favorite: false
  },
  {
    id: '30-20-10-interval',
    name: '30-20-10 Interval',
    description: 'Progressive intensity intervals: 30s easy, 20s moderate, 10s sprint',
    type: 'Running',
    intervals: [
      {
        id: '30-20-10-warmup',
        name: 'Warm Up',
        duration: 300, // 5 minutes
        intensity: 'low',
        description: 'Easy jog to warm up'
      },
      // Repeat 5 times
      ...Array(5).fill().map((_, i) => [
        {
          id: `30-20-10-easy-${i+1}`,
          name: 'Easy',
          duration: 30,
          intensity: 'low',
          description: 'Easy pace jog'
        },
        {
          id: `30-20-10-moderate-${i+1}`,
          name: 'Moderate',
          duration: 20,
          intensity: 'medium',
          description: 'Moderate pace run'
        },
        {
          id: `30-20-10-sprint-${i+1}`,
          name: 'Sprint',
          duration: 10,
          intensity: 'high',
          description: 'All-out sprint'
        }
      ]).flat(),
      {
        id: '30-20-10-rest',
        name: 'Recovery',
        duration: 120, // 2 minutes
        intensity: 'low',
        description: 'Easy jog or walk to recover'
      },
      // Repeat 5 more times
      ...Array(5).fill().map((_, i) => [
        {
          id: `30-20-10-easy-${i+6}`,
          name: 'Easy',
          duration: 30,
          intensity: 'low',
          description: 'Easy pace jog'
        },
        {
          id: `30-20-10-moderate-${i+6}`,
          name: 'Moderate',
          duration: 20,
          intensity: 'medium',
          description: 'Moderate pace run'
        },
        {
          id: `30-20-10-sprint-${i+6}`,
          name: 'Sprint',
          duration: 10,
          intensity: 'high',
          description: 'All-out sprint'
        }
      ]).flat(),
      {
        id: '30-20-10-cooldown',
        name: 'Cool Down',
        duration: 300, // 5 minutes
        intensity: 'low',
        description: 'Easy jog or walk to cool down'
      }
    ],
    estimatedCalories: 260,
    totalDuration: 1020, // 17 minutes
    favorite: false
  }
];

// Get all predefined interval workouts
export const getPredefinedIntervalWorkouts = () => {
  return defaultIntervalWorkouts;
};

// Get all user-created interval workouts
export const getUserIntervalWorkouts = () => {
  const workoutsString = localStorage.getItem(USER_INTERVAL_WORKOUTS_STORAGE_KEY);
  if (!workoutsString) {
    return [];
  }
  return JSON.parse(workoutsString);
};

// Get all interval workouts (predefined + user-created)
export const getAllIntervalWorkouts = () => {
  return [...getPredefinedIntervalWorkouts(), ...getUserIntervalWorkouts()];
};

// Get interval workout by ID
export const getIntervalWorkoutById = (workoutId) => {
  // Check user workouts first
  const userWorkouts = getUserIntervalWorkouts();
  const userWorkout = userWorkouts.find(workout => workout.id === workoutId);
  if (userWorkout) {
    return userWorkout;
  }
  
  // Check predefined workouts
  return defaultIntervalWorkouts.find(workout => workout.id === workoutId);
};

// Create a new interval workout
export const createIntervalWorkout = (workoutData) => {
  const userWorkouts = getUserIntervalWorkouts();
  
  // Generate ID if not provided
  if (!workoutData.id) {
    workoutData.id = `workout-${Date.now()}`;
  }
  
  // Calculate total duration
  const totalDuration = workoutData.intervals.reduce((sum, interval) => sum + interval.duration, 0);
  workoutData.totalDuration = totalDuration;
  
  // Add to user workouts
  userWorkouts.push(workoutData);
  localStorage.setItem(USER_INTERVAL_WORKOUTS_STORAGE_KEY, JSON.stringify(userWorkouts));
  
  return workoutData;
};

// Update an interval workout
export const updateIntervalWorkout = (workoutId, workoutData) => {
  const userWorkouts = getUserIntervalWorkouts();
  const workoutIndex = userWorkouts.findIndex(workout => workout.id === workoutId);
  
  // Only user workouts can be updated
  if (workoutIndex === -1) {
    // Check if it's a predefined workout
    const predefinedWorkout = defaultIntervalWorkouts.find(workout => workout.id === workoutId);
    if (predefinedWorkout) {
      // Create a copy as a user workout
      return createIntervalWorkout({
        ...workoutData,
        id: `${workoutId}-custom`
      });
    }
    return null;
  }
  
  // Calculate total duration
  const totalDuration = workoutData.intervals.reduce((sum, interval) => sum + interval.duration, 0);
  workoutData.totalDuration = totalDuration;
  
  // Update workout
  userWorkouts[workoutIndex] = {
    ...userWorkouts[workoutIndex],
    ...workoutData
  };
  
  localStorage.setItem(USER_INTERVAL_WORKOUTS_STORAGE_KEY, JSON.stringify(userWorkouts));
  
  return userWorkouts[workoutIndex];
};

// Delete an interval workout
export const deleteIntervalWorkout = (workoutId) => {
  const userWorkouts = getUserIntervalWorkouts();
  const workoutIndex = userWorkouts.findIndex(workout => workout.id === workoutId);
  
  // Only user workouts can be deleted
  if (workoutIndex === -1) {
    return false;
  }
  
  // Remove workout
  userWorkouts.splice(workoutIndex, 1);
  localStorage.setItem(USER_INTERVAL_WORKOUTS_STORAGE_KEY, JSON.stringify(userWorkouts));
  
  return true;
};

// Toggle favorite status
export const toggleFavorite = (workoutId) => {
  // Check user workouts first
  const userWorkouts = getUserIntervalWorkouts();
  const workoutIndex = userWorkouts.findIndex(workout => workout.id === workoutId);
  
  if (workoutIndex !== -1) {
    // Toggle favorite for user workout
    userWorkouts[workoutIndex].favorite = !userWorkouts[workoutIndex].favorite;
    localStorage.setItem(USER_INTERVAL_WORKOUTS_STORAGE_KEY, JSON.stringify(userWorkouts));
    return userWorkouts[workoutIndex];
  }
  
  // For predefined workouts, create a copy as a user workout with favorite set
  const predefinedWorkout = defaultIntervalWorkouts.find(workout => workout.id === workoutId);
  if (predefinedWorkout) {
    const userCopy = {
      ...JSON.parse(JSON.stringify(predefinedWorkout)),
      id: `${workoutId}-custom`,
      favorite: true
    };
    userWorkouts.push(userCopy);
    localStorage.setItem(USER_INTERVAL_WORKOUTS_STORAGE_KEY, JSON.stringify(userWorkouts));
    return userCopy;
  }
  
  return null;
};

// Get favorite workouts
export const getFavoriteWorkouts = () => {
  const allWorkouts = getAllIntervalWorkouts();
  return allWorkouts.filter(workout => workout.favorite);
};

// Save workout history
export const saveIntervalWorkoutHistory = (workoutId, data) => {
  // Get the original workout
  const workout = getIntervalWorkoutById(workoutId);
  if (!workout) {
    return null;
  }
  
  // Create history entry
  const historyEntry = {
    id: `history-${Date.now()}`,
    workoutId,
    workoutName: workout.name,
    workoutType: workout.type,
    date: new Date().toISOString(),
    duration: data.duration || workout.totalDuration,
    intervals: workout.intervals,
    calories: data.calories || workout.estimatedCalories,
    notes: data.notes || '',
    rating: data.rating || 0
  };
  
  // Add to workout history (assuming we use the same storage as regular workouts)
  // You might want to modify this based on your existing workout history storage
  const historyKey = 'fittrack_workouts';
  const historyString = localStorage.getItem(historyKey);
  let history = historyString ? JSON.parse(historyString) : [];
  
  history.push(historyEntry);
  localStorage.setItem(historyKey, JSON.stringify(history));
  
  return historyEntry;
};