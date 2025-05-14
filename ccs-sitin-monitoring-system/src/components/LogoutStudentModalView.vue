<script setup lang="ts">
import { getSitin } from '../../api/sitin'
import { ref, defineEmits, onBeforeMount, onMounted, computed } from 'vue'
import { updateSession, updatePoint, getStudent } from '../../api/student'
import { updateSitinTime } from '../../api/sitin'

import { findSitin } from '../../api/sitin'

const emit = defineEmits(['close'])
const addPoint = ref(false)


interface Student {
  idno: string
  firstname: string
  middlename: string
  lastname: string
  email: string
  course: string
  yearlevel: string
  sessions: string
  points: string
}
const props = defineProps<{
  student: Student
}>()
interface Sitin {
  sitin_id: number
  idno: string
  purpose: string
  laboratory: string
  date: string
  loggedOut: string
}

const sitins = ref<Sitin[]>([])

const isDisabled = ref(false)

onMounted(async () => {
  console.log(props.student.idno)
  sitins.value = await findSitin(props.student.idno)
  console.log('Values', sitins.value)
})

const handleLogout = async (sitin_id: number, idno: string) => {
  const confirmLogout = confirm('Confirm Student Logout')
  if (confirmLogout) {
    if (addPoint.value === true) {
      await updatePoint(Number(idno))
      if(await getStudent(idno).then((result)=>result[0].points % 3 !== 0)){
        await updateSession(Number(idno))
      }
    } else {
      await updateSession(Number(idno))
    }
    console.log('hello')
    const result2 = await updateSitinTime(sitin_id)
    sitins.value = (await getSitin()).filter((sitin: Sitin) => sitin.loggedOut === null)
    console.log(result2)
    window.location.reload()
  }
}

console.log('Values 2', sitins.value)

const handleCancel = () => {
  emit('close')
}
</script>

<template>
  <div
    class="border-2 border-green-500 text-white flex flex-col w-2/7 absolute top-1/2 left-1/2 p-10 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 rounded drop-shadow z-60"
  >
    <h2 class="text-2xl font-bold">Student Details</h2>
    <div class="bg-white h-0.5 mt-3 mb-3"></div>
    <form
      v-for="sitin in sitins"
      :key="sitin.sitin_id"
      @submit.prevent="handleLogout(sitin.sitin_id, sitin.idno)"
      class="flex flex-col items-center"
    >
      <div class="mb-4 w-14/15 flex flex-col">
        <div class="flex flex-row justify-between p-2">
          <!-- <div v-if="props.student.firstname = ''"> null</div> -->
          <p class="font-bold mb-2">ID Number:</p>
          <p class="font-bold mb-2" ref="idno">{{ sitin.idno }}</p>
        </div>
        <div class="flex flex-row justify-between bg-gray-700 pl-3 pt-1.5 pr-3 rounded">
          <p class="font-bold mb-2">Name:</p>
          <p class="font-bold mb-2">
            {{ student.firstname }} {{ student.middlename }} {{ student.lastname }}
          </p>
        </div>
        <div class="flex flex-row justify-between p-2">
          <p class="font-bold mb-2">Course & Year:</p>
          <p class="font-bold mb-2">{{ student.course }} {{ student.yearlevel }}</p>
        </div>
        <div class="flex flex-row justify-between p-2">
          <p for="purpose" class="">Purpose:</p>
          <p>{{ sitin.purpose }}</p>
        </div>
        <div class="flex flex-row justify-between p-2">
          <label for="laboratory" class="">Laboratory:</label>
          <p>{{ sitin.laboratory }}</p>
        </div>
        <div class="flex flex-row justify-between p-2">
          <div class="flex flex-row gap-10">
            <label for="laboratory" class="">Current Points:</label>
            <p>{{ student.points }}</p>
          </div>
          <div class="flex flex-row gap-5">
              <input class="w-5 h-5" type="checkbox" v-model="addPoint" />
              <p>Add point</p>
            </div>
        </div>
      </div>
      <div class="w-20/22 flex flex-col justify-between gap-5">
        <button
          type="submit"
          :class="
            isDisabled
              ? 'bg-gray-500 text-white font-bold py-2 px-4 rounded'
              : 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-400'
          "
          :disabled="isDisabled"
        >
          Logout
        </button>
        <button
          type="button"
          class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-400"
          @click="handleCancel"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>
