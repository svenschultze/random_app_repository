import { ref, reactive } from 'vue'

// Mock data store
const polls = reactive([
  {
    id: 1,
    question: 'What is your favorite programming language?',
    options: [
      { id: 1, text: 'JavaScript', votes: 42 },
      { id: 2, text: 'Python', votes: 38 },
      { id: 3, text: 'Java', votes: 15 },
      { id: 4, text: 'C#', votes: 22 }
    ],
    comments: [
      { id: 1, author: 'CodeNinja', text: 'JavaScript all the way!', timestamp: '2 hours ago' },
      { id: 2, author: 'PythonLover', text: 'Python is more readable though', timestamp: '1 hour ago' },
      { id: 3, author: 'DevGuru', text: 'Depends on what you\'re building', timestamp: '30 minutes ago' }
    ],
    isFeatured: true,
    createdAt: '2023-09-15'
  },
  {
    id: 2,
    question: 'Which frontend framework do you prefer?',
    options: [
      { id: 1, text: 'Vue', votes: 56 },
      { id: 2, text: 'React', votes: 72 },
      { id: 3, text: 'Angular', votes: 28 },
      { id: 4, text: 'Svelte', votes: 19 }
    ],
    comments: [
      { id: 1, author: 'ComponentKing', text: 'React\'s ecosystem is unbeatable', timestamp: '5 hours ago' },
      { id: 2, author: 'VueFan', text: 'Vue is more intuitive for beginners', timestamp: '3 hours ago' }
    ],
    isFeatured: false,
    createdAt: '2023-09-10'
  },
  {
    id: 3,
    question: 'How do you prefer to style your web applications?',
    options: [
      { id: 1, text: 'Plain CSS', votes: 32 },
      { id: 2, text: 'SCSS/SASS', votes: 48 },
      { id: 3, text: 'Tailwind CSS', votes: 63 },
      { id: 4, text: 'CSS-in-JS', votes: 24 }
    ],
    comments: [
      { id: 1, author: 'StyleMaster', text: 'Tailwind has changed my workflow completely', timestamp: '1 day ago' },
      { id: 2, author: 'CSSPurist', text: 'Nothing beats vanilla CSS for control', timestamp: '12 hours ago' }
    ],
    isFeatured: false,
    createdAt: '2023-09-05'
  }
])

// Get the next ID for a new poll
const getNextPollId = () => {
  return Math.max(...polls.map(poll => poll.id)) + 1
}

// Get the featured poll (for homepage)
const getFeaturedPoll = () => {
  return polls.find(poll => poll.isFeatured) || polls[0]
}

// Get a poll by ID
const getPollById = (id) => {
  return polls.find(poll => poll.id === parseInt(id))
}

// Add a new poll
const addPoll = (pollData) => {
  const newPoll = {
    id: getNextPollId(),
    question: pollData.question,
    options: pollData.options.map((option, index) => ({
      id: index + 1,
      text: option,
      votes: 0
    })),
    comments: [],
    isFeatured: false,
    createdAt: new Date().toISOString().split('T')[0]
  }
  
  polls.unshift(newPoll)
  return newPoll
}

// Add a vote to a specific poll option
const addVote = (pollId, optionId) => {
  const poll = getPollById(pollId)
  if (poll) {
    const option = poll.options.find(opt => opt.id === optionId)
    if (option) {
      option.votes++
      return true
    }
  }
  return false
}

// Add a comment to a poll
const addComment = (pollId, commentData) => {
  const poll = getPollById(pollId)
  if (poll) {
    const newComment = {
      id: poll.comments.length + 1,
      author: commentData.author || 'Anonymous',
      text: commentData.text,
      timestamp: 'Just now'
    }
    poll.comments.push(newComment)
    return newComment
  }
  return null
}

// Simulate live updates by randomly incrementing votes
const startLiveUpdates = (pollId, callback) => {
  const interval = setInterval(() => {
    const poll = getPollById(pollId)
    if (poll) {
      const randomOptionIndex = Math.floor(Math.random() * poll.options.length)
      poll.options[randomOptionIndex].votes++
      if (callback) callback(poll)
    }
  }, 3000) // Every 3 seconds
  
  return () => clearInterval(interval) // Return cleanup function
}

export {
  polls,
  getFeaturedPoll,
  getPollById,
  addPoll,
  addVote,
  addComment,
  startLiveUpdates
}