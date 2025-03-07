<script setup>
import { ref, onMounted, computed } from 'vue';
import ContactCard from '../components/ContactCard.vue';
import ContactForm from '../components/ContactForm.vue';
import SearchBar from '../components/SearchBar.vue';
import EmptyState from '../components/EmptyState.vue';
import { useContactStore } from '../utils/contactStore';
import { generateId } from '../utils/contactModel';

// Get contact store
const { 
  contacts, 
  searchQuery, 
  filteredContacts, 
  addContact, 
  updateContact, 
  deleteContact, 
  generateDemoContacts, 
  initializeDemoData 
} = useContactStore();

// UI state
const showAddForm = ref(false);
const editingContact = ref(null);

// Initialize demo data on mount
onMounted(() => {
  // Always generate fresh demo data when the app loads
  generateDemoContacts(30);
});

// Computed property to determine if we're in edit mode
const isEditing = computed(() => !!editingContact.value);

// Handle adding a new contact
const handleAddContact = () => {
  showAddForm.value = true;
  editingContact.value = null;
};

// Handle saving a contact (either new or edited)
const handleSaveContact = (contact) => {
  if (isEditing.value) {
    updateContact(contact);
  } else {
    // Ensure it has an ID
    if (!contact.id) {
      contact.id = generateId();
    }
    addContact(contact);
  }
  
  // Reset UI state
  showAddForm.value = false;
  editingContact.value = null;
};

// Handle editing a contact
const handleEditContact = (contact) => {
  editingContact.value = contact;
  showAddForm.value = true;
};

// Handle deleting a contact
const handleDeleteContact = (id) => {
  deleteContact(id);
};

// Handle cancelling the form
const handleCancelForm = () => {
  showAddForm.value = false;
  editingContact.value = null;
};

// Handle generating demo data
const handleGenerateDemo = () => {
  generateDemoContacts();
};

// Computed property to determine if we have contacts
const hasContacts = computed(() => contacts.value.length > 0);

// Computed property to determine if we have filtered contacts
const hasFilteredContacts = computed(() => filteredContacts.value.length > 0);

// Computed property for the empty state message
const emptyStateMessage = computed(() => {
  if (!hasFilteredContacts.value && searchQuery.value) {
    return `No contacts match "${searchQuery.value}"`;
  }
  return 'No contacts available';
});
</script>

<template>
  <div class="contact-hub">
    <div class="header">
      <h1>ContactHub</h1>
      <p class="subtitle">Manage your contacts locally</p>
    </div>
    
    <div class="actions">
      <SearchBar v-model="searchQuery" />
      <button 
        class="add-button" 
        @click="handleAddContact"
        v-voix="'add-new-contact'"
        hint="Open form to add a new contact"
      >
        Add New Contact
      </button>
    </div>
    
    <!-- Contact form for adding/editing -->
    <ContactForm 
      v-if="showAddForm" 
      :contact="editingContact" 
      :isEdit="isEditing"
      @save="handleSaveContact" 
      @cancel="handleCancelForm" 
    />
    
    <!-- Contact list -->
    <div v-else class="contact-list-container">
      <div v-if="hasFilteredContacts" class="contact-list">
        <ContactCard 
          v-for="contact in filteredContacts" 
          :key="contact.id" 
          :contact="contact"
          @edit="handleEditContact"
          @delete="handleDeleteContact"
        />
      </div>
      
      <EmptyState 
        v-else
        :title="!hasContacts ? 'No contacts yet' : 'No matching contacts'"
        :message="emptyStateMessage"
      />
      
    </div>
  </div>
</template>

<style scoped>
.contact-hub {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  font-size: 2.5rem;
  color: #333;
  margin: 0;
}

.subtitle {
  color: #666;
  margin: 0.5rem 0 0;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.add-button {
  padding: 0.75rem 1.5rem;
  background-color: #5c6bc0;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  flex-shrink: 0;
}

.add-button:hover {
  background-color: #4a59b0;
}

.contact-list-container {
  margin-top: 2rem;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}


@media (max-width: 768px) {
  .actions {
    flex-direction: column;
  }
  
  .actions > * {
    width: 100%;
  }
}
</style>
