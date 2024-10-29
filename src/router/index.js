// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Login from '../components/Login.vue';
import CreateBlog from '../components/CreateBlog.vue';
import Register from '../components/Register.vue';
import UserBlogs from '../components/UserBlogs.vue'; // Import UserBlogs component
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
  {
    path: '/create-blog',
    name: 'create-blog',
    component: CreateBlog,
    meta: { requiresAuth: true },
  },
  {
    path: '/my-blogs', // Add this new route
    name: 'user-blogs',
    component: UserBlogs,
    meta: { requiresAuth: true }, // This route requires authentication
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  let isNextCalled = false;

  // Check auth state
  onAuthStateChanged(auth, (user) => {
    if (isNextCalled) return;

    if (requiresAuth && !user) {
      isNextCalled = true; // Set the flag to prevent further calls
      next({ name: 'login' });
    } else {
      isNextCalled = true; // Set the flag for the successful call
      next();
    }
  });
});

export default router;
