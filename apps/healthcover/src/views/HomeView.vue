<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import store from '../store';
import LoadingSpinner from '../components/LoadingSpinner.vue';

const policy = computed(() => store.state.policy);
const isLoading = computed(() => store.state.isLoading);

function resetPolicy() {
  store.resetPolicy();
}
</script>

<template>
  <div class="home">
    <div v-if="isLoading">
      <LoadingSpinner message="Loading policy data..." />
    </div>
    
    <div v-else-if="!policy">
      <div class="card">
        <h2 class="card-title">Welcome to HealthCover Demo</h2>
        <p>
          This is a demonstration application for a health insurance portal.
          All data is generated randomly and stored locally in your browser.
        </p>
        
        <div class="action-buttons">
          <button class="btn" @click="resetPolicy">
            Generate Random Policy
          </button>
        </div>
      </div>
    </div>
    
    <div v-else>
      <div class="dashboard-header">
        <h2>Your Insurance Dashboard</h2>
        <button class="btn btn-secondary" @click="resetPolicy">Reset Demo Data</button>
      </div>
      
      <div class="dashboard-grid">
        <!-- Policy Overview Card -->
        <div class="card">
          <h3 class="card-title">Policy Overview</h3>
          <div class="policy-details">
            <div class="policy-detail">
              <span class="detail-label">Policy ID:</span>
              <span class="detail-value">{{ policy.policyId }}</span>
            </div>
            <div class="policy-detail">
              <span class="detail-label">Member:</span>
              <span class="detail-value">{{ policy.userName }}</span>
            </div>
            <div class="policy-detail">
              <span class="detail-label">Start Date:</span>
              <span class="detail-value">{{ policy.startDate }}</span>
            </div>
            <div class="policy-detail">
              <span class="detail-label">Membership Level:</span>
              <span class="detail-value membership-badge" :class="policy.membershipLevel.toLowerCase()">
                {{ policy.membershipLevel }}
              </span>
            </div>
          </div>
          <div class="card-footer">
            <RouterLink to="/profile" class="btn">View ID Card</RouterLink>
          </div>
        </div>
        
        <!-- Coverage Summary Card -->
        <div class="card">
          <h3 class="card-title">Coverage Summary</h3>
          <p class="coverage-summary">You have {{ policy.coveragePlans.length }} active coverage categories</p>
          <ul class="coverage-list">
            <li v-for="(plan, index) in policy.coveragePlans.slice(0, 3)" :key="index" class="coverage-item">
              <span class="coverage-category">{{ plan.category }}</span>
              <span class="coverage-limit">Up to {{ plan.coverageLimit }}€</span>
            </li>
          </ul>
          <div class="card-footer">
            <RouterLink to="/coverage" class="btn">View All Coverage</RouterLink>
          </div>
        </div>
        
        <!-- Recent Claims Card -->
        <div class="card">
          <h3 class="card-title">Recent Claims</h3>
          <ul class="claims-list">
            <li v-for="(claim, index) in policy.claims.slice(0, 3)" :key="index" class="claim-item">
              <div class="claim-info">
                <span class="claim-date">{{ claim.dateOfService }}</span>
                <span class="claim-description">{{ claim.description }}</span>
              </div>
              <div class="claim-status" :class="claim.status.toLowerCase().replace(' ', '-')">
                {{ claim.status }}
              </div>
            </li>
          </ul>
          <div class="card-footer">
            <RouterLink to="/claims" class="btn">View All Claims</RouterLink>
            <RouterLink to="/new-claim" class="btn btn-secondary">New Claim</RouterLink>
          </div>
        </div>
        
        <!-- Payment Card -->
        <div class="card">
          <h3 class="card-title">Payment Information</h3>
          <div class="policy-details">
            <div class="policy-detail">
              <span class="detail-label">Monthly Premium:</span>
              <span class="detail-value">{{ policy.premiumAmount }}€</span>
            </div>
            <div class="policy-detail">
              <span class="detail-label">Next Payment:</span>
              <span class="detail-value">{{ policy.nextPaymentDate }}</span>
            </div>
            <div class="policy-detail">
              <span class="detail-label">Payment Method:</span>
              <span class="detail-value">Direct Debit</span>
            </div>
          </div>
          <div class="card-footer">
            <button class="btn btn-secondary" disabled>Manage Payment</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.policy-details {
  margin-bottom: 1.5rem;
}

.policy-detail {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
  padding: 0.5rem 0;
}

.detail-label {
  font-weight: 600;
  color: var(--primary-color);
}

.detail-value {
  font-weight: 400;
}

.membership-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.membership-badge.basic {
  background-color: #6c757d;
  color: white;
}

.membership-badge.silver {
  background-color: #adb5bd;
  color: white;
}

.membership-badge.gold {
  background-color: #ffc107;
  color: #343a40;
}

.membership-badge.platinum {
  background-color: #343a40;
  color: white;
}

.coverage-summary {
  margin-bottom: 1rem;
}

.coverage-list {
  list-style: none;
  margin-bottom: 1rem;
}

.coverage-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
}

.coverage-category {
  font-weight: 600;
}

.coverage-limit {
  color: var(--primary-color);
}

.claims-list {
  list-style: none;
  margin-bottom: 1rem;
}

.claim-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
}

.claim-info {
  display: flex;
  flex-direction: column;
}

.claim-date {
  font-size: 0.8rem;
  color: #6c757d;
}

.claim-description {
  font-weight: 500;
}

.claim-status {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
}

.claim-status.approved {
  background-color: #28a745;
  color: white;
}

.claim-status.pending {
  background-color: #ffc107;
  color: #343a40;
}

.claim-status.rejected {
  background-color: #dc3545;
  color: white;
}

.claim-status.in-review {
  background-color: #17a2b8;
  color: white;
}

.card-footer {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}

.action-buttons {
  margin-top: 1.5rem;
}
</style>
