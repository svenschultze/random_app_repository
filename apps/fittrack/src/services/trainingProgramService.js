// Training Program Service
// Handles all operations related to training programs

/**
 * Structure of training programs:
 * {
 *   id: string,
 *   name: string,
 *   description: string,
 *   phases: [
 *     {
 *       id: string,
 *       name: string, 
 *       description: string,
 *       duration: number (days),
 *       workouts: [
 *         {
 *           id: string,
 *           name: string,
 *           description: string,
 *           type: string,
 *           intervals: [] (for interval workouts),
 *           targetDistance: number (optional),
 *           targetDuration: number (optional),
 *           completed: boolean,
 *           actualDistance: number (optional),
 *           actualDuration: number (optional),
 *           scheduledDay: number (1-7)
 *         }
 *       ]
 *     }
 *   ],
 *   currentPhase: number,
 *   startDate: string (ISO date),
 *   endDate: string (ISO date),
 *   active: boolean,
 *   completed: boolean,
 *   progress: number (percentage)
 * }
 */

// Local storage key for training programs
const PROGRAMS_STORAGE_KEY = 'fittrack_trainingPrograms';
const USER_PROGRAMS_STORAGE_KEY = 'fittrack_userPrograms';

// Default training programs
const defaultPrograms = [
  {
    id: '5k-training',
    name: '8-Week 5K Training',
    description: 'Progressive training plan to prepare for a 5K run',
    phases: [
      {
        id: 'phase-1',
        name: 'Foundation',
        description: 'Build your basic endurance with light running and walking',
        duration: 14, // 2 weeks
        workouts: [
          {
            id: 'p1-w1',
            name: 'Easy Run/Walk',
            description: 'Alternate 2 minutes running with 3 minutes walking',
            type: 'Running',
            targetDistance: 2,
            targetDuration: 20,
            scheduledDay: 1
          },
          {
            id: 'p1-w2',
            name: 'Strength Training',
            description: 'Basic strength exercises focusing on legs and core',
            type: 'Weight Training',
            targetDuration: 30,
            scheduledDay: 3
          },
          {
            id: 'p1-w3',
            name: 'Long Walk',
            description: 'Sustained walking at brisk pace',
            type: 'Walking',
            targetDistance: 4,
            targetDuration: 40,
            scheduledDay: 5
          },
          {
            id: 'p1-w4',
            name: 'Recovery Run',
            description: 'Easy-paced run with walking breaks as needed',
            type: 'Running',
            targetDistance: 2.5,
            targetDuration: 25,
            scheduledDay: 7
          }
        ]
      },
      {
        id: 'phase-2',
        name: 'Building',
        description: 'Increase running intervals and introduce basic speed work',
        duration: 14, // 2 weeks
        workouts: [
          {
            id: 'p2-w1',
            name: 'Interval Run',
            description: 'Alternate 3 minutes running with 2 minutes walking',
            type: 'Running',
            targetDistance: 2.5,
            targetDuration: 25,
            scheduledDay: 1
          },
          {
            id: 'p2-w2',
            name: 'Hill Training',
            description: 'Find a moderate hill and do 4-6 repetitions up and down',
            type: 'Running',
            targetDistance: 3,
            targetDuration: 30,
            scheduledDay: 3
          },
          {
            id: 'p2-w3',
            name: 'Strength and Core',
            description: 'Focus on leg strength and core stability',
            type: 'Weight Training',
            targetDuration: 30,
            scheduledDay: 5
          },
          {
            id: 'p2-w4',
            name: 'Long Run',
            description: 'Sustained running with walking breaks as needed',
            type: 'Running',
            targetDistance: 3.5,
            targetDuration: 35,
            scheduledDay: 7
          }
        ]
      },
      {
        id: 'phase-3',
        name: 'Endurance',
        description: 'Build endurance with longer continuous running',
        duration: 14, // 2 weeks
        workouts: [
          {
            id: 'p3-w1',
            name: 'Continuous Run',
            description: 'Try to run continuously for 20 minutes',
            type: 'Running',
            targetDistance: 3,
            targetDuration: 30,
            scheduledDay: 1
          },
          {
            id: 'p3-w2',
            name: 'Speed Intervals',
            description: '6 x 400m fast intervals with 200m recovery walks',
            type: 'Running',
            targetDistance: 3.5,
            targetDuration: 35,
            scheduledDay: 3
          },
          {
            id: 'p3-w3',
            name: 'Cross Training',
            description: 'Low-impact exercise like swimming or cycling',
            type: 'Swimming',
            targetDuration: 30,
            scheduledDay: 5
          },
          {
            id: 'p3-w4',
            name: 'Long Run',
            description: 'Your longest run yet - take walking breaks as needed',
            type: 'Running',
            targetDistance: 4,
            targetDuration: 40,
            scheduledDay: 7
          }
        ]
      },
      {
        id: 'phase-4',
        name: 'Final Preparation',
        description: 'Fine-tune running form and prepare for 5K',
        duration: 14, // 2 weeks
        workouts: [
          {
            id: 'p4-w1',
            name: 'Tempo Run',
            description: 'Run at a challenging but sustainable pace',
            type: 'Running',
            targetDistance: 3.5,
            targetDuration: 30,
            scheduledDay: 1
          },
          {
            id: 'p4-w2',
            name: 'Speed Work',
            description: '8 x 400m intervals with 200m recovery jogs',
            type: 'Running',
            targetDistance: 4,
            targetDuration: 35,
            scheduledDay: 3
          },
          {
            id: 'p4-w3',
            name: 'Easy Recovery Run',
            description: 'Slow, easy run to recover',
            type: 'Running',
            targetDistance: 3,
            targetDuration: 30,
            scheduledDay: 5
          },
          {
            id: 'p4-w4',
            name: '5K Test Run',
            description: 'Try to run 5K at your target pace!',
            type: 'Running',
            targetDistance: 5,
            targetDuration: 30,
            scheduledDay: 7
          }
        ]
      }
    ],
    currentPhase: 0,
    startDate: '',
    endDate: '',
    active: false,
    completed: false,
    progress: 0
  },
  {
    id: 'hiit-30day',
    name: '30-Day HIIT Challenge',
    description: 'High-intensity interval training program for fat loss and conditioning',
    phases: [
      {
        id: 'phase-1',
        name: 'Introduction',
        description: 'Introduction to HIIT concepts with manageable workouts',
        duration: 10,
        workouts: [
          {
            id: 'hiit-p1-w1',
            name: 'Beginner HIIT',
            description: '20 seconds work, 40 seconds rest x 8 rounds',
            type: 'HIIT',
            targetDuration: 15,
            scheduledDay: 1
          },
          {
            id: 'hiit-p1-w2',
            name: 'Active Recovery',
            description: 'Light walking or yoga to promote recovery',
            type: 'Walking',
            targetDuration: 20,
            scheduledDay: 2
          },
          {
            id: 'hiit-p1-w3',
            name: 'Bodyweight Circuit',
            description: '4 exercises, 30 seconds each, 3 rounds',
            type: 'HIIT',
            targetDuration: 20,
            scheduledDay: 3
          },
          {
            id: 'hiit-p1-w4',
            name: 'Active Recovery',
            description: 'Light walking or yoga to promote recovery',
            type: 'Walking',
            targetDuration: 20,
            scheduledDay: 4
          },
          {
            id: 'hiit-p1-w5',
            name: 'Tabata Intervals',
            description: '20 seconds work, 10 seconds rest x 8 rounds',
            type: 'HIIT',
            targetDuration: 20,
            scheduledDay: 5
          },
          {
            id: 'hiit-p1-w6',
            name: 'Longer Recovery',
            description: 'Rest day with light stretching',
            type: 'Yoga',
            targetDuration: 15,
            scheduledDay: 6
          },
          {
            id: 'hiit-p1-w7',
            name: 'Full Body HIIT',
            description: 'Full body workout with all major muscle groups',
            type: 'HIIT',
            targetDuration: 25,
            scheduledDay: 7
          }
        ]
      },
      {
        id: 'phase-2',
        name: 'Progression',
        description: 'Increased intensity and duration of intervals',
        duration: 10,
        workouts: [
          {
            id: 'hiit-p2-w1',
            name: 'Lower Body HIIT',
            description: 'Focus on legs and glutes with 30s work, 30s rest',
            type: 'HIIT',
            targetDuration: 25,
            scheduledDay: 1
          },
          {
            id: 'hiit-p2-w2',
            name: 'Upper Body HIIT',
            description: 'Focus on arms, chest and back with 30s work, 30s rest',
            type: 'HIIT',
            targetDuration: 25,
            scheduledDay: 3
          },
          {
            id: 'hiit-p2-w3',
            name: 'Core HIIT',
            description: 'Focus on abdominals and lower back with 30s work, 30s rest',
            type: 'HIIT',
            targetDuration: 25,
            scheduledDay: 5
          },
          {
            id: 'hiit-p2-w4',
            name: 'Full Body HIIT',
            description: 'Comprehensive workout combining all major muscle groups',
            type: 'HIIT',
            targetDuration: 30,
            scheduledDay: 7
          }
        ]
      },
      {
        id: 'phase-3',
        name: 'Challenge',
        description: 'Peak intensity with challenging intervals and minimal rest',
        duration: 10,
        workouts: [
          {
            id: 'hiit-p3-w1',
            name: 'Pyramid HIIT',
            description: 'Work intervals increase then decrease in duration',
            type: 'HIIT',
            targetDuration: 30,
            scheduledDay: 1
          },
          {
            id: 'hiit-p3-w2',
            name: 'Tabata Challenge',
            description: '20s work, 10s rest x 16 rounds',
            type: 'HIIT',
            targetDuration: 30,
            scheduledDay: 3
          },
          {
            id: 'hiit-p3-w3',
            name: 'EMOM Challenge',
            description: 'Every Minute On the Minute workout',
            type: 'HIIT',
            targetDuration: 30,
            scheduledDay: 5
          },
          {
            id: 'hiit-p3-w4',
            name: 'Final Challenge',
            description: 'Ultimate HIIT workout combining all techniques',
            type: 'HIIT',
            targetDuration: 35,
            scheduledDay: 7
          }
        ]
      }
    ],
    currentPhase: 0,
    startDate: '',
    endDate: '',
    active: false,
    completed: false,
    progress: 0
  }
];

