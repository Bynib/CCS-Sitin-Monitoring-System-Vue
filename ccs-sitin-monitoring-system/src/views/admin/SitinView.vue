<script setup lang="ts">
import { getStudent } from '../../../api/student'
import { getSitin, updateSitinTime } from '../../../api/sitin'
import { updateSession } from '../../../api/student'
import { ref, onMounted, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import LogoutStudentModalView from '@/components/LogoutStudentModalView.vue'

const router = useRouter()
const openLogoutModal = ref(false)

const searchQuery = ref()

interface Sitin {
  sitin_id: Number
  idno: Number
  firstname: string
  middlename: string
  lastname: string
  course: string
  yearlevel: Number
  purpose: string
  laboratory: Number
  date: string
  LoggedOut: string
  points: string
}

const sitins = ref<Sitin[]>([])

const student = reactive({
    idno: '',
    firstname: '',
    middlename: '',
    lastname: '',
    email: '',
    course: '',
    yearlevel: '',
    sessions: '',
    points: ''
})

const handleCloseModal = ()=>{
  openLogoutModal.value=false
}

onMounted(async () => {
  sitins.value = (await getSitin()).filter((sitin: Sitin) => sitin.LoggedOut === null).sort((a: Sitin, b: Sitin) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const logoutButtonClicked = async(sitin_id: number, idno: number) => {
  const sitin = sitins.value.find((sitin:Sitin) => sitin.sitin_id === sitin_id)
  if (sitin) {
    student.idno = String(sitin.idno)
    student.firstname = sitin.firstname
    student.middlename = sitin.middlename
    student.lastname = sitin.lastname
    student.course = sitin.course
    student.yearlevel = String(sitin.yearlevel)
    student.points = await getStudent(String(idno)).then((result) => result[0].points)
    // student.points = sitin.points
    openLogoutModal.value = true
  }
}
const handleSitinLogout = async (sitin_id: number, idno: number) => {
    const confirmLogout = confirm("Confirm Student Logout")
    if (confirmLogout){

      console.log("hello")
      const result = await updateSession(idno)
      console.log(result)
      const result2 = await updateSitinTime(sitin_id)
      sitins.value = (await getSitin()).filter((sitin: Sitin) => sitin.LoggedOut === null)
      console.log(result2)
    }
}

const filteredSitins = computed(() => {
  if (!searchQuery.value || searchQuery.value === '') {
    return sitins.value
  } else {
    return sitins.value.filter((sitin: Sitin) => {
      return (
        sitin.idno.toString().includes(searchQuery.value) ||
        sitin.firstname.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        sitin.lastname.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        sitin.course.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        sitin.purpose.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        sitin.laboratory.toString().includes(searchQuery.value)
      )
    })
  }
})

// watch(searchQuery, (newValue) => {
//   if (!newValue) {
//     filteredSitins.value = sitins.value
//   } else {
//     filteredSitins.value = sitins.value.filter((sitin:Sitin) => {
//       return (
//         sitin.idno.toString().includes(newValue) ||
//         sitin.firstname.toLowerCase().includes(newValue.toLowerCase()) ||
//         sitin.lastname.toLowerCase().includes(newValue.toLowerCase()) ||
//         sitin.course.toLowerCase().includes(newValue.toLowerCase()) ||
//         sitin.purpose.toLowerCase().includes(newValue.toLowerCase()) ||
//         sitin.laboratory.toString().includes(newValue)
//       )
//     })
//   }
// })

</script>
<template>
  <div class="flex flex-col items-center align-center h-screen w-screen text-white">
    <LogoutStudentModalView v-if="openLogoutModal===true" 
      @close="handleCloseModal" 
      :student="student" class=""/>
    <div class="font-bold text-3xl mt-30">Sitins</div>
    <div class="w-7/10 flex justify-end">

      <input  type="text" v-model="searchQuery" placeholder="Search" class="input w-1/5">
    </div>
    <br>
    <div v-if="filteredSitins.length > 0" class="w-7/10 h-3/4 overflow-scroll flex flex-col">
      <table class="table-auto">
        <thead>
          <tr class="sticky top-0 bg-[#181818]">
            <th>ID Number</th>
            <th>Name</th>
            <th>Course</th>
            <th>Year Level</th>
            <th>Purpose</th>
            <th>Laboratory</th>
            <th>Time In</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(sitin, index) in filteredSitins"
            :key="Number(sitin.sitin_id)"
            :class="index % 2 ? '  rounded-lg text-center' : ' bg-gray-800 rounded-lg text-center'"
          >
            <td class="p-5">{{ sitin.idno }}</td>
            <td>{{ sitin.firstname }} {{ sitin.middlename }} {{ sitin.lastname }}</td>
            <td>{{ sitin.course }}</td>
            <td>{{ sitin.yearlevel }}</td>
            <td>{{ sitin.purpose }}</td>
            <td>{{ sitin.laboratory }}</td>
            <td>
              {{ new Date(sitin.date).toLocaleDateString() }}
              {{ new Date(sitin.date).toLocaleTimeString() }}
            </td>
            <td>
              <button
                class="bg-violet-700 hover:bg-violet-900 text-white font-bold py-2 px-4 rounded transition-colors duration-400"
                @click="logoutButtonClicked(Number(sitin.sitin_id), Number(sitin.idno))"
              >
                Logout
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="w-7/10 h-3/4 overflow-scroll flex flex-col">
      <!-- <table class="table-auto">
        <thead>
          <tr class="sticky top-0 bg-[#181818]">
            <th>ID Number</th>
            <th>Name</th>
            <th>Course</th>
            <th>Year Level</th>
            <th>Purpose</th>
            <th>Laboratory</th>
            <th>Time In</th>
            <th>Actions</th>
          </tr>
        </thead> -->
        <!-- <tbody>
          <tr
          >
            <td class="p-5 bg-amber-200 text-2xl">No Sitin Found</td>
          </tr>
        </tbody> -->
      <!-- </table> -->
      <div class="w-full flex flex-row justify-center text-5xl mt-10">No Student Found...</div>
    </div>
  </div>
</template>
