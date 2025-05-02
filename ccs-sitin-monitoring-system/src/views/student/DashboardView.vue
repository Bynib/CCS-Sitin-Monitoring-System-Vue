<script setup lang="ts">
import { getAnnouncements } from '@/../api/announcement'
import { getStudents } from '../../../api/student'
import { onMounted, ref } from 'vue'

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

const announcements = ref<Announcement[]>([])

onMounted(async () => {
  try {
    announcements.value =(await getAnnouncements()).sort((a: Announcement, b: Announcement) => new Date(b.announcement_date).getTime() - new Date(a.announcement_date).getTime())
    students.value = (await getStudents()).sort((s: Student, t: Student) => Number(t.points) - Number(s.points)).splice(0, 3).filter((student: Student) => Number(student.points) > 0)
    console.log("Fetched Announcements:", announcements.value)
  } catch (error) {
    console.error("Error fetching announcements:", error)
  }
})
</script>

<template>
  <div class="flex flex-row items-center justify-center h-screen w-screen text-white gap-20">
    <!-- <div class="text-2xl font-bold mb-4">Announcements</div> -->
    <div class="flex flex-col items-center h-5/8 w-1/3 gap-7 -mt-30 overflow-hidden">
      <p class="text-2xl font-bold w-full">Leaderboard</p>
      <div class="w-full h-2/3 overflow-scroll flex flex-col gap-5 items-center bg-gray-800 rounded-lg pl-10 pt-10">
        <p class="w-full px-5">Points</p>
        <div v-for="student, index in students" :key="student.idno" class="p-4 rounded-lg w-full flex flex-row justify-between gap-10">
          <div class="flex flex-row  items-end w-1/9 justify-center"><p>{{student.points}}</p></div>
          <div class="flex flex-row items-end w-full justify-between">

            <p v-if="index === 0" class="text-3xl font-bold text-yellow-400">1ST</p>
            <p v-else-if="index === 1" class="text-3xl font-bold text-green-400">2ND</p>
            <p v-else-if="index === 2" class="text-3xl font-bold text-blue-400">3RD</p>
            <p v-else class="text-2xl font-bold">{{index + 1}}TH</p>
            <p class="w-full text-center">{{ student.firstname }} {{ student.middlename }} {{ student.lastname }}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="announcements.length > 0" class="w-1/3 h-5/6 mt-20 overflow-scroll flex flex-col">
      
      <p class="text-2xl font-bold w-full pb-4.5">Announcements</p>
      <div v-for="announcement in announcements" :key="announcement.announcement_id" class="p-4 bg-gray-800 rounded-lg m-2">
        <p class="text-lg font-bold text-yellow-400">{{ announcement.announcement_title }}</p>
        <p class="text-sm text-gray-400">{{new Date(announcement.announcement_date).toLocaleDateString()}} {{ new Date(announcement.announcement_date).toLocaleTimeString() }}</p>
        <p class="text-md mt-2">{{ announcement.announcement_content }}</p>
      </div>
    </div>
    <div v-else>
      <p>No announcements available</p>
    </div>  
  </div>
</template>
