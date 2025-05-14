<template>
  <div class="flex flex-col items-center min-h-screen bg-gray-900 p-4">
    <div class="w-full max-w-6xl bg-gray-800 rounded-lg shadow-lg p-6">
      <h1 class="text-2xl font-bold text-center text-white mb-6">
        Computer Lab Reservation Management
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-300">Filter by Lab</label>
          <select
            v-model="filterLab"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Labs</option>
            <option v-for="lab in laboratories" :key="lab.id" :value="lab.id" class="bg-gray-800">
              {{ lab.name }}
            </option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-300">Search</label>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search by ID or name..."
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div class="overflow-x-auto rounded-lg border border-gray-700">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-gray-750">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                ID Number
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Date & Time
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Lab & PC
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Purpose
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-gray-800 divide-y divide-gray-700">
            <tr v-if="loadingReservations">
              <td colspan="6" class="px-6 py-4 text-center">
                <div class="flex justify-center items-center space-x-2">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span class="text-gray-400">Loading reservations...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredReservations.length === 0">
              <td colspan="6" class="px-6 py-4 text-center text-gray-400">
                <span v-if="searchQuery || filterLab">No reservations found matching your criteria</span>
                <span v-else>No reservations found</span>
              </td>
            </tr>
            <tr
              v-for="reservation in filteredReservations"
              :key="reservation.id"
              class="hover:bg-gray-750 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-white">
                  {{ reservation.idno || 'N/A' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-white">
                  {{ reservation.firstname }} {{ reservation.middlename }} {{ reservation.lastname }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-white">
                  {{ formatDate(reservation.date) }} at {{ reservation.startTime }}
                  <span v-if="reservation.startTime.length == 5 && Number(reservation.startTime[1]) >= 2">PM</span> <span v-else>AM</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-white">
                  {{ getLabName(reservation.labno) }}
                </div>
                <div class="text-sm text-gray-400">PC {{ reservation.pcno }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ reservation.purpose }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button
                    @click="confirmApprove(reservation)"
                    class="text-green-400 hover:text-green-300"
                    :disabled="processingAction"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button
                    @click="confirmDecline(reservation)"
                    class="text-red-400 hover:text-red-300"
                    :disabled="processingAction"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button @click="viewDetails(reservation)" class="text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between mt-4">
        <div class="text-sm text-gray-400">
          Showing <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to 
          <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredReservations.length) }}</span> of 
          <span class="font-medium">{{ filteredReservations.length }}</span> results
        </div>
        <div class="flex space-x-2">
          <button 
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1 rounded-md bg-gray-700 text-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <button 
            @click="currentPage = Math.min(Math.ceil(filteredReservations.length / itemsPerPage), currentPage + 1)"
            :disabled="currentPage * itemsPerPage >= filteredReservations.length"
            class="px-3 py-1 rounded-md bg-gray-700 text-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <div v-if="selectedReservation" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div class="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h2 class="text-xl font-bold text-white">Pending Action</h2>
              <button @click="selectedReservation = null" class="text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <h3 class="text-lg font-medium text-white border-b border-gray-700 pb-2">
                  Student Information
                </h3>
                <div>
                  <p class="text-sm text-gray-400">ID Number</p>
                  <p class="text-white">{{ selectedReservation.idno }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-400">Name</p>
                  <p class="text-white">
                    {{ selectedReservation.firstname }} {{ selectedReservation.lastname }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-400">Email</p>
                  <p class="text-white">{{ selectedReservation.email || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-400">Course & Year</p>
                  <p class="text-white">
                    {{ selectedReservation.course || 'N/A' }} {{ selectedReservation.yearlevel }}
                  </p>
                </div>
              </div>

              <div class="space-y-4">
                <h3 class="text-lg font-medium text-white border-b border-gray-700 pb-2">
                  Reservation Details
                </h3>
                <div>
                  <p class="text-sm text-gray-400">Date</p>
                  <p class="text-white">{{ formatDate(selectedReservation.date) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-400">Time</p>
                  <p class="text-white">{{ selectedReservation.startTime }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-400">Laboratory</p>
                  <p class="text-white">{{ getLabName(selectedReservation.labno) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-400">Computer Number</p>
                  <p class="text-white">PC {{ selectedReservation.pcno }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-400">Purpose</p>
                  <p class="text-white">{{ selectedReservation.purpose }}</p>
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <button
                @click="confirmDecline(selectedReservation)"
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                :disabled="processingAction"
              >
                Decline
              </button>
              <button
                @click="confirmApprove(selectedReservation)"
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                :disabled="processingAction"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showConfirmationDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div class="bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h2 class="text-xl font-bold text-white">
                {{ confirmationAction === 'approve' ? 'Approve Reservation' : 'Decline Reservation' }}
              </h2>
              <button @click="showConfirmationDialog = false" class="text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p class="text-gray-300 mb-6">
              Are you sure you want to {{ confirmationAction === 'approve' ? 'approve' : 'decline' }} this reservation?
            </p>

            <div class="flex justify-end space-x-3">
              <button
                @click="showConfirmationDialog = false"
                class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                @click="executeAction"
                class="px-4 py-2"
                :class="{
                  'bg-green-600 hover:bg-green-700 focus:ring-green-500 rounded-md': confirmationAction === 'approve',
                  'bg-red-600 hover:bg-red-700 focus:ring-red-500 rounded-md': confirmationAction === 'decline'
                }"
                :disabled="processingAction"
              >
                {{ confirmationAction === 'approve' ? 'Approve' : 'Decline' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div 
        v-if="notification.show" 
        class="fixed bottom-4 right-4 p-4 rounded-md shadow-lg border"
        :class="{
          'bg-green-900/30 border-green-700 text-green-300': notification.success,
          'bg-red-900/30 border-red-700 text-red-300': !notification.success
        }"
      >
        <div class="flex items-center">
          <svg v-if="notification.success" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          {{ notification.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  getReservations, 
  approveReservation as apiApproveReservation,
  declineReservation as apiDeclineReservation,
} from '@/../api/reservation'
import { updatePCAvailability } from '@/../api/pc'
import { addSitinFromReservation } from '@/../api/sitin'
import { addNotification } from '@/../api/notification'

interface Reservation {
  id: string
  idno: string
  firstname: string
  middlename: string
  lastname: string
  email: string
  yearlevel: string
  course: string
  session: string
  date: string
  labno: string
  pcno: string
  end_time: string
  purpose: string
  startTime: string
  status: string
}

const laboratories = ref([
  { id: '517', name: 'Lab 517' },
  { id: '522', name: 'Lab 522' },
  { id: '524', name: 'Lab 524' },
  { id: '526', name: 'Lab 526' },
  { id: '528', name: 'Lab 528' },
  { id: '530', name: 'Lab 530' },
  { id: '542', name: 'Lab 542' },
  { id: '544', name: 'Lab 544' }
])

const filterLab = ref('')
const searchQuery = ref('')

const currentPage = ref(1)
const itemsPerPage = ref(10)

const reservations = ref<Reservation[]>([])
const loadingReservations = ref(false)
const selectedReservation = ref<Reservation | null>(null)
const processingAction = ref(false)

const showConfirmationDialog = ref(false)
const confirmationAction = ref<'approve' | 'decline'>('approve')
const selectedReservationForAction = ref<Reservation | null>(null)

const notification = ref({
  show: false,
  message: '',
  success: false
})

const filteredReservations = computed(() => {
  let result = reservations.value

  if (filterLab.value) {
    result = result.filter(reservation => reservation.labno === filterLab.value)
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.trim().toLowerCase()
    result = result.filter(reservation => {
      if (String(reservation.idno).includes(query)) return true
      
      const fullName = `${reservation.firstname} ${reservation.middlename} ${reservation.lastname}`.toLowerCase()
      const nameCombinations = [
        `${reservation.firstname} ${reservation.lastname}`.toLowerCase(),
        `${reservation.lastname}, ${reservation.firstname}`.toLowerCase(),
        fullName,
        reservation.firstname.toLowerCase(),
        reservation.lastname.toLowerCase()
      ]
      
      return nameCombinations.some(name => name.includes(query))
    })
  }

  return result
})

const loadReservations = async () => {
  loadingReservations.value = true
  try {
    const data = await getReservations()
    reservations.value = data.filter((reservation: Reservation) => reservation.status == null)
  } catch (error) {
    console.error('Error loading reservations:', error)
    showNotification('Failed to load reservations', false)
  } finally {
    loadingReservations.value = false
  }
}

const getLabName = (labId: string) => {
  const lab = laboratories.value.find(l => l.id === labId)
  return lab ? lab.name : 'Unknown Lab'
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const formatDateToYMD = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

const viewDetails = (reservation: Reservation) => {
  selectedReservation.value = reservation
}

const confirmApprove = (reservation: Reservation) => {
  confirmationAction.value = 'approve'
  selectedReservationForAction.value = reservation
  showConfirmationDialog.value = true
}

const confirmDecline = (reservation: Reservation) => {
  confirmationAction.value = 'decline'
  selectedReservationForAction.value = reservation
  showConfirmationDialog.value = true
}

const executeAction = async () => {
  if (!selectedReservationForAction.value) return
  
  processingAction.value = true
  showConfirmationDialog.value = false
  
  const res = selectedReservationForAction.value
  try {
    if (confirmationAction.value === 'approve') {
      await apiApproveReservation(res.id)
      showNotification('Reservation approved', true)
      
      await updatePCAvailability(Number(res.pcno), Number(res.labno), 'unavailable')
      const origin =  'reservation'
      await addSitin(Number(res.id), Number(res.idno), formatDateToYMD(res.date), res.startTime, Number(res.pcno), res.purpose, Number(res.labno), origin)
      await addNotification('Reservation Accepted', `Reservation for LAB ${formatDate(res.labno)} PC ${res.pcno} on ${formatDate(res.date)} at ${res.startTime} was accepted by laboratory admin.`, res.idno)
    } else {
      await apiDeclineReservation(selectedReservationForAction.value.id)
      await addNotification('Reservation Declined', `Reservation for LAB ${res.labno} PC ${res.pcno} on ${formatDate(res.date)} at ${res.startTime} was declined by laboratory admin.`, res.idno)

      showNotification('Reservation declined', true)
    }

    await loadReservations()

    if (selectedReservation.value?.id === selectedReservationForAction.value?.id) {
      selectedReservation.value = null
    }
  } catch (error) {
    console.error(`Error ${confirmationAction.value}ing reservation:`, error)
    showNotification(`Failed to ${confirmationAction.value} reservation`, false)
  } finally {
    processingAction.value = false
    selectedReservationForAction.value = null
  }
}

const addSitin = async(id:number,idno: number, date: string, startTime: string, pcno: number, purpose: string, labno: number, origin: string) => {
  try{
    await addSitinFromReservation(id,idno, date, startTime, pcno, purpose, labno, origin)
  } catch (error) {
    console.error('Error adding sit-in:', error)
    showNotification('Failed to add sit-in', false)
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

onMounted(() => {
  loadReservations()
})
</script>

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

table {
  border-collapse: separate;
  border-spacing: 0;
}

th {
  position: sticky;
  top: 0;
  background-color: #374151;
}

tr:last-child td {
  border-bottom: none;
}
</style>