<template>
  <Sidebar class="bg-[#2e2e2e]" >
    <SidebarHeader>
      <div class="p-4 border-b flex items-center border-[#333]">
        <img
          @click="handleLogoClick"
          src="@/assets/CCS_LOGO.png"
          alt="CCS Logo"
          class="cursor-pointer size-16 drop-shadow-logo"
        />
        <span class="text-md font-bold ml-2">CCS Sit-In System</span>
      </div>
    </SidebarHeader>
    
    <SidebarContent>
      
      <!-- Admin Navigation -->
      <SidebarGroup v-if="isAdmin">
        <SidebarGroupLabel>Administration</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="link in adminLinks" :key="link.to">
              <SidebarMenuButton asChild>
                <RouterLink 
                  :to="link.to"
                  class="flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200"
                  :class="{
                    'bg-yellow-500 hover:bg-yellow-600 text-gray-900': isActive(link.to),
                    'hover:bg-[#333]': !isActive(link.to)
                  }"
                >
                <!-- w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold transition-colors -->
                  <component :is="link.icon" class="h-5 w-5" />
                  <span>{{ link.label }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <!-- Student Navigation -->
      <SidebarGroup v-else>
        <SidebarGroupLabel>Student</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="link in studentLinks" :key="link.to">
              <SidebarMenuButton asChild>
                <RouterLink 
                  :to="link.to"
                  class="flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200"
                  :class="{
                    'bg-yellow-500 hover:bg-yellow-600 text-gray-900': isActive(link.to),
                    'hover:bg-[#333]': !isActive(link.to)
                  }"
                >
                  <component :is="link.icon" class="h-5 w-5" />
                  <span>{{ link.label }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <button
                  @click="toggleNotifications"
                  class="flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200 w-full text-left hover:bg-[#333] relative"
                >
                  <Bell class="h-5 w-5" />
                  <span>Notifications</span>
                  <span 
                    v-if="unreadCount > 0"
                    class="absolute right-4 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {{ unreadCount }}
                  </span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    
    <!-- Notification Dialog -->
    <div 
      v-if="showNotifications"
      class="fixed inset-0 z-40 bg-black/50 flex items-center justify-center"
      @click="showNotifications = false"
    >
      <div 
        class="w-96 bg-[#2e2e2e] border border-[#333] rounded-md shadow-lg z-50 max-h-[80vh] overflow-y-auto"
        @click.stop
      >
        <div class="p-4 border-b border-[#333] font-bold flex justify-between items-center">
          <span>Notifications</span>
          <button @click="showNotifications = false" class="text-gray-400 hover:text-white">
            &times;
          </button>
        </div>
        
        <div v-if="notifications.length === 0" class="p-4 text-center text-sm">
          No notifications
        </div>
        
        <div v-else>
          <div 
            v-for="notification in notifications"
            :key="notification.notif_id"
            class="p-4 border-b border-[#333] hover:bg-[#333] cursor-pointer"
            @click="markAsRead(notification)"
          >
            <div class="font-medium">{{ notification.notif_title }}</div>
            <div class="text-sm text-gray-400 mt-1">{{ notification.notif_content }}</div>
            <div class="text-xs text-gray-500 mt-2">
              {{ formatDate(notification.date) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <SidebarFooter>
      <div class="p-4 border-t border-[#333] space-y-4">
        <div class="flex items-center gap-3 px-4 py-2">
          <div class="size-8 rounded-full bg-primary flex items-center justify-center text-white">
            {{ userInitial }}
          </div>
          <div>
            <div class="font-medium">{{ studentStore.student.firstName }} {{ studentStore.student.lastName }}</div>
            <div class="text-xs text-muted-foreground">
              {{ isAdmin ? 'Administrator' : 'Student' }}
            </div>
          </div>
        </div>
        
        <Button 
          @click="logOut"
          variant="destructive"
          class="w-full flex items-center gap-3"
        >
          <LogOut class="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </SidebarFooter>
  </Sidebar>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStudentStore } from '@/stores/student.store'
import { 
  LayoutDashboard,
  Home,
  User,
  BookOpen,
  Clock,
  Calendar,
  CalendarDays,
  File,
  AlertCircle,
  LogOut,
  Menu,
  Users,
  FileText,
  MessageSquare,
  Upload,
  Megaphone,
  CalendarCheck,
  LaptopMinimal,
  Bell
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader
} from "@/components/ui/sidebar"
import { getNotifications } from '../../api/notification'

interface NavigationLink {
  to: string
  label: string
  icon: any
  adminOnly?: boolean
}

interface Notification {
  notif_id: number
  notif_title: string
  notif_content: string
  recipient_id: number
  date: string
  stauts: string
}

const route = useRoute()
const router = useRouter()
const studentStore = useStudentStore()
const showNotifications = ref(false)
const unreadCount = ref(0)
const notifications = ref<Notification[]>([])

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  // Here you would typically fetch notifications when opened
  if (showNotifications.value) {
    getNotifications()
  }
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const markAsRead = async (notification: Notification) => {
  // Implement your mark as read logic here
  // You might want to update the notification status in your backend
  // Then refresh the notifications
  showNotifications.value = false
  notifications.value = await getNotifications()
  unreadCount.value = notifications.value.filter((n: any) => !n.read).length
}

const isAdmin = computed(() => String(studentStore.student.isAdmin) === '1')
const userInitial = computed(() => studentStore.student.firstName.charAt(0).toUpperCase())

const adminLinks: NavigationLink[] = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/sitins', label: 'Sit-ins', icon: CalendarDays },
  { to: '/records', label: 'Records', icon: FileText },
  { to: '/feedbacks', label: 'Feedbacks', icon: MessageSquare },
  { to: '/upload-files', label: 'Files', icon: Upload },
  { to: '/laboratory-schedule', label: 'Lab Schedules', icon: Calendar },
  {to: '/computers', label: 'Computers', icon: LaptopMinimal},
  {to: '/reservations', label: 'Reservations', icon: BookOpen},
  {to: '/reservation-logs', label: 'Reservation Logs', icon: BookOpen},
  // { to: '/announcements', label: 'Announcements', icon: Megaphone }
]

const studentLinks: NavigationLink[] = [
  { to: '/dashboard', label: 'Home', icon: Home },
  // { to: '/sitin-rules', label: 'Sit-in Rules', icon: AlertCircle },
  { to: '/laboratory-rules', label: 'Lab Rules', icon: AlertCircle },
  { to: '/sitin-history', label: 'Sit-in History', icon: Clock },
  { to: '/reservation', label: 'Reservation', icon: CalendarCheck },
  { to: '/files', label: 'Files', icon: File },
  { to: '/schedule', label: 'Lab Schedule', icon: Calendar },
  { to: '/profile', label: 'Profile', icon: User }
]

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const handleLogoClick = () => {
  router.push(isAdmin.value ? '/admin' : '/dashboard')
}

const logOut = () => {
  studentStore.setStudent({
    idNo: '',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    course: '',
    yearLevel: '',
    username: '',
    password: '',
    sessions: '',
    isAdmin: '0'
  })
  router.push('/login')
}

onMounted(async () => {
  notifications.value = (await getNotifications()).filter((notification: any) => notification.recipient_id === studentStore.student.idNo)
  console.log(notifications.value)
  unreadCount.value = notifications.value.filter((notification: any) => !notification.read).length
})
</script>

<style scoped>
.drop-shadow-logo {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25));
}
</style>