<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { getSitin } from '../../../api/sitin'
import { useStudentStore } from '@/stores/student.store'
import FeedbackModalView from '@/components/FeedbackModalView.vue'

// Shadcn components
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

const studentStore = useStudentStore()
const openFeedbackDialog = ref(false)
const isLoading = ref(true)
const id = reactive({
  sitin_id: 0,
  laboratory: 0,
})

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
  LoggedOut: string
  feedback: string | null
}

const sitins = ref<Sitin[]>([])

onMounted(async () => {
  try {
    const data = await getSitin()
    sitins.value = data
      .filter(
        (sitin: Sitin) => 
          sitin.LoggedOut !== null && 
          sitin.idno === Number(studentStore.student.idNo))
      .reverse()
  } catch (error) {
    console.error('Error fetching sit-in data:', error)
  } finally {
    isLoading.value = false
  }
})

const handleButtonClick = (sitin_id: number, laboratory: number) => {
  id.sitin_id = sitin_id
  id.laboratory = laboratory
  openFeedbackDialog.value = true
}

const handleFeedbackSubmitted = () => {
  openFeedbackDialog.value = false
  // Refresh the data after submission
  const updatedSitin = sitins.value.find(s => s.sitin_id === id.sitin_id)
  if (updatedSitin) {
    updatedSitin.feedback = "Submitted" // Or update with actual feedback content
  }
}

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
}
</script>

<template>
  <div class="container mx-auto py-8">
    <Card>
      <CardHeader>
        <CardTitle class="text-2xl font-bold tracking-tight">
          Your Visit History
        </CardTitle>
        <p class="text-sm text-muted-foreground">
          View all your previous laboratory visits and provide feedback
        </p>
      </CardHeader>

      <CardContent>
        <div v-if="isLoading" class="space-y-4">
          <Skeleton class="h-12 w-full" />
          <Skeleton class="h-12 w-full" />
          <Skeleton class="h-12 w-full" />
        </div>

        <div v-else-if="sitins.length === 0" class="flex flex-col items-center justify-center py-12">
          <div class="text-center space-y-2">
            <p class="text-lg font-medium text-muted-foreground">
              No visit history found
            </p>
            <p class="text-sm text-muted-foreground">
              Your future laboratory visits will appear here
            </p>
          </div>
        </div>

        <div v-else class="rounded-md border">
          <Table>
            <TableHeader class="bg-secondary">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Course & Year</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Lab</TableHead>
                <TableHead>Time In</TableHead>
                <TableHead>Time Out</TableHead>
                <TableHead class="text-right">Feedback</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="sitin in sitins"
                :key="sitin.sitin_id"
                class="hover:bg-secondary/50 transition-colors"
              >
                <TableCell>
                  {{ formatDateTime(sitin.date).date }}
                </TableCell>
                <TableCell class="font-medium">
                  {{ sitin.firstname }} {{ sitin.lastname }}
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-2">
                    <span>{{ sitin.course }}</span>
                    <Badge variant="outline">Yr {{ sitin.yearlevel }}</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <span class="line-clamp-1 max-w-[200px]">
                    {{ sitin.purpose }}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    Lab {{ sitin.laboratory }}
                  </Badge>
                </TableCell>
                <TableCell>
                  {{ formatDateTime(sitin.date).time }}
                </TableCell>
                <TableCell>
                  {{ formatDateTime(sitin.LoggedOut).time }}
                </TableCell>
                <TableCell class="text-right">
                  <Button
                    :disabled="sitin.feedback !== null"
                    :variant="sitin.feedback === null ? 'default' : 'outline'"
                    size="sm"
                    @click="handleButtonClick(sitin.sitin_id, sitin.laboratory)"
                  >
                    {{ sitin.feedback !== null ? 'Submitted' : 'Provide Feedback' }}
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <FeedbackModalView
      v-if="openFeedbackDialog"
      :sitin_id="id.sitin_id"
      :open="openFeedbackDialog"
      @close="openFeedbackDialog = false"
      @submitted="handleFeedbackSubmitted"
    />
  </div>
</template>