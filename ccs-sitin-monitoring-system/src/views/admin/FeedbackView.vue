<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getSitin } from '../../../api/sitin'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Info } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const sitins = ref<Sitin[]>([])
const expandedFeedback = ref<Record<number, boolean>>({})

const foulWords = [
  'piste',
  'pisti',
  'bwesit',
  'yawa',
  'fuck',
  'shit',
  'ass',
  'asshole',
  'assh0le',
  'bullshit',
  'shet',
]

interface Sitin {
  sitin_id: number
  idno: number
  firstname: string
  middlename: string
  lastname: string
  course: string
  yearlevel: number
  purpose: string
  laboratory: string
  date: string
  LoggedOut: string
  feedback: string
}

const checkFoulWords = (feedback: string) => {
  if (!feedback) return false
  return foulWords.some((word) => feedback.toLowerCase().includes(word))
}

const toggleFeedback = (id: number) => {
  expandedFeedback.value = {
    ...expandedFeedback.value,
    [id]: !expandedFeedback.value[id],
  }
}

onMounted(async () => {
  sitins.value = (await getSitin())
    .filter((s: Sitin) => s.LoggedOut !== null && s.feedback !== null)
    .reverse()
})
</script>

<template>
  <div class="container mx-auto py-8">
    <Card>
      <CardHeader>
        <CardTitle class="text-2xl flex items-center gap-2">
          <span>Student Feedbacks</span>
          <Badge variant="secondary">{{ sitins.length }} records</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert v-if="!sitins.length" class="mb-6">
          <Info class="w-4 h-4" />
          <AlertTitle>No feedback records found</AlertTitle>
          <AlertDescription> There are currently no feedbacks to display. </AlertDescription>
        </Alert>

        <ScrollArea v-else class="h-[calc(100vh-220px)] rounded-md border">
          <Table>
            <TableHeader class="bg-muted/50 sticky top-0">
              <TableRow>
                <TableHead class="w-[120px]">ID Number</TableHead>
                <TableHead class="w-[180px]">Name</TableHead>
                <TableHead class="w-[120px]">Course</TableHead>
                <TableHead class="w-[80px]">Year</TableHead>
                <TableHead class="w-[150px]">Purpose</TableHead>
                <TableHead class="w-[80px]">Lab</TableHead>
                <TableHead class="w-[160px]">Time In</TableHead>
                <TableHead class="w-[160px]">Time Out</TableHead>
                <TableHead class="min-w-[250px] max-w-[400px]">Feedback</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="sitin in sitins" :key="sitin.sitin_id">
                <TableCell class="font-medium">
                  {{ sitin.idno }}
                </TableCell>
                <TableCell>
                  <div class="line-clamp-1">
                    {{ sitin.lastname }}, {{ sitin.firstname }}
                    <span v-if="sitin.middlename" class="text-muted-foreground">
                      {{ sitin.middlename.charAt(0) }}.
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" class="truncate max-w-full">
                    {{ sitin.course }}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{{ sitin.yearlevel }}</Badge>
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <div class="line-clamp-1">
                        {{ sitin.purpose }}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {{ sitin.purpose }}
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell> Lab {{ sitin.laboratory }} </TableCell>
                <TableCell class="whitespace-nowrap">
                  {{ new Date(sitin.date).toLocaleString() }}
                </TableCell>
                <TableCell class="whitespace-nowrap">
                  {{ new Date(sitin.LoggedOut).toLocaleString() }}
                </TableCell>
                <TableCell>
                  <div
                    :class="[
                      'p-2 rounded transition-all relative',
                      checkFoulWords(sitin.feedback)
                        ? 'bg-destructive/10 border border-destructive/20'
                        : 'bg-primary/10 border border-primary/20',
                      expandedFeedback[sitin.sitin_id] ? 'max-h-full' : 'max-h-20 overflow-hidden',
                    ]"
                  >
                    <div class="whitespace-pre-wrap break-words pb-6">
                      <!-- Added pb-6 for button space -->
                      {{ sitin.feedback }}
                    </div>
                    <div
                      v-if="checkFoulWords(sitin.feedback)"
                      class="text-xs text-destructive font-medium mt-1 flex items-center gap-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      Contains inappropriate language
                    </div>
                    <Button
                      v-if="sitin.feedback.length > 150"
                      variant="ghost"
                      size="sm"
                      class="w-full h-6 text-xs absolute bottom-0 left-0 right-0"
                      @click="toggleFeedback(sitin.sitin_id)"
                    >
                      {{ expandedFeedback[sitin.sitin_id] ? 'Show less' : 'Show more' }}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  </div>
</template>
