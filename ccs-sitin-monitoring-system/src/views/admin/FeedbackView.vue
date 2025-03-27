<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getSitin } from '../../../api/sitin';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const laboratory = ref('');
const sitins = ref<Sitin[]>([]);

interface Sitin {
  sitin_id: number;
  idno: number;
  firstname: string;
  middlename: string;
  lastname: string;
  course: string;
  yearlevel: number;
  purpose: string;
  laboratory: string;
  date: string;
  LoggedOut: string;
  feedback: string;
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

  const data = filteredSitins.value.map(sitin => [
    sitin.idno,
    `${sitin.firstname} ${sitin.middlename} ${sitin.lastname}`,
    sitin.course,
    sitin.yearlevel,
    sitin.purpose,
    sitin.laboratory,
    new Date(sitin.date).toLocaleString(),
    new Date(sitin.LoggedOut).toLocaleString(),
    sitin.feedback,
  ]);

  const headers = ['ID Number', 'Name', 'Course', 'Year Level', 'Purpose', 'Laboratory', 'Time In', 'Time Out', 'Feedback'];
  const fileName = `sitin-feedback-${laboratory.value}.`;

  switch (format) {
    case 'pdf':
      const doc = new jsPDF();
      doc.setFont('Times New Roman', 'bold').setFontSize(16);
      doc.text(`Sit-in Feedback - Laboratory ${laboratory.value}`, 105, 15, { align: 'center' });
      autoTable(doc, { startY: 25, head: [headers], body: data });
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

onMounted(async () => {
  sitins.value = (await getSitin()).filter((s:Sitin) => s.LoggedOut !== null && s.feedback !== null);
});
</script>

<template>
  <div class="flex flex-col items-center h-screen w-screen text-white">
    <div class="font-bold text-3xl mt-30">Feedbacks</div>
    <div v-if="sitins.length" class="w-7/10 h-3/4 overflow-scroll flex flex-col">
      <div class="flex flex-col w-full items-end gap-5">
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
      <table class="table-auto mt-5">
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
            <th>Feedback</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sitin in sitins" :key="sitin.sitin_id" class="bg-gray-800 text-center">
            <td class="p-4">{{ sitin.idno }}</td>
            <td>{{ sitin.firstname }} {{ sitin.middlename }} {{ sitin.lastname }}</td>
            <td>{{ sitin.course }}</td>
            <td>{{ sitin.yearlevel }}</td>
            <td>{{ sitin.purpose }}</td>
            <td>{{ sitin.laboratory }}</td>
            <td>{{ new Date(sitin.date).toLocaleString() }}</td>
            <td>{{ new Date(sitin.LoggedOut).toLocaleString() }}</td>
            <td class="bg-violet-700">{{ sitin.feedback }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>No record...</div>
  </div>
</template>