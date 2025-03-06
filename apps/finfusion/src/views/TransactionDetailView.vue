<script setup>
import { ref, computed, onMounted } from 'vue';
import { useFinanceStore } from '@/stores/finance';
import { useRoute, useRouter } from 'vue-router';
import { formatCurrency } from '@/utils/mockData';
import CardComponent from '@/components/ui/CardComponent.vue';

const financeStore = useFinanceStore();
const route = useRoute();
const router = useRouter();
const isLoading = ref(true);
const transaction = ref({});

// Get transaction ID from route params
const transactionId = computed(() => route.params.id);

// Fetch transaction data
onMounted(async () => {
  if (!financeStore.isDataLoaded) {
    await financeStore.initializeData();
  }
  
  // Find transaction by ID
  transaction.value = financeStore.transactions.find(t => t.id === transactionId.value) || {};
  
  isLoading.value = false;
});

const isPositive = computed(() => {
  return transaction.value.amount > 0;
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

// Navigate back to previous page
const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="transaction-detail-view" v-voix="'Transaction Detail Page'">
    <div class="page-header">
      <button @click="goBack" class="back-button" v-voix="'Go Back'">
        ← Back
      </button>
      <h1 class="page-title">Transaction Details</h1>
    </div>
    
    <div v-if="isLoading" class="loading-container">
      <div class="loader"></div>
      <p>Loading transaction details...</p>
    </div>
    
    <div v-else-if="!transaction.id" class="no-data">
      Transaction not found
    </div>
    
    <div v-else class="transaction-content">
      <!-- Transaction Header -->
      <CardComponent>
        <div class="transaction-header">
          <div class="transaction-icon" :class="getCategoryClass(transaction.category)">
            <span>{{ getTransactionIcon(transaction.category) }}</span>
          </div>
          
          <div class="transaction-title">
            <h2>{{ transaction.merchant }}</h2>
            <p class="transaction-date">{{ transaction.formattedDate }}</p>
          </div>
          
          <div class="transaction-amount" :class="{ 'positive': isPositive, 'negative': !isPositive }">
            {{ transaction.formattedAmount }}
          </div>
        </div>
      </CardComponent>
      
      <!-- Transaction Details -->
      <CardComponent title="Transaction Details">
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
      </CardComponent>
      
      <!-- Transaction Notes -->
      <CardComponent title="Notes">
        <div class="transaction-notes">
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
      </CardComponent>
      
      <!-- Similar Transactions -->
      <CardComponent title="Similar Transactions">
        <div class="similar-transactions">
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
      </CardComponent>
      
      <!-- Action Buttons -->
      <div class="action-buttons">
        <button class="secondary-button" v-voix="'Export Transaction'">
          Export
        </button>
        <button class="primary-button" v-voix="'Dispute Transaction'">
          Dispute
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.transaction-detail-view {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.back-button {
  background: none;
  border: none;
  color: var(--primary-color);
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-right: 1rem;
}

.page-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-color);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: var(--text-color);
  opacity: 0.6;
}

.loader {
  border: 3px solid var(--border-color);
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-data {
  text-align: center;
  padding: 3rem;
  color: var(--text-color);
  opacity: 0.7;
  font-size: 1.25rem;
}

.transaction-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.transaction-header {
  display: flex;
  align-items: center;
  padding: 1.5rem;
}

.transaction-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 12px;
  margin-right: 1.5rem;
  font-size: 1.75rem;
  flex-shrink: 0;
}

.transaction-title {
  flex-grow: 1;
}

.transaction-title h2 {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
}

.transaction-date {
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.7;
}

.transaction-amount {
  font-size: 1.75rem;
  font-weight: 700;
  margin-left: 1.5rem;
}

.positive {
  color: var(--secondary-color, #2ecc71);
}

.negative {
  color: #e74c3c;
}

.transaction-info {
  padding: 1rem 0;
}

.info-row {
  display: flex;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.info-row:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.info-label {
  width: 140px;
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
  padding: 0.5rem 0;
}

.notes-input-container textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--card-background);
  color: var(--text-color);
  resize: vertical;
  margin-bottom: 0.75rem;
}

.notes-actions {
  display: flex;
  justify-content: flex-end;
}

.save-button {
  padding: 0.5rem 1rem;
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
  padding: 1rem;
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
  margin-right: 1.5rem;
  opacity: 0.7;
}

.similar-amount {
  font-weight: 600;
  width: 100px;
  text-align: right;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.primary-button {
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.secondary-button {
  padding: 0.75rem 1.5rem;
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
    margin-bottom: 1rem;
  }
  
  .transaction-amount {
    margin-left: 0;
    margin-top: 1rem;
    align-self: flex-end;
  }
  
  .info-row {
    flex-direction: column;
  }
  
  .info-label {
    width: 100%;
    margin-bottom: 0.5rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .primary-button, .secondary-button {
    width: 100%;
  }
}
</style>