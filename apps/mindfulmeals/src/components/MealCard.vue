<script setup>
defineProps({
  meal: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="card meal-card h-100">
    <img :src="meal.image" :alt="meal.name" class="card-img-top meal-image" v-voix="'Image of ' + meal.name" />
    <div class="card-body">
      <h5 class="card-title" v-voix="meal.name">{{ meal.name }}</h5>
      
      <div class="dietary-tags mb-2">
        <span v-for="tag in meal.dietary" :key="tag" class="badge bg-success me-1" v-voix="tag">
          {{ tag }}
        </span>
      </div>
      
      <div class="nutrition-info mb-3">
        <div class="row">
          <div class="col-6 col-md-3 mb-2">
            <div class="d-flex align-items-center">
              <span class="dot bg-primary"></span>
              <div class="ms-1">
                <div class="small text-muted">Calories</div>
                <div class="fw-bold">{{ meal.calories }}</div>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-3 mb-2">
            <div class="d-flex align-items-center">
              <span class="dot bg-danger"></span>
              <div class="ms-1">
                <div class="small text-muted">Protein</div>
                <div class="fw-bold">{{ meal.protein }}g</div>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-3 mb-2">
            <div class="d-flex align-items-center">
              <span class="dot bg-warning"></span>
              <div class="ms-1">
                <div class="small text-muted">Carbs</div>
                <div class="fw-bold">{{ meal.carbs }}g</div>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-3 mb-2">
            <div class="d-flex align-items-center">
              <span class="dot bg-info"></span>
              <div class="ms-1">
                <div class="small text-muted">Fat</div>
                <div class="fw-bold">{{ meal.fat }}g</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <p class="card-text mb-2" v-voix="'Preparation instructions: ' + meal.instructions">
        <strong>Preparation:</strong> {{ meal.instructions }}
      </p>
      
      <div class="time-info mt-3">
        <i class="bi bi-clock"></i> 
        <span class="ms-1" v-voix="'Preparation time: ' + meal.time">{{ meal.time }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.meal-card {
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.meal-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.meal-image {
  height: 180px;
  object-fit: cover;
}

.card-title {
  color: #2c3e50;
  font-weight: 600;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.time-info {
  color: #6c757d;
  font-size: 0.9rem;
}

.dietary-tags {
  min-height: 28px;
}
</style>