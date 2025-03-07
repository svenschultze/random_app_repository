import { ref, computed, watch } from 'vue';
import { generateRandomContacts, filterContacts, sortContacts } from './contactModel';

// Create a reactive state that can be imported anywhere in the app
const contacts = ref([]);
const searchQuery = ref('');

// Try to load contacts from localStorage
const loadFromStorage = () => {
  try {
    const storedContacts = localStorage.getItem('contacts');
    if (storedContacts) {
      contacts.value = JSON.parse(storedContacts);
    }
  } catch (error) {
    console.error('Error loading contacts from storage:', error);
  }
};

// Save contacts to localStorage
const saveToStorage = () => {
  try {
    localStorage.setItem('contacts', JSON.stringify(contacts.value));
  } catch (error) {
    console.error('Error saving contacts to storage:', error);
  }
};

// Initialize with demo data if no contacts exist
const initializeDemoData = (count = 30) => {
  if (contacts.value.length === 0) {
    contacts.value = generateRandomContacts(count);
    saveToStorage();
  }
};

// Watch for changes and save to localStorage
watch(contacts, () => {
  saveToStorage();
}, { deep: true });

// Computed property for filtered and sorted contacts
const filteredContacts = computed(() => {
  return sortContacts(filterContacts(contacts.value, searchQuery.value));
});

// Add a new contact
const addContact = (contact) => {
  contacts.value.push(contact);
};

// Update an existing contact
const updateContact = (updatedContact) => {
  const index = contacts.value.findIndex(c => c.id === updatedContact.id);
  if (index !== -1) {
    contacts.value[index] = updatedContact;
  }
};

// Delete a contact
const deleteContact = (id) => {
  contacts.value = contacts.value.filter(c => c.id !== id);
};

// Generate random demo contacts
const generateDemoContacts = (count = 30) => {
  contacts.value = generateRandomContacts(count);
};

// Export the store functions and state
export function useContactStore() {
  // Load contacts on first use
  loadFromStorage();
  
  return {
    contacts,
    searchQuery,
    filteredContacts,
    addContact,
    updateContact,
    deleteContact,
    generateDemoContacts,
    initializeDemoData
  };
}