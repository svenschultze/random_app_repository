<script setup>
import FileExplorer from '../components/FileExplorer.vue'
import { ref } from 'vue'

const pageTitle = ref('My Files')
</script>

<template>
  <main>
    <h1 class="page-title" v-voix="'My Files Page'">{{ pageTitle }}</h1>
    <FileExplorer />
  </main>
</template>

<style scoped>
.page-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}
</style>
