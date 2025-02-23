<script setup lang="ts">
import {ref} from 'vue'
import {addAnnouncement} from '../../api/announcement'

const title = ref('')
const content = ref('')

const createAnnouncement = async () => {
    try{
        const announcement = {title: title.value, content: content.value}
        const response = await addAnnouncement(announcement)
        console.log('announcement added', response)
        title.value = ''
        content.value = ''
    } catch (error) {
        console.error('Error:', error)
        alert('An error occurred')
    }
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold">Create Announcement</h2>
    <form @submit.prevent="createAnnouncement">
      <div class="mb-4">
        <label for="title" class="block text-gray-700 font-bold mb-2">Title:</label>
        <input type="text" id="title" v-model="title" class="input" />
      </div>
      <div class="mb-4">
        <label for="content" class="block text-gray-700 font-bold mb-2">Content:</label>
        <textarea id="content" v-model="content" class="input"></textarea>
      </div>
      <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-400"
      >
        Create
      </button>
    </form>
  </div>
</template>