// Get all predefined training programs
export const getPredefinedPrograms = () => {
  return defaultPrograms;
};

// Get all user training programs
export const getUserPrograms = () => {
  const programsString = localStorage.getItem(USER_PROGRAMS_STORAGE_KEY);
  if (!programsString) {
    return [];
  }
  return JSON.parse(programsString);
};

// Get a specific program by ID
export const getProgramById = (programId) => {
  // Check user programs first
  const userPrograms = getUserPrograms();
  const userProgram = userPrograms.find(program => program.id === programId);
  if (userProgram) {
    return userProgram;
  }
  
  // Check predefined programs
  return defaultPrograms.find(program => program.id === programId);
};

// Activate a training program
export const activateProgram = (programId) => {
  // Get the program template
  const programTemplate = getProgramById(programId);
  if (!programTemplate) {
    return null;
  }
  
  // Create a copy with user-specific data
  const userProgram = JSON.parse(JSON.stringify(programTemplate));
  
  // Set start date and calculate end date
  const startDate = new Date();
  userProgram.startDate = startDate.toISOString();
  
  // Calculate total duration of all phases
  const totalDays = userProgram.phases.reduce((sum, phase) => sum + phase.duration, 0);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + totalDays);
  userProgram.endDate = endDate.toISOString();
  
  // Mark as active
  userProgram.active = true;
  userProgram.currentPhase = 0;
  
  // Mark all workouts as not completed
  userProgram.phases.forEach(phase => {
    phase.workouts.forEach(workout => {
      workout.completed = false;
      workout.actualDistance = 0;
      workout.actualDuration = 0;
    });
  });
  
  // Save to user programs
  const userPrograms = getUserPrograms();
  userPrograms.push(userProgram);
  localStorage.setItem(USER_PROGRAMS_STORAGE_KEY, JSON.stringify(userPrograms));
  
  return userProgram;
};

