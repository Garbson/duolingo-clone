// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import ExercisePage from '../views/ExercisePage.vue'

const routes = [
  {
    path: '/',
    redirect: '/exercise/1' // Start on first exercise
  },
  {
    path: '/exercise/:id',
    name: 'Exercise',
    component: ExercisePage,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router