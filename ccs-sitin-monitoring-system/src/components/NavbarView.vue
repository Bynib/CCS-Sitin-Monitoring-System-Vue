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
    </SidebarContent>

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
import { computed } from 'vue'
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
  LaptopMinimal
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

interface NavigationLink {
  to: string
  label: string
  icon: any
  adminOnly?: boolean
}

const route = useRoute()
const router = useRouter()
const studentStore = useStudentStore()

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
</script>

<style scoped>
.drop-shadow-logo {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25));
}
</style>