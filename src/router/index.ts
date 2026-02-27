import { createRouter, createWebHistory } from 'vue-router'
import Task1 from "@/views/Task1.vue";
import Task2 from "@/views/Task2.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'task1',
      component: Task1,
    },
    {
      path: '/task1',
      name: 'task1',
      component: Task1,
    },
    {
      path: '/task2',
      name: 'task2',
      component: Task2,
    },
  ],
})

export default router
