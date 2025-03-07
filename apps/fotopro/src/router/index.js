import { createRouter, createWebHistory } from 'vue-router'
import LibraryView from '../views/LibraryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'library',
      component: LibraryView,
      meta: {
        'voix-description': 'Photo library showing all your images in a grid layout. You can filter, tag and organize photos here. Main landing page of the application.'
      }
    },
    {
      path: '/albums/:id?',
      name: 'albums',
      component: () => import('../views/AlbumsView.vue'),
      meta: {
        'voix-description': 'Album view showing photos organized by album. You can select an album from the sidebar, create new albums, and manage photos within albums.'
      }
    },
    {
      path: '/tags/:id?',
      name: 'tags',
      component: () => import('../views/TagsView.vue'),
      meta: {
        'voix-description': 'Tags view showing photos organized by tags. You can select a tag from the sidebar, create new tags, and manage photos with specific tags.'
      }
    },
    {
      path: '/editor/:id',
      name: 'editor',
      component: () => import('../views/EditorView.vue'),
      meta: {
        'voix-description': 'Photo editor workspace where you can adjust brightness, contrast, saturation, and apply transformations like rotate and flip. You can save edits or export in different formats.'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        'voix-description': 'About page with information about the FotoPro Editor application features, usage instructions, and technologies used.'
      }
    },
  ],
})

export default router
