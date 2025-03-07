<script setup>
import { computed } from 'vue';

const props = defineProps({
  contact: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['edit', 'delete']);

// Generate initials for avatar fallback
const initials = computed(() => {
  if (!props.contact.firstName && !props.contact.lastName) return '??';
  return `${props.contact.firstName.charAt(0)}${props.contact.lastName.charAt(0)}`;
});

// Handle edit button click
const handleEdit = () => {
  emit('edit', props.contact);
};

// Handle delete button click
const handleDelete = () => {
  if (confirm(`Are you sure you want to delete ${props.contact.firstName} ${props.contact.lastName}?`)) {
    emit('delete', props.contact.id);
  }
};
</script>

<template>
  <div class="contact-card" v-voix="'contact-' + contact.id" hint="A contact card showing basic information. Press to view details or edit.">
    <div class="avatar">
      <img v-if="contact.avatarUrl" :src="contact.avatarUrl" :alt="`${contact.firstName} ${contact.lastName}`">
      <div v-else class="avatar-initials">{{ initials }}</div>
    </div>
    <div class="contact-info">
      <h3>{{ contact.firstName }} {{ contact.lastName }}</h3>
      <p v-if="contact.phone" v-voix="'phone-' + contact.id">{{ contact.phone }}</p>
      <p v-if="contact.email" v-voix="'email-' + contact.id" class="email">{{ contact.email }}</p>
      <div v-if="contact.tags && contact.tags.length" class="tags">
        <span v-for="tag in contact.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>
    <div class="contact-actions">
      <button 
        @click="handleEdit" 
        v-voix="'edit-contact-' + contact.id" 
        :hint="`Edit ${contact.firstName} ${contact.lastName}'s contact information`"
      >
        Edit
      </button>
      <button 
        @click="handleDelete" 
        class="delete-button" 
        v-voix="'delete-contact-' + contact.id" 
        :hint="`Delete ${contact.firstName} ${contact.lastName} from your contacts list`"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<style scoped>
.contact-card {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  transition: box-shadow 0.3s ease;
}

.contact-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 1rem;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #5c6bc0;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
}

.contact-info {
  flex: 1;
}

.contact-info h3 {
  margin: 0 0 0.25rem;
  font-size: 1.1rem;
}

.contact-info p {
  margin: 0.25rem 0;
  color: #555;
  font-size: 0.9rem;
}

.email {
  font-size: 0.8rem;
  color: #666;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  background-color: #e0e0f0;
  color: #5c6bc0;
}

.contact-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contact-actions button {
  padding: 0.3rem 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  background-color: #5c6bc0;
  color: white;
}

.contact-actions .delete-button {
  background-color: #f44336;
}

@media (max-width: 640px) {
  .contact-card {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .avatar {
    margin-bottom: 0.5rem;
  }
  
  .contact-actions {
    margin-top: 0.5rem;
    flex-direction: row;
    width: 100%;
  }
}
</style>