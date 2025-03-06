<script setup>
import { computed } from 'vue'
import CardComponent from '@/components/ui/CardComponent.vue'
import { formatCurrency } from '@/utils/mockData'

const props = defineProps({
  accounts: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const totalBalance = computed(() => {
  return props.accounts.reduce((total, account) => {
    // For credit cards, the balance is negative but we want to subtract it
    // from the total, so we add it (because it's already negative)
    if (account.type === 'credit') {
      return total + account.balance
    } else {
      return total + account.balance
    }
  }, 0)
})

const formattedTotalBalance = computed(() => formatCurrency(totalBalance.value))

const getAccountIcon = (type) => {
  if (type === 'checking') return '🏦'
  if (type === 'savings') return '💰'
  if (type === 'credit') return '💳'
  return '💵'
}

const getAccountClass = (type) => {
  if (type === 'checking') return 'account-checking'
  if (type === 'savings') return 'account-savings'
  if (type === 'credit') return 'account-credit'
  return ''
}

const emit = defineEmits(['refresh', 'more'])

const handleRefresh = () => {
  emit('refresh')
}

const handleMore = () => {
  emit('more')
}
</script>

<template>
  <CardComponent 
    title="Account Summary"
    :loading="loading"
    hasRefresh
    hasMore
    @refresh="handleRefresh"
    @more="handleMore"
    v-voix="'Account Summary Card'"
  >
    <div class="account-summary">
      <div class="total-balance">
        <h4 class="balance-label">Total Balance</h4>
        <p class="balance-value">{{ formattedTotalBalance }}</p>
      </div>
      
      <div class="accounts-list">
        <div 
          v-for="account in accounts" 
          :key="account.id" 
          class="account-item"
          v-voix="account.name + ' account'"
          :hint="account.type + ' account with balance of ' + formatCurrency(account.balance)"
        >
          <div class="account-icon" :class="getAccountClass(account.type)">
            <span>{{ getAccountIcon(account.type) }}</span>
          </div>
          
          <div class="account-details">
            <div class="account-name">{{ account.name }}</div>
            <div v-if="account.type === 'credit'" class="account-meta">
              Available: {{ formatCurrency(account.limit + account.balance) }}
            </div>
            <div v-else class="account-meta">
              Last updated: {{ account.lastUpdated }}
            </div>
          </div>
          
          <div class="account-balance" :class="{ 'negative': account.balance < 0 }">
            {{ formatCurrency(account.balance) }}
          </div>
        </div>
      </div>
    </div>
  </CardComponent>
</template>

<style scoped>
.account-summary {
  width: 100%;
}

.total-balance {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.balance-label {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-color);
  opacity: 0.7;
}

.balance-value {
  margin: 0.25rem 0 0;
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
}

.accounts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.account-item {
  display: flex;
  align-items: center;
}

.account-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 1rem;
  flex-shrink: 0;
}

.account-details {
  flex-grow: 1;
  min-width: 0;
}

.account-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.account-meta {
  font-size: 0.875rem;
  color: var(--text-color);
  opacity: 0.7;
}

.account-balance {
  font-weight: 600;
  text-align: right;
  flex-shrink: 0;
  margin-left: 1rem;
}

.account-balance.negative {
  color: #e74c3c;
}

/* Account type styles */
.account-checking {
  background-color: rgba(52, 152, 219, 0.15);
  color: #3498db;
}

.account-savings {
  background-color: rgba(46, 204, 113, 0.15);
  color: #2ecc71;
}

.account-credit {
  background-color: rgba(155, 89, 182, 0.15);
  color: #9b59b6;
}
</style>