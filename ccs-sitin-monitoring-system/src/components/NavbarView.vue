<script setup lang="ts">
  import { reactive } from 'vue'
  import {useRoute, useRouter} from 'vue-router'
  import {useStudentStore} from '@/stores/student.store'
  import { updateSession } from '../../api/student';

  const studentStore = useStudentStore();

  const userDetail = reactive({
    idno: Number(studentStore.student.idNo),
  })

  const route = useRoute();
  const router = useRouter();

  const goToProfile = () => {
    router.push('/profile')
  }

  const goToAnnouncement =()=>{
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

  const handleLogout = ()=>{
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
      sessions: ''
    });
    window.location.href='/'
  }
</script>

<template>
  <div class="flex justify-between fixed w-screen p-5">
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
        <button @click="goToAnnouncement" :class="route.path === '/dashboard' ? 'normalButton border-b-2 border-b-yellow-300' : 'normalButton'" class="normalButton">Announcement</button>
        <button @click="goToSitinRules" :class="route.path === '/sitin-rules' ? 'normalButton border-b-2 border-b-yellow-300' : 'normalButton'" class="normalButton">Sit-in Rules</button>
        <button @click="goToLabRules" :class="route.path === '/laboratory-rules' ? 'normalButton border-b-2 border-b-yellow-300' : 'normalButton'" class="normalButton">Lab Rules and Regulation</button>
        <button @click="goToSitinHistory" :class="route.path === '/sitin-history' ? 'normalButton border-b-2 border-b-yellow-300' : 'normalButton'" class="normalButton">Sitin History</button>
        <button @click="goToReservation" :class="route.path === '/reservation' ? 'normalButton border-b-2 border-b-yellow-300' : 'normalButton'" class="normalButton">Reservation</button>
        <button @click="goToProfile" :class="route.path === '/profile' ? 'normalButton border-b-2 border-b-yellow-300' : 'normalButton'">Profile</button>
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
