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
    id: 'strength-12week',
    name: '12-Week Strength Foundation',
    description: 'Progressive strength training program to build a solid foundation for all fitness goals',
    phases: [
      {
        id: 'str-phase-1',
        name: 'Adaptation',
        description: 'Build movement patterns and basic strength with fundamental exercises',
        duration: 28, // 4 weeks
        workouts: [
          {
            id: 'str-p1-w1',
            name: 'Full Body Basics A',
            description: 'Fundamental movement patterns focusing on proper form',
            type: 'Weight Training',
            targetDuration: 45,
            scheduledDay: 1
          },
          {
            id: 'str-p1-w2',
            name: 'Mobility & Recovery',
            description: 'Stretching and mobility work to improve range of motion',
            type: 'Yoga',
            targetDuration: 30,
            scheduledDay: 2
          },
          {
            id: 'str-p1-w3',
            name: 'Full Body Basics B',
            description: 'Second full body session with different movement patterns',
            type: 'Weight Training',
            targetDuration: 45,
            scheduledDay: 3
          },
          {
            id: 'str-p1-w4',
            name: 'Light Cardio',
            description: 'Low intensity steady state cardio to build aerobic base',
            type: 'Walking',
            targetDuration: 30,
            targetDistance: 3,
            scheduledDay: 4
          },
          {
            id: 'str-p1-w5',
            name: 'Full Body Basics C',
            description: 'Third full body session focusing on different angles',
            type: 'Weight Training',
            targetDuration: 45,
            scheduledDay: 5
          },
          {
            id: 'str-p1-w6',
            name: 'Active Recovery',
            description: 'Light activity to promote recovery and reduce soreness',
            type: 'Walking',
            targetDuration: 40,
            targetDistance: 4,
            scheduledDay: 7
          }
        ]
      },
      {
        id: 'str-phase-2',
        name: 'Hypertrophy',
        description: 'Focus on muscle growth with higher volume training',
        duration: 28, // 4 weeks
        workouts: [
          {
            id: 'str-p2-w1',
            name: 'Upper Body Push',
            description: 'Chest, shoulders, and triceps with moderate weights and higher reps',
            type: 'Weight Training',
            targetDuration: 50,
            scheduledDay: 1
          },
          {
            id: 'str-p2-w2',
            name: 'Lower Body',
            description: 'Quads, hamstrings, and calves with moderate weights and higher reps',
            type: 'Weight Training',
            targetDuration: 50,
            scheduledDay: 2
          },
          {
            id: 'str-p2-w3',
            name: 'Recovery & Mobility',
            description: 'Active recovery with stretching and mobility work',
            type: 'Yoga',
            targetDuration: 40,
            scheduledDay: 3
          },
          {
            id: 'str-p2-w4',
            name: 'Upper Body Pull',
            description: 'Back and biceps with moderate weights and higher reps',
            type: 'Weight Training',
            targetDuration: 50,
            scheduledDay: 4
          },
          {
            id: 'str-p2-w5',
            name: 'Core & Cardio',
            description: 'Focused core work and moderate intensity cardio',
            type: 'HIIT',
            targetDuration: 40,
            scheduledDay: 5
          },
          {
            id: 'str-p2-w6',
            name: 'Full Body',
            description: 'Complete body workout hitting all major muscle groups',
            type: 'Weight Training',
            targetDuration: 60,
            scheduledDay: 7
          }
        ]
      },
      {
        id: 'str-phase-3',
        name: 'Strength',
        description: 'Build maximal strength with heavier weights and lower repetitions',
        duration: 28, // 4 weeks
        workouts: [
          {
            id: 'str-p3-w1',
            name: 'Lower Body Strength',
            description: 'Heavy compound lower body movements with focus on strength',
            type: 'Weight Training',
            targetDuration: 60,
            scheduledDay: 1
          },
          {
            id: 'str-p3-w2',
            name: 'Upper Body Push Strength',
            description: 'Heavy pressing movements for chest and shoulders',
            type: 'Weight Training',
            targetDuration: 60,
            scheduledDay: 3
          },
          {
            id: 'str-p3-w3',
            name: 'Active Recovery',
            description: 'Light cardio and mobility work',
            type: 'Walking',
            targetDuration: 45,
            targetDistance: 5,
            scheduledDay: 4
          },
          {
            id: 'str-p3-w4',
            name: 'Upper Body Pull Strength',
            description: 'Heavy pulling movements for back and arms',
            type: 'Weight Training',
            targetDuration: 60,
            scheduledDay: 5
          },
          {
            id: 'str-p3-w5',
            name: 'Conditioning',
            description: 'High intensity intervals to maintain cardiovascular fitness',
            type: 'HIIT',
            targetDuration: 30,
            scheduledDay: 6
          },
          {
            id: 'str-p3-w6',
            name: 'Full Body Integration',
            description: 'Complete body workout combining strength and hypertrophy',
            type: 'Weight Training',
            targetDuration: 75,
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
    id: 'yoga-flexibility',
    name: '8-Week Yoga & Flexibility',
    description: 'Comprehensive program to increase flexibility, balance, and mind-body awareness',
    phases: [
      {
        id: 'yoga-phase-1',
        name: 'Foundation',
        description: 'Building basic yoga practice and increasing range of motion',
        duration: 14, // 2 weeks
        workouts: [
          {
            id: 'yoga-p1-w1',
            name: 'Gentle Flow',
            description: 'Slow-paced sequence connecting breath with movement',
            type: 'Yoga',
            targetDuration: 30,
            scheduledDay: 1
          },
          {
            id: 'yoga-p1-w2',
            name: 'Standing Poses',
            description: 'Focus on foundational standing postures for strength and stability',
            type: 'Yoga',
            targetDuration: 30,
            scheduledDay: 3
          },
          {
            id: 'yoga-p1-w3',
            name: 'Stretch & Restore',
            description: 'Gentle stretching and restorative poses for deep relaxation',
            type: 'Yoga',
            targetDuration: 40,
            scheduledDay: 5
          },
          {
            id: 'yoga-p1-w4',
            name: 'Balance Practice',
            description: 'Focusing on balance poses and core stability',
            type: 'Yoga',
            targetDuration: 30,
            scheduledDay: 7
          }
        ]
      },
      {
        id: 'yoga-phase-2',
        name: 'Progression',
        description: 'Increasing intensity and duration of practices',
        duration: 28, // 4 weeks
        workouts: [
          {
            id: 'yoga-p2-w1',
            name: 'Power Yoga',
            description: 'More dynamic flow linking breath and movement',
            type: 'Yoga',
            targetDuration: 45,
            scheduledDay: 1
          },
          {
            id: 'yoga-p2-w2',
            name: 'Deep Stretch',
            description: 'Holding poses longer to increase flexibility',
            type: 'Yoga',
            targetDuration: 40,
            scheduledDay: 3
          },
          {
            id: 'yoga-p2-w3',
            name: 'Core Flow',
            description: 'Focus on abdominal strength and stability',
            type: 'Yoga',
            targetDuration: 30,
            scheduledDay: 5
          },
          {
            id: 'yoga-p2-w4',
            name: 'Full Practice',
            description: 'Complete yoga session incorporating all elements',
            type: 'Yoga',
            targetDuration: 60,
            scheduledDay: 7
          }
        ]
      },
      {
        id: 'yoga-phase-3',
        name: 'Integration',
        description: 'Combining all elements into a full practice',
        duration: 14, // 2 weeks
        workouts: [
          {
            id: 'yoga-p3-w1',
            name: 'Advanced Flow',
            description: 'Challenging sequences to test your progress',
            type: 'Yoga',
            targetDuration: 60,
            scheduledDay: 1
          },
          {
            id: 'yoga-p3-w2',
            name: 'Inversion Practice',
            description: 'Working on inversions and arm balances',
            type: 'Yoga',
            targetDuration: 45,
            scheduledDay: 3
          },
          {
            id: 'yoga-p3-w3',
            name: 'Mindful Movement',
            description: 'Slow, intentional practice focusing on alignment',
            type: 'Yoga',
            targetDuration: 45,
            scheduledDay: 5
          },
          {
            id: 'yoga-p3-w4',
            name: 'Complete Practice',
            description: 'Full yoga practice integrating all learned techniques',
            type: 'Yoga',
            targetDuration: 75,
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
    id: 'weight-loss-90day',
    name: '90-Day Weight Loss Program',
    description: 'Comprehensive program combining cardio, strength, and nutrition for sustainable weight loss',
    phases: [
      {
        id: 'wl-phase-1',
        name: 'Foundation',
        description: 'Building healthy habits and establishing baseline fitness',
        duration: 30, // 30 days
        workouts: [
          {
            id: 'wl-p1-w1',
            name: 'Walking Session',
            description: 'Moderate pace walking to build aerobic base',
            type: 'Walking',
            targetDistance: 3,
            targetDuration: 30,
            scheduledDay: 1
          },
          {
            id: 'wl-p1-w2',
            name: 'Basic Strength',
            description: 'Full body strength workout with bodyweight and light weights',
            type: 'Weight Training',
            targetDuration: 30,
            scheduledDay: 2
          },
          {
            id: 'wl-p1-w3',
            name: 'Recovery Walk',
            description: 'Easy-paced walk to promote recovery',
            type: 'Walking',
            targetDistance: 2,
            targetDuration: 20,
            scheduledDay: 3
          },
          {
            id: 'wl-p1-w4',
            name: 'Intro to HIIT',
            description: 'Beginner-friendly intervals with bodyweight exercises',
            type: 'HIIT',
            targetDuration: 20,
            scheduledDay: 4
          },
          {
            id: 'wl-p1-w5',
            name: 'Mobility & Flexibility',
            description: 'Stretching and mobility work to improve range of motion',
            type: 'Yoga',
            targetDuration: 30,
            scheduledDay: 5
          },
          {
            id: 'wl-p1-w6',
            name: 'Longer Walk',
            description: 'Sustained walking to build endurance',
            type: 'Walking',
            targetDistance: 4,
            targetDuration: 45,
            scheduledDay: 6
          },
          {
            id: 'wl-p1-w7',
            name: 'Active Recovery',
            description: 'Light activity to promote recovery',
            type: 'Walking',
            targetDistance: 2,
            targetDuration: 20,
            scheduledDay: 7
          }
        ]
      },
      {
        id: 'wl-phase-2',
        name: 'Progression',
        description: 'Increasing workout intensity and duration for greater calorie burn',
        duration: 30, // 30 days
        workouts: [
          {
            id: 'wl-p2-w1',
            name: 'Interval Running',
            description: 'Alternating running and walking intervals',
            type: 'Running',
            targetDistance: 3,
            targetDuration: 30,
            scheduledDay: 1
          },
          {
            id: 'wl-p2-w2',
            name: 'Circuit Training',
            description: 'Full body strength circuit with minimal rest',
            type: 'Weight Training',
            targetDuration: 40,
            scheduledDay: 2
          },
          {
            id: 'wl-p2-w3',
            name: 'Steady State Cardio',
            description: 'Moderate intensity sustained cardio',
            type: 'Cycling',
            targetDistance: 10,
            targetDuration: 30,
            scheduledDay: 3
          },
          {
            id: 'wl-p2-w4',
            name: 'HIIT Session',
            description: 'High intensity intervals for maximum calorie burn',
            type: 'HIIT',
            targetDuration: 30,
            scheduledDay: 4
          },
          {
            id: 'wl-p2-w5',
            name: 'Active Recovery',
            description: 'Yoga and stretching to promote recovery',
            type: 'Yoga',
            targetDuration: 30,
            scheduledDay: 5
          },
          {
            id: 'wl-p2-w6',
            name: 'Resistance Training',
            description: 'Focus on resistance exercises for strength building',
            type: 'Weight Training',
            targetDuration: 45,
            scheduledDay: 6
          },
          {
            id: 'wl-p2-w7',
            name: 'Long Cardio Session',
            description: 'Extended low intensity steady state cardio',
            type: 'Walking',
            targetDistance: 6,
            targetDuration: 60,
            scheduledDay: 7
          }
        ]
      },
      {
        id: 'wl-phase-3',
        name: 'Intensity',
        description: 'Peak phase with challenging workouts for maximum results',
        duration: 30, // 30 days
        workouts: [
          {
            id: 'wl-p3-w1',
            name: 'Interval Training',
            description: 'Advanced interval training with challenging work periods',
            type: 'Running',
            targetDistance: 5,
            targetDuration: 40,
            scheduledDay: 1
          },
          {
            id: 'wl-p3-w2',
            name: 'Heavy Strength Day',
            description: 'Focusing on compound movements for maximum calorie burn',
            type: 'Weight Training',
            targetDuration: 50,
            scheduledDay: 2
          },
          {
            id: 'wl-p3-w3',
            name: 'Mixed Cardio',
            description: 'Combining different cardio modalities for a challenging workout',
            type: 'Cycling',
            targetDistance: 15,
            targetDuration: 45,
            scheduledDay: 3
          },
          {
            id: 'wl-p3-w4',
            name: 'Tabata Challenge',
            description: 'Maximum intensity intervals with minimal rest',
            type: 'HIIT',
            targetDuration: 35,
            scheduledDay: 4
          },
          {
            id: 'wl-p3-w5',
            name: 'Recovery Day',
            description: 'Focused recovery with stretching and mobility',
            type: 'Yoga',
            targetDuration: 40,
            scheduledDay: 5
          },
          {
            id: 'wl-p3-w6',
            name: 'Metabolic Resistance',
            description: 'Resistance training with metabolic conditioning',
            type: 'Weight Training',
            targetDuration: 60,
            scheduledDay: 6
          },
          {
            id: 'wl-p3-w7',
            name: 'Endurance Challenge',
            description: 'Long duration aerobic training to test endurance',
            type: 'Running',
            targetDistance: 8,
            targetDuration: 60,
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
  },
  {
    id: 'marathon-16week',
    name: '16-Week Marathon Training',
    description: 'Comprehensive marathon preparation for intermediate to advanced runners',
    phases: [
      {
        id: 'mar-phase-1',
        name: 'Base Building',
        description: 'Build aerobic base and endurance with consistent mileage',
        duration: 28, // 4 weeks
        workouts: [
          {
            id: 'mar-p1-w1',
            name: 'Easy Run',
            description: 'Conversational pace run to build aerobic base',
            type: 'Running',
            targetDistance: 8,
            targetDuration: 60,
            scheduledDay: 1
          },
          {
            id: 'mar-p1-w2',
            name: 'Speed Work',
            description: '6-8 x 400m repeats at 5K pace with equal recovery',
            type: 'Running',
            targetDistance: 6,
            targetDuration: 45,
            scheduledDay: 3
          },
          {
            id: 'mar-p1-w3',
            name: 'Recovery Run',
            description: 'Very easy pace to promote recovery',
            type: 'Running',
            targetDistance: 5,
            targetDuration: 40,
            scheduledDay: 4
          },
          {
            id: 'mar-p1-w4',
            name: 'Tempo Run',
            description: 'Sustained effort at half marathon pace',
            type: 'Running',
            targetDistance: 7,
            targetDuration: 50,
            scheduledDay: 5
          },
          {
            id: 'mar-p1-w5',
            name: 'Cross Training',
            description: 'Low impact cross training to build fitness while recovering',
            type: 'Cycling',
            targetDuration: 45,
            scheduledDay: 6
          },
          {
            id: 'mar-p1-w6',
            name: 'Long Run',
            description: 'Sustained easy effort to build endurance',
            type: 'Running',
            targetDistance: 12,
            targetDuration: 100,
            scheduledDay: 7
          }
        ]
      },
      {
        id: 'mar-phase-2',
        name: 'Strength',
        description: 'Build specific marathon strength with longer tempo efforts',
        duration: 28, // 4 weeks
        workouts: [
          {
            id: 'mar-p2-w1',
            name: 'Easy Run',
            description: 'Recovery run at easy effort',
            type: 'Running',
            targetDistance: 8,
            targetDuration: 60,
            scheduledDay: 1
          },
          {
            id: 'mar-p2-w2',
            name: 'Hill Repeats',
            description: '8-10 hill repeats of 60-90 seconds with jog down recovery',
            type: 'Running',
            targetDistance: 8,
            targetDuration: 60,
            scheduledDay: 3
          },
          {
            id: 'mar-p2-w3',
            name: 'Recovery Run',
            description: 'Very easy pace to promote recovery',
            type: 'Running',
            targetDistance: 6,
            targetDuration: 45,
            scheduledDay: 4
          },
          {
            id: 'mar-p2-w4',
            name: 'Marathon Pace Run',
            description: '8 miles with 5 miles at marathon pace',
            type: 'Running',
            targetDistance: 13,
            targetDuration: 90,
            scheduledDay: 5
          },
          {
            id: 'mar-p2-w5',
            name: 'Strength Training',
            description: 'Runner-specific strength workout',
            type: 'Weight Training',
            targetDuration: 40,
            scheduledDay: 6
          },
          {
            id: 'mar-p2-w6',
            name: 'Long Run',
            description: 'Building endurance with longer distance',
            type: 'Running',
            targetDistance: 16,
            targetDuration: 140,
            scheduledDay: 7
          }
        ]
      },
      {
        id: 'mar-phase-3',
        name: 'Peak Training',
        description: 'Peak mileage and marathon-specific workouts',
        duration: 28, // 4 weeks
        workouts: [
          {
            id: 'mar-p3-w1',
            name: 'Recovery Run',
            description: 'Easy effort after long run',
            type: 'Running',
            targetDistance: 6,
            targetDuration: 50,
            scheduledDay: 1
          },
          {
            id: 'mar-p3-w2',
            name: 'Intervals',
            description: '5-6 x 1 mile repeats at 10K pace with 3 min jog recovery',
            type: 'Running',
            targetDistance: 10,
            targetDuration: 75,
            scheduledDay: 3
          },
          {
            id: 'mar-p3-w3',
            name: 'Mid-week Medium Run',
            description: 'Steady state run at moderate effort',
            type: 'Running',
            targetDistance: 8,
            targetDuration: 65,
            scheduledDay: 4
          },
          {
            id: 'mar-p3-w4',
            name: 'Marathon Pace Run',
            description: '10 miles with 7 miles at marathon pace',
            type: 'Running',
            targetDistance: 10,
            targetDuration: 80,
            scheduledDay: 5
          },
          {
            id: 'mar-p3-w5',
            name: 'Easy Recovery Run',
            description: 'Very light effort before long run',
            type: 'Running',
            targetDistance: 4,
            targetDuration: 30,
            scheduledDay: 6
          },
          {
            id: 'mar-p3-w6',
            name: 'Long Run',
            description: 'Peak long run with marathon pace segments',
            type: 'Running',
            targetDistance: 20,
            targetDuration: 180,
            scheduledDay: 7
          }
        ]
      },
      {
        id: 'mar-phase-4',
        name: 'Taper',
        description: 'Reduce volume while maintaining intensity to peak for marathon',
        duration: 21, // 3 weeks
        workouts: [
          {
            id: 'mar-p4-w1',
            name: 'Easy Run',
            description: 'Recovery at easy effort',
            type: 'Running',
            targetDistance: 5,
            targetDuration: 40,
            scheduledDay: 1
          },
          {
            id: 'mar-p4-w2',
            name: 'Marathon Pace Intervals',
            description: '3 x 2 miles at marathon pace with 3 min jog',
            type: 'Running',
            targetDistance: 8,
            targetDuration: 65,
            scheduledDay: 3
          },
          {
            id: 'mar-p4-w3',
            name: 'Easy Run',
            description: 'Very easy recovery run',
            type: 'Running',
            targetDistance: 4,
            targetDuration: 30,
            scheduledDay: 4
          },
          {
            id: 'mar-p4-w4',
            name: 'Race Rehearsal',
            description: '6 miles with 4 at marathon pace',
            type: 'Running',
            targetDistance: 6,
            targetDuration: 50,
            scheduledDay: 5
          },
          {
            id: 'mar-p4-w5',
            name: 'Shake Out Run',
            description: 'Very easy run with 4-6 strides',
            type: 'Running',
            targetDistance: 3,
            targetDuration: 25,
            scheduledDay: 6
          },
          {
            id: 'mar-p4-w6',
            name: 'Marathon',
            description: 'Race day - trust your training!',
            type: 'Running',
            targetDistance: 42.2,
            targetDuration: 240,
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
    id: 'triathlon-sprint',
    name: '12-Week Sprint Triathlon',
    description: 'Balanced training program for swim, bike, and run to prepare for a sprint triathlon',
    phases: [
      {
        id: 'tri-phase-1',
        name: 'Foundation',
        description: 'Build base fitness in all three disciplines',
        duration: 28, // 4 weeks
        workouts: [
          {
            id: 'tri-p1-w1',
            name: 'Swimming Technique',
            description: 'Focus on swim technique with drills and short intervals',
            type: 'Swimming',
            targetDistance: 1,
            targetDuration: 30,
            scheduledDay: 1
          },
          {
            id: 'tri-p1-w2',
            name: 'Easy Run',
            description: 'Building running base at conversation pace',
            type: 'Running',
            targetDistance: 3,
            targetDuration: 30,
            scheduledDay: 2
          },
          {
            id: 'tri-p1-w3',
            name: 'Bike Endurance',
            description: 'Steady effort bike ride to build endurance',
            type: 'Cycling',
            targetDistance: 12,
            targetDuration: 45,
            scheduledDay: 3
          },
          {
            id: 'tri-p1-w4',
            name: 'Strength & Core',
            description: 'Full body strength with emphasis on core',
            type: 'Weight Training',
            targetDuration: 30,
            scheduledDay: 4
          },
          {
            id: 'tri-p1-w5',
            name: 'Swim Distance',
            description: 'Longer swim to build endurance',
            type: 'Swimming',
            targetDistance: 1.2,
            targetDuration: 40,
            scheduledDay: 5
          },
          {
            id: 'tri-p1-w6',
            name: 'Brick Workout',
            description: 'Bike followed immediately by short run',
            type: 'Cycling',
            targetDistance: 10,
            targetDuration: 60,
            scheduledDay: 6
          },
          {
            id: 'tri-p1-w7',
            name: 'Recovery',
            description: 'Active recovery with stretching and light activity',
            type: 'Yoga',
            targetDuration: 30,
            scheduledDay: 7
          }
        ]
      },
      {
        id: 'tri-phase-2',
        name: 'Build',
        description: 'Increase volume and intensity in all disciplines',
        duration: 28, // 4 weeks
        workouts: [
          {
            id: 'tri-p2-w1',
            name: 'Swim Intervals',
            description: 'Speed work in the pool with structured intervals',
            type: 'Swimming',
            targetDistance: 1.5,
            targetDuration: 45,
            scheduledDay: 1
          },
          {
            id: 'tri-p2-w2',
            name: 'Run Speed',
            description: 'Interval training to improve running pace',
            type: 'Running',
            targetDistance: 5,
            targetDuration: 40,
            scheduledDay: 2
          },
          {
            id: 'tri-p2-w3',
            name: 'Bike Intervals',
            description: 'Structured bike intervals to build power',
            type: 'Cycling',
            targetDistance: 15,
            targetDuration: 50,
            scheduledDay: 3
          },
          {
            id: 'tri-p2-w4',
            name: 'Strength Training',
            description: 'Functional strength for triathlon performance',
            type: 'Weight Training',
            targetDuration: 45,
            scheduledDay: 4
          },
          {
            id: 'tri-p2-w5',
            name: 'Open Water Swim',
            description: 'Practice in open water conditions if possible',
            type: 'Swimming',
            targetDistance: 1.5,
            targetDuration: 45,
            scheduledDay: 5
          },
          {
            id: 'tri-p2-w6',
            name: 'Long Brick',
            description: 'Longer bike followed by transition run',
            type: 'Cycling',
            targetDistance: 20,
            targetDuration: 90,
            scheduledDay: 6
          },
          {
            id: 'tri-p2-w7',
            name: 'Active Recovery',
            description: 'Light activity and mobility work',
            type: 'Yoga',
            targetDuration: 30,
            scheduledDay: 7
          }
        ]
      },
      {
        id: 'tri-phase-3',
        name: 'Peak & Taper',
        description: 'Final race-specific preparation and taper',
        duration: 28, // 4 weeks
        workouts: [
          {
            id: 'tri-p3-w1',
            name: 'Race Simulation Swim',
            description: 'Practice race pace and sighting',
            type: 'Swimming',
            targetDistance: 0.75,
            targetDuration: 30,
            scheduledDay: 1
          },
          {
            id: 'tri-p3-w2',
            name: 'Run Intervals',
            description: 'Fast intervals at race pace effort',
            type: 'Running',
            targetDistance: 4,
            targetDuration: 30,
            scheduledDay: 2
          },
          {
            id: 'tri-p3-w3',
            name: 'Bike Race Pace',
            description: 'Sustained efforts at race intensity',
            type: 'Cycling',
            targetDistance: 15,
            targetDuration: 45,
            scheduledDay: 3
          },
          {
            id: 'tri-p3-w4',
            name: 'Transition Practice',
            description: 'Focus on quick transitions between disciplines',
            type: 'HIIT',
            targetDuration: 40,
            scheduledDay: 4
          },
          {
            id: 'tri-p3-w5',
            name: 'Easy Swim',
            description: 'Light swim focusing on technique',
            type: 'Swimming',
            targetDistance: 0.5,
            targetDuration: 20,
            scheduledDay: 5
          },
          {
            id: 'tri-p3-w6',
            name: 'Mini Triathlon',
            description: 'Practice all three disciplines at race pace but reduced distance',
            type: 'Swimming',
            targetDuration: 60,
            scheduledDay: 6
          },
          {
            id: 'tri-p3-w7',
            name: 'Sprint Triathlon',
            description: 'Race day! Apply all your training',
            type: 'Swimming',
            targetDuration: 90,
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