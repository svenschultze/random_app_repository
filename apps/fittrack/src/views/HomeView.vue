<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import StatCard from '@/components/StatCard.vue';
import ProgressRing from '@/components/ProgressRing.vue';
import ActivityChart from '@/components/ActivityChart.vue';
import { 
  getTodayLog, 
  getWorkouts, 
  getDailyLogs, 
  generateRandomDailyLogs, 
  generateRandomWorkouts,
  calculateStats, 
  calculateStreak,
  getUserSettings
} from '@/services/dataService';
import { getScheduledWorkouts } from '@/services/trainingProgramService';
import { getAllIntervalWorkouts } from '@/services/intervalWorkoutService';

const router = useRouter();
const isLoading = ref(true);
const isDataGenerated = ref(false);

const stats = reactive({
  todayLog: null,
  recentWorkouts: [],
  weeklyStats: null,
  streak: null,
  scheduledWorkouts: [],
  intervalWorkouts: []
});

const chartData = reactive({
  days: [],
  steps: [],
  calories: []
});

const settings = ref(null);

// Computed props for progress calculation
const stepProgress = computed(() => {
  if (!stats.todayLog || !settings.value) return 0;
  return Math.min(Math.round((stats.todayLog.steps / settings.value.stepGoal) * 100), 100);
});

const calorieProgress = computed(() => {
  if (!stats.todayLog || !settings.value) return 0;
  return Math.min(Math.round((stats.todayLog.calories / settings.value.calorieGoal) * 100), 100);
});

const activeMinutesProgress = computed(() => {
  if (!stats.todayLog || !settings.value) return 0;
  return Math.min(Math.round((stats.todayLog.activeMinutes / settings.value.activeMinutesGoal) * 100), 100);
});

const loadData = () => {
  isLoading.value = true;
  
  // Get user settings
  settings.value = getUserSettings();
  
  // Get today's log
  stats.todayLog = getTodayLog();
  
  // Get recent workouts
  const allWorkouts = getWorkouts();
  stats.recentWorkouts = allWorkouts
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);
  
  // Calculate weekly stats
  stats.weeklyStats = calculateStats(7);
  
  // Calculate streak
  stats.streak = calculateStreak();
  
  // Get scheduled workouts from training programs
  const today = new Date().toISOString().split('T')[0];
  stats.scheduledWorkouts = getScheduledWorkouts(today);
  
  // Get favorite interval workouts
  const intervalWorkouts = getAllIntervalWorkouts();
  stats.intervalWorkouts = intervalWorkouts
    .filter(workout => workout.favorite)
    .slice(0, 3);
  
  // Prepare chart data
  const dailyLogs = getDailyLogs()
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-7);
  
  chartData.days = dailyLogs.map(log => {
    const date = new Date(log.date);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  });
  
  chartData.steps = dailyLogs.map(log => log.steps);
  chartData.calories = dailyLogs.map(log => log.calories);
  
  isLoading.value = false;
};

const generateDemoData = () => {
  generateRandomDailyLogs(30);
  generateRandomWorkouts(15);
  isDataGenerated.value = true;
  loadData();
};

const goToAddWorkout = () => {
  router.push('/add-workout');
};

const goToPrograms = () => {
  router.push('/programs');
};

const goToIntervalWorkouts = () => {
  router.push('/interval-workouts');
};

