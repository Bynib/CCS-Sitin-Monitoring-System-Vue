import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '@/views/LandingView.vue';
import LoginView from '@/views/LoginView.vue';
import RegistrationView from '@/views/student/RegistrationView.vue';
import ProfileView from '@/views/student/ProfileView.vue';
import Dashboard from '@/views/student/DashboardView.vue';
import SitInRules from '@/views/SitInRulesView.vue';
import LabRulesView from '@/views/student/LabRulesView.vue';
import SitinHistoryView from '@/views/student/SitinHistoryView.vue';
import ReservationView from '@/views/student/ReservationView.vue';
import AdminHome from '@/views/admin/HomeView.vue';
import Students from '@/views/admin/StudentsView.vue';
import AddAnnouncementModal from '@/components/AddAnnouncementModalView.vue';
import SitinView from '@/views/admin/SitinView.vue';
import RecordView from '@/views/admin/RecordView.vue';
import FeedbackModalView from '@/components/FeedbackModalView.vue';
import FeedbackView from '@/views/admin/FeedbackView.vue';

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
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
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
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminHome
    },
    {
      path: '/students',
      name: 'students',
      component: Students
    },
    {
      path: '/add-announcement',
      name: 'add-announcement',
      component: AddAnnouncementModal
    },
    {
      path: '/sitins',
      name: 'sitins',
      component: SitinView
    },
    {
      path: '/records',
      name: 'records',
      component: RecordView
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: FeedbackModalView
    },
    {
      path: '/feedbacks',
      name: 'feedbacks',
      component: FeedbackView
    }
  ],
})

export default router
