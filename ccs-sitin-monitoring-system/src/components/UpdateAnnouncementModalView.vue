<script setup lang="ts">
import { onMounted, ref, defineEmits } from 'vue'
import { updateAnnouncement } from '../../api/announcement'

const emit = defineEmits(['close', 'refreshAnnouncements'])
interface Announcement {
  id: number
  title: string
  content: string
}

const props = defineProps<{
  announcement: Announcement
}>()

console.log(props.announcement)

interface announcement {
  title: string
  content: string
}
const title = ref('')
const content = ref('')

onMounted(() => {
    title.value = props.announcement.title
    content.value = props.announcement.content
    console.log()
})

const handleEdit = async() => {
  try{

    await updateAnnouncement(props.announcement.id, { title: title.value, content: content.value })
    title.value = ''
    content.value = ''
    emit('close')
    emit('refreshAnnouncements') 
  } catch (error) {
    console.error('Error updating announcement:', error)
  }
}
const handleClose = () => {
  emit('close')
}

</script>

<template>
    <div class="border-2 border-green-500 w-1/4 gap-5 text-white p-10 rounded bg-gray-900 drop-shadow z-50 flex flex-col">
    <h2 class="text-2xl font-bold text-violet-400">Edit Announcement</h2>
    <form @submit.prevent="handleEdit()">
      <div class="mb-4">
        <label for="title" class="block text-gray-700 font-bold mb-2">Title:</label>
        <input type="text" id="title" v-model="title" class="input w-full"  required />
      </div>
      <div class="mb-4">
        <label for="content" class="block text-gray-700 font-bold mb-2">Content:</label>
        <textarea id="content" v-model="content" class="input w-full" required ></textarea>
      </div>
      <div class="flex flex-row justify-end gap-5">

        <button
        type="button"
        class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-400"
        @click="handleClose"
        >
        Cancel
      </button>
      <button
      type="submit"
      class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-400"
      >
      Edit
    </button>
  </div>
    </form>
  </div>
</template>