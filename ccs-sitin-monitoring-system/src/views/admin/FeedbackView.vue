<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getSitin } from '../../../api/sitin';


const sitins = ref<Sitin[]>([]);

const foulWords = ['piste', 'pisti', 'bwesit', 'yawa', 'fuck', 'shit', 'ass', 'asshole', 'assh0le', 'bullshit', 'shet'];

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

const checkFoulWords = (feedback: string) => {
  for (const word of foulWords) {
    if (feedback.toLowerCase().includes(word)) {
      console.log("fould word detected:", word);
      return true
    }
  }
  console.log("No foul words detected");
  return false
}

onMounted(async () => {
  sitins.value = (await getSitin()).filter((s:Sitin) => s.LoggedOut !== null && s.feedback !== null).reverse();

  sitins.value.forEach((sitin: Sitin) => {
    checkFoulWords(sitin.feedback)
  })
});
</script>

<template>
  <div class="flex flex-col items-center h-screen w-screen text-white">
    <div class="font-bold text-3xl mt-30">Feedbacks</div>
    <div v-if="sitins.length" class="w-7/10 h-3/4 overflow-scroll flex flex-col">
      
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
          <tr v-for="sitin, index in sitins" :key="sitin.sitin_id" :class=" index % 2 ? '  rounded-lg text-center' : ' bg-gray-800 rounded-lg text-center'">
            <td class="align-text-top p-5">{{ sitin.idno }}</td>
            <td class="align-text-top p-5">{{ sitin.firstname }} {{ sitin.middlename }} {{ sitin.lastname }}</td>
            <td class="align-text-top p-5">{{ sitin.course }}</td>
            <td class="align-text-top p-5">{{ sitin.yearlevel }}</td>
            <td class="align-text-top p-5">{{ sitin.purpose }}</td>
            <td class="align-text-top p-5">{{ sitin.laboratory }}</td>
            <td class="align-text-top p-5">{{ new Date(sitin.date).toLocaleString() }}</td>
            <td class="align-text-top p-5">{{ new Date(sitin.LoggedOut).toLocaleString() }}</td>
            <td :class="checkFoulWords(sitin.feedback) ? 'bg-red-700 text-left p-5' : 'bg-violet-700 text-left p-5 max-w-150'">{{ sitin.feedback }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>No record...</div>
  </div>
</template>