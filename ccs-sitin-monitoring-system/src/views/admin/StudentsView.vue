<script setup lang="ts">
import { getStudents } from '@/../api/student'
import { ref, onMounted, computed } from 'vue'
import { updateAll } from '@/../api/student'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import SitinStudentModalView from '@/components/SitinStudentModalView.vue'

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
const isResetDialogOpen = ref(false)
const searchQuery = ref('')
const selectedStudent = ref<Student | null>(null)
const showSitinModal = ref(false)

onMounted(async () => {
  await fetchStudents()
})

const fetchStudents = async () => {
  students.value = (await getStudents()).sort((s: Student, t: Student) => 
    s.lastname.localeCompare(t.lastname))
}

const resetSessions = async () => {
  await updateAll()
  await fetchStudents()
  isResetDialogOpen.value = false
}

const getInitials = (student: Student) => {
  return `${student.firstname.charAt(0)}${student.lastname.charAt(0)}`
}

const filteredStudents = computed(() => {
  if (!searchQuery.value.trim()) {
    return [...students.value]
  }
  
  const query = searchQuery.value.trim().toLowerCase()
  return students.value.filter(student => {
    if (String(student.idno).includes(query)) return true
    const fullName = `${student.firstname} ${student.middlename} ${student.lastname}`.toLowerCase()
    const nameCombinations = [
      `${student.firstname} ${student.lastname}`.toLowerCase(),
      `${student.lastname}, ${student.firstname}`.toLowerCase(),
      fullName,
      student.firstname.toLowerCase(),
      student.lastname.toLowerCase()
    ]
    
    return nameCombinations.some(name => name.includes(query))
  })
})

const openSitinModal = (student: Student) => {
  selectedStudent.value = student
  showSitinModal.value = true
}
</script>

<template>
  <div class="container mx-auto py-8">
    <Card class="border shadow-sm">
      <CardHeader>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle class="text-2xl font-bold">Student Management</CardTitle>
          <div class="flex flex-col sm:flex-row gap-3">
            <Input
              v-model="searchQuery"
              placeholder="Search by ID or name..."
              class="w-full md:w-64"
            />
            <Button 
              @click="isResetDialogOpen = true"
              variant="destructive"
              class="gap-2"
            >
              Reset All Sessions
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent class="pt-6">
        <div v-if="filteredStudents.length > 0">
          <ScrollArea class="h-[calc(100vh-220px)] rounded-md">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card
                v-for="student in filteredStudents"
                :key="student.idno"
                class="hover:shadow-md transition-shadow border hover:cursor-pointer"
                @click="openSitinModal(student)"
              >
                <CardContent class="p-6">
                  <div class="flex items-start gap-4">
                    <Avatar class="h-12 w-12 border">
                      <AvatarFallback class="font-medium">
                        {{ getInitials(student) }}
                      </AvatarFallback>
                    </Avatar>
                    <div class="space-y-1">
                      <h3 class="font-semibold">
                        {{ student.lastname }}, {{ student.firstname }}
                        <span v-if="student.middlename" class="text-muted-foreground">{{ student.middlename.charAt(0) + '.' }}</span>
                      </h3>
                      <p class="text-sm text-muted-foreground">{{ student.idno }}</p>
                      <p class="text-sm text-muted-foreground truncate max-w-[200px]">{{ student.email }}</p>
                    </div>
                  </div>

                  <Separator class="my-4" />

                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1">
                      <p class="text-sm text-muted-foreground">Course</p>
                      <Badge variant="outline" class="w-fit">
                        {{ student.course }}
                      </Badge>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm text-muted-foreground">Year Level</p>
                      <Badge variant="outline" class="w-fit">
                        {{ student.yearlevel }}
                      </Badge>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm text-muted-foreground">Sessions</p>
                      <Badge :variant="Number(student.sessions) > 0 ? 'default' : 'destructive'" class="w-fit">
                        {{ student.sessions }}
                      </Badge>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm text-muted-foreground">Points</p>
                      <Badge variant="default" class="w-fit">
                        {{ student.points }}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </div>
        
        <div v-else class="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <p class="text-lg">No students found</p>
          <p class="text-sm" v-if="searchQuery">No matches for "{{ searchQuery }}"</p>
          <p class="text-sm" v-else>Students will appear here once registered in the system</p>
        </div>
      </CardContent>
    </Card>

    <AlertDialog v-model:open="isResetDialogOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Session Reset</AlertDialogTitle>
          <AlertDialogDescription>
            This will reset all student sessions. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction @click="resetSessions" class="bg-destructive text-white">
            Confirm Reset
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <SitinStudentModalView
      v-if="showSitinModal && selectedStudent"
      :student="selectedStudent"
      @close="showSitinModal = false"
      @sitin-success="fetchStudents"
    />
  </div>
</template>