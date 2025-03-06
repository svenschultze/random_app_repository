<script setup>
import CardComponent from '@/components/ui/CardComponent.vue'
import TransactionList from '@/components/TransactionList.vue'

const props = defineProps({
  transactions: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

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
    title="Recent Transactions"
    :loading="loading"
    hasRefresh
    hasMore
    @refresh="handleRefresh"
    @more="handleMore"
    v-voix="'Recent Transactions Card'"
  >
    <TransactionList :transactions="transactions" :loading="loading" :limit="5" />
  </CardComponent>
</template>