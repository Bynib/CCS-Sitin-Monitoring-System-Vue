<script setup lang="ts">
import { getStudents } from '@/../api/student'
import { ref, onMounted } from 'vue'

interface Student {
  idno: string
  firstname: string
  middlename: string
  lastname: string
  email: string
  course: string
  yearlevel: string
}

const students = ref<Student[]>([])

onMounted(async () => {
  students.value = await getStudents()
  console.log("hello")
  console.log(students.value)
})
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen w-screen text-white">
    <div>Students</div>
    <div v-if="students.length > 0">
      <div v-for="student in students" :key="student.idno" class="p-4 bg-gray-800 rounded-lg m-2">
        <p class="text-lg font-bold">{{ student.firstname }} {{ student.lastname }}</p>
        <p class="text-sm">Course: {{ student.course }}</p>
        <p class="text-sm">Year Level: {{ student.yearlevel }}</p>
      </div>
    </div>
  </div>
</template>
