<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import { addAnnouncement } from '../../api/announcement'

const title = ref('')
const content = ref('')
const isModalOpen = ref(true)

const emit = defineEmits(['close', 'refreshAnnouncements'])
const createAnnouncement = async () => {
  try {
    const announcement = { title: title.value, content: content.value }
    const response = await addAnnouncement(announcement)
    console.log('announcement added', response)
    title.value = ''
    content.value = ''
    isModalOpen.value = false // Close modal after success
    emit('close')
    emit('refreshAnnouncements')  
  } catch (error) {
    console.error('Error:', error)
    alert('An error occurred')
  }
}

const handleCancel = () => {
  // isModalOpen.value = false // Smoothly close modal on cancel
  emit('close')
  
}
</script>

<template>
  <div class="w-1/4 gap-5 text-white p-10 rounded bg-gray-900 drop-shadow z-50 flex flex-col">
    <h2 class="text-2xl font-bold">Create Announcement</h2>
    <form @submit.prevent="createAnnouncement">
      <div class="mb-4">
        <label for="title" class="block text-gray-700 font-bold mb-2">Title:</label>
        <input type="text" id="title" v-model="title" class="input" required />
      </div>
      <div class="mb-4">
        <label for="content" class="block text-gray-700 font-bold mb-2">Content:</label>
        <textarea id="content" v-model="content" class="input" required></textarea>
      </div>
      <button
        type="button"
        class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-400"
        @click="handleCancel"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-400"
      >
        Create
      </button>
    </form>
  </div>
</template>
