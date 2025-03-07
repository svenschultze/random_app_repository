<script setup>
import { computed } from 'vue';
import store from '../store';
import LoadingSpinner from '../components/LoadingSpinner.vue';

const policy = computed(() => store.state.policy);
const isLoading = computed(() => store.state.isLoading);

// Generate a QR code placeholder (in a real app this would be an actual QR code)
const qrCodePlaceholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150"><rect width="150" height="150" fill="white"/><rect x="20" y="20" width="20" height="20" fill="black"/><rect x="40" y="20" width="20" height="20" fill="black"/><rect x="60" y="20" width="20" height="20" fill="black"/><rect x="20" y="40" width="20" height="20" fill="black"/><rect x="60" y="40" width="20" height="20" fill="black"/><rect x="100" y="40" width="20" height="20" fill="black"/><rect x="20" y="60" width="20" height="20" fill="black"/><rect x="80" y="60" width="20" height="20" fill="black"/><rect x="20" y="80" width="20" height="20" fill="black"/><rect x="40" y="80" width="20" height="20" fill="black"/><rect x="80" y="80" width="20" height="20" fill="black"/><rect x="20" y="100" width="20" height="20" fill="black"/><rect x="60" y="100" width="20" height="20" fill="black"/><rect x="80" y="100" width="20" height="20" fill="black"/><rect x="100" y="100" width="20" height="20" fill="black"/></svg>';
</script>

<template>
  <div class="profile-view">
    <h2>Your ID Card</h2>
    
    <div v-if="isLoading">
      <LoadingSpinner message="Loading profile data..." />
    </div>
    
    <div v-else-if="!policy">
      <div class="card">
        <p>No policy data available. Please go to the Dashboard to generate a policy.</p>
      </div>
    </div>
    
    <div v-else>
      <div class="id-card-container">
        <div class="id-card">
          <div class="id-card-header">
            <div class="id-card-company">
              <h3>HealthCover</h3>
              <span class="id-card-demo-tag">DEMO</span>
            </div>
            <div class="id-card-type">Health Insurance Card</div>
          </div>
          
          <div class="id-card-body">
            <div class="id-card-user-info">
              <div class="id-card-member-name">{{ policy.userName }}</div>
              <div class="id-card-member-id">
                <span class="id-label">Policy ID:</span> {{ policy.policyId }}
              </div>
              <div class="id-card-member-since">
                <span class="id-label">Member Since:</span> {{ policy.startDate }}
              </div>
              <div class="id-card-member-level">
                <span class="id-label">Membership Level:</span>
                <span class="id-card-badge" :class="policy.membershipLevel.toLowerCase()">
                  {{ policy.membershipLevel }}
                </span>
              </div>
            </div>
            
            <div class="id-card-avatar">
              <div class="avatar-placeholder">
                {{ policy.userName.split(' ').map(name => name[0]).join('') }}
              </div>
              <img :src="qrCodePlaceholder" alt="QR Code" class="id-card-qr" />
            </div>
          </div>
          
          <div class="id-card-footer">
            <div class="id-card-disclaimer">
              This is a demonstration card only. Not a valid insurance document.
            </div>
            <div class="id-card-contact">
              <div>Emergency: +49 123 456 789</div>
              <div>Customer Service: +49 987 654 321</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="profile-actions card">
        <h3>ID Card Actions</h3>
        <div class="action-buttons">
          <button class="btn" disabled>Download PDF</button>
          <button class="btn btn-secondary" disabled>Send via Email</button>
        </div>
        <p class="profile-note">
          Note: These actions are disabled in the demo version.
        </p>
      </div>
      
      <div class="emergency-info card">
        <h3>Emergency Information</h3>
        <p>For emergency assistance while traveling, please contact our 24/7 helpline:</p>
        <div class="emergency-phone">+49 123 456 789</div>
        <p>Please have your policy ID ready when calling.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-view {
  max-width: 800px;
  margin: 0 auto;
}

.id-card-container {
  margin: 2rem 0;
  display: flex;
  justify-content: center;
}

.id-card {
  width: 100%;
  max-width: 500px;
  background: linear-gradient(135deg, #2c3e50, #4b6cb7);
  border-radius: 12px;
  overflow: hidden;
  color: white;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.id-card-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.id-card-company {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.id-card-company h3 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
}

.id-card-demo-tag {
  background-color: rgba(255, 255, 255, 0.2);
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-weight: 700;
}

.id-card-type {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 0.25rem;
}

.id-card-body {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
}

.id-card-user-info {
  flex: 1;
}

.id-card-member-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.id-card-member-id,
.id-card-member-since,
.id-card-member-level {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.id-label {
  opacity: 0.8;
}

.id-card-badge {
  display: inline-block;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.id-card-badge.basic {
  background-color: rgba(255, 255, 255, 0.2);
}

.id-card-badge.silver {
  background-color: #adb5bd;
  color: #343a40;
}

.id-card-badge.gold {
  background-color: #ffc107;
  color: #343a40;
}

.id-card-badge.platinum {
  background-color: #e9ecef;
  color: #343a40;
}

.id-card-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.avatar-placeholder {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
}

.id-card-qr {
  width: 80px;
  height: 80px;
  background-color: white;
  border-radius: 4px;
}

.id-card-footer {
  padding: 1rem 1.5rem;
  background-color: rgba(0, 0, 0, 0.2);
  font-size: 0.8rem;
}

.id-card-disclaimer {
  margin-bottom: 0.5rem;
  font-style: italic;
  opacity: 0.7;
}

.id-card-contact {
  display: flex;
  justify-content: space-between;
}

.profile-actions {
  margin-bottom: 1.5rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
}

.profile-note {
  font-size: 0.9rem;
  color: #6c757d;
  font-style: italic;
}

.emergency-info {
  background-color: #f8f9fa;
}

.emergency-phone {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-color);
  margin: 1rem 0;
}

/* Media query for smaller screens */
@media (max-width: 576px) {
  .id-card-body {
    flex-direction: column;
  }
  
  .id-card-avatar {
    flex-direction: row;
    justify-content: space-between;
    margin-top: 1.5rem;
  }
  
  .id-card-contact {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>