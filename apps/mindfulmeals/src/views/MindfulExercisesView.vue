<script setup>
import { useExerciseStore } from '@/stores/exerciseStore';
import { computed } from 'vue';
import ExerciseCard from '@/components/ExerciseCard.vue';
import ExerciseModal from '@/components/ExerciseModal.vue';

const exerciseStore = useExerciseStore();
const exercises = computed(() => exerciseStore.exerciseList);
const isExerciseActive = computed(() => exerciseStore.isExerciseActive);
</script>

<template>
  <div class="mindful-exercises-view">
    <header class="mb-4">
      <h1 class="page-title" v-voix="'Mindful Eating Exercises'">Mindful Eating Exercises</h1>
      <p class="lead" v-voix="'Guided practices to help you develop a healthier relationship with food'">
        Guided practices to help you develop a healthier relationship with food
      </p>
      
      <div class="intro-card card mb-4" v-voix="'Introduction to mindful eating'">
        <div class="card-body">
          <h2 class="h5 mb-3">What is Mindful Eating?</h2>
          <p>
            Mindful eating involves paying full attention to the experience of eating and drinking, 
            both inside and outside the body. It includes awareness of:
          </p>
          <ul>
            <li>The colors, smells, flavors, and textures of your food</li>
            <li>The movement of your body as you eat</li>
            <li>Your body's hunger and fullness cues</li>
            <li>Your emotions and thoughts before, during, and after eating</li>
          </ul>
          <p>
            Research shows that mindful eating can help reduce binge eating, emotional eating, and improve 
            your overall relationship with food.
          </p>
        </div>
      </div>
    </header>
    
    <section class="exercises-section" v-voix="'Available exercises section'">
      <h2 class="section-title mb-4">Available Exercises</h2>
      
      <div class="row">
        <div class="col-md-6 col-lg-4 mb-4" v-for="exercise in exercises" :key="exercise.id">
          <ExerciseCard :exercise="exercise" />
        </div>
      </div>
    </section>
    
    <section class="tips-section mt-5" v-voix="'Tips for practice section'">
      <h2 class="section-title mb-4">Tips for Practice</h2>
      
      <div class="row">
        <div class="col-md-4 mb-4">
          <div class="tip-card card h-100">
            <div class="card-body">
              <h3 class="h5 mb-3" v-voix="'Start small'">Start Small</h3>
              <p>
                Begin with just one mindful meal per week. As it becomes a habit, you can gradually 
                increase to one meal per day, then eventually apply these practices more frequently.
              </p>
            </div>
          </div>
        </div>
        
        <div class="col-md-4 mb-4">
          <div class="tip-card card h-100">
            <div class="card-body">
              <h3 class="h5 mb-3" v-voix="'Remove distractions'">Remove Distractions</h3>
              <p>
                Turn off screens, put away your phone, and find a quiet spot to eat. This allows 
                you to focus fully on your meal and the sensations it provides.
              </p>
            </div>
          </div>
        </div>
        
        <div class="col-md-4 mb-4">
          <div class="tip-card card h-100">
            <div class="card-body">
              <h3 class="h5 mb-3" v-voix="'Be patient with yourself'">Be Patient With Yourself</h3>
              <p>
                Mindful eating is a skill that takes time to develop. Don't get discouraged if your 
                mind wanders during exercises—simply notice it and gently bring your attention back.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <ExerciseModal />
  </div>
</template>

<style scoped>
.page-title {
  color: #2c3e50;
  font-weight: 700;
}

.lead {
  color: #555;
}

.section-title {
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.intro-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: none;
  background-color: #f8f9fa;
}

.intro-card .card-body {
  padding: 1.5rem;
}

.intro-card h2 {
  color: #2c3e50;
  font-weight: 600;
}

.intro-card p, .intro-card ul {
  color: #555;
}

.tip-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: none;
  overflow: hidden;
}

.tip-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.tip-card h3 {
  color: #2c3e50;
  font-weight: 600;
}

.tip-card p {
  color: #555;
  font-size: 0.95rem;
}
</style>