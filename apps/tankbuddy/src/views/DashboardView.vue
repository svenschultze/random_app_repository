<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import StatCard from '../components/dashboard/StatCard.vue';
import RecentFillUps from '../components/dashboard/RecentFillUps.vue';
import TopStations from '../components/dashboard/TopStations.vue';
import { calculateStats, getMonthlySpending, getStations, getFillUps } from '../services/storageService';

const router = useRouter();
const stats = ref({
  totalSpent: 0,
  averagePricePerLiter: 0,
  averageConsumption: 0,
  totalVolume: 0,
  fillUpsCount: 0
});

const monthlyData = ref([]);

// Generate random data
const generateRandomData = () => {
  // Force regenerate stations and fill-ups
  getStations(true);
  getFillUps(true);
  
  // Reload stats
  loadData();
};

// Navigate to add fill-up page
const addNewFillUp = () => {
  router.push('/fillups/add');
};

// Load all data
const loadData = () => {
  stats.value = calculateStats();
  monthlyData.value = getMonthlySpending();
};

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1 class="page-title">TankBuddy Dashboard</h1>
      
      <div class="header-actions">
        <button 
          class="btn btn-primary" 
          @click="addNewFillUp"
          v-voix="'Add new fill-up button'"
        >
          Add Fill-up
        </button>
        <button 
          class="btn btn-secondary" 
          @click="generateRandomData"
          v-voix="'Generate random data button'"
          hint="Click to generate new random stations and fill-ups"
        >
          Generate Random Data
        </button>
      </div>
    </header>
    
    <div class="stats-grid">
      <StatCard 
        title="Total Spent" 
        :value="formatCurrency(stats.totalSpent)" 
      />
      
      <StatCard 
        title="Average Fuel Price" 
        :value="stats.averagePricePerLiter.toFixed(2)" 
        unit="per liter" 
      />
      
      <StatCard 
        title="Fuel Consumption" 
        :value="stats.averageConsumption.toFixed(1)" 
        unit="L/100km" 
      />
      
      <StatCard 
        title="Fill-ups" 
        :value="stats.fillUpsCount" 
      />
    </div>
    
    <div class="dashboard-content">
      <div class="content-column">
        <RecentFillUps />
      </div>
      
      <div class="content-column">
        <TopStations />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 1.5rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.625rem 1.25rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
}

.btn-primary {
  background-color: #3b82f6;
  color: #ffffff;
  border: none;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .dashboard-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .header-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .header-actions .btn {
    width: 100%;
  }
}
</style>