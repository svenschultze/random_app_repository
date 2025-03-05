<script setup>
import { ref, computed } from 'vue';

// Categories for help content
const categories = [
  { id: 'getting-started', label: 'Getting Started', icon: '🚀' },
  { id: 'account', label: 'Account & Profile', icon: '👤' },
  { id: 'matching', label: 'Skill Matching', icon: '🤝' },
  { id: 'sessions', label: 'Skill Sessions', icon: '📚' },
  { id: 'messaging', label: 'Messaging', icon: '💬' },
  { id: 'troubleshooting', label: 'Troubleshooting', icon: '🔧' },
  { id: 'policies', label: 'Policies & Guidelines', icon: '📋' },
  { id: 'contact', label: 'Contact Support', icon: '📞' }
];

// FAQ data structured by category
const faqs = {
  'getting-started': [
    {
      id: 'gs1',
      question: 'What is SkillSwap?',
      answer: 'SkillSwap is a platform that connects people who want to learn with those who want to teach, allowing for skill exchange without monetary transactions. You can both teach your skills and learn new ones from others in a collaborative environment.'
    },
    {
      id: 'gs2',
      question: 'How do I get started with SkillSwap?',
      answer: 'To get started, create an account and complete your profile with information about your skills and interests. Then, browse potential matches based on what you want to learn and what you can teach, connect with others, and schedule your first skill exchange session.'
    },
    {
      id: 'gs3',
      question: 'Is SkillSwap free to use?',
      answer: 'Yes, SkillSwap is completely free to use. Instead of monetary payments, the platform works on the principle of skill exchange - you teach someone your skills, and in return, you can learn from others.'
    }
  ],
  'account': [
    {
      id: 'acc1',
      question: 'How do I edit my profile?',
      answer: 'You can edit your profile by navigating to the Profile page and clicking the "Edit Profile" button. From there, you can update your personal information, skills, preferences, and profile picture.'
    },
    {
      id: 'acc2',
      question: 'Can I delete my account?',
      answer: 'Yes, you can delete your account by going to Settings > Account > Delete Account. Please note that this action is permanent and will remove all your data from our platform.'
    },
    {
      id: 'acc3',
      question: 'How do I add or remove skills from my profile?',
      answer: 'To add or remove skills, go to your Profile page and click on the "Edit Skills" button. You can add new skills by typing them in the input field and selecting a proficiency level, or remove existing skills by clicking the remove icon next to them.'
    }
  ],
  'matching': [
    {
      id: 'match1',
      question: 'How does the matching algorithm work?',
      answer: 'Our matching algorithm connects users based on complementary skills - what you want to learn and what others can teach, and vice versa. It also considers factors like location preferences, availability, and skill levels to suggest the most relevant matches.'
    },
    {
      id: 'match2',
      question: 'Why can\'t I find matches for my skills?',
      answer: 'If you\'re having trouble finding matches, try broadening your search criteria, adding more details to your skills, or being more specific about what you want to learn. Sometimes, it may take a little time for new matches to appear as more users join the platform.'
    },
    {
      id: 'match3',
      question: 'How do I connect with a match?',
      answer: 'When you find a potential match, you can send them a connection request by clicking the "Connect" button on their profile. Include a personalized message explaining why you are interested in connecting. Once they accept, you can start messaging and schedule a session.'
    }
  ],
  'sessions': [
    {
      id: 'sess1',
      question: 'How do I schedule a skill exchange session?',
      answer: 'To schedule a session, go to your Matches page, select a connection, and click on "Schedule Session." Choose a date and time that works for both of you, specify the skill being exchanged, and add any notes or materials needed for the session.'
    },
    {
      id: 'sess2',
      question: 'What happens during a skill exchange session?',
      answer: 'During a session, you\'ll connect with your match via our built-in video platform. The person teaching will share their knowledge and expertise, while the learner can ask questions and practice. Sessions typically last 30-60 minutes, but you can decide the duration together.'
    },
    {
      id: 'sess3',
      question: 'How do I reschedule or cancel a session?',
      answer: 'You can reschedule or cancel a session by going to your Schedule page, finding the session in question, and clicking on "Reschedule" or "Cancel." Try to give your match enough notice if you need to make changes to your plans.'
    }
  ],
  'messaging': [
    {
      id: 'msg1',
      question: 'How do I send messages to my connections?',
      answer: 'You can send messages to your connections by going to the Messages page, selecting a connection from your list, and typing your message in the chat box. You can also access the messaging feature directly from a match\'s profile once you\'re connected.'
    },
    {
      id: 'msg2',
      question: 'Are my messages private?',
      answer: 'Yes, all messages between users are private and encrypted. Only you and the person you\'re communicating with can see the content of your conversations.'
    },
    {
      id: 'msg3',
      question: 'Can I share files or materials through messages?',
      answer: 'Yes, you can share files, links, and materials through our messaging system to enhance your skill exchange experience. Simply click the attachment icon in the chat box to upload and share resources.'
    }
  ],
  'troubleshooting': [
    {
      id: 'ts1',
      question: 'What if I have technical issues during a session?',
      answer: 'If you experience technical issues during a session, try refreshing your browser, checking your internet connection, or restarting the session. If problems persist, you can contact our support team for assistance.'
    },
    {
      id: 'ts2',
      question: 'How do I report inappropriate behavior?',
      answer: 'You can report inappropriate behavior by clicking the "Report" button on a user\'s profile or in a message thread. Provide details about the issue, and our moderation team will review your report and take appropriate action.'
    },
    {
      id: 'ts3',
      question: 'Why can\'t I access certain features?',
      answer: 'Some features may be unavailable if you haven\'t completed your profile, verified your email, or met certain requirements. Check your notifications for any pending actions, or contact support if you believe there\'s an error.'
    }
  ],
  'policies': [
    {
      id: 'pol1',
      question: 'What are the community guidelines?',
      answer: 'Our community guidelines emphasize respect, honesty, and collaboration. We expect all users to treat each other with respect, communicate clearly, honor commitments, provide constructive feedback, and maintain confidentiality when appropriate.'
    },
    {
      id: 'pol2',
      question: 'How does SkillSwap protect my privacy?',
      answer: 'SkillSwap protects your privacy by only sharing the information you choose to display on your profile. We never sell your personal data to third parties, and you have control over your privacy settings, including who can see your profile and contact you.'
    },
    {
      id: 'pol3',
      question: 'What is your cancellation policy?',
      answer: 'We understand that plans can change, but we encourage users to respect each other\'s time. Try to provide at least 24 hours notice when cancelling or rescheduling a session. Repeated last-minute cancellations may affect your account standing.'
    }
  ],
  'contact': [
    {
      id: 'contact1',
      question: 'How do I contact the SkillSwap support team?',
      answer: 'You can contact our support team by submitting a request through the form below, sending an email to support@skillswap.com, or using the live chat feature available during business hours (Monday to Friday, 9 AM to 5 PM EST).'
    },
    {
      id: 'contact2',
      question: 'What is the typical response time for support requests?',
      answer: 'We aim to respond to all support requests within 24 hours during business days. For urgent issues, try using the live chat feature for faster assistance when available.'
    }
  ]
};

