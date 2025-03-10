// Class/Event Model
export class ClassEvent {
  constructor(data = {}) {
    this.id = data.id || crypto.randomUUID();
    this.title = data.title || '';
    this.subject = data.subject || '';
    this.instructor = data.instructor || '';
    this.location = data.location || '';
    this.startTime = data.startTime || '';
    this.endTime = data.endTime || '';
    this.day = data.day || '';
    this.date = data.date || '';
    this.recurring = data.recurring || false;
    this.recurrencePattern = data.recurrencePattern || '';
    this.color = data.color || this.generateRandomColor();
    this.notes = data.notes || '';
    this.isSpecialEvent = data.isSpecialEvent || false;
    this.isCancelled = data.isCancelled || false;
  }

  generateRandomColor() {
    const colors = [
      '#4a6fa5', // Blue
      '#ff6b6b', // Red
      '#20c997', // Teal
      '#fd7e14', // Orange
      '#6f42c1', // Purple
      '#28a745', // Green
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

// Sample data for demo
export const sampleClasses = [
  new ClassEvent({
    title: 'Introduction to Computer Science',
    subject: 'CS101',
    instructor: 'Dr. Smith',
    location: 'Room 302',
    startTime: '09:00',
    endTime: '10:30',
    day: 'Monday',
    date: '2025-03-10',
    recurring: true,
    recurrencePattern: 'weekly',
    notes: 'Bring laptop and textbook',
  }),
  new ClassEvent({
    title: 'Calculus I',
    subject: 'MATH201',
    instructor: 'Prof. Johnson',
    location: 'Math Building 101',
    startTime: '11:00',
    endTime: '12:30',
    day: 'Monday',
    date: '2025-03-10',
    recurring: true,
    recurrencePattern: 'weekly',
  }),
  new ClassEvent({
    title: 'Physics Lab',
    subject: 'PHY150',
    instructor: 'Dr. Garcia',
    location: 'Science Lab 3',
    startTime: '13:30',
    endTime: '15:00',
    day: 'Monday',
    date: '2025-03-10',
    recurring: true,
    recurrencePattern: 'weekly',
    notes: 'Wear closed-toe shoes',
  }),
  new ClassEvent({
    title: 'English Literature',
    subject: 'ENG210',
    instructor: 'Dr. Williams',
    location: 'Humanities 405',
    startTime: '09:30',
    endTime: '11:00',
    day: 'Tuesday',
    date: '2025-03-11',
    recurring: true,
    recurrencePattern: 'weekly',
    notes: 'Essay due next week',
  }),
  new ClassEvent({
    title: 'Economics 101',
    subject: 'ECON101',
    instructor: 'Prof. Chen',
    location: 'Business Building 204',
    startTime: '13:00',
    endTime: '14:30',
    day: 'Tuesday',
    date: '2025-03-11',
    recurring: true,
    recurrencePattern: 'weekly',
  }),
  new ClassEvent({
    title: 'Chemistry',
    subject: 'CHEM110',
    instructor: 'Dr. Patel',
    location: 'Science Building 101',
    startTime: '15:00',
    endTime: '16:30',
    day: 'Tuesday',
    date: '2025-03-11',
    recurring: true,
    recurrencePattern: 'weekly',
  }),
  new ClassEvent({
    title: 'Data Structures',
    subject: 'CS201',
    instructor: 'Dr. Brown',
    location: 'CS Building 205',
    startTime: '09:00',
    endTime: '10:30',
    day: 'Wednesday',
    date: '2025-03-12',
    recurring: true,
    recurrencePattern: 'weekly',
    notes: 'Project due in two weeks',
  }),
  new ClassEvent({
    title: 'Office Hours',
    subject: 'CS101',
    instructor: 'Dr. Smith',
    location: 'CS Building 310',
    startTime: '13:00',
    endTime: '14:00',
    day: 'Wednesday',
    date: '2025-03-12',
    recurring: true,
    recurrencePattern: 'weekly',
    notes: 'Drop-in session for questions',
  }),
  new ClassEvent({
    title: 'Study Group - Math',
    subject: 'MATH201',
    location: 'Library Room 2',
    startTime: '16:00',
    endTime: '18:00',
    day: 'Wednesday',
    date: '2025-03-12',
    recurring: true,
    recurrencePattern: 'weekly',
    notes: 'Prepare questions beforehand',
    isSpecialEvent: true,
  }),
  new ClassEvent({
    title: 'Psychology',
    subject: 'PSY101',
    instructor: 'Dr. Lee',
    location: 'Social Sciences 302',
    startTime: '11:00',
    endTime: '12:30',
    day: 'Thursday',
    date: '2025-03-13',
    recurring: true,
    recurrencePattern: 'weekly',
  }),
  new ClassEvent({
    title: 'Midterm Exam',
    subject: 'MATH201',
    instructor: 'Prof. Johnson',
    location: 'Math Building 101',
    startTime: '14:00',
    endTime: '16:00',
    day: 'Thursday',
    date: '2025-03-13',
    recurring: false,
    notes: 'Covers chapters 1-5. Bring calculator.',
    isSpecialEvent: true,
  }),
  new ClassEvent({
    title: 'Art History',
    subject: 'ART150',
    instructor: 'Prof. Kim',
    location: 'Arts Center 103',
    startTime: '10:00',
    endTime: '11:30',
    day: 'Friday',
    date: '2025-03-14',
    recurring: true,
    recurrencePattern: 'weekly',
    notes: 'Museum visit next week',
  }),
  new ClassEvent({
    title: 'Biology',
    subject: 'BIO110',
    instructor: 'Dr. Martinez',
    location: 'Science Building 203',
    startTime: '13:00',
    endTime: '14:30',
    day: 'Friday',
    date: '2025-03-14',
    recurring: true,
    recurrencePattern: 'weekly',
    isCancelled: true,
    notes: 'Class cancelled due to faculty meeting',
  }),
  new ClassEvent({
    title: 'Computer Lab',
    subject: 'CS101',
    instructor: 'TA Wilson',
    location: 'CS Lab 105',
    startTime: '15:00',
    endTime: '16:30',
    day: 'Friday',
    date: '2025-03-14',
    recurring: true,
    recurrencePattern: 'weekly',
  }),
];

// Helper function to get classes for a specific day
export function getClassesForDay(day) {
  return sampleClasses.filter(c => c.day === day);
}

// Helper function to get classes for a specific date
export function getClassesForDate(date) {
  return sampleClasses.filter(c => c.date === date);
}

// Helper function to get classes for today
export function getClassesForToday() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  const dayName = days[today.getDay()];
  return getClassesForDay(dayName);
}

// Get class by ID
export function getClassById(id) {
  return sampleClasses.find(c => c.id === id) || null;
}