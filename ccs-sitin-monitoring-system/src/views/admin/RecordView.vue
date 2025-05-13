<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getSitin } from '../../../api/sitin'
import { jsPDF } from 'jspdf'
import { autoTable } from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CalendarClock } from 'lucide-vue-next'

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
}

const filter = ref('')
const sitins = ref<Sitin[]>([])
const filterMode = ref<'laboratory' | 'purpose'>('laboratory')
const laboratories = ['All', '517', '524', '526', '528', '530', '542', '544']
const purposes = [
  'All',
  'C Programming',
  'Java Programming',
  'C# Programming',
  'Systems Integration and Architecture',
  'Embedded Systems & IoT',
  'Digital Logic & Design',
  'Computer Application',
  'Database',
  'Project Management',
  'Python Programming',
  'Mobile Application',
  'Web Design',
  'PHP Programming'
]

const filteredSitins = computed(() => {
  if (!sitins.value.length) return []
  
  if (filter.value === 'All' || !filter.value) {
    return sitins.value
  }

  return sitins.value.filter(sitin => {
    if (filterMode.value === 'laboratory') {
      return String(sitin.laboratory) === filter.value
    } else {
      return sitin.purpose === filter.value
    }
  })
})

const exportData = (format: 'pdf' | 'csv' | 'xlsx') => {
  if (!filteredSitins.value.length) {
    alert('No records to export')
    return
  }

  const data = filteredSitins.value.map(sitin => [
    sitin.idno,
    `${sitin.lastname}, ${sitin.firstname} ${sitin.middlename ? sitin.middlename.charAt(0) + '.' : ''}`,
    sitin.course,
    sitin.yearlevel,
    sitin.purpose,
    `Lab ${sitin.laboratory}`,
    new Date(sitin.date).toLocaleDateString(),
    new Date(sitin.LoggedOut).toLocaleDateString(),
  ])

  const headers = [
    'ID Number',
    'Name',
    'Course',
    'Year',
    'Purpose',
    'Lab',
    'Time In',
    'Time Out',
  ]

  const fileName = `sitin-records-${filterMode.value}-${filter.value}-${new Date().toLocaleDateString()}`

  switch (format) {
    case 'pdf':
      const doc = new jsPDF({
        orientation: 'portrait', // Changed to portrait
        unit: 'mm'
      })
      
      // Title section
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(16)
      doc.setTextColor(40, 40, 40)
      doc.text('UNIVERSITY OF CEBU - MAIN', 105, 15, { align: 'center' })
      doc.setFontSize(14)
      doc.text('COLLEGE OF COMPUTER STUDIES', 105, 22, { align: 'center' })
      doc.setFontSize(12)
      doc.text('COMPUTER LABORATORY SIT-IN MONITORING SYSTEM', 105, 29, { align: 'center' })
      
      // Report details
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`Report Type: ${filterMode.value === 'laboratory' ? 'Laboratory Records' : 'Purpose Records'}`, 15, 40)
      doc.text(`Filter: ${filter.value === 'All' ? 'All Records' : filter.value}`, 15, 46)
      doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 15, 52)
      doc.text(`Total Records: ${filteredSitins.value.length}`, 15, 58)
      
      // Table with adjusted column widths for portrait
      doc.setFontSize(8) // Smaller font size to fit portrait
      autoTable(doc, {
        startY: 65,
        head: [headers],
        body: data,
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        },
        styles: {
          cellPadding: 2, // Smaller padding
          fontSize: 8,   // Smaller font
          overflow: 'linebreak',
          lineWidth: 0.1 // Thinner lines
        },
        columnStyles: {
          0: { cellWidth: 15 }, // ID Number
          1: { cellWidth: 25 }, // Name
          2: { cellWidth: 20 }, // Course
          3: { cellWidth: 10 }, // Year
          4: { cellWidth: 25 }, // Purpose
          5: { cellWidth: 12 }, // Lab
          6: { cellWidth: 20 }, // Time In
          7: { cellWidth: 20 }  // Time Out
        },
        margin: { top: 65 },
        tableWidth: 'wrap' // Let the table determine its width
      })
      
      // Footer
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(100)
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width - 20,
          doc.internal.pageSize.height - 10,
          { align: 'right' }
        )
      }
      
      doc.save(`${fileName}.pdf`)
      break


    case 'csv':
      const csvContent = [headers, ...data].map(row => row.join(',')).join('\n')
      const csvBlob = new Blob([csvContent], { type: 'text/csv' })
      saveAs(csvBlob, `${fileName}.csv`)
      break

    case 'xlsx':
      const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data])
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Records')
      const xlsxBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      saveAs(
        new Blob([xlsxBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
        `${fileName}.xlsx`
      )
      break
  }
}
onMounted(async () => {
  sitins.value = (await getSitin()).filter((sitin:Sitin) => sitin.LoggedOut !== null).reverse()
})
</script>

