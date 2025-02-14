<script setup lang="ts">
  import { reactive } from 'vue'
  import {useRoute} from 'vue-router'
  import {useStudentStore} from '@/stores/student.store'
  import { updateSession } from '../../api/student';

  const studentStore = useStudentStore();

  const userDetail = reactive({
    idno: Number(studentStore.student.idNo),
  })

  const route = useRoute();

  const goToProfile = () => {
    window.location.href = '/dashboard'
  }

  const goToAnnouncement =()=>{
    window.location.href = '/announcement'
  }
  
  const goToSitinRules = () => {
    window.location.href = '/sitinrules'
  }

  const goToLabRules = () => {
    window.location.href='/labrules'
  }

  const goToSitinHistory = () => {
    window.location.href='/sitinhistory'
  }

  const goToReservation = () => {
    window.location.href='/reservation'
  }

  const handleLogout = ()=>{
    updateSession(userDetail.idno);
    window.location.href='/'
  }
</script>

<template>
  <div class="flex justify-between absolute w-screen p-5 bg-[#2e2e2e]">
    <div class="flex justify-between w-screen">
      <img
        src="@/assets/CCS_LOGO.png"
        alt="CCS"
        width="80"
        class="cursor-pointer"
        onclick="window.location.href = '/dashboard'"
      />
      <div class="flex items-center gap-5 pr-2">
        <!-- <button v-if="route.path === 'dashboard'" class="normalButton">Profile</button>
        <button v-else class="normalButton border-b-2">Profile</button> -->
        <button @click="goToProfile" :class="route.path === '/dashboard' ? 'normalButton border-b-2' : 'normalButton'">Profile</button>
        <button @click="goToAnnouncement" :class="route.path === '/announcement' ? 'normalButton border-b-2' : 'normalButton'" class="normalButton">Announcement</button>
        <button @click="goToSitinRules" :class="route.path === '/sitinrules' ? 'normalButton border-b-2' : 'normalButton'" class="normalButton">Sit-in Rules</button>
        <button @click="goToLabRules" :class="route.path === '/labrules' ? 'normalButton border-b-2' : 'normalButton'" class="normalButton">Lab Rules and Regulation</button>
        <button @click="goToSitinHistory" :class="route.path === '/sitinhistory' ? 'normalButton border-b-2' : 'normalButton'" class="normalButton">Sitin History</button>
        <button @click="goToReservation" :class="route.path === '/reservation' ? 'normalButton border-b-2' : 'normalButton'" class="normalButton">Reservation</button>
        <button
          @click="handleLogout"
          class="font-bold text-white bg-red-500 hover:bg-red-600 rounded p-2 transition-colors duration-400"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>
<!-- onclick="window.location.href = '/login'" -->
<!-- onclick="window.location.href='/register'" -->
