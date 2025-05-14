<script setup lang="ts">
import { getLabSchedule } from '@/../api/lab_schedule'
import { ref, onBeforeMount } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface LabSchedule {
  id: number
  lab_number: string
  days: string
  time: string
  status: string
}

const labSchedules = ref<LabSchedule[]>([])
const selectedLab = ref('')
const isLoading = ref(false)

const timeSlots = [
  "7:30-8:00", "8:00-8:30", "8:30-9:00", "9:00-9:30", "9:30-10:00",
  "10:00-10:30", "10:30-11:00", "11:00-11:30", "11:30-12:00", "12:00-12:30",
  "12:30-13:00", "13:00-13:30", "13:30-14:00", "14:00-14:30", "14:30-15:00",
  "15:00-15:30", "15:30-16:00", "16:00-16:30", "16:30-17:00", "17:00-17:30",
  "17:30-18:00", "18:00-18:30", "18:30-19:00", "19:00-19:30", "19:30-20:00",
  "20:00-20:30", "20:30-21:00"
]

const schedule = ref<Record<string, Record<string, string>>>({})

const toggleLab = async (lab: string) => {
  try {
    isLoading.value = true
    selectedLab.value = lab
    labSchedules.value = await getLabSchedule(lab)

    timeSlots.forEach(time => {
      schedule.value[time] = {
        monWed: labSchedules.value.find(s => s.time === time && s.days === 'monWed')?.status || 'Closed',
        tuesThurs: labSchedules.value.find(s => s.time === time && s.days === 'tuesThurs')?.status || 'Closed',
        fri: labSchedules.value.find(s => s.time === time && s.days === 'fri')?.status || 'Closed',
        sat: labSchedules.value.find(s => s.time === time && s.days === 'sat')?.status || 'Closed'
      }
    })
  } catch (error) {
    console.error('Failed to load schedule:', error)
  } finally {
    isLoading.value = false
  }
}

onBeforeMount(async () => {
  await toggleLab('517')
})
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <div class="container mx-auto px-4 py-8">
      <Card class="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle class="text-3xl font-bold text-center">
            Laboratory Schedule
          </CardTitle>
        </CardHeader>

        <CardContent>
          <!-- Lab Selection -->
          <Tabs v-model="selectedLab" class="w-full mb-6">
            <TabsList class="grid grid-cols-7 gap-2 h-auto bg-gray-800">
              <TabsTrigger 
                v-for="lab in ['517', '524', '526', '528', '530', '542', '544']"
                :key="lab"
                :value="lab"
                class="py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                @click="toggleLab(lab)"
              >
                Lab {{ lab }}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div v-if="selectedLab && !isLoading" class="border border-gray-700 rounded-lg overflow-hidden">
            <div class="overflow-auto" style="max-height: 70vh;">
              <table class="w-full">
                <thead class="bg-gray-800 sticky top-0">
                  <tr>
                    <th class="p-4 font-medium text-left">Time Slot</th>
                    <th class="p-4 font-medium">Mon/Wed</th>
                    <th class="p-4 font-medium">Tue/Thu</th>
                    <th class="p-4 font-medium">Friday</th>
                    <th class="p-4 font-medium">Saturday</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="time in timeSlots" 
                    :key="time" 
                    class="border-t border-gray-700 hover:bg-gray-800/50 transition-colors"
                  >
                    <td class="p-4 font-medium text-gray-300">{{ time }}</td>
                    <td 
                      v-for="day in ['monWed', 'tuesThurs', 'fri', 'sat']" 
                      :key="day" 
                      class="p-2 text-center"
                    >
                      <div
                        class="w-full py-2 px-1 rounded transition-all cursor-default"
                        :class="{
                          'text-green-600': schedule[time][day] === 'Open',
                          'text-red-600': schedule[time][day] === 'Closed'
                        }"
                      >
                        {{ schedule[time][day] }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div v-if="isLoading" class="flex flex-col items-center justify-center py-12 gap-4">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p class="text-gray-400">Loading lab schedule...</p>
          </div>

          <div v-if="!selectedLab && !isLoading" class="flex flex-col items-center justify-center py-12">
            <p class="text-xl text-gray-400">Please select a lab to view schedule</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>