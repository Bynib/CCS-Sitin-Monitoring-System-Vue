<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getSitin } from '../../../api/sitin'
import { Pie } from 'vue-chartjs'
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const laboratory = ref('');

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

const filteredSitins = computed(() => {
  console.log("Selected lab:", laboratory.value);
  console.log("Available sitins:", sitins.value);

  if (laboratory.value === 'all' || laboratory.value === '') {
    return sitins.value;
  } else {
    return sitins.value.filter(s => {
      console.log("Comparing:", s.laboratory, "with", laboratory.value);
      console.log(String(s.laboratory) === String(laboratory.value))
      return String(s.laboratory) === String(laboratory.value);
    });
  }
});


const exportData = (format: 'pdf' | 'csv' | 'xlsx') => {
  console.log(laboratory.value)

  if (!laboratory.value) {
    alert('Please select a laboratory');
    return;
  }

  console.log(filteredSitins.value)
  if (filteredSitins.value.length === 0) {
    alert(`No records found for Laboratory ${laboratory.value}`);
    return;
  }

  const data = filteredSitins.value.map((sitin:Sitin) => [
    sitin.idno,
    `${sitin.firstname} ${sitin.middlename} ${sitin.lastname}`,
    sitin.course,
    sitin.yearlevel,
    sitin.purpose,
    sitin.laboratory,
    new Date(sitin.date).toLocaleString(),
    new Date(sitin.LoggedOut).toLocaleString(),
  ]);

  const headers = ['ID Number', 'Name', 'Course', 'Year Level', 'Purpose', 'Laboratory', 'Time In', 'Time Out'];
  const fileName = `sitin-feedback-${laboratory.value}.`;

  switch (format) {
    case 'pdf':
      const doc = new jsPDF();
      doc.setFont('Times New Roman', 'bold').setFontSize(16);
      doc.text(`Sit-in Feedback - Laboratory ${laboratory.value}`, 105, 15, { align: 'center' });
      autoTable(doc, { startY: 25, head: [headers], body: data.map(row => row.map(String)) });
      doc.save(`${fileName}pdf`);
      break;
    
    case 'csv':
      const csvContent = [headers.join(','), ...data.map(row => row.map(String).join(','))].join('\n');
      const csvBlob = new Blob([csvContent], { type: 'text/csv' });
      saveAs(csvBlob, `${fileName}csv`);
      break;
    
    case 'xlsx':
      const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, `Lab ${laboratory.value}`);
      const xlsxBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([xlsxBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `${fileName}xlsx`);
      break;
  }
};

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
    <div class="font-bold text-3xl mt-30 ">Records</div>
    <div v-if="sitins.length > 0" class="w-7/10 h-3/4 overflow-scroll flex flex-col">
      <div class="flex flex-col w-full items-end gap-5 mb-10">
        <select v-model="laboratory" class="select w-1/20">
          <option value="all" class="option">All</option>
          <option v-for="lab in ['524', '526', '528', '530', '542', '544']" :key="lab" :value="lab" class="option">{{ lab }}</option>
        </select>
        <div class="flex gap-5">
          <button @click="exportData('pdf')" class="bg-blue-300 flex justify-center text-black p-2 rounded">Generate PDF</button>
          <button @click="exportData('csv')" class="bg-blue-300 flex justify-center text-black p-2 rounded">Generate CSV</button>
          <button @click="exportData('xlsx')" class="bg-blue-300 flex justify-center text-black p-2 rounded">Generate Excel</button>
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
