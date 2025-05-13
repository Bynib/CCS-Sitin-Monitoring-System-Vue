<script setup lang="ts">
import { getAnnouncements } from '@/../api/announcement'
import { getStudents } from '../../../api/student'
import { onMounted, ref } from 'vue'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Trophy, Award } from 'lucide-vue-next'

interface Announcement {
  announcement_id: number
  announcement_title: string
  announcement_content: string
  announcement_date: string
}

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

const students = ref<Student[]>([])
const announcements = ref<Announcement[]>([])

onMounted(async () => {
  try {
    announcements.value = (await getAnnouncements()).sort((a: Announcement, b: Announcement) => 
      new Date(b.announcement_date).getTime() - new Date(a.announcement_date).getTime()
    )
    students.value = (await getStudents())
      .sort((s: Student, t: Student) => Number(t.points) - Number(s.points))
      .splice(0, 3)
      .filter((student: Student) => Number(student.points) > 0)
  } catch (error) {
    console.error("Error fetching data:", error)
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
    <div class="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Leaderboard Section -->
      <Card class="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-yellow-400">
            <Trophy class="w-6 h-6" />
            <span>Leaderboard</span>
          </CardTitle>
          <CardDescription class="text-gray-400">
            Top performing students this week
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <ScrollArea class="h-[400px]">
            <div class="space-y-4">
              <div 
                v-for="(student, index) in students" 
                :key="student.idno" 
                class="p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
              >
                <div class="flex items-center justify-between gap-4">
                  <div class="flex items-center gap-4">
                    <Badge 
                      v-if="index === 0" 
                      variant="secondary" 
                      class="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    >
                      <Award class="w-4 h-4 mr-1" />
                      1st
                    </Badge>
                    <Badge 
                      v-else-if="index === 1" 
                      variant="secondary" 
                      class="bg-green-500/20 text-green-400 border-green-500/30"
                    >
                      <Award class="w-4 h-4 mr-1" />
                      2nd
                    </Badge>
                    <Badge 
                      v-else-if="index === 2" 
                      variant="secondary" 
                      class="bg-blue-500/20 text-blue-400 border-blue-500/30"
                    >
                      <Award class="w-4 h-4 mr-1" />
                      3rd
                    </Badge>
                    
                    <div>
                      <p class="font-medium">
                        {{ student.firstname }} {{ student.middlename }} {{ student.lastname }}
                      </p>
                      <p class="text-sm text-gray-400">
                        {{ student.course }} - Year {{ student.yearlevel }}
                      </p>
                    </div>
                  </div>
                  
                  <Badge class="bg-gray-700 text-yellow-400">
                    {{ student.points }} pts
                  </Badge>
                </div>
              </div>
              
              <div v-if="students.length === 0" class="text-center text-gray-400 py-8">
                No leaderboard data available
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <!-- Announcements Section -->
      <Card class="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <CalendarDays class="w-6 h-6 text-blue-400" />
            <span>Announcements</span>
          </CardTitle>
          <CardDescription class="text-gray-400">
            Latest updates and news
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <ScrollArea class="h-[80vh]">
            <div class="space-y-4">
              <div 
                v-for="announcement in announcements" 
                :key="announcement.announcement_id" 
                class="p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
              >
                <div class="flex justify-between items-start">
                  <h3 class="text-lg font-bold text-yellow-400">
                    {{ announcement.announcement_title }}
                  </h3>
                  <span class="text-xs text-gray-400">
                    {{ new Date(announcement.announcement_date).toLocaleDateString() }}
                  </span>
                </div>
                <p class="mt-2 text-gray-300">
                  {{ announcement.announcement_content }}
                </p>
              </div>
              
              <div v-if="announcements.length === 0" class="text-center text-gray-400 py-8">
                No announcements available
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  </div>
</template>