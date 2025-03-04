<template>
  <div class="landlord">
    <h1>Landlord Portal</h1>
    <div class="dashboard">
      <div class="section">
        <h2>My Properties</h2>
        <div class="property-list">
          <div v-if="loading">Loading properties...</div>
          <div v-else-if="properties.length === 0" class="empty-state">
            No properties listed yet. Add your first property to get started.
          </div>
          <div v-else class="property-grid">
            <div v-for="property in properties" :key="property.id" class="property-card">
              <div class="property-image">
                <img :src="property.imageUrl || '/placeholder-property.jpg'" alt="Property image">
              </div>
              <div class="property-details">
                <h3>{{ property.title }}</h3>
                <p class="address">{{ property.address }}</p>
                <p class="price">${{ property.price }}/month</p>
                <p class="status" :class="property.status">{{ property.status }}</p>
              </div>
              <div class="property-actions">
                <button @click="editProperty(property.id)" class="btn btn-edit">Edit</button>
                <button @click="togglePropertyStatus(property.id)" class="btn btn-status">
                  {{ property.status === 'available' ? 'Mark as Rented' : 'Mark as Available' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <button @click="showAddPropertyModal = true" class="btn btn-primary btn-add">Add New Property</button>
      </div>
      
      <div class="section">
        <h2>Tenant Applications</h2>
        <div v-if="applications.length === 0" class="empty-state">
          No applications to review at the moment.
        </div>
        <div v-else class="applications-list">
          <div v-for="application in applications" :key="application.id" class="application-card">
            <div class="application-header">
              <h3>{{ application.propertyTitle }}</h3>
              <span class="application-date">Applied: {{ formatDate(application.date) }}</span>
            </div>
            <div class="applicant-details">
              <p><strong>Applicant:</strong> {{ application.applicantName }}</p>
              <p><strong>Contact:</strong> {{ application.applicantEmail }}</p>
              <p><strong>Status:</strong> <span :class="application.status">{{ application.status }}</span></p>
            </div>
            <div class="application-actions">
              <button @click="reviewApplication(application.id)" class="btn btn-review">Review</button>
              <button @click="approveApplication(application.id)" class="btn btn-approve" 
                      :disabled="application.status !== 'pending'">Approve</button>
              <button @click="rejectApplication(application.id)" class="btn btn-reject" 
                      :disabled="application.status !== 'pending'">Reject</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Mock data - would be replaced with real data from Firebase
const loading = ref(true);
const properties = ref([]);
const applications = ref([]);
const showAddPropertyModal = ref(false);

// Sample property data
const sampleProperties = [
  {
    id: '1',
    title: '2 Bedroom Apartment in Downtown',
    address: '123 Main St, City, 12345',
    price: 1500,
    status: 'available',
    imageUrl: '/src/assets/sample-property-1.jpg'
  },
  {
    id: '2',
    title: 'Modern Studio near University',
    address: '456 College Ave, City, 12345',
    price: 950,
    status: 'rented',
    imageUrl: '/src/assets/sample-property-2.jpg'
  },
  {
    id: '3',
    title: 'Luxury 3 Bedroom Penthouse',
    address: '789 Sky Tower, Financial District, 12345',
    price: 3800,
    status: 'available',
    imageUrl: '/src/assets/sample-property-3.jpg'
  },
  {
    id: '4',
    title: 'Cozy 1 Bedroom Cottage',
    address: '101 Garden Lane, Suburb, 12345',
    price: 1100,
    status: 'available',
    imageUrl: '/src/assets/sample-property-4.jpg'
  },
  {
    id: '5',
    title: 'Historic Loft in Arts District',
    address: '202 Artist Way, Arts District, 12345',
    price: 1650,
    status: 'rented',
    imageUrl: '/src/assets/sample-property-5.jpg'
  },
  {
    id: '6',
    title: 'Waterfront 4 Bedroom House',
    address: '303 Lakeside Dr, Waterfront, 12345',
    price: 2900,
    status: 'available',
    imageUrl: '/src/assets/sample-property-6.jpg'
  },
  {
    id: '7',
    title: 'Contemporary Townhouse with Garage',
    address: '404 Modern Ave, New Development, 12345',
    price: 2200,
    status: 'available',
    imageUrl: '/src/assets/sample-property-7.jpg'
  },
  {
    id: '8',
    title: 'Charming Studio in Historic Building',
    address: '505 Heritage St, Old Town, 12345',
    price: 875,
    status: 'rented',
    imageUrl: '/src/assets/sample-property-8.jpg'
  },
  {
    id: '9',
    title: 'Spacious 5 Bedroom Family Home',
    address: '606 Family Circle, Suburb, 12345',
    price: 3200,
    status: 'available',
    imageUrl: '/src/assets/sample-property-9.jpg'
  },
  {
    id: '10',
    title: 'Eco-Friendly 2 Bedroom with Solar Panels',
    address: '707 Green Ave, Eco District, 12345',
    price: 1725,
    status: 'available',
    imageUrl: '/src/assets/sample-property-10.jpg'
  },
  {
    id: '11',
    title: 'Industrial Loft with High Ceilings',
    address: '808 Factory St, Warehouse District, 12345',
    price: 1950,
    status: 'rented',
    imageUrl: '/src/assets/sample-property-11.jpg'
  },
  {
    id: '12',
    title: 'Luxury Condo with Gym Access',
    address: '909 Fitness Blvd, City Center, 12345',
    price: 2450,
    status: 'available',
    imageUrl: '/src/assets/sample-property-12.jpg'
  },
  {
    id: '13',
    title: 'Pet-Friendly 1 Bedroom with Yard',
    address: '111 Pet Lane, Garden District, 12345',
    price: 1250,
    status: 'available',
    imageUrl: '/src/assets/sample-property-13.jpg'
  },
  {
    id: '14',
    title: 'Urban Micro-Apartment',
    address: '222 Tiny St, Downtown, 12345',
    price: 795,
    status: 'rented',
    imageUrl: '/src/assets/sample-property-14.jpg'
  },
  {
    id: '15',
    title: 'Renovated 3 Bedroom Victorian',
    address: '333 Heritage Ave, Historic District, 12345',
    price: 2800,
    status: 'available',
    imageUrl: '/src/assets/sample-property-15.jpg'
  }
];

// Sample applications data
const sampleApplications = [
  {
    id: '1',
    propertyTitle: '2 Bedroom Apartment in Downtown',
    applicantName: 'Jane Smith',
    applicantEmail: 'jane.smith@example.com',
    date: new Date(2023, 5, 15),
    status: 'pending'
  },
  {
    id: '2',
    propertyTitle: 'Modern Studio near University',
    applicantName: 'John Doe',
    applicantEmail: 'john.doe@example.com',
    date: new Date(2023, 5, 10),
    status: 'approved'
  },
  {
    id: '3',
    propertyTitle: 'Luxury 3 Bedroom Penthouse',
    applicantName: 'Emma Johnson',
    applicantEmail: 'emma.johnson@example.com',
    date: new Date(2023, 6, 2),
    status: 'pending'
  },
  {
    id: '4',
    propertyTitle: 'Waterfront 4 Bedroom House',
    applicantName: 'Michael Chen',
    applicantEmail: 'michael.chen@example.com',
    date: new Date(2023, 6, 5),
    status: 'pending'
  },
  {
    id: '5',
    propertyTitle: 'Luxury 3 Bedroom Penthouse',
    applicantName: 'Sarah Williams',
    applicantEmail: 'sarah.williams@example.com',
    date: new Date(2023, 6, 3),
    status: 'rejected'
  },
  {
    id: '6',
    propertyTitle: 'Contemporary Townhouse with Garage',
    applicantName: 'Robert Garcia',
    applicantEmail: 'robert.garcia@example.com',
    date: new Date(2023, 5, 28),
    status: 'approved'
  },
  {
    id: '7',
    propertyTitle: 'Eco-Friendly 2 Bedroom with Solar Panels',
    applicantName: 'Olivia Taylor',
    applicantEmail: 'olivia.taylor@example.com',
    date: new Date(2023, 6, 1),
    status: 'pending'
  },
  {
    id: '8',
    propertyTitle: 'Pet-Friendly 1 Bedroom with Yard',
    applicantName: 'David Wilson',
    applicantEmail: 'david.wilson@example.com',
    date: new Date(2023, 5, 25),
    status: 'approved'
  },
  {
    id: '9',
    propertyTitle: 'Luxury Condo with Gym Access',
    applicantName: 'Jennifer Martinez',
    applicantEmail: 'jennifer.martinez@example.com',
    date: new Date(2023, 6, 4),
    status: 'pending'
  },
  {
    id: '10',
    propertyTitle: 'Renovated 3 Bedroom Victorian',
    applicantName: 'James Thompson',
    applicantEmail: 'james.thompson@example.com',
    date: new Date(2023, 5, 30),
    status: 'rejected'
  }
];

onMounted(() => {
  // Simulate API fetch
  setTimeout(() => {
    properties.value = sampleProperties;
    applications.value = sampleApplications;
    loading.value = false;
  }, 1000);
});

// Utility function to format dates
function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Property management functions
function editProperty(propertyId) {
  console.log('Edit property', propertyId);
  // Would open edit modal or navigate to edit page
}

function togglePropertyStatus(propertyId) {
  const property = properties.value.find(p => p.id === propertyId);
  if (property) {
    property.status = property.status === 'available' ? 'rented' : 'available';
    // Would save to database in real implementation
  }
}

// Application management functions
function reviewApplication(applicationId) {
  console.log('Review application', applicationId);
  // Would open detail view for this application
}

function approveApplication(applicationId) {
  const application = applications.value.find(a => a.id === applicationId);
  if (application && application.status === 'pending') {
    application.status = 'approved';
    // Would save to database in real implementation
  }
}

function rejectApplication(applicationId) {
  const application = applications.value.find(a => a.id === applicationId);
  if (application && application.status === 'pending') {
    application.status = 'rejected';
    // Would save to database in real implementation
  }
}
</script>

<style scoped>
.landlord {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  margin-bottom: 2rem;
  color: var(--color-heading);
}

.dashboard {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .dashboard {
    grid-template-columns: repeat(2, 1fr);
  }
}

.section {
  background-color: var(--color-background-soft);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

h2 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: var(--color-heading);
}

.empty-state {
  text-align: center;
  padding: 2rem;
  background-color: var(--color-background-mute);
  border-radius: 4px;
  color: var(--color-text);
}

.property-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

@media (min-width: 1024px) {
  .property-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.property-card {
  background: var(--color-background);
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.property-image img {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.property-details {
  padding: 1rem;
}

.property-details h3 {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.property-details .address {
  color: var(--color-text-light);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.property-details .price {
  font-weight: bold;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.property-details .status {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  text-transform: capitalize;
}

.property-details .status.available {
  background-color: rgba(39, 174, 96, 0.2);
  color: #27ae60;
}

.property-details .status.rented {
  background-color: rgba(41, 128, 185, 0.2);
  color: #2980b9;
}

.property-actions {
  display: flex;
  padding: 0.5rem 1rem 1rem;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-edit {
  background-color: #f1c40f;
  color: #333;
}

.btn-edit:hover {
  background-color: #f39c12;
}

.btn-status {
  background-color: #e0e0e0;
  color: #333;
}

.btn-status:hover {
  background-color: #ccc;
}

.btn-add {
  width: 100%;
  margin-top: 1rem;
  padding: 0.75rem;
  font-weight: bold;
}

.applications-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.application-card {
  background: var(--color-background);
  border-radius: 6px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.application-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.application-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.application-date {
  font-size: 0.8rem;
  color: var(--color-text-light);
}

.applicant-details {
  margin-bottom: 1rem;
}

.applicant-details p {
  margin: 0.25rem 0;
}

.applicant-details .pending {
  color: #f39c12;
}

.applicant-details .approved {
  color: #27ae60;
}

.applicant-details .rejected {
  color: #e74c3c;
}

.application-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-review {
  background-color: #3498db;
  color: white;
}

.btn-review:hover {
  background-color: #2980b9;
}

.btn-approve {
  background-color: #27ae60;
  color: white;
}

.btn-approve:hover {
  background-color: #219653;
}

.btn-reject {
  background-color: #e74c3c;
  color: white;
}

.btn-reject:hover {
  background-color: #c0392b;
}

.btn:disabled {
  background-color: #e0e0e0;
  color: #999;
  cursor: not-allowed;
}
</style>