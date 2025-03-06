<script setup>
import { computed } from 'vue';
import BaseModal from './BaseModal.vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  transaction: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close']);

const isPositive = computed(() => {
  return props.transaction.amount > 0;
});

const getTransactionIcon = (category) => {
  const icons = {
    'Groceries': '🛒',
    'Dining': '🍔',
    'Shopping': '🛍️',
    'Entertainment': '🎬',
    'Transport': '🚗',
    'Utilities': '💡',
    'Healthcare': '⚕️',
    'Travel': '✈️',
    'Income': '💰',
    'Subscription': '📱',
    'Transfer': '📤',
    'Other': '📦'
  };
  
  return icons[category] || '📝';
};

const getCategoryClass = (category) => {
  const classes = {
    'Groceries': 'category-groceries',
    'Dining': 'category-dining',
    'Shopping': 'category-shopping',
    'Entertainment': 'category-entertainment',
    'Transport': 'category-transport',
    'Utilities': 'category-utilities',
    'Healthcare': 'category-healthcare',
    'Travel': 'category-travel',
    'Income': 'category-income',
    'Subscription': 'category-subscription',
    'Transfer': 'category-transfer',
    'Other': 'category-other'
  };
  
  return classes[category] || 'category-other';
};

</script>

<template>
  <BaseModal :show="show" :title="'Transaction Details'" @close="$emit('close')">
    <div class="transaction-detail" v-voix="'Transaction Details'">
      <div v-if="!transaction.id" class="no-data">
        No transaction data available
      </div>
      
      <div v-else>
        <div class="transaction-header">
          <div class="transaction-icon" :class="getCategoryClass(transaction.category)">
            <span>{{ getTransactionIcon(transaction.category) }}</span>
          </div>
          
          <div class="transaction-title">
            <h3>{{ transaction.merchant }}</h3>
            <p class="transaction-date">{{ transaction.formattedDate }}</p>
          </div>
          
          <div class="transaction-amount" :class="{ 'positive': isPositive, 'negative': !isPositive }">
            {{ transaction.formattedAmount }}
          </div>
        </div>
        
        <div class="transaction-info">
          <div class="info-row">
            <div class="info-label">Transaction ID</div>
            <div class="info-value">{{ transaction.id }}</div>
          </div>
          
          <div class="info-row">
            <div class="info-label">Category</div>
            <div class="info-value">{{ transaction.category }}</div>
          </div>
          
          <div class="info-row">
            <div class="info-label">Account</div>
            <div class="info-value">{{ transaction.account }}</div>
          </div>
          
          <div class="info-row">
            <div class="info-label">Type</div>
            <div class="info-value">{{ transaction.type === 'credit' ? 'Credit (Money In)' : 'Debit (Money Out)' }}</div>
          </div>
          
          <div class="info-row">
            <div class="info-label">Status</div>
            <div class="info-value status-completed">Completed</div>
          </div>
        </div>
        
        <div class="transaction-notes">
          <h4>Notes</h4>
          <div class="notes-input-container">
            <textarea 
              placeholder="Add notes about this transaction..."
              rows="3"
              v-voix="'Transaction Notes'"
            ></textarea>
            <div class="notes-actions">
              <button 
                class="save-button"
                v-voix="'Save Notes'"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
        
        <div class="similar-transactions">
          <h4>Similar Transactions</h4>
          <div class="similar-list">
            <div class="similar-item">
              <div class="similar-merchant">{{ transaction.merchant }}</div>
              <div class="similar-date">Last month</div>
              <div class="similar-amount" :class="{ 'positive': isPositive, 'negative': !isPositive }">
                {{ transaction.formattedAmount }}
              </div>
            </div>
            
            <div class="similar-item">
              <div class="similar-merchant">{{ transaction.merchant }}</div>
              <div class="similar-date">2 months ago</div>
              <div class="similar-amount" :class="{ 'positive': isPositive, 'negative': !isPositive }">
                {{ transaction.formattedAmount }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <template #footer>
      <button 
        class="secondary-button" 
        @click="$emit('close')"
        v-voix="'Close'"
      >
        Close
      </button>
    </template>
  </BaseModal>
</template>

<style scoped>
.transaction-detail {
  color: var(--text-color);
}

.no-data {
  text-align: center;
  padding: 30px;
  color: var(--text-color);
  opacity: 0.7;
}

.transaction-header {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.transaction-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 8px;
  margin-right: 15px;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.transaction-title {
  flex-grow: 1;
}

.transaction-title h3 {
  margin: 0 0 5px;
  font-size: 1.25rem;
}

.transaction-date {
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.7;
}

.transaction-amount {
  font-size: 1.5rem;
  font-weight: 700;
  margin-left: 15px;
}

.positive {
  color: var(--secondary-color, #2ecc71);
}

.negative {
  color: #e74c3c;
}

.transaction-info {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.info-row {
  display: flex;
  margin-bottom: 12px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  width: 120px;
  font-weight: 600;
  flex-shrink: 0;
}

.info-value {
  flex-grow: 1;
}

.status-completed {
  color: var(--secondary-color);
  display: inline-flex;
  align-items: center;
}

.status-completed:before {
  content: "";
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--secondary-color);
  margin-right: 6px;
}

.transaction-notes {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.transaction-notes h4, .similar-transactions h4 {
  margin: 0 0 12px;
  font-size: 1rem;
}

.notes-input-container textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--card-background);
  color: var(--text-color);
  resize: vertical;
  margin-bottom: 10px;
}

.notes-actions {
  display: flex;
  justify-content: flex-end;
}

.save-button {
  padding: 8px 16px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.similar-list {
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 8px;
  overflow: hidden;
}

.similar-item {
  display: flex;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
}

.similar-item:last-child {
  border-bottom: none;
}

.similar-merchant {
  flex-grow: 1;
  font-weight: 500;
}

.similar-date {
  margin-right: 20px;
  opacity: 0.7;
}

.similar-amount {
  font-weight: 600;
  width: 100px;
  text-align: right;
}

.secondary-button {
  padding: 8px 16px;
  background-color: transparent;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-color);
  cursor: pointer;
}

/* Category colors */
.category-groceries { background-color: rgba(46, 204, 113, 0.15); }
.category-dining { background-color: rgba(230, 126, 34, 0.15); }
.category-shopping { background-color: rgba(52, 152, 219, 0.15); }
.category-entertainment { background-color: rgba(155, 89, 182, 0.15); }
.category-transport { background-color: rgba(241, 196, 15, 0.15); }
.category-utilities { background-color: rgba(52, 73, 94, 0.15); }
.category-healthcare { background-color: rgba(231, 76, 60, 0.15); }
.category-travel { background-color: rgba(26, 188, 156, 0.15); }
.category-income { background-color: rgba(46, 204, 113, 0.15); }
.category-subscription { background-color: rgba(155, 89, 182, 0.15); }
.category-transfer { background-color: rgba(52, 152, 219, 0.15); }
.category-other { background-color: rgba(149, 165, 166, 0.15); }

@media (max-width: 768px) {
  .transaction-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .transaction-icon {
    margin-bottom: 12px;
  }
  
  .transaction-amount {
    margin-left: 0;
    margin-top: 12px;
  }
  
  .info-row {
    flex-direction: column;
  }
  
  .info-label {
    width: 100%;
    margin-bottom: 4px;
  }
}
</style>