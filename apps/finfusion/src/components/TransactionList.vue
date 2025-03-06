<script setup>
import { computed } from 'vue'

const props = defineProps({
  transactions: {
    type: Array,
    required: true,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  limit: {
    type: Number,
    default: 0
  }
})

const limitedTransactions = computed(() => {
  if (props.limit && props.limit > 0) {
    return props.transactions.slice(0, props.limit)
  }
  return props.transactions
})

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
  }
  
  return icons[category] || '📝'
}

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
  }
  
  return classes[category] || 'category-other'
}
</script>

<template>
  <div class="transaction-list" v-voix="'Transaction List'">
    <div v-if="loading" class="loading-state">
      <div class="loading-item" v-for="i in 5" :key="i"></div>
    </div>
    
    <div v-else-if="transactions.length === 0" class="empty-state">
      <p>No transactions to display</p>
    </div>
    
    <ul v-else class="transactions">
      <li 
        v-for="transaction in limitedTransactions" 
        :key="transaction.id" 
        class="transaction-item"
        v-voix="'Transaction from ' + transaction.merchant"
        :hint="'Transaction of ' + transaction.formattedAmount + ' on ' + transaction.formattedDate"
      >
        <div class="transaction-icon" :class="getCategoryClass(transaction.category)">
          <span>{{ getTransactionIcon(transaction.category) }}</span>
        </div>
        
        <div class="transaction-details">
          <div class="transaction-merchant">{{ transaction.merchant }}</div>
          <div class="transaction-meta">
            <span class="transaction-category">{{ transaction.category }}</span>
            <span class="transaction-date">{{ transaction.formattedDate }}</span>
          </div>
        </div>
        
        <div class="transaction-amount" :class="{ 'positive': transaction.amount > 0, 'negative': transaction.amount < 0 }">
          {{ transaction.formattedAmount }}
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.transaction-list {
  width: 100%;
}

.transactions {
  list-style: none;
  padding: 0;
  margin: 0;
}

.transaction-item {
  display: flex;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  margin-right: 1rem;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.transaction-details {
  flex-grow: 1;
  min-width: 0;
}

.transaction-merchant {
  font-weight: 600;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.transaction-meta {
  display: flex;
  font-size: 0.875rem;
  color: var(--text-color);
  opacity: 0.7;
}

.transaction-category {
  margin-right: 1rem;
}

.transaction-amount {
  font-weight: 600;
  text-align: right;
  flex-shrink: 0;
  margin-left: 1rem;
}

.transaction-amount.positive {
  color: var(--secondary-color, #2ecc71);
}

.transaction-amount.negative {
  color: #e74c3c;
}

.loading-state {
  padding: 1rem 0;
}

.loading-item {
  height: 60px;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, var(--border-color) 25%, var(--card-background) 50%, var(--border-color) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: var(--text-color);
  opacity: 0.7;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
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
</style>