<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { getSitin, findSitin } from '../../../api/sitin'
import FeedbackModalView from '@/components/FeedbackModalView.vue'
import { useStudentStore } from '@/stores/student.store'
import OpacityView from '@/components/OpacityView.vue'

const studentStore = useStudentStore()
const openFeedbackModal = ref(false)
const id = reactive({
  sitin_id: 0,
})
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
  feedback: string
}

const sitins = ref<Sitin[]>([])

onMounted(async () => {
  sitins.value = (await getSitin()).filter(
    (sitin: Sitin) => sitin.LoggedOut !== null && sitin.idno === Number(studentStore.student.idNo),
  ).reverse();
  console.log(studentStore.student.idNo)
})

const handleButtonClick = async (sitin_id: number) => {
  console.log(sitin_id)
  openFeedbackModal.value = true
  id.sitin_id = sitin_id
  console.log("feedback:", sitins.value[0].feedback)
}

</script>

<template>
  <OpacityView v-if="openFeedbackModal === true" @click="openFeedbackModal = false"></OpacityView>
  <FeedbackModalView
    v-if="openFeedbackModal === true"
    @close="openFeedbackModal = false"
    class="absolute border-2 border-green-500 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-4 rounded drop-shadow z-50"
    :sitin_id="id.sitin_id"
  ></FeedbackModalView>
  <div class="flex flex-col items-center justify-center h-screen w-screen text-white">
    <!-- <div class="font-bold text-3xl mt-10 mb-10"></div> -->
    <div v-if="sitins.length > 0" class="w-7/10 h-3/4 overflow-scroll flex flex-col">
      <table id="table" name="table" class="table-auto">
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
              <button
                :disabled="sitin.feedback !== null"
                :class="sitin.feedback === null ? 'bg-violet-700 hover:bg-violet-900 text-white font-bold py-2 px-4 rounded transition-colors duration-400' : ' py-2 px-4 rounded cursor-none text-gray-500'"
                  
                @click="handleButtonClick(Number(sitin.sitin_id))"
              >
              {{ sitin.feedback !== null ? 'Done' : 'Send' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>No sitin history...</div>
  </div>
</template>
