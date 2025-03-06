import { faker } from '@faker-js/faker';

// Generate a random user
const generateUser = () => {
  return {
    id: faker.string.uuid(),
    username: faker.internet.userName(),
    displayName: faker.person.fullName(),
    avatar: faker.image.avatar(),
    bio: faker.lorem.sentence(10),
    followers: faker.number.int({ min: 0, max: 10000 }),
    following: faker.number.int({ min: 0, max: 1000 }),
    joinDate: faker.date.past({ years: 3 }).toISOString(),
  };
};

// Generate a random thread (post)
const generateThread = (userId, parentId = null, replyCount = 0) => {
  const hasMedia = faker.datatype.boolean(0.3); // 30% chance to have media
  
  return {
    id: faker.string.uuid(),
    userId,
    parentId,
    content: faker.lorem.paragraph(),
    hasMedia,
    mediaUrl: hasMedia ? faker.image.url() : null,
    timestamp: faker.date.recent({ days: 14 }).toISOString(),
    likes: faker.number.int({ min: 0, max: 1000 }),
    replyCount,
    isLiked: faker.datatype.boolean(0.3), // 30% chance user has liked it
  };
};

// Generate random replies to a thread
const generateReplies = (parentThreadId, depth = 0, maxDepth = 3) => {
  if (depth >= maxDepth) return [];
  
  const replyCount = faker.number.int({ min: 0, max: depth === 0 ? 5 : 3 });
  const replies = [];
  
  for (let i = 0; i < replyCount; i++) {
    const userId = generateUser().id;
    const reply = generateThread(userId, parentThreadId, 0);
    
    // Recursively generate deeper replies with decreasing probability
    if (depth < maxDepth - 1 && faker.datatype.boolean(0.7 - depth * 0.2)) {
      const childReplies = generateReplies(reply.id, depth + 1, maxDepth);
      reply.replyCount = childReplies.length;
      replies.push(reply, ...childReplies);
    } else {
      replies.push(reply);
    }
  }
  
  return replies;
};

// Generate full threads with replies
const generateThreadsWithReplies = (count = 10) => {
  const threads = [];
  const usersMap = {};
  
  for (let i = 0; i < count; i++) {
    const user = generateUser();
    usersMap[user.id] = user;
    
    const thread = generateThread(user.id, null, faker.number.int({ min: 0, max: 10 }));
    threads.push(thread);
    
    const replies = generateReplies(thread.id);
    threads.push(...replies);
    
    // Add users for all replies
    replies.forEach(reply => {
      if (!usersMap[reply.userId]) {
        usersMap[reply.userId] = generateUser();
        usersMap[reply.userId].id = reply.userId;
      }
    });
  }
  
  return { threads, users: Object.values(usersMap) };
};

// Generate random notifications
const generateNotifications = (users, threads, count = 15) => {
  const notifications = [];
  const types = ['like', 'reply', 'mention', 'follow'];
  
  for (let i = 0; i < count; i++) {
    const type = types[faker.number.int({ min: 0, max: types.length - 1 })];
    const user = users[faker.number.int({ min: 0, max: users.length - 1 })];
    
    let notification = {
      id: faker.string.uuid(),
      type,
      userId: user.id,
      timestamp: faker.date.recent({ days: 7 }).toISOString(),
      isRead: faker.datatype.boolean(0.4), // 40% chance it's already read
    };
    
    // Add type-specific data
    switch (type) {
      case 'like':
      case 'reply':
        const thread = threads[faker.number.int({ min: 0, max: threads.length - 1 })];
        notification.threadId = thread.id;
        notification.content = thread.content;
        break;
      case 'mention':
        notification.threadId = threads[faker.number.int({ min: 0, max: threads.length - 1 })].id;
        notification.content = `@${user.username} ${faker.lorem.sentence()}`;
        break;
      case 'follow':
        notification.content = `started following you`;
        break;
    }
    
    notifications.push(notification);
  }
  
  // Sort by timestamp (newest first)
  return notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// Generate trending topics/hashtags
const generateTrendingTopics = (count = 10) => {
  const topics = [];
  
  for (let i = 0; i < count; i++) {
    topics.push({
      id: faker.string.uuid(),
      name: `#${faker.word.sample()}`,
      postCount: faker.number.int({ min: 100, max: 10000 }),
    });
  }
  
  return topics.sort((a, b) => b.postCount - a.postCount);
};

// Main function to generate all mock data
export const generateMockData = () => {
  const { threads, users } = generateThreadsWithReplies(20);
  const notifications = generateNotifications(users, threads);
  const trendingTopics = generateTrendingTopics();
  
  // Set current user as a random user from the list
  const currentUser = users[faker.number.int({ min: 0, max: users.length - 1 })];
  
  return {
    threads,
    users,
    notifications,
    trendingTopics,
    currentUser
  };
};

// Utility functions to work with the generated data
export const getThreadWithReplies = (threads, threadId) => {
  const mainThread = threads.find(t => t.id === threadId && !t.parentId);
  if (!mainThread) return null;
  
  const replies = threads.filter(t => t.parentId === threadId);
  
  // Get nested replies recursively
  const getReplies = (parentId) => {
    const directReplies = threads.filter(t => t.parentId === parentId);
    return directReplies.map(reply => ({
      ...reply,
      replies: getReplies(reply.id)
    }));
  };
  
  return {
    ...mainThread,
    replies: getReplies(threadId)
  };
};

export const getUserThreads = (threads, userId) => {
  return threads.filter(t => t.userId === userId && !t.parentId);
};

export const searchThreads = (threads, users, query) => {
  if (!query) return [];
  
  const lowercaseQuery = query.toLowerCase();
  return threads.filter(thread => {
    // Search in thread content
    if (thread.content.toLowerCase().includes(lowercaseQuery)) return true;
    
    // Search in username/displayName of the thread author
    const user = users.find(u => u.id === thread.userId);
    if (user && (
      user.username.toLowerCase().includes(lowercaseQuery) ||
      user.displayName.toLowerCase().includes(lowercaseQuery)
    )) return true;
    
    return false;
  });
};

export const getTimeSince = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return interval === 1 ? '1y' : `${interval}y`;
  }
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval === 1 ? '1mo' : `${interval}mo`;
  }
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval === 1 ? '1d' : `${interval}d`;
  }
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval === 1 ? '1h' : `${interval}h`;
  }
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval === 1 ? '1m' : `${interval}m`;
  }
  
  return seconds < 10 ? 'now' : `${Math.floor(seconds)}s`;
};