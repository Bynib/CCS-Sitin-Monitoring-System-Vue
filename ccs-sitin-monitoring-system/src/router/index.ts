import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '@/views/LandingView.vue';
import LoginView from '@/views/LoginView.vue';
import RegistrationView from '@/views/RegistrationView.vue';
import DashboardView from '@/views/DashboardView.vue';
import Announcement from '@/views/AnnouncementView.vue';
import SitInRules from '@/views/SitInRulesView.vue';
import LabRulesView from '@/views/LabRulesView.vue';
import SitinHistoryView from '@/views/SitinHistoryView.vue';
import ReservationView from '@/views/ReservationView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegistrationView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/announcement',
      name: 'announcement',
      component: Announcement
    },
    {
      path: '/sitin-rules',
      name: 'sitin-rules',
      component: SitInRules
    },
    {
      path: '/laboratory-rules',
      name: 'laboratory-rules',
      component: LabRulesView
    },
    {
      path: '/sitin-history',
      name: 'sitin-history',
      component: SitinHistoryView
    },
    {
      path: '/reservation',
      name: 'reservation',
      component: ReservationView
    }
  ],
})

export default router
