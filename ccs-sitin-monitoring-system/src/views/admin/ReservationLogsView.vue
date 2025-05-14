<template>
  <div class="flex flex-col items-center min-h-screen bg-gray-900 p-4">
    <div class="w-full max-w-6xl bg-gray-800 rounded-lg shadow-lg p-6">
      <h1 class="text-2xl font-bold text-center text-white mb-6">
        Reservation Logs
      </h1>

      <!-- Filter Controls -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <!-- Lab Filter -->
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

        <!-- Status Filter -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-300">Filter by Status</label>
          <select
            v-model="filterStatus"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="approved" class="bg-gray-800">Approved</option>
            <option value="declined" class="bg-gray-800">Declined</option>
          </select>
        </div>

        <!-- Date Range Filter -->
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

        <!-- Search -->
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

      <!-- Logs Table -->
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
                Status
              </th>
            </tr>
          </thead>
          <tbody class="bg-gray-800 divide-y divide-gray-700">
            <tr v-if="loadingLogs">
              <td colspan="6" class="px-6 py-4 text-center">
                <div class="flex justify-center items-center space-x-2">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span class="text-gray-400">Loading logs...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredLogs.length === 0">
              <td colspan="6" class="px-6 py-4 text-center text-gray-400">
                <span v-if="searchQuery || filterLab || filterStatus">No logs found matching your criteria</span>
                <span v-else>No logs found</span>
              </td>
            </tr>
            <tr
              v-for="log in filteredLogs"
              :key="log.id"
              class="hover:bg-gray-750 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-white">
                  {{ log.idno || 'N/A' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-white">
                  {{ log.firstname }} {{ log.middlename }} {{ log.lastname }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-white">
                  {{ formatDate(log.date) }} at {{ log.startTime }} <span v-if="log.startTime.length == 5 && Number(log.startTime[1]) >= 2">PM</span> <span v-else>AM</span>
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
                    'bg-red-900/30 text-red-300': log.status === 'declined'
                  }"
                >
                  {{ log.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
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

      <!-- Notification -->
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

interface ReservationLog {
  id: string
  idno: string
  firstname: string
  middlename: string
  lastname: string
  date: string
  labno: string
  pcno: string
  startTime: string
  status: string
}

// Laboratory data
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

// Filter controls
const filterLab = ref('')
const filterStatus = ref('')
const filterFromDate = ref('')
const filterToDate = ref('')
const searchQuery = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Data
const logs = ref<ReservationLog[]>([])
const loadingLogs = ref(false)

// Notification
const notification = ref({
  show: false,
  message: '',
  success: false
})

// Computed properties
const filteredLogs = computed(() => {
  let result = logs.value

  // Apply lab filter if selected
  if (filterLab.value) {
    result = result.filter(log => log.labno === filterLab.value)
  }

  // Apply status filter if selected
  if (filterStatus.value) {
    result = result.filter(log => log.status === filterStatus.value)
  }

  // Apply date range filter if selected
  if (filterFromDate.value) {
    const fromDate = new Date(filterFromDate.value)
    result = result.filter(log => new Date(log.date) >= fromDate)
  }

  if (filterToDate.value) {
    const toDate = new Date(filterToDate.value)
    toDate.setHours(23, 59, 59, 999) // Include entire end day
    result = result.filter(log => new Date(log.date) <= toDate)
  }

  // Apply search filter if query exists
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.trim().toLowerCase()
    result = result.filter(log => {
      // Check ID number
      if (String(log.idno).includes(query)) return true
      
      // Check name combinations
      const fullName = `${log.firstname} ${log.middlename} ${log.lastname}`.toLowerCase()
      const nameCombinations = [
        `${log.firstname} ${log.lastname}`.toLowerCase(),
        `${log.lastname}, ${log.firstname}`.toLowerCase(),
        fullName,
        log.firstname.toLowerCase(),
        log.lastname.toLowerCase()
      ]
      
      return nameCombinations.some(name => name.includes(query))
    })
  }

  return result
})

// Methods
const loadLogs = async () => {
  loadingLogs.value = true
  try {
    const data = (await getReservations()).reverse()
    logs.value = data
  } catch (error) {
    console.error('Error loading logs:', error)
    showNotification('Failed to load logs', false)
  } finally {
    loadingLogs.value = false
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

const formatDateTime = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
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

// Lifecycle hooks
onMounted(() => {
  loadLogs()
})
</script>

<style>
/* Custom scrollbar for dark mode */
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

/* Table styling */
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