// Initial state
const selectedCategory = ref('getting-started');
const searchQuery = ref('');
const expandedFaqs = ref([]);

// Switch category
const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId;
  expandedFaqs.value = [];
};

// Toggle FAQ expansion
const toggleFaq = (faqId) => {
  if (expandedFaqs.value.includes(faqId)) {
    expandedFaqs.value = expandedFaqs.value.filter(id => id !== faqId);
  } else {
    expandedFaqs.value.push(faqId);
  }
};

// Search functionality
const filteredFaqs = computed(() => {
  if (!searchQuery.value.trim()) {
    return faqs;
  }
  
  const query = searchQuery.value.toLowerCase();
  const results = {};
  
  Object.keys(faqs).forEach(category => {
    const matchingFaqs = faqs[category].filter(faq => 
      faq.question.toLowerCase().includes(query) || 
      faq.answer.toLowerCase().includes(query)
    );
    
    if (matchingFaqs.length > 0) {
      results[category] = matchingFaqs;
    }
  });
  
  return results;
});

// Clear search
const clearSearch = () => {
  searchQuery.value = '';
};

// Support form state
const supportFormData = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
  category: 'general'
});

// Form submission
const submitSupportRequest = () => {
  alert('Support request submitted! We will get back to you as soon as possible.');
  // In a real app, this would send the form data to an API
  supportFormData.value = {
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  };
};
</script>

