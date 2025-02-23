<script setup lang="ts">
import { ref, render } from 'vue'
import AddAnnouncementModalView from '@/components/AddAnnouncementModalView.vue';
const openModal = ref(false)

const handleOpenModal = () => {
    openModal.value = true
}
</script>

<template>
  <div class="flex flex-row items-center justify-center h-screen w-screen text-white">

    <div>
        <button @click="handleOpenModal" :class="openModal ? 'opacity-50 bg-blue-500 text-white font-bold py-2 px-4 rounded ' : 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-400 '" >CREATE ANNOUNCEMENT</button>
    </div>
    <AddAnnouncementModalView
        v-if="openModal"
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-4 rounded drop-shadow z-50"
    />
  </div>
</template>
