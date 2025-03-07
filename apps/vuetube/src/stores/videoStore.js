// Mock data store for VueTube application
// In a real application, this would connect to a backend API

// Base videos data that will be supplemented with dynamic content
const baseVideos = [
  {
    id: 'v1',
    title: 'Getting Started with Vue 3 Composition API',
    description: 'Learn how to use the new Composition API in Vue 3 with practical examples.',
    channelId: 'c1',
    thumbnailUrl: 'https://picsum.photos/id/0/640/360',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    views: 12543,
    likes: 1843,
    uploadDate: '2023-04-15',
    duration: '10:15',
    tags: ['vue', 'javascript', 'frontend'],
    comments: [
      { id: 'cm1', userId: 'u2', text: 'Great tutorial, thanks!', likes: 24, replies: [] },
      { id: 'cm2', userId: 'u3', text: 'This helped me understand the Composition API better.', likes: 12, replies: [
        { id: 'r1', userId: 'u1', text: 'Glad it was helpful!', likes: 3 }
      ]}
    ]
  },
  {
    id: 'v2',
    title: 'Building Responsive Layouts with CSS Grid',
    description: 'Master CSS Grid layout to create modern responsive websites.',
    channelId: 'c2',
    thumbnailUrl: 'https://picsum.photos/id/1/640/360',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    views: 8721,
    likes: 732,
    uploadDate: '2023-03-28',
    duration: '15:42',
    tags: ['css', 'webdesign', 'responsive'],
    comments: [
      { id: 'cm3', userId: 'u4', text: 'CSS Grid has been a game-changer for me!', likes: 18, replies: [] }
    ]
  },
  {
    id: 'v3',
    title: 'JavaScript Array Methods Every Developer Should Know',
    description: 'Explore powerful JavaScript array methods to level up your coding skills.',
    channelId: 'c1',
    thumbnailUrl: 'https://picsum.photos/id/2/640/360',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    views: 15231,
    likes: 2134,
    uploadDate: '2023-05-02',
    duration: '12:38',
    tags: ['javascript', 'arrays', 'coding'],
    comments: [
      { id: 'cm4', userId: 'u5', text: 'Map and filter are my favorites!', likes: 32, replies: [] },
      { id: 'cm5', userId: 'u6', text: 'I learned about some methods I didn\'t know before.', likes: 8, replies: [] }
    ]
  },
  {
    id: 'v4',
    title: 'Creating Animations with CSS and JavaScript',
    description: 'Learn how to create smooth animations using CSS and JavaScript techniques.',
    channelId: 'c3',
    thumbnailUrl: 'https://picsum.photos/id/3/640/360',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    views: 6543,
    likes: 543,
    uploadDate: '2023-04-08',
    duration: '18:22',
    tags: ['css', 'javascript', 'animation'],
    comments: [
      { id: 'cm6', userId: 'u7', text: 'The transition examples were really helpful!', likes: 15, replies: [] }
    ]
  },
  {
    id: 'v5',
    title: 'Introduction to TypeScript for Vue Developers',
    description: 'Get started with TypeScript in your Vue.js projects.',
    channelId: 'c2',
    thumbnailUrl: 'https://picsum.photos/id/4/640/360',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    views: 9876,
    likes: 876,
    uploadDate: '2023-05-12',
    duration: '22:10',
    tags: ['typescript', 'vue', 'javascript'],
    comments: [
      { id: 'cm7', userId: 'u8', text: 'Finally understanding TypeScript with Vue!', likes: 28, replies: [] },
      { id: 'cm8', userId: 'u9', text: 'Is this compatible with Vue 3?', likes: 2, replies: [
        { id: 'r2', userId: 'c2', text: 'Yes, it works great with Vue 3!', likes: 10 }
      ]}
    ]
  },
  {
    id: 'v6',
    title: 'State Management in Vue with Pinia',
    description: 'Learn how to manage application state using the Pinia library.',
    channelId: 'c1',
    thumbnailUrl: 'https://picsum.photos/id/5/640/360',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    views: 7854,
    likes: 921,
    uploadDate: '2023-03-15',
    duration: '14:35',
    tags: ['vue', 'pinia', 'state management'],
    comments: [
      { id: 'cm9', userId: 'u10', text: 'Pinia is so much better than Vuex!', likes: 41, replies: [] }
    ]
  }
];

// Lists for generating random content
const videoTitles = [
  'Advanced Vue Router Techniques for Single Page Applications',
  'Building a Real-Time Chat App with Vue and Firebase',
  'Creating Custom Directives in Vue 3',
  'Vue 3 Performance Optimization Strategies',
  'Building a Portfolio Website with Vue and Tailwind CSS',
  'Mastering Vue DevTools for Debugging',
  'Internationalization in Vue Applications',
  'Creating Micro-Frontends with Vue',
  'Testing Vue Components with Jest and Vue Test Utils',
  'Implementing Drag and Drop in Vue Applications',
  'Voice Recognition in Web Apps using Vue',
  'Creating a Dark Mode Toggle in Vue',
  'Building Accessible Vue Components',
  'Vue 3 Teleport Feature Explained',
  'Implementing File Uploads in Vue Applications',
  'Creating Custom Form Validators in Vue',
  'Building an E-commerce Store with Vue',
  'Server-Side Rendering with Vue and Nuxt',
  'Implementing Authentication in Vue Apps',
  'Mobile-First Design with Vue and CSS'
];

