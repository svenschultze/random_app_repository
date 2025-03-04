<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
const timeFrame = ref('week') // week, month, allTime
const category = ref('points') // points, streak, challenges

// Mock leaderboard data
const mockLeaderboard = ref({
  points: {
    week: [
      { id: 1, name: 'Alex', points: 320, streak: 5, challenges: 12, rank: 1 },
      { id: 2, name: 'Taylor', points: 280, streak: 3, challenges: 8, rank: 2 },
      { id: 3, name: 'Jordan', points: 250, streak: 4, challenges: 10, rank: 3 },
      { id: 4, name: 'Morgan', points: 220, streak: 2, challenges: 7, rank: 4 },
      { id: 5, name: 'Casey', points: 210, streak: 3, challenges: 9, rank: 5 },
      { id: 6, name: 'Riley', points: 190, streak: 2, challenges: 7, rank: 6 },
      { id: 7, name: 'Jamie', points: 180, streak: 1, challenges: 6, rank: 7 },
      { id: 8, name: 'Quinn', points: 170, streak: 2, challenges: 5, rank: 8 },
      { id: 9, name: 'Blake', points: 160, streak: 1, challenges: 5, rank: 9 },
      { id: 10, name: 'Devon', points: 150, streak: 1, challenges: 4, rank: 10 }
    ],
    month: [
      { id: 1, name: 'Morgan', points: 820, streak: 12, challenges: 35, rank: 1 },
      { id: 2, name: 'Alex', points: 780, streak: 10, challenges: 32, rank: 2 },
      { id: 3, name: 'Taylor', points: 750, streak: 9, challenges: 30, rank: 3 },
      { id: 4, name: 'Casey', points: 720, streak: 11, challenges: 25, rank: 4 },
      { id: 5, name: 'Jordan', points: 700, streak: 8, challenges: 28, rank: 5 },
      { id: 6, name: 'Riley', points: 650, streak: 7, challenges: 26, rank: 6 },
      { id: 7, name: 'Quinn', points: 620, streak: 9, challenges: 24, rank: 7 },
      { id: 8, name: 'Jamie', points: 590, streak: 8, challenges: 23, rank: 8 },
      { id: 9, name: 'Blake', points: 550, streak: 7, challenges: 22, rank: 9 },
      { id: 10, name: 'Devon', points: 520, streak: 6, challenges: 20, rank: 10 }
    ],
    allTime: [
      { id: 1, name: 'Morgan', points: 2850, streak: 25, challenges: 112, rank: 1 },
      { id: 2, name: 'Taylor', points: 2620, streak: 22, challenges: 105, rank: 2 },
      { id: 3, name: 'Alex', points: 2540, streak: 20, challenges: 98, rank: 3 },
      { id: 4, name: 'Jordan', points: 2470, streak: 18, challenges: 95, rank: 4 },
      { id: 5, name: 'Casey', points: 2380, streak: 19, challenges: 90, rank: 5 },
      { id: 6, name: 'Riley', points: 2250, streak: 16, challenges: 85, rank: 6 },
      { id: 7, name: 'Jamie', points: 2120, streak: 15, challenges: 80, rank: 7 },
      { id: 8, name: 'Quinn', points: 1980, streak: 14, challenges: 75, rank: 8 },
      { id: 9, name: 'Blake', points: 1850, streak: 12, challenges: 70, rank: 9 },
      { id: 10, name: 'Devon', points: 1720, streak: 10, challenges: 65, rank: 10 }
    ]
  },
  streak: {
    week: [
      { id: 1, name: 'Alex', points: 220, streak: 7, challenges: 10, rank: 1 },
      { id: 2, name: 'Casey', points: 190, streak: 6, challenges: 9, rank: 2 },
      { id: 3, name: 'Morgan', points: 210, streak: 5, challenges: 8, rank: 3 },
      { id: 4, name: 'Jordan', points: 180, streak: 4, challenges: 7, rank: 4 },
      { id: 5, name: 'Taylor', points: 170, streak: 3, challenges: 6, rank: 5 },
      { id: 6, name: 'Riley', points: 160, streak: 3, challenges: 6, rank: 6 },
      { id: 7, name: 'Jamie', points: 150, streak: 2, challenges: 5, rank: 7 },
      { id: 8, name: 'Quinn', points: 140, streak: 2, challenges: 5, rank: 8 },
      { id: 9, name: 'Blake', points: 130, streak: 1, challenges: 4, rank: 9 },
      { id: 10, name: 'Devon', points: 120, streak: 1, challenges: 4, rank: 10 }
    ],
    month: [
      { id: 1, name: 'Casey', points: 650, streak: 15, challenges: 25, rank: 1 },
      { id: 2, name: 'Morgan', points: 620, streak: 14, challenges: 24, rank: 2 },
      { id: 3, name: 'Alex', points: 600, streak: 12, challenges: 23, rank: 3 },
      { id: 4, name: 'Taylor', points: 580, streak: 11, challenges: 22, rank: 4 },
      { id: 5, name: 'Jordan', points: 550, streak: 10, challenges: 20, rank: 5 },
      { id: 6, name: 'Quinn', points: 520, streak: 9, challenges: 18, rank: 6 },
      { id: 7, name: 'Riley', points: 500, streak: 8, challenges: 18, rank: 7 },
      { id: 8, name: 'Jamie', points: 480, streak: 8, challenges: 17, rank: 8 },
      { id: 9, name: 'Blake', points: 460, streak: 7, challenges: 16, rank: 9 },
      { id: 10, name: 'Devon', points: 440, streak: 6, challenges: 15, rank: 10 }
    ],
    allTime: [
      { id: 1, name: 'Casey', points: 2500, streak: 45, challenges: 95, rank: 1 },
      { id: 2, name: 'Morgan', points: 2400, streak: 42, challenges: 92, rank: 2 },
      { id: 3, name: 'Alex', points: 2300, streak: 38, challenges: 88, rank: 3 },
      { id: 4, name: 'Taylor', points: 2200, streak: 35, challenges: 85, rank: 4 },
      { id: 5, name: 'Jordan', points: 2100, streak: 32, challenges: 80, rank: 5 },
      { id: 6, name: 'Riley', points: 2000, streak: 30, challenges: 78, rank: 6 },
      { id: 7, name: 'Quinn', points: 1900, streak: 28, challenges: 75, rank: 7 },
      { id: 8, name: 'Jamie', points: 1800, streak: 25, challenges: 72, rank: 8 },
      { id: 9, name: 'Blake', points: 1700, streak: 22, challenges: 68, rank: 9 },
      { id: 10, name: 'Devon', points: 1600, streak: 20, challenges: 65, rank: 10 }
    ]
  },
  challenges: {
    week: [
      { id: 1, name: 'Taylor', points: 240, streak: 5, challenges: 15, rank: 1 },
      { id: 2, name: 'Alex', points: 230, streak: 4, challenges: 14, rank: 2 },
      { id: 3, name: 'Jordan', points: 220, streak: 4, challenges: 13, rank: 3 },
      { id: 4, name: 'Casey', points: 210, streak: 3, challenges: 12, rank: 4 },
      { id: 5, name: 'Morgan', points: 200, streak: 3, challenges: 11, rank: 5 },
      { id: 6, name: 'Riley', points: 190, streak: 2, challenges: 10, rank: 6 },
      { id: 7, name: 'Quinn', points: 180, streak: 2, challenges: 9, rank: 7 },
      { id: 8, name: 'Jamie', points: 170, streak: 1, challenges: 8, rank: 8 },
      { id: 9, name: 'Blake', points: 160, streak: 1, challenges: 7, rank: 9 },
      { id: 10, name: 'Devon', points: 150, streak: 1, challenges: 6, rank: 10 }
    ],
    month: [
      { id: 1, name: 'Taylor', points: 750, streak: 12, challenges: 40, rank: 1 },
      { id: 2, name: 'Alex', points: 720, streak: 11, challenges: 38, rank: 2 },
      { id: 3, name: 'Jordan', points: 700, streak: 10, challenges: 36, rank: 3 },
      { id: 4, name: 'Morgan', points: 680, streak: 9, challenges: 34, rank: 4 },
      { id: 5, name: 'Casey', points: 650, streak: 8, challenges: 32, rank: 5 },
      { id: 6, name: 'Riley', points: 620, streak: 7, challenges: 30, rank: 6 },
      { id: 7, name: 'Quinn', points: 600, streak: 6, challenges: 28, rank: 7 },
      { id: 8, name: 'Jamie', points: 580, streak: 5, challenges: 26, rank: 8 },
      { id: 9, name: 'Blake', points: 550, streak: 4, challenges: 24, rank: 9 },
      { id: 10, name: 'Devon', points: 520, streak: 3, challenges: 22, rank: 10 }
    ],
    allTime: [
      { id: 1, name: 'Taylor', points: 2600, streak: 25, challenges: 130, rank: 1 },
      { id: 2, name: 'Alex', points: 2500, streak: 24, challenges: 125, rank: 2 },
      { id: 3, name: 'Jordan', points: 2400, streak: 22, challenges: 120, rank: 3 },
      { id: 4, name: 'Morgan', points: 2300, streak: 20, challenges: 115, rank: 4 },
      { id: 5, name: 'Casey', points: 2200, streak: 18, challenges: 110, rank: 5 },
      { id: 6, name: 'Riley', points: 2100, streak: 16, challenges: 105, rank: 6 },
      { id: 7, name: 'Quinn', points: 2000, streak: 15, challenges: 100, rank: 7 },
      { id: 8, name: 'Jamie', points: 1900, streak: 14, challenges: 95, rank: 8 },
      { id: 9, name: 'Blake', points: 1800, streak: 12, challenges: 90, rank: 9 },
      { id: 10, name: 'Devon', points: 1700, streak: 10, challenges: 85, rank: 10 }
    ]
  }
})

