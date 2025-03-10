// Notification Model
export class Notification {
  constructor(data = {}) {
    this.id = data.id || crypto.randomUUID();
    this.title = data.title || '';
    this.message = data.message || '';
    this.eventId = data.eventId || null;
    this.type = data.type || 'reminder'; // reminder, cancellation, update, etc.
    this.timestamp = data.timestamp || new Date().toISOString();
    this.isRead = data.isRead || false;
    this.priority = data.priority || 'normal'; // low, normal, high
  }
}

// Sample notifications for demo
export const sampleNotifications = [
  new Notification({
    title: 'Class Starting Soon',
    message: 'Introduction to Computer Science starts in 15 minutes in Room 302',
    eventId: '1',
    type: 'reminder',
    priority: 'high',
  }),
  new Notification({
    title: 'Class Cancelled',
    message: 'Biology class on Friday has been cancelled',
    eventId: '13',
    type: 'cancellation',
    priority: 'high',
  }),
  new Notification({
    title: 'Midterm Exam Tomorrow',
    message: 'Don\'t forget your Math 201 midterm tomorrow at 2 PM',
    eventId: '11',
    type: 'reminder',
    priority: 'high',
  }),
  new Notification({
    title: 'Assignment Due',
    message: 'English Literature essay due next Tuesday',
    eventId: '4',
    type: 'reminder',
    priority: 'normal',
  }),
  new Notification({
    title: 'Room Change',
    message: 'Psychology class will be in room 305 instead of 302 this week',
    eventId: '10',
    type: 'update',
    priority: 'normal',
  }),
  new Notification({
    title: 'Office Hours Reminder',
    message: 'Dr. Smith has office hours today from 1-2 PM',
    eventId: '8',
    type: 'reminder',
    priority: 'low',
  }),
  new Notification({
    title: 'Study Group Tonight',
    message: 'Math study group meets tonight at 4 PM in Library Room 2',
    eventId: '9',
    type: 'reminder',
    priority: 'normal',
  }),
];

// Get all notifications, sorted by most recent first
export function getAllNotifications() {
  return [...sampleNotifications].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );
}

// Get unread notifications
export function getUnreadNotifications() {
  return getAllNotifications().filter(n => !n.isRead);
}

// Get notification by ID
export function getNotificationById(id) {
  return sampleNotifications.find(n => n.id === id) || null;
}

// Mark notification as read
export function markAsRead(id) {
  const notification = getNotificationById(id);
  if (notification) {
    notification.isRead = true;
  }
  return notification;
}

// Get notification count (for badge display)
export function getUnreadCount() {
  return getUnreadNotifications().length;
}