const videoDescriptions = [
  'In this comprehensive tutorial, we explore advanced techniques for creating modern web applications.',
  'Learn step-by-step how to implement this feature in your own projects with practical examples.',
  'Master the fundamentals and advanced concepts to take your development skills to the next level.',
  'Discover the best practices for optimizing performance and user experience in your applications.',
  'A complete walkthrough from setup to deployment with tips and tricks for professional results.',
  'This guide covers everything you need to know to implement this functionality effectively.',
  'Follow along as we build a real-world application from scratch with detailed explanations.',
  'Explore the latest techniques and tools for modern web development in this in-depth tutorial.',
  'Learn how to solve common challenges and implement robust solutions in your projects.',
  'This tutorial combines theory with hands-on practice to help you master these essential concepts.'
];

const commentTexts = [
  'This is exactly what I needed, thanks for sharing!',
  'Great explanation, really helped me understand the concept better.',
  'I\'ve been looking for a tutorial like this for ages!',
  'Incredibly well done, very clear and easy to follow.',
  'You make complex topics seem so simple. Thank you!',
  'Just subscribed, can\'t wait to see more content like this!',
  'This saved me hours of troubleshooting. Much appreciated!',
  'Could you please do a follow-up video on this topic?',
  'The code examples were particularly helpful.',
  'I implemented this in my project and it works perfectly!',
  'Your teaching style is so clear and concise.',
  'Best explanation of this topic I\'ve seen anywhere.',
  'Watching this for the second time and still learning new things.',
  'Do you have any recommendations for further reading on this?',
  'The production quality of your videos keeps getting better!',
  'I\'ve shared this with my entire development team.',
  'Are there any performance considerations we should be aware of?',
  'How would this approach scale for larger applications?',
  'Can\'t believe this video doesn\'t have more views. It\'s excellent!',
  'Thanks for the timestamps in the description, very helpful!'
];

// Function to generate a random date within the past year
const generateRandomDate = () => {
  const now = new Date();
  const pastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const randomTime = pastYear.getTime() + Math.random() * (now.getTime() - pastYear.getTime());
  const randomDate = new Date(randomTime);
  return randomDate.toISOString().split('T')[0];
};

// Function to generate a random duration string (MM:SS)
const generateRandomDuration = () => {
  const minutes = Math.floor(Math.random() * 30) + 1; // 1-30 minutes
  const seconds = Math.floor(Math.random() * 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Function to generate random comments
const generateRandomComments = (count) => {
  const comments = [];
  for (let i = 0; i < count; i++) {
    const userNumber = Math.floor(Math.random() * 10) + 1;
    const hasReplies = Math.random() > 0.7;
    const commentText = commentTexts[Math.floor(Math.random() * commentTexts.length)];
    const likes = Math.floor(Math.random() * 100);
    
    const comment = {
      id: `cm${Math.floor(Math.random() * 10000)}`,
      userId: `u${userNumber}`,
      text: commentText,
      likes: likes,
      replies: []
    };
    
    if (hasReplies) {
      const replyCount = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < replyCount; j++) {
        const replyUserNumber = Math.floor(Math.random() * 10) + 1;
        const replyText = commentTexts[Math.floor(Math.random() * commentTexts.length)];
        const replyLikes = Math.floor(Math.random() * 50);
        
        comment.replies.push({
          id: `r${Math.floor(Math.random() * 10000)}`,
          userId: `u${replyUserNumber}`,
          text: replyText,
          likes: replyLikes
        });
      }
    }
    
    comments.push(comment);
  }
  
  return comments;
};

// Function to generate a random video
const generateRandomVideo = (id) => {
  const channelId = `c${Math.floor(Math.random() * 3) + 1}`;
  const title = videoTitles[Math.floor(Math.random() * videoTitles.length)];
  const description = videoDescriptions[Math.floor(Math.random() * videoDescriptions.length)];
  const imageId = Math.floor(Math.random() * 1000); // Random image from Lorem Picsum
  const views = Math.floor(Math.random() * 100000) + 1000;
  const likes = Math.floor(Math.random() * views * 0.2); // Likes are typically a fraction of views
  const uploadDate = generateRandomDate();
  const duration = generateRandomDuration();
  const commentCount = Math.floor(Math.random() * 5) + 1;
  
  return {
    id: `v${id}`,
    title,
    description,
    channelId,
    thumbnailUrl: `https://picsum.photos/id/${imageId}/640/360`,
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    views,
    likes,
    uploadDate,
    duration,
    tags: ['vue', 'javascript', 'webdev', 'tutorial'].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1),
    comments: generateRandomComments(commentCount)
  };
};

