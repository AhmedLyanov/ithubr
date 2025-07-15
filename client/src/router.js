import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'
import NotFound from './views/NotFound.vue'
import Home from './views/Home.vue'
import About from './views/About.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  // /:pathMatch(.*)* - уникальная настройка, если ссылка неизвестна то он открывает компонент (NotFound) 
  { path: '/:pathMatch(.*)*', component: NotFound, meta: { hideSidebar: true} }
  
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;
