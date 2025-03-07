<script setup lang="ts">
import { getSitin, updateSitinTime } from '../../../api/sitin'
import { updateSession } from '../../../api/student'
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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
}

const sitins = ref<Sitin[]>([])

onMounted(async () => {
  sitins.value = (await getSitin()).filter((sitin: Sitin) => sitin.LoggedOut === null).sort((a: Sitin, b: Sitin) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

// const filteredSitins = computed(() => {
//   if(!searchQuery.value) return sitins.value
//   return sitins.value.filter((sitin: Sitin) => {
//     return (
//       sitin.idno.toString().includes(searchQuery.value) ||
//       sitin.firstname.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
//       sitin.middlename.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
//       sitin.lastname.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
//       sitin.course.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
//       sitin.yearlevel.toString().includes(searchQuery.value) ||
//       sitin.purpose.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
//       sitin.laboratory.toString().includes(searchQuery.value) ||
//       sitin.date.toLowerCase().includes(searchQuery.value.toLowerCase())
//     )
//   })
// })

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
                @click="handleSitinLogout(Number(sitin.sitin_id), Number(sitin.idno))"
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