// Generate additional random videos (10-15 more videos)
const generateAdditionalVideos = () => {
  const additionalCount = Math.floor(Math.random() * 6) + 10; // 10-15 additional videos
  const additionalVideos = [];
  
  for (let i = 0; i < additionalCount; i++) {
    additionalVideos.push(generateRandomVideo(baseVideos.length + i + 1));
  }
  
  return additionalVideos;
};

// Each time the app is loaded, we'll have base videos plus some random new ones
// This simulates new content being available each time
const videos = [...baseVideos, ...generateAdditionalVideos()];

const channels = [
  {
    id: 'c1',
    name: 'VueMastery',
    profilePicture: 'https://picsum.photos/id/11/100/100',
    bannerImage: 'https://picsum.photos/id/11/1200/300',
    subscribers: 25400,
    description: 'Tutorials and tips for Vue.js developers at all skill levels.'
  },
  {
    id: 'c2',
    name: 'WebDevSimplified',
    profilePicture: 'https://picsum.photos/id/12/100/100',
    bannerImage: 'https://picsum.photos/id/12/1200/300',
    subscribers: 18700,
    description: 'Simplifying web development concepts and techniques.'
  },
  {
    id: 'c3',
    name: 'CodeArtisan',
    profilePicture: 'https://picsum.photos/id/13/100/100',
    bannerImage: 'https://picsum.photos/id/13/1200/300',
    subscribers: 12350,
    description: 'Crafting beautiful web experiences through code.'
  }
];

const users = [
  {
    id: 'u1',
    name: 'VueMastery',
    profilePicture: 'https://picsum.photos/id/11/100/100',
    subscriptions: ['c2', 'c3'],
    likedVideos: ['v2', 'v4'],
    watchHistory: ['v1', 'v3', 'v5']
  },
  {
    id: 'u2',
    name: 'Alice',
    profilePicture: 'https://picsum.photos/id/21/100/100',
    subscriptions: ['c1'],
    likedVideos: ['v1', 'v3', 'v6'],
    watchHistory: ['v1', 'v2', 'v6']
  }
];

// Helper function to format view counts
export function formatViewCount(views) {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + 'M';
  } else if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'K';
  } else {
    return views.toString();
  }
}

// Helper function to format dates
export function formatUploadDate(dateString) {
  const uploadDate = new Date(dateString);
  const currentDate = new Date();
  const diffTime = currentDate - uploadDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }
}

// Functions to handle data operations
export function getAllVideos() {
  return [...videos];
}

export function getVideoById(id) {
  return videos.find(video => video.id === id);
}

export function getChannelById(id) {
  return channels.find(channel => channel.id === id);
}

export function getUserById(id) {
  return users.find(user => user.id === id);
}

export function getChannelVideos(channelId) {
  return videos.filter(video => video.channelId === channelId);
}

export function searchVideos(query) {
  const lowercaseQuery = query.toLowerCase();
  return videos.filter(video => 
    video.title.toLowerCase().includes(lowercaseQuery) || 
    video.description.toLowerCase().includes(lowercaseQuery) ||
    video.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

// Mock functions for user interactions (in a real app, these would update a backend)
export function likeVideo(videoId, userId) {
  const video = getVideoById(videoId);
  const user = getUserById(userId);
  
  if (video && user) {
    if (!user.likedVideos.includes(videoId)) {
      user.likedVideos.push(videoId);
      video.likes++;
    }
  }
}

export function addComment(videoId, userId, commentText) {
  const video = getVideoById(videoId);
  
  if (video) {
    const newComment = {
      id: `cm${Math.floor(Math.random() * 10000)}`,
      userId,
      text: commentText,
      likes: 0,
      replies: []
    };
    
    video.comments.push(newComment);
    return newComment;
  }
  return null;
}

export function uploadVideo(videoData, userId) {
  const user = getUserById(userId);
  const channelId = user.id; // Assuming user ID is same as channel ID for simplicity
  
  const newVideo = {
    id: `v${videos.length + 1}`,
    channelId,
    views: 0,
    likes: 0,
    uploadDate: new Date().toISOString().split('T')[0],
    comments: [],
    ...videoData
  };
  
  videos.push(newVideo);
  return newVideo;
}

export function subscribeToChannel(channelId, userId) {
  const channel = getChannelById(channelId);
  const user = getUserById(userId);
  
  if (channel && user) {
    if (!user.subscriptions.includes(channelId)) {
      user.subscriptions.push(channelId);
      channel.subscribers++;
    }
  }
}

export function unsubscribeFromChannel(channelId, userId) {
  const channel = getChannelById(channelId);
  const user = getUserById(userId);
  
  if (channel && user) {
    const index = user.subscriptions.indexOf(channelId);
    if (index !== -1) {
      user.subscriptions.splice(index, 1);
      channel.subscribers--;
    }
  }
}

// For demo purposes, set a current user
export const currentUser = users[0];