const startIntervalWorkout = (workoutId) => {
  router.push(`/interval-workouts/${workoutId}`);
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="home-view">
    <div class="header-actions">
      <h1 v-voix="'dashboard-heading'">Dashboard</h1>
      <div class="action-buttons">
        <button 
          class="btn btn-generate" 
          @click="generateDemoData" 
          :disabled="isDataGenerated"
          v-voix="'generate-data-button'"
          hint="Generate random fitness data for demonstration purposes"
        >
          {{ isDataGenerated ? 'Data Generated' : 'Generate Demo Data' }}
        </button>
        <button 
          class="btn btn-primary" 
          @click="goToAddWorkout"
          v-voix="'add-workout-button'"
          hint="Go to form to add a new workout"
        >
          Add Workout
        </button>
      </div>
    </div>

    <section class="loading-section" v-if="isLoading">
      <p v-voix="'loading-message'">Loading your fitness data...</p>
    </section>

    <template v-else>
      <!-- Today's Progress Section -->
      <section class="today-section">
        <h2 class="section-title" v-voix="'today-progress-heading'">Today's Progress</h2>
        
        <div class="progress-grid">
          <div class="progress-item">
            <ProgressRing 
              :progress="stepProgress" 
              color="#4CAF50" 
              label="Steps" 
              v-voix="'steps-progress-ring'"
              hint="Steps progress toward daily goal"
            />
            <div class="progress-details">
              <p class="progress-value" v-voix="'steps-value'">{{ stats.todayLog.steps }}</p>
              <p class="progress-target" v-voix="'steps-goal'">Goal: {{ settings.stepGoal }}</p>
            </div>
          </div>
          
          <div class="progress-item">
            <ProgressRing 
              :progress="calorieProgress" 
              color="#FF9800" 
              label="Calories" 
              v-voix="'calories-progress-ring'"
              hint="Calories progress toward daily goal"
            />
            <div class="progress-details">
              <p class="progress-value" v-voix="'calories-value'">{{ stats.todayLog.calories }}</p>
              <p class="progress-target" v-voix="'calories-goal'">Goal: {{ settings.calorieGoal }}</p>
            </div>
          </div>
          
          <div class="progress-item">
            <ProgressRing 
              :progress="activeMinutesProgress" 
              color="#2196F3" 
              label="Active Min" 
              v-voix="'active-minutes-progress-ring'"
              hint="Active minutes progress toward daily goal"
            />
            <div class="progress-details">
              <p class="progress-value" v-voix="'active-minutes-value'">{{ stats.todayLog.activeMinutes }}</p>
              <p class="progress-target" v-voix="'active-minutes-goal'">Goal: {{ settings.activeMinutesGoal }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Summary Stats Section -->
      <section class="stats-section">
        <h2 class="section-title" v-voix="'summary-stats-heading'">This Week's Summary</h2>
        
        <div class="stats-grid">
          <StatCard 
            title="Steps Daily Average" 
            :value="stats.weeklyStats.avgSteps.toLocaleString()" 
            icon="directions_walk" 
            color="#4CAF50"
            statId="avg-steps"
          />
          
          <StatCard 
            title="Calories Daily Average" 
            :value="stats.weeklyStats.avgCalories.toLocaleString()" 
            icon="local_fire_department" 
            color="#FF9800"
            statId="avg-calories"
          />
          
          <StatCard 
            title="Active Minutes Daily Average" 
            :value="stats.weeklyStats.avgActiveMinutes.toLocaleString()" 
            icon="timer" 
            color="#2196F3"
            statId="avg-active-minutes"
          />
          
          <StatCard 
            title="Total Workouts" 
            :value="stats.weeklyStats.totalWorkouts.toString()" 
            icon="fitness_center" 
            color="#9C27B0"
            statId="total-workouts"
          />
          
          <StatCard 
            title="Current Streak" 
            :value="`${stats.streak.currentStreak} days`" 
            :description="stats.streak.currentStreak > 0 ? 'Keep it up!' : 'Start today!'" 
            icon="whatshot" 
            color="#F44336"
            statId="current-streak"
          />
          
          <StatCard 
            title="Best Streak" 
            :value="`${stats.streak.bestStreak} days`" 
            icon="emoji_events" 
            color="#FFC107"
            statId="best-streak"
          />
        </div>
      </section>

      <!-- Activity Chart Section -->
      <section class="chart-section">
        <h2 class="section-title" v-voix="'activity-chart-heading'">Activity Trends</h2>
        
        <div class="chart-container">
          <ActivityChart
            type="bar"
            :data="chartData.steps"
            :labels="chartData.days"
            label="Daily Steps"
            backgroundColor="rgba(76, 175, 80, 0.2)"
            borderColor="rgba(76, 175, 80, 1)"
            height="250px"
          />
        </div>
      </section>

      <!-- Recent Workouts Section -->
      <section class="recent-workouts-section">
        <div class="section-header">
          <h2 class="section-title" v-voix="'recent-workouts-heading'">Recent Workouts</h2>
          <RouterLink 
            to="/workouts" 
            class="view-all-link"
            v-voix="'view-all-workouts-link'"
            hint="Go to full workout history page"
          >
            View All
          </RouterLink>
        </div>
        
        <div v-if="stats.recentWorkouts.length === 0" class="empty-state" v-voix="'no-workouts-message'">
          No workouts recorded yet. Add your first workout to track your progress!
        </div>
        
        <div v-else class="workouts-list">
          <div 
            v-for="workout in stats.recentWorkouts" 
            :key="workout.id" 
            class="workout-card"
            v-voix="`recent-workout-${workout.id}`"
            :hint="`${workout.type} workout on ${new Date(workout.date).toLocaleDateString()}`"
          >
            <div class="workout-type">{{ workout.type }}</div>
            <div class="workout-date">{{ new Date(workout.date).toLocaleDateString() }}</div>
            <div class="workout-details">
              <span>{{ workout.duration }} min</span>
              <span v-if="workout.distance"> • {{ workout.distance }} km</span>
              <span> • {{ workout.caloriesBurned }} cal</span>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Today's Scheduled Workouts Section -->
      <section class="scheduled-workouts-section">
        <div class="section-header">
          <h2 class="section-title">Today's Program Workouts</h2>
          <button 
            class="view-all-button"
            @click="goToPrograms"
            v-voix="'button-view-all-programs'"
            hint="View all training programs and plans">
            All Programs
          </button>
        </div>
        
        <div v-if="stats.scheduledWorkouts.length === 0" class="empty-state">
          No workouts scheduled for today. Start a training program to get daily workout plans!
        </div>
        
        <div v-else class="workouts-list">
          <div 
            v-for="(scheduled, index) in stats.scheduledWorkouts" 
            :key="index" 
            class="workout-card program-workout-card">
            <div class="program-badge">{{ scheduled.programName }}</div>
            <div class="workout-type">{{ scheduled.workout.name }}</div>
            <div class="workout-description">{{ scheduled.workout.description }}</div>
            <div class="workout-details">
              <span>{{ scheduled.workout.type }}</span>
              <span> • {{ scheduled.workout.targetDuration }} min</span>
              <span v-if="scheduled.workout.targetDistance"> • {{ scheduled.workout.targetDistance }} km</span>
            </div>
            <RouterLink 
              :to="`/programs/${scheduled.programId}`"
              class="program-link"
              v-voix="'link-to-program-details-' + scheduled.programId"
              :hint="'View workout details in ' + scheduled.programName + ' program'">
              View in Program
            </RouterLink>
          </div>
        </div>
      </section>
      
      <!-- Interval Workouts Section -->
      <section class="interval-workouts-section">
        <div class="section-header">
          <h2 class="section-title">Interval Workouts</h2>
          <button 
            class="view-all-button"
            @click="goToIntervalWorkouts"
            v-voix="'button-browse-all-intervals'"
            hint="Browse all available interval workouts">
            Browse Intervals
          </button>
        </div>
        
        <div v-if="stats.intervalWorkouts.length === 0" class="empty-state">
          No favorite interval workouts yet. Browse intervals to find guided workouts!
        </div>
        
        <div v-else class="workouts-list">
          <div 
            v-for="workout in stats.intervalWorkouts" 
            :key="workout.id" 
            class="workout-card interval-workout-card">
            <div class="interval-badge">Interval</div>
            <div class="workout-type">{{ workout.name }}</div>
            <div class="workout-description">{{ workout.description }}</div>
            <div class="workout-details">
              <span>{{ Math.floor(workout.totalDuration / 60) }}:{{ (workout.totalDuration % 60).toString().padStart(2, '0') }}</span>
              <span> • {{ workout.intervals.length }} intervals</span>
              <span> • {{ workout.estimatedCalories }} cal</span>
            </div>
            <button 
              class="start-interval-btn" 
              @click="startIntervalWorkout(workout.id)"
              v-voix="'button-start-interval-workout-' + workout.id"
              :hint="'Start the ' + workout.name + ' interval workout'">
              Start Workout
            </button>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.home-view {
  max-width: 100%;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

h1 {
  font-size: 1.8rem;
  color: var(--text-color);
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.25rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 0.9rem;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
}

.btn-generate {
  background-color: var(--accent-color);
  color: white;
}

.btn-generate:hover {
  background-color: #F57C00;
}

.btn-generate:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.section-title {
  font-size: 1.3rem;
  margin-bottom: 1.25rem;
  color: var(--text-color);
}

section {
  margin-bottom: 2.5rem;
}

.progress-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.progress-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.progress-details {
  margin-top: 1rem;
  text-align: center;
}

.progress-value {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.progress-target {
  font-size: 0.9rem;
  color: var(--text-light);
  margin: 0.25rem 0 0 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.chart-container {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.view-all-link, .view-all-button {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
}

.view-all-link:hover {
  text-decoration: underline;
}

.view-all-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.view-all-button:hover {
  text-decoration: underline;
}

.workouts-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.workout-card {
  background-color: white;
  padding: 1.25rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.workout-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.workout-type {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.workout-date {
  color: var(--text-light);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.workout-details {
  color: var(--text-color);
  font-size: 0.95rem;
}

.workout-description {
  color: var(--text-light);
  font-size: 0.9rem;
  margin: 0.5rem 0;
  line-height: 1.4;
}

.program-badge, .interval-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  border-radius: 12px;
  margin-bottom: 0.5rem;
}

.program-badge {
  background-color: #e3f2fd;
  color: #1976d2;
}

.interval-badge {
  background-color: #fce4ec;
  color: #c2185b;
}

.program-workout-card, .interval-workout-card {
  position: relative;
  padding-bottom: 3rem;
}

.program-link, .start-interval-btn {
  position: absolute;
  bottom: 1.25rem;
  left: 1.25rem;
  right: 1.25rem;
  text-align: center;
  padding: 0.5rem 0;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
}

.program-link {
  background-color: #e3f2fd;
  color: #1976d2;
}

.start-interval-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
}

.empty-state {
  background-color: white;
  padding: 2rem;
  text-align: center;
  color: var(--text-light);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px dashed var(--border-color);
}

.loading-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

@media (max-width: 768px) {
  .header-actions {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .action-buttons {
    width: 100%;
    justify-content: space-between;
  }
  
  .workouts-list {
    grid-template-columns: 1fr;
  }
}
</style>
