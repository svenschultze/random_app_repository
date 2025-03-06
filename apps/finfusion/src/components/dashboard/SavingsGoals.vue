<script setup>
import { computed } from 'vue'
import CardComponent from '@/components/ui/CardComponent.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import { formatCurrency } from '@/utils/mockData'

const props = defineProps({
  goals: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const goalProgress = computed(() => {
  return props.goals.map(goal => {
    const percentage = Math.round((goal.current / goal.target) * 100)
    const remaining = goal.target - goal.current
    
    return {
      ...goal,
      percentage,
      remainingFormatted: formatCurrency(remaining),
      currentFormatted: formatCurrency(goal.current),
      targetFormatted: formatCurrency(goal.target)
    }
  })
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
    title="Savings Goals"
    :loading="loading"
    hasRefresh
    hasMore
    @refresh="handleRefresh"
    @more="handleMore"
    v-voix="'Savings Goals Card'"
  >
    <div class="goals-list">
      <div 
        v-for="goal in goalProgress" 
        :key="goal.id" 
        class="goal-item"
        v-voix="goal.name + ' Goal'"
        :hint="'Goal with target of ' + goal.targetFormatted + ', currently at ' + goal.percentage + ' percent'"
      >
        <div class="goal-header">
          <div class="goal-icon-name">
            <span class="goal-icon">{{ goal.icon }}</span>
            <h4 class="goal-name">{{ goal.name }}</h4>
          </div>
          <div class="goal-amount">{{ goal.currentFormatted }} / {{ goal.targetFormatted }}</div>
        </div>
        
        <div class="goal-progress">
          <ProgressBar 
            :value="goal.percentage" 
            :color="goal.color" 
            height="10px" 
            showLabel
            labelPosition="right"
          />
        </div>
        
        <div class="goal-details">
          <div class="goal-remaining">{{ goal.remainingFormatted }} to go</div>
          <div class="goal-category">{{ goal.category }}</div>
        </div>
      </div>
    </div>
  </CardComponent>
</template>

<style scoped>
.goals-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.goal-item {
  width: 100%;
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.goal-icon-name {
  display: flex;
  align-items: center;
}

.goal-icon {
  margin-right: 0.75rem;
  font-size: 1.25rem;
}

.goal-name {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.goal-amount {
  font-weight: 600;
  font-size: 0.875rem;
}

.goal-progress {
  margin-bottom: 0.75rem;
}

.goal-details {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-color);
  opacity: 0.7;
}
</style>