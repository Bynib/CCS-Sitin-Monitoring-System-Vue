<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div class="w-full max-w-6xl bg-gray-800 rounded-xl shadow-2xl p-8">
        <h1 class="text-3xl font-bold text-center text-white mb-8">
          PC Availability Management
        </h1>
  
        <div class="mb-8 space-y-2">
          <label class="block text-sm font-medium text-gray-300">Select Laboratory</label>
          <select 
            v-model="selectedLab" 
            class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
  
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p class="mt-4 text-gray-400">Loading PCs...</p>
        </div>
  
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="pc in pcs" 
            :key="pc.pcno"
            @click="toggleAvailability(pc)"
            class="p-5 border rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02]"
            :class="{
              'bg-gray-700 border-emerald-500/30 hover:bg-emerald-900/20': pc.status.toLowerCase() === 'available',
              'bg-gray-700 border-rose-500/30 hover:bg-rose-900/20': pc.status.toLowerCase() === 'unavailable',
              'ring-2 ring-blue-500': selectedPC === pc.pcno
            }"
          >
            <div class="flex items-center justify-between">
              <h3 class="font-medium text-lg text-white">PC {{ pc.pcno }}</h3>
              <span 
                class="px-3 py-1 text-xs rounded-full font-semibold"
                :class="{
                  'bg-emerald-900/50 text-emerald-300': pc.status.toLowerCase() === 'available',
                  'bg-rose-900/50 text-rose-300': pc.status.toLowerCase() === 'unavailable'
                }"
              >
                {{ pc.status.toUpperCase() }}
              </span>
            </div>
          </div>
        </div>
  
        <button 
          v-if="selectedPC"
          @click="updateAvailability"
          class="w-full mt-8 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors disabled:opacity-50"
          :disabled="updating"
        >
          <span v-if="!updating" class="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
            </svg>
            Update Selected PC
          </span>
          <span v-else class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Updating...
          </span>
        </button>
  
        <transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="transform opacity-0 translate-y-2"
          enter-to-class="transform opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="transform opacity-100 translate-y-0"
          leave-to-class="transform opacity-0 translate-y-2"
        >
          <div 
            v-if="notification.show" 
            class="mt-6 p-4 rounded-lg border"
            :class="{
              'bg-emerald-900/30 border-emerald-700 text-emerald-300': notification.success,
              'bg-rose-900/30 border-rose-700 text-rose-300': !notification.success
            }"
          >
            <div class="flex items-center gap-3">
              <svg v-if="notification.success" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <span>{{ notification.message }}</span>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import { getPC, updatePCAvailability } from '@/../api/pc'
  
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
  
  interface PC {
    labno: string
    pcno: string
    status: string
  }
  
  const selectedLab = ref('517')
  const pcs = ref<PC[]>([])
  const loading = ref(false)
  const selectedPC = ref('')
  const selectedPCStatus = ref('')
  const updating = ref(false)
  const notification = ref({
    show: false,
    message: '',
    success: false
  })
  
  watch(selectedLab, async (newVal) => {
    if (!newVal) return
    
    loading.value = true
    try {
      const response = await getPC()
      console.log("response: ",response)
      pcs.value = response.filter((pc:PC) => pc.labno === selectedLab.value)
    } catch (error) {
      console.error('Error fetching PCs:', error)
      showNotification('Failed to fetch PCs', false)
    } finally {
      loading.value = false
    }
  })
  
  const toggleAvailability = (pc:PC) => {
    selectedPC.value = pc.pcno
    selectedPCStatus.value = pc.status
  }
  
  const updateAvailability = async () => {
    if (!selectedPC.value) return
    console.log(selectedPC.value, selectedPCStatus.value, selectedLab.value)
    updating.value = true
    try {
      const newStatus = selectedPCStatus.value.toLowerCase() === 'available' ? 'unavailable' : 'available'
      await updatePCAvailability(Number(selectedPC.value),Number(selectedLab.value), newStatus)
      
      const pcIndex = pcs.value.findIndex(pc => pc.pcno === selectedPC.value)
      if (pcIndex !== -1) {
        pcs.value[pcIndex].status = newStatus
      }
      
      showNotification('PC availability updated successfully!', true)
      selectedPC.value = ''
    } catch (error:any) {
      console.error('Error updating PC:', error)
      showNotification(error.message || 'Failed to update PC availability', false)
    } finally {
      updating.value = false
    }
  }
  
  
  const showNotification = (message:string, success:boolean) => {
    notification.value = {
      show: true,
      message,
      success
    }
    setTimeout(() => {
      notification.value.show = false
    }, 3000)
  }
  
  onMounted(async () => {
    try {
      const response = await getPC()
      pcs.value = response
      pcs.value = response.filter((pc:PC) => pc.labno === selectedLab.value)

    } catch (error) {
      console.error('Error fetching PCs:', error)
    }
  })
  </script>
  
  <style>
  html {
    scroll-behavior: smooth;
  }
  
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
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
  </style>