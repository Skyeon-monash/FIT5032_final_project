// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore' // 导入 authStore

// 导入所有视图组件
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import NewsView from '../views/NewsView.vue'
import ArticleDetailView from '../views/ArticleDetailView.vue'
import AboutView from '../views/AboutView.vue'
import ContactView from '../views/ContactView.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import AdminDataView from '../views/AdminDataView.vue'

const routes = [
  // 默认初始页面为主页
  { path: '/', name: 'Home', component: HomeView, meta: { requiresAuth: true } },

  // 公开访问的页面（无需登录）
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },

  // 需要登录才能访问的页面
  { path: '/news', name: 'News', component: NewsView, meta: { requiresAuth: true } },
  {
    path: '/article/:id',
    name: 'ArticleDetail',
    component: ArticleDetailView,
    meta: { requiresAuth: true },
  },
  { path: '/about', name: 'About', component: AboutView, meta: { requiresAuth: true } },
  { path: '/contact', name: 'Contact', component: ContactView, meta: { requiresAuth: true } },

  // 需要管理员角色才能访问的页面 (meta 中已包含 requiresAuth)
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiredRole: 'admin' },
  },
  {
    path: '/admin/data',
    name: 'AdminData',
    component: AdminDataView,
    meta: { requiresAuth: true, requiredRole: 'admin' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ===== 全局导航守卫 (MODIFIED) =====
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // 等待 Firebase 认证状态初始化完成
  // (这段逻辑保持不变，确保我们获取到最新的登录状态)
  if (!authStore.isAuthReady) {
    await new Promise((resolve) => {
      const unsubscribe = authStore.$onAction(({ name, after }) => {
        if (name === '$patch' || authStore.isAuthReady) {
          unsubscribe()
          resolve()
        }
      })
      if (authStore.isAuthReady) resolve()
    })
  }

  // **新的强制登录逻辑**
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const isLoggedIn = authStore.isLoggedIn

  if (requiresAuth && !isLoggedIn) {
    // 如果页面需要认证但用户未登录，则强制跳转到登录页
    next({ name: 'Login' })
  } else if (to.name === 'Login' && isLoggedIn) {
    // 如果用户已登录，但又试图访问登录页，则直接送他回主页
    next({ name: 'Home' })
  } else {
    // 之前的管理员角色检查逻辑现在可以简化，因为它已经包含在 requiresAuth 检查中了
    const requiredRole = to.meta.requiredRole
    if (requiredRole && authStore.role !== requiredRole) {
      // 角色不匹配，跳转到主页
      next({ name: 'Home' })
    } else {
      // 一切正常，放行
      next()
    }
  }
})

export default router
