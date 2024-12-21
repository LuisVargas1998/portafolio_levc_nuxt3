import { createRouter, createWebHistory } from 'vue-router'

import home from '@/pages/home.vue' 
import index from '@/pages/index.vue'


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {path: '/', name: '', component: index},
    {path: '/home', name: 'home', component: home},
  ],
})
