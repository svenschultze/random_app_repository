<script setup>
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import store from '../store';
import LoadingSpinner from '../components/LoadingSpinner.vue';

const policy = computed(() => store.state.policy);
const isLoading = computed(() => store.state.isLoading);
const selectedClaim = ref(null);

function viewClaimDetails(claim) {
  selectedClaim.value = claim;
}

function closeDetails() {
  selectedClaim.value = null;
}
</script>

<template>
  <div class="claims-view">
    <div class="claims-header">
      <h2>Claims History</h2>
      <RouterLink to="/new-claim" class="btn">New Claim</RouterLink>
    </div>
    
    <div v-if="isLoading">
      <LoadingSpinner message="Loading claims data..." />
    </div>
    
    <div v-else-if="!policy">
      <div class="card">
        <p>No policy data available. Please go to the Dashboard to generate a policy.</p>
      </div>
    </div>
    
    <div v-else>
      <div class="card">
        <div class="claims-filters">
          <div class="search-filter">
            <input type="text" placeholder="Search claims..." disabled />
            <button class="btn btn-secondary" disabled>Search</button>
          </div>
          <div class="status-filter">
            <label>Filter by status:</label>
            <select disabled>
              <option value="all">All Claims</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="in-review">In Review</option>
            </select>
          </div>
        </div>
        
        <div class="claims-table-container">
          <table class="claims-table">
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Date of Service</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="claim in policy.claims" :key="claim.claimId">
                <td>{{ claim.claimId }}</td>
                <td>{{ claim.dateOfService }}</td>
                <td>{{ claim.category }}</td>
                <td>{{ claim.amount }}€</td>
                <td>
                  <span class="claim-status" :class="claim.status.toLowerCase().replace(' ', '-')">
                    {{ claim.status }}
                  </span>
                </td>
                <td>
                  <button class="btn-link" @click="viewClaimDetails(claim)">View Details</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- Claim Details Modal -->
    <div v-if="selectedClaim" class="modal-overlay" @click.self="closeDetails">
      <div class="modal-content card">
        <div class="modal-header">
          <h3>Claim Details</h3>
          <button class="close-btn" @click="closeDetails">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="claim-detail-grid">
            <div class="claim-detail-item">
              <span class="detail-label">Claim ID:</span>
              <span class="detail-value">{{ selectedClaim.claimId }}</span>
            </div>
            <div class="claim-detail-item">
              <span class="detail-label">Date of Service:</span>
              <span class="detail-value">{{ selectedClaim.dateOfService }}</span>
            </div>
            <div class="claim-detail-item">
              <span class="detail-label">Date Submitted:</span>
              <span class="detail-value">{{ selectedClaim.createdDate }}</span>
            </div>
            <div class="claim-detail-item">
              <span class="detail-label">Coverage Category:</span>
              <span class="detail-value">{{ selectedClaim.category }}</span>
            </div>
            <div class="claim-detail-item">
              <span class="detail-label">Amount:</span>
              <span class="detail-value">{{ selectedClaim.amount }}€</span>
            </div>
            <div class="claim-detail-item">
              <span class="detail-label">Status:</span>
              <span class="detail-value claim-status" :class="selectedClaim.status.toLowerCase().replace(' ', '-')">
                {{ selectedClaim.status }}
              </span>
            </div>
            <div class="claim-detail-item claim-detail-full">
              <span class="detail-label">Description:</span>
              <span class="detail-value">{{ selectedClaim.description }}</span>
            </div>
          </div>
          
          <div class="claim-status-timeline">
            <h4>Claim Timeline</h4>
            <ul class="timeline">
              <li class="timeline-item">
                <div class="timeline-marker completed"></div>
                <div class="timeline-content">
                  <h5>Claim Submitted</h5>
                  <p>{{ selectedClaim.createdDate }}</p>
                </div>
              </li>
              <li class="timeline-item">
                <div class="timeline-marker" :class="{ 'completed': selectedClaim.status !== 'Pending' }"></div>
                <div class="timeline-content">
                  <h5>Under Review</h5>
                  <p v-if="selectedClaim.status === 'In Review'">Your claim is currently being reviewed by our team.</p>
                  <p v-else-if="selectedClaim.status !== 'Pending'">Reviewed on {{ new Date(new Date(selectedClaim.createdDate).getTime() + 3*24*60*60*1000).toISOString().split('T')[0] }}</p>
                </div>
              </li>
              <li class="timeline-item">
                <div class="timeline-marker" :class="{ 'completed': selectedClaim.status === 'Approved' || selectedClaim.status === 'Rejected' }"></div>
                <div class="timeline-content">
                  <h5>Decision</h5>
                  <p v-if="selectedClaim.status === 'Approved'">Your claim was approved.</p>
                  <p v-else-if="selectedClaim.status === 'Rejected'">Your claim was rejected.</p>
                  <p v-else>Pending decision</p>
                </div>
              </li>
              <li class="timeline-item" v-if="selectedClaim.status === 'Approved'">
                <div class="timeline-marker" :class="{ 'completed': Math.random() > 0.5 }"></div>
                <div class="timeline-content">
                  <h5>Payment</h5>
                  <p v-if="Math.random() > 0.5">Payment of {{ Math.floor(selectedClaim.amount * 0.8) }}€ processed.</p>
                  <p v-else>Payment processing</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn" @click="closeDetails">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.claims-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.claims-filters {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-filter {
  display: flex;
  gap: 0.5rem;
}

.search-filter input {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  min-width: 200px;
}

.status-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-filter select {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.claims-table-container {
  overflow-x: auto;
}

.claims-table {
  width: 100%;
  border-collapse: collapse;
}

.claims-table th,
.claims-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.claims-table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.claims-table tr:hover {
  background-color: #f8f9fa;
}

.btn-link {
  background: none;
  border: none;
  color: var(--secondary-color);
  cursor: pointer;
  padding: 0;
  font-size: 0.9rem;
  text-decoration: underline;
}

.btn-link:hover {
  color: #3aa876;
}

.claim-status {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
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

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  border-top: 1px solid var(--border-color);
  padding: 1rem 1.5rem;
  text-align: right;
}

.claim-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.claim-detail-full {
  grid-column: span 2;
}

.claim-detail-item {
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.detail-value {
  font-weight: 500;
}

/* Timeline styles */
.claim-status-timeline {
  margin-top: 2rem;
}

.claim-status-timeline h4 {
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.timeline {
  position: relative;
  list-style: none;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 7px;
  width: 2px;
  background-color: #e9ecef;
}

.timeline-item {
  position: relative;
  padding-bottom: 1.5rem;
}

.timeline-marker {
  position: absolute;
  left: -30px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #e9ecef;
  border: 2px solid white;
}

.timeline-marker.completed {
  background-color: var(--secondary-color);
}

.timeline-content h5 {
  margin: 0 0 0.5rem;
  color: var(--primary-color);
}

.timeline-content p {
  margin: 0;
  font-size: 0.9rem;
  color: #6c757d;
}
</style>