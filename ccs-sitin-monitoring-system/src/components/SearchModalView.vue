<script setup lang="ts">
import { ref, reactive, defineEmits } from 'vue'
import { getStudent } from '../../api/student'
import { useRouter } from 'vue-router'
import SitinStudentModalView from '@/components/SitinStudentModalView.vue'
import OpacityView from './OpacityView.vue'

const openSitinModal = ref(false)
const isSearchModalOpen = ref(true)

const emit = defineEmits(['close'])

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
  if (!idno.value ){
    alert("please provide IDNo")
  } else {

    if (isNaN(Number(idno.value))) {
    alert("ID Number must be a number");
    return;
  }
    
    const result = await getStudent(idno.value)
    console.log(result)
    if (result.length !=0) {
      
      student.idno = result[0].idno
      student.firstname = result[0].firstname
      student.middlename = result[0].middlename
      student.lastname = result[0].lastname
      student.email = result[0].email
      student.course = result[0].course
      student.yearlevel = result[0].yearlevel
      student.sessions = result[0].sessions

      isSearchModalOpen.value = false
      openSitinModal.value = true
      console.log(student)
    } else{
      alert("Student not found...")
    }
    
  }
}
const handleCancel = () => {
  emit('close')
}
const handleCloseModals = ()=>{
  handleCancel()
  openSitinModal.value=false
}
</script>

<template>
  <OpacityView v-if="openSitinModal" @click="openSitinModal = false"></OpacityView>
  <SitinStudentModalView v-if="openSitinModal===true" 
  @close="handleCloseModals" 
  :student="student" class=""/>
  <div
  v-if="isSearchModalOpen"
    class="border-2 border-green-500 absolute top-2/5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 w-1/4 gap-5 text-white p-10 rounded z-51 flex flex-col"
  >
    <h2 class="text-2xl font-bold text-violet-400">Search Student</h2>
    <form @submit.prevent="handleSearch">
      <div class="mb-4 flex gap-5 justify-between">
        <label for="idno" class="font-thin w-1/3">ID Number:</label>
        <input id="idno" v-model="idno" class="input w-full" required></input>
      </div>
      <div class="flex flex-row justify-end gap-5">

        <button
          type="button"
          class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-400"
          @click="handleCancel"
          >
          Cancel
        </button>
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-400"
        >
          Search
        </button>
      </div>
    </form>
  </div>
</template>
