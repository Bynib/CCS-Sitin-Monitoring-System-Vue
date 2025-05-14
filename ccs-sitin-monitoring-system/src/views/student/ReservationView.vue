<script setup lang="ts">
import { ref, computed, onMounted, watch, reactive } from 'vue'
import { getAvailablePCs, createReservation } from '@/../api/reservation'
import { addNotification } from '@/../api/notification'
import { findSitin } from '@/../api/sitin'
import { useStudentStore } from '@/stores/student.store'

const studentStore = useStudentStore()
const studentDetails = reactive({
  idno: studentStore.student.idNo,
  sessions: studentStore.student.sessions
})

const hasActiveSitin = ref(false)

const laboratories = ref([
  { id: '517', name: 'Lab 517' },
  { id: '524', name: 'Lab 524' },
  { id: '526', name: 'Lab 526' },
  { id: '528', name: 'Lab 528' },
  { id: '530', name: 'Lab 530' },
  { id: '542', name: 'Lab 542' },
  { id: '544', name: 'Lab 544' }
])

const purposeOptions = ref([
  'C Programming', 
  'Java Programming', 
  'C# Programming', 
  'Systems Integration and Architecture', 
  'Embedded Systems & IoT', 
  'Digital Logic & Design', 
  'Computer Application', 
  'Database', 
  'Project Management', 
  'Python Programming', 
  'Mobile Application', 
  'Web Design', 
  'PHP Programming'
])

const timeSlots = ref([
  "7:30", "8:00", "8:30", "9:00", "9:30", "10:00", 
  "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", 
  "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", 
  "16:30", "17:00", "17:30", "18:00", "18:30", "19:00",
  "19:30", "20:00", "20:30", "21:00"
])

interface PC {
  labno: string
  pcno: string
  status: string
}

const selectedLab = ref('')
const selectedDate = ref('')
const selectedTimeSlot = ref('')
const selectedPC = ref('')
const purpose = ref('')

const loadingPCs = ref(false)
const availablePCs = ref<PC[]>([])
const submitting = ref(false)
const notification = ref({
  show: false,
  message: '',
  success: false
})

const isFormDisabled = computed(() => {
  return hasActiveSitin.value
})

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const canSubmit = computed(() => {
  return selectedPC.value && 
         selectedTimeSlot.value && 
         purpose.value &&
         !hasActiveSitin.value
})

const checkActiveSitin = async () => {
  try {
    const sitins = await findSitin(studentDetails.idno)
    hasActiveSitin.value = sitins.some((s:any) => !s.loggedout)
  } catch (error) {
    console.error('Error checking active sit-ins:', error)
  }
}

const fetchAvailablePCs = async () => {
  if (!selectedLab.value || !selectedDate.value || !selectedTimeSlot.value || hasActiveSitin.value) return
  
  loadingPCs.value = true
  try {
    const response = await getAvailablePCs(
      Number(selectedLab.value),
    )
    availablePCs.value = response
    selectedPC.value = ''
  } catch (error) {
    console.error('Error fetching available PCs:', error)
    showNotification('Failed to fetch available computers', false)
  } finally {
    loadingPCs.value = false
  }
}

const isSlotAvailable = (time: string) => {
  return !hasActiveSitin.value
}

const getLabNumber = (labno: string) => {
  const lab = laboratories.value.find(l => l.id === labno)
  return lab ? lab.name : 'Unknown Lab'
}

const submitReservation = async () => {
  if (!canSubmit.value || hasActiveSitin.value) return
  console.log(studentDetails.idno, selectedDate.value, selectedTimeSlot.value, selectedPC.value, purpose.value, selectedLab.value)
  submitting.value = true
  try {
    await createReservation(
      Number(studentDetails.idno),
      new Date(selectedDate.value),
      selectedTimeSlot.value,
      Number(selectedPC.value),
      purpose.value,
      Number(selectedLab.value)
    )
    
    showNotification('Reservation submitted successfully!', true)
    await addNotification('New Reservation', `New reservation submitted by ${studentDetails.idno}`, '1000')
    resetForm()
  } catch (error: any) {
    console.error('Error submitting reservation:', error)
    showNotification(error.message || 'Failed to submit reservation', false)
  } finally {
    submitting.value = false
  }
}

