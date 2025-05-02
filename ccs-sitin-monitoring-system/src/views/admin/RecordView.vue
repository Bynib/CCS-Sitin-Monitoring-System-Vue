<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getSitin } from '../../../api/sitin'
import { Pie } from 'vue-chartjs'
import { jsPDF } from 'jspdf'
import { autoTable } from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const filter = ref('')
const sitins = ref<Sitin[]>([])
const filteredData = ref<Sitin[]>([])
const byLaboratory = ref(false)
const byPurpose = ref(false)

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

const filterBy = (format: 'purpose' | 'laboratory') => {
  switch (format) {
    case 'purpose':
      byPurpose.value = true
      byLaboratory.value = false
      break
    case 'laboratory':
      byPurpose.value = false
      byLaboratory.value = true
      break
  }
}

const filteredSitins = computed<Sitin[]>(() => {
  if (!sitins.value || sitins.value.length === 0) return [];
  if (byLaboratory.value) {
    return sitins.value.filter(s => String(s.laboratory) === String(filter.value));
  }
  if (byPurpose.value) {
    return sitins.value.filter(s => String(s.purpose) === String(filter.value));
  }
  return sitins.value;
})



const filterData = () => {
  console.log("laboratory ",filter.value)
  console.log("purpose ",filter.value)
  console.log('by purpose', byPurpose.value)
  if (byLaboratory.value){

    if (filter.value.toLowerCase() === 'all' || filter.value === '') {
      filteredData.value = [...sitins.value]
    } else {
      filteredData.value = sitins.value.filter(
        (s) => String(s.laboratory) === String(filter.value),
      )
    }
  } else if (byPurpose.value){
    
    if(filter.value.toLowerCase() === 'all' || filter.value === ''){
      filteredData.value = [...sitins.value]
    } else{
      filteredData.value = sitins.value.filter(
        (s) => {
        console.log(`Checking: ${s.purpose} === ${filter.value}`); // Debugging output
        return String(s.purpose).trim() === String(filter.value).trim();
      })
    }
  }
}

const exportData = (format: 'pdf' | 'csv' | 'xlsx') => {
  console.log(filter.value)

  if (!filter.value) {
    alert('Please select a laboratory or purpose')
    return
  }

  console.log(filteredSitins.value)
  if (!filteredData.value || filteredData.value.length === 0) { 
    alert(`No records found for Laboratory ${filter.value}`)
    return
  }

  const data = filteredData.value.map((sitin: Sitin) => [
    sitin.idno,
    `${sitin.firstname} ${sitin.middlename} ${sitin.lastname}`,
    sitin.course,
    sitin.yearlevel,
    sitin.purpose,
    sitin.laboratory,
    new Date(sitin.date).toLocaleString(),
    new Date(sitin.LoggedOut).toLocaleString(),
  ])

  const headers = [
    'ID Number',
    'Name',
    'Course',
    'Year Level',
    'Purpose',
    'Laboratory',
    'Time In',
    'Time Out',
  ]
  const fileName = `sitin-record-for-${filter.value} ${new Date().toLocaleDateString()}.`

  switch (format) {
    case 'pdf':
      const doc = new jsPDF()
      doc.setFont('Times New Roman', 'bold').setFontSize(14)
      doc.text('University of Cebu-Main\nCollege of Computer Studies\nComputer Laboratory Sitin Monitoring System Report', 105, 10, { align: 'center' })

      if(byPurpose.value){
        doc.text(`Records for Purpose (${filter.value})`, 105, 35, { align: 'center' })
      } else if(byLaboratory.value){
        doc.text(`Records for Laboratory (${filter.value})`, 105, 35, { align: 'center' }) 
      }

      autoTable(doc, { startY: 40, head: [headers], body: data.map((row) => row.map(String)) })
      doc.save(`${fileName}`)
      break

    case 'csv':
      const csvContent = [headers.join(','), ...data.map((row) => row.map(String).join(','))].join(
        '\n',
      )
      const csvBlob = new Blob([csvContent], { type: 'text/csv' })
      saveAs(csvBlob, `${fileName}`)
      break

    case 'xlsx':
      const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data])
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, `Lab ${filter.value}`)
      const xlsxBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      saveAs(
        new Blob([xlsxBuffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }),
        `${fileName}`,
      )
      break
  }
}

const chartData = ref({
  labels: ['Label 1', 'Label 2', 'Label 3'],
  datasets: [
    {
      label: 'Dataset 1',
      data: [10, 20, 30],
      backgroundColor: [
        'rgba(255,99,132,0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
      ],
      borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
      borderWidth: 1,
    },
  ],
})
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
})

