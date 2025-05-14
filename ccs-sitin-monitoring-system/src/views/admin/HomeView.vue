<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { getAnnouncements, updateAnnouncement, removeAnnouncement } from '../../../api/announcement'
import AddAnnouncementModalView from '@/components/AddAnnouncementModalView.vue'
import UpdateAnnouncementModalView from '@/components/UpdateAnnouncementModalView.vue'
import OpacityView from '@/components/OpacityView.vue'
import { getStudents } from '../../../api/student'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CalendarDays, Pencil, Trash2, Trophy, Plus } from 'lucide-vue-next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const openModal = ref(false)
const openUpdateModal = ref(false)
const deleteDialogOpen = ref(false)
const announcementToDelete = ref<number | null>(null)

interface Announcement {
  announcement_id: number
  announcement_title: string
  announcement_content: string
  announcement_date: string
}

interface Student {
  idno: string
  firstname: string
  middlename: string
  lastname: string
  email: string
  course: string
  yearlevel: string
  sessions: string
  points: string
}

const students = ref<Student[]>([])

const announcement = reactive({
  id: 0,
  title: '',
  content: ''
})

const announcements = ref<Announcement[]>([])

onMounted(async () => {
  try {
    announcements.value = (await getAnnouncements()).sort((a: Announcement, b: Announcement) => 
      new Date(b.announcement_date).getTime() - new Date(a.announcement_date).getTime()
    )
    students.value = (await getStudents())
      .sort((s: Student, t: Student) => Number(t.points) - Number(s.points))
      .filter((student: Student) => Number(student.points) > 0)
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})

const handleOpenModal = () => {
  openModal.value = true
}

const handleOpenUpdateModal = async(announcement_id: number) => {
  openUpdateModal.value = true
  announcement.id = announcement_id
  announcement.title = announcements.value.find((announcement) => 
    announcement.announcement_id === announcement_id
  )?.announcement_title || ''
  announcement.content = announcements.value.find((announcement) => 
    announcement.announcement_id === announcement_id
  )?.announcement_content || ''
}

const openDeleteDialog = (announcement_id: number) => {
  announcementToDelete.value = announcement_id
  deleteDialogOpen.value = true
}

const handleDeleteAnnouncement = async () => {
  if (!announcementToDelete.value) return
  
  try {
    await removeAnnouncement(announcementToDelete.value)
    announcements.value = announcements.value.filter(
      (announcement) => announcement.announcement_id !== announcementToDelete.value
    )
    deleteDialogOpen.value = false
    announcementToDelete.value = null
  } catch (error) {
    console.error('Error deleting announcement:', error)
    deleteDialogOpen.value = false
    announcementToDelete.value = null
  }
}

const handleRefreshAnnouncements = async () => {
  announcements.value = (await getAnnouncements()).sort((a: Announcement, b: Announcement) => 
    new Date(b.announcement_date).getTime() - new Date(a.announcement_date).getTime()
  )
}

const opacityViewOff = async () => {
  openModal.value = false
  openUpdateModal.value = false
}

const getMedalColor = (index: number) => {
  switch(index) {
    case 0: return 'bg-amber-400/20 text-amber-400'
    case 1: return 'bg-slate-400/20 text-slate-400'
    case 2: return 'bg-amber-600/20 text-amber-600'
    default: return 'bg-muted'
  }
}
</script>

<template>
  <OpacityView v-if="openModal || openUpdateModal" @click="opacityViewOff" />
  
  <AddAnnouncementModalView
    v-if="openModal"
    @close="openModal = false"
    @refreshAnnouncements="handleRefreshAnnouncements"
    class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background p-6 rounded-lg shadow-lg z-50 w-[90%] max-w-2xl"
  />
  
  <UpdateAnnouncementModalView
    v-if="openUpdateModal"
    @close="openUpdateModal=false"
    @refreshAnnouncements="handleRefreshAnnouncements"
    class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background p-6 rounded-lg shadow-lg z-50 w-[90%] max-w-2xl"
    :announcement="announcement"
  />

  <Dialog v-model:open="deleteDialogOpen">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this announcement? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" @click="deleteDialogOpen = false">
          Cancel
        </Button>
        <Button variant="destructive" @click="handleDeleteAnnouncement">
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <div class="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 min-h-screen">
    <div class="w-full lg:w-1/3">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Trophy class="w-5 h-5 text-amber-500" />
            Top Students Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea class="h-[80vh]">
            <div class="space-y-4">
              <div 
                v-for="(student, index) in students" 
                :key="student.idno" 
                class="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Badge :class="getMedalColor(index)" class="h-10 w-10 flex items-center justify-center">
                  {{ index + 1 }}
                </Badge>
                <div class="flex-1 min-w-0">
                  <p class="font-medium truncate">
                    {{ student.firstname }} {{ student.middlename }} {{ student.lastname }}
                  </p>
                  <p class="text-sm text-muted-foreground truncate">
                    {{ student.idno }} • {{ student.course }}
                  </p>
                </div>
                <Badge variant="secondary" class="px-3 py-1">
                  {{ student.points }} pts
                </Badge>
              </div>
              
              <div v-if="students.length === 0" class="text-center py-8 text-muted-foreground">
                No student data available
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>

    <!-- Announcements Section -->
    <div class="w-full lg:w-2/3">
      <Card>
        <CardHeader class="flex flex-row justify-between items-center">
          <CardTitle>Announcements</CardTitle>
          <Button @click="handleOpenModal" size="sm" class="gap-2">
            <Plus class="w-4 h-4" />
            New Announcement
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea class="h-[80vh]">
            <div v-if="announcements.length > 0" class="space-y-4">
              <div 
                v-for="announcement in announcements"
                :key="announcement.announcement_id"
                class="p-6 bg-background border rounded-lg hover:shadow-sm transition-shadow"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-lg font-semibold">
                      {{ announcement.announcement_title }}
                    </h3>
                    <div class="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <CalendarDays class="w-4 h-4" />
                      <span>
                        {{ new Date(announcement.announcement_date).toLocaleDateString() }}
                        at {{ new Date(announcement.announcement_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}
                      </span>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <Button 
                      @click="handleOpenUpdateModal(announcement.announcement_id)" 
                      variant="ghost" 
                      size="icon"
                      class="h-8 w-8"
                    >
                      <Pencil class="w-4 h-4 text-primary" />
                    </Button>
                    <Button 
                      @click="openDeleteDialog(announcement.announcement_id)" 
                      variant="ghost" 
                      size="icon"
                      class="h-8 w-8"
                    >
                      <Trash2 class="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                
                <Separator class="my-3" />
                
                <p class="text-muted-foreground whitespace-pre-line">
                  {{ announcement.announcement_content }}
                </p>
              </div>
            </div>
            
            <div v-else class="text-center py-8 text-muted-foreground">
              No announcements yet. Create your first announcement!
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  </div>
</template>