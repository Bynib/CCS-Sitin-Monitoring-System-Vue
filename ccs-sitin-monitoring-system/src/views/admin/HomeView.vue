<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { getAnnouncements, updateAnnouncement, removeAnnouncement } from '../../../api/announcement'
import AddAnnouncementModalView from '@/components/AddAnnouncementModalView.vue'
import UpdateAnnouncementModalView from '@/components/UpdateAnnouncementModalView.vue'
import OpacityView from '@/components/OpacityView.vue'
import { getStudents } from '../../../api/student'

const openModal = ref(false)
const openUpdateModal = ref(false)

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
    announcements.value = (await getAnnouncements()).sort((a: Announcement, b: Announcement) => new Date(b.announcement_date).getTime() - new Date(a.announcement_date).getTime())
    students.value = (await getStudents()).sort((s: Student, t: Student) => Number(t.points) - Number(s.points)).splice(0, 5).filter((student: Student) => Number(student.points) > 0)
    console.log('Fetched Announcements:', announcements.value)
    console.log("Students: ", students.value)
  } catch (error) {
    console.error('Error fetching announcements:', error)
  }
})
const handleOpenModal = () => {
  openModal.value = true
}
const handleOpenUpdateModal = async(announcement_id: number) => {
  openUpdateModal.value = true
  announcement.id = announcement_id
  announcement.title = announcements.value.find((announcement) => announcement.announcement_id === announcement_id)?.announcement_title || ''
  announcement.content = announcements.value.find((announcement) => announcement.announcement_id === announcement_id)?.announcement_content || ''
  // await updateAnnouncement(announcement_id, announcement)
}


const handleDeleteAnnouncement = async (announcement_id: number) => {
 const confirmDelete = confirm("Are you sure you want to delete this announcement?")
 if (confirmDelete) {

   try {
     await removeAnnouncement(announcement_id)
     announcements.value = announcements.value.filter((announcement) => announcement.announcement_id !== announcement_id)
   } catch (error) {
     console.error('Error deleting announcement:', error)
   }
 } 
  
}
const handleRefreshAnnouncements = async () => {
  announcements.value = (await getAnnouncements()).sort((a: Announcement, b: Announcement) => new Date(b.announcement_date).getTime() - new Date(a.announcement_date).getTime())
  console.log('Fetched Announcements:', announcements.value)
}

const opacityViewOff = async () =>{
  openModal.value = false
  openUpdateModal.value = false
}
</script>

<template>
  <OpacityView v-if="openModal || openUpdateModal" @click="opacityViewOff"></OpacityView>
  <AddAnnouncementModalView
    v-if="openModal"
    @close="openModal = false"
    @refreshAnnouncements="handleRefreshAnnouncements"
    class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-4 rounded drop-shadow z-50"
  />
  <UpdateAnnouncementModalView
    v-if="openUpdateModal"
    @close="openUpdateModal=false"
    @refreshAnnouncements="handleRefreshAnnouncements"
    class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-4 rounded drop-shadow z-50"
    :announcement="announcement"
  />
  <div class=" flex flex-row items-center justify-center h-screen w-screen text-white gap-10 overflow-hidden">
    <div class="flex flex-col items-center h-5/8 w-1/3 gap-7 -mt-30 overflow-hidden">
      <p class="text-2xl font-bold w-full">Leaderboard</p>
      <div class="w-full h-6/7 overflow-scroll flex flex-col gap-5 items-center bg-gray-800 rounded-lg pt-5">
        <p class="w-full px-5">Points</p>
        <div v-for="student, index in students" :key="student.idno" class="p-4 rounded-lg w-full flex flex-row justify-between gap-10">
          <div class="flex flex-row  items-end w-1/9 justify-center"><p>{{student.points}}</p></div>
          <div class="flex flex-row items-end w-full justify-between">

            <p v-if="index === 0" class="text-3xl font-bold text-yellow-400">1ST</p>
            <p v-else-if="index === 1" class="text-3xl font-bold text-green-400">2ND</p>
            <p v-else-if="index === 2" class="text-3xl font-bold text-blue-400">3RD</p>
            <p v-else class="text-2xl font-bold">{{index + 1}}TH</p>
            <p>{{ student.firstname }} {{ student.middlename }} {{ student.lastname }}</p>
            <p>{{ student.idno }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-center h-7/8 w-2/5 gap-4 mt-30 overflow-hidden">
      <div class="w-full flex justify-end">
        <button
          @click="handleOpenModal"
          :class="
            openModal
              ? ' bg-blue-500 text-white font-bold py-2 px-4 rounded'
              : 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-400 '
          "
        >
          CREATE ANNOUNCEMENT
        </button>
      </div>
      <div v-if="announcements.length > 0" class="w-full h-6/7 overflow-scroll flex flex-col gap-5">
        <div
          v-for="announcement in announcements"
          :key="announcement.announcement_id"
          class="p-4 bg-gray-800 rounded-lg"
        >
        <div class="flex justify-between">

          <div class="flex flex-row gap-3">
            <p class="text-3xl font-bold text-yellow-400">{{ announcement.announcement_title }}</p>
            <div class="h-10 w-0.5 bg-gray-400"></div>
            <p class="text-sm text-gray-400 mt-2.5">
              {{ new Date(announcement.announcement_date).toLocaleDateString() }}
              {{ new Date(announcement.announcement_date).toLocaleTimeString() }}
            </p>
          </div>
            <div class="flex gap-5">

              <i class="pi pi-pencil text-green-500 hover:cursor-pointer" @click="handleOpenUpdateModal(announcement.announcement_id)"></i>
              <i class="pi pi-trash text-red-500 hover:cursor-pointer" @click="handleDeleteAnnouncement(announcement.announcement_id)"></i>
            </div>
        </div>
          <div class="overflow-scroll">

            <p class="text-md mt-2">{{ announcement.announcement_content }}</p>
          </div>
        </div>
      </div>
      <div v-else>
        <p>No announcements available</p>
      </div>
    </div>
  </div>
</template>
