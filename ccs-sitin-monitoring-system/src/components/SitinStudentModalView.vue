<script setup lang="ts">
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
</script>

<template>
  <div
    class="text-white absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-4 rounded drop-shadow z-50"
  >
    <h2 class="text-2xl font-bold ">Student Details</h2>
    <div class="bg-white h-0.5 mt-3 mb-3"></div>
    <form @submit.prevent="">
      <div class="mb-4">
        <p class=" font-bold mb-2">ID Number: {{ student.idno }}</p>
        <p class=" font-bold mb-2">
          Name: {{ student.firstname }} {{ student.middlename }} {{ student.lastname }}
        </p>
        <p class=" font-bold mb-2">
          Course & Year: {{ student.course }} {{ student.yearlevel }}
        </p>
        <label for="purpose" class=" mr-2">Purpose</label>
        <input id="purpose" type="text" class="input " />
        <label for="laboratory" class=" mr-2">Laboratory</label>
        <select name="laboratory" id="laboratory">
          <option value=""></option>
        </select>
      </div>
      <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-400"
      >
        Sitin
      </button>
    </form>
  </div>
</template>