const showNotification = (message: string, success: boolean) => {
  notification.value = {
    show: true,
    message,
    success
  }
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

const resetForm = () => {
  selectedPC.value = ''
  purpose.value = ''
}

watch([selectedDate, selectedTimeSlot], () => {
  if (selectedLab.value && selectedDate.value && selectedTimeSlot.value) {
    fetchAvailablePCs()
  }
})

onMounted(() => {
  selectedDate.value = minDate.value
  checkActiveSitin()
})
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
    <div class="w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg p-6">
      <h1 class="text-2xl font-bold text-center text-white mb-6">
        Computer Lab Reservation
      </h1>

      <div v-if="hasActiveSitin" class="mb-6">
        <Alert variant="destructive">
          <AlertCircle class="w-4 h-4" />
          <AlertDescription>
            You cannot make a reservation while currently seated in a lab. 
            Please log out from your current session first.
          </AlertDescription>
        </Alert>
      </div>

      <div v-if="!hasActiveSitin" class="mb-6 space-y-2">
        <label class="block text-sm font-medium text-gray-300">Select Laboratory</label>
        <select 
          v-model="selectedLab" 
          @change="fetchAvailablePCs"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          :disabled="isFormDisabled"
        >
          <option value="" disabled class="bg-gray-700">Choose a laboratory</option>
          <option 
            v-for="lab in laboratories" 
            :key="lab.id" 
            :value="lab.id"
            class="bg-gray-800"
          >
            {{ lab.name }}
          </option>
        </select>
      </div>

      <div v-if="!hasActiveSitin" class="mb-6 space-y-2">
        <label class="block text-sm font-medium text-gray-300">Select Date</label>
        <input 
          type="date" 
          v-model="selectedDate"
          :min="minDate"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          :disabled="isFormDisabled"
        >
      </div>

      <div v-if="!hasActiveSitin" class="mb-6 space-y-2">
        <label class="block text-sm font-medium text-gray-300">Select Start Time</label>
        <select
          v-model="selectedTimeSlot"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          :disabled="isFormDisabled"
        >
          <option value="" disabled>Select time</option>
          <option 
            v-for="time in timeSlots" 
            :key="time"
            :value="time"
            :disabled="!isSlotAvailable(time)"
          >
            {{ time }}
          </option>
        </select>
      </div>

      <div class="mb-6 space-y-2" v-if="selectedLab && selectedDate && selectedTimeSlot">
        <label class="block text-sm font-medium text-gray-300">Select Computer</label>
        <div v-if="loadingPCs" class="text-center py-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p class="mt-2 text-gray-400">Loading available computers...</p>
        </div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <div 
            v-for="pc in availablePCs" 
            :key="pc.pcno"
            @click="selectedPC = pc.pcno"
            class="p-3 border rounded-lg cursor-pointer transition-all bg-gray-700 hover:bg-gray-600"
            :class="{
              'border-gray-600': selectedPC !== pc.pcno,
              'border-blue-500 bg-gray-600': selectedPC === pc.pcno,
              'opacity-50 cursor-not-allowed': isFormDisabled
            }"
            :disabled="isFormDisabled"
          >
            <div class="flex items-center justify-between">
              <h3 class="font-medium text-white">PC {{ pc.pcno }}</h3>
              <span class="text-xs px-2 py-1 rounded-full bg-green-900/50 text-green-300">
                Available
              </span>
            </div>
            <p class="text-xs text-gray-400 mt-1">{{ getLabNumber(pc.labno) }}</p>
          </div>
          <div v-if="availablePCs.length === 0" class="col-span-full text-center py-4 text-gray-400">
            No available computers for selected criteria
          </div>
        </div>
      </div>

      <div class="mb-6 space-y-2" v-if="selectedPC">
        <label class="block text-sm font-medium text-gray-300">Student ID</label>
        <input 
          type="text" 
          v-model="studentDetails.idno"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          readonly
        >
      </div>
      
      <div class="mb-6 space-y-2" v-if="selectedPC">
        <label class="block text-sm font-medium text-gray-300">Remaining Sessions</label>
        <input 
          type="text" 
          v-model="studentDetails.sessions"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          readonly
        >
      </div>

      <div class="mb-6 space-y-2" v-if="selectedPC">
        <label class="block text-sm font-medium text-gray-300">Purpose</label>
        <select
          v-model="purpose"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          :disabled="isFormDisabled"
        >
          <option value="" disabled>Select purpose</option>
          <option v-for="(purposeOption, index) in purposeOptions" :key="index" :value="purposeOption">
            {{ purposeOption }}
          </option>
        </select>
      </div>

      <button 
        v-if="!hasActiveSitin"
        @click="submitReservation"
        :disabled="!canSubmit || submitting"
        class="w-full mt-6 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        <span v-if="!submitting">Submit Reservation</span>
        <span v-else class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      </button>

      <div 
        v-if="notification.show" 
        class="mt-4 p-3 rounded-md border"
        :class="{
          'bg-green-900/30 border-green-700 text-green-300': notification.success,
          'bg-red-900/30 border-red-700 text-red-300': !notification.success
        }"
      >
        {{ notification.message }}
      </div>
    </div>
  </div>
</template>

<style>
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1f2937;
}

::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(0.8);
}
</style>