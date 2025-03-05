<script setup lang="ts">
import { getAnnouncements } from '@/../api/announcement'
import { onMounted, ref } from 'vue'

interface Announcement {
  announcement_id: number
  announcement_title: string
  announcement_content: string
  announcement_date: string
}

const announcements = ref<Announcement[]>([])

onMounted(async () => {
  try {
    announcements.value = await getAnnouncements()
    console.log("Fetched Announcements:", announcements.value)
  } catch (error) {
    console.error("Error fetching announcements:", error)
  }
})
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen w-screen text-white">
    <!-- <div class="text-2xl font-bold mb-4">Announcements</div> -->
    <div v-if="announcements.length > 0" class="w-1/3 h-5/6 mt-20 overflow-scroll flex flex-col">
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