<template>
  <div class="help-container">
    <div class="help-header">
      <h1 v-voix="'help-title'">Help & Support</h1>
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search for help topics..."
          aria-label="Search for help topics"
        />
        <button v-if="searchQuery" @click="clearSearch" class="clear-search" aria-label="Clear search">×</button>
      </div>
    </div>
    
    <div class="help-content">
      <div class="categories-sidebar">
        <h2 v-voix="'categories-title'">Categories</h2>
        <ul class="category-list">
          <li 
            v-for="category in categories" 
            :key="category.id"
            @click="selectCategory(category.id)"
            :class="{ active: selectedCategory === category.id }"
          >
            <span class="category-icon">{{ category.icon }}</span>
            <span>{{ category.label }}</span>
          </li>
        </ul>
      </div>
      
      <div class="help-main">
        <template v-if="selectedCategory !== 'contact'">
          <div class="faqs-section">
            <h2 v-voix="'faqs-title'">Frequently Asked Questions</h2>
            
            <div v-if="searchQuery && Object.keys(filteredFaqs).length === 0" class="no-results">
              <p>No results found for "{{ searchQuery }}"</p>
              <button @click="clearSearch" class="outline-button">Clear search</button>
            </div>
            
            <template v-else>
              <div 
                v-for="(categoryFaqs, categoryId) in filteredFaqs" 
                :key="categoryId"
                v-show="categoryId === selectedCategory || searchQuery"
                class="faq-category"
              >
                <h3 v-if="searchQuery">{{ categories.find(c => c.id === categoryId)?.label }}</h3>
                
                <div 
                  v-for="faq in categoryFaqs" 
                  :key="faq.id"
                  class="faq-item"
                  :class="{ expanded: expandedFaqs.includes(faq.id) }"
                  @click="toggleFaq(faq.id)"
                >
                  <div class="faq-question">
                    <h4>{{ faq.question }}</h4>
                    <span class="faq-toggle">{{ expandedFaqs.includes(faq.id) ? '−' : '+' }}</span>
                  </div>
                  <div class="faq-answer" v-show="expandedFaqs.includes(faq.id)">
                    <p>{{ faq.answer }}</p>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </template>
        
        <div v-if="selectedCategory === 'contact'" class="contact-section">
          <h2 v-voix="'contact-title'">Contact Support</h2>
          <p>Need help with something specific? Our support team is here to assist you.</p>
          
          <form class="contact-form" @submit.prevent="submitSupportRequest">
            <div class="form-group">
              <label for="name">Name</label>
              <input 
                type="text" 
                id="name" 
                v-model="supportFormData.name"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                v-model="supportFormData.email"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="category">Category</label>
              <select id="category" v-model="supportFormData.category">
                <option value="general">General Question</option>
                <option value="technical">Technical Issue</option>
                <option value="account">Account Problem</option>
                <option value="billing">Billing Inquiry</option>
                <option value="feedback">Feedback</option>
                <option value="report">Report User/Content</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="subject">Subject</label>
              <input 
                type="text" 
                id="subject" 
                v-model="supportFormData.subject"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="message">Message</label>
              <textarea 
                id="message" 
                v-model="supportFormData.message"
                rows="5"
                required
              ></textarea>
            </div>
            
            <button type="submit" class="primary-button">Submit Request</button>
          </form>
          
          <div class="alternative-contact">
            <h3>Other Ways to Reach Us</h3>
            <p><strong>Email:</strong> support@skillswap.com</p>
            <p><strong>Live Chat:</strong> Available Monday to Friday, 9 AM to 5 PM EST</p>
            <p><strong>Response Time:</strong> Within 24 hours during business days</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.help-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.help-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.help-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
}

.search-box {
  position: relative;
  flex-grow: 1;
  max-width: 500px;
}

.search-box input {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.search-box input:focus {
  outline: none;
  border-color: var(--primary-color, #4a90e2);
}

.clear-search {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-color-muted, #666);
  font-size: 1.2rem;
  cursor: pointer;
}

.help-content {
  display: flex;
  gap: 2rem;
}

.categories-sidebar {
  flex-basis: 250px;
  flex-shrink: 0;
}

.categories-sidebar h2 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-list li {
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.category-list li:hover {
  background-color: var(--background-color-light, #f5f5f5);
}

.category-list li.active {
  background-color: var(--primary-color, #4a90e2);
  color: white;
}

.category-icon {
  display: inline-block;
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.help-main {
  flex-grow: 1;
}

.faqs-section h2, .contact-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-color);
}

.faq-category h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 1.5rem 0 1rem;
  color: var(--text-color);
  border-bottom: 1px solid var(--border-color, #e0e0e0);
  padding-bottom: 0.5rem;
}

.faq-item {
  margin-bottom: 1rem;
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s;
}

.faq-item.expanded {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  background-color: white;
}

.faq-question h4 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-color);
}

.faq-toggle {
  font-size: 1.5rem;
  color: var(--primary-color, #4a90e2);
  font-weight: 500;
}

.faq-answer {
  padding: 0 1rem 1rem;
  color: var(--text-color, #333);
  line-height: 1.6;
}

.no-results {
  text-align: center;
  padding: 2rem;
  color: var(--text-color-muted, #666);
  font-style: italic;
}

.contact-section p {
  margin-bottom: 1.5rem;
  color: var(--text-color, #333);
  line-height: 1.6;
}

.contact-form {
  background-color: white;
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color, #333);
}

.form-group input, .form-group select, .form-group textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color, #4a90e2);
}

.alternative-contact {
  background-color: var(--background-color-light, #f5f5f5);
  border-radius: 8px;
  padding: 1.5rem;
}

.alternative-contact h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.alternative-contact p {
  margin-bottom: 0.5rem;
}

/* Button styles */
.primary-button {
  background-color: var(--primary-color, #4a90e2);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.8rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.primary-button:hover {
  background-color: var(--primary-color-dark, #0056b3);
}

.outline-button {
  background-color: transparent;
  color: var(--text-color, #333);
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 4px;
  padding: 0.8rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.outline-button:hover {
  background-color: var(--background-color-light, #f5f5f5);
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .help-content {
    flex-direction: column;
  }
  
  .categories-sidebar {
    flex-basis: auto;
  }
  
  .category-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .category-list li {
    margin-bottom: 0;
    flex-grow: 1;
    text-align: center;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .help-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-box {
    max-width: 100%;
    width: 100%;
  }
}
</style>