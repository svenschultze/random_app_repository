/**
 * Email generator utility functions
 * Generates random email data for demo purposes
 */

// Constants for generating realistic email content
const SENDERS = [
  { name: 'John Smith', email: 'john.smith@example.com' },
  { name: 'Sarah Johnson', email: 'sarah.j@company.co' },
  { name: 'Alex Wong', email: 'alex@techcorp.com' },
  { name: 'Maria Garcia', email: 'maria.g@startup.io' },
  { name: 'Team HR', email: 'hr@company.org' },
  { name: 'Billing Department', email: 'billing@service.net' },
  { name: 'Newsletter', email: 'news@updates.com' },
  { name: 'Project Manager', email: 'pm@workspace.co' }
];

const SUBJECTS = [
  'Meeting tomorrow at 10 AM',
  'Project update: Q1 Results',
  'Your subscription renewal',
  'Action required: Please review documents',
  'Weekly newsletter',
  'Invitation: Team building event',
  'Holiday schedule announcement',
  'Your order has shipped',
  'Password reset request',
  'New feature announcement',
  'Feedback requested: Recent webinar',
  'Account security alert'
];

const EMAIL_BODIES = [
  'Hi there,\n\nJust wanted to confirm our meeting for tomorrow at 10 AM. Let me know if you need to reschedule.\n\nBest regards,\n{sender}',
  'Hello,\n\nI\'m reaching out to share the Q1 results for our project. We\'ve exceeded our targets by 15% and the client is very pleased with our progress.\n\nPlease review the attached report and let me know if you have any questions.\n\nThanks,\n{sender}',
  'Dear valued customer,\n\nYour subscription with us is due for renewal on {date}. To continue enjoying uninterrupted service, please log in to your account and update your payment information.\n\nThank you,\n{sender}',
  'Hi team,\n\nI\'ve shared some important documents that need your review by end of day Friday. Your input is essential for moving forward with this initiative.\n\nRegards,\n{sender}',
  'Hello,\n\nHere\'s your weekly update on industry news and events:\n\n- New regulatory changes coming next month\n- Industry conference registration now open\n- Recent market trends and analysis\n\nStay informed!\n{sender}',
  'Greetings,\n\nYou\'re invited to our annual team building event on {date}. Activities include workshops, team challenges, and a catered lunch.\n\nPlease RSVP by Wednesday.\n\nLooking forward to seeing you,\n{sender}'
];

/**
 * Generate a random date within the specified range
 * @param {number} daysBack - Maximum number of days in the past
 * @returns {Date} Random date
 */
function getRandomDate(daysBack = 14) {
  const today = new Date();
  const randomDaysBack = Math.floor(Math.random() * daysBack);
  const randomHours = Math.floor(Math.random() * 24);
  const randomMinutes = Math.floor(Math.random() * 60);
  
  const date = new Date(today);
  date.setDate(today.getDate() - randomDaysBack);
  date.setHours(randomHours, randomMinutes, 0, 0);
  
  return date;
}

/**
 * Generate a random unique ID for emails
 * @returns {string} Unique ID
 */
function generateId() {
  return 'email_' + Math.random().toString(36).substring(2, 11);
}

/**
 * Get random element from array
 * @param {Array} array - Source array
 * @returns {*} Random element
 */
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate a single random email
 * @returns {Object} Email object with relevant properties
 */
export function generateRandomEmail() {
  const sender = getRandomElement(SENDERS);
  const timestamp = getRandomDate();
  const formattedDate = timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  // Replace placeholders in email body
  let body = getRandomElement(EMAIL_BODIES);
  body = body.replace('{sender}', sender.name).replace('{date}', formattedDate);
  
  return {
    id: generateId(),
    sender: sender,
    subject: getRandomElement(SUBJECTS),
    body: body,
    timestamp: timestamp,
    read: Math.random() > 0.5, // 50% chance of being read
    starred: Math.random() > 0.7, // 30% chance of being starred
    hasAttachment: Math.random() > 0.8, // 20% chance of having attachment
    labels: generateRandomLabels()
  };
}

/**
 * Generate random email labels
 * @returns {Array} Array of labels
 */
function generateRandomLabels() {
  const labels = ['Work', 'Personal', 'Important', 'Promotion', 'Social', 'Updates'];
  const numLabels = Math.floor(Math.random() * 2); // 0 or 1 labels
  
  if (numLabels === 0) return [];
  
  const selectedLabels = [];
  const labelIndex = Math.floor(Math.random() * labels.length);
  selectedLabels.push(labels[labelIndex]);
  
  return selectedLabels;
}

/**
 * Group emails by time period (Today, Yesterday, Earlier)
 * @param {Array} emails - List of email objects
 * @returns {Object} Grouped emails
 */
function groupEmailsByTime(emails) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const result = {
    today: [],
    yesterday: [],
    earlier: []
  };
  
  emails.forEach(email => {
    const emailDate = new Date(email.timestamp);
    emailDate.setHours(0, 0, 0, 0);
    
    if (emailDate.getTime() === today.getTime()) {
      result.today.push(email);
    } else if (emailDate.getTime() === yesterday.getTime()) {
      result.yesterday.push(email);
    } else {
      result.earlier.push(email);
    }
  });
  
  return result;
}

/**
 * Generate a list of random emails grouped by time
 * @param {number} count - Number of emails to generate
 * @returns {Object} Emails grouped by time period
 */
export function generateEmailList(count = 20) {
  const emails = [];
  
  for (let i = 0; i < count; i++) {
    emails.push(generateRandomEmail());
  }
  
  // Sort by timestamp (newest first)
  emails.sort((a, b) => b.timestamp - a.timestamp);
  
  return groupEmailsByTime(emails);
}

/**
 * Get formatted date string for display
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
export function formatEmailDate(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const emailDate = new Date(date);
  const emailDateOnly = new Date(emailDate);
  emailDateOnly.setHours(0, 0, 0, 0);
  
  if (emailDateOnly.getTime() === today.getTime()) {
    return emailDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } else if (emailDateOnly.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  } else {
    return emailDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}