onMounted(async () => {
  sitins.value = (await getSitin()).filter((sitin: Sitin) => sitin.LoggedOut !== null).reverse();
  // chartData.value.labels =  ['Label 1', 'Label 2', 'Label 3']
  // chartData.value.datasets[0].data = [10, 20, 30]
  filteredData.value = [...sitins.value]
})
</script>

<template>
  <div class="flex flex-col items-center h-screen w-screen text-white">
    <!-- <pie-chart :chart-data="chartData" :options="chartOptions" class="w-full h-64 mx-auto"></pie-chart> -->
    <div class="font-bold text-3xl mt-30">Records</div>
      <div class="flex flex-col w-7/10 items-end gap-5 mb-10">
        <div class="flex w-full justify-end gap-5">
          <button @click="filterBy('laboratory')" :class="byLaboratory ? 'font-extrabold' : ''">By Laboratory</button>
          <button @click="filterBy('purpose')" :class="byPurpose ? 'font-extrabold' : ''">By Purpose</button>
          <select v-model="filter" class="select w-2/20" v-if="byLaboratory || byPurpose">
            <option
              v-if="byLaboratory"
              v-for="lab in ['All', '517', '524', '526', '528', '530', '542', '544']"
              :key="lab"
              :value="lab"
              class="option"
            >
              {{ lab }}
            </option>
            <option
              v-if="byPurpose"
              v-for="purpose in ['All','C Programming', 'Java Programming', 'C# Programming', 'Systems Integration and Architecture', 'Embedded Systems & IoT', 'Digital Logic & Design', 'Computer Application', 'Database', 'Project Management', 'Python Programming', 'Mobile Application', 'Web Design', 'PHP Programming']"
              :key="purpose"
              :value="purpose"
              class="option"
            >
              {{ purpose }}
            </option>
          </select>
          <button
            @click="filterData"
            class="bg-blue-300 flex justify-center text-black p-2 rounded w-1/10"
          >
            Filter
          </button>
        </div>
        <div class="flex gap-5">
          <button
            @click="exportData('pdf')"
            class="text-white border-2 flex justify-center p-2 rounded"
          >
            Generate PDF
          </button>
          <button
            @click="exportData('csv')"
            class="text-white border-2 flex justify-center p-2 rounded"
          >
            Generate CSV
          </button>
          <button
            @click="exportData('xlsx')"
            class="text-white border-2 flex justify-center p-2 rounded"
          >
            Generate Excel
          </button>
        </div>
      </div>
    <div v-if="filteredData.length > 0" class="w-7/10 h-3/4 overflow-scroll flex flex-col">
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
            v-for="(sitin, index) in filteredData"
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
    <div v-else class="w-7/10 h-3/4 overflow-scroll flex flex-col">
      <div class="flex flex-col w-full items-end gap-5 mb-10">
        <div class="flex w-full justify-end gap-5">
          <button @click="filterBy('laboratory')" :class="byLaboratory ? 'font-extrabold' : ''">By Laboratory</button>
          <button @click="filterBy('purpose')" :class="byPurpose ? 'font-extrabold' : ''">By Purpose</button>
          <select v-model="filter" class="select w-1/20">
            <option
              v-if="byLaboratory"
              v-for="lab in ['All', '517','524', '526', '528', '530', '542', '544']"
              :key="lab"
              :value="lab"
              class="option"
            >
              {{ lab }}
            </option>
            <option
              v-else
              v-for="purpose in ['C Programming', 'Java Programming', 'C# Programming', 'Systems Integration and Architecture', 'Embedded Systems & IoT', 'Digital Logic & Design', 'Computer Application', 'Database', 'Project Management', 'Python Programming', 'Mobile Application', 'Web Design', 'PHP Programming']"
              :key="purpose"
              :value="purpose"
              class="option"
            >
              {{ purpose }}
            </option>
          </select>
          <button
            @click="filterData"
            class="bg-blue-300 flex justify-center text-black p-2 rounded w-1/10"
          >
            Filter
          </button>
        </div>
        <div class="flex gap-5">
          <button
            @click="exportData('pdf')"
            class="text-white border-2 flex justify-center p-2 rounded"
          >
            Generate PDF
          </button>
          <button
            @click="exportData('csv')"
            class="text-white border-2 flex justify-center p-2 rounded"
          >
            Generate CSV
          </button>
          <button
            @click="exportData('xlsx')"
            class="text-white border-2 flex justify-center p-2 rounded"
          >
            Generate Excel
          </button>
        </div>
      </div>
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
        <tbody></tbody>
      </table>
      <p class="w-full text-center mt-10 text-2xl">No record found...</p>
    </div>
  </div>
</template>