// Current user's ranking on the leaderboard
const userRanking = ref(null)

// The displayed leaderboard based on current filters
const currentLeaderboard = computed(() => {
  return mockLeaderboard.value[category.value][timeFrame.value]
})

const timeFrameLabel = computed(() => {
  switch(timeFrame.value) {
    case 'week': return 'This Week'
    case 'month': return 'This Month'
    case 'allTime': return 'All Time'
    default: return 'This Week'
  }
})

// Find user's position on the leaderboard (mock functionality)
function findUserRanking() {
  // Simulate that the current user is somewhere on the leaderboard
  // (random position between 5 and 20)
  const randomRank = Math.floor(Math.random() * 15) + 5
  
  userRanking.value = {
    rank: randomRank,
    name: userStore.user.name || 'You',
    points: userStore.userPoints,
    streak: userStore.userStreakDays,
    challenges: 5, // Mock value
    isCurrentUser: true
  }
}

onMounted(() => {
  findUserRanking()
})
</script>

<template>
  <div class="leaderboard-container">
    <div class="leaderboard-header">
      <h1>Leaderboard</h1>
      <p>See how you compare with other mind athletes!</p>
    </div>
    
    <div class="leaderboard-filters">
      <div class="filter-group">
        <label>Time Period</label>
        <div class="button-group">
          <button 
            :class="{ selected: timeFrame === 'week' }" 
            @click="timeFrame = 'week'"
          >
            Week
          </button>
          <button 
            :class="{ selected: timeFrame === 'month' }" 
            @click="timeFrame = 'month'"
          >
            Month
          </button>
          <button 
            :class="{ selected: timeFrame === 'allTime' }" 
            @click="timeFrame = 'allTime'"
          >
            All Time
          </button>
        </div>
      </div>
      
      <div class="filter-group">
        <label>Category</label>
        <div class="button-group">
          <button 
            :class="{ selected: category === 'points' }" 
            @click="category = 'points'"
          >
            Points
          </button>
          <button 
            :class="{ selected: category === 'streak' }" 
            @click="category = 'streak'"
          >
            Streak
          </button>
          <button 
            :class="{ selected: category === 'challenges' }" 
            @click="category = 'challenges'"
          >
            Challenges
          </button>
        </div>
      </div>
    </div>
    
    <div class="leaderboard-table-container">
      <h2>{{ timeFrameLabel }} Rankings</h2>
      
      <div class="leaderboard-table">
        <div class="table-header">
          <div class="col-rank">Rank</div>
          <div class="col-user">User</div>
          <div class="col-points">Points</div>
          <div class="col-streak">Streak</div>
          <div class="col-challenges">Challenges</div>
        </div>
        
        <div class="table-body">
          <div 
            v-for="user in currentLeaderboard" 
            :key="user.id"
            class="table-row"
            :class="{ 'current-user': user.name === userStore.user.name }"
          >
            <div class="col-rank">
              <div :class="{ 
                'rank-badge': true,
                'rank-1': user.rank === 1,
                'rank-2': user.rank === 2,
                'rank-3': user.rank === 3
              }">
                {{ user.rank }}
              </div>
            </div>
            <div class="col-user">{{ user.name }}</div>
            <div class="col-points">{{ user.points }}</div>
            <div class="col-streak">{{ user.streak }} days</div>
            <div class="col-challenges">{{ user.challenges }}</div>
          </div>
          
          <!-- User's position if not in top 10 -->
          <div v-if="userRanking && userRanking.rank > 10" class="table-divider">
            <span>...</span>
          </div>
          
          <div 
            v-if="userRanking && userRanking.rank > 10" 
            class="table-row current-user"
          >
            <div class="col-rank">{{ userRanking.rank }}</div>
            <div class="col-user">{{ userRanking.name }} (You)</div>
            <div class="col-points">{{ userRanking.points }}</div>
            <div class="col-streak">{{ userRanking.streak }} days</div>
            <div class="col-challenges">{{ userRanking.challenges }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="leaderboard-tips">
      <h3>Tips to Improve Your Ranking</h3>
      <ul>
        <li>Complete your daily challenges consistently to maintain your streak</li>
        <li>Try more difficult challenges for higher point rewards</li>
        <li>Focus on achieving personal bests in each challenge type</li>
        <li>Don't miss a day to keep your streak going!</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.leaderboard-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
}

