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
  <div class="flex flex-col items-center align-center h-screen w-screen text-white">
    <div class="font-bold text-3xl mt-30 mb-12">Students</div>
    <div v-if="students.length > 0" class="w-7/10 h-3/4 overflow-scroll flex flex-col">
      <table class="table-auto">
        <thead>
          <tr>
            <th>ID Number</th>
            <th>Firstname</th>
            <th>Middle Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Course</th>
            <th>Year Level</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(student, index) in students"
            :key="Number(student.idno)"
            :class="index % 2 ? '  rounded-lg text-center' : ' bg-gray-800 rounded-lg text-center'"
          >
              <td class="p-5">{{ student.idno }}</td>
              <td>{{ student.firstname }}</td>
              <td>{{ student.middlename != '' ? student.middlename : '-' }}</td>
              <td>{{ student.lastname }}</td>
              <td>{{ student.email }}</td>
              <td>{{ student.course }}</td>
              <td>{{ student.yearlevel }}</td>
            </tr>
          </tbody>
        </table>
    </div>
    <div v-else>No Student Registered...</div>
  </div>
</template>
