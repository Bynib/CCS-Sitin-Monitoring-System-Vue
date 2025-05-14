<script lang="ts" setup>
import { getFiles, addFile, removeFile } from '@/../api/file'
import { onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { FileText, FileUp, Trash2, Download } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const selectedFile = ref<File | null>(null)
const uploading = ref(false)
const uploadProgress = ref(0)
const MAX_FILE_SIZE = 45 * 1024 * 1024

interface FileDetails {
  id: number
  filename: string
  filedata: string
}

const files = ref<FileDetails[]>([])

const onFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement
  selectedFile.value = target.files?.[0] || null
}

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer)
  return btoa(String.fromCharCode(...bytes))
}

const handleFileUpload = async () => {
  if (!selectedFile.value) {
    toast.error('No file selected', {
      description: 'Please select a file to upload'
    })
    return
  }

  const file = selectedFile.value
  if (file.size > MAX_FILE_SIZE) {
    toast.error('File too large', {
      description: `Maximum file size is ${formatFileSize(MAX_FILE_SIZE)}`
    })
    return
  }

  const toastId = toast.loading('Uploading file...')
  
  try {
    uploading.value = true
    uploadProgress.value = 30
    
    const arrayBuffer = await file.arrayBuffer()
    uploadProgress.value = 70
    const base64String = arrayBufferToBase64(arrayBuffer)
    
    await addFile({
      filename: file.name,
      filedata: base64String,
    })

    files.value = (await getFiles()).reverse()
    uploadProgress.value = 100
    
    toast.success('Upload successful', {
      description: `${file.name} has been uploaded`,
      id: toastId
    })
    
    selectedFile.value = null
  } catch (error: any) {
    console.error(error)
    toast.error('Upload failed', {
      description: error?.response?.data?.sqlMessage?.includes('max_allowed_packet') 
        ? 'File too large for server' 
        : 'An error occurred while uploading',
      id: toastId
    })
  } finally {
    uploading.value = false
    setTimeout(() => uploadProgress.value = 0, 1000)
  }
}

const base64ToBlob = (base64: string): Blob => {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return new Blob([bytes], { type: 'application/octet-stream' })
}

const formatFileSize = (size: number): string => {
  if (size < 1024) return `${size} bytes`
  if (size < 1048576) return `${(size / 1024).toFixed(2)} KB`
  return `${(size / 1048576).toFixed(2)} MB`
}

const downloadFile = (file: FileDetails) => {
  try {
    const blob = base64ToBlob(file.filedata)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file.filename
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Download started', {
      description: `${file.filename} is being downloaded`
    })
  } catch (error) {
    toast.error('Download failed', {
      description: 'Could not download the file'
    })
  }
}

const deleteFile = async (id: number, filename: string) => {
  const toastId = toast.loading('Deleting file...')
  try {
    await removeFile(id)
    files.value = files.value.filter(f => f.id !== id)
    toast.success('File deleted', {
      description: `${filename} has been removed`,
      id: toastId
    })
  } catch (error) {
    toast.error('Deletion failed', {
      description: 'Could not delete the file',
      id: toastId
    })
  }
}

const getFileIcon = (filename: string) => {
  if (filename.endsWith('.pdf')) return 'text-red-500'
  if (filename.endsWith('.docx')) return 'text-blue-500'
  if (filename.endsWith('.xlsx')) return 'text-green-500'
  return 'text-gray-500'
}

onMounted(async () => {
  try {
    files.value = (await getFiles()).reverse()
  } catch (error) {
    toast.error('Error loading files', {
      description: 'Could not fetch file list'
    })
  }
})
</script>

<template>
  <div class="container mx-auto py-8">
    <Card class="mb-6">
      <CardHeader>
        <CardTitle class="text-2xl">File Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex flex-col sm:flex-row gap-4 items-center">
          <div class="grid w-full max-w-sm items-center gap-1.5">
            <Input 
              id="file-upload" 
              type="file" 
              @change="onFileSelected"
              class="cursor-pointer"
            />
            <p class="text-sm text-muted-foreground">Max file size: 45MB</p>
          </div>
          <Button 
            @click="handleFileUpload" 
            :disabled="!selectedFile || uploading"
            class="gap-2"
          >
            <FileUp class="w-4 h-4" />
            Upload
          </Button>
        </div>
        
        <Progress v-if="uploading" :model-value="uploadProgress" class="mt-4 h-2" />
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <div class="flex justify-between items-center">
          <CardTitle>Uploaded Files</CardTitle>
          <Badge variant="outline">{{ files.length }} files</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea class="h-[calc(100vh-320px)]">
          <div v-if="files.length === 0" class="flex flex-col items-center justify-center py-12">
            <Alert>
              <Info class="w-4 h-4" />
              <AlertTitle>No files yet...</AlertTitle>
              <AlertDescription>
                Upload your first file using the form above
              </AlertDescription>
            </Alert>
          </div>

          <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card v-for="file in files" :key="file.id" class="hover:shadow-lg transition-shadow">
              <CardHeader class="flex flex-row items-center gap-4 pb-2">
                <FileText :class="getFileIcon(file.filename)" class="w-6 h-6" />
                <div class="space-y-1">
                  <CardTitle class="text-lg line-clamp-1">{{ file.filename }}</CardTitle>
                  <p class="text-sm text-muted-foreground">
                    {{ formatFileSize((file.filedata.length * 3) / 4) }}
                  </p>
                </div>
              </CardHeader>
              <CardFooter class="flex justify-end gap-2">
                <Button variant="outline" size="sm" @click="downloadFile(file)">
                  <Download class="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="destructive" size="sm" @click="deleteFile(file.id, file.filename)">
                  <Trash2 class="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  </div>
</template>