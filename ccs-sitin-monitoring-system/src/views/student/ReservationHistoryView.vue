<template>
  <div class="flex flex-col items-center min-h-screen bg-gray-900 p-4">
    <div class="w-full max-w-6xl bg-gray-800 rounded-lg shadow-lg p-6">
      <h1 class="text-2xl font-bold text-center text-white mb-6">
        My Reservation History
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-300">Filter by Status</label>
          <select
            v-model="filterStatus"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="approved" class="bg-gray-800">Approved</option>
            <option value="declined" class="bg-gray-800">Declined</option>
            <option value="pending" class="bg-gray-800">Pending</option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-300">From Date</label>
          <input
            type="date"
            v-model="filterFromDate"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-300">To Date</label>
          <input
            type="date"
            v-model="filterToDate"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-300">Search PC Number</label>
          <input
            type="text"
            v-model="searchPcNumber"
            placeholder="PC number..."
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div class="overflow-x-auto rounded-lg border border-gray-700">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-gray-750">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Date & Time
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Lab & PC
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody class="bg-gray-800 divide-y divide-gray-700">
            <tr v-if="loadingLogs">
              <td colspan="4" class="px-6 py-4 text-center">
                <div class="flex justify-center items-center space-x-2">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span class="text-gray-400">Loading your reservations...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredLogs.length === 0">
              <td colspan="4" class="px-6 py-4 text-center text-gray-400">
                <span v-if="hasActiveFilters">No reservations found matching your criteria</span>
                <span v-else>You haven't made any reservations yet</span>
              </td>
            </tr>
            <tr
              v-for="log in paginatedLogs"
              :key="log.id"
              class="hover:bg-gray-750 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-white">
                  {{ formatDate(log.date) }} 
                  <span class="text-gray-400">at</span> 
                  {{ log.startTime }} 
                  <span v-if="log.startTime && Number(log.startTime.split(':')[0]) >= 12">PM</span>
                  <span v-else>AM</span>
                </div>
                <div v-if="log.endTime" class="text-xs text-gray-400">
                  Until {{ log.endTime }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-white">
                  {{ getLabName(log.labno) }}
                </div>
                <div class="text-sm text-gray-400">PC {{ log.pcno }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 py-1 text-xs rounded-full"
                  :class="{
                    'bg-green-900/30 text-green-300': log.status === 'approved',
                    'bg-red-900/30 text-red-300': log.status === 'declined',
                    'bg-yellow-900/30 text-yellow-300': log.status === null
                  }"
                >
                  {{ log.status === null ? 'Pending' : log.status }}
                </span>
                <div v-if="log.status === 'declined' && log.adminComment" class="text-xs text-gray-400 mt-1">
                  Reason: {{ log.adminComment }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between mt-4">
        <div class="text-sm text-gray-400">
          Showing <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to 
          <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredLogs.length) }}</span> of 
          <span class="font-medium">{{ filteredLogs.length }}</span> results
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
            @click="currentPage = Math.min(Math.ceil(filteredLogs.length / itemsPerPage), currentPage + 1)"
            :disabled="currentPage * itemsPerPage >= filteredLogs.length"
            class="px-3 py-1 rounded-md bg-gray-700 text-gray-300 disabled:opacity-50"
          >
            Next
          </button>
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
import { getReservations } from '@/../api/reservation'
import { useStudentStore } from '@/stores/student.store'

interface ReservationLog {
  id: string
  idno: string
  date: string
  labno: string
  pcno: string
  startTime: string
  endTime: string
  status: string
  adminComment?: string
  createdAt: string
}

const studentStore = useStudentStore()

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

const filterStatus = ref('')
const filterFromDate = ref('')
const filterToDate = ref('')
const searchPcNumber = ref('')

const currentPage = ref(1)
const itemsPerPage = ref(10)

const logs = ref<ReservationLog[]>([])
const loadingLogs = ref(false)
const processingCancellation = ref<string | null>(null)

const notification = ref({
  show: false,
  message: '',
  success: false
})

const filteredLogs = computed(() => {
  let result = logs.value

  result = result.filter(log => log.idno === studentStore.student.idNo)

  if (filterStatus.value) {
    result = result.filter(log => log.status === filterStatus.value)
  }

  if (filterFromDate.value) {
    const fromDate = new Date(filterFromDate.value)
    result = result.filter(log => new Date(log.date) >= fromDate)
  }

  if (filterToDate.value) {
    const toDate = new Date(filterToDate.value)
    toDate.setHours(23, 59, 59, 999) // Include entire end day
    result = result.filter(log => new Date(log.date) <= toDate)
  }

  if (searchPcNumber.value.trim()) {
    const query = searchPcNumber.value.trim().toLowerCase()
    result = result.filter(log => String(log.pcno).toLowerCase().includes(query))
  }

  return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredLogs.value.slice(start, start + itemsPerPage.value)
})

const hasActiveFilters = computed(() => {
  return filterStatus.value || filterFromDate.value || filterToDate.value || searchPcNumber.value.trim()
})

const loadLogs = async () => {
  loadingLogs.value = true
  try {
    const data = (await getReservations()).filter((log:any) => log.idno === studentStore.student.idNo).reverse()
    logs.value = data
  } catch (error) {
    console.error('Error loading reservations:', error)
    showNotification('Failed to load your reservations', false)
  } finally {
    loadingLogs.value = false
  }
}

const getLabName = (labId: string) => {
  const lab = laboratories.value.find(l => l.id === labId)
  return lab ? lab.name : 'Unknown Lab'
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const canCancel = (log: ReservationLog) => {
  const reservationDate = new Date(log.date)
  const now = new Date()
  
  return (log.status === 'pending' || log.status === 'approved') && reservationDate > now
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
  loadLogs()
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