// Get active training programs
export const getActivePrograms = () => {
  const userPrograms = getUserPrograms();
  return userPrograms.filter(program => program.active && !program.completed);
};

// Update workout completion status
export const updateWorkoutCompletion = (programId, phaseId, workoutId, completionData) => {
  const userPrograms = getUserPrograms();
  const programIndex = userPrograms.findIndex(program => program.id === programId);
  
  if (programIndex === -1) {
    return null;
  }
  
  const program = userPrograms[programIndex];
  const phase = program.phases.find(p => p.id === phaseId);
  
  if (!phase) {
    return null;
  }
  
  const workout = phase.workouts.find(w => w.id === workoutId);
  
  if (!workout) {
    return null;
  }
  
  // Update workout with completion data
  workout.completed = true;
  workout.actualDistance = completionData.distance || 0;
  workout.actualDuration = completionData.duration || 0;
  workout.completedDate = new Date().toISOString();
  
  // Update program progress
  updateProgramProgress(program);
  
  // Save changes
  localStorage.setItem(USER_PROGRAMS_STORAGE_KEY, JSON.stringify(userPrograms));
  
  return program;
};

// Update program progress
const updateProgramProgress = (program) => {
  let totalWorkouts = 0;
  let completedWorkouts = 0;
  
  // Count total and completed workouts
  program.phases.forEach(phase => {
    phase.workouts.forEach(workout => {
      totalWorkouts++;
      if (workout.completed) {
        completedWorkouts++;
      }
    });
  });
  
  // Calculate progress percentage
  program.progress = totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0;
  
  // Check if all workouts in current phase are completed
  const currentPhase = program.phases[program.currentPhase];
  const phaseCompleted = currentPhase.workouts.every(workout => workout.completed);
  
  // Advance to next phase if current is completed and there is a next phase
  if (phaseCompleted && program.currentPhase < program.phases.length - 1) {
    program.currentPhase++;
  }
  
  // Check if program is completed
  program.completed = program.progress === 100;
  
  return program;
};

// Get scheduled workouts for a date
export const getScheduledWorkouts = (date) => {
  const activePrograms = getActivePrograms();
  const scheduledWorkouts = [];
  
  const targetDate = new Date(date);
  const day = targetDate.getDay() || 7; // Convert 0 (Sunday) to 7
  
  activePrograms.forEach(program => {
    const phase = program.phases[program.currentPhase];
    
    phase.workouts.forEach(workout => {
      if (workout.scheduledDay === day && !workout.completed) {
        scheduledWorkouts.push({
          programId: program.id,
          programName: program.name,
          phaseId: phase.id,
          phaseName: phase.name,
          workout: { ...workout }
        });
      }
    });
  });
  
  return scheduledWorkouts;
};