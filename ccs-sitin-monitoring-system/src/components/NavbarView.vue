<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStudentStore } from '@/stores/student.store'
import { updateSession } from '../../api/student'
import  SearchModalView from '@/components/SearchModalView.vue'

const state = reactive({
  showModal: false,
})

const studentStore = useStudentStore()
console.log(studentStore.student.username)
const userDetail = reactive({
  idno: Number(studentStore.student.idNo),
})

const route = useRoute()
const router = useRouter()

const goToProfile = () => {
  router.push('/profile')
}

const goToAnnouncement = () => {
  router.push('/dashboard')
}

const goToSitinRules = () => {
  router.push('/sitin-rules')
}

const goToLabRules = () => {
  router.push('/laboratory-rules')
}

const goToSitinHistory = () => {
  router.push('/sitin-history')
}

const goToReservation = () => {
  router.push('/reservation')
}

const gotoHome = () => {
  router.push('/admin')
}

const goToSearch = () => {
  state.showModal = true
}
const gotoStudents = () => {
  router.push('/students')
}

const handleLogout = () => {
  // updateSession(userDetail.idno);
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
  })
  window.location.href = '/'
}
</script>

<template>
  <SearchModalView
  v-if="state.showModal"
  class="fixed flex flex-col justify-center items-center bg-gray-800 p-4 rounded drop-shadow z-50"
  />
  <div class="flex justify-between fixed w-screen p-5">
    <div class="flex justify-between w-screen">
      <img
        src="@/assets/CCS_LOGO.png"
        alt="CCS"
        width="80"
        class="cursor-pointer"
        onclick="window.location.href = '/dashboard'"
      />
      <div v-if="String(studentStore.student.isAdmin) === '1'" class="flex items-center gap-5 pr-2">
        <button
          @click="gotoHome"
          :class="
            route.path === '/admin' ? 'normalButton border-b-2 border-b-yellow-300' : 'normalButton'
          "
          class="normalButton"
        >
          Home
        </button>
        <button
          @click="goToSearch"
          :class="
            route.path === '/search' ? 'normalButton border-b-2 border-b-yellow-300' : 'normalButton'
          "
        >
          Search
        </button>
        
        <button
          @click="gotoStudents"
          :class="
            route.path === '/students' ? 'normalButton border-b-2 border-b-yellow-300' : 'normalButton'
          "
          class="normalButton"
        >
          Students
        </button>
        <button
          @click="handleLogout"
          class="font-bold text-white bg-red-500 hover:bg-red-600 rounded p-2 transition-colors duration-400"
        >
          LOGOUT
        </button>
      </div>
      <div v-else class="flex items-center gap-5 pr-2">
        <!-- <button v-if="route.path === 'dashboard'" class="normalButton">Profile</button>
        <button v-else class="normalButton border-b-2">Profile</button> -->
        <button
          @click="goToAnnouncement"
          :class="
            route.path === '/dashboard'
              ? 'normalButton border-b-2 border-b-yellow-300'
              : 'normalButton'
          "
          class="normalButton"
        >
          Announcement
        </button>
        <button
          @click="goToSitinRules"
          :class="
            route.path === '/sitin-rules'
              ? 'normalButton border-b-2 border-b-yellow-300'
              : 'normalButton'
          "
          class="normalButton"
        >
          Sit-in Rules
        </button>
        <button
          @click="goToLabRules"
          :class="
            route.path === '/laboratory-rules'
              ? 'normalButton border-b-2 border-b-yellow-300'
              : 'normalButton'
          "
          class="normalButton"
        >
          Lab Rules and Regulation
        </button>
        <button
          @click="goToSitinHistory"
          :class="
            route.path === '/sitin-history'
              ? 'normalButton border-b-2 border-b-yellow-300'
              : 'normalButton'
          "
          class="normalButton"
        >
          Sitin History
        </button>
        <button
          @click="goToReservation"
          :class="
            route.path === '/reservation'
              ? 'normalButton border-b-2 border-b-yellow-300'
              : 'normalButton'
          "
          class="normalButton"
        >
          Reservation
        </button>
        <button
          @click="goToProfile"
          :class="
            route.path === '/profile'
              ? 'normalButton border-b-2 border-b-yellow-300'
              : 'normalButton'
          "
        >
          Profile
        </button>
        <button
          @click="handleLogout"
          class="font-bold text-white bg-red-500 hover:bg-red-600 rounded p-2 transition-colors duration-400"
        >
          LOGOUT
        </button>
      </div>
    </div>
  </div>
</template>
<!-- onclick="window.location.href = '/login'" -->
<!-- onclick="window.location.href='/register'" -->
