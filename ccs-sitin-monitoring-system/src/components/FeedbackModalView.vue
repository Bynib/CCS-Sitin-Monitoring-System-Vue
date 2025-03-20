<script setup lang="ts">
import {ref} from 'vue'
import { getSitin, updateSitinFeedback } from '../../api/sitin';


const props = defineProps<{
    sitin_id: number
}>()


const feedback = ref('')

const handleFeedback = async() => {
    // feedback.value
    console.log(props.sitin_id)
    console.log(feedback.value)
    await updateSitinFeedback(props.sitin_id, feedback.value)
}

</script>

<template>
    <div class="w-1/4 h-1/3 flex flex-col text-white">
    <h2 class="text-2xl font-bold">Submit Feedback</h2>
    <form @submit.prevent="handleFeedback">
      <div class="mb-4">
        <!-- <label for="content" class="block text-gray-700 font-bold mb-2">F:</label> -->
        <input id="content" v-model="feedback" class="input" required></input>
      </div>
      <button
      
      >Cancel</button>
      <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-400"
      >
        Submit
      </button>
    </form>
  </div>
</template>