.leaderboard-header {
  margin-bottom: 2rem;
}

.leaderboard-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  color: #333;
}

.leaderboard-header p {
  margin: 0;
  color: #666;
}

.leaderboard-filters {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-group label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #333;
}

.button-group {
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #eee;
}

.button-group button {
  flex: 1;
  background-color: #fff;
  border: none;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.button-group button:not(:last-child) {
  border-right: 1px solid #eee;
}

.button-group button:hover {
  background-color: #f0f7ff;
}

.button-group button.selected {
  background-color: #3a86ff;
  color: white;
}

.leaderboard-table-container {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.leaderboard-table-container h2 {
  margin: 0 0 1.25rem 0;
  font-size: 1.4rem;
  color: #333;
}

.leaderboard-table {
  width: 100%;
}

.table-header {
  display: flex;
  background-color: #f8f9fa;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  color: #666;
  margin-bottom: 0.5rem;
}

.table-row {
  display: flex;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: background-color 0.2s;
}

.table-row:hover {
  background-color: #f0f7ff;
}

.table-row.current-user {
  background-color: #e6efff;
  font-weight: 600;
}

.col-rank {
  width: 80px;
  display: flex;
  align-items: center;
}

.rank-badge {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #eee;
  font-weight: 600;
}

.rank-1 {
  background-color: gold;
  color: #333;
}

.rank-2 {
  background-color: silver;
  color: #333;
}

.rank-3 {
  background-color: #cd7f32; /* bronze */
  color: white;
}

.col-user {
  flex: 1;
  display: flex;
  align-items: center;
}

.col-points, .col-streak, .col-challenges {
  width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-divider {
  text-align: center;
  padding: 0.5rem;
  color: #999;
}

.leaderboard-tips {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.leaderboard-tips h3 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  color: #333;
}

.leaderboard-tips ul {
  margin: 0;
  padding-left: 1.5rem;
  color: #666;
}

.leaderboard-tips li {
  margin-bottom: 0.5rem;
}

@media (max-width: 767px) {
  .col-streak, .col-challenges {
    display: none;
  }
  
  .table-header {
    padding: 0.75rem 0.5rem;
  }
  
  .table-row {
    padding: 0.75rem 0.5rem;
  }
  
  .col-rank {
    width: 50px;
  }
  
  .col-points {
    width: 80px;
  }
}
</style>