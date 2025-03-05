<script setup>
import { ref, computed } from 'vue'
import { addVote } from '@/store/polls'

const props = defineProps({
  poll: {
    type: Object,
    required: true
  },
  showResult: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['voted'])
const selectedOption = ref(null)
const showResults = ref(props.showResult)

const totalVotes = computed(() => {
  return props.poll.options.reduce((sum, option) => sum + option.votes, 0)
})

const getPercentage = (votes) => {
  if (totalVotes.value === 0) return 0
  return Math.round((votes / totalVotes.value) * 100)
}

const handleVote = (optionId) => {
  if (!showResults.value) {
    selectedOption.value = optionId
    addVote(props.poll.id, optionId)
    showResults.value = true
    emit('voted', { pollId: props.poll.id, optionId })
  }
}
</script>

<template>
  <div class="poll-card">
    <h2 class="poll-question" v-voix="'poll-question'">{{ poll.question }}</h2>
    
    <div class="poll-options">
      <div 
        v-for="option in poll.options" 
        :key="option.id"
        class="poll-option"
        :class="{ 
          'selected': selectedOption === option.id,
          'result-view': showResults 
        }"
        @click="handleVote(option.id)"
        v-voix="'poll-option-' + option.id"
        :hint="'Poll option: ' + option.text"
      >
        <div class="option-content">
          <span class="option-text">{{ option.text }}</span>
          <span v-if="showResults" class="vote-count">
            {{ option.votes }} votes ({{ getPercentage(option.votes) }}%)
          </span>
        </div>
        
        <div v-if="showResults" class="progress-bar-container">
          <div 
            class="progress-bar" 
            :style="{ width: getPercentage(option.votes) + '%' }"
          ></div>
        </div>
      </div>
    </div>
    
    <div v-if="showResults" class="total-votes" v-voix="'total-votes'">
      Total votes: {{ totalVotes }}
    </div>
  </div>
</template>

<style scoped>
.poll-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.poll-question {
  font-size: 1.4rem;
  margin-bottom: 20px;
  color: #333;
}

.poll-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.poll-option {
  background-color: #f5f5f5;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.poll-option:hover:not(.result-view) {
  background-color: #e8f4fd;
  border-color: #0084ff;
}

.poll-option.selected {
  background-color: #e1f0ff;
  border-color: #0084ff;
}

.option-content {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}

.option-text {
  font-weight: 500;
}

.vote-count {
  font-size: 0.9rem;
  color: #666;
}

.progress-bar-container {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: transparent;
  z-index: 1;
}

.progress-bar {
  height: 100%;
  background-color: rgba(0, 132, 255, 0.15);
  transition: width 0.8s ease-in-out;
}

.total-votes {
  margin-top: 15px;
  font-size: 0.9rem;
  color: #666;
  text-align: right;
}

.result-view {
  cursor: default;
}
</style>