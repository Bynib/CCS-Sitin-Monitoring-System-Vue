<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getSitin } from '../../../api/sitin'
import { Pie } from 'vue-chartjs'

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

const chartData = ref({
  labels: ['Label 1','Label 2','Label 3'],
  datasets: [{
    label: 'Dataset 1',
    data: [10,20,30],
    backgroundColor: [
      'rgba(255,99,132,0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)'
    ],
    borderColor: [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)'
    ],
    borderWidth: 1
  }]
})
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false
})

onMounted(async () => {
  sitins.value = (await getSitin()).filter((sitin: Sitin) => sitin.LoggedOut !== null)
  chartData.value.labels =  ['Label 1', 'Label 2', 'Label 3']
  chartData.value.datasets[0].data = [10, 20, 30]
  
})
</script>

<template>
  <div class="flex flex-col items-center h-screen w-screen text-white">
    <!-- <pie-chart :chart-data="chartData" :options="chartOptions" class="w-full h-64 mx-auto"></pie-chart> -->
    <div class="font-bold text-3xl mt-30 mb-12">Records</div>
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
            <th>Time Out</th>
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
                {{ new Date(sitin.LoggedOut).toLocaleDateString() }}
                {{ new Date(sitin.LoggedOut).toLocaleTimeString() }}
            </td>
            <td>
              <!-- <button
                class="bg-violet-700 hover:bg-violet-900 text-white font-bold py-2 px-4 rounded transition-colors duration-400"
                @click="handleSitinLogout(Number(sitin.sitin_id), Number(sitin.idno))"
              >
                Logout
              </button> -->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>No record...</div>
  </div>
</template>