<template>
  <div class="container mx-auto py-8">
    <Card>
      <CardHeader>
        <CardTitle class="text-2xl">Sit-in Records</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex flex-col gap-6">
          <!-- Filter Controls -->
          <div class="flex flex-col sm:flex-row items-center gap-4">
            <Tabs v-model="filterMode" class="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="laboratory">By Laboratory</TabsTrigger>
                <TabsTrigger value="purpose">By Purpose</TabsTrigger>
              </TabsList>
            </Tabs>

            <Select v-model="filter">
              <SelectTrigger class="w-full sm:w-[250px]">
                <SelectValue :placeholder="`Select ${filterMode}`" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem 
                  v-for="item in filterMode === 'laboratory' ? laboratories : purposes" 
                  :key="item" 
                  :value="item"
                >
                  {{ item }}
                </SelectItem>
              </SelectContent>
            </Select>

            <div class="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" @click="filter = ''">
                Clear
              </Button>
              <Button @click="exportData('pdf')" variant="secondary">
                PDF
              </Button>
              <Button @click="exportData('csv')" variant="secondary">
                CSV
              </Button>
              <Button @click="exportData('xlsx')" variant="secondary">
                Excel
              </Button>
            </div>
          </div>

          <!-- Records Table -->
          <ScrollArea class="h-[calc(100vh-220px)] rounded-md border">
            <Table v-if="filteredSitins.length">
              <TableHeader class="bg-muted/50">
                <TableRow>
                  <TableHead>ID Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Lab</TableHead>
                  <TableHead>Time In</TableHead>
                  <TableHead>Time Out</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="sitin in filteredSitins" :key="sitin.sitin_id">
                  <TableCell class="font-medium">{{ sitin.idno }}</TableCell>
                  <TableCell>
                    {{ sitin.lastname }}, {{ sitin.firstname }}
                    <span v-if="sitin.middlename" class="text-muted-foreground">
                      {{ sitin.middlename.charAt(0) + '.' }}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{{ sitin.course }}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{{ sitin.yearlevel }}</Badge>
                  </TableCell>
                  <TableCell class="max-w-[200px] truncate">{{ sitin.purpose }}</TableCell>
                  <TableCell>Lab {{ sitin.laboratory }}</TableCell>
                  <TableCell>
                    <div class="flex items-center gap-2">
                      <CalendarClock class="w-4 h-4 text-muted-foreground" />
                      <div class="flex flex-col">
                        <span class="text-sm">{{ new Date(sitin.date).toLocaleDateString() }}</span>
                        <span class="text-xs text-muted-foreground">
                          {{ new Date(sitin.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div class="flex items-center gap-2">
                      <CalendarClock class="w-4 h-4 text-muted-foreground" />
                      <div class="flex flex-col">
                        <span class="text-sm">{{ new Date(sitin.LoggedOut).toLocaleDateString() }}</span>
                        <span class="text-xs text-muted-foreground">
                          {{ new Date(sitin.LoggedOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div v-else class="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <p class="text-lg">No records found</p>
              <p class="text-sm">Try adjusting your filters</p>
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  </div>
</template>