<script setup lang="ts">
import {getLabSchedule} from '@/../api/lab_schedule'
import { ref } from 'vue'

interface LabSchedule {
  id: number,
  lab_number: string,
  day_type: string,
  time_slot: string,
  status: string
}

const labSchedules = ref<LabSchedule[]>([])


// Labs
const selectedLab = ref('')

const timeSlots = [
  "7:30-8:00 AM",
  "8:00-8:30 AM",
  "8:30-9:00 AM",
  "9:00-9:30 AM",
  "9:30-10:00 AM",
  "10:00-10:30 AM",
  "10:30-11:00 AM",
  "11:00-11:30 AM",
  "11:30 AM-12:00 PM",
  "12:00-12:30 PM",
  "12:30-1:00 PM",
  "1:00-1:30 PM",
  "1:30-2:00 PM",
  "2:00-2:30 PM",
  "2:30-3:00 PM",
  "3:00-3:30 PM",
  "3:30-4:00 PM",
  "4:00-4:30 PM",
  "4:30-5:00 PM",
  "5:00-5:30 PM",
  "5:30-6:00 PM",
  "6:00-6:30 PM",
  "6:30-7:00 PM",
  "7:00-7:30 PM",
  "7:30-8:00 PM",
  "8:00-8:30 PM",
  "8:30-9:00 PM"
]

// Dummy schedule data
const schedule = ref<Record<string, Record<string, string>>>({})


// Toggle lab
const toggleLab = async (lab: string) => {
  selectedLab.value = lab
  labSchedules.value = await getLabSchedule(lab)
  timeSlots.forEach(time => {
    schedule.value[time] = {
      monWed: 'Closed',
      tuesThurs: 'Closed',
      fri: 'Closed',
      sat: 'Closed'
    }
  })
  console.log(selectedLab.value)
  console.log(labSchedules.value)
}

// Toggle slot status
// Toggle slot status
const toggleSlot = (day: string, time: string) => {
  const [startTime, endTime] = time.split(' - ')
  schedule.value[`${startTime} - ${endTime}`][day] = schedule.value[`${startTime} - ${endTime}`][day] === 'Open' ? 'Closed' : 'Open'
  console.log(time)
  console.log(day)
  console.log(schedule.value[`${startTime} - ${endTime}`][day])
}
</script>

<template>
  <div class="flex flex-col items-center align-center min-h-screen w-screen text-white bg-gray-900 p-4">
    <h1 class="text-3xl mt-20 mb-6">Laboratory Schedule</h1>

    <!-- Labs -->
    <div class="w-full flex justify-center flex-wrap gap-2 mb-6">
      <div
        v-for="lab in ['517', '524', '526', '528', '530', '542', '544']"
        :key="lab"
        @click="toggleLab(lab)"
        :class="['w-20 h-10 flex justify-center items-center border rounded cursor-pointer transition-colors', selectedLab === lab ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600']"
      >
        <p>{{ lab }}</p>
      </div>
    </div>

    <!-- Schedule Table -->
    <div v-if="selectedLab" class="w-full lg:w-11/12 xl:w-10/12 mt-2  border rounded-lg overflow-auto shadow-lg" style="max-height: 70vh;">
      <table class="table-auto w-full text-center">
        <thead class="bg-gray-800 sticky top-0">
          <tr>
            <th class="p-3">Time</th>
            <th class="p-3">Monday/Wednesday</th>
            <th class="p-3">Tuesday/Thursday</th>
            <th class="p-3">Friday</th>
            <th class="p-3">Saturday</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="time in timeSlots" :key="time" class="border-t">
            <td class="p-3 font-medium">{{ time }}</td>
            <td class="p-2 w-1/5">
              <button 
                @click="toggleSlot('monWed', time)"
                :class="['w-full py-2 px-1 rounded transition-colors', schedule[time].monWed === 'Open' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700']"
              >
                {{ schedule[time].monWed }}
              </button>
            </td>
            <td class="p-2 w-1/5">
              <button 
                @click="toggleSlot('tuesThurs', time)"
                :class="['w-full py-2 px-1 rounded transition-colors', schedule[time].tuesThurs === 'Open' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700']"
              >
                {{ schedule[time].tuesThurs }}
              </button>
            </td>
            <td class="p-2 w-1/5">
              <button 
                @click="toggleSlot('fri', time)"
                :class="['w-full py-2 px-1 rounded transition-colors', schedule[time].fri === 'Open' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700']"
              >
                {{ schedule[time].fri }}
              </button>
            </td>
            <td class="p-2 w-1/5">
              <button 
                @click="toggleSlot('sat', time)"
                :class="['w-full py-2 px-1 rounded transition-colors', schedule[time].sat === 'Open' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700']"
              >
                {{ schedule[time].sat }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="mt-10 text-xl text-gray-400">Please select a lab</div>
  </div>
</template>