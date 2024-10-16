import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/components/Login.vue';
import AdminBoard from '@/components/AdminBoard.vue';

const routes = [
  { path: '/login', name:"Login", component: Login },
  { 
    path: '/', 
    name:"AdminBoard",
    component: AdminBoard,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const jwt = localStorage.getItem('jwt');

  if (to.matched.some(record => record.meta.requiresAuth) && !jwt) {
    next('/login');
  } else {
    next();
  }
});

export default router;
