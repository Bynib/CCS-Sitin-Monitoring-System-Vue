<script setup lang="ts">
import { getStudents } from '@/../api/student'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { updateAll } from '@/../api/student'

interface Student {
  idno: string
  firstname: string
  middlename: string
  lastname: string
  email: string
  course: string
  yearlevel: string
  sessions: string
  points: string
}

const students = ref<Student[]>([])
const router = useRouter()

onMounted(async () => {
  students.value = (await getStudents()).sort((s: Student, t: Student) => Number(t.points) - Number(s.points))
  console.log("hello")
  console.log(students.value)
})

const resetSessions = async()=>{
  const confirmReset = confirm("CONFIRM RESET ALL STUDENT SESSIONS")

  if(confirmReset){
    const result = await updateAll();
    students.value = await getStudents()

  }
}
</script>

<template>
  <div class="flex flex-col items-center align-center h-screen w-screen text-white">
    <div class="font-bold text-3xl mt-30">Students</div>
    <div v-if="students.length > 0" class="w-7/10 h-3/4 overflow-scroll flex flex-col">
      <div class="flex flex-col w-full items-end gap-5 mb-10">

          <button @click="resetSessions" class="bg-blue-300 flex justify-center text-black p-2 rounded">RESET SESSIONS</button>

      </div>
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
            <th>Remaining <br>Sessions</th>
            <th>Points</th>
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
              <td>{{ student.sessions }}</td>
              <td>{{ student.points }}</td>
            </tr>
          </tbody>
        </table>
    </div>
    <div v-else>No Student Registered...</div>
  </div>
</template>
