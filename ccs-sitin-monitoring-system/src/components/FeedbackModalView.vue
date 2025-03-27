<script setup lang="ts">
import {ref, defineEmits} from 'vue'
import { getSitin, updateSitinFeedback } from '../../api/sitin';


const props = defineProps<{
    sitin_id: number
}>()


const feedback = ref('')
const emit = defineEmits(['close'])

const handleCancel = () => {
  emit('close')
}

const handleFeedback = async() => {
    // feedback.value
    console.log(props.sitin_id)
    console.log(feedback.value)
    await updateSitinFeedback(props.sitin_id, feedback.value)
    alert('Feedback submitted successfully!')
    window.location.reload()
}

</script>

<template>
    <div class="w-1/4 h-1/3 flex flex-col text-white justify-center">
      <div class=" flex flex-col justify-center items-center">

        <h2 class="text-2xl font-bold mb-20">Submit Feedback</h2>
        <form @submit.prevent="handleFeedback" class="w-9/10 flex flex-col gap-10">
          <div class="mb-4 flex justify-center">
            <!-- <label for="content" class="block text-gray-700 font-bold mb-2">F:</label> -->
            <input id="content" v-model="feedback" class="input w-full" required></input>
          </div>
          <div class="flex flex-row justify-end gap-5">

            <button
            type="button"
            @click="handleCancel"
            >Cancel</button>
            <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-400"
            >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>