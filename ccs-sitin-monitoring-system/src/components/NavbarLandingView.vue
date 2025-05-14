<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<template>
  <div class="flex justify-between absolute w-screen p-5">
    <!-- <div v-if="$route.name !== 'home'" class="flex justify-between w-screen">
      <i class="pi pi-arrow-left p-5" style="color: #ffffff; font-size: clamp(1.5rem, 3vw, 2rem); cursor: pointer;" onclick="window.history.back()"/>
    </div> -->
    <div class="flex justify-between w-screen">
      <img
        src="@/assets/CCS_LOGO.png"
        alt="CCS"
        width="80"
        class="cursor-pointer"
        onclick="window.location.href = '/'"
      />
      <div
        class="flex items-center gap-5 pr-2"
        v-if="$route.name !== 'login' && $route.name !== 'register'"
      >
        <button
          onclick="window.location.href='/login'"
          class="bg-violet-700 hover:bg-violet-900 text-white font-bold py-2 px-4 rounded transition-colors duration-400"
        >
          LOGIN
        </button>
        <button onclick="window.location.href='/register'" class="font-bold text-white">Register</button>
      </div>
    </div>
  </div>
</template>
