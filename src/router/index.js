import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '../views/HomeView.vue'

/*
Example:
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: {displayName: 'Login'}
    },
 */
const routes = [
    {
        path: '/',
        component: HomeView,
        name: 'home',
        meta: {displayName: 'Home'}
    },


    {
        path: '/contact',
        component: () => import('../views/ContactView.vue'),
        name: 'contact',
        meta: {displayName: 'Contact'}
    }

]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router