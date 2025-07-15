import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import NotFound from './views/NotFound.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/framework/:frameworkId', name: 'Framework', component: Home, props: true },
  { path: '/framework/:frameworkId/topic/:topicId', name: 'Topic', component: Home, props: true },
  { path: '/framework/:frameworkId/topic/:topicId/subtopic/:subtopicName', name: 'Subtopic', component: Home, props: true },
  { path: '/about', name: 'About', component: About },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      const sanitizeId = (name) => {
        if (!name) return ''
        return name
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
          .replace(/-+/g, '-')
          .trim()
      }
      const sanitizedHash = sanitizeId(decodeURIComponent(to.hash.replace('#', '')))
      console.log('Router scrollBehavior:', to.hash, 'Sanitized:', `#${sanitizedHash}`)
      return {
        el: `#${sanitizedHash}`,
        behavior: 'smooth'
      }
    }
    return { top: 0, behavior: 'smooth' }
  }
})

export default router