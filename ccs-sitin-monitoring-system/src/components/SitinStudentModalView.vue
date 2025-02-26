<script setup lang="ts">
import { addSitin } from '../../api/sitin'
import { ref } from 'vue'

const idno = ref('')
const purpose = ref('')
const laboratory = ref('')

interface Student {
  idno: string
  firstname: string
  middlename: string
  lastname: string
  email: string
  course: string
  yearlevel: string
  sessions: string
}
const props = defineProps<{
  student: Student
}>()

const handleSitin = async () => {
  const student = {
    idno: Number(props.student.idno),
    purpose: purpose.value,
    laboratory: Number(laboratory.value)
  }
  
  const result = await addSitin(student)
  console.log(result)
  console.log(props.student.idno)
  alert("student sitin added")
  
}
</script>

<template>
  <div
    class="text-white flex flex-col w-2/7 absolute top-1/2 left-1/2 p-10 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800  rounded drop-shadow z-50"
  >
    <h2 class="text-2xl font-bold">Student Details</h2>
    <div class="bg-white h-0.5 mt-3 mb-3"></div>
    <form @submit.prevent="handleSitin" class="flex flex-col items-center">
      <div class="mb-4 w-14/15 flex flex-col">
        <div class="flex flex-row justify-between p-2">
          <p class="font-bold mb-2">ID Number:</p>
          <p class="font-bold mb-2" ref="idno">{{ student.idno }}</p>
        </div>
        <div class="flex flex-row justify-between bg-gray-700 pl-3 pt-1.5 pr-3 rounded">
          <p class="font-bold mb-2">Name:</p>
          <p class="font-bold mb-2">
            {{ student.firstname }} {{ student.middlename }} {{ student.lastname }}
          </p>
        </div>
        <div class="flex flex-row justify-between p-2">
          <p class="font-bold mb-2">Course & Year:</p>
          <p class="font-bold mb-2">{{ student.course }} {{ student.yearlevel }}</p>
        </div>
        <div class="flex flex-row justify-between p-2">
          <label for="sessions" class="">Remaining Sessions:</label>
          <p class="font-bold mb-2">{{ student.sessions }}</p>
        </div>
        <div class="flex flex-row justify-between p-2">
          <label for="purpose" class="">Purpose:</label>
          <input id="purpose" type="text" class="input w-3/5" v-model="purpose" required/>
        </div>
        <div class="flex flex-row justify-between p-2">
          <label for="laboratory" class="">Laboratory:</label>
          <select name="laboratory" id="laboratory" class="select w-3/5" v-model="laboratory" required>
            <option value="524" class="option">524</option>
            <option value="528" class="option">528</option>
            <option value="530" class="option">530</option>
            <option value="542" class="option">542</option>
            <option value="544" class="option">544</option>
          </select>
        </div>
        
      </div>
      <div class=" w-20/22 flex flex-col justify-between gap-5">
        <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-400"
        >
        Sitin
      </button>
      <button
      class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-400"
      >
        Cancel
      </button>
    </div>
    </form>
  </div>
</template>
