<script setup lang="ts">
import { ref, reactive } from 'vue'
import { getStudent } from '../../api/student'
import SitinStudentModalView from '@/components/SitinStudentModalView.vue'

const openSitinModal = ref(false)

const idno = ref('')
const student = reactive({
    idno: '',
    firstname: '',
    middlename: '',
    lastname: '',
    email: '',
    course: '',
    yearlevel: '',
    sessions: ''
})


const handleSearch = async () => {
  openSitinModal.value = true
  const result = await getStudent(idno.value)
    student.idno = result[0].idno
    student.firstname = result[0].firstname
    student.middlename = result[0].middlename
    student.lastname = result[0].lastname
    student.email = result[0].email
    student.course = result[0].course
    student.yearlevel = result[0].yearlevel
    student.sessions = result[0].sessions
    console.log(student)
}
</script>

<template>
  <div
    class="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-4 rounded drop-shadow z-50"
  >
    <h2 class="text-2xl font-bold">Search Student</h2>
    <form @submit.prevent="handleSearch">
      <div class="mb-4">
        <label for="idno" class="block text-gray-700 font-bold mb-2">ID Number:</label>
        <input id="idno" v-model="idno" class="input"></input>
      </div>
      <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-400"
      >
        Search
      </button>
    </form>
  </div>
  <SitinStudentModalView v-if="openSitinModal===true" :student="student"/>
</template>
