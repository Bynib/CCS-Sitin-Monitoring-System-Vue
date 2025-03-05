<script setup lang="ts">
import { getSitin, updateSitinTime } from '../../../api/sitin'
import { updateSession } from '../../../api/student'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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

const handleSitinLogout = async (sitin_id: number, idno: number) => {
    console.log("hello")
    const result = await updateSession(idno)
    console.log(result)
    const result2 = await updateSitinTime(sitin_id)
    sitins.value = (await getSitin()).filter((sitin: Sitin) => sitin.LoggedOut === null)
    console.log(result2)
}
</script>
<template>
  <div class="flex flex-col items-center justify-center h-screen w-screen text-white">
    <div class="font-bold text-3xl mt-10 mb-10">Sitins</div>
    <div v-if="sitins.length > 0" class="w-7/10 h-3/4 overflow-scroll flex flex-col">
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
            v-for="(sitin, index) in sitins"
            :key="Number(sitin.sitin_id)"
            :class="index % 2 ? '  rounded-lg text-center' : ' bg-gray-800 rounded-lg text-center'"
          >
            <td class="p-5">{{ sitin.idno }}</td>
            <td>{{ sitin.firstname }} {{ sitin.lastname }}</td>
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
    <div v-else>No current sitins...</div>
  </div>
</template>
