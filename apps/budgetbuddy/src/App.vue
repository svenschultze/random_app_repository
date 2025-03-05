<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <div class="logo-container">
        <img alt="BudgetBuddy logo" class="logo" src="@/assets/logo.svg" width="40" height="40" />
        <h1 class="app-title">BudgetBuddy</h1>
      </div>
      
      <nav class="main-nav">
        <RouterLink to="/" v-voix="'NavigateHome'" hint="Return to dashboard">Home</RouterLink>
        <RouterLink to="/transactions" v-voix="'NavigateTransactions'" hint="View and manage transactions">Transactions</RouterLink>
        <RouterLink to="/budgets" v-voix="'NavigateBudgets'" hint="View and manage budget categories">Budgets</RouterLink>
        <RouterLink to="/savings" v-voix="'NavigateSavings'" hint="View and manage savings goals">Savings</RouterLink>
        <RouterLink to="/analytics" v-voix="'NavigateAnalytics'" hint="View financial reports">Analytics</RouterLink>
        <RouterLink to="/profile" v-voix="'NavigateProfile'" hint="Manage your account settings">Profile</RouterLink>
      </nav>
    </header>

    <main class="app-content">
      <RouterView />
    </main>
    
    <footer class="app-footer">
      <p>© 2025 BudgetBuddy - Your Personal Finance Assistant</p>
    </footer>
  </div>
</template>

<style>
@import '@/assets/main.css';

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: var(--color-background-soft);
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.app-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-heading);
}

.main-nav {
  display: flex;
  gap: 1rem;
}

.main-nav a {
  color: var(--color-text);
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.main-nav a:hover {
  background-color: var(--color-background-mute);
}

.main-nav a.router-link-active {
  color: var(--color-heading);
  background-color: var(--color-background-mute);
  font-weight: 600;
}

.app-content {
  flex: 1;
  padding: 2rem 1rem;
  width: 100%;
  margin: 0 auto;
}

.app-footer {
  background-color: var(--color-background-soft);
  padding: 1rem;
  text-align: center;
  font-size: 0.875rem;
  border-top: 1px solid var(--color-border);
}

@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .main-nav {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
  
  .app-content {
    padding: 1rem 0.5rem;
  }
}
</style>