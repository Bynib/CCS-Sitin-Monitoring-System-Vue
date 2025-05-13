<script setup lang="ts">
import { getFiles } from '@/../api/file'
import { onMounted, ref } from 'vue'

// Shadcn components
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface File {
  filename: string
  filedata: string
}

const files = ref<File[]>([])
const isLoading = ref(true)
const previewFile = ref<File | null>(null)
const isPreviewOpen = ref(false)

const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const binaryString = atob(base64)
  const len = binaryString.length
  const bytes = new Uint8Array(len)

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  return new Blob([bytes], { type: mimeType })
}

const downloadFile = (file: File) => {
  const base64String = file.filedata

  try {
    const blob = base64ToBlob(base64String, 'application/pdf')
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file.filename
    a.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error(error)
  }
}

const viewFile = (file: File) => {
  previewFile.value = file
  isPreviewOpen.value = true
}

const formatFileSize = (size: number): string => {
  if (size < 1024) {
    return `${size} bytes`
  } else if (size < 1048576) {
    return `${(size / 1024).toFixed(2)} KB`
  } else {
    return `${(size / 1048576).toFixed(2)} MB`
  }
}

const getFileIcon = (filename: string) => {
  if (filename.endsWith('.pdf')) return 'pi pi-file-pdf text-red-500'
  if (filename.endsWith('.docx')) return 'pi pi-file-word text-blue-500'
  if (filename.endsWith('.xlsx')) return 'pi pi-file-excel text-green-500'
  return 'pi pi-file text-gray-500'
}

const getFileMimeType = (filename: string): string => {
  if (filename.endsWith('.pdf')) return 'application/pdf'
  if (filename.endsWith('.docx')) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  if (filename.endsWith('.xlsx')) return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  return 'application/octet-stream'
}

onMounted(async () => {
  try {
    files.value = (await getFiles()).reverse()
  } catch (error) {
    console.error('Error fetching files:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="container mx-auto py-8">
    <Card>
      <CardHeader>
        <CardTitle class="text-2xl font-bold">
          Stored Files
        </CardTitle>
        <p class="text-sm text-muted-foreground">
          View and download files from the database
        </p>
      </CardHeader>

      <CardContent>
        <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton class="h-32 w-full" v-for="n in 6" :key="n" />
        </div>

        <div v-else-if="files.length === 0" class="flex flex-col items-center justify-center py-12">
          <p class="text-lg font-medium text-muted-foreground">
            No files found in database
          </p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card v-for="file in files" :key="file.filename" class="hover:shadow-lg transition-shadow">
            <CardHeader class="pb-2">
              <div class="flex items-center gap-3">
                <i :class="getFileIcon(file.filename)" class="text-2xl"></i>
                <h3 class="font-semibold truncate">{{ file.filename }}</h3>
              </div>
            </CardHeader>
            <CardContent class="pb-2">
              <p class="text-sm text-muted-foreground">
                {{ formatFileSize((file.filedata.length * 3) / 4) }}
              </p>
            </CardContent>
            <CardFooter class="flex gap-2 pt-0">
              <Button
                variant="outline"
                class="flex-1"
                @click="viewFile(file)"
              >
                <i class="pi pi-eye mr-2"></i>
                View
              </Button>
              <Button
                variant="outline"
                class="flex-1"
                @click="downloadFile(file)"
              >
                <i class="pi pi-download mr-2"></i>
                Download
              </Button>
            </CardFooter>
          </Card>
        </div>
      </CardContent>
    </Card>

    <!-- Preview Dialog -->
    <Dialog v-model:open="isPreviewOpen">
      <DialogContent class="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{{ previewFile?.filename }}</DialogTitle>
        </DialogHeader>
        
        <div class="overflow-auto h-full">
          <div v-if="previewFile?.filename.endsWith('.pdf')" class="w-full h-[70vh]">
            <embed 
              :src="`data:application/pdf;base64,${previewFile?.filedata}`" 
              type="application/pdf" 
              class="w-full h-full"
            />
          </div>
          
          <div v-else-if="previewFile?.filename.endsWith('.png') || previewFile?.filename.endsWith('.jpg') || previewFile?.filename.endsWith('.jpeg')" class="flex justify-center">
            <img 
              :src="`data:image/${previewFile?.filename.split('.').pop()};base64,${previewFile?.filedata}`" 
              class="max-h-[70vh] max-w-full object-contain"
            />
          </div>
          
          <div v-else class="flex flex-col items-center justify-center h-[70vh] text-muted-foreground">
            <i class="pi pi-exclamation-triangle text-4xl mb-4"></i>
            <p class="text-lg">Preview not available for this file type</p>
            <p class="text-sm">Please download the file to view its contents</p>
            <Button class="mt-4" @click="downloadFile(previewFile!)">
              <i class="pi pi-download mr-2"></i>
              Download File
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>