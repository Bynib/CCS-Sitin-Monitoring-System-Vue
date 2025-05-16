<script setup lang="ts">
import { updatePCAvailability } from '../../../api/pc'
import { getSitin, updateSitinTime } from '../../../api/sitin'
import { getStudent, updatePoint, updateSession } from '../../../api/student'
import { addNotification } from '../../../api/notification'
import { ref, onMounted, computed } from 'vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { CalendarClock } from 'lucide-vue-next'
import { Checkbox } from '@/components/ui/checkbox' // Add this import
import { Label } from '@/components/ui/label' // Add this import

const searchQuery = ref('')

interface Sitin {
  sitin_id: number
  idno: number
  firstname: string
  middlename: string
  lastname: string
  course: string
  yearlevel: number
  purpose: string
  laboratory: number
  date: string
  LoggedOut: string | null
  points: string
  pcno: number
}

const sitins = ref<Sitin[]>([])
const currentSitin = ref<Sitin | null>(null)
const logoutDialogOpen = ref(false)
const givePoints = ref(false)

onMounted(async () => {
  await fetchSitins()
  console.log(sitins.value)
})

const fetchSitins = async () => {
  const allSitins = await getSitin()
  sitins.value = allSitins
    .filter((sitin: Sitin) => sitin.LoggedOut === null)
    .sort((a: Sitin, b: Sitin) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

const prepareLogout = (sitin: Sitin) => {
  currentSitin.value = sitin
  givePoints.value = false // Reset checkbox when opening dialog
  logoutDialogOpen.value = true
}

const handleSitinLogout = async () => {
  // console.log(givePoints.value)
  if (!currentSitin.value) return

  try {
    if (givePoints.value) {
      await updatePoint(currentSitin.value.idno)
    }
    if (
      await getStudent(currentSitin.value.idno.toString()).then(
        (result) => result[0].points % 3 !== 0,
      )
    ) {
      await updateSession(currentSitin.value.idno)
      await updateSitinTime(currentSitin.value.sitin_id)
      await updatePCAvailability(
        Number(currentSitin.value.pcno),
        Number(currentSitin.value.laboratory),
        'available',
      )
      await fetchSitins()
    } else {
      await addNotification("Session Retained.", "Your session is retained because you've accumulated 3 points.", currentSitin.value.idno.toString())
      await updateSitinTime(currentSitin.value.sitin_id)
      await updatePCAvailability(
        Number(currentSitin.value.pcno),
        Number(currentSitin.value.laboratory),
        'available',
      )
      await fetchSitins()
    }
    logoutDialogOpen.value = false
  } catch (error) {
    console.error('Error during logout:', error)
  }
}

const filteredSitins = computed(() => {
  if (!searchQuery.value) return sitins.value

  const query = searchQuery.value.toLowerCase()
  return sitins.value.filter((sitin) => {
    return (
      sitin.idno.toString().includes(query) ||
      sitin.firstname.toLowerCase().includes(query) ||
      sitin.lastname.toLowerCase().includes(query) ||
      sitin.course.toLowerCase().includes(query) ||
      sitin.purpose.toLowerCase().includes(query) ||
      sitin.laboratory.toString().includes(query) ||
      sitin.pcno.toString().includes(query)
    )
  })
})

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
}
</script>

<template>
  <div class="container mx-auto py-8">
    <Card>
      <CardHeader>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle class="text-2xl font-bold">Current Sit-ins</CardTitle>
          <div class="w-full md:w-1/3">
            <Input v-model="searchQuery" placeholder="Search students..." class="w-full" />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea class="h-[calc(100vh-220px)] rounded-md border">
          <Table v-if="filteredSitins.length > 0">
            <TableHeader class="bg-muted/50">
              <TableRow>
                <TableHead>ID Number</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Lab</TableHead>
                <TableHead>PC</TableHead>
                <TableHead>Time In</TableHead>
                <TableHead class="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="sitin in filteredSitins"
                :key="sitin.sitin_id"
                class="hover:bg-muted/50"
              >
                <TableCell class="font-medium">
                  {{ sitin.idno }}
                </TableCell>
                <TableCell>
                  {{ sitin.lastname }}, {{ sitin.firstname }}
                  <span v-if="sitin.middlename">{{ sitin.middlename.charAt(0) + '.' }}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {{ sitin.course }}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {{ sitin.yearlevel }}
                  </Badge>
                </TableCell>
                <TableCell class="max-w-[200px] truncate">
                  {{ sitin.purpose }}
                </TableCell>
                <TableCell> Lab {{ sitin.laboratory }} </TableCell>
                <TableCell> PC {{ sitin.pcno }} </TableCell>
                <TableCell>
                  <div class="flex items-center gap-2">
                    <CalendarClock class="w-4 h-4 text-muted-foreground" />
                    <div class="flex flex-col">
                      <span class="text-sm">{{ formatDateTime(sitin.date).date }}</span>
                      <span class="text-xs text-muted-foreground">{{
                        formatDateTime(sitin.date).time
                      }}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell class="text-right">
                  <Button variant="destructive" size="sm" @click="prepareLogout(sitin)">
                    Logout
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div v-else class="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <p class="text-lg">No active sit-ins found</p>
            <p class="text-sm">Students will appear here when they sit in</p>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>

    <AlertDialog v-model:open="logoutDialogOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Student Logout</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to log out
            <span v-if="currentSitin" class="font-semibold">
              {{ currentSitin?.firstname }} {{ currentSitin?.lastname }} ({{
                currentSitin?.idno
              }}) </span
            >?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div class="flex items-center space-x-2 py-4">
          <Checkbox id="givePoints" v-model="givePoints" />
          <Label for="givePoints">Give point to student</Label>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction @click="handleSitinLogout"> Confirm Logout </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
