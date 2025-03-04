<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="not-found-icon">404</div>
      <h1>Page Not Found</h1>
      <p>The page you are looking for doesn't exist or has been moved.</p>
      <Button 
        label="Go Home" 
        icon="pi pi-home" 
        @click="$router.push('/')" 
        class="p-button-primary"
      />
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  text-align: center;
  padding: 2rem;
}

.not-found-content {
  max-width: 500px;
}

.not-found-icon {
  font-size: 6rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.not-found h1 {
  margin-bottom: 1rem;
}

.not-found p {
  color: var(--text-color-secondary);
  margin-bottom: 2rem;
}
</style>